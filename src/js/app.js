import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';

const app = {
  initPages: function() {
    const thisApp = this;

    /* find all subpage containers and all links to subpages */
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    /* get subpage(to be opened as default) id from hash id */
    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    /* check if any of the subpages matches the id we obtained from the website address,
    if not open the first subpage, 
    if so open the subpage that matches the id obtained from the page address */
    for (let page of thisApp.pages) {
      if (page.id === idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }

    /* activate the appropriate subpage */
    thisApp.activatePage(pageMatchingHash);

    /* addEventListener to all links that link to the subpages */
    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function(event) {
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#', '');

        /* run thisApp.activatePage with that id */
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId) {
    const thisApp = this;

    /* add class "active" to matching pages, remove from non-matching */
    for (let page of thisApp.pages) {
      // if(page.id === pageId){
      //   page.classList.add(classNames.pages.active);
      // } else {
      //   page.classList.remove(classNames.pages.active);
      // }

      page.classList.toggle(classNames.pages.active, page.id === pageId);
    }

    /* add class "active" to matching links, remove from non-matching */
    for (let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') === '#' + pageId);
    }
  },

  initMenu: function() {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function() {
    const thisApp = this;

    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponse) {
        return rawResponse.json();
      })
      .then(function(parsedResponse) {
        /* save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;

        /* execute initMenu method */
        thisApp.initMenu();
      });
  },

  initCart: function() {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event) {
      app.cart.add(event.detail.product);
    });
  },

  initBooking: function() {
    const thisApp = this;

    const bookingElem = document.querySelector(select.containerOf.booking);
    thisApp.cart = new Booking(bookingElem);
  },

  init: function() {
    const thisApp = this;

    thisApp.initPages();

    thisApp.initData();

    thisApp.initCart();

    thisApp.initBooking();
  }
};

app.init();