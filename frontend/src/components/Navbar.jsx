import '../css/main.css';
import '../css/landing.css';
import AnimatedLogo from './AnimatedLogo';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ openModal }) => {
   const [scrolled, setScrolled] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         setScrolled(window.scrollY > 20);
      };

      window.addEventListener('scroll', handleScroll, {
         passive: true,
      });
      return () => {
         window.removeEventListener('scroll', handleScroll);
      };
   }, []);

   return (
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id='navbar'>
         <div className='nav-inner'>
            <Link to='/' className='nav-logo'>
               <span className='logo-icon'>
                  <img src='/logo.svg' alt='SlotSync Logo' />
                  {/* <AnimatedLogo /> */}
               </span>
               SlotSync
            </Link>
            <ul className='nav-links' id='navLinks'>
               <li>
                  <a href='#how-it-works'>How it works</a>
               </li>
               <li>
                  <a href='#services'>Services</a>
               </li>
               <li>
                  <a href='#features'>Features</a>
               </li>
            </ul>
            <div className='nav-actions' id='navActions'>
               <Link to='/auth/login' className='btn-ghost'>
                  Log in
               </Link>
               <button className='btn-primary' onClick={openModal}>
                  Get Started
               </button>
            </div>
            <button
               className='nav-hamburger'
               id='hamburger'
               aria-label='Toggle menu'
            >
               <span></span>
               <span></span>
               <span></span>
            </button>
         </div>
      </nav>
   );
};

export default Navbar;
