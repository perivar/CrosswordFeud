/* eslint consistent-return: 0 */

class Storage {

  private storage: any;
  private available: boolean;

  constructor(type: any) {
    // this.storage = window[type];
    this.storage = localStorage;
    this.available = this.isAvailable();
  }

  isAvailable() {
    const key = 'local-storage-module-test';

    if (this.available !== undefined) {
      return this.available;
    }

    try {
      // to fully test, need to set item
      // http://stackoverflow.com/questions/9077101/iphone-localstorage-quota-exceeded-err-issue#answer-12976988
      this.storage.setItem(key, 'graun');
      this.storage.removeItem(key);
      this.available = true;
    } catch (err) {
      this.available = false;
    }

    return this.available;
  }

  getItem(key: string) {
    if (!this.available) {
      return;
    }

    let data;

    // try and parse the data
    try {
      const value = this.getRaw(key);

      if (value === null || value === undefined) {
        return null;
      }

      data = JSON.parse(value);

      if (data === null) {
        return null;
      }
    } catch (e) {
      this.removeItem(key);
      return null;
    }

    // has it expired?
    if (data.expires && new Date() > new Date(data.expires)) {
      this.removeItem(key);
      return null;
    }

    return data.value;
  }

  setItem(key: string, value: any, options: any = {}) {
    if (!this.available) {
      return;
    }

    return this.storage.setItem(
      key,
      JSON.stringify({
        value,
        expires: options.expires,
      }),
    );
  }

  setIfNotExists(key: string, value: any, options: any = {}) {
    if (!this.available) {
      return;
    }

    if (this.storage.getItem(key) !== null) {
      return;
    }

    return this.storage.setItem(
      key,
      JSON.stringify({
        value,
        expires: options.expires,
      }),
    );
  }

  getRaw(key: string) {
    if (this.available) {
      return this.storage.getItem(key);
    }
  }

  removeItem(key: string) {
    if (this.available) {
      return this.storage.removeItem(key);
    }
  }
}

export const local = new Storage('localStorage');
export const session = new Storage('sessionStorage');
