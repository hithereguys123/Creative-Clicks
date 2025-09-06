import React, { useState, useEffect } from 'react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component
const Navigation = ({ currentPage, setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Me' },
    { id: 'team', label: 'Meet the Team' },
    { id: 'portfolio', label: 'My Work' },
    { id: 'workshops', label: 'Workshops' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black bg-opacity-95 backdrop-blur-sm z-50 border-b border-white border-opacity-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iYmxhY2siLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiPgo8cGF0aCBkPSJNMjAgMzBoNDBjNSAwIDEwIDUgMTAgMTB2MjBjMCA1IC01IDEwIC0xMCAxMGgtNDBjLTUgMCAtMTAgLTUgLTEwIC0xMHYtMjBjMCAtNSA1IC0xMCAxMCAtMTB6IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iOCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik02MCAzMGwxNS0xNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjwvcGF0aD4KPC9zdmc+Cjwvc3ZnPgo=" 
              alt="Creative Clicks Logo" 
              className="h-8 w-8 mr-3"
            />
            <span className="text-white text-xl font-bold">Creative Clicks</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    currentPage === item.id
                      ? 'text-white border-b-2 border-white'
                      : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-white p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'text-white bg-gray-900'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Home Page Component
const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-70"></div>
        <img 
          src="https://images.unsplash.com/photo-1632808552429-a549568d3c1b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxwaG90b2dyYXBoeSUyMHdvcmtzaG9wfGVufDB8fHxibGFja19hbmRfd2hpdGV8MTc1NzE5MjM0Mnww&ixlib=rb-4.1.0&q=85"
          alt="Professional camera"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Capture Every
            <span className="block text-gray-300">Perfect Moment</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
            Professional event photography and videography services, plus workshops to teach the next generation of creative minds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-200 transition-colors duration-300">
              View Our Work
            </button>
            <button className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-black transition-all duration-300">
              Book a Session
            </button>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Event Photography</h3>
              <p className="text-gray-400 mb-4">Professional photography for weddings, corporate events, and special occasions.</p>
              <p className="text-xl font-bold">$30/hour</p>
            </div>
            
            <div className="text-center p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Videography</h3>
              <p className="text-gray-400 mb-4">Cinematic video production for events and promotional content.</p>
              <p className="text-xl font-bold">$40-45/hour</p>
            </div>
            
            <div className="text-center p-8 border border-gray-800 hover:border-gray-600 transition-all duration-300">
              <div className="mb-6">
                <svg className="w-16 h-16 mx-auto text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Workshops</h3>
              <p className="text-gray-400 mb-4">Learn photography from professionals through our online workshops.</p>
              <p className="text-xl font-bold">From $15</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// About Page Component
const AboutPage = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-8">About Creative Clicks</h1>
            <p className="text-xl mb-6 text-gray-300 leading-relaxed">
              We are passionate photographers and videographers dedicated to capturing life's most precious moments. 
              With years of experience in event photography and a commitment to nurturing the next generation of 
              creative talent, we bring both artistry and education to everything we do.
            </p>
            <p className="text-lg mb-6 text-gray-400 leading-relaxed">
              Our mission extends beyond just taking photos - we believe in sharing knowledge and inspiring young 
              minds to explore the world of photography through our hands-on workshops and mentoring programs.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-4 border border-gray-800">
                <h3 className="text-3xl font-bold mb-2">500+</h3>
                <p className="text-gray-400">Events Captured</p>
              </div>
              <div className="text-center p-4 border border-gray-800">
                <h3 className="text-3xl font-bold mb-2">200+</h3>
                <p className="text-gray-400">Students Taught</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <img 
              src="https://images.unsplash.com/photo-1527362127499-f590dfc9af95?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHByb2Zlc3Npb25hbHxlbnwwfHx8YmxhY2tfYW5kX3doaXRlfDE3NTcxOTIzNDh8MA&ixlib=rb-4.1.0&q=85"
              alt="Creative professional at work"
              className="w-full h-64 object-cover"
            />
            <img 
              src="https://images.pexels.com/photos/33714947/pexels-photo-33714947.jpeg"
              alt="Workshop session"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Team Page Component
const TeamPage = () => {
  const teamMembers = [
    {
      name: "Lead Photographer",
      role: "Founder & Creative Director",
      image: "https://images.unsplash.com/photo-1604585571671-f16dde09bb44?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwyfHxjcmVhdGl2ZSUyMHByb2Zlc3Npb25hbHxlbnwwfHx8YmxhY2tfYW5kX3doaXRlfDE3NTcxOTIzNDh8MA&ixlib=rb-4.1.0&q=85",
      bio: "With over 10 years of experience in event photography, specializing in capturing authentic moments and emotions."
    },
    {
      name: "Video Specialist",
      role: "Videographer & Editor",
      image: "https://images.unsplash.com/photo-1550099380-345fa00dd9ab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwzfHxwaG90b2dyYXBoeSUyMHdvcmtzaG9wfGVufDB8fHxibGFja19hbmRfd2hpdGV8MTc1NzE5MjM0Mnww&ixlib=rb-4.1.0&q=85",
      bio: "Expert in cinematic storytelling through video, bringing events to life with dynamic and engaging footage."
    },
    {
      name: "Workshop Coordinator",
      role: "Education & Training Lead",
      image: "https://images.unsplash.com/photo-1603330820005-24a9fb3fa247?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxjcmVhdGl2ZSUyMHByb2Zlc3Npb25hbHxlbnwwfHx8YmxhY2tfYW5kX3doaXRlfDE3NTcxOTIzNDh8MA&ixlib=rb-4.1.0&q=85",
      bio: "Passionate educator dedicated to nurturing the next generation of photographers through comprehensive workshops."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-16">Meet the Team</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center group">
              <div className="relative overflow-hidden mb-6">
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
              <p className="text-gray-400 mb-4 font-medium">{member.role}</p>
              <p className="text-gray-300 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Portfolio Component with Upload Functionality
const PortfolioPage = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('portfolio');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, [selectedCategory]);

  const fetchMedia = async () => {
    try {
      const response = await fetch(`${API}/media?category=${selectedCategory}`);
      const data = await response.json();
      setMediaItems(data);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    setIsUploading(true);
    
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', selectedCategory);
      formData.append('title', file.name);

      try {
        await fetch(`${API}/media/upload`, {
          method: 'POST',
          body: formData,
        });
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    
    setIsUploading(false);
    fetchMedia();
    event.target.value = '';
  };

  const openLightbox = (media) => {
    setSelectedMedia(media);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-16">Our Work</h1>
        
        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {['portfolio', 'workshop', 'team'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 text-lg font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-white text-black'
                    : 'bg-transparent border border-white text-white hover:bg-white hover:text-black'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-12 text-center">
          <label className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 cursor-pointer transition-colors duration-300">
            {isUploading ? 'Uploading...' : 'Upload Media'}
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="relative group cursor-pointer overflow-hidden"
              onClick={() => openLightbox(item)}
            >
              {item.file_type === 'image' ? (
                <img
                  src={`${BACKEND_URL}${item.file_path}`}
                  alt={item.title || item.original_name}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <video
                  src={`${BACKEND_URL}${item.file_path}`}
                  className="w-full h-64 object-cover"
                  muted
                >
                  <source src={`${BACKEND_URL}${item.file_path}`} />
                  Your browser does not support the video tag.
                </video>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">{item.title || item.original_name}</h3>
                  {item.description && <p className="text-sm text-gray-300">{item.description}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {mediaItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-400">No media items found in this category.</p>
            <p className="text-gray-500 mt-2">Upload some photos or videos to get started!</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={closeLightbox}>
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white text-2xl z-10 bg-black bg-opacity-50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-75"
            >
              ×
            </button>
            {selectedMedia.file_type === 'image' ? (
              <img
                src={`${BACKEND_URL}${selectedMedia.file_path}`}
                alt={selectedMedia.title || selectedMedia.original_name}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <video
                src={`${BACKEND_URL}${selectedMedia.file_path}`}
                controls
                className="max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <source src={`${BACKEND_URL}${selectedMedia.file_path}`} />
                Your browser does not support the video tag.
              </video>
            )}
            <div className="absolute bottom-4 left-4 right-4 text-white bg-black bg-opacity-50 p-4 rounded">
              <h3 className="text-lg font-semibold">{selectedMedia.title || selectedMedia.original_name}</h3>
              {selectedMedia.description && <p className="text-sm text-gray-300 mt-1">{selectedMedia.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Workshops Page Component
const WorkshopsPage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    participant_name: '',
    participant_email: '',
    phone: ''
  });

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await fetch(`${API}/workshops`);
      const data = await response.json();
      setWorkshops(data);
    } catch (error) {
      console.error('Error fetching workshops:', error);
    }
  };

  const handleRegistration = async (workshopId) => {
    try {
      const response = await fetch(`${API}/workshops/${workshopId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...registrationData,
          workshop_id: workshopId
        }),
      });
      
      const data = await response.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (error) {
      console.error('Error registering for workshop:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-16">Photography Workshops</h1>
        <p className="text-xl text-center text-gray-300 mb-12 max-w-3xl mx-auto">
          Learn from professionals through our comprehensive online workshops. Master the art of photography 
          with hands-on training and personalized guidance.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workshops.map((workshop) => (
            <div key={workshop.id} className="border border-gray-800 hover:border-gray-600 transition-all duration-300 overflow-hidden group">
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">{workshop.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">{workshop.description}</p>
                <div className="space-y-2 text-sm text-gray-300 mb-6">
                  <p><span className="font-semibold">Duration:</span> {workshop.duration_days} days</p>
                  <p><span className="font-semibold">Start Date:</span> {new Date(workshop.start_date).toLocaleDateString()}</p>
                  <p><span className="font-semibold">Max Participants:</span> {workshop.max_participants}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">${workshop.price}</span>
                  <button 
                    onClick={() => setSelectedWorkshop(workshop)}
                    className="bg-white text-black px-6 py-2 font-semibold hover:bg-gray-200 transition-colors duration-300"
                  >
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {workshops.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-400">No workshops available at the moment.</p>
            <p className="text-gray-500 mt-2">Check back soon for upcoming sessions!</p>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {selectedWorkshop && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 max-w-md w-full p-6 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Register for {selectedWorkshop.title}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleRegistration(selectedWorkshop.id);
            }}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                  value={registrationData.participant_name}
                  onChange={(e) => setRegistrationData({...registrationData, participant_name: e.target.value})}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                  value={registrationData.participant_email}
                  onChange={(e) => setRegistrationData({...registrationData, participant_email: e.target.value})}
                />
                <input
                  type="tel"
                  placeholder="Phone Number (Optional)"
                  className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                />
              </div>
              <div className="flex justify-between items-center mt-6">
                <span className="text-2xl font-bold">${selectedWorkshop.price}</span>
                <div className="space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedWorkshop(null)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-white text-black px-6 py-2 font-semibold hover:bg-gray-200 transition-colors duration-300"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Services Page Component
const ServicesPage = () => {
  const [bookingData, setBookingData] = useState({
    client_name: '',
    client_email: '',
    phone: '',
    event_date: '',
    event_type: '',
    services: [],
    estimated_hours: 1,
    special_requests: ''
  });

  const serviceOptions = [
    { id: 'photography', label: 'Photography ($30/hour)', price: 30 },
    { id: 'videography', label: 'Videography ($40-45/hour)', price: 42.5 },
    { id: 'framing', label: 'Photo Framing (+$5)', price: 5 }
  ];

  const eventTypes = [
    'Wedding', 'Corporate Event', 'Birthday Party', 'Graduation', 'Portrait Session', 'Other'
  ];

  const handleServiceChange = (serviceId) => {
    setBookingData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const calculateEstimate = () => {
    let total = 0;
    bookingData.services.forEach(serviceId => {
      const service = serviceOptions.find(s => s.id === serviceId);
      if (service) {
        if (service.id === 'framing') {
          total += service.price;
        } else {
          total += service.price * bookingData.estimated_hours;
        }
      }
    });
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          event_date: new Date(bookingData.event_date).toISOString()
        }),
      });
      
      if (response.ok) {
        alert('Booking request submitted successfully! We will contact you soon.');
        setBookingData({
          client_name: '',
          client_email: '',
          phone: '',
          event_date: '',
          event_type: '',
          services: [],
          estimated_hours: 1,
          special_requests: ''
        });
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Error submitting booking. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-16">Our Services</h1>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Services Info */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Professional Photography & Videography</h2>
            <div className="space-y-6">
              {serviceOptions.map((service) => (
                <div key={service.id} className="border border-gray-800 p-6 hover:border-gray-600 transition-colors">
                  <h3 className="text-xl font-semibold mb-2">{service.label}</h3>
                  <p className="text-gray-400">
                    {service.id === 'photography' && 'Professional event photography capturing all your special moments with artistic flair.'}
                    {service.id === 'videography' && 'Cinematic videography that tells your story through dynamic and engaging footage.'}
                    {service.id === 'framing' && 'Professional photo framing service to preserve your memories beautifully.'}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gray-900 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4">Why Choose Creative Clicks?</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Professional equipment and expertise</li>
                <li>• Quick turnaround times</li>
                <li>• Customized packages for your needs</li>
                <li>• Experienced in various event types</li>
                <li>• Competitive pricing with no hidden fees</li>
              </ul>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Book Our Services</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                  value={bookingData.client_name}
                  onChange={(e) => setBookingData({...bookingData, client_name: e.target.value})}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                  value={bookingData.client_email}
                  onChange={(e) => setBookingData({...bookingData, client_email: e.target.value})}
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                />
                <input
                  type="date"
                  required
                  className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                  value={bookingData.event_date}
                  onChange={(e) => setBookingData({...bookingData, event_date: e.target.value})}
                />
              </div>

              <select
                required
                className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                value={bookingData.event_type}
                onChange={(e) => setBookingData({...bookingData, event_type: e.target.value})}
              >
                <option value="">Select Event Type</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <div>
                <label className="block text-lg font-semibold mb-3">Services Needed:</label>
                <div className="space-y-2">
                  {serviceOptions.map((service) => (
                    <label key={service.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bookingData.services.includes(service.id)}
                        onChange={() => handleServiceChange(service.id)}
                        className="w-4 h-4"
                      />
                      <span>{service.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold mb-2">Estimated Hours:</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                  value={bookingData.estimated_hours}
                  onChange={(e) => setBookingData({...bookingData, estimated_hours: parseInt(e.target.value)})}
                />
              </div>

              <textarea
                placeholder="Special Requests or Additional Information"
                rows="4"
                className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                value={bookingData.special_requests}
                onChange={(e) => setBookingData({...bookingData, special_requests: e.target.value})}
              />

              {bookingData.services.length > 0 && (
                <div className="p-4 bg-gray-900 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2">Estimated Cost:</h3>
                  <p className="text-2xl font-bold">${calculateEstimate()}</p>
                  <p className="text-sm text-gray-400 mt-1">Final pricing may vary based on specific requirements</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-white text-black py-3 text-lg font-semibold hover:bg-gray-200 transition-colors duration-300"
              >
                Submit Booking Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Page Component
const ContactPage = () => {
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });
      
      if (response.ok) {
        alert('Message sent successfully! We will get back to you soon.');
        setContactData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-16">Contact Us</h1>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Ready to capture your special moments? Have questions about our workshops? 
              We'd love to hear from you and discuss how we can help bring your vision to life.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-lg">creativeclicks108@gmail.com</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">Available for events nationwide</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">Response within 24 hours</span>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Business Hours</h3>
              <div className="space-y-2 text-gray-300">
                <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                <p>Saturday - Sunday: 10:00 AM - 6:00 PM</p>
                <p className="text-sm text-gray-400">*Available for events outside business hours</p>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                  value={contactData.name}
                  onChange={(e) => setContactData({...contactData, name: e.target.value})}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                  value={contactData.email}
                  onChange={(e) => setContactData({...contactData, email: e.target.value})}
                />
              </div>
              
              <input
                type="text"
                placeholder="Subject"
                required
                className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                value={contactData.subject}
                onChange={(e) => setContactData({...contactData, subject: e.target.value})}
              />

              <textarea
                placeholder="Your Message"
                rows="6"
                required
                className="w-full p-3 bg-gray-800 text-white border border-gray-700 focus:border-white focus:outline-none"
                value={contactData.message}
                onChange={(e) => setContactData({...contactData, message: e.target.value})}
              />

              <button
                type="submit"
                className="w-full bg-white text-black py-3 text-lg font-semibold hover:bg-gray-200 transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'team':
        return <TeamPage />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'workshops':
        return <WorkshopsPage />;
      case 'services':
        return <ServicesPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="App">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;