/*!
 * draggable-helper v5.0.6
 * (c) phphe <phphe@outlook.com> (https://github.com/phphe)
 * Homepage: undefined
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.draggableHelper = {}));
}(this, (function (exports) { 'use strict';

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var getPrototypeOf = createCommonjsModule(function (module) {
  function _getPrototypeOf(o) {
    module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  module.exports = _getPrototypeOf;
  });

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  var superPropBase = _superPropBase;

  var get = createCommonjsModule(function (module) {
  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      module.exports = _get = Reflect.get;
    } else {
      module.exports = _get = function _get(target, property, receiver) {
        var base = superPropBase(target, property);
        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  module.exports = _get;
  });

  var setPrototypeOf = createCommonjsModule(function (module) {
  function _setPrototypeOf(o, p) {
    module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  module.exports = _setPrototypeOf;
  });

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  });

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  var arrayLikeToArray = _arrayLikeToArray;

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
  }

  var unsupportedIterableToArray = _unsupportedIterableToArray;

  var runtime_1 = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var runtime = (function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.
    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []);

      // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.
      generator._invoke = makeInvokeMethod(innerFn, self, context);

      return generator;
    }
    exports.wrap = wrap;

    // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.
    function tryCatch(fn, obj, arg) {
      try {
        return { type: "normal", arg: fn.call(obj, arg) };
      } catch (err) {
        return { type: "throw", arg: err };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed";

    // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.
    var ContinueSentinel = {};

    // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}

    // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.
    var IteratorPrototype = {};
    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
    if (NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype =
      Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] =
      GeneratorFunction.displayName = "GeneratorFunction";

    // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.
    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function(method) {
        prototype[method] = function(arg) {
          return this._invoke(method, arg);
        };
      });
    }

    exports.isGeneratorFunction = function(genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor
        ? ctor === GeneratorFunction ||
          // For the native GeneratorFunction constructor, the best we can
          // do is to check its .name property.
          (ctor.displayName || ctor.name) === "GeneratorFunction"
        : false;
    };

    exports.mark = function(genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;
        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }
      genFun.prototype = Object.create(Gp);
      return genFun;
    };

    // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.
    exports.awrap = function(arg) {
      return { __await: arg };
    };

    function AsyncIterator(generator, PromiseImpl) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);
        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;
          if (value &&
              typeof value === "object" &&
              hasOwn.call(value, "__await")) {
            return PromiseImpl.resolve(value.__await).then(function(value) {
              invoke("next", value, resolve, reject);
            }, function(err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return PromiseImpl.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function(error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function(resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise =
          // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(
            callInvokeWithMethodAndArg,
            // Avoid propagating failures to Promises returned by later
            // invocations of the iterator.
            callInvokeWithMethodAndArg
          ) : callInvokeWithMethodAndArg();
      }

      // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).
      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);
    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };
    exports.AsyncIterator = AsyncIterator;

    // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.
    exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
      if (PromiseImpl === void 0) PromiseImpl = Promise;

      var iter = new AsyncIterator(
        wrap(innerFn, outerFn, self, tryLocsList),
        PromiseImpl
      );

      return exports.isGeneratorFunction(outerFn)
        ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function(result) {
            return result.done ? result.value : iter.next();
          });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;

      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          }

          // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;
          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);
            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;

          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);

          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;

          var record = tryCatch(innerFn, self, context);
          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done
              ? GenStateCompleted
              : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };

          } else if (record.type === "throw") {
            state = GenStateCompleted;
            // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.
            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    }

    // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.
    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];
      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError(
            "The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (! info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value;

        // Resume execution at the desired location (see delegateYield).
        context.next = delegate.nextLoc;

        // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.
        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }

      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      }

      // The delegate iterator is finished, so forget it and continue with
      // the outer generator.
      context.delegate = null;
      return ContinueSentinel;
    }

    // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.
    defineIteratorMethods(Gp);

    Gp[toStringTagSymbol] = "Generator";

    // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.
    Gp[iteratorSymbol] = function() {
      return this;
    };

    Gp.toString = function() {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = { tryLoc: locs[0] };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{ tryLoc: "root" }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function(object) {
      var keys = [];
      for (var key in object) {
        keys.push(key);
      }
      keys.reverse();

      // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.
      return function next() {
        while (keys.length) {
          var key = keys.pop();
          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        }

        // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.
        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];
        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1, next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;

            return next;
          };

          return next.next = next;
        }
      }

      // Return an iterator with no values.
      return { next: doneResult };
    }
    exports.values = values;

    function doneResult() {
      return { value: undefined$1, done: true };
    }

    Context.prototype = {
      constructor: Context,

      reset: function(skipTempReset) {
        this.prev = 0;
        this.next = 0;
        // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.
        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;

        this.method = "next";
        this.arg = undefined$1;

        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },

      stop: function() {
        this.done = true;

        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;
        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },

      dispatchException: function(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;
        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !! caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }

            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }

            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },

      abrupt: function(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry &&
            (type === "break" ||
             type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },

      complete: function(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" ||
            record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },

      finish: function(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },

      "catch": function(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;
            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }
            return thrown;
          }
        }

        // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.
        throw new Error("illegal catch attempt");
      },

      delegateYield: function(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    };

    // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.
    return exports;

  }(
    // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
     module.exports 
  ));

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
  });

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return arrayLikeToArray(arr);
  }

  var arrayWithoutHoles = _arrayWithoutHoles;

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  var iterableToArray = _iterableToArray;

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var nonIterableSpread = _nonIterableSpread;

  function _toConsumableArray(arr) {
    return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
  }

  var toConsumableArray = _toConsumableArray;

  /*!
   * helper-js v2.0.0
   * (c) phphe <phphe@outlook.com> (https://github.com/phphe)
   * Homepage: undefined
   * Released under the MIT License.
   */

  function isArray(v) {
    return Object.prototype.toString.call(v) === '[object Array]';
  }

  function toArrayIfNot(arrOrNot) {
    return isArray(arrOrNot) ? arrOrNot : [arrOrNot];
  }

  function objectAssignIfKeyNull(obj1, obj2) {
    Object.keys(obj2).forEach(function (key) {
      if (obj1[key] == null) {
        obj1[key] = obj2[key];
      }
    });
  }

  function isDescendantOf(el, parent) {
    while (true) {
      if (el.parentElement == null) {
        return false;
      } else if (el.parentElement === parent) {
        return true;
      } else {
        el = el.parentElement;
      }
    }
  }

  function getBoundingClientRect(el) {
    // refer: http://www.51xuediannao.com/javascript/getBoundingClientRect.html
    var xy = el.getBoundingClientRect();
    var top = xy.top - document.documentElement.clientTop,
        //document.documentElement.clientTop 在IE67中始终为2，其他高级点的浏览器为0
    bottom = xy.bottom,
        left = xy.left - document.documentElement.clientLeft,
        //document.documentElement.clientLeft 在IE67中始终为2，其他高级点的浏览器为0
    right = xy.right,
        width = xy.width || right - left,
        //IE67不存在width 使用right - left获得
    height = xy.height || bottom - top;
    var x = left;
    var y = top;
    return {
      top: top,
      right: right,
      bottom: bottom,
      left: left,
      width: width,
      height: height,
      x: x,
      y: y
    };
  } // refer [getBoundingClientRect](#getBoundingClientRect)


  var getViewportPosition = getBoundingClientRect; // TODO not tested

  function findParent(el, callback) {
    var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var cur = opt && opt.withSelf ? el : el.parentElement;

    while (cur) {
      var r = callback(cur);

      if (r === 'break') {
        return;
      } else if (r) {
        return cur;
      } else {
        cur = cur.parentElement;
      }
    }
  }

  function backupAttr(el, name) {
    var key = "original_".concat(name);
    el[key] = el.getAttribute(name);
  }

  function restoreAttr(el, name) {
    var key = "original_".concat(name);
    var value = el[key];

    if (value == null) {
      el.removeAttribute(name);
    } else {
      el.setAttribute(name, value);
    }
  } // source: http://youmightnotneedjquery.com/


  function hasClass(el, className) {
    if (el.classList) {
      return el.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
  } // source: http://youmightnotneedjquery.com/


  function addClass(el, className) {
    if (!hasClass(el, className)) {
      if (el.classList) {
        el.classList.add(className);
      } else {
        el.className += ' ' + className;
      }
    }
  } // source: http://youmightnotneedjquery.com/

  function onDOM(el, name, handler) {
    for (var _len5 = arguments.length, args = new Array(_len5 > 3 ? _len5 - 3 : 0), _key6 = 3; _key6 < _len5; _key6++) {
      args[_key6 - 3] = arguments[_key6];
    }

    if (el.addEventListener) {
      // 所有主流浏览器，除了 IE 8 及更早 IE版本
      el.addEventListener.apply(el, [name, handler].concat(args)); // @ts-ignore
    } else if (el.attachEvent) {
      // IE 8 及更早 IE 版本
      // @ts-ignore
      el.attachEvent.apply(el, ["on".concat(name), handler].concat(args));
    }
  }

  function offDOM(el, name, handler) {
    for (var _len6 = arguments.length, args = new Array(_len6 > 3 ? _len6 - 3 : 0), _key7 = 3; _key7 < _len6; _key7++) {
      args[_key7 - 3] = arguments[_key7];
    }

    if (el.removeEventListener) {
      // 所有主流浏览器，除了 IE 8 及更早 IE版本
      el.removeEventListener.apply(el, [name, handler].concat(args)); // @ts-ignore
    } else if (el.detachEvent) {
      // IE 8 及更早 IE 版本
      // @ts-ignore
      el.detachEvent.apply(el, ["on".concat(name), handler].concat(args));
    }
  }

  function elementsFromPoint(x, y) {
    var args = [x, y]; // @ts-ignore

    var func = document.elementsFromPoint || document.msElementsFromPoint || elementsFromPoint;
    return func.apply(document, args);

    function elementsFromPoint(x, y) {
      var parents = [];
      var parent = void 0;

      do {
        if (parent !== document.elementFromPoint(x, y)) {
          parent = document.elementFromPoint(x, y);
          parents.push(parent);
          parent.style.pointerEvents = 'none';
        } else {
          parent = false;
        }
      } while (parent);

      parents.forEach(function (parent) {
        return parent.style.pointerEvents = 'all';
      });
      return parents;
    }
  }
  /* scroll to a positon with duration
  from https://gist.github.com/andjosh/6764939
  interface options{
    x: number // nullable. don't scroll horizontally when null
    y: number // nullable. don't scroll vertically when null
    duration: number // default 0
    element: Element // default is the top scrollable element.
    beforeEveryFrame: (count: number) => boolean|void // call before requestAnimationFrame execution. return false to stop
  }
  return stop
  */


  function scrollTo(options) {
    if (!options.element) {
      options.element = document.scrollingElement || document.documentElement;
    }

    if (options.duration == null) {
      options.duration = 0;
    }

    var x = options.x,
        y = options.y,
        duration = options.duration,
        element = options.element;
    var requestAnimationFrameId;
    var count = 0;

    var startY = element.scrollTop,
        changeY = y - startY,
        startX = element.scrollLeft,
        changeX = x - startX,
        startDate = +new Date(),
        animateScroll = function animateScroll() {
      if (options.beforeEveryFrame && options.beforeEveryFrame(count) === false) {
        return;
      }

      var currentDate = new Date().getTime();
      var changedTime = currentDate - startDate;

      if (y != null) {
        element.scrollTop = parseInt(calc(startY, changeY, changedTime, duration));
      }

      if (x != null) {
        element.scrollLeft = parseInt(calc(startX, changeX, changedTime, duration));
      }

      if (changedTime < duration) {
        requestAnimationFrameId = requestAnimationFrame(animateScroll);
      } else {
        if (y != null) {
          element.scrollTop = y;
        }

        if (x != null) {
          element.scrollLeft = x;
        }
      }

      count++;
    };

    var stop = function stop() {
      cancelAnimationFrame(requestAnimationFrameId);
    };

    animateScroll(); // return stop

    return stop;

    function calc(startValue, changeInValue, changedTime, duration) {
      return startValue + changeInValue * (changedTime / duration);
    }
  } // ### DOM structure

  /*!
   * drag-event-service v1.1.7
   * (c) phphe <phphe@outlook.com> (https://github.com/phphe)
   * Homepage: undefined
   * Released under the MIT License.
   */
  var events = {
    start: ['mousedown', 'touchstart'],
    move: ['mousemove', 'touchmove'],
    end: ['mouseup', 'touchend']
  };
  var DragEventService = {
    isTouch: function isTouch(e) {
      return e.type && e.type.startsWith('touch');
    },
    _getStore: function _getStore(el) {
      if (!el._wrapperStore) {
        el._wrapperStore = [];
      }

      return el._wrapperStore;
    },
    on: function on(el, name, handler, options) {
      var _hp$onDOM, _hp$onDOM2;

      var _resolveOptions = resolveOptions(options),
          args = _resolveOptions.args,
          mouseArgs = _resolveOptions.mouseArgs,
          touchArgs = _resolveOptions.touchArgs;

      var store = this._getStore(el);

      var ts = this;

      var wrapper = function wrapper(e) {
        var mouse;
        var isTouch = ts.isTouch(e);

        if (isTouch) {
          // touch
          mouse = {
            x: e.changedTouches[0].pageX,
            y: e.changedTouches[0].pageY,
            pageX: e.changedTouches[0].pageX,
            pageY: e.changedTouches[0].pageY,
            clientX: e.changedTouches[0].clientX,
            clientY: e.changedTouches[0].clientY,
            screenX: e.changedTouches[0].screenX,
            screenY: e.changedTouches[0].screenY
          };
        } else {
          // mouse
          mouse = {
            x: e.pageX,
            y: e.pageY,
            pageX: e.pageX,
            pageY: e.pageY,
            clientX: e.clientX,
            clientY: e.clientY,
            screenX: e.screenX,
            screenY: e.screenY
          };

          if (name === 'start' && e.which !== 1) {
            // not left button mousedown
            return;
          }
        }

        return handler.call(this, e, mouse);
      };

      store.push({
        handler: handler,
        wrapper: wrapper
      }); // follow format will cause big bundle size
      // 以下写法将会使打包工具认为hp是上下文, 导致打包整个hp
      // hp.onDOM(el, events[name][0], wrapper, ...args)

      (_hp$onDOM = onDOM).call.apply(_hp$onDOM, [null, el, events[name][0], wrapper].concat([].concat(toConsumableArray(args), toConsumableArray(mouseArgs))));

      (_hp$onDOM2 = onDOM).call.apply(_hp$onDOM2, [null, el, events[name][1], wrapper].concat([].concat(toConsumableArray(args), toConsumableArray(touchArgs))));
    },
    off: function off(el, name, handler, options) {
      var _resolveOptions2 = resolveOptions(options),
          args = _resolveOptions2.args,
          mouseArgs = _resolveOptions2.mouseArgs;

      var store = this._getStore(el);

      for (var i = store.length - 1; i >= 0; i--) {
        var _store$i = store[i],
            handler2 = _store$i.handler,
            wrapper = _store$i.wrapper;

        if (handler === handler2) {
          var _hp$offDOM, _hp$offDOM2;

          (_hp$offDOM = offDOM).call.apply(_hp$offDOM, [null, el, events[name][0], wrapper].concat([].concat(toConsumableArray(args), toConsumableArray(mouseArgs))));

          (_hp$offDOM2 = offDOM).call.apply(_hp$offDOM2, [null, el, events[name][1], wrapper].concat([].concat(toConsumableArray(args), toConsumableArray(mouseArgs))));

          store.splice(i, 1);
        }
      }
    }
  };

  function resolveOptions(options) {
    if (!options) {
      options = {};
    }

    var args = options.args || [];
    var mouseArgs = options.mouseArgs || [];
    var touchArgs = options.touchArgs || [];
    return {
      args: args,
      mouseArgs: mouseArgs,
      touchArgs: touchArgs
    };
  }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray$1(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray$1(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray$1(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen); }

  function _arrayLikeToArray$1(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
  /* Default export, a function.
  ```js
  import draggableHelper from 'draggable-helper'
  draggableHelper(listenerElement, options)
  ```
  Arguments:
    listenerElement: HTMLElement. The element to bind mouse and touch event listener.
    options: Options. Optional.
   */

  /* 默认导出, 一个方法.
  ```js
  import draggableHelper from 'draggable-helper'
  draggableHelper(listenerElement, options)
  ```
  参数:
    listenerElement: HTMLElement. 绑定鼠标和触摸事件监听器的HTML元素.
    options: Options. 可选.
   */

  var _edgeScroll = {
    afterFirstMove: function afterFirstMove(store, opt) {},
    afterMove: function afterMove(store, opt) {},
    afterDrop: function afterDrop(store, opt) {}
  };
  function index (listenerElement) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var store; // set default value of options
    // 设置options的默认值

    objectAssignIfKeyNull(opt, defaultOptions); // define the event listener of mousedown and touchstart
    // 定义mousedown和touchstart事件监听器

    var onMousedownOrTouchStart = function onMousedownOrTouchStart(e, mouse) {
      // execute native event hooks
      if (!DragEventService.isTouch(e)) {
        opt.onmousedown && opt.onmousedown(e);
      } else {
        opt.ontouchstart && opt.ontouchstart(e);
      }

      var target = e.target; // check if triggered by ignore tags
      // 检查是否由忽略的标签名触发

      if (opt.ingoreTags.includes(target.tagName)) {
        return;
      } // check if trigger element and its parent has undraggable class name
      // 检查触发事件的元素和其与element之间的父级是否有不允许拖动的类名


      if (hasClass(target, opt.undraggableClassName)) {
        return;
      }

      var isParentUndraggable = findParent(target, function (el) {
        if (hasClass(el, opt.undraggableClassName)) {
          return true;
        }

        if (el === listenerElement) {
          return 'break';
        }
      });

      if (isParentUndraggable) {
        return;
      } // Initialize store. Store start event, initial position
      // 初始化store. 存储开始事件, 事件触发坐标


      store = JSON.parse(JSON.stringify(initialStore));
      store.startEvent = e;
      store.listenerElement = listenerElement;
      store.directTriggerElement = target;
      store.initialMouse = Object.assign({}, mouse); // get triggerElement

      var triggerElementIsMovedOrClonedElement = false;

      if (opt.getTriggerElement) {
        var el = opt.getTriggerElement(store.directTriggerElement, store);

        if (!el) {
          return;
        }

        store.triggerElement = el;
      } else if (opt.triggerClassName) {
        var triggerElement;

        var _iterator = _createForOfIteratorHelper(toArrayIfNot(opt.triggerClassName)),
            _step;

        try {
          var _loop = function _loop() {
            var className = _step.value;
            triggerElement = findParent(store.directTriggerElement, function (el) {
              if (hasClass(el, className)) {
                return true;
              }

              if (el === listenerElement) {
                return 'break';
              }
            }, {
              withSelf: true
            });

            if (triggerElement) {
              return "break";
            }
          };

          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _ret = _loop();

            if (_ret === "break") break;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        if (!triggerElement) {
          return;
        }

        store.triggerElement = triggerElement;
      } else {
        triggerElementIsMovedOrClonedElement = true;
      } // get movedOrClonedElement


      store.movedOrClonedElement = opt.getMovedOrClonedElement ? opt.getMovedOrClonedElement(store.directTriggerElement, store, opt) : listenerElement;

      if (!store.movedOrClonedElement) {
        return;
      }

      if (triggerElementIsMovedOrClonedElement) {
        store.triggerElement = store.movedOrClonedElement;
      } // check if trigger element is same with directTriggerElement when options.triggerBySelf is true
      // options.triggerBySelf为true时, 检查触发事件的元素是否是允许触发的元素


      if (opt.triggerBySelf && store.triggerElement !== store.directTriggerElement) {
        return;
      } // prevent text be selected
      // 阻止文字被选中


      if (!DragEventService.isTouch(e)) {
        // Do not prevent when touch. Or the elements within the node can not trigger click event.
        // 不要在触摸时阻止事件. 否则将导致节点内的元素不触发点击事件.
        if (opt.preventTextSelection) {
          e.preventDefault();
        }
      } // listen mousemove and touchmove
      // 监听mousemove和touchmove


      DragEventService.on(document, 'move', onMousemoveOrTouchMove, {
        touchArgs: [{
          passive: false
        }]
      }); // listen mouseup and touchend
      // 监听mouseup和touchend

      DragEventService.on(window, 'end', onMouseupOrTouchEnd);
    }; // bind mousedown or touchstart event listener
    // 绑定mousedown和touchstart事件监听器


    DragEventService.on(listenerElement, 'start', onMousedownOrTouchStart, {
      touchArgs: [{
        passive: true
      }]
    }); // define the event listener of mousemove and touchmove
    // 定义mousemove和touchmove事件监听器

    var onMousemoveOrTouchMove = function onMousemoveOrTouchMove(e, mouse) {
      // execute native event hooks
      if (!DragEventService.isTouch(e)) {
        opt.onmousemove && opt.onmousemove(e);
      } else {
        opt.ontouchmove && opt.ontouchmove(e);
      } // 


      var _store = store,
          movedOrClonedElement = _store.movedOrClonedElement; // calc move and attach related info to store
      // 计算move并附加相关信息到store

      var move = store.move = {
        x: mouse.clientX - store.initialMouse.clientX,
        y: mouse.clientY - store.initialMouse.clientY
      };
      store.moveEvent = e;
      store.mouse = mouse;

      if (DragEventService.isTouch(e)) {
        // prevent page scroll when touch.
        // 当触摸时阻止屏幕被拖动.
        e.preventDefault();
      } else {
        // prevent text be selected
        // 阻止文字被选中
        if (opt.preventTextSelection) {
          e.preventDefault();
        }
      } // first move
      // 第一次移动


      if (store.movedCount === 0) {
        // check if min displacement exceeded.
        // 检查是否达到最小位移
        if (opt.minDisplacement) {
          var x2 = Math.pow(move.x, 2);
          var y2 = Math.pow(move.y, 2);
          var dtc = Math.pow(x2 + y2, 0.5);

          if (dtc < opt.minDisplacement) {
            return;
          }
        } // resolve elements


        var movedElement = opt.clone ? movedOrClonedElement.cloneNode(true) : movedOrClonedElement;
        var initialPosition = getViewportPosition(movedOrClonedElement); // attach elements and initialPosition to store
        // 附加元素和初始位置到store

        store.movedOrClonedElement = movedOrClonedElement;
        store.movedElement = movedElement;
        store.initialPositionRelativeToViewport = initialPosition;
        store.initialPosition = initialPosition; // define the function to update moved element style
        // 定义更新移动元素样式的方法

        var updateMovedElementStyle = function updateMovedElementStyle() {
          if (opt.clone) {
            store.movedOrClonedElement.parentElement.appendChild(movedElement);
          }

          var size = getBoundingClientRect(movedElement);
          var style = {
            width: "".concat(Math.ceil(size.width), "px"),
            height: "".concat(Math.ceil(size.height), "px"),
            zIndex: 9999,
            opacity: 0.8,
            position: 'fixed',
            left: initialPosition.x + 'px',
            top: initialPosition.y + 'px',
            pointerEvents: 'none'
          };
          backupAttr(movedElement, 'style');

          for (var key in style) {
            movedElement.style[key] = style[key];
          }

          backupAttr(movedElement, 'class');
          addClass(movedElement, opt.draggingClassName);
          /*
          check if the changed position is expected and correct it. about stacking context.
          当某父元素使用了transform属性时, fixed不再以窗口左上角为坐标. 以下功能是在第一次移动后, 检查元素实际位置和期望位置是否相同, 不同则说明坐标系不是期望的. 则把初始位置减去偏移, 无论任何父元素导致了层叠上下文问题, 都能正确显示.
          */

          var nowPosition = getViewportPosition(movedElement);

          if (nowPosition.x !== initialPosition.x) {
            initialPosition.x = initialPosition.x - (nowPosition.x - initialPosition.x);
            initialPosition.y = initialPosition.y - (nowPosition.y - initialPosition.y);
            movedElement.style.left = initialPosition.x + 'px';
            movedElement.style.top = initialPosition.y + 'px';
          }
        };

        store.updateMovedElementStyle = updateMovedElementStyle; // call hook beforeFirstMove, beforeMove

        if (opt.beforeFirstMove && opt.beforeFirstMove(store, opt) === false) {
          return;
        }

        if (opt.beforeMove && opt.beforeMove(store, opt) === false) {
          return;
        } // try to update moved element style
        // 尝试更新移动元素样式


        if (!opt.updateMovedElementStyleManually) {
          store.updateMovedElementStyle();
        }

        _edgeScroll.afterFirstMove(store, opt);

        opt.afterFirstMove && opt.afterFirstMove(store, opt);
      } // Not the first move
      // 非第一次移动
      else {
          // define the function to update moved element style
          // 定义更新移动元素样式的方法
          var _updateMovedElementStyle = function _updateMovedElementStyle() {
            Object.assign(store.movedElement.style, {
              left: store.initialPosition.x + move.x + 'px',
              top: store.initialPosition.y + move.y + 'px'
            });
          };

          store.updateMovedElementStyle = _updateMovedElementStyle; // call hook beforeMove

          if (opt.beforeMove && opt.beforeMove(store, opt) === false) {
            return;
          } // try to update moved element style
          // 尝试更新移动元素样式


          if (!opt.updateMovedElementStyleManually) {
            store.updateMovedElementStyle();
          }
        }

      _edgeScroll.afterMove(store, opt);

      store.movedCount++;
      opt.afterMove && opt.afterMove(store, opt);
    }; // define the event listener of mouseup and touchend
    // 定义mouseup和touchend事件监听器


    var onMouseupOrTouchEnd = function onMouseupOrTouchEnd(e) {
      // execute native event hooks
      if (!DragEventService.isTouch(e)) {
        opt.onmousedown && opt.onmousedown(e);
      } else {
        opt.ontouchend && opt.ontouchend(e);
      } // cancel listening mousemove, touchmove, mouseup, touchend
      // 取消监听事件mousemove, touchmove, mouseup, touchend


      DragEventService.off(document, 'move', onMousemoveOrTouchMove, {
        touchArgs: [{
          passive: false
        }]
      });
      DragEventService.off(window, 'end', onMouseupOrTouchEnd); // 

      if (store.movedCount === 0) {
        return;
      }

      store.endEvent = e;
      var _store2 = store,
          movedElement = _store2.movedElement; // define the function to update moved element style
      // 定义更新移动元素样式的方法

      var updateMovedElementStyle = function updateMovedElementStyle() {
        restoreAttr(movedElement, 'style');
        restoreAttr(movedElement, 'class');

        if (opt.clone) {
          movedElement.parentElement.removeChild(movedElement);
        }
      };

      store.updateMovedElementStyle = updateMovedElementStyle; // call hook beforeDrop

      if (opt.beforeDrop && opt.beforeDrop(store, opt) === false) {
        return;
      } // try to update moved element style
      // 尝试更新移动元素样式


      if (!opt.updateMovedElementStyleManually) {
        updateMovedElementStyle();
      }

      _edgeScroll.afterDrop(store, opt);

      opt.afterDrop && opt.afterDrop(store, opt);
    }; // define the destroy function
    // 定义销毁/退出的方法


    var destroy = function destroy() {
      DragEventService.off(listenerElement, 'start', onMousedownOrTouchStart, {
        touchArgs: [{
          passive: true
        }]
      });
      DragEventService.off(document, 'move', onMousemoveOrTouchMove, {
        touchArgs: [{
          passive: false
        }]
      });
      DragEventService.off(window, 'end', onMouseupOrTouchEnd);
    }; // 


    return {
      destroy: destroy,
      options: opt
    };
  } // available options and default options value
  // 可用选项和默认选项值

  var defaultOptions = {
    ingoreTags: ['INPUT', 'TEXTAREA', 'SELECT', 'OPTGROUP', 'OPTION'],
    undraggableClassName: 'undraggable',
    minDisplacement: 10,
    draggingClassName: 'dragging',
    clone: false,
    updateMovedElementStyleManually: false,
    preventTextSelection: true,
    edgeScrollTriggerMargin: 50,
    edgeScrollSpeed: 0.35,
    edgeScrollTriggerMode: 'top_left_corner'
  }; // Info after event triggered. Created when mousedown or touchstart, destroied after mouseup or touchend.
  // 事件触发后的相关信息. mousedown或touchstart时创建, mouseup或touchend后销毁.

  var initialStore = {
    movedCount: 0
  }; // edge scroll
  // 边缘滚动

  var stopHorizontalScroll, stopVerticalScroll;

  _edgeScroll.afterMove = function (store, opt) {
    if (!opt.edgeScroll) {
      return;
    }

    var margin = opt.edgeScrollTriggerMargin;
    stopOldScrollAnimation(); // get triggerPoint. The point trigger edge scroll.

    var triggerPoint = {
      x: store.mouse.clientX,
      y: store.mouse.clientY
    };

    if (opt.edgeScrollTriggerMode === 'top_left_corner') {
      var vp = getViewportPosition(store.movedElement);
      triggerPoint = {
        x: vp.x,
        y: vp.y
      };
    } // 


    var foundHorizontal, foundVertical, prevElement, horizontalDir, verticalDir;
    var findInElements;
    var cachedElementsFromPoint; // find x container

    var minScrollableDisplacement = 10;

    if (opt.edgeScrollSpecifiedContainerX) {
      var containerX;

      if (typeof opt.edgeScrollSpecifiedContainerX === 'function') {
        containerX = opt.edgeScrollSpecifiedContainerX(store, opt);
      } else {
        containerX = opt.edgeScrollSpecifiedContainerX;
      }

      if (containerX) {
        findInElements = [containerX];
      }
    }

    if (!findInElements) {
      findInElements = elementsFromPoint(triggerPoint.x, triggerPoint.y);
      cachedElementsFromPoint = findInElements;
    }

    var _iterator2 = _createForOfIteratorHelper(findInElements),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var itemEl = _step2.value;

        if (prevElement && !isDescendantOf(prevElement, itemEl)) {
          // itemEl is being covered by other elements
          // itemEl被其他元素遮挡
          continue;
        }

        var t = minScrollableDisplacement; // min scrollable displacement. 最小可滚动距离, 小于此距离不触发滚动.

        if (!foundHorizontal) {
          if (itemEl.scrollWidth > itemEl.clientWidth) {
            var _vp = fixedGetViewportPosition(itemEl);

            if (triggerPoint.x <= _vp.left + margin) {
              if (scrollableDisplacement(itemEl, 'left') > t && isScrollable(itemEl, 'x')) {
                foundHorizontal = itemEl;
                horizontalDir = 'left';
              }
            } else if (triggerPoint.x >= _vp.left + itemEl.clientWidth - margin) {
              if (scrollableDisplacement(itemEl, 'right') > t && isScrollable(itemEl, 'x')) {
                foundHorizontal = itemEl;
                horizontalDir = 'right';
              }
            }
          }
        }

        if (foundHorizontal) {
          break;
        }

        prevElement = itemEl;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    prevElement = null; // find y container

    findInElements = null;

    if (opt.edgeScrollSpecifiedContainerY) {
      var containerY;

      if (typeof opt.edgeScrollSpecifiedContainerY === 'function') {
        containerY = opt.edgeScrollSpecifiedContainerY(store, opt);
      } else {
        containerY = opt.edgeScrollSpecifiedContainerY;
      }

      if (containerY) {
        findInElements = [containerY];
      }
    }

    if (!findInElements) {
      findInElements = cachedElementsFromPoint || elementsFromPoint(triggerPoint.x, triggerPoint.y);
    }

    var _iterator3 = _createForOfIteratorHelper(findInElements),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var _itemEl = _step3.value;

        if (prevElement && !isDescendantOf(prevElement, _itemEl)) {
          // itemEl is being covered by other elements
          // itemEl被其他元素遮挡
          continue;
        }

        var _t = minScrollableDisplacement; // min scrollable displacement. 最小可滚动距离, 小于此距离不触发滚动.

        if (!foundVertical) {
          if (_itemEl.scrollHeight > _itemEl.clientHeight) {
            var _vp2 = fixedGetViewportPosition(_itemEl);

            if (triggerPoint.y <= _vp2.top + margin) {
              if (scrollableDisplacement(_itemEl, 'up') > _t && isScrollable(_itemEl, 'y')) {
                foundVertical = _itemEl;
                verticalDir = 'up';
              }
            } else if (triggerPoint.y >= _vp2.top + _itemEl.clientHeight - margin) {
              if (scrollableDisplacement(_itemEl, 'down') > _t && isScrollable(_itemEl, 'y')) {
                foundVertical = _itemEl;
                verticalDir = 'down';
              }
            }
          }
        }

        if (foundVertical) {
          break;
        }

        prevElement = _itemEl;
      } // scroll

    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    if (foundHorizontal) {
      if (horizontalDir === 'left') {
        stopHorizontalScroll = scrollTo({
          x: 0,
          element: foundHorizontal,
          duration: scrollableDisplacement(foundHorizontal, 'left') / opt.edgeScrollSpeed
        });
      } else {
        stopHorizontalScroll = scrollTo({
          x: foundHorizontal.scrollWidth - foundHorizontal.clientWidth,
          element: foundHorizontal,
          duration: scrollableDisplacement(foundHorizontal, 'right') / opt.edgeScrollSpeed
        });
      }
    }

    if (foundVertical) {
      if (verticalDir === 'up') {
        stopVerticalScroll = scrollTo({
          y: 0,
          element: foundVertical,
          duration: scrollableDisplacement(foundVertical, 'up') / opt.edgeScrollSpeed
        });
      } else {
        stopVerticalScroll = scrollTo({
          y: foundVertical.scrollHeight - foundVertical.clientHeight,
          element: foundVertical,
          duration: scrollableDisplacement(foundVertical, 'down') / opt.edgeScrollSpeed
        });
      }
    } // is element scrollable in a direction
    // 元素某方向是否可滚动


    function isScrollable(el, dir) {
      var style = getComputedStyle(el);
      var key = "overflow-".concat(dir); // document.documentElement is special

      var special = document.scrollingElement || document.documentElement;

      if (el === special) {
        return style[key] === 'visible' || style[key] === 'auto' || style[key] === 'scroll';
      }

      return style[key] === 'auto' || style[key] === 'scroll';
    } // scrollable displacement of element  in a direction
    // 元素某方向可滚动距离


    function scrollableDisplacement(el, dir) {
      if (dir === 'up') {
        return el.scrollTop;
      } else if (dir === 'down') {
        return el.scrollHeight - el.scrollTop - el.clientHeight;
      } else if (dir === 'left') {
        return el.scrollLeft;
      } else if (dir === 'right') {
        return el.scrollWidth - el.scrollLeft - el.clientWidth;
      }
    }

    function fixedGetViewportPosition(el) {
      var r = getViewportPosition(el); // document.documentElement is special

      var special = document.scrollingElement || document.documentElement;

      if (el === special) {
        r.top = 0;
        r.left = 0;
      }

      return r;
    }
  };

  _edgeScroll.afterDrop = function (store, opt) {
    if (!opt.edgeScroll) {
      return;
    }

    stopOldScrollAnimation();
  }; // stop old scroll animation
  // 结束之前的滚动动画


  function stopOldScrollAnimation() {
    if (stopHorizontalScroll) {
      stopHorizontalScroll();
      stopHorizontalScroll = null;
    }

    if (stopVerticalScroll) {
      stopVerticalScroll();
      stopVerticalScroll = null;
    }
  }

  exports.default = index;
  exports.defaultOptions = defaultOptions;
  exports.initialStore = initialStore;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
