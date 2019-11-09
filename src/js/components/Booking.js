import { templates, select, settings, classNames } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import { utils } from '../utils.js';

class Booking {
  constructor(bookingElem) {
    const thisBooking = this;

    thisBooking.render(bookingElem);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.makeReservation();
  }

  getData() {
    const thisBooking = this;

    const startDayParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [startDayParam, endDateParam],
      eventsCurrent: [settings.db.notRepeatParam, startDayParam, endDateParam],
      eventsRepeat: [settings.db.repeatParam, endDateParam]
    };

    // console.log('getData params', params);

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat.join('&')
    };

    // console.log('getData urls', urls);

    Promise.all([fetch(urls.booking), fetch(urls.eventsCurrent), fetch(urls.eventsRepeat)])
      .then(function (allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([bookingsResponse.json(), eventsCurrentResponse.json(), eventsRepeatResponse.json()]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        // console.log(bookings);
        // console.log(eventsCurrent);
        // console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }

    // console.log('thisBooking.booked', thisBooking.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if (typeof thisBooking.booked[thisBooking.date] == 'undefined' || typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined') {
      allAvailable = true;
    }

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (!allAvailable && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId) > -1) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  makeReservation() {
    const thisBooking = this;

    /* find all clickable tables (element that should react to clicking) */
    const allTables = thisBooking.dom.tables;
    console.log('allTables:', allTables);

    /* START LOOP: for each clickable single table */
    for (let singleTable of allTables) {
      /* START: click event listener to single table */
      singleTable.addEventListener('click', function (event) {
        event.preventDefault();

        /* toggle reservation class on single table */
        singleTable.classList.toggle(classNames.booking.tableReservation);
      });
    }

    /* find all reserved tables */
    const allReservedTables = document.querySelectorAll(select.booking.tablesReserved);
    console.log('allReservedTables:', allReservedTables);

    /* START LOOP: for each reserved tables */
    for (let reservedTable of allReservedTables) {
      /* START: if reserved table.... */
      if (reservedTable) {
        /* remove class reservation for the reserved table */
        reservedTable.classList.remove(classNames.booking.tableReservation);
      }
    }
  }

  render(bookingElem) {
    const thisBooking = this;

    /* generate HTML based on template */
    const generatedHTML = templates.bookingWidget();

    /* create empty object thisBooking.dom */
    thisBooking.dom = {};

    /* add wrapper property to thisBooking.dom */
    thisBooking.dom.wrapper = bookingElem;

    /* change the content of the wrapper to HTML generated from the template */
    bookingElem.innerHTML = generatedHTML;

    /* save a single element found in the wrapper and matching the select.booking.peopleAmount selector in the thisBooking.dom.peopleAmount property */
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);

    /* save a single element found in the wrapper and matching the select.booking.hoursAmount selector in the thisBooking.dom.hoursAmount property */
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    /* save a single element found in the wrapper and matching the select.widgets.datePicker.wrapper selector in the thisBooking.dom.datePicker property */
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);

    /* save a single element found in the wrapper and matching the select.widgets.hourPicker.wrapper selector in the thisBooking.dom.hourPicker property */
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

    /* save a multiple elements found in the wrapper and matching the select.booking.tables selector in the thisBooking.dom.tables property */
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);

    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
    });
  }
}

export default Booking;