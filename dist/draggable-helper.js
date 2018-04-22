/*!
 * draggable-helper v1.0.0
 * (c) 2017-present phphe <phphe@outlook.com> (https://github.com/phphe)
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.draggableHelper = factory());
}(this, (function () { 'use strict';

  /*!
   * helper-js v1.0.45
   * (c) 2017-present phphe <phphe@outlook.com> (https://github.com/phphe)
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

  function _get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return _get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
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
  function getOffsetWithoutScroll(el) {
    var elOffset = {
      x: el.offsetLeft,
      y: el.offsetTop
    };
    var parentOffset = {
      x: 0,
      y: 0
    };
    if (el.offsetParent != null) parentOffset = getOffsetWithoutScroll(el.offsetParent);
    return {
      x: elOffset.x + parentOffset.x,
      y: elOffset.y + parentOffset.y
    };
  }
  function getOffset(el) {
    var offfset = getOffsetWithoutScroll(el);
    var el2 = el;
    var body = document.body;

    while (el2 && el2 !== body) {
      offfset.x -= el2.scrollLeft;
      offfset.y -= el2.scrollTop;
      el2 = el2.parentElement;
    }

    return offfset;
  }
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
    if (el.addEventListener) {
      // 所有主流浏览器，除了 IE 8 及更早 IE版本
      el.addEventListener(name, handler);
    } else if (el.attachEvent) {
      // IE 8 及更早 IE 版本
      el.attachEvent("on".concat(name), handler);
    }
  }
  function offDOM(el, name, handler) {
    if (el.removeEventListener) {
      // 所有主流浏览器，除了 IE 8 及更早 IE版本
      el.removeEventListener(name, handler);
    } else if (el.detachEvent) {
      // IE 8 及更早 IE 版本
      el.detachEvent("on".concat(name), handler);
    }
  } // advance
  var URLHelper =
  /*#__PURE__*/
  function () {
    // protocol, hostname, port, pastname
    function URLHelper(baseUrl) {
      var _this = this;

      _classCallCheck(this, URLHelper);

      Object.defineProperty(this, "baseUrl", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: ''
      });
      Object.defineProperty(this, "search", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: {}
      });
      var t = decodeURI(baseUrl).split('?');
      this.baseUrl = t[0];

      if (t[1]) {
        t[1].split('&').forEach(function (v) {
          var t2 = v.split('=');
          _this.search[t2[0]] = t2[1] == null ? '' : decodeURIComponent(t2[1]);
        });
      }
    }

    _createClass(URLHelper, [{
      key: "getHref",
      value: function getHref() {
        var _this2 = this;

        var t = [this.baseUrl];
        var searchStr = Object.keys(this.search).map(function (k) {
          return "".concat(k, "=").concat(encodeURIComponent(_this2.search[k]));
        }).join('&');

        if (searchStr) {
          t.push(searchStr);
        }

        return t.join('?');
      }
    }]);

    return URLHelper;
  }(); // 解析函数参数, 帮助重载

  function makeStorageHelper(storage) {
    return {
      storage: storage,
      set: function set(name, value, minutes) {
        if (value == null) {
          this.storage.removeItem(name);
        } else {
          this.storage.setItem(name, JSON.stringify({
            value: value,
            expired_at: minutes && new Date().getTime() / 1000 + minutes * 60
          }));
        }
      },
      get: function get$$1(name) {
        var t = this.storage.getItem(name);

        if (t) {
          t = JSON.parse(t);

          if (!t.expired_at || t.expired_at > new Date().getTime()) {
            return t.value;
          } else {
            this.storage.removeItem(name);
          }
        }

        return null;
      },
      clear: function clear() {
        this.storage.clear();
      }
    };
  }
  var localStorage2 = makeStorageHelper(global.localStorage);
  var sessionStorage2 = makeStorageHelper(global.sessionStorage); // 事件处理

  var EventProcessor =
  /*#__PURE__*/
  function () {
    function EventProcessor() {
      _classCallCheck(this, EventProcessor);

      Object.defineProperty(this, "eventStore", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: []
      });
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
        var _this3 = this;

        var off = function off() {
          _this3.off(name, wrappedHandler);
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

        for (var _i2 = 0; _i2 < indexes.length; _i2++) {
          var index = indexes[_i2];
          this.eventStore.splice(index, 1);
        }
      }
    }, {
      key: "emit",
      value: function emit(name) {
        // 重要: 先找到要执行的项放在新数组里, 因为执行项会改变事件项存储数组
        var items = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.eventStore[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var item = _step2.value;

            if (item.name === name) {
              items.push(item);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        for (var _i3 = 0; _i3 < items.length; _i3++) {
          var _item = items[_i3];

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
      var _this4;

      _classCallCheck(this, CrossWindow);

      _this4 = _possibleConstructorReturn(this, (CrossWindow.__proto__ || Object.getPrototypeOf(CrossWindow)).call(this));
      Object.defineProperty(_assertThisInitialized(_this4), "storageName", {
        configurable: true,
        enumerable: true,
        writable: true,
        value: '_crossWindow'
      });
      var cls = CrossWindow;

      if (!cls._listen) {
        cls._listen = true;
        onDOM(window, 'storage', function (ev) {
          if (ev.key === _this4.storageName) {
            var _get2;

            var event = JSON.parse(ev.newValue);

            (_get2 = _get(CrossWindow.prototype.__proto__ || Object.getPrototypeOf(CrossWindow.prototype), "emit", _assertThisInitialized(_this4))).call.apply(_get2, [_this4, event.name].concat(_toConsumableArray(event.args)));
          }
        });
      }

      return _this4;
    }

    _createClass(CrossWindow, [{
      key: "emit",
      value: function emit(name) {
        var _get3;

        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }

        (_get3 = _get(CrossWindow.prototype.__proto__ || Object.getPrototypeOf(CrossWindow.prototype), "emit", this)).call.apply(_get3, [this, name].concat(args));

        global.localStorage.setItem(this.storageName, JSON.stringify({
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

  /***
  opt.drag(e, opt, store)
  [Object] opt.style || opt.getStyle(opt) set style of moving el style
  [Boolean] opt.clone
  opt.moving(e, opt, store) return false can prevent moving
  opt.drop(e, opt, store)
  opt.getEl(dragHandlerEl, opt) get the el that will be moved. default is dragHandlerEl
  opt.minTranslate default 10, unit px
  add other prop into opt, you get opt in callback
  store{
    el
    initialMouse
    initialOffset
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

  function index (dragHandlerEl) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (opt.minTranslate == null) {
      opt.minTranslate = 10;
    }

    var store$$1 = getPureStore();

    if (dragHandlerEl._draggbleEventHandler) {
      offDOM(dragHandlerEl, 'mousedown', dragHandlerEl._draggbleEventHandler);
    }

    dragHandlerEl._draggbleEventHandler = start;
    onDOM(dragHandlerEl, 'mousedown', start);

    function start(e) {
      if (e.which !== 1) {
        // not left button
        return;
      }

      store$$1.mouse = {
        x: e.pageX,
        y: e.pageY
      };
      store$$1.initialMouse = Object.assign({}, store$$1.mouse);
      onDOM(document, 'mousemove', moving);
      onDOM(window, 'mouseup', drop);
    }

    function drag(e) {
      var _resolveDragedElAndIn = resolveDragedElAndInitialOffset(),
          el = _resolveDragedElAndIn.el,
          offset = _resolveDragedElAndIn.offset;

      store$$1.el = el;
      store$$1.initialOffset = Object.assign({}, offset);
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
        position: 'fixed',
        left: offset.x + 'px',
        top: offset.y + 'px'
      }, opt.style || opt.getStyle && opt.getStyle(opt) || {});
      backupAttr(el, 'style');

      for (var key in style) {
        el.style[key] = style[key];
      } // add class


      backupAttr(el, 'class');
      addClass(el, 'dragging'); //

      var _document = document,
          body = _document.body;
      backupAttr(body, 'style');
      var bodyStyle = body.getAttribute('style') || '';

      if (bodyStyle && bodyStyle.substr(-1) !== ';') {
        bodyStyle += ';';
      }

      body.setAttribute('style', bodyStyle + '-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;');
    }

    function moving(e) {
      store$$1.mouse = {
        x: e.pageX,
        y: e.pageY
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
      }

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
          left: store$$1.initialOffset.x + move.x + 'px',
          top: store$$1.initialOffset.y + move.y + 'px'
        });
        store$$1.movedCount++;
      }
    }

    function drop(e) {
      offDOM(document, 'mousemove', moving);
      offDOM(window, 'mouseup', drop); // drag executed if movedCount > 0

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

        restoreAttr(document.body, 'style');
        opt.drop && opt.drop(e, opt, store$$1);
      }

      store$$1 = getPureStore();
    }

    function resolveDragedElAndInitialOffset() {
      var el0 = opt.getEl ? opt.getEl(dragHandlerEl, opt) : dragHandlerEl;
      var el = el0;

      if (opt.clone) {
        store$$1.triggerEl = el0;
        el = el0.cloneNode(true);
        el0.parentElement.appendChild(el);
      }

      return {
        offset: getOffset(el0),
        el: el
      };
    }

    function getPureStore() {
      return {
        movedCount: 0
      };
    }
  }

  return index;

})));
