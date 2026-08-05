import "../css/main.css";
import "../css/landing.css";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons";

const Navbar = () => {
   const [scrolled, setScrolled] = useState(false);
   const [navOpen, setNavOpen] = useState(false);
   const [theme, setTheme] = useState(() => {
      return localStorage.getItem("theme") || "light";
   });

   const { isAuthenticated, user, logout } = useAuth();
   const location = useLocation();

   const isHomePage = location.pathname === "/";
   const isServicesPage = location.pathname === "/services";
   const isProfilePage = location.pathname === "/user/profile";
   const isMyBookingsPage = location.pathname === "/user/my-bookings";
   const isBusinessDashPage = location.pathname === "/business/dashboard";
   const isAdminUsersPage = location.pathname === "/admin/users";
   const isAdminTransacPage = location.pathname === "/admin/transactions";

   useEffect(() => {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
   }, [theme]);

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
   const toggleTheme = () => {
      setTheme((prev) => (prev === "light" ? "dark" : "light"));
   };

   return (
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
         <div className="nav-inner">
            <Link to="/" className="nav-logo">
               <span className="logo-icon">
                  <img src="/logo.svg" alt="SlotSync Logo" />
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
                           className={`navlinks-a${isServicesPage ? " active" : ""}`}
                        >
                           Services
                        </Link>
                     </li>
                     {isAuthenticated && (
                        <>
                           <li>
                              <Link
                                 to="/user/my-bookings"
                                 className={`navlinks-a${isMyBookingsPage ? " active" : ""}`}
                              >
                                 My Bookings
                              </Link>
                           </li>
                           {user?.role === "business_owner" && (
                              <li>
                                 <Link
                                    to="/business/dashboard"
                                    className={`navlinks-a${isBusinessDashPage ? " active" : ""}`}
                                 >
                                    Business Dashboard
                                 </Link>
                              </li>
                           )}
                           {user?.role === "admin" && (
                              <>
                                 <li>
                                    <Link
                                       to="/admin/users"
                                       className={`navlinks-a${isAdminUsersPage ? " active" : ""}`}
                                    >
                                       Manage Users
                                    </Link>
                                 </li>
                                 <li>
                                    <Link
                                       to="/admin/transactions"
                                       className={`navlinks-a${isAdminTransacPage ? " active" : ""}`}
                                    >
                                       Global Ledger
                                    </Link>
                                 </li>
                              </>
                           )}
                           {user?.role === "customer" && (
                              <li>
                                 <Link
                                    to="/create-business"
                                    className="text-(--clr-accent-2) font-medium text-xs border border-(--clr-accent-2)/30 px-3! py-1! rounded-full hover:bg-(--clr-accent-2)/10 transition"
                                 >
                                    + Register Business
                                 </Link>
                              </li>
                           )}
                           <li>
                              <Link
                                 to="/user/profile"
                                 className={`navlinks-a ${isProfilePage ? "active" : ""}`}
                              >
                                 Profile
                              </Link>
                           </li>
                        </>
                     )}
                  </>
               )}
            </div>
            <div className={`nav-actions${navOpen ? " open" : ""}`}>
               <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg border border-(--clr-border) text-(--clr-text-2) hover:text-(--clr-text) hover:border-(--clr-border-2) bg-white/5 transition-all flex items-center justify-center cursor-pointer"
                  title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                  aria-label="Toggle theme"
               >
                  <HugeiconsIcon
                     icon={theme === "light" ? Moon01Icon : Sun01Icon}
                     strokeWidth={2}
                     size={18}
                  />
               </button>
               {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                     <Link
                        to="/user/profile"
                        className="text-xs px-2.5! py-1! rounded-full bg-white/5 border border-white/10 text-(--clr-text-2)"
                     >
                        {user.role === "admin"
                           ? "👑 Admin"
                           : user.role === "business_owner"
                             ? "🏢 Owner"
                             : "👤 Customer"}
                     </Link>
                     <button onClick={logout} className="btn-outline">
                        Log out
                     </button>
                  </div>
               ) : (
                  <>
                     <Link to="/auth/login" className="btn-ghost">
                        Log in
                     </Link>
                     <Link to="/auth/register" className="btn-primary">
                        Get Started
                     </Link>
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
