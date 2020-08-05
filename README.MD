# Version 5 is written with Typescript, so you can try read code directly. Follow documentation is for version 4. The documentation for newest version 5 is being written...

# draggable-helper
A js library to simplify your drag and drop functions. Start with a element, it will expose hooks(drag, moving, drop). You can stop drag, moving and drop by conditions. You can set minTranslate. Its code is easy, you can check source code.
## features
* support touch simplify(single touch)
* to prevent page scrolling when touch
* expose hooks(drag, moving, drop)
* prevent drag and moving by return false in hook
* set min translate to trigger drag
* set the style of dragging element
* set the class of dragging element
* move the element or move a cloned one
* check if event is triggered by mouse left button
* to prevent text be selected when dragging
* Advance usage: bind to parent element, make children element as trigger element or moved element. Check example.

## install
```sh
npm install draggable-helper
```
## usage & api
```js
import draggableHelper from 'draggable-helper'
// dragHandlerEl will be added mouse and touch event listener
const {destroy, options} = draggableHelper(HTMLElement dragHandlerEl, Object opt = {})
// opt
// opt will pass to hook, so you can attach custom data into opt, such the data of the element
// startEvent is mousedown or touchstart
opt = {
  // [Object] style, set the style of dragging element
  // getStyle(store, opt), set the style of dragging element
  // [String] draggingClass, default dragging, set the class of dragging element
  // [Boolean] clone, move the element or move a cloned one
  // minTranslate default 10, unit px
  // getEl(dragHandlerEl, store, opt), optional, get the el that will be moved. default is dragHandlerEl
  // afterGetEl(store, opt)
  // [Boolean] triggerBySelf if trigger only by dragHandlerEl self, can not be triggered by children
  // hook, before drag start
  // [Boolean] opt.restoreDOMManuallyOndrop the changed DOM will be restored automatically on drop. This disable it and pass restoreDOM function into store.
  beforeDrag(startEvent, moveEvent, store, opt){
    // when trigger drag, the position must be moved, so there are two event. startEvent also can be accessed by store.startEvent
    // The dragged element at this time has not yet been obtained, store.el is null. 此时要移动的元素还没有获得到, 即store.el是空.
    // return false to prevent drag
  },
  // hook, when drag start
  drag(startEvent, moveEvent, store, opt){
    // when trigger drag, the position must be moved, so there are two event. startEvent also can be accessed by store.startEvent
    // return false to prevent drag
  },
  // hook, when mouse moving
  moving: (moveEvent, store, opt) => {
    // return false to prevent moving
  },
  // hook, when drop
  drop: (endEvent, store, opt) => {
  },
}
// store. life cycle: drag-end
store = {
  el // the moving el
  originalEl // the original moving el, used when clone
  initialMouse
  initialPosition // relative to offsetParent
  mouse
  move
  movedCount // start from 0
  startEvent // mousedown or touchstart event
  endEvent,
  restoreDOM() // function if opt.restoreDOMManuallyOndrop else null
}
```
## Example
### Advance usage: bind to parent element
Advance usage: bind to parent element, make children element as trigger element or moved element.
```js
import draggableHelper from 'draggable-helper'
const {destroy, options} = draggableHelper(document.body, {
  drag(startEvent, moveEvent, store, opt) {
    // check trigger el
    if (startEvent.target not has class 'your trigger class') {
      return false
    }
  },
  // get the element which will be moved
  getEl: (dragHandlerEl, store, opt) => get the el which will be moved by `store.startEvent.target`
})
```
## prevent drag
In follow case, drag event will be prevented.
* Event target element is follow
```js
const IGNORE_TRIGGERS = ['INPUT','TEXTAREA', 'SELECT', 'OPTGROUP', 'OPTION']
```
* Event target has class `undraggable` or its ancestor till dragHandlerEl has.
* opt.beforeDrag or opt.drag return false

## demo
[jsfiddle](https://jsfiddle.net/phphe/t694kpua/19/)
