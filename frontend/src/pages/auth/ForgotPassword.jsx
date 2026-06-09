import {
   ArrowLeft01Icon,
   LockPasswordIcon,
   Mail01Icon,
   Refresh01Icon,
   ViewIcon,
   ViewOffSlashIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "../../hooks/useAuth";
import * as yup from "yup";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const EmailStep = ({ email, setEmail, setStep, errors, setErrors }) => {
   const { forgotPasswordOtp } = useAuth();

   const [loading, setLoading] = useState(false);

   const emailSchema = yup.object({
      email: yup
         .string()
         .required("Email is required!")
         .email("Invalid Email format!"),
   });

   const validateEmail = async (value) => {
      try {
         await emailSchema.validate({ email: value });

         setErrors((prev) => ({
            ...prev,
            email: "",
         }));

         return true;
      } catch (err) {
         setErrors((prev) => ({
            ...prev,
            email: err.message,
         }));

         return false;
      }
   };

   const handleBlur = async (e) => {
      const { value } = e.target;

      await validateEmail(value);
   };

   const handleSendResetCode = async () => {
      const isValid = await validateEmail(email);

      if (isValid) {
         setLoading(true);

         try {
            await forgotPasswordOtp({ email });

            toast.success("Reset code sent to your email");

            await delay(800);
            setStep(2);
         } catch (err) {
            toast.error(
               err.response?.data?.message ||
                  "Something went wrong. Please try again.",
            );
         } finally {
            setLoading(false);
         }
      }
   };

   return (
      <div className="auth-card otp-card">
         <div className="otp-icon-wrap">
            <HugeiconsIcon
               icon={LockPasswordIcon}
               size={29}
               strokeWidth={2.5}
            />
         </div>

         <div className="auth-card-header">
            <h1>Forgot password?</h1>
            <p>Enter your email and we'll send you a reset code.</p>
         </div>

         <div className="auth-fields">
            <div className="field-group">
               <label htmlFor="email">Email Address</label>
               <div className="field-input-wrap">
                  <HugeiconsIcon icon={Mail01Icon} className="input-icon" />
                  <input
                     type="email"
                     name="email"
                     id="email"
                     autoComplete="email"
                     inputMode="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendResetCode()
                     }}
                     onBlur={handleBlur}
                     placeholder="rahul@example.com"
                     maxLength={50}
                  />
               </div>
               <span className={`field-error ${errors.email ? "show" : ""}`}>
                  {errors.email || ""}
               </span>
            </div>
         </div>

         <button
            className="btn-primary btn-full"
            disabled={loading}
            onClick={handleSendResetCode}
         >
            {loading ? (
               <span className="btn-spinner"></span>
            ) : (
               <span>Send Reset Code</span>
            )}
         </button>

         <Link to="/auth/login" className="auth-back-link">
            <HugeiconsIcon icon={ArrowLeft01Icon} />
            Back to login
         </Link>
      </div>
   );
};

const ResetStep = ({ email, errors, setErrors }) => {
   const { forgotPasswordOtp, resetUserPassword } = useAuth();
   const navigate = useNavigate()

   const [loading, setLoading] = useState(false);
   const [countdown, setCountdown] = useState(30);
   const [resendLoading, setResendLoading] = useState(false);

   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
   const [newPassword, setNewPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);

   const inputRefs = useRef([]);
   const [otpError, setOtpError] = useState(false);

   useEffect(() => {
      inputRefs.current[0].focus();
   }, []);

   useEffect(() => {
      if (countdown <= 0) return;

      const timer = setInterval(() => {
         setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
   }, [countdown]);

   const handleOtpChange = (index, val) => {
      const cleaned = val.replace(/\D/g, "");

      const updatedOtps = [...otp];
      updatedOtps[index] = cleaned;

      setOtp(updatedOtps);

      if (cleaned && index < 5) {
         inputRefs.current[index + 1].focus();
      }
   };

   const handlePaste = (e) => {
      e.preventDefault()

      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
      const updatedOtps = [...otp]

      pasted.split('').forEach((char, i) => {
         updatedOtps[i] = char
      });

      setOtp(updatedOtps)
      const lastIndex = Math.min(pasted.length, 5)
      inputRefs.current[lastIndex].focus()
   }

   const passwordSchema = yup.object({
      newPassword: yup
         .string()
         .required("New Password is required!")
         .matches(/[a-z]/, "Password must contain at least 1 lowercase letter")
         .matches(/[A-Z]/, "Password must contain at least 1 uppercase letter")
         .matches(/[0-9]/, "Password must contain at least 1 number")
         .matches(
            /[!@#$%^&*+_]/,
            "Password must contain at least 1 of !@#$%^&*+_",
         )
         .min(8, "Password must be at least 8 characters"),
   });

   const validatePassword = async () => {
      try {
         await passwordSchema.validate({ newPassword })

         setErrors({
            ...errors,
            newPassword: ''
         })

         return true
      } catch (err) {
         setErrors({
            ...errors,
            newPassword: err.message
         })

         return false
      }
   }

   const shakeBoxes = async (msg) => {
      setOtpError(true);
      toast.error(msg);
      await delay(500);
      setOtpError(false);
   };

   const handleBackspace = (index) => {
      const updatedOtps = [...otp];

      if (!updatedOtps[index] && index > 0) {
         inputRefs.current[index - 1].focus();
      }

      updatedOtps[index] = "";

      setOtp(updatedOtps);
   };

   const handleResetPassword = async () => {
      const otpValue = otp.join("");

      if (otpValue.length < 6) {
         await shakeBoxes("Please enter full 6-digit otp!");
         return;
      }

      const isValid = await validatePassword()

      if (isValid) {
         setLoading(true)

         try {
            await resetUserPassword({ email, otp_code: otpValue, new_password: newPassword })

            toast.success('Password reset! Redirecting to login...')

            await delay(1500)
            navigate('/auth/login', { replace: true })
         } catch (err) {
            shakeBoxes(err.response?.data?.message || 'Reset failed. Please try again.')
         } finally {
            setLoading(false)
         }
      }
   }

   const handleResend = async () => {
      setResendLoading(true);

      try {
         await forgotPasswordOtp({ email });
         setOtp(["", "", "", "", "", ""]);

         toast.success("New code sent to your email!");

         inputRefs.current[0].focus();
         setCountdown(30);
      } catch (err) {
         toast.error(
            err.response?.data?.message || "Could not resend. Try again.",
         );
      } finally {
         setResendLoading(false);
      }
   };

   return (
      <div className="auth-card otp-card">
         <div className="otp-icon-wrap">🔐</div>

         <div className="auth-card-header">
            <h1>Reset password</h1>
            <p>
               Enter the code sent to
               <br />
               <strong>{email}</strong>
            </p>
         </div>

         {/* <!-- OTP boxes --> */}
         <div className="otp-inputs">
            {otp.map((_, index) => (
               <input
                  key={index}
                  type="text"
                  className={`otp-box ${otp[index] ? "filled" : ""} ${otpError ? "error" : ""}`}
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                     if (e.key === "Backspace") handleBackspace(index);
                  }}
                  onPaste={handlePaste}
                  inputMode="numeric"
                  pattern="[0-9]"
                  ref={(element) => {
                     inputRefs.current[index] = element;
                  }}
               />
            ))}
         </div>

         {/* <!-- New password --> */}
         <div className="auth-fields" style={{ marginTop: "20px" }}>
            <div className="field-group">
               <label htmlFor="newPassword">New Password</label>
               <div className="field-input-wrap">
                  <HugeiconsIcon
                     icon={LockPasswordIcon}
                     className="input-icon"
                  />
                  <input
                     type={showPassword ? "text" : "password"}
                     id="newPassword"
                     placeholder="Minimum 8 characters"
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter') handleResetPassword()
                     }}
                     autoComplete="new-password"
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
               <span className={`field-error ${errors.newPassword ? 'show' : ''}`}>{errors.newPassword || ''}</span>
            </div>
         </div>

         <button className="btn-primary btn-full" disabled={loading} onClick={handleResetPassword}>
            {loading ? (
               <span className="btn-spinner"></span>
            ) : (
               <span>Reset Password</span>
            )}
         </button>

         {/* <!-- Resend timer --> */}
         <div className="otp-resend">
            {countdown > 0 ? (
               <span>
                  Resend code in <strong>{countdown}</strong>s
               </span>
            ) : (
               <button
                  className="otp-resend-btn"
                  onClick={handleResend}
                  disabled={resendLoading}
               >
                  <HugeiconsIcon icon={Refresh01Icon} size={14.4} />
                  Resend code
               </button>
            )}
         </div>
      </div>
   );
};

const ForgotPassword = () => {
   const [step, setStep] = useState(1);

   const [email, setEmail] = useState("");

   const [errors, setErrors] = useState({});

   return (
      <div className="auth-page">
         <nav className="auth-nav">
            <Link to="/" className="nav-logo">
               <img src="/logo.svg" alt="SlotSync Logo" />
               SlotSync
            </Link>
            <span className="auth-nav-hint">
               Remembered it?
               <Link to="/auth/login" className="a">
                  Log in
               </Link>
            </span>
         </nav>

         <main className="auth-main auth-main-centered">
            {/* <!-- Step 1 — Enter email --> */}
            {step === 1 && (
               <EmailStep
                  email={email}
                  setEmail={setEmail}
                  setStep={setStep}
                  errors={errors}
                  setErrors={setErrors}
               />
            )}

            {/* <!-- Step 2 — Enter OTP + new password (hidden initially) --> */}
            {step === 2 && (
               <ResetStep email={email} errors={errors} setErrors={setErrors} />
            )}
         </main>
      </div>
   );
};

export default ForgotPassword;
