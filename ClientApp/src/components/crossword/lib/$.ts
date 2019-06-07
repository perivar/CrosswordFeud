import React from 'react';

/*
// @ts-ignore
import bonzo from "bonzo";
// @ts-ignore
import qwery from 'qwery';

// Warning: side effect. This patches the bonzo module for use everywhere
bonzo.aug({
  height() {
    return this.dim().height;
  },
});

// #? Use of `Node` throughout this file may need a second look?
const $ = (selector: any, context: any) => bonzo(qwery(selector, context));

$.create = (s: any) => bonzo(bonzo.create(s));

// #? duplicated in lib/closest.js?
$.ancestor = (el: any, className: string): any => {
  if (
    el === null
    || el === undefined
    || el.nodeName.toLowerCase() === 'html'
  ) {
    return null;
  }
  if (!el.parentNode || bonzo(el.parentNode).hasClass(className)) {
    return el.parentNode;
  }
  return $.ancestor(el.parentNode, className);
};

// #? does this offer any value?
$.forEachElement = (selector: any, fn: any) => {
  const els = qwery(selector);
  els.forEach(fn);
  return els;
};

// #es6 can be named exports once we're es6-only
// eslint-disable-next-line guardian-frontend/no-default-export
export default $;
*/