import { HugeiconsIcon } from "@hugeicons/react";
import getServiceIcon from "../helpers/getServiceIcon";
import { Link } from "react-router-dom";
import { ArrowRight01Icon, Clock01Icon } from "@hugeicons/core-free-icons";

const ServiceCard = ({ service, index }) => {
   return (
      <div
         className="service-card-full"
         style={{ animationDelay: `${index * 0.05}s` }}
      >
         <div className="card-top">
            <div className="card-icon-wrap">
               <HugeiconsIcon
                  icon={getServiceIcon(service.service_name)}
                  size={21}
                  strokeWidth={2.3}
                  className="text-(--clr-accent-2)"
               />
            </div>
            <div className="card-info">
               <h3>{service.service_name}</h3>
               <p>
                  {service.description ||
                     "Professional service available for booking."}
               </p>
            </div>
         </div>
         <div className="card-meta">
            <span className="card-price">₹{service.price}</span>
            <span className="card-duration">
               <HugeiconsIcon icon={Clock01Icon} size={13} strokeWidth={2} />
               {service.duration_minutes} min
            </span>
         </div>
         <Link to={`/services/book?service=${service.id}`} className="card-book-btn">
            Book Now
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} size={14.4} />
         </Link>
      </div>
   );
};

export default ServiceCard;
