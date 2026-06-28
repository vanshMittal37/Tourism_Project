import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Globe, Plane, Award, Shield, CheckCircle2, ChevronDown, MessageSquare, Phone, Mail, MapPin } from 'lucide-react';

export const LandingPage = ({ setView }) => {
  const { currentUser, submitEnquiry, logout } = useDatabase();
  const [enquiry, setEnquiry] = useState({ name: '', email: '', phone: '', message: '' });
  const [activeFaq, setActiveFaq] = useState(null);

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    if (!enquiry.name || !enquiry.email || !enquiry.phone || !enquiry.message) return;
    submitEnquiry(enquiry);
    setEnquiry({ name: '', email: '', phone: '', message: '' });
  };

  const faqs = [
    { q: "What is the typical processing time for a tourist visa?", a: "Processing times vary by destination. Typically, tourist visas take between 5 to 15 business days. Express options are available for select countries." },
    { q: "What documents are mandatory for a student visa?", a: "Generally, you will need a valid passport, official university admission offer letter, proof of financial sufficiency (like a blocked account or bank statement), passport photos, and academic transcripts." },
    { q: "Can I track my application status online?", a: "Yes! Once you apply through our portal, you will have access to a personal customer dashboard with live status tracking and timeline updates." },
    { q: "Is travel insurance mandatory for visa approvals?", a: "For many regions (like the Schengen Area), valid travel health insurance is mandatory. We offer holiday packages that include compliant travel insurance." }
  ];

  const services = [
    { title: "Tourist Visa", desc: "Leisure travel clearances for over 150+ countries with minimal documentation.", icon: Globe },
    { title: "Student Visa", desc: "Expert guidance for university admissions and long-term academic visas.", icon: Award },
    { title: "Work Visa", desc: "Corporate sponsorship processing and professional employment visas.", icon: Shield },
    { title: "Business Visa", desc: "Fast-track clearances for corporate meetings, conferences, and trade fairs.", icon: Plane },
    { title: "Holiday Packages", desc: "Customized international itineraries with hotels, flights, and sightseeing.", icon: Globe },
    { title: "Flight Booking", desc: "Affordable international and domestic flight deals with instant confirmations.", icon: Plane }
  ];

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Sticky Navbar */}
      <nav className="navbar">
        <a href="#" className="logo" onClick={() => setView('landing')}>
          <Plane size={28} style={{ transform: 'rotate(45deg)' }} />
          <span>VeloceTravel</span>
        </a>
        <ul className="nav-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#why-choose-us">Why Us</a></li>
          <li><a href="#faqs">FAQs</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nav-auth">
          {currentUser ? (
            <>
              <button 
                className="btn btn-outline" 
                onClick={() => {
                  if (currentUser.role === 'Admin') setView('admin-dashboard');
                  else if (currentUser.role === 'CRM Executive') setView('crm-dashboard');
                  else setView('customer-dashboard');
                }}
              >
                Go to Dashboard ({currentUser.role})
              </button>
              <button className="btn btn-danger" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => setView('login')}>Login</button>
              <button className="btn btn-primary" onClick={() => setView('register')}>Register</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>Your Trusted Visa & Travel Partner</h1>
          <p>
            Experience seamless international visa processing and bespoke holiday planning. 
            Our expert team takes the complexity out of travel documentations.
          </p>
          <div className="hero-ctas">
            <button 
              className="btn btn-primary" 
              onClick={() => {
                if (currentUser) {
                  if (currentUser.role === 'Admin') setView('admin-dashboard');
                  else if (currentUser.role === 'CRM Executive') setView('crm-dashboard');
                  else setView('customer-dashboard');
                } else {
                  setView('login');
                }
              }}
            >
              Apply Visa Now
            </button>
            <a href="#contact" className="btn btn-outline">Contact Us</a>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" style={{ padding: '80px 8%', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Our Services</h2>
          <p style={{ color: 'var(--text-medium)', maxWidth: '600px', margin: '0 auto' }}>
            We provide comprehensive travel solutions from global visa consultancies to custom tours.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {services.map((service, index) => {
            const IconComp = service.icon;
            return (
              <div key={index} className="glass-card glass-card-hover" style={{ padding: '30px', textAlign: 'left' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', marginBottom: '20px' }}>
                  <IconComp size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '20px' }}>{service.desc}</p>
                <button 
                  style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                  onClick={() => {
                    if (currentUser) {
                      setView(currentUser.role === 'Admin' ? 'admin-dashboard' : currentUser.role === 'CRM Executive' ? 'crm-dashboard' : 'customer-dashboard');
                    } else {
                      setView('login');
                    }
                  }}
                >
                  Learn More & Apply →
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" style={{ padding: '80px 8%', background: '#f8fafc' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', lineHeight: '1.2' }}>Why Global Travelers Choose Us</h2>
            <p style={{ color: 'var(--text-medium)', marginBottom: '30px', lineHeight: '1.6' }}>
              We combine cutting-edge technology with seasoned immigration expertise. 
              Our real-time document verification speeds up approvals and eliminates processing errors.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <CheckCircle2 color="var(--secondary-color)" size={20} />
                <span style={{ fontWeight: 500 }}>99.2% Visa Application Success Rate</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <CheckCircle2 color="var(--secondary-color)" size={20} />
                <span style={{ fontWeight: 500 }}>Direct Liaison with Embassies & Consulates</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <CheckCircle2 color="var(--secondary-color)" size={20} />
                <span style={{ fontWeight: 500 }}>End-to-End Encryption for Passport Safety</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
              <h4 style={{ color: 'var(--primary-color)', fontSize: '2rem', marginBottom: '5px' }}>15k+</h4>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '5px' }}>Visas Approved</p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Successfully processed for global destinations.</p>
            </div>
            <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
              <h4 style={{ color: 'var(--secondary-color)', fontSize: '2rem', marginBottom: '5px' }}>10+</h4>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '5px' }}>Years Experience</p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Decades of navigation in compliance rules.</p>
            </div>
            <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
              <h4 style={{ color: '#ec4899', fontSize: '2rem', marginBottom: '5px' }}>24/7</h4>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '5px' }}>Direct Support</p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Continuous assistance at every step of travel.</p>
            </div>
            <div className="glass-card" style={{ padding: '24px', background: 'white' }}>
              <h4 style={{ color: '#eab308', fontSize: '2rem', marginBottom: '5px' }}>99%</h4>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '5px' }}>Satisfaction</p>
              <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Stellar feedback from corporate & families.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section style={{ padding: '80px 8%', background: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>What Our Clients Say</h2>
          <p style={{ color: 'var(--text-medium)' }}>Real stories from travelers who experienced our seamless service.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{ color: '#fbbf24', fontSize: '1.25rem', marginBottom: '15px' }}>★★★★★</div>
            <p style={{ fontStyle: 'italic', color: 'var(--text-medium)', marginBottom: '20px', fontSize: '0.95rem' }}>
              "The student visa application process for Germany seemed incredibly daunting, but VeloceTravel guided me step-by-step. Their document uploader and verification gave me absolute confidence before submission. Approved in just 8 days!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Client" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h5 style={{ fontWeight: 600 }}>Sophia Reynolds</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Heidelberg University Student</p>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{ color: '#fbbf24', fontSize: '1.25rem', marginBottom: '15px' }}>★★★★★</div>
            <p style={{ fontStyle: 'italic', color: 'var(--text-medium)', marginBottom: '20px', fontSize: '0.95rem' }}>
              "Exceptional service for tourist visas. We booked a holiday package to Switzerland. The visa assistance was integrated. They handled our forms, insurance, and photo checks perfectly. Highly recommended!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Client" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h5 style={{ fontWeight: 600 }}>Michael Thorne</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Family Traveler</p>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '30px' }}>
            <div style={{ color: '#fbbf24', fontSize: '1.25rem', marginBottom: '15px' }}>★★★★★</div>
            <p style={{ fontStyle: 'italic', color: 'var(--text-medium)', marginBottom: '20px', fontSize: '0.95rem' }}>
              "As a business owner constantly traveling for trade fairs, their corporate visa service is a lifesaver. Fast-tracked, professional, and their CRM dashboard keeps our HR logs updated. An essential B2B partner."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" alt="Client" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h5 style={{ fontWeight: 600 }}>Rajiv Mehta</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>CEO, Zenith Technologies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" style={{ padding: '80px 8%', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--text-medium)' }}>Find quick answers to common queries regarding international visa applications.</p>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {faqs.map((faq, index) => (
            <div key={index} className="glass-card" style={{ overflow: 'hidden' }}>
              <button 
                style={{ width: '100%', padding: '20px 24px', background: 'transparent', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-dark)' }}>{faq.q}</span>
                <ChevronDown size={18} style={{ transform: activeFaq === index ? 'rotate(180deg)' : 'none', transition: 'transform var(--transition-fast)' }} />
              </button>
              {activeFaq === index && (
                <div style={{ padding: '0 24px 20px 24px', color: 'var(--text-medium)', fontSize: '0.95rem', lineHeight: '1.6', borderTop: '1px solid #f1f5f9' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form & Info */}
      <section id="contact" style={{ padding: '80px 8%', background: 'white' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px' }}>
          
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Get In Touch</h2>
            <p style={{ color: 'var(--text-medium)', marginBottom: '30px', lineHeight: '1.6' }}>
              Have questions about visa policies, pricing, or travel packages? Contact us, and our CRM experts will call you back within 15 minutes.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justify: 'center', color: 'var(--primary-color)' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <h6 style={{ fontWeight: 600, fontSize: '0.9rem' }}>Call Us</h6>
                  <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>+1 555-0199 (Mon-Sat, 9AM - 6PM)</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justify: 'center', color: 'var(--primary-color)' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <h6 style={{ fontWeight: 600, fontSize: '0.9rem' }}>Email Us</h6>
                  <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>support@velocetravel.com</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justify: 'center', color: 'var(--primary-color)' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <h6 style={{ fontWeight: 600, fontSize: '0.9rem' }}>Corporate Office</h6>
                  <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem' }}>500 Boylston Street, Boston, MA 02116</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '40px', background: '#f8fafc' }}>
            <h3 style={{ marginBottom: '20px' }}>Enquiry Form</h3>
            <form onSubmit={handleEnquirySubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. John Doe"
                  value={enquiry.name}
                  onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="john@example.com"
                    value={enquiry.email}
                    onChange={(e) => setEnquiry({ ...enquiry, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="+1 555-0123"
                    value={enquiry.phone}
                    onChange={(e) => setEnquiry({ ...enquiry, phone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Your Message / Travel Requirement</label>
                <textarea 
                  className="form-input" 
                  rows="4" 
                  placeholder="How can we assist you? Tell us your destination, visa type or travel plans..."
                  value={enquiry.message}
                  onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })}
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <MessageSquare size={16} />
                Submit Enquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: 'rgba(255, 255, 255, 0.6)', padding: '50px 8% 20px 8%', fontSize: '0.9rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px' }}>
          <div>
            <a href="#" className="logo" style={{ color: 'white', marginBottom: '15px' }}>
              <Plane size={24} style={{ transform: 'rotate(45deg)', color: 'var(--secondary-color)' }} />
              <span>VeloceTravel</span>
            </a>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              Your trusted partner for effortless global visas, corporate compliance, and bespoke vacation tours. 
            </p>
          </div>
          <div>
            <h5 style={{ color: 'white', marginBottom: '15px', fontFamily: 'var(--font-heading)' }}>Quick Links</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#services" style={{ color: 'inherit', textDecoration: 'none' }}>Visa Services</a></li>
              <li><a href="#why-choose-us" style={{ color: 'inherit', textDecoration: 'none' }}>Why Choose Us</a></li>
              <li><a href="#faqs" style={{ color: 'inherit', textDecoration: 'none' }}>FAQs</a></li>
              <li><a href="#contact" style={{ color: 'inherit', textDecoration: 'none' }}>Support Center</a></li>
            </ul>
          </div>
          <div>
            <h5 style={{ color: 'white', marginBottom: '15px', fontFamily: 'var(--font-heading)' }}>Visa Portals</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onClick={() => setView('login')}>Tourist Visa Portal</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onClick={() => setView('login')}>Student Admissions</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onClick={() => setView('login')}>Corporate Executive Visas</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }} onClick={() => setView('login')}>Work Clearance Audits</a></li>
            </ul>
          </div>
          <div>
            <h5 style={{ color: 'white', marginBottom: '15px', fontFamily: 'var(--font-heading)' }}>Legal</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms & Conditions</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Refund Policy</a></li>
              <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Consulate Disclaimer</a></li>
            </ul>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', fontSize: '0.8rem' }}>
          <p>© 2026 VeloceTravel Inc. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Facebook</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Twitter</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>LinkedIn</a>
            <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Instagram</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
