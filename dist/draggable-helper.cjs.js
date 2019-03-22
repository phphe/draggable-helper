/*!
 * draggable-helper v1.0.20
 * (c) 2018-present phphe <phphe@outlook.com> (https://github.com/phphe)
 * Released under the MIT License.
 */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var hp = require('helper-js');
var DragEventService = _interopDefault(require('drag-event-service'));

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
add other prop into opt, you get opt in callback
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

function index (dragHandlerEl) {
  var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (opt.minTranslate == null) {
    opt.minTranslate = 10;
  }

  var store = getPureStore();

  var destroy = function destroy() {
    DragEventService.off(dragHandlerEl, 'end', dragHandlerEl._draggbleEventHandler);
    hp.offDOM(dragHandlerEl, 'selectstart', preventSelect);
    delete dragHandlerEl._draggbleEventHandler;
  };

  if (dragHandlerEl._draggbleEventHandler) {
    destroy();
  }

  dragHandlerEl._draggbleEventHandler = start;
  DragEventService.on(dragHandlerEl, 'start', dragHandlerEl._draggbleEventHandler);
  hp.onDOM(dragHandlerEl, 'selectstart', preventSelect);
  return destroy;

  function start(e, mouse) {
    // e.stopPropagation()
    store.mouse = {
      x: mouse.x,
      y: mouse.y
    };
    store.initialMouse = Object.assign({}, store.mouse);
    DragEventService.on(document, 'move', moving, {
      passive: false
    }); // passive: false is for touchmove event

    DragEventService.on(window, 'end', drop);
  }

  function drag(e) {
    var _resolveDragedElAndIn = resolveDragedElAndInitialPosition(),
        el = _resolveDragedElAndIn.el,
        position = _resolveDragedElAndIn.position;

    store.el = el;
    store.initialPosition = Object.assign({}, position);
    var r = opt.drag && opt.drag(e, opt, store);

    if (r === false) {
      return false;
    } // dom actions


    var size = hp.getElSize(el);
    var style = Object.assign({
      width: "".concat(size.width, "px"),
      height: "".concat(size.height, "px"),
      zIndex: 9999,
      opacity: 0.6,
      position: 'absolute',
      left: position.x + 'px',
      top: position.y + 'px'
    }, opt.style || opt.getStyle && opt.getStyle(opt) || {});
    hp.backupAttr(el, 'style');

    for (var key in style) {
      el.style[key] = style[key];
    } // add class


    hp.backupAttr(el, 'class');
    hp.addClass(el, opt.draggingClass);
  }

  function moving(e, mouse) {
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
    // e.preventDefault() to prevent text selection and page scrolling when touch


    e.preventDefault();

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
    DragEventService.off(document, 'move', moving, {
      passive: false
    });
    DragEventService.off(window, 'end', drop); // drag executed if movedCount > 0

    if (store.movedCount > 0) {
      store.movedCount = 0;
      var _store = store,
          el = _store.el;

      if (opt.clone) {
        el.parentElement.removeChild(el);
      } else {
        hp.restoreAttr(el, 'style');
        hp.restoreAttr(el, 'class');
      }

      opt.drop && opt.drop(e, opt, store);
    }

    store = getPureStore();
  }

  function resolveDragedElAndInitialPosition() {
    var el0 = opt.getEl ? opt.getEl(dragHandlerEl, opt) : dragHandlerEl;
    var el = el0;

    if (opt.clone) {
      store.triggerEl = el0;
      el = el0.cloneNode(true);
      el0.parentElement.appendChild(el);
    }

    return {
      position: hp.getPosition(el),
      el: el
    };
  }

  function getPureStore() {
    return {
      movedCount: 0
    };
  }

  function preventSelect(e) {
    e.preventDefault();
  }
}

module.exports = index;
