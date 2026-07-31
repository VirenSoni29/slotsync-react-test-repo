export function formatDate(dateStr) {
   if (!dateStr) return '---'

   return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
   })
}

export function formatDateAndDay(dateStr) {
   // '2025-02-10' → 'Mon, 10 Feb 2025'
   const d = new Date(dateStr + 'T00:00:00');
   return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}