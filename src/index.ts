import * as hp from 'helper-js'
// TODO
// import DragEventService, {EventPosition, MouseOrTouchEvent,trackMouseOrTouchPosition} from 'drag-event-service'
import DragEventService, {EventPosition, MouseOrTouchEvent,trackMouseOrTouchPosition} from '../../DragEventService'

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
let dragging = false // Whether dragging is in progress. 拖拽是否正在进行中.
export default function (listenerElement: HTMLElement, opt:Options={}) {
  let store: Store
  // set default value of options
  // 设置options的默认值
  objectAssignIfKeyNull(opt, defaultOptions)
  // define the event listener of mousedown and touchstart
  // 定义mousedown和touchstart事件监听器
  const onMousedownOrTouchStart = (e:MouseOrTouchEvent, mouse: EventPosition) => {
    const target = e.target as HTMLElement
    // check if triggered by ignore tags
    // 检查是否由忽略的标签名触发
    if (opt.ingoreTags.includes(target.tagName)) {
      return
    }
    // check if trigger element and its parent has undraggable class name
    // 检查触发事件的元素和其与element之间的父级是否有不允许拖动的类名
    if (hp.hasClass(target, opt.undraggableClassName)) {
      return
    }
    const isParentUndraggable = hp.findParent(target, (el) => {
      if (hp.hasClass(el, opt.undraggableClassName)) {
        return true
      }
      if (el === listenerElement) {
        return 'break'
      }
    })
    if (isParentUndraggable) {
      return
    }
    // Initialize store. Store start event, initial position
    // 初始化store. 存储开始事件, 事件触发坐标
    store = JSON.parse(JSON.stringify(initialStore))
    store.startEvent = e
    store.listenerElement = listenerElement
    store.directTriggerElement = target
    store.initialMouse = {...mouse}
    // get triggerElement
    let triggerElementIsMovedOrClonedElement = false
    if (opt.getTriggerElement) {
      const el = opt.getTriggerElement(store.directTriggerElement, store)
      if (!el) {
        return
      }
      store.triggerElement = el
    } else if (opt.triggerClassName) {
      let triggerElement
      for (const className of hp.toArrayIfNot(opt.triggerClassName)) {
        triggerElement = hp.findParent(store.directTriggerElement, (el) => {
          if (hp.hasClass(el, className)) {
            return true
          }
          if (el === listenerElement) {
            return 'break'
          }
        }, {withSelf: true}) 
        if (triggerElement) {
          break
        }
      }
      if (!triggerElement) {
        return
      }
      store.triggerElement = triggerElement
    } else {
      triggerElementIsMovedOrClonedElement = true
    }
    // get movedOrClonedElement
    store.movedOrClonedElement = opt.getMovedOrClonedElement ? opt.getMovedOrClonedElement(store.directTriggerElement, store, opt) : listenerElement
    if (!store.movedOrClonedElement) {
      return
    }
    if (triggerElementIsMovedOrClonedElement) {
      store.triggerElement = store.movedOrClonedElement
    }
    // check if trigger element is same with directTriggerElement when options.triggerBySelf is true
    // options.triggerBySelf为true时, 检查触发事件的元素是否是允许触发的元素
    if (opt.triggerBySelf && store.triggerElement !== store.directTriggerElement) {
      return
    }
    // prevent text be selected
    // 阻止文字被选中
    if (!DragEventService.isTouch(e)) {
      // Do not prevent when touch. Or the elements within the node can not trigger click event.
      // 不要在触摸时阻止事件. 否则将导致节点内的元素不触发点击事件.
      e.preventDefault()
    }
    // listen mousemove and touchmove
    // 监听mousemove和touchmove
    DragEventService.on(document, 'move', onMousemoveOrTouchMove, {touchArgs: [{passive: false}]})
    // listen mouseup and touchend
    // 监听mouseup和touchend
    DragEventService.on(window, 'end', onMouseupOrTouchEnd)
  }
  // bind mousedown or touchstart event listener
  // 绑定mousedown和touchstart事件监听器
  DragEventService.on(listenerElement, 'start', onMousedownOrTouchStart)

  // define the event listener of mousemove and touchmove
  // 定义mousemove和touchmove事件监听器
  const onMousemoveOrTouchMove = (e: MouseOrTouchEvent, mouse: EventPosition) => {
    const {movedOrClonedElement} = store
    // prevent text be selected
    // 阻止文字被选中
    e.preventDefault()
    // calc move and attach related info to store
    // 计算move并附加相关信息到store
    const move = store.move = {
      x: mouse.x - store.initialMouse.x,
      y: mouse.y - store.initialMouse.y,
    }
    store.moveEvent = e
    store.mouse = mouse
    // first move
    // 第一次移动
    if (store.movedCount === 0) {
      // check if min displacement exceeded.
      // 检查是否达到最小位移
      if (opt.minDisplacement) {
        const x2 = Math.pow(move.x, 2)
        const y2 = Math.pow(move.y, 2)
        const dtc = Math.pow(x2 + y2, 0.5)
        if (dtc < opt.minDisplacement) {
          return
        }
      }
      // resolve elements
      const movedElement = opt.clone ? movedOrClonedElement.cloneNode(true) as HTMLElement : movedOrClonedElement
      const initialPosition = hp.getPosition(movedOrClonedElement)
      // attach elements and initialPosition to store
      // 附加元素和初始位置到store
      store.movedOrClonedElement = movedOrClonedElement
      store.movedElement = movedElement
      store.initialPosition = initialPosition
      // define the function to update moved element style
      // 定义更新移动元素样式的方法
      const updateMovedElementStyle = () => {
        if (opt.clone) {
          store.movedOrClonedElement.parentElement.appendChild(movedElement)
        }
        const size = hp.getBoundingClientRect(movedElement)
        const style = {
          width: `${Math.ceil(size.width)}px`,
          height: `${Math.ceil(size.height)}px`,
          zIndex: 9999,
          opacity: 0.8,
          position: 'absolute',
          left: initialPosition.x + 'px',
          top: initialPosition.y + 'px',
          pointerEvents: 'none',
        }
        hp.backupAttr(movedElement, 'style')
        for (const key in style) {
          movedElement.style[key] = style[key]
        }
        hp.backupAttr(movedElement, 'class')
        hp.addClass(movedElement, opt.draggingClassName)
      }
      store.updateMovedElementStyle = updateMovedElementStyle
      // call hook beforeFirstMove, beforeMove
      if (opt.beforeFirstMove && opt.beforeFirstMove(store, opt) === false) {
        return
      }
      dragging = true
      if (opt.beforeMove && opt.beforeMove(store, opt) === false) {
        return
      }
      // try to update moved element style
      // 尝试更新移动元素样式
      if (!opt.updateMovedElementStyleManually) {
        store.updateMovedElementStyle()
      }
    } 
    // Not the first move
    // 非第一次移动
    else {
      // define the function to update moved element style
      // 定义更新移动元素样式的方法
      const updateMovedElementStyle = () => {
        Object.assign(store.movedElement.style, {
          left: store.initialPosition.x + move.x + 'px',
          top:  store.initialPosition.y + move.y + 'px',
        })
      }
      store.updateMovedElementStyle = updateMovedElementStyle
      // call hook beforeMove
      if (opt.beforeMove && opt.beforeMove(store, opt) === false) {
        return
      }
      // try to update moved element style
      // 尝试更新移动元素样式
      if (!opt.updateMovedElementStyleManually) {
        store.updateMovedElementStyle()
      }
    }
    store.movedCount++
  }

  // define the event listener of mouseup and touchend
  // 定义mouseup和touchend事件监听器
  const onMouseupOrTouchEnd = (e: MouseOrTouchEvent) => {
    dragging = false
    // cancel listening mousemove, touchmove, mouseup, touchend
    // 取消监听事件mousemove, touchmove, mouseup, touchend
    DragEventService.off(document, 'move', onMousemoveOrTouchMove, {touchArgs: [{passive: false}]})
    DragEventService.off(window, 'end', onMouseupOrTouchEnd)
    // 
    if (store.movedCount === 0){
      return
    }
    store.endEvent = e
    const {movedElement} = store
    // define the function to update moved element style
    // 定义更新移动元素样式的方法
    const updateMovedElementStyle = () => {
      hp.restoreAttr(movedElement, 'style')
      hp.restoreAttr(movedElement, 'class')
      if (opt.clone) {
        movedElement.parentElement.removeChild(movedElement)
      }
    }
    store.updateMovedElementStyle = updateMovedElementStyle
    // call hook beforeDrop
    if (opt.beforeDrop && opt.beforeDrop(store, opt) === false) {
      return
    }
    // try to update moved element style
    // 尝试更新移动元素样式
    if (!opt.updateMovedElementStyleManually) {
      updateMovedElementStyle()
    }
    dragging = false
  }

  // define the destroy function
  // 定义销毁/退出的方法
  const destroy = () => {
    DragEventService.off(listenerElement, 'start', onMousedownOrTouchStart)
    DragEventService.on(document, 'move', onMousemoveOrTouchMove, {touchArgs: [{passive: false}]})
    DragEventService.on(window, 'end', onMouseupOrTouchEnd)
  }
  // 
  return {destroy, options: opt} 
}


// available options and default options value
// 可用选项和默认选项值
export const defaultOptions = {
  ingoreTags: ['INPUT','TEXTAREA', 'SELECT', 'OPTGROUP', 'OPTION'],
  undraggableClassName: 'undraggable',
  minDisplacement: 10, // The minimum displacement that triggers the drag. 触发拖动的最小位移.
  draggingClassName: 'dragging', // Be added to the dragged element. 将被添加到被拖动的元素.
  clone: false, // Whether to clone element when drag.
  updateMovedElementStyleManually: false, // If true, you may need to call store.updateMovedElementStyle in beforeFirstMove, beforeMove, beforeDrop
}
export interface Options extends Partial<typeof defaultOptions>{
  triggerClassName?: string|string[] // triggerElement must have the class name.
  triggerBySelf?: boolean // directTriggerElement must be the triggerElement
  getTriggerElement?: (directTriggerElement: HTMLElement, store: Store) => HTMLElement|undefined // get triggerElement by directTriggerElement. override triggerClassName.
  getMovedOrClonedElement?: (directTriggerElement: HTMLElement, store: Store, opt: Options) => HTMLElement
  beforeFirstMove?: (store:Store, opt:Options) => boolean|undefined
  beforeMove?: (store:Store, opt:Options) => boolean|undefined
  beforeDrop?: (store:Store, opt:Options) => boolean|undefined
}
// Info after event triggered. Created when mousedown or touchstart, destroied after mouseup or touchend.
// 事件触发后的相关信息. mousedown或touchstart时创建, mouseup或touchend后销毁.
export const initialStore = {
  movedCount: 0,
}
type InitialStore = typeof initialStore
export interface Store extends InitialStore {
  listenerElement: HTMLElement
  directTriggerElement: HTMLElement // The element triggered event directly. 直接触发事件的元素
  triggerElement: HTMLElement // The element allowed to trigger event. Maybe the parent of directTriggerElement. 允许作为拖拽触发器的元素. 可能是directTriggerElement的父级.
  startEvent: MouseOrTouchEvent
  moveEvent: MouseOrTouchEvent
  endEvent: MouseOrTouchEvent
  mouse: EventPosition, // current event position
  initialMouse: EventPosition
  move: EventPosition2 // Displacement relative to initial position. 相对于初始位置的位移
  movedOrClonedElement: HTMLElement // The element to be moved or cloned.
  movedElement: HTMLElement // The element to be moved.
  initialPosition: EventPosition // The position relative to offsetParent
  updateMovedElementStyle: () => void
}
// Other type
// 其他类型
type EventPosition2 = {x: number, y: number}

/* A mousemove or touchmove event listener generator function. To make specified parent element scroll when drag.
*/
export const defaultOptionsForFixScrollBox = {
  triggerMargin: 50,
  triggerOutterMargin: 30,
  scrollSpeed: 0.3,
}
export type OptionsForFixScrollBox = Partial<typeof defaultOptionsForFixScrollBox>
export const allListeningElementsOfFixScrollBox = new Set()
const trackMouseOrTouchPositionInstance = trackMouseOrTouchPosition({
  onEnd() { trackMouseOrTouchPositionInstance.stop() }
})
export function fixScrollBox(boxElement: HTMLElement, opt: OptionsForFixScrollBox={}) {
  objectAssignIfKeyNull(opt, defaultOptionsForFixScrollBox)
  allListeningElementsOfFixScrollBox.add(boxElement)
  let stopVerticalScroll, stopHorizontalScroll
  const onMove = (e: MouseOrTouchEvent, mouse:EventPosition) => {
    if (!dragging) {
      return
    }
    if (!trackMouseOrTouchPositionInstance.info.started) {
      trackMouseOrTouchPositionInstance.start()
    }
    // stop old scroll animation
    // 结束之前的滚动动画
    if (stopVerticalScroll) {
      stopVerticalScroll()
      stopVerticalScroll = null
    }
    if (stopHorizontalScroll) {
      stopHorizontalScroll()
      stopHorizontalScroll = null
    }
    // box element scroll width or height greater than offset width or height
    // 元素滚动宽高大于offset宽高
    if (boxElement.scrollHeight > boxElement.offsetHeight || boxElement.scrollWidth > boxElement.offsetWidth) {
      const boxPosition = hp.getViewportPosition(boxElement)
      const margin = opt.triggerMargin
      const outterMargin = opt.triggerOutterMargin
      // check if leaved box before every frame of scrollTo
      // 在scrollTo执行每一帧前检查是否已离开box元素
      const beforeEveryFrame = (count:number) => {
        if (count === 0) {
          return
        }
        const currentMousePosition = trackMouseOrTouchPositionInstance.info.position
        // find the box element which mouse hovering
        let foundBoxElement: HTMLElement
        let firstElement: HTMLElement
        for (const itemEl of hp.elementsFromPoint(currentMousePosition.clientX, currentMousePosition.clientY)) {
          if (!firstElement) {
            firstElement = itemEl
          }
          if (allListeningElementsOfFixScrollBox.has(itemEl)) {
            foundBoxElement = itemEl
            break
          }
        }
        // check if the found element is covered by other elements
        if (firstElement !== foundBoxElement && !hp.isDescendantOf(firstElement, foundBoxElement)) {
          foundBoxElement = null
        }
        // 
        if (!foundBoxElement) {
          return false
        }
      }
      // vertical
      if (boxElement.scrollHeight > boxElement.offsetHeight) {
        if (mouse.clientY <= boxPosition.top + margin) {
          stopVerticalScroll = scrollTo({y: 0, element: boxElement, beforeEveryFrame, duration: boxElement.scrollTop / opt.scrollSpeed})
        } else if (mouse.clientY >= boxPosition.top + boxPosition.height - margin) {
          stopVerticalScroll = scrollTo({y: boxElement.scrollHeight, element: boxElement, beforeEveryFrame, duration: (boxElement.scrollHeight - boxElement.offsetHeight - boxElement.scrollTop) / opt.scrollSpeed})
        }
      }
      // horizontal
      if (boxElement.scrollWidth > boxElement.offsetWidth) {
        if (mouse.clientX <= boxPosition.left + margin) {
          stopHorizontalScroll = scrollTo({x: 0, element: boxElement, beforeEveryFrame, duration: boxElement.scrollLeft / opt.scrollSpeed})
        } else if (mouse.clientX >= boxPosition.left + boxPosition.width - margin) {
          stopHorizontalScroll = scrollTo({x: boxElement.scrollWidth, element: boxElement, beforeEveryFrame, duration: (boxElement.scrollWidth - boxElement.offsetWidth - boxElement.scrollLeft) / opt.scrollSpeed})
        }
      }
    }
  }
  DragEventService.on(boxElement, 'move', onMove)
  return {
    options: opt,
    destroy: () => {
      DragEventService.off(boxElement, 'move', onMove)
      allListeningElementsOfFixScrollBox.delete(boxElement)
    }
  }
}

// TODO move to helper-js
function objectAssignIfKeyNull(obj1, obj2) {
  Object.keys(obj2).forEach(key => {
    if (obj1[key] == null) {
      obj1[key] = obj2[key]
    }
  })
}
// from https://gist.github.com/andjosh/6764939
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
    options.element = document.scrollingElement || document.documentElement
  }
  if (options.duration == null) {
    options.duration = 0
  }
  const {x, y, duration, element} = options
  let requestAnimationFrameId
  let count = 0
  const startY = element.scrollTop,
  changeY = y - startY,
  startX = element.scrollLeft,
  changeX = x - startX,
  startDate = + new Date(),
  animateScroll = function() {
    if (options.beforeEveryFrame && options.beforeEveryFrame(count) === false) {
      return
    }
    const currentDate = new Date().getTime()
    const changedTime = currentDate - startDate
    if (y != null) {
      element.scrollTop = parseInt(calc(startY, changeY, changedTime, duration))
    }
    if (x != null) {
      element.scrollLeft = parseInt(calc(startX, changeX, changedTime, duration))
    }
    if(changedTime < duration) {
      requestAnimationFrameId = requestAnimationFrame(animateScroll)
    } else {
      if (y != null) {
        element.scrollTop = y
      }
      if (x != null) {
        element.scrollLeft = x
      }
    }
    count++
  }
  const stop = () => {
    cancelAnimationFrame(requestAnimationFrameId)    
  }
  animateScroll()
  // return stop
  return stop
  function calc(startValue, changeInValue, changedTime, duration) {
    return startValue + changeInValue * (changedTime / duration)
  }
}

function easeInOutQuad(startValue, changeInValue, changedTime, duration) {
  let t = changedTime, d= duration, b = startValue, c = changeInValue
  t /= d/2;
  if (t < 1) return c/2*t*t + b;
  t--;
  return -c/2 * (t*(t-2) - 1) + b;
}