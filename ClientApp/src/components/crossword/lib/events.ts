// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
let supportsOptions = false;

try {
  const options = Object.defineProperty({}, 'passive', {
    // eslint-disable-next-line getter-return
    get() {
      supportsOptions = true;
    }
  });

  window.addEventListener('test', options, options);
} catch (e) {
  supportsOptions = false;
}

const addMyEventListener = (
  node: any,
  name: string,
  handler: EventListener,
  { passive = false, capture = false, once = false } = {}
) => {
  if (supportsOptions) {
    node.addEventListener(name, handler, { passive, capture, once });
  } else if (once) {
    node.addEventListener(
      name,
      function boundHandler(evt: Event) {
        // @ts-ignore
        handler.call(this, evt);
        node.removeEventListener(name, boundHandler);
      },
      capture
    );
  } else {
    node.addEventListener(name, handler, capture);
  }
};

export { addMyEventListener };
