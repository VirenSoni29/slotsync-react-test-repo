import { Calendar02Icon, Camera01Icon, DentalToothIcon, Dumbbell01Icon, JusticeScale01Icon, Mortarboard01Icon, ScissorIcon, Stethoscope02Icon, TowelsIcon, Wrench01Icon } from "@hugeicons/core-free-icons";

const iconMappings = [
   {
      keywords: ["hair", "salon"],
      icon: ScissorIcon,
   },
   {
      keywords: ["doctor", "consult", "clinic", "health"],
      icon: Stethoscope02Icon,
   },
   {
      keywords: ["tutor", "math", "teach", "class"],
      icon: Mortarboard01Icon,
   },
   {
      keywords: ["repair", "fix"],
      icon: Wrench01Icon,
   },
   {
      keywords: ["yoga", "fitness", "gym"],
      icon: Dumbbell01Icon,
   },
   {
      keywords: ["massage", "spa"],
      icon: TowelsIcon,
   },
   {
      keywords: ["dental", "teeth"],
      icon: DentalToothIcon,
   },
   {
      keywords: ["legal", "lawyer"],
      icon: JusticeScale01Icon,
   },
   {
      keywords: ["photo", "shoot"],
      icon: Camera01Icon,
   },
];

export default function getServiceIcon(name = "") {
   const lowerName = name.toLowerCase();

   const match = iconMappings.find((item) =>
      item.keywords.some((keyword) =>
         lowerName.includes(keyword)
      )
   );

   return match?.icon || Calendar02Icon;
}