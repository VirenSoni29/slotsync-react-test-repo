import { Link } from "react-router-dom";
import "../../css/main.css";
import "../../css/profile.css";
import useAuth from "../../hooks/useAuth";
import Navbar from "../../components/Navbar";
import getInitials from "../../helpers/getInitials";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
   ArrowRight01Icon,
   Briefcase01Icon,
   Calendar02Icon,
   CalendarCheckIn01Icon,
   Call02Icon,
   CheckmarkCircle01Icon,
   LockPasswordIcon,
   Mail01Icon,
   PencilEdit01Icon,
   Refresh01Icon,
   User02Icon,
   UserIcon,
   UserShield01Icon,
   ViewIcon,
   ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import {formatDate} from "../../helpers/formatDate";
import * as yup from "yup";
import {
   changePassword,
   getProfile,
   updateProfile,
} from "../../services/authService";

const PersonalInfoCard = ({ user, setUser, setGlobalUser }) => {
   const [mode, setMode] = useState(0);

   const [infoData, setInfoData] = useState({
      name: user?.name || "",
      phone: user?.phone || "",
   });

   const [errors, setErrors] = useState({});
   const [loading, setLoading] = useState(false);

   const editInfoSchema = yup.object({
      name: yup
         .string()
         .required("Name is required!")
         .min(3, "Name must be at least 3 characters!"),

      phone: yup
         .string()
         .required("Phone number is required!")
         .matches(/^\d{10}$/, "Enter a valid 10-digit phone number!"),
   });

   const handleChange = (e) => {
      const { name, value } = e.target;

      setInfoData({
         ...infoData,
         [name]: value,
      });
   };

   const validateEditInfo = async () => {
      try {
         await editInfoSchema.validate(infoData, { abortEarly: false });

         setErrors({});

         return true;
      } catch (error) {
         const newErrors = {};

         error.inner.forEach((err) => {
            newErrors[err.path] = err.message;
         });

         setErrors(newErrors);
         return false;
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const isValid = await validateEditInfo();

      if (!isValid) return;

      try {
         setLoading(true);
         const responseData = await updateProfile(infoData);

         if (responseData.success) {
            setUser(responseData?.data?.user);
            setGlobalUser(responseData?.data?.user);
            setMode(0);
            toast.success("Profile updated successfully!");
         }
      } catch (err) {
         toast.error(
            err.response?.data?.message ||
               "Failed to update profile. Please try again.",
         );
      } finally {
         setLoading(false);
      }
   };

   return (
      <section className="profile-card">
         <div className="card-header">
            <div className="card-title">
               <span className="card-icon">👤</span>
               <h2>Personal Info</h2>
            </div>
            <button
               className={`btn-edit ${mode === 1 && "hidden"}`}
               aria-label="Edit profile"
               onClick={() => setMode(1)}
            >
               <HugeiconsIcon
                  icon={PencilEdit01Icon}
                  size={15}
                  strokeWidth={2}
               />
               <span>Edit</span>
            </button>
         </div>

         {/* <!-- View mode --> */}
         {mode === 0 && (
            <div className="info-view" id="infoView">
               <div className="info-row">
                  <span className="info-label">
                     <HugeiconsIcon icon={UserIcon} size={15} strokeWidth={2} />
                     Full Name
                  </span>
                  <span className="info-value">{user?.name || "—"}</span>
               </div>
               <div className="info-row">
                  <span className="info-label">
                     <HugeiconsIcon
                        icon={Mail01Icon}
                        size={15}
                        strokeWidth={2}
                     />
                     Email
                  </span>
                  <span className="info-value">{user?.email || "—"}</span>
               </div>
               <div className="info-row">
                  <span className="info-label">
                     <HugeiconsIcon
                        icon={Call02Icon}
                        size={15}
                        strokeWidth={2}
                     />
                     Phone
                  </span>
                  <span className="info-value">{user?.phone || "—"}</span>
               </div>
            </div>
         )}

         {/* <!-- Edit mode --> */}
         {mode === 1 && (
            <form className="info-form" noValidate onSubmit={handleSubmit}>
               <div className="form-group">
                  <label htmlFor="editName">Full Name</label>
                  <div className="input-wrap">
                     <HugeiconsIcon
                        icon={UserIcon}
                        strokeWidth={2}
                        className="input-icon"
                     />
                     <input
                        type="text"
                        id="editName"
                        name="name"
                        placeholder="Your full name"
                        value={infoData.name}
                        onChange={handleChange}
                        autoComplete="name"
                     />
                  </div>
                  <span className={`field-error ${errors.name ? "show" : ""}`}>
                     {errors.name}
                  </span>
               </div>
               <div className="form-group">
                  <label htmlFor="editPhone">Phone Number</label>
                  <div className="input-wrap">
                     <HugeiconsIcon
                        icon={Call02Icon}
                        strokeWidth={2}
                        className="input-icon"
                     />
                     <input
                        type="tel"
                        id="editPhone"
                        name="phone"
                        placeholder="10-digit mobile number"
                        value={infoData.phone}
                        onChange={handleChange}
                        maxLength={10}
                        autoComplete="tel"
                     />
                  </div>
                  <span className={`field-error ${errors.phone ? "show" : ""}`}>
                     {errors.phone}
                  </span>
               </div>
               <div className="form-actions">
                  <button
                     type="button"
                     className="btn btn-ghost btn-sm"
                     onClick={() => setMode(0)}
                  >
                     Cancel
                  </button>
                  <button
                     type="submit"
                     className="btn btn-primary btn-sm"
                     disabled={loading}
                  >
                     {loading ? (
                        <span className="btn-loader">
                           <HugeiconsIcon
                              icon={Refresh01Icon}
                              strokeWidth={2}
                              size={14}
                              className="spin"
                           />
                        </span>
                     ) : (
                        <span className="btn-text">Save Changes</span>
                     )}
                  </button>
               </div>
               <div className="form-message hidden"></div>
            </form>
         )}
      </section>
   );
};

const AccountDetailsCard = ({ user }) => {
   return (
      <section className="profile-card" id="accountCard">
         <div className="card-header">
            <div className="card-title">
               <span className="card-icon">🛡️</span>
               <h2>Account Details</h2>
            </div>
         </div>
         <div className="info-view">
            <div className="info-row">
               <span className="info-label">
                  <HugeiconsIcon
                     icon={UserShield01Icon}
                     size={16}
                     strokeWidth={2}
                  />
                  Role
               </span>
               <span className="info-value">
                  <span className="role-badge">{user?.role || "—"}</span>
               </span>
            </div>
            <div className="info-row">
               <span className="info-label">
                  <HugeiconsIcon
                     icon={CheckmarkCircle01Icon}
                     size={16}
                     strokeWidth={2}
                  />
                  Status
               </span>
               <span className="info-value">
                  <span
                     className={`status-badge status-${user?.is_verified ? "verified" : "not-verified"}`}
                  >
                     {user?.is_verified ? "✅ Verified" : "❌ Not Verified"}
                  </span>
               </span>
            </div>
            <div className="info-row">
               <span className="info-label">
                  <HugeiconsIcon
                     icon={Calendar02Icon}
                     size={16}
                     strokeWidth={2}
                  />
                  Member Since
               </span>
               <span className="info-value" id="accountSince">
                  {formatDate(user?.created_at) || "—"}
               </span>
            </div>
         </div>

         {/* <!-- Quick links --> */}
         <div className="quick-links">
            <Link to="/my-bookings" className="quick-link">
               <HugeiconsIcon
                  icon={CalendarCheckIn01Icon}
                  size={16}
                  strokeWidth={2}
               />
               <span>My Bookings</span>
               <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="arrow"
                  size={16}
                  strokeWidth={3}
               />
            </Link>
            <Link to="/services" className="quick-link">
               <HugeiconsIcon
                  icon={Briefcase01Icon}
                  size={16}
                  strokeWidth={2}
               />
               <span>Browse Services</span>
               <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="arrow"
                  size={16}
                  strokeWidth={3}
               />
            </Link>
         </div>
      </section>
   );
};

const ChangePasswordCard = () => {
   const [passwordData, setPasswordData] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
   });

   const [errors, setErrors] = useState({});
   const [loading, setLoading] = useState(false);

   const [visibleFields, setVisibleFields] = useState({
      currentPassword: false,
      newPassword: false,
      confirmPassword: false,
   });

   const changePasswordSchema = yup.object({
      currentPassword: yup.string().required("Current password is required."),

      newPassword: yup
         .string()
         .required("New Password is required.")
         .matches(/[a-z]/, "Must contain at least one lowercase letter.")
         .matches(/[A-Z]/, "Must contain at least one uppercase letter.")
         .matches(/[0-9]/, "Must contain at least one number.")
         .matches(/[!@#$%&_]/, "Must contain at least one of !@$_#&%")
         .min(8, "Must be atleast 8 characters long."),

      confirmPassword: yup
         .string()
         .oneOf([yup.ref("newPassword"), null], "Passwords must match!")
         .required("Please confirm your new password"),
   });

   const toggleVisibility = (fieldname) => {
      setVisibleFields((prev) => ({
         ...prev,
         [fieldname]: !prev[fieldname],
      }));
   };

   const handleChange = (e) => {
      const { name, value } = e.target;

      setPasswordData({
         ...passwordData,
         [name]: value,
      });
   };

   const validatePasswords = async () => {
      try {
         await changePasswordSchema.validate(passwordData, {
            abortEarly: false,
         });

         setErrors({});

         return true;
      } catch (error) {
         const newErrors = {};

         error.inner.forEach((err) => {
            newErrors[err.path] = err.message;
         });

         setErrors(newErrors);
         return false;
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      const isValid = await validatePasswords();

      if (!isValid) return;

      try {
         setLoading(true);
         await changePassword({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
         });

         setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
         });

         toast.success("Password changed successfully!");
      } catch (err) {
         toast.error(
            err.response?.data?.message ||
               "Failed to change password. Please try again.",
         );
      } finally {
         setLoading(false);
      }
   };

   const passwordFields = [
      {
         name: "currentPassword",
         label: "Current Password",
         placeholder: "Enter current password",
      },
      {
         name: "newPassword",
         label: "New Password",
         placeholder: "Min 8 characters",
      },
      {
         name: "confirmPassword",
         label: "Confirm New Password",
         placeholder: "Re-enter new password",
      },
   ];

   return (
      <section className="profile-card card-full">
         <div className="card-header">
            <div className="card-title">
               <span className="card-icon">🔐</span>
               <h2>Change Password</h2>
            </div>
         </div>

         <form className="password-form" noValidate onSubmit={handleSubmit}>
            <div className="password-fields">
               {passwordFields.map((field, i) => {
                  const isVisible = visibleFields[field.name];

                  return (
                     <div className="form-group" key={i}>
                        <label htmlFor={field.name}>{field.label}</label>
                        <div className="input-wrap">
                           <HugeiconsIcon
                              icon={LockPasswordIcon}
                              className="input-icon"
                              strokeWidth={2}
                           />
                           <input
                              type={isVisible ? "text" : "password"}
                              value={passwordData[field.name]}
                              id={field.name}
                              name={field.name}
                              placeholder={field.placeholder}
                              onChange={handleChange}
                              autoComplete={
                                 i > 0 ? "new-password" : "current-password"
                              }
                           />
                           <button
                              type="button"
                              className="toggle-pw"
                              onClick={() => toggleVisibility(field.name)}
                              aria-label="Toggle password visibility"
                           >
                              <HugeiconsIcon
                                 icon={isVisible ? ViewIcon : ViewOffSlashIcon}
                                 size={15}
                              />
                           </button>
                        </div>
                        <span
                           className={`field-error ${errors[field.name] ? "show" : ""}`}
                        >
                           {errors[field.name]}
                        </span>
                     </div>
                  );
               })}
            </div>

            <div className="form-actions">
               <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={loading}
               >
                  {loading ? (
                     <span className="btn-loader">
                        <HugeiconsIcon
                           icon={Refresh01Icon}
                           size={14}
                           strokeWidth={2}
                           className="spin"
                        />
                     </span>
                  ) : (
                     <span className="btn-text">Update Password</span>
                  )}
               </button>
            </div>
            <div className="form-message hidden" id="passwordMessage"></div>
         </form>
      </section>
   );
};

const Profile = () => {
   const { user: currentUser, setUser: setGlobalUser } = useAuth();
   const [user, setUser] = useState(currentUser || null);

   useEffect(() => {
      const intialProfileGet = async () => {
         try {
            const responseData = await getProfile();

            if (responseData.success)
               setUser(responseData?.data?.user || responseData?.user);
            else toast.error(responseData.message);
         } catch (err) {
            toast.error(err.response?.data?.message || err.message);
         }
      };

      intialProfileGet();
   }, []);

   return (
      <>
         <Navbar />
         <main className="profile-main">
            {/* <!-- Page header --> */}
            <div className="profile-header">
               <div className="profile-avatar">
                  <span>
                     {getInitials(user?.name) || (
                        <HugeiconsIcon
                           icon={User02Icon}
                           size={48}
                           strokeWidth={2}
                        />
                     )}
                  </span>
               </div>
               <div className="profile-header-info">
                  <h1 className="profile-name">{user?.name || "Loading…"}</h1>
                  <p className="profile-role">{user?.role || "—"}</p>
                  <p className="profile-since">
                     Member since{" "}
                     <span>{formatDate(user?.created_at) || "—"}</span>
                  </p>
               </div>
            </div>

            {/* <!-- Cards grid --> */}
            <div className="profile-grid">
               {/* <!-- ── Card 1: Personal Info ── --> */}
               <PersonalInfoCard
                  key={user?.email || "Loading..."}
                  user={user}
                  setUser={setUser}
                  setGlobalUser={setGlobalUser}
               />

               {/* <!-- ── Card 2: Account Details ── --> */}
               <AccountDetailsCard user={user} />

               {/* <!-- ── Card 3: Change Password ── --> */}
               <ChangePasswordCard />
            </div>
         </main>
      </>
   );
};

export default Profile;
