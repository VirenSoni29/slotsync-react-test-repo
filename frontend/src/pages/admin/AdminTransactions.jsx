import { useEffect, useState } from "react";
import { getAllTransactions } from "../../services/adminService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
   Loading01Icon,
   Search02Icon,
   UserIcon,
} from "@hugeicons/core-free-icons";
import { formatTimestamp } from "../../helpers/formatDate";
import "../../css/admin.css";

const AdminTransactions = () => {
   const [transactions, setTransactions] = useState([]);
   const [loading, setLoading] = useState(true);

   // Filtering, Sorting, Searching & Pagination State
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedStatus, setSelectedStatus] = useState("all");
   const [selectedMethod, setSelectedMethod] = useState("all");
   const [sortBy, setSortBy] = useState("created-newest");

   const [totalTransactions, setTotalTransactions] = useState(0);
   const [itemsPerPage, setItemsPerPage] = useState(10);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);

   useEffect(() => {
      const rawParams = {
         search: searchQuery,
         status: selectedStatus,
         method: selectedMethod,
         sort: sortBy,
         page: currentPage,
         limit: itemsPerPage,
      };

      const cleanedParams = Object.fromEntries(
         Object.entries(rawParams).filter(([key, value]) => {
            if (
               value === "" ||
               value === null ||
               value === undefined ||
               value === "all"
            )
               return false;
            if (key === "page" && value <= 1) return false;
            if (key === "sort" && value === "created-newest") return false;
            return true;
         }),
      );

      (async () => {
         try {
            const res = await getAllTransactions(cleanedParams);
            const data = res.data || {};
            const list = data.transactions || [];
            const pagination = data.pagination || {};

            setTransactions(list);
            setTotalTransactions(pagination.totalTransactions || 0);
            setCurrentPage(pagination.currentPage || 1);
            setItemsPerPage(pagination.transactionsPerPage || 10);
            setTotalPages(pagination.totalPages || 1);
         } catch (err) {
            toast.error(
               err.response?.data?.message ||
                  "Failed to load transaction ledger.",
            );
         } finally {
            setLoading(false);
         }
      })();
   }, [
      searchQuery,
      selectedStatus,
      selectedMethod,
      sortBy,
      currentPage,
      itemsPerPage,
   ]);

   return (
      <>
         <Navbar />

         {/* ===================== PAGE HEADER ===================== */}
         <section className="page-header">
            <div className="page-header-inner max-w-362.5">
               <div className="section-tag">Admin Ledger</div>
               <h1>Global Platform Ledger</h1>
               <p>
                  Audit platform payments, track transaction records, and monitor financial logs.
               </p>
            </div>
         </section>

         <div className="admin-main">
            <div className="admin-content">
               {/* Controls Header: Search, Filters, and Per-Page Selector */}
               <div className="table-options">
                  <div className="search-and-filters">
                     <div className="search-group">
                        <HugeiconsIcon
                           icon={Search02Icon}
                           strokeWidth={2}
                           size={17}
                           className="search-icon"
                        />
                        <input
                           type="text"
                           name="txSearch"
                           placeholder="Search by customer, email, business, or service..."
                           value={searchQuery}
                           onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setCurrentPage(1);
                           }}
                        />
                     </div>

                     <div className="filter-group">
                        <select
                           name="statusFilter"
                           value={selectedStatus}
                           onChange={(e) => {
                              setSelectedStatus(e.target.value);
                              setCurrentPage(1);
                           }}
                        >
                           <option value="all">All Statuses</option>
                           <option value="paid">Paid Only</option>
                           <option value="pending">Pending Only</option>
                           <option value="failed">Failed Only</option>
                           <option value="refunded">Refunded Only</option>
                        </select>

                        <select
                           name="methodFilter"
                           value={selectedMethod}
                           onChange={(e) => {
                              setSelectedMethod(e.target.value);
                              setCurrentPage(1);
                           }}
                        >
                           <option value="all">All Payment Methods</option>
                           <option value="free_mode">Free Demo Mode</option>
                           <option value="razorpay">Razorpay Live</option>
                        </select>

                        <select
                           name="sortFilter"
                           value={sortBy}
                           onChange={(e) => setSortBy(e.target.value)}
                        >
                           <option value="created-newest">
                              Date (Newest First)
                           </option>
                           <option value="created-oldest">
                              Date (Oldest First)
                           </option>
                           <option value="amount-highest">
                              Amount (Highest First)
                           </option>
                           <option value="amount-lowest">
                              Amount (Lowest First)
                           </option>
                           <option value="id-greatest">
                              Tx ID (Highest First)
                           </option>
                           <option value="id-least">
                              Tx ID (Lowest First)
                           </option>
                        </select>
                     </div>
                  </div>

                  <div className="user-per-page">
                     <span>
                        <HugeiconsIcon
                           icon={UserIcon}
                           size={17}
                           strokeWidth={2}
                        />{" "}
                        Per Page:
                     </span>
                     <select
                        name="itemsPerPage"
                        value={itemsPerPage}
                        onChange={(e) => {
                           setItemsPerPage(Number(e.target.value));
                           setCurrentPage(1);
                        }}
                     >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                     </select>
                  </div>
               </div>

               {/* Pagination metadata label */}
               <span className="pagination-metadata">
                  Showing{" "}
                  {totalTransactions === 0
                     ? "0"
                     : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalTransactions)} of ${totalTransactions}`}{" "}
                  transactions
               </span>

               {/* Transactions Table */}
               <div className="users-table">
                  <table>
                     <thead>
                        <tr>
                           <th className="text-left">Tx ID</th>
                           <th className="text-left">Customer Info</th>
                           <th className="text-left">Business & Service</th>
                           <th className="text-center">Amount</th>
                           <th className="text-center">Payment Method</th>
                           <th className="text-center">Status</th>
                           <th className="text-center">Date & Time</th>
                        </tr>
                     </thead>
                     <tbody>
                        {loading ? (
                           <tr>
                              <td colSpan={7} className="no-records">
                                 <HugeiconsIcon
                                    icon={Loading01Icon}
                                    size={22}
                                    className="spin-animation"
                                 />{" "}
                                 Loading transaction ledger...
                              </td>
                           </tr>
                        ) : transactions.length > 0 ? (
                           transactions.map((tx) => (
                              <tr key={tx.id}>
                                 <td className="text-left font-semibold text-(--clr-text-3) text-[0.82rem]">
                                    #{tx.id}
                                 </td>
                                 <td className="text-left">
                                    <div className="font-semibold text-(--clr-text) text-[0.92rem]">
                                       {tx.customer_name || "---"}
                                    </div>
                                    <div className="text-[0.78rem] text-(--clr-text-3)">
                                       {tx.customer_email || "---"}
                                    </div>
                                 </td>
                                 <td className="text-left">
                                    <div className="font-semibold text-(--clr-text) text-[0.92rem]">
                                       {tx.business_name || "Platform"}
                                    </div>
                                    <div className="text-[0.78rem] text-(--clr-accent-2)">
                                       {tx.service_name || "---"}
                                    </div>
                                 </td>
                                 <td className="text-center font-display font-bold text-(--clr-green) text-[0.98rem]">
                                    ₹{tx.amount}
                                 </td>
                                 <td className="text-center">
                                    <span
                                       className={`approved-tag${
                                          tx.payment_method === "free_mode"
                                             ? " freemode-tag"
                                             : " razorpay-tag"
                                       }`}
                                    >
                                       {tx.payment_method === "free_mode"
                                          ? "🎁 Free Demo"
                                          : "💳 Razorpay"}
                                    </span>
                                 </td>
                                 <td className="text-center">
                                    <span
                                       className={
                                          tx.payment_status === "paid"
                                             ? "approved-tag"
                                             : tx.payment_status === "pending"
                                               ? "pending-tag"
                                               : "rejected-tag"
                                       }
                                    >
                                       {tx.payment_status}
                                    </span>
                                 </td>
                                 <td className="text-center text-[0.82rem] text-(--clr-text-2)">
                                    {formatTimestamp(tx.created_at)}
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan={7} className="no-records">
                                 😓 No transactions found matching filter
                                 criteria.
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>

               {/* Pagination Controls */}
               <div className="pagination-controls">
                  <button
                     disabled={currentPage === 1}
                     onClick={() => setCurrentPage(currentPage - 1)}
                  >
                     Previous
                  </button>
                  <span>
                     Page {currentPage} of {totalPages}
                  </span>
                  <button
                     disabled={currentPage >= totalPages}
                     onClick={() => setCurrentPage(currentPage + 1)}
                  >
                     Next
                  </button>
               </div>
            </div>
         </div>
         <Footer />
      </>
   );
};

export default AdminTransactions;
