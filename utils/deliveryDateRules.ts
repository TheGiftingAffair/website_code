const SG_TZ = "Asia/Singapore";

// Today's date in Singapore, as YYYY-MM-DD
export const getSingaporeToday = (): string =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: SG_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

// Earliest allowed date = tomorrow
export const getMinDeliveryDate = (): string => {
  const [y, m, d] = getSingaporeToday().split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().split("T")[0];
};

// Latest allowed date = 3 months from today
export const getMaxDeliveryDate = (): string => {
  const [y, m, d] = getSingaporeToday().split("-").map(Number);
  return new Date(Date.UTC(y, m - 1 + 3, d)).toISOString().split("T")[0];
};

// true if the date is empty, invalid, today, or in the past
export const isDeliveryDateTooSoon = (date?: string | null): boolean => {
  if (!date || !/^\d{4}-\d{2}-\d{2}/.test(date)) return true;
  return date.slice(0, 10) < getMinDeliveryDate();
};
