import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "../../services/adminService";
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

const AdminUsers = () => {
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [activeLoading, setActiveLoading] = useState(null);
   const [selectedRoleAction, setSelectedRoleAction] = useState({});

   // Filtering, Sorting, Searching & Pagination State
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedStatus, setSelectedStatus] = useState("all");
   const [selectedRole, setSelectedRole] = useState("all");
   const [sortBy, setSortBy] = useState("id-greatest");

   const [totalUsers, setTotalUsers] = useState(0);
   const [usersPerPage, setUsersPerPage] = useState(10);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);

   const rawParams = {
      search: searchQuery,
      status: selectedStatus,
      role: selectedRole,
      sort: sortBy,
      page: currentPage,
      limit: usersPerPage,
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
         if (key === "sort" && value === "id-greatest") return false;
         return true;
      }),
   );

   const fetchUsers = async () => {
      try {
         const res = await getAllUsers(cleanedParams);
         const data = res.data || {};
         const userList = data.users || [];
         const pagination = data.pagination || {};

         setUsers(userList);
         setTotalUsers(pagination.totalUsers || 0);
         setCurrentPage(pagination.currentPage || 1);
         setUsersPerPage(pagination.usersPerPage || 10);
         setTotalPages(pagination.totalPages || 1);

         const initialRoles = {};
         userList.forEach((u) => {
            initialRoles[u.id] = u.role;
         });
         setSelectedRoleAction(initialRoles);
      } catch (err) {
         toast.error(
            err.response?.data?.message || "Failed to fetch platform users.",
         );
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      const rawParams = {
         search: searchQuery,
         status: selectedStatus,
         role: selectedRole,
         sort: sortBy,
         page: currentPage,
         limit: usersPerPage,
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
            if (key === "sort" && value === "id-greatest") return false;
            return true;
         }),
      );

      (async () => {
         try {
            const res = await getAllUsers(cleanedParams);
            const data = res.data || {};
            const userList = data.users || [];
            const pagination = data.pagination || {};

            setUsers(userList);
            setTotalUsers(pagination.totalUsers || 0);
            setCurrentPage(pagination.currentPage || 1);
            setUsersPerPage(pagination.usersPerPage || 10);
            setTotalPages(pagination.totalPages || 1);

            const initialRoles = {};
            userList.forEach((u) => {
               initialRoles[u.id] = u.role;
            });
            setSelectedRoleAction(initialRoles);
         } catch (err) {
            toast.error(
               err.response?.data?.message || "Failed to fetch platform users.",
            );
         } finally {
            setLoading(false);
         }
      })();
   }, [
      searchQuery,
      selectedStatus,
      selectedRole,
      sortBy,
      currentPage,
      usersPerPage,
   ]);

   const handleRoleSubmit = async (userId) => {
      const newRole = selectedRoleAction[userId];
      if (!newRole) return;

      setActiveLoading(userId);
      try {
         const res = await updateUserRole(userId, newRole);
         toast.success(res.message || "User role updated successfully.");
         await fetchUsers();
      } catch (err) {
         toast.error(
            err.response?.data?.message || "Failed to update user role.",
         );
      } finally {
         setActiveLoading(null);
      }
   };

   return (
      <>
         <Navbar />

         {/* ===================== PAGE HEADER ===================== */}
         <section className="page-header">
            <div className="page-header-inner max-w-362.5">
               <div className="section-tag">Admin Dashboard</div>
               <h1>User Directory & Role Management</h1>
               <p>
                  Manage platform user accounts, search directory, filter roles,
                  and update permissions.
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
                           name="userSearch"
                           placeholder="Search by name, email, phone, or business..."
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
                           <option value="all">All Verification Status</option>
                           <option value="verified">Verified Only</option>
                           <option value="unverified">Unverified Only</option>
                        </select>

                        <select
                           name="roleFilter"
                           value={selectedRole}
                           onChange={(e) => {
                              setSelectedRole(e.target.value);
                              setCurrentPage(1);
                           }}
                        >
                           <option value="all">All Roles</option>
                           <option value="customer">Customer</option>
                           <option value="business_owner">
                              Business Owner
                           </option>
                           <option value="admin">Platform Admin</option>
                        </select>

                        <select
                           name="sortFilter"
                           value={sortBy}
                           onChange={(e) => setSortBy(e.target.value)}
                        >
                           <option value="id-greatest">
                              UserID (Highest First)
                           </option>
                           <option value="id-least">
                              UserID (Lowest First)
                           </option>
                           <option value="created-newest">
                              Created (Newest First)
                           </option>
                           <option value="created-oldest">
                              Created (Oldest First)
                           </option>
                           <option value="az">Name (A-Z)</option>
                           <option value="za">Name (Z-A)</option>
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
                        Users Per Page:
                     </span>
                     <select
                        name="userPerPage"
                        value={usersPerPage}
                        onChange={(e) => {
                           setUsersPerPage(Number(e.target.value));
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
                  {totalUsers === 0
                     ? "0"
                     : `${(currentPage - 1) * usersPerPage + 1}-${Math.min(currentPage * usersPerPage, totalUsers)} of ${totalUsers}`}{" "}
                  users
               </span>

               {/* Users Table */}
               <div className="users-table">
                  <table>
                     <thead>
                        <tr>
                           <th className="text-left">User</th>
                           <th className="text-left">Contact Info</th>
                           <th className="text-center">Role</th>
                           <th className="text-center">Verification</th>
                           <th className="text-left">Business Entry</th>
                           <th className="text-center">Joined At</th>
                           <th className="text-center">Change Role</th>
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
                                 Loading directory...
                              </td>
                           </tr>
                        ) : users.length > 0 ? (
                           users.map((u) => (
                              <tr key={u.id}>
                                 {/* User Column with Profile Avatar */}
                                 <td className="text-left">
                                    <div className="flex items-center gap-3">
                                       <div className="w-9.5 h-9.5 rounded-full bg-(--clr-accent)/18 text-(--clr-accent-2) flex items-center justify-center font-bold text-[0.9rem] shrink-0 border border-(--clr-accent)/30">
                                          {u.name?.charAt(0)?.toUpperCase() ||
                                             "👤"}
                                       </div>
                                       <div>
                                          <p className="font-semibold text-(--clr-text) text-[0.92rem]">
                                             {u.name || "---"}
                                          </p>
                                          <p className="text-[0.78rem] text-(--clr-text-3)">
                                             ID: #{u.id}
                                          </p>
                                       </div>
                                    </div>
                                 </td>

                                 {/* Contact Column */}
                                 <td className="text-left">
                                    <p className="text-(--clr-text) text-[0.88rem]">
                                       {u.email || "---"}
                                    </p>
                                    <p className="text-[0.78rem] text-(--clr-text-3)">
                                       {u.phone ? `+91 ${u.phone}` : "---"}
                                    </p>
                                 </td>

                                 {/* Role Column */}
                                 <td className="text-center">
                                    <span
                                       className={`approved-tag${
                                          u.role === "admin"
                                             ? " admin-tag"
                                             : u.role === "business_owner"
                                               ? " business-owner-tag"
                                               : " customer"
                                       }`}
                                    >
                                       {u.role === "admin"
                                          ? "Platform Admin"
                                          : u.role === "business_owner"
                                            ? "Business Owner"
                                            : "Customer"}
                                    </span>
                                 </td>

                                 {/* Verification Status */}
                                 <td className="text-center">
                                    <span
                                       className={
                                          u.is_verified
                                             ? "approved-tag"
                                             : "rejected-tag"
                                       }
                                    >
                                       {u.is_verified
                                          ? "Verified"
                                          : "Unverified"}
                                    </span>
                                 </td>

                                 {/* Business Entry */}
                                 <td className="text-left">
                                    {u.business_name ? (
                                       <span className="text-(--clr-accent-2) font-semibold text-[0.88rem]">
                                          {u.business_name}
                                       </span>
                                    ) : (
                                       <span className="text-(--clr-text-3) text-[0.88rem]">
                                          —
                                       </span>
                                    )}
                                 </td>

                                 {/* Joined At */}
                                 <td className="text-center text-[0.82rem] text-(--clr-text-2)">
                                    {formatTimestamp(u.created_at)}
                                 </td>

                                 {/* Role Action Selector */}
                                 <td className="action-cell">
                                    <select
                                       value={
                                          selectedRoleAction[u.id] || u.role
                                       }
                                       onChange={(e) =>
                                          setSelectedRoleAction((prev) => ({
                                             ...prev,
                                             [u.id]: e.target.value,
                                          }))
                                       }
                                       disabled={activeLoading === u.id}
                                    >
                                       <option value="customer">
                                          Customer
                                       </option>
                                       <option value="business_owner">
                                          Business Owner
                                       </option>
                                       <option value="admin">
                                          Platform Admin
                                       </option>
                                    </select>
                                    <button
                                       className="action-btn"
                                       onClick={() => handleRoleSubmit(u.id)}
                                       disabled={
                                          selectedRoleAction[u.id] === u.role ||
                                          activeLoading === u.id
                                       }
                                    >
                                       {activeLoading === u.id ? (
                                          <HugeiconsIcon
                                             icon={Loading01Icon}
                                             size={15}
                                             className="spin-animation"
                                             strokeWidth={2.5}
                                          />
                                       ) : (
                                          "Submit"
                                       )}
                                    </button>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan={7} className="no-records">
                                 😓 No users found matching filter criteria.
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

export default AdminUsers;
