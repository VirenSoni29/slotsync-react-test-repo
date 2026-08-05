import { useEffect, useState } from "react";
import {
   Alert02Icon,
   CheckmarkCircle01Icon,
   InformationCircleIcon,
   Loading02Icon,
   OctagonXIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
   const [theme, setTheme] = useState(() => {
      return (
         document.documentElement.getAttribute("data-theme") ||
         localStorage.getItem("theme") ||
         "light"
      );
   });

   useEffect(() => {
      const observer = new MutationObserver(() => {
         const currentTheme =
            document.documentElement.getAttribute("data-theme") || "light";
         setTheme(currentTheme);
      });

      observer.observe(document.documentElement, {
         attributes: true,
         attributeFilter: ["data-theme"],
      });

      return () => observer.disconnect();
   }, []);

   const isLight = theme === "light";

   return (
      <Sonner
         theme={theme}
         className="toaster group"
         icons={{
            success: (
               <HugeiconsIcon
                  icon={CheckmarkCircle01Icon}
                  strokeWidth={2}
                  className="size-4"
               />
            ),
            info: (
               <HugeiconsIcon
                  icon={InformationCircleIcon}
                  strokeWidth={2}
                  className="size-4"
               />
            ),
            warning: (
               <HugeiconsIcon
                  icon={Alert02Icon}
                  strokeWidth={2}
                  className="size-4"
               />
            ),
            error: (
               <HugeiconsIcon
                  icon={OctagonXIcon}
                  strokeWidth={2}
                  className="size-4"
               />
            ),
            loading: (
               <HugeiconsIcon
                  icon={Loading02Icon}
                  strokeWidth={2}
                  className="size-4 animate-spin"
               />
            ),
         }}
         toastOptions={{
            classNames: {
               toast: "group-[.toaster]:!py-3 group-[.toaster]:!text-sm group-[.toaster]:items-center",
               title: "group-[.toast]:!text-sm",
               description: "group-[.toast]:!text-xs",
               icon: "group-[.toast]:!w-6 group-[.toast]:!h-6 group-[.toast]:!mr-2",
            },
         }}
         style={
            isLight
               ? {
                    "--normal-bg": "#ffffff",
                    "--normal-text": "#161623",
                    "--normal-border": "#e2e2ee",
                    "--border-radius": "0.8rem",

                    "--success-bg": "#ecfdf5",
                    "--success-text": "#047857",
                    "--success-border": "#a7f3d0",

                    "--error-bg": "#fef2f2",
                    "--error-text": "#dc2626",
                    "--error-border": "#fecaca",
                 }
               : {
                    "--normal-bg": "#16161f",
                    "--normal-text": "#f0f0f8",
                    "--normal-border": "rgba(255, 255, 255, 0.14)",
                    "--border-radius": "0.8rem",

                    "--success-bg": "#002f29",
                    "--success-text": "#22d3a5",
                    "--success-border": "#025245",

                    "--error-bg": "#450a0a",
                    "--error-text": "#f87171",
                    "--error-border": "#7f1d1d",
                 }
         }
         {...props}
      />
   );
};

export { Toaster };

