import assert from 'node:assert/strict';
import test from 'node:test';
import { createCalendar, parseYear } from '../src/calendar.js';

test('accepts whole years 1 through 9999', () => {
  for (const [input, expected] of [['1', 1], ['0099', 99], ['2025', 2025], ['9999', 9999], [' 2026 ', 2026]]) {
    assert.equal(parseYear(input), expected);
  }
});

test('rejects missing, malformed, fractional, and out-of-range years', () => {
  for (const input of ['', ' ', '0', '0000', '-1', '10000', '2025.5', '2e3', '20a5', '+2025', '2025\n2026', 'Infinity', undefined, null, 2025]) {
    assert.throws(() => parseYear(input), { name: 'RangeError', message: 'Enter a whole year from 1 to 9999.' });
  }
  for (const year of [0, -1, 10000, 2025.5, NaN, Infinity, '2025', null]) {
    assert.throws(() => createCalendar(year), RangeError);
  }
});

test('matches the reference 2025 calendar', () => {
  const months = createCalendar(2025);
  assert.deepEqual(months.map(({ days }) => days.length), [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
  assert.deepEqual(months.map(({ days }) => days[0].weekday), ['Wed', 'Sat', 'Sat', 'Tue', 'Thu', 'Sun', 'Tue', 'Fri', 'Mon', 'Wed', 'Sat', 'Mon']);
  assert.equal(months[11].days.at(-1).weekday, 'Wed');
});

for (const [year, leap, firstWeekday] of [
  [1, false, 'Mon'], [99, false, 'Thu'], [1900, false, 'Mon'],
  [2000, true, 'Sat'], [2024, true, 'Mon'], [2025, false, 'Wed'],
  [2100, false, 'Fri'], [9999, false, 'Fri'],
]) {
  test(`generates all dates and consistent weekdays for ${year}`, () => {
    const months = createCalendar(year);
    assert.equal(months.length, 12);
    assert.equal(months[0].name, 'January');
    assert.equal(months[11].name, 'December');
    assert.deepEqual(months.map(({ days }) => days.length), [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let expectedWeekday = weekdays.indexOf(firstWeekday);
    let total = 0;
    for (const month of months) {
      assert.equal(month.year, year);
      for (const [index, date] of month.days.entries()) {
        assert.equal(date.day, index + 1);
        assert.equal(date.weekday, weekdays[expectedWeekday]);
        expectedWeekday = (expectedWeekday + 1) % 7;
        total++;
      }
    }
    assert.equal(total, leap ? 366 : 365);
  });
}

test('obeys the Gregorian leap-year rule across a complete 400-year cycle', () => {
  for (let year = 2000; year < 2400; year++) {
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    assert.equal(createCalendar(year)[1].days.length, leap ? 29 : 28, `${year}`);
  }
});
