import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

const NotFound = () => {
   return (
      <>
         <title>Oops!!</title>
         <Navbar />
         <div className="w-full min-h-screen flex flex-col justify-center items-center">
            <DotLottieReact
               src="https://lottie.host/2f327090-44e7-44ea-82f0-e54c8b6c0430/8sTrDNCk7L.lottie"
               loop
               autoplay
               className="w-3xl md:w-6xl h-2xl md:h-6xl"
            />
            <h1 className="text-2xl md:text-4xl mb-3">
               Sorry, we couldn't find the page you were looking for.
            </h1>
            <Link
               to="/"
               className="flex items-center justify-between gap-2 mt-3 font-bold"
            >
               <HugeiconsIcon icon={ArrowLeft01Icon} /> Back to Home
            </Link>
         </div>
         <Footer />
      </>
   );
};

export default NotFound;
