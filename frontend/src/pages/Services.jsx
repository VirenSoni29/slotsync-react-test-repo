import "../css/main.css";
import "../css/services.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search02Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllServices } from "../services/servicesService";
import ServiceCard from "../components/ServiceCard";

const Services = () => {
   const [state, setState] = useState(0); // 0 -> loading, 1 -> services, 2 -> empty
   const [services, setServices] = useState([]);

   useEffect(() => {
      let isMounted = true;

      const initialize = async () => {
         try {
            const responseData = await getAllServices();

            if (!responseData.success || !responseData.data.length) {
               setState(2);
               return;
            }

            if (isMounted) {
               setServices(responseData.data);
               setState(1);
            }
         } catch (err) {
            toast.error("Could not load services", {
               description: "Make sure the server is running.",
            });
            console.log(err);
         }
      };

      initialize();

      return () => (isMounted = false);
   }, []);

   return (
      <>
         <Navbar />

         {/* ===================== PAGE HEADER ===================== */}
         <section className="page-header">
            <div className="page-header-inner">
               <div className="section-tag">Browse</div>
               <h1>All Services</h1>
               <p>Pick a service, choose a slot and book in seconds.</p>
            </div>
         </section>

         {/* ===================== FILTERS + SEARCH ===================== */}
         <section className="services-controls">
            <div className="controls-inner">
               <div className="search-wrap">
                  <HugeiconsIcon
                     icon={Search02Icon}
                     strokeWidth={2}
                     size={16}
                     className="absolute left-3.5 pointer-events-none text-(--clr-text-3)"
                  />
                  <input
                     type="text"
                     id="searchInput"
                     placeholder="Search services..."
                  />
               </div>
               <div className="sort-wrap">
                  <label htmlFor="sortSelect">Sort by</label>
                  <select id="sortSelect">
                     <option value="default">Default</option>
                     <option value="price-asc">Price: Low to High</option>
                     <option value="price-desc">Price: High to Low</option>
                     <option value="duration-asc">Duration: Shortest</option>
                  </select>
               </div>
            </div>
         </section>

         {/* ===================== SERVICES GRID ===================== */}
         <section className="services-section">
            <div className="services-inner">
               {state === 0 && (
                  <div className="services-loading" id="servicesLoading">
                     <div className="loading-spinner"></div>
                     <p>Loading services...</p>
                  </div>
               )}

               {state === 2 && (
                  <div className="services-empty" id="servicesEmpty">
                     <div className="empty-icon">🔍</div>
                     <h3>No services found</h3>
                     <p>Try a different search term.</p>
                  </div>
               )}

               {state === 1 && (
                  <div className="services-grid" id="servicesGrid">
                     {services.map((s, i) => (
                        <ServiceCard service={s} index={i} key={i} />
                     ))}
                  </div>
               )}
            </div>
         </section>

         <Footer />
      </>
   );
};

export default Services;
