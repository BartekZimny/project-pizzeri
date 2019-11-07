import { templates, select } from '../settings.js';
import AmountWidget from './AmountWidget.js';

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
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}

export default Booking;