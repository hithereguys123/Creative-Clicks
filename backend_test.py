#!/usr/bin/env python3
"""
Creative Clicks Photography Website Backend Tests
Tests all REST API endpoints and core functionality
"""

import requests
import json
import os
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path
import tempfile
from typing import Dict, Any
import uuid

# Get backend URL from frontend .env file
def get_backend_url():
    frontend_env_path = Path("/app/frontend/.env")
    if frontend_env_path.exists():
        with open(frontend_env_path, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    base_url = line.split('=', 1)[1].strip()
                    return f"{base_url}/api"
    return "https://creative-clicks.preview.emergentagent.com/api"

BASE_URL = get_backend_url()
print(f"Testing backend at: {BASE_URL}")

class CreativeClicksBackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.test_results = []
        self.workshop_id = None
        self.registration_id = None
        self.session_id = None
        self.media_id = None
        self.booking_id = None
        self.contact_id = None
        
    def log_test(self, test_name: str, success: bool, message: str, details: Dict[Any, Any] = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test GET /api/ health check endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                data = response.json()
                if "Creative Clicks API" in data.get("message", ""):
                    self.log_test("Health Check", True, "API is running and responding correctly", data)
                    return True
                else:
                    self.log_test("Health Check", False, "Unexpected response format", {"response": data})
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}", {"response": response.text})
        except Exception as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
        return False
    
    def test_create_sample_workshop(self):
        """Create a sample workshop for testing"""
        try:
            workshop_data = {
                "title": "3-Day Photography Masterclass",
                "description": "Comprehensive photography workshop covering composition, lighting, and post-processing techniques",
                "price": 15.0,
                "duration_days": 3,
                "max_participants": 20,
                "start_date": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
                "end_date": (datetime.now(timezone.utc) + timedelta(days=33)).isoformat()
            }
            
            response = self.session.post(f"{self.base_url}/workshops", json=workshop_data)
            if response.status_code == 200:
                data = response.json()
                self.workshop_id = data.get("id")
                self.log_test("Create Sample Workshop", True, f"Workshop created with ID: {self.workshop_id}", data)
                return True
            else:
                self.log_test("Create Sample Workshop", False, f"HTTP {response.status_code}", {"response": response.text})
        except Exception as e:
            self.log_test("Create Sample Workshop", False, f"Error: {str(e)}")
        return False
    
    def test_get_workshops(self):
        """Test GET /api/workshops endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/workshops")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    workshop_count = len(data)
                    # Check if our sample workshop exists
                    found_masterclass = any("Photography Masterclass" in w.get("title", "") for w in data)
                    if found_masterclass:
                        self.log_test("Get Workshops", True, f"Retrieved {workshop_count} workshops including Photography Masterclass", {"count": workshop_count})
                        return True
                    else:
                        self.log_test("Get Workshops", True, f"Retrieved {workshop_count} workshops (no masterclass found)", {"count": workshop_count})
                        return True
                else:
                    self.log_test("Get Workshops", False, "Response is not a list", {"response": data})
            else:
                self.log_test("Get Workshops", False, f"HTTP {response.status_code}", {"response": response.text})
        except Exception as e:
            self.log_test("Get Workshops", False, f"Error: {str(e)}")
        return False
    
    def test_workshop_registration(self):
        """Test POST /api/workshops/{id}/register endpoint"""
        if not self.workshop_id:
            self.log_test("Workshop Registration", False, "No workshop ID available for testing")
            return False
            
        try:
            registration_data = {
                "workshop_id": self.workshop_id,
                "participant_name": "Sarah Johnson",
                "participant_email": "sarah.johnson@example.com",
                "phone": "+1-555-0123"
            }
            
            response = self.session.post(f"{self.base_url}/workshops/{self.workshop_id}/register", json=registration_data)
            if response.status_code == 200:
                data = response.json()
                if "checkout_url" in data and "session_id" in data:
                    self.session_id = data.get("session_id")
                    self.log_test("Workshop Registration", True, f"Registration created with Stripe session: {self.session_id}", data)
                    return True
                else:
                    self.log_test("Workshop Registration", False, "Missing checkout_url or session_id in response", {"response": data})
            else:
                self.log_test("Workshop Registration", False, f"HTTP {response.status_code}", {"response": response.text})
        except Exception as e:
            self.log_test("Workshop Registration", False, f"Error: {str(e)}")
        return False
    
    def test_payment_status(self):
        """Test GET /api/payments/{session_id}/status endpoint"""
        if not self.session_id:
            self.log_test("Payment Status Check", False, "No session ID available for testing")
            return False
            
        try:
            response = self.session.get(f"{self.base_url}/payments/{self.session_id}/status")
            if response.status_code == 200:
                data = response.json()
                if "payment_status" in data:
                    status = data.get("payment_status")
                    self.log_test("Payment Status Check", True, f"Payment status retrieved: {status}", data)
                    return True
                else:
                    self.log_test("Payment Status Check", False, "Missing payment_status in response", {"response": data})
            else:
                self.log_test("Payment Status Check", False, f"HTTP {response.status_code}", {"response": response.text})
        except Exception as e:
            self.log_test("Payment Status Check", False, f"Error: {str(e)}")
        return False
    
    def test_event_booking_creation(self):
        """Test POST /api/bookings endpoint"""
        try:
            booking_data = {
                "client_name": "Michael Chen",
                "client_email": "michael.chen@example.com",
                "phone": "+1-555-0456",
                "event_date": (datetime.now(timezone.utc) + timedelta(days=45)).isoformat(),
                "event_type": "wedding",
                "services": ["photography", "videography"],
                "estimated_hours": 8,
                "special_requests": "Outdoor ceremony with golden hour portraits"
            }
            
            response = self.session.post(f"{self.base_url}/bookings", json=booking_data)
            if response.status_code == 200:
                data = response.json()
                if "id" in data:
                    self.booking_id = data.get("id")
                    self.log_test("Event Booking Creation", True, f"Booking created with ID: {self.booking_id}", data)
                    return True
                else:
                    self.log_test("Event Booking Creation", False, "Missing ID in response", {"response": data})
            else:
                self.log_test("Event Booking Creation", False, f"HTTP {response.status_code}", {"response": response.text})
        except Exception as e:
            self.log_test("Event Booking Creation", False, f"Error: {str(e)}")
        return False
    
    def test_get_bookings(self):
        """Test GET /api/bookings endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/bookings")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    booking_count = len(data)
                    self.log_test("Get Bookings", True, f"Retrieved {booking_count} bookings", {"count": booking_count})
                    return True
                else:
                    self.log_test("Get Bookings", False, "Response is not a list", {"response": data})
            else:
                self.log_test("Get Bookings", False, f"HTTP {response.status_code}", {"response": response.text})
        except Exception as e:
            self.log_test("Get Bookings", False, f"Error: {str(e)}")
        return False
    
    def test_contact_form_submission(self):
        """Test POST /api/contact endpoint"""
        try:
            contact_data = {
                "name": "Emma Rodriguez",
                "email": "emma.rodriguez@example.com",
                "subject": "Portfolio Session Inquiry",
                "message": "Hi! I'm interested in booking a professional headshot session for my LinkedIn profile. Could you please provide information about your portrait packages and availability?"
            }
            
            response = self.session.post(f"{self.base_url}/contact", json=contact_data)
            if response.status_code == 200:
                data = response.json()
                if "id" in data:
                    self.contact_id = data.get("id")
                    self.log_test("Contact Form Submission", True, f"Contact message submitted with ID: {self.contact_id}", data)
                    return True
                else:
                    self.log_test("Contact Form Submission", False, "Missing ID in response", {"response": data})
            else:
                self.log_test("Contact Form Submission", False, f"HTTP {response.status_code}", {"response": response.text})
        except Exception as e:
            self.log_test("Contact Form Submission", False, f"Error: {str(e)}")
        return False
    
    def test_media_upload(self):
        """Test POST /api/media/upload endpoint"""
        try:
            # Create a temporary test image file
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as temp_file:
                # Write minimal JPEG header to create a valid image file
                jpeg_header = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x11\x08\x00\x01\x00\x01\x01\x01\x11\x00\x02\x11\x01\x03\x11\x01\xff\xc4\x00\x14\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x08\xff\xc4\x00\x14\x10\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xda\x00\x0c\x03\x01\x00\x02\x11\x03\x11\x00\x3f\x00\xaa\xff\xd9'
                temp_file.write(jpeg_header)
                temp_file_path = temp_file.name
            
            # Upload the file
            with open(temp_file_path, 'rb') as f:
                files = {'file': ('test_portfolio.jpg', f, 'image/jpeg')}
                data = {
                    'title': 'Portfolio Sample',
                    'description': 'Test portfolio image upload',
                    'category': 'portfolio'
                }
                
                response = self.session.post(f"{self.base_url}/media/upload", files=files, data=data)
            
            # Clean up temp file
            os.unlink(temp_file_path)
            
            if response.status_code == 200:
                response_data = response.json()
                if "id" in response_data:
                    self.media_id = response_data.get("id")
                    self.log_test("Media Upload", True, f"Media uploaded with ID: {self.media_id}", response_data)
                    return True
                else:
                    self.log_test("Media Upload", False, "Missing ID in response", {"response": response_data})
            else:
                self.log_test("Media Upload", False, f"HTTP {response.status_code}", {"response": response.text})
        except Exception as e:
            self.log_test("Media Upload", False, f"Error: {str(e)}")
        return False
    
    def test_get_media(self):
        """Test GET /api/media endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/media")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    media_count = len(data)
                    self.log_test("Get Media", True, f"Retrieved {media_count} media items", {"count": media_count})
                    return True
                else:
                    self.log_test("Get Media", False, "Response is not a list", {"response": data})
            else:
                self.log_test("Get Media", False, f"HTTP {response.status_code}", {"response": response.text})
        except Exception as e:
            self.log_test("Get Media", False, f"Error: {str(e)}")
        return False
    
    def test_get_media_by_category(self):
        """Test GET /api/media with category filter"""
        try:
            response = self.session.get(f"{self.base_url}/media?category=portfolio")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    portfolio_count = len(data)
                    self.log_test("Get Media by Category", True, f"Retrieved {portfolio_count} portfolio items", {"count": portfolio_count})
                    return True
                else:
                    self.log_test("Get Media by Category", False, "Response is not a list", {"response": data})
            else:
                self.log_test("Get Media by Category", False, f"HTTP {response.status_code}", {"response": response.text})
        except Exception as e:
            self.log_test("Get Media by Category", False, f"Error: {str(e)}")
        return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 60)
        print("CREATIVE CLICKS BACKEND API TESTS")
        print("=" * 60)
        
        # Core API Tests
        self.test_health_check()
        
        # Workshop Management Tests
        self.test_create_sample_workshop()
        self.test_get_workshops()
        self.test_workshop_registration()
        self.test_payment_status()
        
        # Event Booking Tests
        self.test_event_booking_creation()
        self.test_get_bookings()
        
        # Contact Form Tests
        self.test_contact_form_submission()
        
        # Media Management Tests
        self.test_media_upload()
        self.test_get_media()
        self.test_get_media_by_category()
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\nFAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['message']}")
        
        return passed == total

def main():
    """Main test execution"""
    tester = CreativeClicksBackendTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! Backend is working correctly.")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Check the details above.")
        sys.exit(1)

if __name__ == "__main__":
    main()