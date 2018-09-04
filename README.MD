# draggable-helper
A js library to simplify your drag and drop functions. Start with a element, it will expose hooks(drag, moving, drop). You can stop drag, moving and drop by conditions. You can set minTranslate. Its code is easy, you can check source code.
# features
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
# install
```sh
npm install draggable-helper
```
# usage & api
```js
import draggableHelper from 'draggable-helper'
const destroy = draggableHelper(HTMLElement dragHandlerEl, Object opt = {})
// opt
// opt will pass to hook, so you can attach custom data into opt, such the data of the element
opt = {
    // [Object] style, set the style of dragging element
    // getStyle(opt), set the style of dragging element
    // [String] draggingClass, default dragging, set the class of dragging element
    // [Boolean] clone, move the element or move a cloned one
    // minTranslate default 10, unit px
    // getEl(dragHandlerEl, opt), optional, get the el that will be moved. default is dragHandlerEl
    // hook, when drag start
    drag(event, opt, store){
      // return false to prevent drag
    },
    // hook, when mouse moving
    moving: (e, opt, store) => {
      // return false to prevent moving
    },
    // hook, when drop
    drop: (e, opt, store) => {
    },
}
// store
store = {
  el
  initialMouse
  initialOffset
  mouse
  move
  movedCount // start from 0
}
```
# demo
[jsfiddle](https://jsfiddle.net/phphe/t694kpua/19/)
