from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException, Request, BackgroundTasks
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
import shutil
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']  
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'creative_clicks')]

# Create directories for uploads
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Create the main app
app = FastAPI(title="Creative Clicks API")

# Mount static files
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Stripe setup
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

# Models
class MediaItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    original_name: str
    file_type: str  # 'image' or 'video'
    file_path: str
    title: Optional[str] = None
    description: Optional[str] = None
    category: str = "portfolio"  # portfolio, workshop, team
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_featured: bool = False

class Workshop(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    price: float
    duration_days: int
    max_participants: int
    start_date: datetime
    end_date: datetime
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WorkshopRegistration(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    workshop_id: str
    participant_name: str
    participant_email: EmailStr
    phone: Optional[str] = None
    payment_session_id: Optional[str] = None
    payment_status: str = "pending"
    registration_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EventBooking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    client_email: EmailStr
    phone: str
    event_date: datetime
    event_type: str  # wedding, corporate, portrait, etc.
    services: List[str]  # photography, videography, framing
    estimated_hours: int
    special_requests: Optional[str] = None
    booking_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "pending"  # pending, confirmed, completed, cancelled

class PaymentTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    payment_id: Optional[str] = None
    amount: float
    currency: str = "usd"
    payment_type: str  # workshop, booking_deposit
    reference_id: str  # workshop_id or booking_id
    payment_status: str = "pending"
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Input models
class MediaUpload(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: str = "portfolio"

class WorkshopCreate(BaseModel):
    title: str
    description: str
    price: float
    duration_days: int
    max_participants: int
    start_date: datetime
    end_date: datetime

class WorkshopRegistrationCreate(BaseModel):
    workshop_id: str
    participant_name: str
    participant_email: EmailStr
    phone: Optional[str] = None

class EventBookingCreate(BaseModel):
    client_name: str
    client_email: EmailStr
    phone: str
    event_date: datetime
    event_type: str
    services: List[str]
    estimated_hours: int
    special_requests: Optional[str] = None

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

# Helper function to send emails
async def send_email(to_email: str, subject: str, body: str):
    try:
        # For now, we'll just log the email content
        # In production, you'd integrate with SendGrid or similar
        logging.info(f"Email to {to_email}: {subject}")
        logging.info(f"Body: {body}")
        return True
    except Exception as e:
        logging.error(f"Failed to send email: {e}")
        return False

# Routes

@api_router.get("/")
async def root():
    return {"message": "Creative Clicks API", "status": "running"}

# Media Management
@api_router.post("/media/upload")
async def upload_media(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    category: str = Form("portfolio")
):
    # Validate file type
    if not file.content_type:
        raise HTTPException(status_code=400, detail="Unable to determine file type")
    
    if file.content_type.startswith('image/'):
        file_type = 'image'
    elif file.content_type.startswith('video/'):
        file_type = 'video'
    else:
        raise HTTPException(status_code=400, detail="Only image and video files are allowed")
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Create media record
    media_item = MediaItem(
        filename=unique_filename,
        original_name=file.filename,
        file_type=file_type,
        file_path=f"/uploads/{unique_filename}",
        title=title or file.filename,
        description=description,
        category=category
    )
    
    await db.media_items.insert_one(media_item.dict())
    return media_item

@api_router.get("/media", response_model=List[MediaItem])
async def get_media(category: Optional[str] = None):
    query = {}
    if category:
        query["category"] = category
    
    media_items = await db.media_items.find(query).sort("uploaded_at", -1).to_list(100)
    return [MediaItem(**item) for item in media_items]

@api_router.delete("/media/{media_id}")
async def delete_media(media_id: str):
    media_item = await db.media_items.find_one({"id": media_id})
    if not media_item:
        raise HTTPException(status_code=404, detail="Media item not found")
    
    # Delete file
    file_path = UPLOAD_DIR / media_item["filename"]
    if file_path.exists():
        file_path.unlink()
    
    # Delete record
    await db.media_items.delete_one({"id": media_id})
    return {"message": "Media item deleted successfully"}

# Workshop Management
@api_router.post("/workshops", response_model=Workshop)
async def create_workshop(workshop: WorkshopCreate):
    workshop_obj = Workshop(**workshop.dict())
    await db.workshops.insert_one(workshop_obj.dict())
    return workshop_obj

@api_router.get("/workshops", response_model=List[Workshop])
async def get_workshops(active_only: bool = True):
    query = {"is_active": True} if active_only else {}
    workshops = await db.workshops.find(query).sort("start_date", 1).to_list(100)
    return [Workshop(**workshop) for workshop in workshops]

@api_router.get("/workshops/{workshop_id}", response_model=Workshop)
async def get_workshop(workshop_id: str):
    workshop = await db.workshops.find_one({"id": workshop_id})
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    return Workshop(**workshop)

# Workshop Registration & Payment
@api_router.post("/workshops/{workshop_id}/register")
async def register_workshop(workshop_id: str, registration: WorkshopRegistrationCreate, request: Request):
    # Get workshop details
    workshop = await db.workshops.find_one({"id": workshop_id})
    if not workshop:
        raise HTTPException(status_code=404, detail="Workshop not found")
    
    workshop_obj = Workshop(**workshop)
    
    # Create registration record
    registration_obj = WorkshopRegistration(**registration.dict())
    await db.workshop_registrations.insert_one(registration_obj.dict())
    
    # Create Stripe checkout session
    host_url = str(request.base_url).rstrip('/')
    success_url = f"{host_url}/workshop-success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{host_url}/workshops"
    
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    
    checkout_request = CheckoutSessionRequest(
        amount=workshop_obj.price,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "type": "workshop_registration",
            "registration_id": registration_obj.id,
            "workshop_id": workshop_id,
            "participant_email": registration.participant_email
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    payment_transaction = PaymentTransaction(
        session_id=session.session_id,
        amount=workshop_obj.price,
        payment_type="workshop",
        reference_id=registration_obj.id,
        metadata=checkout_request.metadata
    )
    await db.payment_transactions.insert_one(payment_transaction.dict())
    
    # Update registration with session ID
    await db.workshop_registrations.update_one(
        {"id": registration_obj.id},
        {"$set": {"payment_session_id": session.session_id}}
    )
    
    return {"checkout_url": session.url, "session_id": session.session_id}

@api_router.get("/payments/{session_id}/status")
async def get_payment_status(session_id: str):
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
    status_response = await stripe_checkout.get_checkout_status(session_id)
    
    # Update payment transaction
    await db.payment_transactions.update_one(
        {"session_id": session_id},
        {
            "$set": {
                "payment_status": status_response.payment_status,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )
    
    # If paid, update registration
    if status_response.payment_status == "paid":
        await db.workshop_registrations.update_one(
            {"payment_session_id": session_id},
            {"$set": {"payment_status": "paid"}}
        )
    
    return status_response

# Event Booking
@api_router.post("/bookings", response_model=EventBooking)
async def create_booking(booking: EventBookingCreate):
    booking_obj = EventBooking(**booking.dict())
    await db.event_bookings.insert_one(booking_obj.dict())
    
    # Send notification email
    subject = f"New Event Booking - {booking.event_type}"
    body = f"""
    New event booking received:
    
    Client: {booking.client_name}
    Email: {booking.client_email}
    Phone: {booking.phone}
    Event Date: {booking.event_date}
    Event Type: {booking.event_type}
    Services: {', '.join(booking.services)}
    Estimated Hours: {booking.estimated_hours}
    Special Requests: {booking.special_requests or 'None'}
    """
    
    await send_email("creativeclicks108@gmail.com", subject, body)
    return booking_obj

@api_router.get("/bookings", response_model=List[EventBooking])
async def get_bookings():
    bookings = await db.event_bookings.find().sort("booking_date", -1).to_list(100)
    return [EventBooking(**booking) for booking in bookings]

# Contact Form
@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact(message: ContactMessageCreate):
    message_obj = ContactMessage(**message.dict())
    await db.contact_messages.insert_one(message_obj.dict())
    
    # Send notification email
    subject = f"Contact Form: {message.subject}"
    body = f"""
    New contact message received:
    
    Name: {message.name}
    Email: {message.email}
    Subject: {message.subject}
    
    Message:
    {message.message}
    """
    
    await send_email("creativeclicks108@gmail.com", subject, body)
    return message_obj

# Stripe Webhook
@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    webhook_request_body = await request.body()
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(
            webhook_request_body, 
            request.headers.get("Stripe-Signature")
        )
        
        if webhook_response.event_type == "checkout.session.completed":
            # Update payment status
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {
                    "$set": {
                        "payment_status": webhook_response.payment_status,
                        "updated_at": datetime.now(timezone.utc)
                    }
                }
            )
            
            # Update registration if workshop payment
            if webhook_response.payment_status == "paid":
                await db.workshop_registrations.update_one(
                    {"payment_session_id": webhook_response.session_id},
                    {"$set": {"payment_status": "paid"}}
                )
        
        return {"status": "processed"}
    except Exception as e:
        logging.error(f"Webhook error: {e}")
        raise HTTPException(status_code=400, detail="Webhook processing failed")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()