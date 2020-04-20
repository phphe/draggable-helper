/*!
 * draggable-helper v4.0.3
 * (c) phphe <phphe@outlook.com> (https://github.com/phphe)
 * Homepage: undefined
 * Released under the MIT License.
 */
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import { hasClass, findParent, getPosition, getBoundingClientRect, backupAttr, addClass, restoreAttr } from 'helper-js';
import DragEventService from 'drag-event-service';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/***
const destroy = draggableHelper(HTMLElement dragHandlerEl, Object opt = {})
opt.beforeDrag(startEvent, moveEvent, store, opt) return false to prevent drag
opt.drag(startEvent, moveEvent, store, opt) return false to prevent drag
[Object] opt.style || opt.getStyle(store, opt) set style of moving el style
[Boolean] opt.clone
opt.draggingClass, default dragging
opt.moving(e, store, opt) return false can prevent moving
opt.drop(e, store, opt)
opt.getEl(dragHandlerEl, store, opt) get the el that will be moved. default is dragHandlerEl
opt.minTranslate default 10, unit px
[Boolean] opt.triggerBySelf: false if trigger only by self, can not be triggered by children
[Boolean] opt.restoreDOMManuallyOndrop the changed DOM will be restored automatically on drop. This disable it and pass restoreDOM function into store.

add other prop into opt, you can get opt in callback
store{
  el
  originalEl
  initialMouse
  initialPosition
  mouse
  move
  movedCount // start from 0
  startEvent
  endEvent
  restoreDOM // function if opt.restoreDOMManuallyOndrop else null
}
e.g.
draggable(this.$el, {
  vm: this,
  data: this.data,
  drag: (e, store, opt) => {
    dplh.style.height = store.el.querySelector('.TreeNodeSelf').offsetHeight + 'px'
    th.insertAfter(dplh, opt.data)
  },
  moving: (e, store, opt) => {
    hp.arrayRemove(dplh.parent.children, dplh)
  },
  drop: (e, store, opt) => {
    hp.arrayRemove(dplh.parent.children, dplh)
  },
})
***/

var IGNORE_TRIGGERS = ['INPUT', 'TEXTAREA', 'SELECT', 'OPTGROUP', 'OPTION'];
var UNDRAGGABLE_CLASS = 'undraggable';
function index (dragHandlerEl) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  opt = _objectSpread({
    minTranslate: 10,
    draggingClass: 'dragging'
  }, opt);
  var store = getPureStore();

  var destroy = function destroy() {
    DragEventService.off(dragHandlerEl, 'start', dragHandlerEl._draggbleEventHandler);
    delete dragHandlerEl._draggbleEventHandler;
  };

  if (dragHandlerEl._draggbleEventHandler) {
    destroy();
  }

  dragHandlerEl._draggbleEventHandler = start;
  DragEventService.on(dragHandlerEl, 'start', start);
  return {
    destroy: destroy,
    options: opt
  };

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


    if (!DragEventService.isTouch(e)) {
      // Do not prevent event now and when the client is mobile. Doing so will result in elements within the node not triggering click event.
      // 不要在此时, 客户端为移动端时阻止事件. 否则将导致节点内的元素不触发点击事件.
      e.preventDefault();
    }

    store.mouse = {
      x: mouse.x,
      y: mouse.y
    };
    store.startEvent = e;
    store.initialMouse = _objectSpread({}, store.mouse);
    /*
    must set passive false for touch, else the follow error occurs in Chrome:
    Unable to preventDefault inside passive event listener due to target being treated as passive. See https://www.chromestatus.com/features/5093566007214080
     */

    DragEventService.on(document, 'move', moving, {
      touchArgs: [{
        passive: false
      }]
    });
    DragEventService.on(window, 'end', drop);
  }

  function drag(e) {
    var canDrag = opt.beforeDrag && opt.beforeDrag(store.startEvent, e, store, opt);

    if (canDrag === false) {
      return false;
    }

    var _resolveDragedElAndIn = resolveDragedElAndInitialPosition(),
        el = _resolveDragedElAndIn.el,
        position = _resolveDragedElAndIn.position;

    store.el = el;
    store.initialPosition = _objectSpread({}, position);
    canDrag = opt.drag && opt.drag(store.startEvent, e, store, opt);

    if (canDrag === false) {
      return false;
    } // dom actions


    var size = getBoundingClientRect(el);

    var style = _objectSpread({
      width: "".concat(Math.ceil(size.width), "px"),
      height: "".concat(Math.ceil(size.height), "px"),
      zIndex: 9999,
      opacity: 0.8,
      position: 'absolute',
      left: position.x + 'px',
      top: position.y + 'px'
    }, opt.style || opt.getStyle && opt.getStyle(store, opt) || {});

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
      if (opt.moving(e, store, opt) === false) {
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
    DragEventService.off(document, 'move', moving, {
      touchArgs: [{
        passive: false
      }]
    });
    DragEventService.off(window, 'end', drop); // drag executed if movedCount > 0

    if (store.movedCount > 0) {
      store.movedCount = 0;
      store.endEvent = e;
      var _store = store,
          el = _store.el;

      var restoreDOM = function restoreDOM() {
        if (opt.clone) {
          el.parentElement.removeChild(el);
        } else {
          restoreAttr(el, 'style');
          restoreAttr(el, 'class');
        }
      };

      if (!opt.restoreDOMManuallyOndrop) {
        restoreDOM();
        restoreDOM = null;
      }

      store.restoreDOM = restoreDOM;
      opt.drop && opt.drop(e, store, opt);
    }

    store = getPureStore();
  }

  function resolveDragedElAndInitialPosition() {
    var el0 = opt.getEl ? opt.getEl(dragHandlerEl, store, opt) : dragHandlerEl;
    var el = el0;
    store.originalEl = el0;

    if (opt.clone) {
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

export default index;
