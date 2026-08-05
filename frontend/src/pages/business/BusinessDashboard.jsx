import { useEffect, useState } from "react";
import { getBusinessDashboard } from "../../services/businessService";
import { createService, generateSlots } from "../../services/servicesService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { formatDate } from "../../helpers/formatDate";
import formatTime from "../../helpers/formatTime";
import "../../css/business.css";
import { toast } from "sonner";

const BusinessDashboard = () => {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);

   // Modal states
   const [showServiceModal, setShowServiceModal] = useState(false);
   const [showSlotModal, setShowSlotModal] = useState(false);
   const [submitting, setSubmitting] = useState(false);

   // Service Form
   const [serviceForm, setServiceForm] = useState({
      service_name: "",
      description: "",
      price: "",
      duration_minutes: 30,
   });

   // Slot Form
   const [slotForm, setSlotForm] = useState({
      date: new Date().toISOString().split("T")[0],
      start_time: "09:00",
      end_time: "17:00",
      duration_min: 30,
      max_capacity: 1,
   });

   const fetchDashboard = async () => {
      try {
         const res = await getBusinessDashboard();
         setData(res.data);
      } catch (err) {
         toast.error(
            err.response?.data?.message || "Failed to load business dashboard.",
         );
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      let isMounted = true;

      (async () => {
         try {
            const res = await getBusinessDashboard();

            if (isMounted) setData(res.data);
         } catch (err) {
            toast.error(
               err.response?.data?.message ||
                  "Failed to load business dashboard.",
            );
         } finally {
            if (isMounted) setLoading(false);
         }
      })();

      return () => isMounted = false;
   }, []);

   const handleCreateService = async (e) => {
      e.preventDefault();
      if (!serviceForm.service_name || !serviceForm.price) {
         toast.error("Service name and price are required.");
         return;
      }

      setSubmitting(true);
      try {
         const res = await createService({
            ...serviceForm,
            price: parseFloat(serviceForm.price),
            duration_minutes: parseInt(serviceForm.duration_minutes),
         });
         toast.success(res.message || "Service added to your catalog!");
         setShowServiceModal(false);
         setServiceForm({
            service_name: "",
            description: "",
            price: "",
            duration_minutes: 30,
         });
         fetchDashboard();
      } catch (err) {
         toast.error(
            err.response?.data?.message || "Failed to create service.",
         );
      } finally {
         setSubmitting(false);
      }
   };

   const handleGenerateSlots = async (e) => {
      e.preventDefault();
      if (!slotForm.date || !slotForm.start_time || !slotForm.end_time) {
         toast.error("Date, start time, and end time are required.");
         return;
      }

      setSubmitting(true);
      try {
         const res = await generateSlots({
            ...slotForm,
            duration_min: parseInt(slotForm.duration_min),
            max_capacity: parseInt(slotForm.max_capacity),
         });
         toast.success(res.message || "Time slots generated successfully!");
         setShowSlotModal(false);
         fetchDashboard();
      } catch (err) {
         toast.error(
            err.response?.data?.message || "Failed to generate slots.",
         );
      } finally {
         setSubmitting(false);
      }
   };

   if (loading) {
      return (
         <>
            <Navbar />
            <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
               <div className="classic-loader">Loading Dashboard...</div>
            </div>
            <Footer />
         </>
      );
   }

   const { business, stats, recentBookings, services } = data || {};

   return (
      <>
         <Navbar />
         <div className="business-dashboard-container">
            {/* Top Business Profile Header */}
            <div className="biz-header-card">
               <div className="biz-header-top">
                  <div>
                     <div className="biz-header-title-wrap">
                        <h1 className="biz-title">{business?.name}</h1>
                        <span className="biz-status-badge">
                           Active Business
                        </span>
                     </div>
                     <p className="biz-tagline">
                        {business?.tagline ||
                           "Manage your business catalog, slots, and customer bookings."}
                     </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                     <button
                        onClick={() => setShowServiceModal(true)}
                        className="biz-btn-header-purple"
                     >
                        <span>+</span> Add Service
                     </button>
                     <button
                        onClick={() => setShowSlotModal(true)}
                        className="biz-btn-header-teal"
                     >
                        <span>+</span> Generate Slots
                     </button>
                     <div className="biz-slug-pill">
                        <span>Slug:</span>
                        <code>/b/{business?.slug}</code>
                     </div>
                  </div>
               </div>

               <div className="biz-header-meta">
                  <span>
                     Category:{" "}
                     <strong>{business?.category || "General"}</strong>
                  </span>
                  <span>
                     Email: <strong>{business?.email}</strong>
                  </span>
                  <span>
                     Phone: <strong>{business?.phone}</strong>
                  </span>
                  <span>
                     Address:{" "}
                     <strong>{business?.address || "Not specified"}</strong>
                  </span>
               </div>
            </div>

            {/* Stats Row */}
            <div className="biz-stats-grid">
               <div className="biz-stat-card">
                  <div className="biz-stat-icon biz-stat-icon--green">💰</div>
                  <div className="biz-stat-info">
                     <span className="biz-stat-label">Total Revenue</span>
                     <span className="biz-stat-num text-[#22d3a5]">
                        ₹{stats?.total_revenue?.toLocaleString("en-IN") || 0}
                     </span>
                     <span className="biz-stat-sub">
                        All-time confirmed sales
                     </span>
                  </div>
               </div>

               <div className="biz-stat-card">
                  <div className="biz-stat-icon biz-stat-icon--purple">📅</div>
                  <div className="biz-stat-info">
                     <span className="biz-stat-label">Monthly Sales</span>
                     <span className="biz-stat-num">
                        ₹{stats?.monthly_revenue?.toLocaleString("en-IN") || 0}
                     </span>
                     <span className="biz-stat-sub">
                        Current calendar month
                     </span>
                  </div>
               </div>

               <div className="biz-stat-card">
                  <div className="biz-stat-icon biz-stat-icon--yellow">📋</div>
                  <div className="biz-stat-info">
                     <span className="biz-stat-label">Total Bookings</span>
                     <span className="biz-stat-num text-[#a78bfa]">
                        {stats?.total_bookings || 0}
                     </span>
                     <span className="biz-stat-sub">
                        {stats?.confirmed_bookings || 0} confirmed
                     </span>
                  </div>
               </div>

               <div className="biz-stat-card">
                  <div className="biz-stat-icon biz-stat-icon--purple">⚡</div>
                  <div className="biz-stat-info">
                     <span className="biz-stat-label">Active Services</span>
                     <span className="biz-stat-num">
                        {stats?.total_services || 0}
                     </span>
                     <span className="biz-stat-sub">Catalog items</span>
                  </div>
               </div>
            </div>

            {/* Content Grid: Appointments & Services */}
            <div className="biz-content-grid">
               {/* Left 2 Cols: Customer Appointments */}
               <div className="biz-card">
                  <div className="biz-card-header">
                     <h3 className="biz-card-title">
                        Recent Customer Appointments
                     </h3>
                     <span className="text-xs text-[#a0a0b8]">
                        Showing latest {recentBookings?.length || 0}
                     </span>
                  </div>

                  {recentBookings && recentBookings.length > 0 ? (
                     <div className="biz-table-wrap">
                        <table className="biz-table">
                           <thead>
                              <tr>
                                 <th>Customer</th>
                                 <th>Service</th>
                                 <th>Date & Time</th>
                                 <th>Amount</th>
                                 <th>Status</th>
                              </tr>
                           </thead>
                           <tbody>
                              {recentBookings.map((b) => (
                                 <tr key={b.id}>
                                    <td>
                                       <div className="biz-customer-name">
                                          {b.user_name}
                                       </div>
                                       <div className="biz-customer-email">
                                          {b.user_email}
                                       </div>
                                    </td>
                                    <td className="text-[#a78bfa] font-medium">
                                       {b.service_name}
                                    </td>
                                    <td className="text-xs text-[#a0a0b8]">
                                       {formatDate(b.date)} at{" "}
                                       {formatTime(b.start_time)}
                                    </td>
                                    <td className="font-semibold text-white">
                                       ₹{b.price}
                                    </td>
                                    <td>
                                       <span
                                          className={`biz-status-pill${
                                             b.status === "confirmed"
                                                ? " biz-status-pill--confirmed"
                                                : b.status === "pending"
                                                  ? " biz-status-pill--pending"
                                                  : " biz-status-pill--failed"
                                          }`}
                                       >
                                          {b.status}
                                       </span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  ) : (
                     <p className="text-[#606078] text-sm py-8 text-center">
                        No customer appointments recorded yet.
                     </p>
                  )}
               </div>

               {/* Right Col: Offered Services List */}
               <div className="biz-card">
                  <div className="biz-card-header">
                     <h3 className="biz-card-title">Catalog Services</h3>
                     <button
                        onClick={() => setShowServiceModal(true)}
                        className="biz-card-action-btn"
                     >
                        + Add New
                     </button>
                  </div>

                  {services && services.length > 0 ? (
                     <div className="flex flex-col gap-3">
                        {services.map((s) => (
                           <div key={s.id} className="biz-service-item">
                              <div>
                                 <div className="biz-service-title">
                                    {s.service_name}
                                 </div>
                                 <div className="biz-service-duration">
                                    {s.duration_minutes} mins duration
                                 </div>
                              </div>
                              <span className="biz-service-price">
                                 ₹{s.price}
                              </span>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <p className="text-[#606078] text-sm py-6 text-center">
                        No services added to your business catalog yet.
                     </p>
                  )}
               </div>
            </div>
         </div>

         {/* SERVICE CREATION MODAL */}
         {showServiceModal && (
            <div
               className="biz-modal-overlay"
               onClick={() => setShowServiceModal(false)}
            >
               <div
                  className="biz-modal-card biz-modal-card--service"
                  onClick={(e) => e.stopPropagation()}
               >
                  <div className="biz-modal-header">
                     <div className="biz-modal-header-info">
                        <div className="biz-modal-icon-badge biz-modal-icon-badge--purple">
                           ✨
                        </div>
                        <div>
                           <h3 className="biz-modal-title">Add New Service</h3>
                           <p className="biz-modal-subtitle">
                              Create a service offering for your customer
                              catalog
                           </p>
                        </div>
                     </div>
                     <button
                        onClick={() => setShowServiceModal(false)}
                        className="biz-modal-close-btn"
                        aria-label="Close modal"
                     >
                        ✕
                     </button>
                  </div>

                  <form
                     onSubmit={handleCreateService}
                     className="biz-modal-form"
                  >
                     <div className="biz-form-group">
                        <label className="biz-form-label">
                           Service Name <span className="biz-req-star">*</span>
                        </label>
                        <input
                           type="text"
                           required
                           value={serviceForm.service_name}
                           onChange={(e) =>
                              setServiceForm({
                                 ...serviceForm,
                                 service_name: e.target.value,
                              })
                           }
                           placeholder="Haircut & Styling / General Consultation"
                           className="biz-input"
                        />
                     </div>

                     <div className="biz-form-group">
                        <label className="biz-form-label">Description</label>
                        <textarea
                           rows="3"
                           value={serviceForm.description}
                           onChange={(e) =>
                              setServiceForm({
                                 ...serviceForm,
                                 description: e.target.value,
                              })
                           }
                           placeholder="Full description of what's included in this service..."
                           className="biz-textarea"
                        ></textarea>
                     </div>

                     <div className="biz-form-row">
                        <div className="biz-form-group">
                           <label className="biz-form-label">
                              Price (₹) <span className="biz-req-star">*</span>
                           </label>
                           <input
                              type="number"
                              required
                              step="0.01"
                              value={serviceForm.price}
                              onChange={(e) =>
                                 setServiceForm({
                                    ...serviceForm,
                                    price: e.target.value,
                                 })
                              }
                              placeholder="499"
                              className="biz-input"
                           />
                        </div>

                        <div className="biz-form-group">
                           <label className="biz-form-label">
                              Duration (Mins){" "}
                              <span className="biz-req-star">*</span>
                           </label>
                           <input
                              type="number"
                              required
                              value={serviceForm.duration_minutes}
                              onChange={(e) =>
                                 setServiceForm({
                                    ...serviceForm,
                                    duration_minutes: e.target.value,
                                 })
                              }
                              placeholder="30"
                              className="biz-input"
                           />
                        </div>
                     </div>

                     <div className="biz-modal-actions">
                        <button
                           type="button"
                           onClick={() => setShowServiceModal(false)}
                           className="biz-btn-cancel"
                        >
                           Cancel
                        </button>
                        <button
                           type="submit"
                           disabled={submitting}
                           className="biz-btn-submit-purple"
                        >
                           {submitting
                              ? "Creating Service..."
                              : "Create Service"}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* SLOT GENERATION MODAL */}
         {showSlotModal && (
            <div
               className="biz-modal-overlay"
               onClick={() => setShowSlotModal(false)}
            >
               <div
                  className="biz-modal-card biz-modal-card--slot"
                  onClick={(e) => e.stopPropagation()}
               >
                  <div className="biz-modal-header">
                     <div className="biz-modal-header-info">
                        <div className="biz-modal-icon-badge biz-modal-icon-badge--teal">
                           ⚡
                        </div>
                        <div>
                           <h3 className="biz-modal-title">
                              Generate Time Slots
                           </h3>
                           <p className="biz-modal-subtitle">
                              Auto-generate bookable time slots for your
                              schedule
                           </p>
                        </div>
                     </div>
                     <button
                        onClick={() => setShowSlotModal(false)}
                        className="biz-modal-close-btn"
                        aria-label="Close modal"
                     >
                        ✕
                     </button>
                  </div>

                  <form
                     onSubmit={handleGenerateSlots}
                     className="biz-modal-form"
                  >
                     <div className="biz-form-group">
                        <label className="biz-form-label">
                           Date <span className="biz-req-star--teal">*</span>
                        </label>
                        <input
                           type="date"
                           required
                           value={slotForm.date}
                           onChange={(e) =>
                              setSlotForm({ ...slotForm, date: e.target.value })
                           }
                           className="biz-input biz-input--teal"
                        />
                     </div>

                     <div className="biz-form-row">
                        <div className="biz-form-group">
                           <label className="biz-form-label">
                              Start Time{" "}
                              <span className="biz-req-star--teal">*</span>
                           </label>
                           <input
                              type="time"
                              required
                              value={slotForm.start_time}
                              onChange={(e) =>
                                 setSlotForm({
                                    ...slotForm,
                                    start_time: e.target.value,
                                 })
                              }
                              className="biz-input biz-input--teal"
                           />
                        </div>

                        <div className="biz-form-group">
                           <label className="biz-form-label">
                              End Time{" "}
                              <span className="biz-req-star--teal">*</span>
                           </label>
                           <input
                              type="time"
                              required
                              value={slotForm.end_time}
                              onChange={(e) =>
                                 setSlotForm({
                                    ...slotForm,
                                    end_time: e.target.value,
                                 })
                              }
                              className="biz-input biz-input--teal"
                           />
                        </div>
                     </div>

                     <div className="biz-form-row">
                        <div className="biz-form-group">
                           <label className="biz-form-label">
                              Slot Duration (Mins){" "}
                              <span className="biz-req-star--teal">*</span>
                           </label>
                           <input
                              type="number"
                              required
                              value={slotForm.duration_min}
                              onChange={(e) =>
                                 setSlotForm({
                                    ...slotForm,
                                    duration_min: e.target.value,
                                 })
                              }
                              className="biz-input biz-input--teal"
                           />
                        </div>

                        <div className="biz-form-group">
                           <label className="biz-form-label">
                              Max Capacity / Slot{" "}
                              <span className="biz-req-star--teal">*</span>
                           </label>
                           <input
                              type="number"
                              required
                              value={slotForm.max_capacity}
                              onChange={(e) =>
                                 setSlotForm({
                                    ...slotForm,
                                    max_capacity: e.target.value,
                                 })
                              }
                              className="biz-input biz-input--teal"
                           />
                        </div>
                     </div>

                     <div className="biz-modal-actions">
                        <button
                           type="button"
                           onClick={() => setShowSlotModal(false)}
                           className="biz-btn-cancel"
                        >
                           Cancel
                        </button>
                        <button
                           type="submit"
                           disabled={submitting}
                           className="biz-btn-submit-teal"
                        >
                           {submitting
                              ? "Generating Slots..."
                              : "Generate Slots"}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}
         <Footer />
      </>
   );
};

export default BusinessDashboard;
