import { templates, select, settings } from '../settings.js';
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
      .then(function(allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([bookingsResponse.json(), eventsCurrentResponse.json(), eventsRepeatResponse.json()]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]) {
        console.log(bookings);
        console.log(eventsCurrent);
        console.log(eventsRepeat);
      });
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
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);

    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
  }
}

export default Booking;