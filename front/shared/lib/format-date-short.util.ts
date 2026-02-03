export function formatDateShort(date: Date, locale = navigator.language) {
  const localeString = new Date(date).toLocaleString(locale);

  let day: string, month: string, year: string;
  let hours: string, minutes: string;

  // -----------------------------
  // RU формат: 11.12.2025, 22:02:20
  // -----------------------------
  const isRu = locale.startsWith("ru");
  if (isRu) {
    const [datePart, timePart] = localeString.split(", ").map((v) => v.trim());
    const [d, m, y] = datePart.split(".");
    const [h, min] = timePart.split(":");

    day = d;
    month = m;
    year = y.slice(-2);
    hours = h;
    minutes = min;

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  // -----------------------------
  // EN формат: 12/11/2025, 10:02:20 PM
  // -----------------------------
  const [datePart, timePartRaw] = localeString.split(", ").map((v) => v.trim());
  const [m, d, y] = datePart.split("/");

  // Time may be "10:02:20 PM"
  const [time, modifier] = timePartRaw.split(" ");
  let [h, min] = time.split(":");

  // Convert 12-hour to 24-hour
  let hourNum = Number(h);

  if (modifier) {
    if (modifier === "PM" && hourNum !== 12) {
      hourNum += 1;
    }
    if (modifier === "AM" && hourNum === 12) {
      hourNum = 0;
    }
  }

  day = d.padStart(2, "0");
  month = m.padStart(2, "0");
  year = y.slice(-2);
  hours = String(hourNum).padStart(2, "0");
  minutes = min;

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
