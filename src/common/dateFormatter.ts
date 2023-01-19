export function dateFormatter(date: Date): string {
  date.setDate(date.getDate() + 1);
  const a = date.toLocaleString('default', {day:'numeric', month:'short', year:'2-digit'}).split(' ');
  return a.join('-');
}
