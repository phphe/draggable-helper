import * as hp from 'helper-js'
import DragEventService from 'drag-event-service'

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
const IGNORE_TRIGGERS = ['INPUT','TEXTAREA', 'SELECT', 'OPTGROUP', 'OPTION']
const UNDRAGGABLE_CLASS = 'undraggable'

export default function (dragHandlerEl, opt = {}) {
  opt = {
    minTranslate: 10,
    draggingClass: 'dragging',
    ...opt,
  }
  let store = getPureStore()
  const destroy = () => {
    DragEventService.off(dragHandlerEl, 'start', dragHandlerEl._draggbleEventHandler)
    delete dragHandlerEl._draggbleEventHandler
  }
  if (dragHandlerEl._draggbleEventHandler) {
    destroy()
  }
  dragHandlerEl._draggbleEventHandler = start
  DragEventService.on(dragHandlerEl, 'start', start)
  return {destroy, options: opt}
  function start(e, mouse) {
    // detect draggable =================================
    if (opt.triggerBySelf && e.target !== dragHandlerEl) {
      return
    }
    if (IGNORE_TRIGGERS.includes(e.target.tagName)) {
      return
    }
    if (hp.hasClass(e.target, UNDRAGGABLE_CLASS)) {
      return
    }
    const isParentUndraggable = hp.findParent(e.target, (el) => {
      if (hp.hasClass(el, UNDRAGGABLE_CLASS)) {
        return true
      }
      if (el === dragHandlerEl) {
        return 'break'
      }
    })
    if (isParentUndraggable) {
      return
    }
    // detect draggable end =================================
    e.preventDefault()
    store.mouse = {
      x: mouse.x,
      y: mouse.y,
    }
    store.startEvent = e
    store.initialMouse = {...store.mouse}
    /*
    must set passive false for touch, else the follow error occurs in Chrome:
    Unable to preventDefault inside passive event listener due to target being treated as passive. See https://www.chromestatus.com/features/5093566007214080
     */
    DragEventService.on(document, 'move', moving, {touchArgs: [{passive: false}]})
    DragEventService.on(window, 'end', drop)
  }
  function drag(e) {
    let canDrag = opt.beforeDrag && opt.beforeDrag(store.startEvent, e, store, opt)
    if (canDrag === false) {
      return false
    }
    const {el, position} = resolveDragedElAndInitialPosition()
    store.el = el
    store.initialPosition = {...position}
    canDrag = opt.drag && opt.drag(store.startEvent, e, store, opt)
    if (canDrag === false) {
      return false
    }
    // dom actions
    const size = hp.getBoundingClientRect(el)
    const style = {
      width: `${Math.ceil(size.width)}px`,
      height: `${Math.ceil(size.height)}px`,
      zIndex: 9999,
      opacity: 0.8,
      position: 'absolute',
      left: position.x + 'px',
      top: position.y + 'px',
      ...(opt.style || opt.getStyle && opt.getStyle(store, opt) || {}),
    }
    hp.backupAttr(el, 'style')
    for (const key in style) {
      el.style[key] = style[key]
    }
    // add class
    hp.backupAttr(el, 'class')
    hp.addClass(el, opt.draggingClass)
  }
  function moving(e, mouse) {
    e.preventDefault()
    store.mouse = {
      x: mouse.x,
      y: mouse.y,
    }
    const move = store.move = {
      x: store.mouse.x - store.initialMouse.x,
      y: store.mouse.y - store.initialMouse.y,
    }
    if (store.movedCount === 0 && opt.minTranslate) {
      const x2 = Math.pow(store.move.x, 2)
      const y2 = Math.pow(store.move.y, 2)
      const dtc = Math.pow(x2 + y2, 0.5)
      if (dtc < opt.minTranslate) {
        return
      }
    }
    let canMove = true
    if (store.movedCount === 0) {
      if (drag(e) === false) {
        canMove = false
      }
    }
    // move started
    if (canMove && opt.moving) {
      if (opt.moving(e, store, opt) === false) {
        canMove = false
      }
    }
    if (canMove) {
      if (!store || !store.el) {
        return
      }
      Object.assign(store.el.style, {
        left: store.initialPosition.x + move.x + 'px',
        top:  store.initialPosition.y + move.y + 'px',
      })
      store.movedCount++
    }
  }
  function drop(e) {
    DragEventService.off(document, 'move', moving, {touchArgs: [{passive: false}]})
    DragEventService.off(window, 'end', drop)
    // drag executed if movedCount > 0
    if (store.movedCount > 0) {
      store.movedCount = 0
      store.endEvent = e
      const {el} = store
      let restoreDOM = () => {
        if (opt.clone) {
          el.parentElement.removeChild(el)
        } else {
          hp.restoreAttr(el, 'style')
          hp.restoreAttr(el, 'class')
        }
      }
      if (!opt.restoreDOMManuallyOndrop) {
        restoreDOM()
        restoreDOM = null
      }
      store.restoreDOM = restoreDOM
      opt.drop && opt.drop(e, store, opt)
    }
    store = getPureStore()
  }
  function resolveDragedElAndInitialPosition() {
    const el0 = opt.getEl ? opt.getEl(dragHandlerEl, store, opt) : dragHandlerEl
    let el = el0
    store.originalEl = el0
    if (opt.clone) {
      el = el0.cloneNode(true)
      el0.parentElement.appendChild(el)
    }
    return {
      position: hp.getPosition(el0),
      el,
    }
  }
  function getPureStore() {
    return {movedCount: 0}
  }
}
