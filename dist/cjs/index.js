/*!
 * draggable-helper v5.0.0
 * (c) phphe <phphe@outlook.com> (https://github.com/phphe)
 * Homepage: undefined
 * Released under the MIT License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var hp = require('helper-js');
var _toConsumableArray = _interopDefault(require('@babel/runtime/helpers/toConsumableArray'));

/*!
 * drag-event-service v1.1.5
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

    (_hp$onDOM = hp.onDOM).call.apply(_hp$onDOM, [null, el, events[name][0], wrapper].concat([].concat(_toConsumableArray(args), _toConsumableArray(mouseArgs))));

    (_hp$onDOM2 = hp.onDOM).call.apply(_hp$onDOM2, [null, el, events[name][1], wrapper].concat([].concat(_toConsumableArray(args), _toConsumableArray(touchArgs))));
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

        (_hp$offDOM = hp.offDOM).call.apply(_hp$offDOM, [null, el, events[name][0], wrapper].concat([].concat(_toConsumableArray(args), _toConsumableArray(mouseArgs))));

        (_hp$offDOM2 = hp.offDOM).call.apply(_hp$offDOM2, [null, el, events[name][1], wrapper].concat([].concat(_toConsumableArray(args), _toConsumableArray(mouseArgs))));

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

function trackMouseOrTouchPosition() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var trackedInfo = {
    position: {}
  };

  var update = function update(name, e) {
    var isTouch = DragEventService.isTouch(e);

    if (isTouch) {
      // touch
      Object.assign(trackedInfo.position, {
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY,
        pageX: e.changedTouches[0].pageX,
        pageY: e.changedTouches[0].pageY,
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY,
        screenX: e.changedTouches[0].screenX,
        screenY: e.changedTouches[0].screenY
      });
    } else {
      // mouse
      Object.assign(trackedInfo.position, {
        x: e.pageX,
        y: e.pageY,
        pageX: e.pageX,
        pageY: e.pageY,
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY
      });
    }

    if (name === 'start') {
      trackedInfo.startEvent = e;
    } else if (name === 'end') {
      trackedInfo.endEvent = e;
    }

    Object.assign(trackedInfo, {
      event: e,
      isTouch: isTouch,
      eventType: name
    });
  };

  var onStart = function onStart(e) {
    var isTouch = DragEventService.isTouch(e);

    if (!isTouch && e.which !== 1) {
      // not left button mousedown
      return;
    }

    update('start', e);

    if (options.onStart) {
      options.onStart();
    }
  };

  var onMove = function onMove(e) {
    update('move', e);

    if (options.onMove) {
      options.onMove();
    }
  };

  var onEnd = function onEnd(e) {
    update('end', e);

    if (options.onEnd) {
      options.onEnd();
    }
  };

  var start = function start() {
    DragEventService.on(document, 'start', onStart);
    DragEventService.on(document, 'move', onMove);
    DragEventService.on(window, 'end', onEnd);
    trackedInfo.started = true;
  };

  var stop = function stop() {
    DragEventService.off(document, 'start', onStart);
    DragEventService.off(document, 'move', onMove);
    DragEventService.off(window, 'end', onEnd);
    trackedInfo.started = false;
  };

  return {
    info: trackedInfo,
    start: start,
    stop: stop
  };
}

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
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

var dragging = false; // Whether dragging is in progress. 拖拽是否正在进行中.

function index (listenerElement) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var store; // set default value of options
  // 设置options的默认值

  objectAssignIfKeyNull(opt, defaultOptions); // define the event listener of mousedown and touchstart
  // 定义mousedown和touchstart事件监听器

  var onMousedownOrTouchStart = function onMousedownOrTouchStart(e, mouse) {
    var target = e.target; // check if triggered by ignore tags
    // 检查是否由忽略的标签名触发

    if (opt.ingoreTags.includes(target.tagName)) {
      return;
    } // check if trigger element and its parent has undraggable class name
    // 检查触发事件的元素和其与element之间的父级是否有不允许拖动的类名


    if (hp.hasClass(target, opt.undraggableClassName)) {
      return;
    }

    var isParentUndraggable = hp.findParent(target, function (el) {
      if (hp.hasClass(el, opt.undraggableClassName)) {
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

      var _iterator = _createForOfIteratorHelper(hp.toArrayIfNot(opt.triggerClassName)),
          _step;

      try {
        var _loop = function _loop() {
          var className = _step.value;
          triggerElement = hp.findParent(store.directTriggerElement, function (el) {
            if (hp.hasClass(el, className)) {
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
      e.preventDefault();
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


  DragEventService.on(listenerElement, 'start', onMousedownOrTouchStart); // define the event listener of mousemove and touchmove
  // 定义mousemove和touchmove事件监听器

  var onMousemoveOrTouchMove = function onMousemoveOrTouchMove(e, mouse) {
    var _store = store,
        movedOrClonedElement = _store.movedOrClonedElement; // prevent text be selected
    // 阻止文字被选中

    e.preventDefault(); // calc move and attach related info to store
    // 计算move并附加相关信息到store

    var move = store.move = {
      x: mouse.x - store.initialMouse.x,
      y: mouse.y - store.initialMouse.y
    };
    store.moveEvent = e;
    store.mouse = mouse; // first move
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
      var initialPosition = hp.getPosition(movedOrClonedElement); // attach elements and initialPosition to store
      // 附加元素和初始位置到store

      store.movedOrClonedElement = movedOrClonedElement;
      store.movedElement = movedElement;
      store.initialPosition = initialPosition; // define the function to update moved element style
      // 定义更新移动元素样式的方法

      var updateMovedElementStyle = function updateMovedElementStyle() {
        if (opt.clone) {
          store.movedOrClonedElement.parentElement.appendChild(movedElement);
        }

        var size = hp.getBoundingClientRect(movedElement);
        var style = {
          width: "".concat(Math.ceil(size.width), "px"),
          height: "".concat(Math.ceil(size.height), "px"),
          zIndex: 9999,
          opacity: 0.8,
          position: 'absolute',
          left: initialPosition.x + 'px',
          top: initialPosition.y + 'px',
          pointerEvents: 'none'
        };
        hp.backupAttr(movedElement, 'style');

        for (var key in style) {
          movedElement.style[key] = style[key];
        }

        hp.backupAttr(movedElement, 'class');
        hp.addClass(movedElement, opt.draggingClassName);
      };

      store.updateMovedElementStyle = updateMovedElementStyle; // call hook beforeFirstMove, beforeMove

      if (opt.beforeFirstMove && opt.beforeFirstMove(store, opt) === false) {
        return;
      }

      dragging = true;

      if (opt.beforeMove && opt.beforeMove(store, opt) === false) {
        return;
      } // try to update moved element style
      // 尝试更新移动元素样式


      if (!opt.updateMovedElementStyleManually) {
        store.updateMovedElementStyle();
      }
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

    store.movedCount++;
  }; // define the event listener of mouseup and touchend
  // 定义mouseup和touchend事件监听器


  var onMouseupOrTouchEnd = function onMouseupOrTouchEnd(e) {
    dragging = false; // cancel listening mousemove, touchmove, mouseup, touchend
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
      hp.restoreAttr(movedElement, 'style');
      hp.restoreAttr(movedElement, 'class');

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

    dragging = false;
  }; // define the destroy function
  // 定义销毁/退出的方法


  var destroy = function destroy() {
    DragEventService.off(listenerElement, 'start', onMousedownOrTouchStart);
    DragEventService.on(document, 'move', onMousemoveOrTouchMove, {
      touchArgs: [{
        passive: false
      }]
    });
    DragEventService.on(window, 'end', onMouseupOrTouchEnd);
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
  updateMovedElementStyleManually: false
}; // Info after event triggered. Created when mousedown or touchstart, destroied after mouseup or touchend.
// 事件触发后的相关信息. mousedown或touchstart时创建, mouseup或touchend后销毁.

var initialStore = {
  movedCount: 0
};
/* A mousemove or touchmove event listener generator function. To make specified parent element scroll when drag.
*/

var defaultOptionsForFixScrollBox = {
  triggerMargin: 50,
  triggerOutterMargin: 30,
  scrollSpeed: 0.3
};
var allListeningElementsOfFixScrollBox = new Set();
var trackMouseOrTouchPositionInstance = trackMouseOrTouchPosition({
  onEnd: function onEnd() {
    trackMouseOrTouchPositionInstance.stop();
  }
});
function fixScrollBox(boxElement) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  objectAssignIfKeyNull(opt, defaultOptionsForFixScrollBox);
  allListeningElementsOfFixScrollBox.add(boxElement);
  var stopVerticalScroll, stopHorizontalScroll;

  var onMove = function onMove(e, mouse) {
    if (!dragging) {
      return;
    }

    if (!trackMouseOrTouchPositionInstance.info.started) {
      trackMouseOrTouchPositionInstance.start();
    } // stop old scroll animation
    // 结束之前的滚动动画


    if (stopVerticalScroll) {
      stopVerticalScroll();
      stopVerticalScroll = null;
    }

    if (stopHorizontalScroll) {
      stopHorizontalScroll();
      stopHorizontalScroll = null;
    } // box element scroll width or height greater than offset width or height
    // 元素滚动宽高大于offset宽高


    if (boxElement.scrollHeight > boxElement.offsetHeight || boxElement.scrollWidth > boxElement.offsetWidth) {
      var boxPosition = hp.getViewportPosition(boxElement);
      var margin = opt.triggerMargin;
      var outterMargin = opt.triggerOutterMargin; // check if leaved box before every frame of scrollTo
      // 在scrollTo执行每一帧前检查是否已离开box元素

      var beforeEveryFrame = function beforeEveryFrame(count) {
        if (count === 0) {
          return;
        }

        var currentMousePosition = trackMouseOrTouchPositionInstance.info.position; // find the box element which mouse hovering

        var foundBoxElement;
        var firstElement;

        var _iterator2 = _createForOfIteratorHelper(hp.elementsFromPoint(currentMousePosition.clientX, currentMousePosition.clientY)),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var itemEl = _step2.value;

            if (!firstElement) {
              firstElement = itemEl;
            }

            if (allListeningElementsOfFixScrollBox.has(itemEl)) {
              foundBoxElement = itemEl;
              break;
            }
          } // check if the found element is covered by other elements

        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        if (firstElement !== foundBoxElement && !hp.isDescendantOf(firstElement, foundBoxElement)) {
          foundBoxElement = null;
        } // 


        if (!foundBoxElement) {
          return false;
        }
      }; // vertical


      if (boxElement.scrollHeight > boxElement.offsetHeight) {
        if (mouse.clientY <= boxPosition.top + margin) {
          stopVerticalScroll = scrollTo({
            y: 0,
            element: boxElement,
            beforeEveryFrame: beforeEveryFrame,
            duration: boxElement.scrollTop / opt.scrollSpeed
          });
        } else if (mouse.clientY >= boxPosition.top + boxPosition.height - margin) {
          stopVerticalScroll = scrollTo({
            y: boxElement.scrollHeight,
            element: boxElement,
            beforeEveryFrame: beforeEveryFrame,
            duration: (boxElement.scrollHeight - boxElement.offsetHeight - boxElement.scrollTop) / opt.scrollSpeed
          });
        }
      } // horizontal


      if (boxElement.scrollWidth > boxElement.offsetWidth) {
        if (mouse.clientX <= boxPosition.left + margin) {
          stopHorizontalScroll = scrollTo({
            x: 0,
            element: boxElement,
            beforeEveryFrame: beforeEveryFrame,
            duration: boxElement.scrollLeft / opt.scrollSpeed
          });
        } else if (mouse.clientX >= boxPosition.left + boxPosition.width - margin) {
          stopHorizontalScroll = scrollTo({
            x: boxElement.scrollWidth,
            element: boxElement,
            beforeEveryFrame: beforeEveryFrame,
            duration: (boxElement.scrollWidth - boxElement.offsetWidth - boxElement.scrollLeft) / opt.scrollSpeed
          });
        }
      }
    }
  };

  DragEventService.on(boxElement, 'move', onMove);
  return {
    options: opt,
    destroy: function destroy() {
      DragEventService.off(boxElement, 'move', onMove);
      allListeningElementsOfFixScrollBox.delete(boxElement);
    }
  };
} // TODO move to helper-js

function objectAssignIfKeyNull(obj1, obj2) {
  Object.keys(obj2).forEach(function (key) {
    if (obj1[key] == null) {
      obj1[key] = obj2[key];
    }
  });
} // from https://gist.github.com/andjosh/6764939

/*
interface options{
  x: number // nullable. don't scroll horizontally when null
  y: number // nullable. don't scroll vertically when null
  duration: number // default 0
  element: HTMLElement // default is the top scrollable element.
  beforeEveryFrame: (count: number) => boolean|void // call before requestAnimationFrame execution. return false to stop
}
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
}

exports.allListeningElementsOfFixScrollBox = allListeningElementsOfFixScrollBox;
exports.default = index;
exports.defaultOptions = defaultOptions;
exports.defaultOptionsForFixScrollBox = defaultOptionsForFixScrollBox;
exports.fixScrollBox = fixScrollBox;
exports.initialStore = initialStore;
