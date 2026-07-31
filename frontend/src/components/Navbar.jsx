import "../css/main.css";
import "../css/landing.css";
import AnimatedLogo from "./AnimatedLogo";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Logout01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const Navbar = ({ openModal }) => {
   const [scrolled, setScrolled] = useState(false);
   const [navOpen, setNavOpen] = useState(false);

   const { isAuthenticated, user, logout } = useAuth();
   const location = useLocation();

   const isHomePage = location.pathname === "/";
   const isServicesPage = location.pathname === "/services";
   const isProfilePage = location.pathname === "/user/profile";
   const isMyBookingsPage = location.pathname === "/user/my-bookings";

   useEffect(() => {
      const handleScroll = () => {
         setScrolled(window.scrollY > 20);
      };

      window.addEventListener("scroll", handleScroll, {
         passive: true,
      });
      return () => {
         window.removeEventListener("scroll", handleScroll);
      };
   }, []);

   const toggleHamburger = () => setNavOpen((prev) => !prev);

   return (
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
         <div className="nav-inner">
            <Link to="/" className="nav-logo">
               <span className="logo-icon">
                  <img src="/logo.svg" alt="SlotSync Logo" />
                  {/* <AnimatedLogo /> */}
               </span>
               SlotSync
            </Link>
            <div className={`nav-links${navOpen ? " open" : ""}`}>
               {isHomePage ? (
                  <>
                     <li>
                        <a href="#how-it-works">How it works</a>
                     </li>
                     <li>
                        <a href="#services">Services</a>
                     </li>
                     <li>
                        <a href="#features">Features</a>
                     </li>
                  </>
               ) : (
                  <>
                     <li>
                        <Link to="/" className="navlinks-a">
                           Home
                        </Link>
                     </li>
                     <li>
                        <Link
                           to="/services"
                           className={`navlinks-a ${isServicesPage ? "active" : ""}`}
                        >
                           Services
                        </Link>
                     </li>
                     {isAuthenticated ? (
                        <>
                           <li>
                              <Link
                                 to="/user/my-bookings"
                                 className={`navlinks-a ${isMyBookingsPage ? "active" : ""}`}
                              >
                                 My Bookings
                              </Link>
                           </li>
                           <li>
                              <Link
                                 to="/user/profile"
                                 className={`navlinks-a ${isProfilePage ? "active" : ""}`}
                              >
                                 Profile
                              </Link>
                           </li>
                        </>
                     ) : (
                        ""
                     )}
                  </>
               )}
            </div>
            <div className={`nav-actions${navOpen ? " open" : ""}`}>
               {isAuthenticated ? (
                  user.role === "admin" ? (
                     <>
                        <a
                           href="pages/admin/dashboard.html"
                           className="btn-ghost"
                        >
                           Dashboard
                        </a>
                        <button onClick={logout} className="btn-primary">
                           Log out
                        </button>
                     </>
                  ) : (
                     <>
                        {isHomePage && (
                           <Link to="/user/my-bookings" className="btn-ghost">
                              My Bookings
                           </Link>
                        )}
                        <button onClick={logout} className="btn-outline">
                           Log out
                        </button>
                        {!isProfilePage && (
                           <Link to="/user/profile" className="btn-primary">
                              {user.name?.split(" ")[0] || "Profile"}
                           </Link>
                        )}
                     </>
                  )
               ) : (
                  <>
                     <Link to="/auth/login" className="btn-ghost">
                        Log in
                     </Link>
                     <button className="btn-primary" onClick={openModal}>
                        Get Started
                     </button>
                  </>
               )}
            </div>
            <button
               className="nav-hamburger"
               id="hamburger"
               aria-label="Toggle menu"
               onClick={toggleHamburger}
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
