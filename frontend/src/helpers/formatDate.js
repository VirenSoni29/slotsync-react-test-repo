export function parseDate(dateStr) {
   if (!dateStr) return null;
   const cleanStr = typeof dateStr === 'string' ? dateStr.split('T')[0] : dateStr;
   let d = new Date(cleanStr + 'T00:00:00');
   if (isNaN(d.getTime())) {
      d = new Date(dateStr);
   }
   if (isNaN(d.getTime())) return null;
   return d;
}

export function formatDate(dateStr) {
   const d = parseDate(dateStr);
   if (!d) return '---';

   return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
   });
}

export function formatDateAndDay(dateStr) {
   const d = parseDate(dateStr);
   if (!d) return '---';

   return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
   });
}

export function formatBookingDateCard(dateStr) {
   const d = parseDate(dateStr);
   if (!d) return { day: '—', month: '—', full: '—' };

   return {
      day: d.getDate(),
      month: d.toLocaleString('en-IN', { month: 'short' }),
      full: d.toLocaleDateString('en-IN', {
         weekday: 'short',
         day: 'numeric',
         month: 'short',
         year: 'numeric'
      })
   };
}

export function formatTimestamp(timestamp) {
   if (!timestamp) return '---';
   const date = new Date(timestamp);
   if (isNaN(date.getTime())) return '---';
   return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
   });
}