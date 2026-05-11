import '../css/main.css';
import '../css/landing.css';
import Navbar from '../components/Navbar';
import React, { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
   ArrowRight01Icon,
   ChartBarLineIcon,
   Clock01Icon,
   Mail01Icon,
   Mortarboard01Icon,
   Queue01Icon,
   ScissorIcon,
   ShieldKeyIcon,
   ShieldUserIcon,
   Stethoscope02Icon,
   TimeScheduleIcon,
} from '@hugeicons/core-free-icons';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const HeroSection = () => {
   return (
      <section className='hero'>
         <div className='hero-bg'>
            <div className='hero-grid'></div>
            <div className='blob blob-1'></div>
            <div className='blob blob-2'></div>
         </div>

         <div className='hero-content'>
            <div className='hero-badge'>
               <span className='badge-dot'></span>
               Appointments. Simplified.
            </div>
            <h1 className='hero-title'>
               Book your next
               <br />
               <span className='title-accent'>appointment</span>
               <br />
               in seconds.
            </h1>
            <p className='hero-sub'>
               SlotSync connects customers with businesses in real time. No
               calls, no WhatsApp back-and-forth — just pick a slot and you're
               done.
            </p>
            <div className='hero-cta'>
               <a href='pages/services.html' className='btn-primary btn-large'>
                  Browse Services
                  <svg
                     width='18'
                     height='18'
                     viewBox='0 0 24 24'
                     fill='none'
                     stroke='currentColor'
                     stroke-width='2.5'
                  >
                     <path d='M5 12h14M12 5l7 7-7 7' />
                  </svg>
               </a>
               <a href='#how-it-works' className='btn-outline btn-large'>
                  See how it works
               </a>
            </div>
            <div className='hero-stats'>
               <div className='stat'>
                  <span className='stat-num'>500+</span>
                  <span className='stat-label'>Bookings made</span>
               </div>
               <div className='stat-divider'></div>
               <div className='stat'>
                  <span className='stat-num'>50+</span>
                  <span className='stat-label'>Services listed</span>
               </div>
               <div className='stat-divider'></div>
               <div className='stat'>
                  <span className='stat-num'>98%</span>
                  <span className='stat-label'>On-time rate</span>
               </div>
            </div>
         </div>

         <div className='hero-visual'>
            <div className='booking-card-demo'>
               <div className='demo-header'>
                  <div className='demo-avatar'>S</div>
                  <div>
                     <div className='demo-name'>Salon Appointment</div>
                     <div className='demo-date'>Today, 3:30 PM</div>
                  </div>
                  <div className='demo-status confirmed'>Confirmed</div>
               </div>
               <div className='demo-divider'></div>
               <div className='demo-slots'>
                  <div className='demo-label'>Available slots — Feb 10</div>
                  <div className='slot-grid'>
                     <div className='slot-btn taken'>9:00 AM</div>
                     <div className='slot-btn taken'>9:30 AM</div>
                     <div className='slot-btn active'>10:00 AM</div>
                     <div className='slot-btn'>10:30 AM</div>
                     <div className='slot-btn'>11:00 AM</div>
                     <div className='slot-btn taken'>11:30 AM</div>
                  </div>
               </div>
               <div className='demo-footer'>
                  <div className='demo-price'>₹350</div>
                  <button className='demo-book-btn'>Book Now</button>
               </div>
               <div className='demo-ping'></div>
            </div>
         </div>
      </section>
   );
};

const LogosAndTrustSection = () => {
   const trustItems = [
      '🏥 Clinics',
      '✂️ Salons',
      '📚 Tutors',
      '🔧 Repair Services',
      '💼 Consultants',
      '🎨 Freelancers',
   ];

   return (
      <section className='trust-bar'>
         <p className='trust-label'>Works for any business</p>
         <div className='trust-items'>
            {trustItems.map((item) => (
               <div className='trust-item'>{item}</div>
            ))}
         </div>
      </section>
   );
};

const HowItWorks = () => {
   const steps = [
      {
         step: '1',
         emoji: '🔍',
         heading: 'Browse Services',
         desc: 'Explore available services and find what you need — from haircuts to health consultations.',
      },
      {
         step: '2',
         emoji: '📅',
         heading: 'Pick a Slot',
         desc: 'Choose a date and see real-time available time slots. No overlaps, no double bookings.',
      },
      {
         step: '3',
         emoji: '✅',
         heading: 'Confirm & Pay',
         desc: "Pay securely via Razorpay and get an instant confirmation on email. You're all set.",
      },
   ];

   return (
      <section className='how-it-works' id='how-it-works'>
         <div className='section-inner'>
            <div className='section-tag'>Process</div>
            <h2 className='section-title'>Three steps to your appointment</h2>
            <p className='section-sub'>
               No sign-ups required to browse. Book in under a minute.
            </p>

            <div className='steps'>
               {steps.map((step, index) => (
                  <React.Fragment key={index}>
                     <div className='step' data-step={step.step}>
                        <div className='step-number'>0{step.step}</div>
                        <div className='step-icon'>{step.emoji}</div>
                        <h3>{step.heading}</h3>
                        <p>{step.desc}</p>
                     </div>
                     {index < steps.length - 1 && (
                        <div className='step-arrow'>
                           <HugeiconsIcon
                              icon={ArrowRight01Icon}
                              strokeWidth={2}
                           />
                        </div>
                     )}
                  </React.Fragment>
               ))}
            </div>
         </div>
      </section>
   );
};

const ServicesPreviewSection = () => {
   const placeholderServices = [
      {
         icon: ScissorIcon,
         name: 'Haircut & Styling',
         desc: '30 min session with a professional stylist',
         price: '₹350',
         duration: 30,
      },
      {
         icon: ScissorIcon,
         name: 'General Consultation',
         desc: 'One-on-one doctor consultation session',
         price: '₹500',
         duration: 45,
      },
      {
         icon: Mortarboard01Icon,
         name: 'Maths Tutoring',
         desc: '1-on-1 tutoring session for JEE / boards',
         price: '₹400',
         duration: 60,
      },
   ];

   return (
      <section className='services-preview' id='services'>
         <div className='section-inner'>
            <div className='section-tag'>Services</div>
            <h2 className='section-title'>What can you book?</h2>
            <p className='section-sub'>
               A growing catalogue of services available right now.
            </p>

            <div className='service-cards' id='serviceCards'>
               {placeholderServices.map((item, index) => (
                  <div className='service-card' key={index}>
                     <div className='service-icon-wrap'>
                        <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                     </div>
                     <div className='service-info'>
                        <h3>{item.name}</h3>
                        <p>{item.desc}</p>
                        <div className='service-meta'>
                           <span className='service-price'>{item.price}</span>
                           <span className='service-duration'>
                              <HugeiconsIcon
                                 icon={Clock01Icon}
                                 strokeWidth={2}
                              />{' '}
                              {item.duration} min
                           </span>
                        </div>
                     </div>
                     <Link
                        to={`/book?service=${index + 1}`}
                        className='service-book-btn'
                     >
                        Book{' '}
                        <HugeiconsIcon
                           icon={ArrowRight01Icon}
                           strokeWidth={2}
                        />
                     </Link>
                  </div>
               ))}
            </div>

            <div className='services-cta'>
               <a href='pages/services.html' className='btn-outline'>
                  View all services →
               </a>
            </div>
         </div>
      </section>
   );
};

const FeaturesAndCTABanner = ({ openModal }) => {
   const features = [
      {
         icon: TimeScheduleIcon,
         heading: 'Real-time slot availability',
         desc: 'Slots update instantly when someone books. No refreshing, no conflicts, no double bookings — ever.',
      },
      {
         icon: ShieldKeyIcon,
         heading: 'Secure payments',
         desc: 'Razorpay integration with HMAC signature verification. Every transaction is verified server-side.',
      },
      {
         icon: Mail01Icon,
         heading: 'Auto notifications',
         desc: 'Confirmation emails, reminders 1 hour before, and cancellation alerts — all automatic.',
      },
      {
         icon: Queue01Icon,
         heading: 'Waitlist system',
         desc: 'Slot full? Join the waitlist. If someone cancels, you get notified instantly.',
      },
      {
         icon: ChartBarLineIcon,
         heading: 'Admin analytics',
         desc: 'Revenue, peak hours, popular services — all in one dashboard for business owners.',
      },
      {
         icon: ShieldUserIcon,
         heading: 'OTP verification',
         desc: 'Every account verified via email OTP. JWT-based auth with role separation for customers and admins.',
      },
   ];

   return (
      <>
         <section className='features' id='features'>
            <div className='section-inner'>
               <div className='section-tag'>Why SlotSync</div>
               <h2 className='section-title'>Built for real businesses</h2>

               <div className='features-grid'>
                  {features.map((feature, index) => (
                     <div
                        className={`feature-card ${index === 0 ? 'feature-large' : ''} ${index === 5 ? 'feature-dark' : ''}`}
                     >
                        <div className='feature-icon'>
                           <HugeiconsIcon icon={feature.icon} />
                        </div>
                        <h3>{feature.heading}</h3>
                        <p>{feature.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         <section className='cta-banner'>
            <div className='cta-inner'>
               <h2>Ready to stop managing appointments manually?</h2>
               <p>Join SlotSync and let your customers book themselves.</p>
               <div className='cta-buttons'>
                  <button className='btn-primary btn-large' onClick={openModal}>
                     Create your account
                  </button>
                  <Link to='/auth/login' className='btn-ghost btn-large'>
                     Already have one? Log in
                  </Link>
               </div>
            </div>
         </section>
      </>
   );
};

const GetStartedModal = ({ isOpen, closeModal }) => {
   useEffect(() => {
      const handleKeyDown = (e) => {
         if (e.key === 'Escape') {
            closeModal();
         }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
         document.removeEventListener('keydown', handleKeyDown);
      };
   }, [closeModal]);

   if (!isOpen) return null;

   return (
      <div
         className='modal-overlay gs-modal-overlay hidden'
         id='gsModal'
         onClick={closeModal}
         aria-modal='true'
         role='dialog'
      >
         <div className='gs-modal-card'>
            <button className='gs-modal-close' id='gsModalClose' onClick={closeModal} aria-label='Close'>
               &times;
            </button>
            <div className='gs-modal-header'>
               <h2>Get started with SlotSync</h2>
               <p>Choose how you want to use the platform.</p>
            </div>
            <div className='gs-modal-choices'>
               <Link to='/auth/register' className='gs-choice-card'>
                  <div className='gs-choice-icon'>🙋</div>
                  <div className='gs-choice-body'>
                     <h3>I'm a Customer</h3>
                     <p>Book appointments with businesses near you.</p>
                  </div>
                  <svg
                     className='gs-choice-arrow'
                     width='18'
                     height='18'
                     viewBox='0 0 24 24'
                     fill='none'
                     stroke='currentColor'
                     stroke-width='2.5'
                  >
                     <path d='M5 12h14M12 5l7 7-7 7' />
                  </svg>
               </Link>
               <Link to='/auth/business-register' className='gs-choice-card'>
                  <div className='gs-choice-icon'>🏢</div>
                  <div className='gs-choice-body'>
                     <h3>I'm a Business</h3>
                     <p>Set up your profile and start accepting bookings.</p>
                  </div>
                  <svg
                     className='gs-choice-arrow'
                     width='18'
                     height='18'
                     viewBox='0 0 24 24'
                     fill='none'
                     stroke='currentColor'
                     stroke-width='2.5'
                  >
                     <path d='M5 12h14M12 5l7 7-7 7' />
                  </svg>
               </Link>
            </div>
            <p className='gs-modal-login'>
               Already have an account? <Link to='/auth/login'>Log in</Link>
            </p>
         </div>
      </div>
   );
};

const Landing = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const openModal = () => {
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setIsModalOpen(false);
   };

   return (
      <>
         <Navbar openModal={openModal} />
         <HeroSection />
         <LogosAndTrustSection />
         <HowItWorks />
         <ServicesPreviewSection />
         <FeaturesAndCTABanner openModal={openModal} />
         <GetStartedModal isOpen={isModalOpen} closeModal={closeModal} />
         <Footer />
      </>
   );
};

export default Landing;
