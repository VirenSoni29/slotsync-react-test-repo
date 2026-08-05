export default function formatTime(timeStr) {
   if (!timeStr) return "—";
   // '10:30:00' → '10:30 AM'
   const [h, m] = timeStr.split(':');
   const hour = parseInt(h);
   if (isNaN(hour)) return "—";
   const ampm = hour >= 12 ? 'PM' : 'AM';
   const hour12 = hour % 12 || 12;
   return `${hour12}:${m} ${ampm}`;
}