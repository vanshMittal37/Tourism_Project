import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import {
  ArrowLeft, CheckCircle2, Clock, Globe, Shield,
  FileText, AlertCircle, Plane, Star, ChevronDown, ChevronUp,
  Calendar, MapPin, Users, Award
} from 'lucide-react';

const HIGHLIGHT_EMOJIS = ['🏖️', '🏛️', '🍜', '🌸', '🎓', '💼', '🏔️', '🌉', '🎭', '🦁'];

const DELIVERY_META = {
  instant: { label: 'Instant E-Visa', color: '#10b981', bg: '#d1fae5' },
  standard: { label: 'Standard Processing', color: '#3b82f6', bg: '#dbeafe' },
  express: { label: 'Express Vetting', color: '#f59e0b', bg: '#fef3c7' },
};

export const DestinationDetail = ({ destination, setView }) => {
  const { currentUser, setPrefilledVisa } = useDatabase();
  const [openFaq, setOpenFaq] = useState(null);

  if (!destination) {
    return (
      <div style={{ padding: '120px', textAlign: 'center' }}>
        <AlertCircle size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
        <h3 style={{ marginBottom: '8px' }}>No destination selected</h3>
        <button className="btn btn-primary" onClick={() => setView('landing')}>Go Back to Explore</button>
      </div>
    );
  }

  const badge = DELIVERY_META[destination.delivery] || DELIVERY_META.standard;

  const faqs = [
    {
      q: `How long does a ${destination.type} for ${destination.name} take?`,
      a: `The typical processing time is ${destination.processingTime}. Express services may be available for an additional fee. We track your application at every step.`
    },
    {
      q: 'Can I extend my visa after arrival?',
      a: 'Extension policies differ by destination. Our immigration experts can guide you through the in-country extension process if required.'
    },
    {
      q: 'What happens if my visa application is rejected?',
      a: 'If rejected, our team will review the reasons and advise on reapplication. Government fees are generally non-refundable, but our service fee is refunded.'
    },
    {
      q: 'Is travel insurance mandatory?',
      a: destination.name === 'Switzerland' || destination.name === 'Germany'
        ? 'Yes — Schengen visa rules require minimum €30,000 medical coverage travel insurance. We can help arrange compliant policies.'
        : 'While not always mandatory, we strongly recommend comprehensive travel insurance for all international trips.'
    },
  ];

  const handleApply = () => {
    setPrefilledVisa({ country: destination.name, type: destination.type });
    if (currentUser) {
      if (currentUser.role === 'Admin') setView('admin-dashboard');
      else if (currentUser.role === 'CRM Executive') setView('crm-dashboard');
      else setView('customer-dashboard');
    } else {
      setView('login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* ── HERO ─────────────────────────────────── */}
      <div style={{ position: 'relative', height: '500px', overflow: 'hidden' }}>
        {/* BG image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${destination.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.72) 100%)',
        }} />

        <div style={{
          position: 'relative', zIndex: 2,
          height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '28px 8%',
        }}>
          {/* Back */}
          <button
            onClick={() => setView('landing')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              color: 'white', border: '1px solid rgba(255,255,255,0.3)',
              padding: '10px 22px', borderRadius: '9999px',
              fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
              width: 'fit-content', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <ArrowLeft size={16} /> Back to Explore
          </button>

          {/* Country title block */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <span style={{ fontSize: '3.5rem', lineHeight: 1 }}>{destination.flag}</span>
              <span style={{
                background: badge.bg, color: badge.color,
                padding: '6px 16px', borderRadius: '9999px',
                fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {badge.label}
              </span>
            </div>
            <h1 style={{
              color: 'white', fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800, marginBottom: '12px',
              fontFamily: 'Outfit, sans-serif', lineHeight: 1.1,
            }}>
              {destination.name}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1.05rem', maxWidth: '550px', lineHeight: 1.6 }}>
              {destination.description}
            </p>
          </div>
        </div>
      </div>

      {/* ── QUICK STATS BAR ──────────────────────── */}
      <div style={{
        background: 'white', borderBottom: '1px solid #f1f5f9',
        padding: '20px 8%',
        display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'center',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}>
        {[
          { icon: <Shield size={18} />, label: 'Visa Type', value: destination.type },
          { icon: <Calendar size={18} />, label: 'Validity', value: destination.validity },
          { icon: <Clock size={18} />, label: 'Processing', value: destination.processingTime },
          { icon: <Globe size={18} />, label: 'Entry', value: destination.entryType },
          { icon: <Award size={18} />, label: 'Service Fee', value: destination.fees, highlight: true },
        ].map(({ icon, label, value, highlight }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: highlight ? 'var(--secondary-color)' : 'var(--text-light)' }}>{icon}</span>
            <div>
              <div style={{ fontSize: '0.73rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: highlight ? 'var(--secondary-color)' : 'var(--text-dark)' }}>{value}</div>
            </div>
          </div>
        ))}

        <div style={{ marginLeft: 'auto' }}>
          <button
            className="btn btn-primary"
            onClick={handleApply}
            style={{ borderRadius: '9999px', padding: '12px 28px', fontWeight: 700 }}
          >
            <Plane size={16} />
            Apply Now
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────── */}
      <div style={{ padding: '50px 8%', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: '40px', alignItems: 'start' }}>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Highlights */}
            {destination.highlights && destination.highlights.length > 0 && (
              <div style={{
                background: 'white', borderRadius: '18px', padding: '32px',
                boxShadow: '0 2px 20px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
              }}>
                <h2 style={{ marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.3rem' }}>
                  <Star size={20} style={{ color: '#f59e0b' }} />
                  Why Visit {destination.name}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  {destination.highlights.map((hl, i) => (
                    <div key={i} style={{
                      padding: '16px 18px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                      borderRadius: '12px', border: '1px solid #e2e8f0',
                      display: 'flex', alignItems: 'center', gap: '12px',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                    >
                      <span style={{ fontSize: '1.6rem' }}>{HIGHLIGHT_EMOJIS[i % HIGHLIGHT_EMOJIS.length]}</span>
                      <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-dark)' }}>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Required Documents */}
            {destination.requirements && destination.requirements.length > 0 && (
              <div style={{
                background: 'white', borderRadius: '18px', padding: '32px',
                boxShadow: '0 2px 20px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
              }}>
                <h2 style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.3rem' }}>
                  <FileText size={20} style={{ color: 'var(--primary-color)' }} />
                  Required Documents
                </h2>
                <p style={{ color: 'var(--text-medium)', fontSize: '0.88rem', marginBottom: '22px' }}>
                  Prepare these documents before starting your application.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                  {destination.requirements.map((doc, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px 18px', borderRadius: '10px',
                      background: i % 2 === 0 ? '#f0fdf4' : '#eff6ff',
                      border: `1px solid ${i % 2 === 0 ? '#bbf7d0' : '#bfdbfe'}`,
                    }}>
                      <CheckCircle2 size={17} style={{ color: i % 2 === 0 ? '#10b981' : '#3b82f6', flexShrink: 0 }} />
                      <span style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Important Note */}
            {destination.note && (
              <div style={{
                background: '#fefce8', border: '1px solid #fde68a',
                borderRadius: '14px', padding: '22px 26px',
                display: 'flex', gap: '14px', alignItems: 'flex-start',
              }}>
                <AlertCircle size={22} style={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ fontWeight: 700, color: '#92400e', marginBottom: '6px', fontSize: '1rem' }}>📌 Important Note</p>
                  <p style={{ color: '#78350f', fontSize: '0.92rem', lineHeight: 1.6 }}>{destination.note}</p>
                </div>
              </div>
            )}

            {/* FAQs */}
            <div style={{
              background: 'white', borderRadius: '18px', padding: '32px',
              boxShadow: '0 2px 20px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
            }}>
              <h2 style={{ marginBottom: '22px', fontSize: '1.3rem' }}>Frequently Asked Questions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{
                    border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden',
                    transition: 'box-shadow 0.2s',
                    boxShadow: openFaq === i ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
                  }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{
                        width: '100%', padding: '18px 22px',
                        background: openFaq === i ? 'var(--primary-light)' : '#f8fafc',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        fontWeight: 600, fontSize: '0.95rem', textAlign: 'left',
                        color: openFaq === i ? 'var(--primary-color)' : 'var(--text-dark)',
                        transition: 'background 0.2s',
                      }}
                    >
                      {faq.q}
                      {openFaq === i
                        ? <ChevronUp size={18} style={{ flexShrink: 0 }} />
                        : <ChevronDown size={18} style={{ flexShrink: 0 }} />
                      }
                    </button>
                    {openFaq === i && (
                      <div style={{
                        padding: '18px 22px', borderTop: '1px solid #e2e8f0',
                        fontSize: '0.92rem', color: 'var(--text-medium)', lineHeight: 1.7,
                        background: 'white', animation: 'fadeIn 0.2s ease',
                      }}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN — Sticky Visa Card */}
          <div style={{ position: 'sticky', top: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Main card */}
            <div style={{
              background: 'white', borderRadius: '20px', padding: '32px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
            }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '4rem', lineHeight: 1, marginBottom: '10px' }}>{destination.flag}</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{destination.name}</h3>
                <span style={{
                  display: 'inline-block',
                  background: badge.bg, color: badge.color,
                  padding: '4px 12px', borderRadius: '9999px',
                  fontSize: '0.78rem', fontWeight: 700,
                }}>
                  {destination.type}
                </span>
              </div>

              {/* Stats rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '26px' }}>
                {[
                  { icon: <Shield size={16} />, label: 'Visa Type', value: destination.type },
                  { icon: <Calendar size={16} />, label: 'Stay Duration', value: destination.validity },
                  { icon: <Clock size={16} />, label: 'Processing Time', value: destination.processingTime },
                  { icon: <Globe size={16} />, label: 'Entry Type', value: destination.entryType },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-light)', fontSize: '0.88rem' }}>
                      {icon} {label}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-dark)' }}>{value}</span>
                  </div>
                ))}
                {/* Fee separator */}
                <div style={{ paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-light)', fontSize: '0.88rem' }}>
                    <MapPin size={16} /> Service Fee
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '1.35rem', color: 'var(--secondary-color)' }}>{destination.fees}</span>
                </div>
              </div>

              {/* Apply CTA */}
              <button
                className="btn btn-primary"
                onClick={handleApply}
                style={{ width: '100%', padding: '16px', fontSize: '1rem', borderRadius: '12px', fontWeight: 700, justifyContent: 'center' }}
              >
                <Plane size={18} />
                Apply for {destination.type}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '10px' }}>
                {currentUser ? '✓ Your profile will be pre-filled' : 'Login required to apply'}
              </p>
            </div>

            {/* Trust badge card */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              border: '1px solid #bbf7d0', borderRadius: '16px', padding: '22px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Award size={20} style={{ color: '#10b981' }} />
                <span style={{ fontWeight: 700, color: '#065f46', fontSize: '0.95rem' }}>VeloceTravel Guarantee</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {['99.2% visa approval success rate', 'Direct embassy liaison support', 'Real-time application tracking', 'End-to-end document guidance'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.83rem', color: '#047857' }}>
                    <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Need help */}
            <div style={{
              background: 'white', border: '1px solid #f1f5f9', borderRadius: '16px', padding: '22px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Users size={18} style={{ color: 'var(--primary-color)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Need Help?</span>
              </div>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-medium)', marginBottom: '14px', lineHeight: 1.5 }}>
                Our immigration experts are available 24/7 to guide your application.
              </p>
              <button
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center', borderRadius: '10px', fontSize: '0.88rem' }}
                onClick={() => {
                  setView('landing');
                  setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 200);
                }}
              >
                Contact an Expert
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail;
