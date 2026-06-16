class LoggingDecorator {
  constructor(service) {
    this.service = service;
  }

  // Create and return a Proxy to intercept method calls
  decorate() {
    return new Proxy(this.service, {
      get(target, prop) {
        const orig = target[prop];
        // If the property is not a function, return it as-is
        if (typeof orig !== 'function') return orig;

        // Return a wrapped function that logs before and after execution
        return async function (...args) {
          console.log(`[LOG] calling ${String(prop)} with`, args);
          const start = Date.now();
          const result = await orig.apply(target, args);
          const ms = Date.now() - start;
          console.log(`[LOG] ${String(prop)} finished in ${ms}ms`);
          return result;
        };
      },
    });
  }
}

export default LoggingDecorator;