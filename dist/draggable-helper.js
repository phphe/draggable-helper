/*!
 * draggable-helper v1.0.21
 * (c) 2018-present phphe <phphe@outlook.com> (https://github.com/phphe)
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.draggableHelper = factory());
}(this, (function () { 'use strict';

  /*!
   * helper-js v1.3.9
   * (c) 2018-present phphe <phphe@outlook.com> (https://github.com/phphe)
   * Released under the MIT License.
   */

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

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

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  // local store
  var store = {}; // get global

  function glb() {
    if (store.glb) {
      return store.glb;
    } else {
      // resolve global
      var t;

      try {
        t = global;
      } catch (e) {
        t = window;
      }

      store.glb = t;
      return t;
    }
  } // is 各种判断

  function getOffsetParent(el) {
    var offsetParent = el.offsetParent;

    if (!offsetParent || offsetParent === document.body && getComputedStyle(document.body).position === 'static') {
      offsetParent = document.body.parentElement;
    }

    return offsetParent;
  } // get el current position. like jQuery.position
  // the position is relative to offsetParent viewport left top. it is for set absolute position, absolute position is relative to offsetParent viewport left top.
  // 相对于offsetParent可视区域左上角(el.offsetLeft或top包含父元素的滚动距离, 所以要减去). position一般用于设置绝对定位的情况, 而绝对定位就是以可视区域左上角为原点.

  function getPosition(el) {
    var offsetParent = getOffsetParent(el);
    var ps = {
      x: el.offsetLeft,
      y: el.offsetTop
    };
    var parent = el;

    while (true) {
      parent = parent.parentElement;

      if (parent === offsetParent || !parent) {
        break;
      }

      ps.x -= parent.scrollLeft;
      ps.y -= parent.scrollTop;
    }

    return ps;
  } // get position of a el if its offset is given. like jQuery.offset.
  function backupAttr(el, name) {
    var key = "original_".concat(name);
    el[key] = el.getAttribute(name);
  }
  function restoreAttr(el, name) {
    var key = "original_".concat(name);
    el.setAttribute(name, el[key]);
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
  function getElSize(el) {
    var originDisplay = el.style.display;
    el.style.display = 'block';
    var size = {
      width: el.offsetWidth,
      height: el.offsetHeight
    };
    el.style.display = originDisplay;
    return size;
  }

  function onDOM(el, name, handler) {
    for (var _len5 = arguments.length, args = new Array(_len5 > 3 ? _len5 - 3 : 0), _key6 = 3; _key6 < _len5; _key6++) {
      args[_key6 - 3] = arguments[_key6];
    }

    if (el.addEventListener) {
      // 所有主流浏览器，除了 IE 8 及更早 IE版本
      el.addEventListener.apply(el, [name, handler].concat(args));
    } else if (el.attachEvent) {
      // IE 8 及更早 IE 版本
      el.attachEvent.apply(el, ["on".concat(name), handler].concat(args));
    }
  }
  var URLHelper =
  /*#__PURE__*/
  function () {
    // protocol, hostname, port, pastname
    function URLHelper(baseUrl) {
      var _this3 = this;

      _classCallCheck(this, URLHelper);

      _defineProperty(this, "baseUrl", '');

      _defineProperty(this, "search", {});

      var t = decodeURI(baseUrl).split('?');
      this.baseUrl = t[0];

      if (t[1]) {
        t[1].split('&').forEach(function (v) {
          var t2 = v.split('=');
          _this3.search[t2[0]] = t2[1] == null ? '' : decodeURIComponent(t2[1]);
        });
      }
    }

    _createClass(URLHelper, [{
      key: "getHref",
      value: function getHref() {
        var _this4 = this;

        var t = [this.baseUrl];
        var searchStr = Object.keys(this.search).map(function (k) {
          return "".concat(k, "=").concat(encodeURIComponent(_this4.search[k]));
        }).join('&');

        if (searchStr) {
          t.push(searchStr);
        }

        return t.join('?');
      }
    }]);

    return URLHelper;
  }(); // 解析函数参数, 帮助重载

  var EventProcessor =
  /*#__PURE__*/
  function () {
    function EventProcessor() {
      _classCallCheck(this, EventProcessor);

      _defineProperty(this, "eventStore", []);
    }

    _createClass(EventProcessor, [{
      key: "on",
      value: function on(name, handler) {
        this.eventStore.push({
          name: name,
          handler: handler
        });
      }
    }, {
      key: "once",
      value: function once(name, handler) {
        var _this5 = this;

        var off = function off() {
          _this5.off(name, wrappedHandler);
        };

        var wrappedHandler = function wrappedHandler() {
          handler();
          off();
        };

        this.on(name, wrappedHandler);
        return off;
      }
    }, {
      key: "off",
      value: function off(name, handler) {
        var indexes = []; // to remove indexes; reverse; 倒序的

        var len = this.eventStore.length;

        for (var i = 0; i < len; i++) {
          var item = this.eventStore[i];

          if (item.name === name && item.handler === handler) {
            indexes.unshift(i);
          }
        }

        for (var _i8 = 0, _indexes = indexes; _i8 < _indexes.length; _i8++) {
          var index = _indexes[_i8];
          this.eventStore.splice(index, 1);
        }
      }
    }, {
      key: "emit",
      value: function emit(name) {
        // 重要: 先找到要执行的项放在新数组里, 因为执行项会改变事件项存储数组
        var items = [];
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = this.eventStore[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var item = _step9.value;

            if (item.name === name) {
              items.push(item);
            }
          }
        } catch (err) {
          _didIteratorError9 = true;
          _iteratorError9 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
              _iterator9.return();
            }
          } finally {
            if (_didIteratorError9) {
              throw _iteratorError9;
            }
          }
        }

        for (var _len8 = arguments.length, args = new Array(_len8 > 1 ? _len8 - 1 : 0), _key9 = 1; _key9 < _len8; _key9++) {
          args[_key9 - 1] = arguments[_key9];
        }

        for (var _i9 = 0, _items = items; _i9 < _items.length; _i9++) {
          var _item = _items[_i9];

          _item.handler.apply(_item, args);
        }
      }
    }]);

    return EventProcessor;
  }();
  var CrossWindow =
  /*#__PURE__*/
  function (_EventProcessor) {
    _inherits(CrossWindow, _EventProcessor);

    function CrossWindow() {
      var _this6;

      _classCallCheck(this, CrossWindow);

      _this6 = _possibleConstructorReturn(this, _getPrototypeOf(CrossWindow).call(this));

      _defineProperty(_assertThisInitialized(_this6), "storageName", '_crossWindow');

      var cls = CrossWindow;

      if (!cls._listen) {
        cls._listen = true;
        onDOM(window, 'storage', function (ev) {
          if (ev.key === _this6.storageName) {
            var _get2;

            var event = JSON.parse(ev.newValue);

            (_get2 = _get(_getPrototypeOf(CrossWindow.prototype), "emit", _assertThisInitialized(_this6))).call.apply(_get2, [_assertThisInitialized(_this6), event.name].concat(_toConsumableArray(event.args)));
          }
        });
      }

      return _this6;
    }

    _createClass(CrossWindow, [{
      key: "emit",
      value: function emit(name) {
        var _get3;

        for (var _len9 = arguments.length, args = new Array(_len9 > 1 ? _len9 - 1 : 0), _key10 = 1; _key10 < _len9; _key10++) {
          args[_key10 - 1] = arguments[_key10];
        }

        (_get3 = _get(_getPrototypeOf(CrossWindow.prototype), "emit", this)).call.apply(_get3, [this, name].concat(args));

        glb().localStorage.setItem(this.storageName, JSON.stringify({
          name: name,
          args: args,
          // use random make storage event triggered every time
          // 加入随机保证触发storage事件
          random: Math.random()
        }));
      }
    }]);

    return CrossWindow;
  }(EventProcessor);

  /*!
   * helper-js v1.3.9
   * (c) 2018-present phphe <phphe@outlook.com> (https://github.com/phphe)
   * Released under the MIT License.
   */

  function _classCallCheck$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties$1(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass$1(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$1(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty$1(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _inherits$1(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf$1(subClass, superClass);
  }

  function _getPrototypeOf$1(o) {
    _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf$1(o);
  }

  function _setPrototypeOf$1(o, p) {
    _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf$1(o, p);
  }

  function _assertThisInitialized$1(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn$1(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized$1(self);
  }

  function _superPropBase$1(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf$1(object);
      if (object === null) break;
    }

    return object;
  }

  function _get$1(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get$1 = Reflect.get;
    } else {
      _get$1 = function _get(target, property, receiver) {
        var base = _superPropBase$1(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get$1(target, property, receiver || target);
  }

  function _toConsumableArray$1(arr) {
    return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _nonIterableSpread$1();
  }

  function _arrayWithoutHoles$1(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray$1(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread$1() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  // local store
  var store$1 = {}; // get global

  function glb$1() {
    if (store$1.glb) {
      return store$1.glb;
    } else {
      // resolve global
      var t;

      try {
        t = global;
      } catch (e) {
        t = window;
      }

      store$1.glb = t;
      return t;
    }
  } // is 各种判断

  function onDOM$1(el, name, handler) {
    for (var _len5 = arguments.length, args = new Array(_len5 > 3 ? _len5 - 3 : 0), _key6 = 3; _key6 < _len5; _key6++) {
      args[_key6 - 3] = arguments[_key6];
    }

    if (el.addEventListener) {
      // 所有主流浏览器，除了 IE 8 及更早 IE版本
      el.addEventListener.apply(el, [name, handler].concat(args));
    } else if (el.attachEvent) {
      // IE 8 及更早 IE 版本
      el.attachEvent.apply(el, ["on".concat(name), handler].concat(args));
    }
  }
  function offDOM$1(el, name, handler) {
    for (var _len6 = arguments.length, args = new Array(_len6 > 3 ? _len6 - 3 : 0), _key7 = 3; _key7 < _len6; _key7++) {
      args[_key7 - 3] = arguments[_key7];
    }

    if (el.removeEventListener) {
      // 所有主流浏览器，除了 IE 8 及更早 IE版本
      el.removeEventListener.apply(el, [name, handler].concat(args));
    } else if (el.detachEvent) {
      // IE 8 及更早 IE 版本
      el.detachEvent.apply(el, ["on".concat(name), handler].concat(args));
    }
  }
  var URLHelper$1 =
  /*#__PURE__*/
  function () {
    // protocol, hostname, port, pastname
    function URLHelper(baseUrl) {
      var _this3 = this;

      _classCallCheck$1(this, URLHelper);

      _defineProperty$1(this, "baseUrl", '');

      _defineProperty$1(this, "search", {});

      var t = decodeURI(baseUrl).split('?');
      this.baseUrl = t[0];

      if (t[1]) {
        t[1].split('&').forEach(function (v) {
          var t2 = v.split('=');
          _this3.search[t2[0]] = t2[1] == null ? '' : decodeURIComponent(t2[1]);
        });
      }
    }

    _createClass$1(URLHelper, [{
      key: "getHref",
      value: function getHref() {
        var _this4 = this;

        var t = [this.baseUrl];
        var searchStr = Object.keys(this.search).map(function (k) {
          return "".concat(k, "=").concat(encodeURIComponent(_this4.search[k]));
        }).join('&');

        if (searchStr) {
          t.push(searchStr);
        }

        return t.join('?');
      }
    }]);

    return URLHelper;
  }(); // 解析函数参数, 帮助重载

  var EventProcessor$1 =
  /*#__PURE__*/
  function () {
    function EventProcessor() {
      _classCallCheck$1(this, EventProcessor);

      _defineProperty$1(this, "eventStore", []);
    }

    _createClass$1(EventProcessor, [{
      key: "on",
      value: function on(name, handler) {
        this.eventStore.push({
          name: name,
          handler: handler
        });
      }
    }, {
      key: "once",
      value: function once(name, handler) {
        var _this5 = this;

        var off = function off() {
          _this5.off(name, wrappedHandler);
        };

        var wrappedHandler = function wrappedHandler() {
          handler();
          off();
        };

        this.on(name, wrappedHandler);
        return off;
      }
    }, {
      key: "off",
      value: function off(name, handler) {
        var indexes = []; // to remove indexes; reverse; 倒序的

        var len = this.eventStore.length;

        for (var i = 0; i < len; i++) {
          var item = this.eventStore[i];

          if (item.name === name && item.handler === handler) {
            indexes.unshift(i);
          }
        }

        for (var _i8 = 0, _indexes = indexes; _i8 < _indexes.length; _i8++) {
          var index = _indexes[_i8];
          this.eventStore.splice(index, 1);
        }
      }
    }, {
      key: "emit",
      value: function emit(name) {
        // 重要: 先找到要执行的项放在新数组里, 因为执行项会改变事件项存储数组
        var items = [];
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = this.eventStore[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var item = _step9.value;

            if (item.name === name) {
              items.push(item);
            }
          }
        } catch (err) {
          _didIteratorError9 = true;
          _iteratorError9 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
              _iterator9.return();
            }
          } finally {
            if (_didIteratorError9) {
              throw _iteratorError9;
            }
          }
        }

        for (var _len8 = arguments.length, args = new Array(_len8 > 1 ? _len8 - 1 : 0), _key9 = 1; _key9 < _len8; _key9++) {
          args[_key9 - 1] = arguments[_key9];
        }

        for (var _i9 = 0, _items = items; _i9 < _items.length; _i9++) {
          var _item = _items[_i9];

          _item.handler.apply(_item, args);
        }
      }
    }]);

    return EventProcessor;
  }();
  var CrossWindow$1 =
  /*#__PURE__*/
  function (_EventProcessor) {
    _inherits$1(CrossWindow, _EventProcessor);

    function CrossWindow() {
      var _this6;

      _classCallCheck$1(this, CrossWindow);

      _this6 = _possibleConstructorReturn$1(this, _getPrototypeOf$1(CrossWindow).call(this));

      _defineProperty$1(_assertThisInitialized$1(_this6), "storageName", '_crossWindow');

      var cls = CrossWindow;

      if (!cls._listen) {
        cls._listen = true;
        onDOM$1(window, 'storage', function (ev) {
          if (ev.key === _this6.storageName) {
            var _get2;

            var event = JSON.parse(ev.newValue);

            (_get2 = _get$1(_getPrototypeOf$1(CrossWindow.prototype), "emit", _assertThisInitialized$1(_this6))).call.apply(_get2, [_assertThisInitialized$1(_this6), event.name].concat(_toConsumableArray$1(event.args)));
          }
        });
      }

      return _this6;
    }

    _createClass$1(CrossWindow, [{
      key: "emit",
      value: function emit(name) {
        var _get3;

        for (var _len9 = arguments.length, args = new Array(_len9 > 1 ? _len9 - 1 : 0), _key10 = 1; _key10 < _len9; _key10++) {
          args[_key10 - 1] = arguments[_key10];
        }

        (_get3 = _get$1(_getPrototypeOf$1(CrossWindow.prototype), "emit", this)).call.apply(_get3, [this, name].concat(args));

        glb$1().localStorage.setItem(this.storageName, JSON.stringify({
          name: name,
          args: args,
          // use random make storage event triggered every time
          // 加入随机保证触发storage事件
          random: Math.random()
        }));
      }
    }]);

    return CrossWindow;
  }(EventProcessor$1);

  /*!
   * drag-event-service v1.0.0
   * (c) 2018-present phphe <phphe@outlook.com> (https://github.com/phphe)
   * Released under the MIT License.
   */

  function _toConsumableArray$2(arr) {
    return _arrayWithoutHoles$2(arr) || _iterableToArray$2(arr) || _nonIterableSpread$2();
  }

  function _arrayWithoutHoles$2(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray$2(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread$2() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var events = {
    start: ['mousedown', 'touchstart'],
    move: ['mousemove', 'touchmove'],
    end: ['mouseup', 'touchend']
  };
  var index = {
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
            y: e.changedTouches[0].pageY
          };
        } else {
          // mouse
          mouse = {
            x: e.pageX,
            y: e.pageY
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

      (_hp$onDOM = onDOM$1).call.apply(_hp$onDOM, [null, el, events[name][0], wrapper].concat(_toConsumableArray$2(args).concat(_toConsumableArray$2(mouseArgs))));

      (_hp$onDOM2 = onDOM$1).call.apply(_hp$onDOM2, [null, el, events[name][1], wrapper].concat(_toConsumableArray$2(args).concat(_toConsumableArray$2(touchArgs))));
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

          (_hp$offDOM = offDOM$1).call.apply(_hp$offDOM, [null, el, events[name][0], wrapper].concat(_toConsumableArray$2(args).concat(_toConsumableArray$2(mouseArgs))));

          (_hp$offDOM2 = offDOM$1).call.apply(_hp$offDOM2, [null, el, events[name][1], wrapper].concat(_toConsumableArray$2(args).concat(_toConsumableArray$2(mouseArgs))));

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

  /***
  const destroy = draggableHelper(HTMLElement dragHandlerEl, Object opt = {})
  opt.drag(e, opt, store)
  [Object] opt.style || opt.getStyle(opt) set style of moving el style
  [Boolean] opt.clone
  opt.draggingClass, default dragging
  opt.moving(e, opt, store) return false can prevent moving
  opt.drop(e, opt, store)
  opt.getEl(dragHandlerEl, opt) get the el that will be moved. default is dragHandlerEl
  opt.minTranslate default 10, unit px
  add other prop into opt, you can get opt in callback
  store{
    el
    initialMouse
    initialPosition
    mouse
    move
    movedCount // start from 0
  }
  e.g.
  draggable(this.$el, {
    vm: this,
    data: this.data,
    drag: (e, opt, store) => {
      dplh.style.height = store.el.querySelector('.TreeNodeSelf').offsetHeight + 'px'
      th.insertAfter(dplh, opt.data)
    },
    moving: (e, opt, store) => {
      hp.arrayRemove(dplh.parent.children, dplh)
    },
    drop: (e, opt, store) => {
      hp.arrayRemove(dplh.parent.children, dplh)
    },
  })
  ***/

  function index$1 (dragHandlerEl) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (opt.minTranslate == null) {
      opt.minTranslate = 10;
    }

    var store$$1 = getPureStore();

    var destroy = function destroy() {
      index.off(dragHandlerEl, 'end', dragHandlerEl._draggbleEventHandler);
      delete dragHandlerEl._draggbleEventHandler;
    };

    if (dragHandlerEl._draggbleEventHandler) {
      destroy();
    }

    dragHandlerEl._draggbleEventHandler = start;
    index.on(dragHandlerEl, 'start', start);
    return destroy;

    function start(e, mouse) {
      e.preventDefault();
      store$$1.mouse = {
        x: mouse.x,
        y: mouse.y
      };
      store$$1.initialMouse = Object.assign({}, store$$1.mouse);
      /*
      must set passive false for touch, else the follow error occurs in Chrome:
      Unable to preventDefault inside passive event listener due to target being treated as passive. See https://www.chromestatus.com/features/5093566007214080
       */

      index.on(document, 'move', moving, {
        touchArgs: [{
          passive: false
        }]
      });
      index.on(window, 'end', drop);
    }

    function drag(e) {
      var _resolveDragedElAndIn = resolveDragedElAndInitialPosition(),
          el = _resolveDragedElAndIn.el,
          position = _resolveDragedElAndIn.position;

      store$$1.el = el;
      store$$1.initialPosition = Object.assign({}, position);
      var r = opt.drag && opt.drag(e, opt, store$$1);

      if (r === false) {
        return false;
      } // dom actions


      var size = getElSize(el);
      var style = Object.assign({
        width: "".concat(size.width, "px"),
        height: "".concat(size.height, "px"),
        zIndex: 9999,
        opacity: 0.6,
        position: 'absolute',
        left: position.x + 'px',
        top: position.y + 'px'
      }, opt.style || opt.getStyle && opt.getStyle(opt) || {});
      backupAttr(el, 'style');

      for (var key in style) {
        el.style[key] = style[key];
      } // add class


      backupAttr(el, 'class');
      addClass(el, opt.draggingClass);
    }

    function moving(e, mouse) {
      e.preventDefault();
      store$$1.mouse = {
        x: mouse.x,
        y: mouse.y
      };
      var move = store$$1.move = {
        x: store$$1.mouse.x - store$$1.initialMouse.x,
        y: store$$1.mouse.y - store$$1.initialMouse.y
      };

      if (store$$1.movedCount === 0 && opt.minTranslate) {
        var x2 = Math.pow(store$$1.move.x, 2);
        var y2 = Math.pow(store$$1.move.y, 2);
        var dtc = Math.pow(x2 + y2, 0.5);

        if (dtc < opt.minTranslate) {
          return;
        }
      }

      var canMove = true;

      if (store$$1.movedCount === 0) {
        if (drag(e) === false) {
          canMove = false;
        }
      } // move started


      if (canMove && opt.moving) {
        if (opt.moving(e, opt, store$$1) === false) {
          canMove = false;
        }
      }

      if (canMove) {
        if (!store$$1 || !store$$1.el) {
          return;
        }

        Object.assign(store$$1.el.style, {
          left: store$$1.initialPosition.x + move.x + 'px',
          top: store$$1.initialPosition.y + move.y + 'px'
        });
        store$$1.movedCount++;
      }
    }

    function drop(e) {
      index.off(document, 'move', moving, {
        touchArgs: [{
          passive: false
        }]
      });
      index.off(window, 'end', drop); // drag executed if movedCount > 0

      if (store$$1.movedCount > 0) {
        store$$1.movedCount = 0;
        var _store = store$$1,
            el = _store.el;

        if (opt.clone) {
          el.parentElement.removeChild(el);
        } else {
          restoreAttr(el, 'style');
          restoreAttr(el, 'class');
        }

        opt.drop && opt.drop(e, opt, store$$1);
      }

      store$$1 = getPureStore();
    }

    function resolveDragedElAndInitialPosition() {
      var el0 = opt.getEl ? opt.getEl(dragHandlerEl, opt) : dragHandlerEl;
      var el = el0;

      if (opt.clone) {
        store$$1.triggerEl = el0;
        el = el0.cloneNode(true);
        el0.parentElement.appendChild(el);
      }

      return {
        position: getPosition(el0),
        el: el
      };
    }

    function getPureStore() {
      return {
        movedCount: 0
      };
    }
  }

  return index$1;

})));
