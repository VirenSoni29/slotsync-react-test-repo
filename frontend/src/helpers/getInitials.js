export default function getInitials(name = '') {
   return name.trim().split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || null
}