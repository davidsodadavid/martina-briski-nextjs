export function toDatetimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatEventTiming(date: Date, endTime: Date | null) {
  const dateLabel = date.toLocaleDateString("hr-HR");
  const startLabel = date.toLocaleTimeString("hr-HR", {
    hour: "numeric",
    minute: "2-digit",
  });
  if (!endTime) {
    return `${dateLabel}, ${startLabel}`;
  }
  const endTimeLabel = endTime.toLocaleTimeString("hr-HR", {
    hour: "numeric",
    minute: "2-digit",
  });
  if (isSameDay(date, endTime)) {
    return `${dateLabel}, ${startLabel} – ${endTimeLabel}`;
  }
  const endDateLabel = endTime.toLocaleDateString("hr-HR");
  return `${dateLabel}, ${startLabel} – ${endDateLabel}, ${endTimeLabel}`;
}
