class BaseWidget {
  constructor(wrapperElement, initialValue) {
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.value = initialValue;
  }

  setValue(value) {
    const thisWidget = this;

    const newValue = thisWidget.parseValue(value);

    /* TODO: Add validation */

    if (newValue != thisWidget.value && thisWidget.isValid(newValue)) {
      thisWidget.value = newValue;
      thisWidget.announce();
    }

    thisWidget.renderValue();
  }

  parseValue(value) {
    return parseInt(value);
  }

  isValid(value) {
    return !isNaN(value);
  }

  renderValue() {
    const thisWidget = this;

    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
  }

  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default BaseWidget;