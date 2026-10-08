const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function parseYear(input) {
  if (typeof input !== 'string' || !/^[0-9]{1,4}$/.test(input.trim())) {
    throw new RangeError('Enter a whole year from 1 to 9999.');
  }
  const year = Number(input.trim());
  if (year < 1 || year > 9999) {
    throw new RangeError('Enter a whole year from 1 to 9999.');
  }
  return year;
}

export function createCalendar(year) {
  if (!Number.isInteger(year) || year < 1 || year > 9999) {
    throw new RangeError('Enter a whole year from 1 to 9999.');
  }

  const date = new Date(0);
  date.setUTCFullYear(year, 0, 1);

  return MONTHS.map((name, month) => {
    const days = [];
    while (date.getUTCFullYear() === year && date.getUTCMonth() === month) {
      days.push({
        day: date.getUTCDate(),
        weekday: WEEKDAYS[date.getUTCDay()],
      });
      date.setUTCDate(date.getUTCDate() + 1);
    }
    return { name, year, days };
  });
}
