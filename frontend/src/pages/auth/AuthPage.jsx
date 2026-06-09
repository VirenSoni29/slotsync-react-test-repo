import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "../../css/main.css";
import "../../css/auth.css";
import Navbar from "../../components/Navbar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
   Building04Icon,
   CalendarCheckIn01Icon,
   Call02Icon,
   CheckmarkCircle01Icon,
   LockPasswordIcon,
   Mail01Icon,
   Notification02Icon,
   TimeScheduleIcon,
   User03Icon,
   ViewIcon,
   ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { toast } from "sonner";
import useAuth from "../../hooks/useAuth";

const AuthNavbar = ({ mode }) => {
   return (
      <nav className="auth-nav">
         <Link to="/" className="nav-logo">
            <img src="/logo.svg" alt="SlotSync Logo" />
            SlotSync
         </Link>
         {mode === "login" ? (
            <span className="auth-nav-hint">
               Don't have an account?{" "}
               <Link className="a" to="/auth/register">
                  Sign up
               </Link>
            </span>
         ) : mode === "register" ? (
            <span className="auth-nav-hint">
               Already have an account?{" "}
               <Link className="a" to="/auth/login">
                  Log in
               </Link>
            </span>
         ) : (
            <span className="auth-nav-hint">
               Already registered?{" "}
               <Link className="a" to="/auth/login">
                  Log in
               </Link>
            </span>
         )}
      </nav>
   );
};

const LeftDecorativePanel = ({ mode }) => {
   return (
      <>
         <div className="auth-panel">
            {mode === "register" && (
               <div className="panel-content">
                  <div className="panel-tag">Join SlotSync</div>
                  <h2>
                     Book appointments
                     <br />
                     without the hassle.
                  </h2>
                  <p>
                     Create your free account and start booking slots from
                     hundreds of services near you.
                  </p>
                  <div className="panel-features">
                     <div className="panel-feature">
                        <HugeiconsIcon
                           icon={CheckmarkCircle01Icon}
                           strokeWidth={2}
                        />
                        <span>No booking fees</span>
                     </div>
                     <div className="panel-feature">
                        <HugeiconsIcon
                           icon={CheckmarkCircle01Icon}
                           strokeWidth={2}
                        />
                        <span>Instant confirmation via email</span>
                     </div>
                     <div className="panel-feature">
                        <HugeiconsIcon
                           icon={CheckmarkCircle01Icon}
                           strokeWidth={2}
                        />
                        <span>Cancel or reschedule anytime</span>
                     </div>
                  </div>
               </div>
            )}
            {mode === "login" && (
               <div className="panel-content">
                  <div className="panel-tag">Welcome back</div>
                  <h2>
                     Your appointments
                     <br />
                     are waiting.
                  </h2>
                  <p>
                     Log back in to view your upcoming bookings, manage your
                     schedule, and book new slots.
                  </p>
                  <div className="panel-features">
                     <div className="panel-feature">
                        <HugeiconsIcon icon={CalendarCheckIn01Icon} />
                        <span>View upcoming bookings</span>
                     </div>
                     <div className="panel-feature">
                        <HugeiconsIcon icon={Notification02Icon} />
                        <span>Get appointment reminders</span>
                     </div>
                     <div className="panel-feature">
                        <HugeiconsIcon icon={TimeScheduleIcon} />
                        <span>Reschedule with one click</span>
                     </div>
                  </div>
               </div>
            )}
            {mode === "business-register" && (
               <div className="panel-content">
                  <div className="panel-tag">For Businesses</div>
                  <h2>
                     Start accepting
                     <br />
                     bookings today.
                  </h2>
                  <p>
                     Set up your business on SlotSync in minutes. Manage slots,
                     track revenue, and let customers book themselves.
                  </p>
                  <div className="panel-features">
                     <div className="panel-feature">
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} />
                        <span>Full admin dashboard</span>
                     </div>
                     {/* <div className="panel-feature">
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} />
                        <span>Automated email reminders</span>
                     </div> */}
                     <div className="panel-feature">
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} />
                        <span>Razorpay payment integration</span>
                     </div>
                     <div className="panel-feature">
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} />
                        <span>Revenue & booking analytics</span>
                     </div>
                  </div>
               </div>
            )}
            <div className="panel-bg">
               <div className="panel-circle c1"></div>
               <div className="panel-circle c2"></div>
            </div>
         </div>
      </>
   );
};

const authModes = {
   login: {
      pageTitle: "Login",
      title: "Welcome back",
      subtitle: "Enter your credentials to continue",
      buttonText: "Log In",
      fields: ["email", "password"],
   },
   register: {
      pageTitle: "Register",
      title: "Create account",
      subtitle: "Fill in your details to get started",
      buttonText: "Create Account",
      fields: ["name", "email", "phone", "password"],
   },
   "business-register": {
      pageTitle: "Business Register",
      title: "Register your business",
      subtitle: "Create your admin account to get started",
      buttonText: "Create Business Account",
      fields: ["businessName", "name", "email", "phone", "password"],
   },
};

const RightAuthPanel = ({ mode }) => {
   const currentMode = authModes[mode];
   const navigate = useNavigate();
   const location = useLocation();
   const from = location.state?.from?.pathname;
   const { login, register } = useAuth();

   const createInitialFormData = (fields) => {
      const data = {};
      fields.forEach((fd) => {
         data[fd] = "";
      });
      return data;
   };

   const [formData, setFormData] = useState(
      createInitialFormData(currentMode.fields),
   );

   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const [errors, setErrors] = useState({});
   const [touched, setTouched] = useState({});

   const passwordSchema =
      mode === "login"
         ? yup.string().required("Password is required!")
         : yup
              .string()
              .required("Password is required!")
              .matches(
                 /[a-z]/,
                 "Password must contain at least 1 lowercase letter",
              )
              .matches(
                 /[A-Z]/,
                 "Password must contain at least 1 uppercase letter",
              )
              .matches(/[0-9]/, "Password must contain at least 1 number")
              .matches(
                 /[!@#$%^&*+_]/,
                 "Password must contain at least 1 of !@#$%^&*+_",
              )
              .min(8, "Password must be at least 8 characters");

   const getValidationSchema = () => {
      const baseSchema = {
         email: yup
            .string()
            .required("Email is required!")
            .email("Enter a valid email!"),
         password: passwordSchema,
      };
      if (mode === "register" || mode === "business-register") {
         baseSchema.name = yup
            .string()
            .required("Name is required!")
            .min(2, "Name must be at least 2 characters!");
         baseSchema.phone = yup
            .string()
            .required("Phone Number is required!")
            .matches(/^\d{10}$/, "Enter a valid 10-digit number!");
      }
      if (mode === "business-register") {
         baseSchema.businessName = yup
            .string()
            .required("Business Name is required!")
            .min(3, "Business Name must be at least 3 characters!");
      }
      return baseSchema;
   };

   const validationSchema = yup.object(getValidationSchema());

   const validateField = async (name, value) => {
      try {
         await validationSchema.validateAt(name, {
            ...formData,
            [name]: value,
         });

         setErrors({
            ...errors,
            [name]: "",
         });
      } catch (err) {
         setErrors({
            ...errors,
            [name]: err.message,
         });
      }
   };

   const handleChange = async (e) => {
      const { name, value } = e.target;

      let finalValue = value;

      if (name === "phone") {
         finalValue = value.replace(/\D/g, "");
      }

      setFormData({
         ...formData,
         [name]: finalValue,
      });

      if (touched[name]) {
         await validateField(name, finalValue);
      }
   };

   const handleBlur = async (e) => {
      const { name, value } = e.target;

      setTouched({
         ...touched,
         [name]: true,
      });

      await validateField(name, value);
   };

   const getPasswordStrength = () => {
      const val = formData.password;

      let score = 0;

      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      const labels = ["", "Weak", "Fair", "Good", "Strong"];
      const colors = ["", "#f87171", "#fbbf24", "#a78bfa", "#22d3a5"];

      return { score, label: labels[score], color: colors[score] };
   };
   const strength = getPasswordStrength();

   const validateForm = async () => {
      Object.keys(formData).forEach((field) => {
         setTouched({
            ...touched,
            [field]: true,
         });
      });
      try {
         await validationSchema.validate(formData, {
            abortEarly: false,
         });

         setErrors({});

         return true;
      } catch (err) {
         const newErrors = {};

         err.inner.forEach((error) => {
            newErrors[error.path] = error.message;
         });

         setErrors(newErrors);

         return false;
      }
   };

   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

   const handleSubmit = async () => {
      const isValid = await validateForm();

      if (isValid) {
         try {
            setLoading(true);
            let data;
            if (mode === "login") {

               data = await login(formData);
               toast.success(data.message);
               await delay(2000);
               navigate(from || "/", { replace: true });

            } else if (mode === "register") {

               data = await register(formData);
               toast.success(data.message);
               sessionStorage.setItem("pendingEmail", formData.email);
               sessionStorage.setItem("otpPurpose", "register");

               navigate("/auth/verify-otp");
            }

         } catch (err) {
            toast.error(err.response?.data?.message || err.message);
         } finally {
            setLoading(false);
         }
      } else {
         toast.warning("Fill in the form correctly");
      }
   };

   const getFieldInputWrapClassName = (field) => {
      return `field-input-wrap ${errors[field] ? "error" : ""} ${touched[field] && !errors[field] && formData[field] ? "success" : ""}`;
   };

   return (
      <div className="auth-card">
         <div className="auth-card-header">
            <h1>{currentMode.title}</h1>
            <p>{currentMode.subtitle}</p>
         </div>

         <div className="auth-fields">
            {mode === "business-register" && (
               <div className="field-group">
                  <label htmlFor="businessName">Business Name</label>
                  <div className={getFieldInputWrapClassName("businessName")}>
                     <HugeiconsIcon
                        icon={Building04Icon}
                        className="input-icon"
                     />
                     <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        placeholder="e.g. Sharma's Salon"
                        autoComplete="organization"
                        value={formData.businessName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={50}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") handleSubmit();
                        }}
                     />
                  </div>
                  <span
                     className={`field-error ${errors.businessName ? "show" : ""}`}
                  >
                     {errors.businessName || ""}
                  </span>
               </div>
            )}

            {mode !== "login" && (
               <div className={mode === "register" && "field-row"}>
                  <div className="field-group">
                     <label htmlFor="name">
                        {mode === "business-register" && "Owner's"} Full Name
                     </label>
                     <div className={getFieldInputWrapClassName("name")}>
                        <HugeiconsIcon
                           icon={User03Icon}
                           className="input-icon"
                        />
                        <input
                           type="text"
                           id="name"
                           name="name"
                           placeholder="Rahul Sharma"
                           autoComplete="name"
                           value={formData.name}
                           onChange={handleChange}
                           onBlur={handleBlur}
                           maxLength={30}
                           onKeyDown={(e) => {
                              if (e.key === "Enter") handleSubmit();
                           }}
                        />
                     </div>
                     <span
                        className={`field-error ${errors.name ? "show" : ""}`}
                     >
                        {errors.name || ""}
                     </span>
                  </div>
               </div>
            )}

            <div className="field-group">
               <label htmlFor="email">
                  {mode === "business-register"
                     ? "Business Email"
                     : "Email Address"}
               </label>
               <div className={getFieldInputWrapClassName("email")}>
                  <HugeiconsIcon icon={Mail01Icon} className="input-icon" />
                  <input
                     type="email"
                     id="email"
                     name="email"
                     inputMode="email"
                     placeholder={
                        mode === "business-register"
                           ? "hello@yourbusiness.com"
                           : "rahul@example.com"
                     }
                     autoComplete="email"
                     value={formData.email}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     maxLength={60}
                     onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                     }}
                  />
               </div>
               <span className={`field-error ${errors.email ? "show" : ""}`}>
                  {errors.email || ""}
               </span>
            </div>

            {mode !== "login" && (
               <div className="field-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className={getFieldInputWrapClassName("phone")}>
                     <HugeiconsIcon icon={Call02Icon} className="input-icon" />
                     <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="9876543210"
                        maxLength={10}
                        inputMode="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyDown={(e) => {
                           if (e.key === "Enter") handleSubmit();
                        }}
                     />
                  </div>
                  <span className={`field-error ${errors.phone ? "show" : ""}`}>
                     {errors.phone || ""}
                  </span>
               </div>
            )}

            <div className="field-group">
               <label htmlFor="password">
                  Password
                  {mode === "login" && (
                     <Link
                        to="/auth/forgot-password"
                        className="field-label-link"
                     >
                        Forgot password?
                     </Link>
                  )}
               </label>
               <div className={getFieldInputWrapClassName("password")}>
                  <HugeiconsIcon
                     icon={LockPasswordIcon}
                     className="input-icon"
                  />
                  <input
                     type={showPassword ? "text" : "password"}
                     id="password"
                     name="password"
                     placeholder={
                        mode === "login"
                           ? "Your password"
                           : "Minimum 8 characters"
                     }
                     autoComplete="new-password"
                     value={formData.password}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit();
                     }}
                  />
                  <button
                     type="button"
                     className="field-toggle"
                     aria-label="Toggle password"
                     onClick={() => setShowPassword(!showPassword)}
                  >
                     <HugeiconsIcon
                        icon={showPassword ? ViewIcon : ViewOffSlashIcon}
                        strokeWidth={2.5}
                     />
                  </button>
               </div>
               <span className={`field-error ${errors.password ? "show" : ""}`}>
                  {errors.password || ""}
               </span>
               {mode !== "login" && (
                  <>
                     <div className="strength-bar">
                        <div
                           className="strength-fill"
                           style={{
                              width: `${strength.score * 25}%`,
                              backgroundColor: strength.color,
                           }}
                        ></div>
                     </div>
                     <span className="strength-label">{strength.label}</span>
                  </>
               )}
            </div>
         </div>

         <button className="btn-primary btn-full" onClick={handleSubmit} disabled={loading}>
            {loading ? (
               <span className="btn-spinner"></span>
            ) : (
               currentMode.buttonText
            )}
         </button>
         {mode === "login" ? (
            <>
               <div className="auth-divider">
                  <span>or</span>
               </div>

               <p className="auth-switch">
                  New to SlotSync?{" "}
                  <Link to="/auth/register">Create a free account</Link>
               </p>

               <div className="auth-divider">
                  <span>or</span>
               </div>

               <p className="auth-switch">
                  Want to manage appointments using SlotSync?{" "}
                  <Link to="/auth/business-register">
                     Create a free business account
                  </Link>
               </p>
            </>
         ) : (
            <p className="auth-terms">
               By signing up you agree to our <a href="#">Terms of Service</a>{" "}
               and <a href="#">Privacy Policy</a>.
            </p>
         )}
      </div>
   );
};

const AuthPage = () => {
   const { mode } = useParams();

   useEffect(() => {
      document.title = `${authModes[mode].pageTitle} - SlotSync`;
   }, [mode]);

   return (
      <div className="auth-page">
         <AuthNavbar mode={mode} />
         <main className="auth-main">
            <LeftDecorativePanel mode={mode} />
            <div className="auth-form-wrap">
               <RightAuthPanel mode={mode} key={mode} />
            </div>
         </main>
      </div>
   );
};

export default AuthPage;
