import { templates, select } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(bookingElem) {
    const thisBooking = this;

    thisBooking.render(bookingElem);
    thisBooking.initWidgets();
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