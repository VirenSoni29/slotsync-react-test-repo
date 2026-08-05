import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/main.css";
import "../css/booking.css";
import { getServiceDetails, getSlots } from "../services/servicesService";
import { createBooking } from "../services/bookingService";
import {
   createPaymentOrder,
   verifyPayment,
} from "../services/paymentService";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import getServiceIcon from "../helpers/getServiceIcon";
import {
   ArrowLeft01Icon,
   ArrowRight01Icon,
   Calendar02Icon,
   Clock01Icon,
   ShieldKeyIcon,
   Loading01Icon,
} from "@hugeicons/core-free-icons";
import formatTime from "../helpers/formatTime";
import { formatDateAndDay } from "../helpers/formatDate";

const loadRazorpayScript = () => {
   return new Promise((resolve) => {
      if (window.Razorpay) {
         resolve(true);
         return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
   });
};

const Book = () => {
   const [searchParams] = useSearchParams();
   const serviceId = searchParams.get("service");
   const navigate = useNavigate();

   // Flow step state (1: Service, 2: Slot, 3: Confirm & Pay, 4: Success)
   const [step, setStep] = useState(1);

   // Service & Slots State
   const [selectedService, setSelectedService] = useState(null);
   const [serviceLoading, setServiceLoading] = useState(true);
   const [selectedSlot, setSelectedSlot] = useState(null);
   const [slots, setSlots] = useState([]);
   const [slotsLoading, setSlotsLoading] = useState(false);
   const [bookingNotes, setBookingNotes] = useState("");

   const today = new Date().toISOString().split("T")[0];
   const [selectedDate, setSelectedDate] = useState(today);

   // Payment State
   const [payLoading, setPayLoading] = useState(false);
   const [bookingError, setBookingError] = useState("");
   const [confirmedBookingDetails, setConfirmedBookingDetails] = useState(null);

   useEffect(() => {
      if (!serviceId) {
         navigate("/services");
         return;
      }

      let isMounted = true;
      const fetchService = async () => {
         try {
            const res = await getServiceDetails(serviceId);
            if (res.success && isMounted) {
               setSelectedService(res.data);
               document.title = `Book ${res.data.service_name} — SlotSync`;
            }
         } catch (err) {
            if (isMounted) {
               toast.error(
                  err.response?.data?.message ||
                     "Failed to load service details.",
               );
            }
         } finally {
            if (isMounted) setServiceLoading(false);
         }
      };

      fetchService();
      return () => {
         isMounted = false;
      };
   }, [serviceId, navigate]);

   const loadSlotsForDate = async (
      date,
      bizId = selectedService?.business_id,
   ) => {
      setSlotsLoading(true);
      setSelectedSlot(null);
      try {
         const res = await getSlots(date, bizId);
         setSlots(res.data || []);
      } catch (err) {
         toast.error(
            err.response?.data?.message || "Failed to load time slots.",
         );
         setSlots([]);
      } finally {
         setSlotsLoading(false);
      }
   };

   const handleStep1Next = () => {
      if (!selectedService) return;
      setStep(2);
      loadSlotsForDate(selectedDate, selectedService.business_id);
   };

   const handleDateChange = (e) => {
      const newDate = e.target.value;
      setSelectedDate(newDate);
      loadSlotsForDate(newDate, selectedService?.business_id);
   };

   const handlePaymentSubmit = async () => {
      if (!selectedService || !selectedSlot) return;

      setPayLoading(true);
      setBookingError("");

      try {
         // 1. Create booking in backend
         const bookingRes = await createBooking({
            service_id: parseInt(serviceId),
            slot_id: parseInt(selectedSlot.id),
            notes: bookingNotes.trim() || undefined,
         });

         const createdBookingId = bookingRes.data?.id;

         // 2. Create Payment Order
         const orderRes = await createPaymentOrder({
            booking_id: createdBookingId,
         });

         const orderData = orderRes.data || {};

         // Load Razorpay SDK and launch Checkout Modal
         const scriptLoaded = await loadRazorpayScript();
         if (!scriptLoaded) {
            throw new Error(
               "Failed to load Razorpay SDK. Please check your internet connection.",
            );
         }

         const options = {
            key: orderData.key_id,
            amount: orderData.amount,
            currency: orderData.currency || "INR",
            name: "SlotSync",
            description: selectedService.service_name,
            order_id: orderData.order_id,
            theme: { color: "#6c63ff" },
            handler: async function (response) {
               try {
                  await verifyPayment({
                     booking_id: createdBookingId,
                     razorpay_order_id: response.razorpay_order_id,
                     razorpay_payment_id: response.razorpay_payment_id,
                     razorpay_signature: response.razorpay_signature,
                  });
                  setConfirmedBookingDetails({
                     serviceName: selectedService.service_name,
                     date: selectedDate,
                     time: selectedSlot.start_time,
                     price: selectedService.price,
                  });
                  setStep(4);
                  toast.success("Payment verified! Booking confirmed.");
               } catch {
                  setBookingError(
                     "Payment verification failed. Please contact support.",
                  );
                  toast.error("Payment verification failed.");
               } finally {
                  setPayLoading(false);
               }
            },
            modal: {
               ondismiss: function () {
                  setPayLoading(false);
                  toast.info("Payment popup closed.");
               },
            },
         };

         const rzp = new window.Razorpay(options);
         rzp.open();
      } catch (err) {
         setBookingError(
            err.response?.data?.message ||
               err.message ||
               "Failed to process booking.",
         );
         toast.error("Booking creation failed.");
         setPayLoading(false);
      }
   };

   return (
      <>
         <Navbar />

         <main className="booking-layout">
            {/* Left Steps Area */}
            <div className="booking-steps-wrap">
               {step < 4 && (
                  <>
                     {/* Step Indicator Bar */}
                     <div className="step-indicator">
                        <div
                           className={`step-dot ${step === 1 ? "active" : step > 1 ? "done" : ""}`}
                           onClick={() => setStep(1)}
                        >
                           1
                        </div>
                        <div
                           className={`step-line ${step > 1 ? "done" : ""}`}
                        ></div>
                        <div
                           className={`step-dot ${step === 2 ? "active" : step > 2 ? "done" : ""}`}
                           onClick={() => {
                              if (step > 1) setStep(2);
                           }}
                        >
                           2
                        </div>
                        <div
                           className={`step-line ${step > 2 ? "done" : ""}`}
                        ></div>
                        <div
                           className={`step-dot ${step === 3 ? "active" : step > 3 ? "done" : ""}`}
                           onClick={() => {
                              if (selectedSlot !== null) setStep(3);
                           }}
                        >
                           3
                        </div>
                     </div>
                     <div className="step-labels">
                        <span
                           className={`step-label ${step === 1 ? "active" : step > 1 ? "done" : ""}`}
                        >
                           Service
                        </span>
                        <span
                           className={`step-label ${step === 2 ? "active" : step > 2 ? "done" : ""}`}
                        >
                           Date & Slot
                        </span>
                        <span
                           className={`step-label ${step === 3 ? "active" : step > 3 ? "done" : ""}`}
                        >
                           Payment
                        </span>
                     </div>
                  </>
               )}

               {/* ── Step 1: Service details ── */}
               {step === 1 && (
                  <div className="booking-step">
                     <h2>Your Service</h2>

                     {serviceLoading ? (
                        <div className="step-loading">
                           <div className="loading-spinner"></div>
                           <p>Loading service details...</p>
                        </div>
                     ) : selectedService ? (
                        <>
                           <div className="selected-service">
                              <div className="selected-service-icon">
                                 <HugeiconsIcon
                                    icon={getServiceIcon(
                                       selectedService.service_name,
                                    )}
                                    size={24}
                                    strokeWidth={2.5}
                                    className="text-(--clr-accent-2)"
                                 />
                              </div>
                              <div className="selected-service-info">
                                 <h3>{selectedService.service_name}</h3>
                                 {selectedService.business_name && (
                                    <span className="text-[0.8rem] text-(--clr-accent-2) font-semibold flex items-center gap-1 mt-0.5 mb-1">
                                       🏢 {selectedService.business_name}
                                    </span>
                                 )}
                                 <p>
                                    {selectedService.description ||
                                       "Professional service available for booking."}
                                 </p>
                                 <div className="selected-service-meta">
                                    <span className="meta-chip">
                                       <HugeiconsIcon
                                          icon={Clock01Icon}
                                          strokeWidth={2}
                                          size={13}
                                       />
                                       <span>{`${selectedService.duration_minutes} min`}</span>
                                    </span>
                                    <span className="meta-chip price-chip">
                                       ₹<span>{selectedService.price}</span>
                                    </span>
                                 </div>
                              </div>
                           </div>

                           <div className="field-group mt-5">
                              <label htmlFor="bookingNotes">
                                 Notes for the provider{" "}
                                 <span className="optional">(optional)</span>
                              </label>
                              <textarea
                                 id="bookingNotes"
                                 placeholder="Any special requests or information..."
                                 rows="3"
                                 value={bookingNotes}
                                 onChange={(e) =>
                                    setBookingNotes(e.target.value)
                                 }
                              ></textarea>
                           </div>
                        </>
                     ) : (
                        <p className="text-(--clr-red) py-4">
                           Service not found.{" "}
                           <Link to="/services">Browse services</Link>
                        </p>
                     )}

                     <button
                        className="btn-primary btn-full step-btn"
                        onClick={handleStep1Next}
                        disabled={serviceLoading || !selectedService}
                     >
                        Continue to Pick a Slot
                        <HugeiconsIcon
                           icon={ArrowRight01Icon}
                           strokeWidth={2}
                           size={15}
                        />
                     </button>
                  </div>
               )}

               {/* ── Step 2: Date + Slot ── */}
               {step === 2 && (
                  <div className="booking-step">
                     <h2>Pick a Date & Slot</h2>

                     <div className="field-group">
                        <label htmlFor="datePicker">Select Date</label>
                        <input
                           type="date"
                           id="datePicker"
                           className="date-input"
                           min={today}
                           value={selectedDate}
                           onChange={handleDateChange}
                        />
                     </div>

                     {/* Slots Area */}
                     <div>
                        <div className="slots-label">
                           Available time slots
                           <span>{formatDateAndDay(selectedDate)}</span>
                        </div>

                        {slotsLoading ? (
                           <div className="step-loading flex items-center justify-center py-6">
                              <div className="loading-spinner"></div>
                           </div>
                        ) : slots.length === 0 ? (
                           <div className="no-slots">
                              😕 No slots available for this date. Try another
                              day.
                           </div>
                        ) : (
                           <div className="slots-grid">
                              {slots.map((slot) => (
                                 <button
                                    key={slot.id}
                                    className={`slot-time-btn ${selectedSlot?.id === slot.id ? "selected" : ""}`}
                                    onClick={() => setSelectedSlot(slot)}
                                 >
                                    {formatTime(slot.start_time)}
                                 </button>
                              ))}
                           </div>
                        )}
                     </div>

                     <div className="step-btns">
                        <button
                           className="btn-outline step-btn"
                           onClick={() => setStep(1)}
                        >
                           <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
                           Back
                        </button>
                        <button
                           className="btn-primary step-btn"
                           onClick={() => setStep(3)}
                           disabled={!selectedSlot}
                        >
                           Continue to Payment
                           <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
                        </button>
                     </div>
                  </div>
               )}

               {/* ── Step 3: Confirm + Pay ── */}
               {step === 3 && selectedService && selectedSlot && (
                  <div className="booking-step">
                     <h2>Confirm & Pay</h2>

                     <div className="booking-summary">
                        <div className="summary-row">
                           <span className="summary-label">
                              <HugeiconsIcon
                                 icon={Calendar02Icon}
                                 size={14}
                                 strokeWidth={2}
                              />
                              Service
                           </span>
                           <span className="summary-value">
                              {selectedService.service_name}
                           </span>
                        </div>
                        {selectedService.business_name && (
                           <div className="summary-row">
                              <span className="summary-label">
                                 <HugeiconsIcon
                                    icon={Calendar02Icon}
                                    size={14}
                                    strokeWidth={2}
                                 />
                                 Provider
                              </span>
                              <span className="summary-value text-(--clr-accent-2) font-semibold">
                                 {selectedService.business_name}
                              </span>
                           </div>
                        )}
                        <div className="summary-row">
                           <span className="summary-label">
                              <HugeiconsIcon
                                 icon={Calendar02Icon}
                                 size={14}
                                 strokeWidth={2}
                              />
                              Date
                           </span>
                           <span className="summary-value">
                              {formatDateAndDay(selectedDate)}
                           </span>
                        </div>
                        <div className="summary-row">
                           <span className="summary-label">
                              <HugeiconsIcon
                                 icon={Clock01Icon}
                                 size={14}
                                 strokeWidth={2}
                              />
                              Time
                           </span>
                           <span className="summary-value">
                              {formatTime(selectedSlot.start_time)}
                           </span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row summary-total">
                           <span className="summary-label">Total</span>
                           <span className="summary-value">
                              ₹{selectedService.price}
                           </span>
                        </div>
                     </div>

                     <div className="payment-note">
                        <HugeiconsIcon
                           icon={ShieldKeyIcon}
                           size={16}
                           strokeWidth={2}
                           className="text-(--clr-green)"
                        />
                        Payments secured by Razorpay. Your card details are
                        never stored.
                     </div>

                     {bookingError && (
                        <div
                           className="booking-error mb-4"
                           style={{ display: "block" }}
                        >
                           {bookingError}
                        </div>
                     )}

                     <button
                        className="btn-primary btn-full step-btn"
                        onClick={handlePaymentSubmit}
                        disabled={payLoading}
                     >
                        {payLoading ? (
                           <span className="flex items-center justify-center gap-2">
                              <HugeiconsIcon
                                 icon={Loading01Icon}
                                 className="spin-animation"
                                 size={16}
                              />{" "}
                              Processing...
                           </span>
                        ) : (
                           <span>💳 Pay ₹{selectedService.price}</span>
                        )}
                     </button>

                     <div className="step-btns mt-3">
                        <button
                           className="btn-outline step-btn"
                           onClick={() => setStep(2)}
                           disabled={payLoading}
                        >
                           <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
                           Back
                        </button>
                     </div>
                  </div>
               )}

               {/* ── Step 4: Success state ── */}
               {step === 4 && (
                  <div
                     className="booking-step booking-success"
                     style={{ display: "block" }}
                  >
                     <div className="success-icon">🎉</div>
                     <h2>Booking Confirmed!</h2>
                     <p>
                        A confirmation email has been dispatched to your inbox.
                     </p>

                     {confirmedBookingDetails && (
                        <div className="success-details">
                           <div className="summary-row">
                              <span className="summary-label">Service</span>
                              <span className="summary-value">
                                 {confirmedBookingDetails.serviceName}
                              </span>
                           </div>
                           <div className="summary-row">
                              <span className="summary-label">Date</span>
                              <span className="summary-value">
                                 {formatDateAndDay(
                                    confirmedBookingDetails.date,
                                 )}
                              </span>
                           </div>
                           <div className="summary-row">
                              <span className="summary-label">Time</span>
                              <span className="summary-value">
                                 {formatTime(confirmedBookingDetails.time)}
                              </span>
                           </div>
                           <div className="summary-divider"></div>
                           <div className="summary-row summary-total">
                              <span className="summary-label">Amount Paid</span>
                              <span className="summary-value">
                                 ₹{confirmedBookingDetails.price}
                              </span>
                           </div>
                        </div>
                     )}

                     <Link
                        to="/user/my-bookings"
                        className="btn-primary btn-full mt-6 flex items-center justify-center gap-2"
                     >
                        View My Bookings
                        <HugeiconsIcon icon={ArrowRight01Icon} size={15} />
                     </Link>
                  </div>
               )}
            </div>

            {/* Right Sticky Sidebar */}
            <div className="booking-sidebar">
               <div className="sidebar-card">
                  <h3>Booking Summary</h3>
                  {!selectedService ? (
                     <div className="sidebar-empty">
                        Select a service and slot to see your summary here.
                     </div>
                  ) : (
                     <div
                        className="sidebar-content"
                        style={{ display: "block" }}
                     >
                        <div className="sidebar-row">
                           <span>Service</span>
                           <span>{selectedService.service_name}</span>
                        </div>
                        {selectedService.business_name && (
                           <div className="sidebar-row">
                              <span>Business</span>
                              <span className="text-(--clr-accent-2) font-semibold">
                                 {selectedService.business_name}
                              </span>
                           </div>
                        )}
                        <div className="sidebar-row">
                           <span>Date</span>
                           <span>
                              {selectedSlot
                                 ? formatDateAndDay(selectedDate)
                                 : "—"}
                           </span>
                        </div>
                        <div className="sidebar-row">
                           <span>Time</span>
                           <span>
                              {selectedSlot
                                 ? formatTime(selectedSlot.start_time)
                                 : "—"}
                           </span>
                        </div>
                        <div className="sidebar-divider"></div>
                        <div className="sidebar-row sidebar-total">
                           <span>Total</span>
                           <span>₹{selectedService.price}</span>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </main>

         <Footer />
      </>
   );
};

export default Book;
