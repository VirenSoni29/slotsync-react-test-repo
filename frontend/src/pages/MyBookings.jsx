import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "../css/main.css";
import "../css/my-bookings.css";
import { cancelBooking, getAllBookings } from "../services/bookingService.js";
import { toast } from "sonner";
import { formatBookingDateCard } from "../helpers/formatDate";
import formatTime from "../helpers/formatTime.js";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Calendar01Icon, ClipboardCheck, Clock01Icon, Loading01Icon } from "@hugeicons/core-free-icons";

const getStatusBadge = (status) => {
   const map = {
      confirmed: { label: "✅ Confirmed", cls: "status-confirmed" },
      pending: { label: "⏳ Pending", cls: "status-pending" },
      completed: { label: "🏁 Completed", cls: "status-completed" },
      cancelled: { label: "❌ Cancelled", cls: "status-cancelled" },
      failed: { label: "❌ Failed", cls: "status-failed" },
   };
   return map[status] || { label: status, cls: "" };
};

const canCancel = (status) => {
   return ["confirmed", "pending"].includes(status);
};

const FILTERS = [
   { key: "all", label: "All" },
   { key: "confirmed", label: "✅ Confirmed" },
   { key: "pending", label: "⏳ Pending" },
   { key: "completed", label: "🏁 Completed" },
   { key: "cancelled", label: "❌ Cancelled" },
];

const MyBookings = () => {
   const [allBookings, setAllBookings] = useState([]);
   const [loading, setLoading] = useState(true);
   const [loadError, setLoadError] = useState(false);
   const [activeFilter, setActiveFilter] = useState("all");
   const [bookingToCancel, setBookingToCancel] = useState(null);
   const [cancelling, setCancelling] = useState(false);

   useEffect(() => {
      let isMounted = true;

      const loadBookings = async () => {
         setLoading(true);
         setLoadError(false);
         try {
            const res = await getAllBookings();
            if (isMounted) {
               setAllBookings(res.data || []);
            }
         } catch {
            if (isMounted) setLoadError(true);
         } finally {
            if (isMounted) setLoading(false);
         }
      };

      loadBookings();
      return () => {
         isMounted = false;
      };
   }, []);

   const filteredBookings = useMemo(() => {
      return activeFilter === "all"
         ? allBookings
         : allBookings.filter((b) => b.status === activeFilter);
   }, [allBookings, activeFilter]);

   const emptyMessage = loadError
      ? "Could not load bookings. Make sure you are logged in."
      : activeFilter === "all"
      ? "You haven't made any bookings yet."
      : `No ${activeFilter} bookings found.`;

   const openCancelModal = (id) => setBookingToCancel(id);
   const closeCancelModal = () => setBookingToCancel(null);

   const confirmCancel = async () => {
      if (!bookingToCancel) return;

      setCancelling(true);
      try {
         await cancelBooking(bookingToCancel);

         setAllBookings((prev) =>
            prev.map((b) =>
               b.id === bookingToCancel ? { ...b, status: "cancelled" } : b
            )
         );

         toast.success("Booking cancelled successfully.");
         setBookingToCancel(null);
      } catch (err) {
         toast.error(err.response?.data?.message || "Could not cancel booking. Try again.");
      } finally {
         setCancelling(false);
      }
   };

   const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
         closeCancelModal();
      }
   };

   const showEmpty = !loading && (loadError || filteredBookings.length === 0);
   const showList = !loading && !loadError && filteredBookings.length > 0;

   return (
      <>
         <Navbar />

         {/* Header */}
         <section className="page-header">
            <div className="page-header-inner">
               <div className="section-tag">Dashboard</div>
               <h1>My Bookings</h1>
               <p>View, manage and track all your appointments.</p>
            </div>
         </section>

         {/* Filters Bar */}
         <section className="bookings-controls">
            <div className="controls-inner">
               <div className="filter-tabs" id="filterTabs">
                  {FILTERS.map((f) => (
                     <button
                        key={f.key}
                        className={`filter-tab${activeFilter === f.key ? " active" : ""}`}
                        onClick={() => setActiveFilter(f.key)}
                     >
                        {f.label}
                     </button>
                  ))}
               </div>
            </div>
         </section>

         {/* Bookings List */}
         <section className="bookings-section">
            <div className="bookings-inner">
               {loading && (
                  <div className="bookings-loading" id="bookingsLoading">
                     <div className="loading-spinner"></div>
                     <p>Loading your bookings...</p>
                  </div>
               )}

               {showEmpty && (
                  <div className="bookings-empty" id="bookingsEmpty">
                     <div className="empty-icon">📅</div>
                     <h3>No bookings found</h3>
                     <p id="emptyMessage">{emptyMessage}</p>
                     <Link
                        to="/services"
                        className="btn-primary"
                        style={{ marginTop: 20, display: "inline-flex", gap: 8 }}
                     >
                        Browse Services
                        <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2.5} size={14.4} />
                     </Link>
                  </div>
               )}

               {showList && (
                  <div className="bookings-list" id="bookingsList" style={{ display: "flex" }}>
                     {filteredBookings.map((b, i) => {
                        const date = formatBookingDateCard(b.date);
                        const badge = getStatusBadge(b.status);

                        return (
                           <div
                              className="booking-card"
                              key={b.id}
                              style={{ animationDelay: `${i * 0.05}s` }}
                           >
                              <div className="booking-date-col">
                                 <div className="booking-day">{date.day}</div>
                                 <div className="booking-month">{date.month}</div>
                              </div>

                              <div className="booking-info">
                                 <div className="booking-top">
                                    <div>
                                       <span className="booking-service-name">
                                          {b.service_name}
                                       </span>
                                       {b.business_name && (
                                          <div className="text-[0.78rem] text-(--clr-accent-2) font-semibold flex items-center gap-1 mt-0.5">
                                             🏢 {b.business_name}
                                          </div>
                                       )}
                                    </div>
                                    <span className={`booking-status-badge ${badge.cls}`}>
                                       {badge.label}
                                    </span>
                                 </div>
                                 <div className="booking-meta">
                                    <span className="booking-meta-item">
                                       <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} />
                                       {formatTime(b.start_time)}
                                    </span>
                                    <span className="booking-meta-item">
                                       <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} />
                                       {date.full}
                                    </span>
                                    {b.payment_status === "paid" ? (
                                       <span className="booking-meta-item">
                                          <HugeiconsIcon icon={ClipboardCheck} strokeWidth={2} /> Paid ₹{b.price}
                                       </span>
                                    ) : (
                                       <span className="booking-meta-item">
                                          <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} /> {b.payment_status}
                                       </span>
                                    )}
                                 </div>
                              </div>

                              <div className="booking-actions">
                                 {canCancel(b.status) && (
                                    <button
                                       className="btn-cancel"
                                       onClick={() => openCancelModal(b.id)}
                                    >
                                       Cancel
                                    </button>
                                 )}
                                 <Link
                                    to={`/services/book?service=${b.service_id}`}
                                    className="btn-rebook"
                                 >
                                    Book Again
                                 </Link>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               )}
            </div>
         </section>

         {/* Cancel Modal */}
         {bookingToCancel && (
            <div
               className="modal-overlay"
               id="cancelModal"
               style={{ display: "flex" }}
               onClick={handleOverlayClick}
            >
               <div className="modal-card">
                  <div className="modal-icon">❌</div>
                  <h3>Cancel Booking?</h3>
                  <p>Are you sure you want to cancel this appointment? This action cannot be undone.</p>
                  <div className="modal-actions">
                     <button
                        className="btn-outline"
                        onClick={closeCancelModal}
                     >
                        Keep Booking
                     </button>
                     <button
                        className="btn-danger"
                        onClick={confirmCancel}
                        disabled={cancelling}
                     >
                        {cancelling ? (
                           <span className="flex items-center gap-2">
                              <HugeiconsIcon icon={Loading01Icon} className="spin-animation" size={14} /> Cancelling...
                           </span>
                        ) : (
                           <span>Yes, Cancel</span>
                        )}
                     </button>
                  </div>
               </div>
            </div>
         )}

         <Footer />
      </>
   );
};

export default MyBookings;
