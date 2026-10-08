import './styles.css';
import { createCalendar, parseYear } from './calendar.js';

const yearInput = document.querySelector('#year');
const guideInput = document.querySelector('#cut-guides');
const printButton = document.querySelector('#print');
const error = document.querySelector('#year-error');
const summary = document.querySelector('#preview-summary');
const calendar = document.querySelector('#calendar');

const previewObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    entry.target.style.setProperty('--preview-scale', entry.contentRect.width / 816);
  }
});

function renderCalendar(year) {
  document.title = `journal-calendar-${String(year).padStart(4, '0')}`;
  previewObserver.disconnect();
  const pages = document.createDocumentFragment();

  for (const [index, month] of createCalendar(year).entries()) {
    const preview = document.createElement('section');
    preview.className = 'month-preview';

    const label = document.createElement('p');
    label.className = 'month-label screen-only';
    label.textContent = `${String(index + 1).padStart(2, '0')} / ${month.name}`;

    const frame = document.createElement('div');
    frame.className = 'sheet-preview';

    const sheet = document.createElement('div');
    sheet.className = 'sheet';

    const content = document.createElement('div');
    content.className = 'month-calendar';

    const heading = document.createElement('h2');
    heading.id = `month-${index}`;
    heading.textContent = `${month.name} ${year}`;
    preview.setAttribute('aria-labelledby', heading.id);

    const table = document.createElement('table');
    table.setAttribute('aria-labelledby', heading.id);
    const colgroup = document.createElement('colgroup');
    for (const column of ['day-column', 'weekday-column', 'writing-column']) {
      const col = document.createElement('col');
      col.className = column;
      colgroup.append(col);
    }
    const tbody = document.createElement('tbody');
    for (const { day, weekday } of month.days) {
      const row = document.createElement('tr');
      const number = document.createElement('th');
      number.scope = 'row';
      number.textContent = day;
      const weekdayCell = document.createElement('td');
      weekdayCell.textContent = weekday;
      const writing = document.createElement('td');
      writing.setAttribute('aria-label', 'Journal space');
      row.append(number, weekdayCell, writing);
      tbody.append(row);
    }
    table.append(colgroup, tbody);
    content.append(heading, table);
    sheet.append(content);

    for (const direction of ['right', 'bottom']) {
      const guide = document.createElement('div');
      guide.className = `cut-guide cut-guide-${direction}`;
      guide.setAttribute('aria-hidden', 'true');
      sheet.append(guide);
    }

    frame.append(sheet);
    preview.append(label, frame);
    pages.append(preview);
  }

  calendar.replaceChildren(pages);
  for (const frame of calendar.querySelectorAll('.sheet-preview')) {
    previewObserver.observe(frame);
  }
  summary.textContent = `${year} / 12 months, 12 sheets`;
}

function updateYear() {
  let year;
  try {
    year = parseYear(yearInput.value);
  } catch (validationError) {
    if (!(validationError instanceof RangeError)) throw validationError;
    error.textContent = validationError.message;
    yearInput.setAttribute('aria-invalid', 'true');
    printButton.disabled = true;
    calendar.hidden = true;
    summary.textContent = 'Enter a valid year to preview your calendar.';
    return;
  }

  error.textContent = '';
  yearInput.removeAttribute('aria-invalid');
  printButton.disabled = false;
  calendar.hidden = false;
  renderCalendar(year);
}

yearInput.value = new Date().getFullYear();
yearInput.addEventListener('input', updateYear);
guideInput.addEventListener('change', () => {
  calendar.classList.toggle('show-guides', guideInput.checked);
});
printButton.addEventListener('click', () => {
  if (!printButton.disabled) window.print();
});
updateYear();
