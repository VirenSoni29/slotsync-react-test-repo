import { Link } from "react-router-dom";

const Profile = () => {
   return (
      <>
         <nav className="auth-nav">
            <Link to='/' className="nav-logo">
               <img src="/logo.svg" alt="SlotSync Logo" />
               SlotSync
            </Link>
         </nav>
      </>
   );
};

export default Profile;
