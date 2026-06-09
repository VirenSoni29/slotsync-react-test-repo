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
   return (
      <Sonner
         theme="dark" // Choose "light" or "dark" as your baseline
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
               //? !p-2.5 shrinks padding (default is usually p-4)
               //? !text-base bumps up text sizing (default is text-sm)
               //? items-center cleanly aligns larger elements
               toast: "group-[.toaster]:!py-3 group-[.toaster]:!text-sm group-[.toaster]:items-center",
               title: "group-[.toast]:!text-sm",
               description: "group-[.toast]:!text-xs",
               //? Forces the wrapper slot for icons to correctly expand with your size-6 SVGs
               icon: "group-[.toast]:!w-6 group-[.toast]:!h-6 group-[.toast]:!mr-2",
            },
         }}
         style={{
            // Only overrides the default/normal neutral toast styles
            "--normal-bg": "#1e1650", //? 950 or 900 for dark and 50 or 100 for light
            "--normal-text": "#dde2ff", //? 50 or 100 for dark and 700 or 800 for light
            "--normal-border": "#3825ae", //? 700 or 800 for dark and 200 for light
            "--border-radius": "0.8rem", // Matches Tailwind's 'rounded-lg'

            "--success-bg": "#002f29",
            "--success-text": "#22d3a5",
            "--success-border": "#025245",

            "--error-bg": "#450a0a",
            "--error-text": "#f87171",
            "--error-border": "#7f1d1d",
         }}
         {...props}
      />
   );
};

export { Toaster };
