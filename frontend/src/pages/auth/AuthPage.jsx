import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "../../css/main.css";
import "../../css/auth.css";
import { HugeiconsIcon } from "@hugeicons/react";
import {
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
         ) : (
            <span className="auth-nav-hint">
               Already have an account?{" "}
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
};

const RightAuthPanel = ({ mode }) => {
   const currentMode = authModes[mode] || authModes.register;
   const navigate = useNavigate();
   const location = useLocation();
   const from = location.state?.from?.pathname;
   const { login, register, sendOtpToVerify } = useAuth();

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
      if (mode === "register") {
         baseSchema.name = yup
            .string()
            .required("Name is required!")
            .min(2, "Name must be at least 2 characters!");
         baseSchema.phone = yup
            .string()
            .required("Phone Number is required!")
            .matches(/^\d{10}$/, "Enter a valid 10-digit number!");
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
            if (mode === "login") {
               try {
                  const data = await login(formData);
                  toast.success(data.message || "Logged in successfully!");
                  await delay(1000);
                  navigate(from || "/", { replace: true });
               } catch (err) {
                  const msg = err.response?.data?.message || err.message || "";
                  // Check if the account is not verified
                  if (
                     msg.toLowerCase().includes("not verified") ||
                     msg.toLowerCase().includes("verify your email") ||
                     (err.response?.status === 401 && msg.toLowerCase().includes("verify"))
                  ) {
                     toast.info("Account is not verified yet. Sending verification code...");
                     try {
                        await sendOtpToVerify({ email: formData.email, purpose: "register" });
                     } catch (otpErr) {
                        console.log("Send OTP response:", otpErr);
                     }
                     sessionStorage.setItem("pendingEmail", formData.email);
                     sessionStorage.setItem("otpPurpose", "register");
                     toast.success("Verification code sent! Please verify your email.");
                     navigate("/auth/verify-otp");
                     return;
                  }
                  toast.error(msg);
               }
            } else if (mode === "register") {
               const data = await register(formData);
               toast.success(data.message || "Account created! Verification code sent.");
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
            {mode !== "login" && (
               <div className="field-group">
                  <label htmlFor="name">Full Name</label>
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
            )}

            <div className="field-group">
               <label htmlFor="email">Email Address</label>
               <div className={getFieldInputWrapClassName("email")}>
                  <HugeiconsIcon icon={Mail01Icon} className="input-icon" />
                  <input
                     type="email"
                     id="email"
                     name="email"
                     inputMode="email"
                     placeholder="rahul@example.com"
                     autoComplete="email"
                     value={formData.email}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     maxLength={40}
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
   const activeMode = authModes[mode] ? mode : "register";

   useEffect(() => {
      document.title = `${authModes[activeMode].pageTitle} - SlotSync`;
   }, [activeMode]);

   return (
      <div className="auth-page">
         <AuthNavbar mode={activeMode} />
         <main className="auth-main">
            <LeftDecorativePanel mode={activeMode} />
            <div className="auth-form-wrap">
               <RightAuthPanel mode={activeMode} key={activeMode} />
            </div>
         </main>
      </div>
   );
};

export default AuthPage;
