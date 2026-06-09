import { ArrowLeft01Icon, MailSend01Icon, Refresh01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "../../hooks/useAuth";

const VerifyOtp = () => {
   const { verifyUserWithOtp, sendOtpToVerify } = useAuth();

   const navigate = useNavigate();
   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
   const [isVerified, setIsVerified] = useState(false)
   const [loading, setLoading] = useState(false);
   const [countdown, setCountdown] = useState(30);
   const [resendLoading, setResendLoading] = useState(false)

   const [otpError, setOtpError] = useState(false);

   const inputRefs = useRef([]);

   const email = sessionStorage.getItem("pendingEmail");
   const purpose = sessionStorage.getItem("otpPurpose") || "register";

   useEffect(() => {
      if (!email && !loading && !isVerified) navigate("/auth/register", { replace: true });
      inputRefs.current[0].focus()
   }, [email, navigate, loading, isVerified]);

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
      } else if (cleaned && index === 5) {
         verifyOtp(updatedOtps)
      }
   };

   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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

   const handlePaste = (e) => {
      e.preventDefault()

      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
      const updatedOtps = [...otp]

      pasted.split('').forEach((char, i) => {
         updatedOtps[i] = char
      });

      setOtp(updatedOtps)
   }

   const verifyOtp = async (currentOtpArray = otp) => {
      const otpVal = currentOtpArray.join('')

      if (otpVal.length !== 6) {
         await shakeBoxes("Please enter the complete 6-digit code.")
         return;
      }

      setLoading(true);

      try {
         await verifyUserWithOtp({ email, otp_code: otpVal, purpose });
         setIsVerified(true)
         toast.success("Email verified! Redirecting to login...");

         sessionStorage.removeItem("pendingEmail");
         sessionStorage.removeItem("otpPurpose");

         await delay(1200);
         navigate("/auth/login");
      } catch (err) {
         await shakeBoxes(err.response?.data?.message || "Invalid or expired code. Try again.")
      } finally {
         setLoading(false);
      }
   };

   const handleResend = async () => {
      setResendLoading(true)
      
      try {
         await sendOtpToVerify({ email, purpose })
         setOtp(['','','','','',''])

         toast.success('New code sent! Check your email.')

         inputRefs.current[0].focus()
         setCountdown(30)
      } catch (err) {
         toast.error(err.response?.data?.message || 'Could not resend. Try again.')
      } finally {
         setResendLoading(false)
      }
   }

   return (
      <div className="auth-page">
         <nav className="auth-nav">
            <Link to="/" className="nav-logo">
               <img src="/logo.svg" alt="SlotSync Logo" />
               SlotSync
            </Link>
         </nav>

         <main className="auth-main auth-main-centered">
            <div className="auth-card otp-card">
               <div className="otp-icon-wrap">
                  <HugeiconsIcon icon={MailSend01Icon} size={29} strokeWidth={2.5} />
               </div>

               <div className="auth-card-header">
                  <h1>Check your email</h1>
                  <p>
                     We sent a 6-digit code to
                     <br />
                     <strong>{email || "your email address"}</strong>
                  </p>
               </div>

               <div className="otp-inputs" id="otpInputs">
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

               <button
                  className="btn-primary btn-full"
                  onClick={() => verifyOtp()}
                  disabled={loading}
               >
                  {loading ? (
                     <span className="btn-spinner"></span>
                  ) : (
                     <span>Verify Code</span>
                  )}
               </button>

               <div className="otp-resend">
                  {countdown > 0 ? (
                     <span id="resendTimer">
                        Resend code in <strong>{countdown}</strong>s
                     </span>
                  ) : (
                     <button className="otp-resend-btn" onClick={handleResend} disabled={resendLoading}>
                        <HugeiconsIcon icon={Refresh01Icon} size={14.4} />
                        Resend code
                     </button>
                  )}
               </div>

               <Link to="/auth/register" className="auth-back-link">
                  <HugeiconsIcon icon={ArrowLeft01Icon} />
                  Back to register
               </Link>
            </div>
         </main>
      </div>
   );
};

export default VerifyOtp;
