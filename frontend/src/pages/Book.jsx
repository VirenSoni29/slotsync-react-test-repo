// import Navbar from "../components/Navbar";
// import "../css/main.css";
// import "../css/booking.css";
// import { useSearchParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { getServiceDetails, getSlots } from "../services/servicesService";
// import { HugeiconsIcon } from "@hugeicons/react";
// import getServiceIcon from "../helpers/getServiceIcon";
// import { ArrowLeft01Icon, ArrowRight01Icon, Calendar02Icon, Clock01Icon, ShieldKeyIcon } from "@hugeicons/core-free-icons";
// import formatTime from "../helpers/formatTime";
// import { formatDateAndDay } from "../helpers/formatDate";

// const LeftSideSteps = ({ service, serviceLoading, selectedSlot, setSelectedSlot }) => {
//    const [step, setStep] = useState(1);

//    const [slots, setSlots] = useState([]);

//    const [date, setDate] = useState();
//    const [slotsLoading, setSlotsLoading] = useState(false);

//    const today = new Date().toISOString().split("T")[0];

//    const loadSlots = async (date = today) => {
//       try {
//          setSlotsLoading(true);
//          const responseData = await getSlots(date);

//          setSlots(responseData.data);
//       } catch (err) {
//          console.log(err.response?.data?.message);
//       } finally {
//          setSlotsLoading(false);
//       }
//    };

//    return (
//       <div className="booking-steps-wrap">
//          {/* <!-- Step indicator --> */}
//          <div className="step-indicator">
//             <div
//                className={`step-dot ${step === 1 ? "active" : step > 1 ? "done" : ""} cursor-default`}
//                onClick={() => setStep(1)}
//             >
//                1
//             </div>
//             <div className={`step-line ${step > 1 ? "done" : ""}`}></div>
//             <div
//                className={`step-dot ${step === 2 ? "active" : step > 2 ? "done" : ""} cursor-default`}
//                onClick={() => setStep(2)}
//             >
//                2
//             </div>
//             <div className={`step-line ${step > 2 ? "done" : ""}`}></div>
//             <div
//                className={`step-dot ${step === 3 ? "active" : step > 3 ? "done" : ""} cursor-default`}
//                onClick={() => {
//                   if (selectedSlot !== null) setStep(3)
//                }}
//             >
//                3
//             </div>
//          </div>
//          <div className="step-labels">
//             <span
//                className={`step-label ${step === 1 ? "active" : step > 1 ? "done" : ""}`}
//             >
//                Service
//             </span>
//             <span
//                className={`step-label ${step === 2 ? "active" : step > 2 ? "done" : ""}`}
//             >
//                Date & Slot
//             </span>
//             <span
//                className={`step-label ${step === 3 ? "active" : step > 3 ? "done" : ""}`}
//             >
//                Payment
//             </span>
//          </div>

//          {/* <!-- ── Step 1: Service details ── --> */}
//          {step === 1 && (
//             <div className="booking-step" id="step1">
//                <h2>Your Service</h2>

//                {serviceLoading ? (
//                   <div className="step-loading">
//                      <div className="loading-spinner"></div>
//                      <p>Loading service...</p>
//                   </div>
//                ) : (
//                   <>
//                      <div className="selected-service">
//                         <div className="selected-service-icon">
//                            <HugeiconsIcon
//                               icon={getServiceIcon(service.service_name)}
//                               size={23}
//                               strokeWidth={2.5}
//                               className="text-(--clr-accent-2)"
//                            />
//                         </div>
//                         <div className="selected-service-info">
//                            <h3>{service.service_name}</h3>
//                            <p>
//                               {service.description ||
//                                  "Professional service available for booking."}
//                            </p>
//                            <div className="selected-service-meta">
//                               <span className="meta-chip">
//                                  <HugeiconsIcon
//                                     icon={Clock01Icon}
//                                     strokeWidth={2}
//                                     size={13}
//                                  />
//                                  <span>{`${service.duration_minutes} min`}</span>
//                               </span>
//                               <span className="meta-chip price-chip">
//                                  ₹<span>{service.price}</span>
//                               </span>
//                            </div>
//                         </div>
//                      </div>

//                      <div className="field-group mt-5!">
//                         <label htmlFor="bookingNotes" className="block!">
//                            Notes for the provider{" "}
//                            <span className="optional">(optional)</span>
//                         </label>
//                         <textarea
//                            id="bookingNotes"
//                            placeholder="Any special requests or information..."
//                            rows="3"
//                         ></textarea>
//                      </div>
//                   </>
//                )}

//                <button
//                   className="btn-primary btn-full step-btn"
//                   onClick={() => {
//                      setStep(2);
//                      loadSlots(today);
//                   }}
//                >
//                   Continue to Pick a Slot
//                   <HugeiconsIcon
//                      icon={ArrowRight01Icon}
//                      strokeWidth={2}
//                      size={14.4}
//                   />
//                </button>
//             </div>
//          )}

//          {/* <!-- ── Step 2: Date + Slot ── --> */}
//          {step === 2 && (
//             <div className="booking-step">
//                <h2>Pick a Date & Slot</h2>

//                <div className="field-group">
//                   <label htmlFor="datePicker">Select Date</label>
//                   <input
//                      type="date"
//                      id="datePicker"
//                      className="date-input"
//                      min={today}
//                      value={date || today}
//                      onChange={(e) => {
//                         setDate(e.target.value);
//                         loadSlots(e.target.value);
//                      }}
//                   />
//                </div>

//                {/* <!-- Slots area --> */}
//                <div>
//                   <div className="slots-label">
//                      Available time slots
//                      <span>{formatDateAndDay(date || today) || ''}</span>
//                   </div>

//                   {slotsLoading ? (
//                      <div className="step-loading flex">
//                         <div className="loading-spinner"></div>
//                      </div>
//                   ) : slots.length === 0 ? (
//                      <div className="no-slots">
//                         😕 No slots available for this date. Try another day.
//                      </div>
//                   ) : (
//                      <div className="slots-grid">
//                         {slots.map((slot, i) => (
//                            <button
//                               key={i}
//                               className={`slot-time-btn ${selectedSlot === slot ? 'selected' : ''}`}
//                               data-id={slot.id}
//                               data-start={slot.start_time}
//                               data-end={slot.end_time}
//                               onClick={() => setSelectedSlot(slot)}
//                            >
//                               {formatTime(slot.start_time)}
//                            </button>
//                         ))}
//                      </div>
//                   )}
//                </div>

//                <div className="step-btns">
//                   <button
//                      className="btn-outline step-btn"
//                      onClick={() => setStep(1)}
//                   >
//                      <HugeiconsIcon icon={ArrowLeft01Icon} size={14.4} />
//                      Back
//                   </button>
//                   <button
//                      className="btn-primary step-btn"
//                      id="step2Next"
//                      onClick={() => setStep(3)}
//                      disabled={selectedSlot === null}
//                   >
//                      Continue to Payment
//                      <HugeiconsIcon icon={ArrowRight01Icon} size={14.4} />
//                   </button>
//                </div>
//             </div>
//          )}

//          {/* <!-- ── Step 3: Confirm + Pay ── --> */}
//          {step === 3 && (
//             <div className="booking-step">
//                <h2>Confirm & Pay</h2>

//                {/* <!-- Summary --> */}
//                <div className="booking-summary">
//                   <div className="summary-row">
//                      <span className="summary-label">
//                         <HugeiconsIcon icon={Calendar02Icon} size={13.6} strokeWidth={2} />
//                         Service
//                      </span>
//                      <span className="summary-value">{service.service_name}</span>
//                   </div>
//                   <div className="summary-row">
//                      <span className="summary-label">
//                         <HugeiconsIcon icon={Calendar02Icon} size={13.6} strokeWidth={2} />
//                         Date
//                      </span>
//                      <span className="summary-value">{formatDateAndDay(date || today)}</span>
//                   </div>
//                   <div className="summary-row">
//                      <span className="summary-label">
//                         <HugeiconsIcon icon={Clock01Icon} size={13.6} strokeWidth={2} />
//                         Time
//                      </span>
//                      <span className="summary-value">{formatTime(selectedSlot.start_time)}</span>
//                   </div>
//                   <div className="summary-divider"></div>
//                   <div className="summary-row summary-total">
//                      <span className="summary-label">Total</span>
//                      <span className="summary-value">₹{service.price}</span>
//                   </div>
//                </div>

//                <div className="payment-note">
//                   <HugeiconsIcon icon={ShieldKeyIcon} size={14.4} strokeWidth={2} className="text-(--clr-green)" />
//                   Payments secured by Razorpay. Your card details are never
//                   stored.
//                </div>

//                <div
//                   className="booking-error"
//                   id="bookingError"
//                   style={{ display: "none" }}
//                ></div>

//                <button className="btn-primary btn-full step-btn" id="payBtn">
//                   <span id="payBtnText">
//                      💳 Pay ₹<span id="payAmount">{service.price}</span>
//                   </span>
//                   <span
//                      id="payBtnLoader"
//                      className="btn-spinner"
//                      style={{ display: "none" }}
//                   ></span>
//                </button>

//                <div className="step-btns mt-3!">
//                   <button
//                      className="btn-outline step-btn"
//                      onClick={() => setStep(2)}
//                   >
//                      <HugeiconsIcon icon={ArrowLeft01Icon} size={14.4} />
//                      Back
//                   </button>
//                </div>
//             </div>
//          )}

//          {/* <!-- ── Success state ── --> */}
//          <div
//             className="booking-step booking-success"
//             id="stepSuccess"
//             style={{ display: "none" }}
//          >
//             <div className="success-icon">🎉</div>
//             <h2>Booking Confirmed!</h2>
//             <p>A confirmation has been sent to your email.</p>
//             <div className="success-details" id="successDetails"></div>
//             <a href="my-bookings.html" className="btn-primary btn-full mt-6!">
//                View My Bookings
//                <i className="hgi hgi-stroke hgi-arrow-right-01"></i>
//             </a>
//          </div>
//       </div>
//    );
// };

// const RightSideSummary = ({ service, selectedSlot }) => {
//    return (
//       <div className="booking-sidebar" id="bookingSidebar">
//          <div className="sidebar-card">
//             <h3>Booking Summary</h3>
//             {service === null ? (
//                <div className="sidebar-empty">
//                   Select a service and slot to see your summary here.
//                </div>
//             ) : (
//                <div className="sidebar-content">
//                   <div className="sidebar-row">
//                      <span>Service</span>
//                      <span id="sbService">{service.service_name}</span>
//                   </div>
//                   <div className="sidebar-row">
//                      <span>Date</span>
//                      <span id="sbDate">
//                         {selectedSlot !== null ? formatDateAndDay(selectedSlot.date.split('T')[0]) : "—"}
//                      </span>
//                   </div>
//                   <div className="sidebar-row">
//                      <span>Time</span>
//                      <span id="sbTime">
//                         {selectedSlot !== null
//                            ? formatTime(selectedSlot.start_time)
//                            : "—"}
//                      </span>
//                   </div>
//                   <div className="sidebar-divider"></div>
//                   <div className="sidebar-row sidebar-total">
//                      <span>Total</span>
//                      <span id="sbTotal">₹{service.price}</span>
//                   </div>
//                </div>
//             )}
//          </div>
//       </div>
//    );
// };

// const Book = () => {
//    const [searchParams] = useSearchParams();
//    const [serviceId] = useState(searchParams.get("service"));

//    const [selectedService, setSelectedService] = useState(null);
//    const [serviceLoading, setServiceLoading] = useState(true);

//    const [selectedSlot, setSelectedSlot] = useState(null);

//    useEffect(() => {
//       let isMounted = true;

//       const initialize = async () => {
//          try {
//             const responseData = await getServiceDetails(serviceId);

//             if (responseData.success && isMounted) {
//                setSelectedService(responseData.data);
//                document.title = `Book ${responseData.data.service_name} — SlotSync`;
//             }
//          } catch (err) {
//             if (isMounted) console.log(err);
//          } finally {
//             if (isMounted) setServiceLoading(false);
//          }
//       };

//       initialize();

//       return () => (isMounted = false);
//    }, [serviceId]);

//    return (
//       <>
//          <Navbar />

//          <main className="booking-layout">
//             {/* <!-- Left — Steps --> */}
//             <LeftSideSteps
//                service={selectedService}
//                serviceLoading={serviceLoading}
//                selectedSlot={selectedSlot}
//                setSelectedSlot={setSelectedSlot}
//             />

//             {/* <!-- Right — sticky summary card --> */}
//             <RightSideSummary
//                service={selectedService}
//                selectedSlot={selectedSlot}
//             />
//          </main>
//       </>
//    );
// };

// export default Book;


import Navbar from "../components/Navbar";
import "../css/main.css";
import "../css/booking.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getServiceDetails, getSlots } from "../services/servicesService";
import { HugeiconsIcon } from "@hugeicons/react";
import getServiceIcon from "../helpers/getServiceIcon";
import {
   ArrowLeft01Icon,
   ArrowRight01Icon,
   Calendar02Icon,
   Clock01Icon,
   ShieldKeyIcon,
} from "@hugeicons/core-free-icons";
import formatTime from "../helpers/formatTime";
import { formatDateAndDay } from "../helpers/formatDate";
import { createPaymentOrder, verifyPayment } from "../services/paymentService";
import { createBooking } from "../services/bookingService";
import { toast } from "sonner";

// ── Load the Razorpay checkout script once, on demand ──
function loadRazorpayScript() {
   return new Promise((resolve, reject) => {
      if (window.Razorpay) {
         resolve(true);
         return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Failed to load Razorpay checkout script."));
      document.body.appendChild(script);
   });
}

const LeftSideSteps = ({
   service,
   serviceLoading,
   serviceError,
   step,
   setStep,
   date,
   setDate,
   selectedSlot,
   setSelectedSlot,
   notes,
   setNotes,
   paying,
   bookingError,
   onPay,
   successDetails,
}) => {
   const [slots, setSlots] = useState([]);
   const [slotsLoading, setSlotsLoading] = useState(false);

   const today = new Date().toISOString().split("T")[0];

   const loadSlots = async (forDate = today) => {
      try {
         setSlotsLoading(true);
         const responseData = await getSlots(forDate);
         setSlots(responseData.data);
      } catch (err) {
         console.log(err.response?.data?.message);
         setSlots([]);
      } finally {
         setSlotsLoading(false);
      }
   };

   return (
      <div className="booking-steps-wrap">
         {/* <!-- Step indicator --> */}
         <div className="step-indicator">
            <div className={`step-dot ${step === 1 ? "active" : step > 1 ? "done" : ""} cursor-default`}>1</div>
            <div className={`step-line ${step > 1 ? "done" : ""}`}></div>
            <div className={`step-dot ${step === 2 ? "active" : step > 2 ? "done" : ""} cursor-default`}>2</div>
            <div className={`step-line ${step > 2 ? "done" : ""}`}></div>
            <div className={`step-dot ${step === 3 ? "active" : step > 3 ? "done" : ""} cursor-default`}>3</div>
         </div>
         <div className="step-labels">
            <span className={`step-label ${step === 1 ? "active" : step > 1 ? "done" : ""}`}>Service</span>
            <span className={`step-label ${step === 2 ? "active" : step > 2 ? "done" : ""}`}>Date & Slot</span>
            <span className={`step-label ${step === 3 ? "active" : step > 3 ? "done" : ""}`}>Payment</span>
         </div>

         {/* <!-- ── Step 1: Service details ── --> */}
         {step === 1 && (
            <div className="booking-step" id="step1">
               <h2>Your Service</h2>

               {serviceLoading ? (
                  <div className="step-loading">
                     <div className="loading-spinner"></div>
                     <p>Loading service...</p>
                  </div>
               ) : serviceError ? (
                  <p style={{ color: "var(--clr-red)" }}>
                     Service not found. <a href="/services">Browse services</a>
                  </p>
               ) : (
                  <>
                     <div className="selected-service">
                        <div className="selected-service-icon">
                           <HugeiconsIcon
                              icon={getServiceIcon(service.service_name)}
                              size={23}
                              strokeWidth={2.5}
                              className="text-(--clr-accent-2)"
                           />
                        </div>
                        <div className="selected-service-info">
                           <h3>{service.service_name}</h3>
                           <p>{service.description || "Professional service available for booking."}</p>
                           <div className="selected-service-meta">
                              <span className="meta-chip">
                                 <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} size={13} />
                                 <span>{`${service.duration_minutes} min`}</span>
                              </span>
                              <span className="meta-chip price-chip">
                                 ₹<span>{service.price}</span>
                              </span>
                           </div>
                        </div>
                     </div>

                     <div className="field-group mt-5!">
                        <label htmlFor="bookingNotes" className="block!">
                           Notes for the provider <span className="optional">(optional)</span>
                        </label>
                        <textarea
                           id="bookingNotes"
                           placeholder="Any special requests or information..."
                           rows="3"
                           value={notes}
                           onChange={(e) => setNotes(e.target.value)}
                        ></textarea>
                     </div>
                  </>
               )}

               <button
                  className="btn-primary btn-full step-btn"
                  disabled={serviceLoading || serviceError}
                  onClick={() => {
                     setStep(2);
                     loadSlots(date || today);
                  }}
               >
                  Continue to Pick a Slot
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} size={14.4} />
               </button>
            </div>
         )}

         {/* <!-- ── Step 2: Date + Slot ── --> */}
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
                     value={date || today}
                     onChange={(e) => {
                        setDate(e.target.value);
                        setSelectedSlot(null);
                        loadSlots(e.target.value);
                     }}
                  />
               </div>

               {/* <!-- Slots area --> */}
               <div>
                  <div className="slots-label">
                     Available time slots
                     <span>{formatDateAndDay(date || today) || ""}</span>
                  </div>

                  {slotsLoading ? (
                     <div className="step-loading flex">
                        <div className="loading-spinner"></div>
                     </div>
                  ) : slots.length === 0 ? (
                     <div className="no-slots">😕 No slots available for this date. Try another day.</div>
                  ) : (
                     <div className="slots-grid">
                        {slots.map((slot, i) => (
                           <button
                              key={i}
                              className={`slot-time-btn ${selectedSlot === slot ? "selected" : ""}`}
                              data-id={slot.id}
                              data-start={slot.start_time}
                              data-end={slot.end_time}
                              onClick={() => setSelectedSlot(slot)}
                           >
                              {formatTime(slot.start_time)}
                           </button>
                        ))}
                     </div>
                  )}
               </div>

               <div className="step-btns">
                  <button className="btn-outline step-btn" onClick={() => setStep(1)}>
                     <HugeiconsIcon icon={ArrowLeft01Icon} size={14.4} />
                     Back
                  </button>
                  <button
                     className="btn-primary step-btn"
                     id="step2Next"
                     onClick={() => setStep(3)}
                     disabled={selectedSlot === null}
                  >
                     Continue to Payment
                     <HugeiconsIcon icon={ArrowRight01Icon} size={14.4} />
                  </button>
               </div>
            </div>
         )}

         {/* <!-- ── Step 3: Confirm + Pay ── --> */}
         {step === 3 && (
            <div className="booking-step">
               <h2>Confirm & Pay</h2>

               {/* <!-- Summary --> */}
               <div className="booking-summary">
                  <div className="summary-row">
                     <span className="summary-label">
                        <HugeiconsIcon icon={Calendar02Icon} size={13.6} strokeWidth={2} />
                        Service
                     </span>
                     <span className="summary-value">{service.service_name}</span>
                  </div>
                  <div className="summary-row">
                     <span className="summary-label">
                        <HugeiconsIcon icon={Calendar02Icon} size={13.6} strokeWidth={2} />
                        Date
                     </span>
                     <span className="summary-value">{formatDateAndDay(date || today)}</span>
                  </div>
                  <div className="summary-row">
                     <span className="summary-label">
                        <HugeiconsIcon icon={Clock01Icon} size={13.6} strokeWidth={2} />
                        Time
                     </span>
                     <span className="summary-value">{formatTime(selectedSlot.start_time)}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row summary-total">
                     <span className="summary-label">Total</span>
                     <span className="summary-value">₹{service.price}</span>
                  </div>
               </div>

               <div className="payment-note">
                  <HugeiconsIcon icon={ShieldKeyIcon} size={14.4} strokeWidth={2} className="text-(--clr-green)" />
                  Payments secured by Razorpay. Your card details are never stored.
               </div>

               {bookingError && (
                  <div className="booking-error" id="bookingError">
                     {bookingError}
                  </div>
               )}

               <button className="btn-primary btn-full step-btn" id="payBtn" onClick={onPay} disabled={paying}>
                  {paying ? (
                     <span id="payBtnLoader" className="btn-spinner"></span>
                  ) : (
                     <span id="payBtnText">
                        💳 Pay ₹<span id="payAmount">{service.price}</span>
                     </span>
                  )}
               </button>

               <div className="step-btns mt-3!">
                  <button className="btn-outline step-btn" onClick={() => setStep(2)} disabled={paying}>
                     <HugeiconsIcon icon={ArrowLeft01Icon} size={14.4} />
                     Back
                  </button>
               </div>
            </div>
         )}

         {/* <!-- ── Success state ── --> */}
         {step === 4 && (
            <div className="booking-step booking-success" id="stepSuccess">
               <div className="success-icon">🎉</div>
               <h2>Booking Confirmed!</h2>
               <p>A confirmation has been sent to your email.</p>
               <div className="success-details" id="successDetails">
                  <div className="summary-row">
                     <span className="summary-label">Service</span>
                     <span className="summary-value">{service.service_name}</span>
                  </div>
                  <div className="summary-row">
                     <span className="summary-label">Date</span>
                     <span className="summary-value">{formatDateAndDay(date || today)}</span>
                  </div>
                  <div className="summary-row">
                     <span className="summary-label">Time</span>
                     <span className="summary-value">{formatTime(selectedSlot.start_time)}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row summary-total">
                     <span className="summary-label">Paid</span>
                     <span className="summary-value">₹{service.price}</span>
                  </div>
               </div>
               <a href="/my-bookings" className="btn-primary btn-full mt-6!">
                  View My Bookings
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} size={14.4} />
               </a>
            </div>
         )}
      </div>
   );
};

const RightSideSummary = ({ service, date, selectedSlot }) => {
   const today = new Date().toISOString().split("T")[0];

   return (
      <div className="booking-sidebar" id="bookingSidebar">
         <div className="sidebar-card">
            <h3>Booking Summary</h3>
            {service === null ? (
               <div className="sidebar-empty">Select a service and slot to see your summary here.</div>
            ) : (
               <div className="sidebar-content">
                  <div className="sidebar-row">
                     <span>Service</span>
                     <span id="sbService">{service.service_name}</span>
                  </div>
                  <div className="sidebar-row">
                     <span>Date</span>
                     <span id="sbDate">{selectedSlot !== null ? formatDateAndDay(date || today) : "—"}</span>
                  </div>
                  <div className="sidebar-row">
                     <span>Time</span>
                     <span id="sbTime">{selectedSlot !== null ? formatTime(selectedSlot.start_time) : "—"}</span>
                  </div>
                  <div className="sidebar-divider"></div>
                  <div className="sidebar-row sidebar-total">
                     <span>Total</span>
                     <span id="sbTotal">₹{service.price}</span>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

const Book = () => {
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const [serviceId] = useState(searchParams.get("service"));

   const [selectedService, setSelectedService] = useState(null);
   const [serviceLoading, setServiceLoading] = useState(true);

   const [step, setStep] = useState(1);
   const [date, setDate] = useState(null);
   const [selectedSlot, setSelectedSlot] = useState(null);
   const [notes, setNotes] = useState("");

   const [paying, setPaying] = useState(false);
   const [bookingError, setBookingError] = useState("");
   const [bookingId, setBookingId] = useState(null);

   // ── Redirect if no service was specified ──
   useEffect(() => {
      if (!serviceId) {
         navigate("/services");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [serviceId]);

   // ── Load service details ──
   useEffect(() => {
      if (!serviceId) return;
      let isMounted = true;

      const initialize = async () => {
         try {
            const responseData = await getServiceDetails(serviceId);

            if (responseData.success && isMounted) {
               setSelectedService(responseData.data);
               document.title = `Book ${responseData.data.service_name} — SlotSync`;
            }
         } catch (err) {
            if (isMounted) {
               toast.error(err.response?.data?.message || 'Service not found. Please select a valid service.')
               navigate('/services')
            }
         } finally {
            if (isMounted) setServiceLoading(false);
         }
      };

      initialize();

      return () => (isMounted = false);
   }, [serviceId, navigate]);

   // ── Create booking + Razorpay payment ──
   const handlePay = async () => {
      if (!selectedSlot || !selectedService) return;

      setPaying(true);
      setBookingError("");

      try {
         // 1. Create booking
         const bookingResData = await createBooking({
            service_id: parseInt(serviceId),
            slot_id: parseInt(selectedSlot.id),
            notes: notes.trim() || undefined,
         });

         const newBookingId = bookingResData.id;
         setBookingId(newBookingId);

         // 2. Create Razorpay order
         const orderResData = await createPaymentOrder({ booking_id: newBookingId });

         const { order_id, amount, currency, key_id } = orderResData;

         // 3. Make sure the Razorpay SDK is available, then open checkout
         await loadRazorpayScript();

         const options = {
            key: key_id,
            amount,
            currency,
            name: "SlotSync",
            description: selectedService.service_name,
            order_id,
            prefill: {
               name: user.name,
               email: "",
               contact: "",
            },
            theme: { color: "#6c63ff" },

            handler: async function (response) {
               // 4. Verify payment signature on backend
               try {
                  await verifyPayment({
                     booking_id: newBookingId,
                     razorpay_order_id: response.razorpay_order_id,
                     razorpay_payment_id: response.razorpay_payment_id,
                     razorpay_signature: response.razorpay_signature,
                  });

                  // 5. Show success
                  setPaying(false);
                  setStep(4);
               } catch {
                  setBookingError("Payment verification failed. Please contact support.");
                  setPaying(false);
               }
            },

            modal: {
               ondismiss: function () {
                  // User closed modal without paying
                  setPaying(false);
               },
            },
         };

         const rzp = new window.Razorpay(options);
         rzp.open();
      } catch (err) {
         setBookingError(err.message || "Something went wrong. Please try again.");
         setPaying(false);
      }
   };

   return (
      <>
         <Navbar />

         <main className="booking-layout">
            {/* <!-- Left — Steps --> */}
            <LeftSideSteps
               service={selectedService}
               serviceLoading={serviceLoading}
               serviceError={serviceError}
               step={step}
               setStep={setStep}
               date={date}
               setDate={setDate}
               selectedSlot={selectedSlot}
               setSelectedSlot={setSelectedSlot}
               notes={notes}
               setNotes={setNotes}
               paying={paying}
               bookingError={bookingError}
               onPay={handlePay}
            />

            {/* <!-- Right — sticky summary card --> */}
            <RightSideSummary service={selectedService} date={date} selectedSlot={selectedSlot} />
         </main>
      </>
   );
};

export default Book;
