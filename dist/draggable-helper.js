/*!
 * draggable-helper v1.1.0
 * (c) phphe <phphe@outlook.com> (https://github.com/phphe)
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['helper-js'] = factory());
}(this, function () { 'use strict';

  /*!
   * helper-js v1.4.0
   * (c) phphe <phphe@outlook.com> (https://github.com/phphe)
   * Released under the MIT License.
   */

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
  function findParent(el, callback, opt) {
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

  /*!
   * helper-js v1.3.9
   * (c) 2018-present phphe <phphe@outlook.com> (https://github.com/phphe)
   * Released under the MIT License.
   */

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
  function offDOM(el, name, handler) {
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

  /*!
   * drag-event-service v1.0.0
   * (c) 2018-present phphe <phphe@outlook.com> (https://github.com/phphe)
   * Released under the MIT License.
   */

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

      (_hp$onDOM = onDOM).call.apply(_hp$onDOM, [null, el, events[name][0], wrapper].concat(_toConsumableArray(args).concat(_toConsumableArray(mouseArgs))));

      (_hp$onDOM2 = onDOM).call.apply(_hp$onDOM2, [null, el, events[name][1], wrapper].concat(_toConsumableArray(args).concat(_toConsumableArray(touchArgs))));
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

          (_hp$offDOM = offDOM).call.apply(_hp$offDOM, [null, el, events[name][0], wrapper].concat(_toConsumableArray(args).concat(_toConsumableArray(mouseArgs))));

          (_hp$offDOM2 = offDOM).call.apply(_hp$offDOM2, [null, el, events[name][1], wrapper].concat(_toConsumableArray(args).concat(_toConsumableArray(mouseArgs))));

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
  opt.drag(startEvent, moveEvent, opt, store) return false to prevent drag
  [Object] opt.style || opt.getStyle(opt, store) set style of moving el style
  [Boolean] opt.clone
  opt.draggingClass, default dragging
  opt.moving(e, opt, store) return false can prevent moving
  opt.drop(e, opt, store)
  opt.getEl(dragHandlerEl, opt, store) get the el that will be moved. default is dragHandlerEl
  opt.minTranslate default 10, unit px
  [Boolean] opt.triggerBySelf: false if trigger only by self, can not be triggered by children

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

  var IGNORE_TRIGGERS = ['INPUT', 'TEXTAREA', 'SELECT', 'OPTGROUP', 'OPTION'];
  var UNDRAGGABLE_CLASS = 'undraggable';
  function index$1 (dragHandlerEl) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (opt.minTranslate == null) {
      opt.minTranslate = 10;
    }

    var store = getPureStore();

    var destroy = function destroy() {
      index.off(dragHandlerEl, 'start', dragHandlerEl._draggbleEventHandler);
      delete dragHandlerEl._draggbleEventHandler;
    };

    if (dragHandlerEl._draggbleEventHandler) {
      destroy();
    }

    dragHandlerEl._draggbleEventHandler = start;
    index.on(dragHandlerEl, 'start', start);
    return destroy;

    function start(e, mouse) {
      // detect draggable =================================
      if (opt.triggerBySelf && e.target !== dragHandlerEl) {
        return;
      }

      if (IGNORE_TRIGGERS.includes(e.target.tagName)) {
        return;
      }

      if (hasClass(e.target, UNDRAGGABLE_CLASS)) {
        return;
      }

      var isParentUndraggable = findParent(e.target, function (el) {
        if (hasClass(el, UNDRAGGABLE_CLASS)) {
          return true;
        }

        if (el === dragHandlerEl) {
          return 'break';
        }
      });

      if (isParentUndraggable) {
        return;
      } // detect draggable end =================================


      e.preventDefault();
      store.mouse = {
        x: mouse.x,
        y: mouse.y
      };
      store.startEvent = e;
      store.initialMouse = Object.assign({}, store.mouse);
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
      var r = opt.drag && opt.drag(store.startEvent, e, opt, store);

      if (r === false) {
        return false;
      }

      var _resolveDragedElAndIn = resolveDragedElAndInitialPosition(),
          el = _resolveDragedElAndIn.el,
          position = _resolveDragedElAndIn.position;

      store.el = el;
      store.initialPosition = Object.assign({}, position); // dom actions

      var size = getElSize(el);
      var style = Object.assign({
        width: "".concat(size.width, "px"),
        height: "".concat(size.height, "px"),
        zIndex: 9999,
        opacity: 0.6,
        position: 'absolute',
        left: position.x + 'px',
        top: position.y + 'px'
      }, opt.style || opt.getStyle && opt.getStyle(opt, store) || {});
      backupAttr(el, 'style');

      for (var key in style) {
        el.style[key] = style[key];
      } // add class


      backupAttr(el, 'class');
      addClass(el, opt.draggingClass);
    }

    function moving(e, mouse) {
      e.preventDefault();
      store.mouse = {
        x: mouse.x,
        y: mouse.y
      };
      var move = store.move = {
        x: store.mouse.x - store.initialMouse.x,
        y: store.mouse.y - store.initialMouse.y
      };

      if (store.movedCount === 0 && opt.minTranslate) {
        var x2 = Math.pow(store.move.x, 2);
        var y2 = Math.pow(store.move.y, 2);
        var dtc = Math.pow(x2 + y2, 0.5);

        if (dtc < opt.minTranslate) {
          return;
        }
      }

      var canMove = true;

      if (store.movedCount === 0) {
        if (drag(e) === false) {
          canMove = false;
        }
      } // move started


      if (canMove && opt.moving) {
        if (opt.moving(e, opt, store) === false) {
          canMove = false;
        }
      }

      if (canMove) {
        if (!store || !store.el) {
          return;
        }

        Object.assign(store.el.style, {
          left: store.initialPosition.x + move.x + 'px',
          top: store.initialPosition.y + move.y + 'px'
        });
        store.movedCount++;
      }
    }

    function drop(e) {
      index.off(document, 'move', moving, {
        touchArgs: [{
          passive: false
        }]
      });
      index.off(window, 'end', drop); // drag executed if movedCount > 0

      if (store.movedCount > 0) {
        store.movedCount = 0;
        var _store = store,
            el = _store.el;

        if (opt.clone) {
          el.parentElement.removeChild(el);
        } else {
          restoreAttr(el, 'style');
          restoreAttr(el, 'class');
        }

        opt.drop && opt.drop(e, opt, store);
      }

      store = getPureStore();
    }

    function resolveDragedElAndInitialPosition() {
      var el0 = opt.getEl ? opt.getEl(dragHandlerEl, opt, store) : dragHandlerEl;
      var el = el0;

      if (opt.clone) {
        store.triggerEl = el0;
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

}));
