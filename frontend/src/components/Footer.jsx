import '../css/main.css';
import '../css/landing.css';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Envelope, Github01Icon } from '@hugeicons/core-free-icons';

const Footer = () => {
   return (
      <footer className='footer'>
         <div className='footer-inner'>
            <div className='footer-brand'>
               <Link to='/' className='nav-logo'>
                  <span className='logo-icon'>
                     <img src='/logo.svg' alt='SlotSync Logo' />
                  </span>
                  SlotSync
               </Link>
               <p>Appointment booking for modern businesses.</p>
            </div>
            <div className='footer-links'>
               <div className='footer-col'>
                  <h4>Platform</h4>
                  <a href='pages/services.html'>Browse Services</a>
                  <a href='pages/register.html'>Sign Up</a>
                  <a href='/auth/login'>Log In</a>
               </div>
               <div className='footer-col'>
                  <h4>Account</h4>
                  <a href='pages/my-bookings.html'>My Bookings</a>
                  <a href='pages/profile.html'>Profile</a>
               </div>
               <div className='footer-col'>
                  <h4>Contact</h4>
                  <a>Profile</a>
                  <div className='flex items-center gap-2.5'>
                     <a
                        href='https://github.com/VirenSoni29'
                        target='_blank'
                        rel='noreferrer'
                     >
                        {<HugeiconsIcon icon={Github01Icon} strokeWidth={2} />}
                     </a>
                     <a
                        href='mailto:virensoni.work@gmail.com'
                        target='_blank'
                        rel='noreferrer'
                     >
                        {<HugeiconsIcon icon={Envelope} strokeWidth={2} />}
                     </a>
                  </div>
               </div>
            </div>
         </div>
         <div className='footer-bottom'>
            <p>
               &copy; {new Date().getFullYear()} SlotSync. All rights reserved. Built
               with React + TailwindCSS.
            </p>
         </div>
      </footer>
   );
};

export default Footer;
