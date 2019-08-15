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
const destroy = draggableHelper(HTMLElement dragHandlerEl, Object opt = {})
// opt
// opt will pass to hook, so you can attach custom data into opt, such the data of the element
// startEvent is mousedown or touchstart
opt = {
  // [Object] style, set the style of dragging element
  // getStyle(opt, store), set the style of dragging element
  // [String] draggingClass, default dragging, set the class of dragging element
  // [Boolean] clone, move the element or move a cloned one
  // minTranslate default 10, unit px
  // getEl(dragHandlerEl, opt, store), optional, get the el that will be moved. default is dragHandlerEl
  // afterGetEl(opt, store)
  // [Boolean] triggerBySelf if trigger only by dragHandlerEl self, can not be triggered by children
  // hook, when drag start
  drag(startEvent, moveEvent, opt, store){
    // when trigger drag, the position must be moved, so there are two event. startEvent also can be accessed by store.startEvent
    // return false to prevent drag
  },
  // hook, when mouse moving
  moving: (moveEvent, opt, store) => {
    // return false to prevent moving
  },
  // hook, when drop
  drop: (endEvent, opt, store) => {
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
}
```
## Example
### Advance usage: bind to parent element
Advance usage: bind to parent element, make children element as trigger element or moved element.
```js
import draggableHelper from 'draggable-helper'
const destroy = draggableHelper(document.body, {
  drag(startEvent, moveEvent, opt, store) {
    // check trigger el
    if (startEvent.target not has class 'your trigger class') {
      return false
    }
  },
  // get the element which will be moved
  getEl: (dragHandlerEl, opt, store) => get the el which will be moved by `store.startEvent.target`
})
```
## prevent drag
In follow case, drag event will be prevented.
* Event target element is follow
```js
const IGNORE_TRIGGERS = ['INPUT','TEXTAREA', 'SELECT', 'OPTGROUP', 'OPTION']
```
* Event target has class `undraggable` or its ancestor till dragHandlerEl has.
* opt.drag return false

## demo
[jsfiddle](https://jsfiddle.net/phphe/t694kpua/19/)
