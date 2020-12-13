/*!
 * draggable-helper v5.0.6
 * (c) phphe <phphe@outlook.com> (https://github.com/phphe)
 * Homepage: undefined
 * Released under the MIT License.
 */
import { objectAssignIfKeyNull, hasClass, findParent, toArrayIfNot, getViewportPosition, elementsFromPoint, isDescendantOf, scrollTo, getBoundingClientRect, backupAttr, addClass, restoreAttr } from 'helper-js';
import DragEventService from 'drag-event-service';

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

export default index;
export { defaultOptions, initialStore };
