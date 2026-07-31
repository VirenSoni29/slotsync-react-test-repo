export default function formatTime(timeStr) {
   // '10:30:00' → '10:30 AM'
   const [h, m] = timeStr.split(':');
   const hour = parseInt(h);
   const ampm = hour >= 12 ? 'PM' : 'AM';
   const hour12 = hour % 12 || 12;
   return `${hour12}:${m} ${ampm}`;
}