/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  const app = {
    initMenu: function () {
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);
      for (let productData in thisApp.data.products) {
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function () {
      const thisApp = this;

      thisApp.data = dataSource;
    },

    init: function () {
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
      thisApp.initMenu();
    },
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.processOrder();

      //console.log('new Product:', thisProduct);
    }
    renderInMenu() {
      const thisProduct = this;

      /*generate HTML based on template*/
      const generatedHTML = templates.menuProduct(thisProduct.data);

      //console.log('generatedHTML:', generatedHTML);
      /*create element using utils.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      /* find menu container*/
      const menuContainer = document.querySelector(select.containerOf.menu);

      //console.log('menuContainer:', menuContainer);
      /*add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }
    getElements() {
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    }
    initAccordion() {
      const thisProduct = this;
      //console.log('thisinitAccordion:', thisProduct);

      /* find the clickable trigger (the element that should react to clicking) */
     //const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      const clickableTrigger = thisProduct.accordionTrigger;
      //console.log('clickableTrigger:', clickableTrigger);
      
      /* START: click event listener to trigger */
      clickableTrigger.addEventListener('click', function (event) {
        //console.log('clicked', event);

        /* prevent default action for event */
        event.preventDefault();
        //console.log(event);

        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle('active');

        //console.log('thisProduct.element:', thisProduct);
        /* find all active products */
        const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
        //console.log('activeProducts:', activeProducts);

        /* START LOOP: for each active product */
        for (let activeProduct of activeProducts) {
          //console.log('activeProduct', activeProduct);

          /* START: if the active product isn't the element of thisProduct */
          if (activeProduct != thisProduct.element) {

            /* remove class active for the active product */
            activeProduct.classList.remove('active');
            //console.log('thisProductInactive', activeProduct);

            /* END: if the active product isn't the element of thisProduct */
          }
          /* END LOOP: for each active product */
        }
        /* END: click event listener to trigger */
      });
    }
    initOrderForm() {
      const thisProduct = this;
      //console.log('initOrderForm', thisProduct);
      thisProduct.form.addEventListener('submit', function (event) {
        event.preventDefault();
        //console.log('submit', event);
        thisProduct.processOrder();
        //console.log('thisProduct.processOrder:', thisProduct.processOrder);
      });
      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function (event) {
          thisProduct.processOrder();
          //console.log('change', event);
        });
        thisProduct.cartButton.addEventListener('click', function(event){
          event.preventDefault();
          thisProduct.processOrder();
          //console.log('click', event);
        });
      }
    }
    processOrder() {
      const thisProduct = this;
      //console.log('processOrder', thisProduct);
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData:', formData);
    }
  }
  app.init();
}