import axios from 'axios';
import _ from 'lodash';

export class nnFormErrors {
  constructor(){
    this.errors = {};
  }

  hasErrors() {
    return !_.isEmpty(this.errors);
  }

  has(field) {
    return Object.keys(this.errors).includes(field);
  }

  get(field) {
    if (this.has(field)) {
      return this.errors[field][0];
    }
  }

  set(errors) {
    if (_.isObject(errors)) {
      this.errors = errors;
    } else {
      this.errors = { 'form': ['Something went wrong. Please try again or contact customer support.'] };
    }
  }

  clear() {
    this.errors = {};
  }
}

export class nnForm {
  constructor(formFields) {
    this.busy = false;
    this.successful = false;
    this.errors = new nnFormErrors();

    Object.assign(this, formFields);
  }

  startProcessing() {
    this.errors.clear();
    this.busy = true;
    this.successful = false;
  }

  finishProcessing() {
    this.busy = false;
    this.successful = true;
  }

  resetStatus() {
    this.errors.clear();
    this.busy = false;
    this.successful = false;
  }

  setErrors (errors) {
    this.busy = false;
    this.errors.set(errors);
  }
}

export class nnFormSender {

  static post(uri, form) {
    return this.sendForm('post', uri, form);
  }

  static put(uri, form) {
    return this.sendForm('put', uri, form);
  }

  static delete(uri, form) {
    return this.sendForm('delete', uri, form);
  }

  static sendForm(method, uri, form) {
    return new Promise((resolve, reject) => {
      form.startProcessing();

      const omittableKeys = _.keys(new nnForm);
      const formFields = _.omit(form, omittableKeys);

      axios[method](uri, formFields)
        .then((response) => {
          form.finishProcessing();
          resolve(response.data);
        })
        .catch((error) => {
          form.errors.set(error.response.data);
          form.busy = false;
          reject(error.response.data);
      });
    });
  }
}
