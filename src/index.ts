import * as hp from 'helper-js'
import DragEventService, {EventPosition, MouseOrTouchEvent} from 'drag-event-service'

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
const _edgeScroll = {
  afterFirstMove(store: Store, opt: Options){},
  afterMove(store: Store, opt: Options){},
  afterDrop(store: Store, opt: Options){},
}
export default function (listenerElement: HTMLElement, opt:Options={}) {
  let store: Store
  // set default value of options
  // 设置options的默认值
  hp.objectAssignIfKeyNull(opt, defaultOptions)
  // define the event listener of mousedown and touchstart
  // 定义mousedown和touchstart事件监听器
  const onMousedownOrTouchStart = (e:MouseOrTouchEvent, mouse: EventPosition) => {
    // execute native event hooks
    if (!DragEventService.isTouch(e)) {
      opt.onmousedown && opt.onmousedown(<MouseEvent>e)
    } else {
      opt.ontouchstart && opt.ontouchstart(<TouchEvent>e)
    }
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
          if (hp.hasClass(el, <string>className)) {
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
      if (opt.preventTextSelection) {
        e.preventDefault()
      }
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
    // execute native event hooks
    if (!DragEventService.isTouch(e)) {
      opt.onmousemove && opt.onmousemove(<MouseEvent>e)
    } else {
      opt.ontouchmove && opt.ontouchmove(<TouchEvent>e)
    }
    // 
    const {movedOrClonedElement} = store
    // calc move and attach related info to store
    // 计算move并附加相关信息到store
    const move = store.move = {
      x: mouse.clientX - store.initialMouse.clientX,
      y: mouse.clientY - store.initialMouse.clientY,
    }
    store.moveEvent = e
    store.mouse = mouse
    if (DragEventService.isTouch(e)) {
      // prevent page scroll when touch.
      // 当触摸时阻止屏幕被拖动.
      e.preventDefault()
    } else {
      // prevent text be selected
      // 阻止文字被选中
      if (opt.preventTextSelection) {
        e.preventDefault()
      }
    }
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
      const initialPosition = hp.getViewportPosition(movedOrClonedElement)
      // attach elements and initialPosition to store
      // 附加元素和初始位置到store
      store.movedOrClonedElement = movedOrClonedElement
      store.movedElement = movedElement
      store.initialPositionRelativeToViewport = initialPosition
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
          position: 'fixed',
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
        /*
        check if the changed position is expected and correct it. about stacking context.
        当某父元素使用了transform属性时, fixed不再以窗口左上角为坐标. 以下功能是在第一次移动后, 检查元素实际位置和期望位置是否相同, 不同则说明坐标系不是期望的. 则把初始位置减去偏移, 无论任何父元素导致了层叠上下文问题, 都能正确显示.
        */
        const nowPosition = hp.getViewportPosition(movedElement)
        if (nowPosition.x !== initialPosition.x) {
          initialPosition.x = initialPosition.x - (nowPosition.x - initialPosition.x)
          initialPosition.y = initialPosition.y - (nowPosition.y - initialPosition.y)
          movedElement.style.left = initialPosition.x + 'px'
          movedElement.style.top = initialPosition.y + 'px'
        }
      }
      store.updateMovedElementStyle = updateMovedElementStyle
      // call hook beforeFirstMove, beforeMove
      if (opt.beforeFirstMove && opt.beforeFirstMove(store, opt) === false) {
        return
      }
      if (opt.beforeMove && opt.beforeMove(store, opt) === false) {
        return
      }
      // try to update moved element style
      // 尝试更新移动元素样式
      if (!opt.updateMovedElementStyleManually) {
        store.updateMovedElementStyle()
      }
      _edgeScroll.afterFirstMove(store, opt)
      opt.afterFirstMove && opt.afterFirstMove(store, opt)
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
    _edgeScroll.afterMove(store, opt)
    store.movedCount++
    opt.afterMove && opt.afterMove(store, opt)
  }

  // define the event listener of mouseup and touchend
  // 定义mouseup和touchend事件监听器
  const onMouseupOrTouchEnd = (e: MouseOrTouchEvent) => {
    // execute native event hooks
    if (!DragEventService.isTouch(e)) {
      opt.onmousedown && opt.onmousedown(<MouseEvent>e)
    } else {
      opt.ontouchend && opt.ontouchend(<TouchEvent>e)
    }
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
    _edgeScroll.afterDrop(store, opt)
    opt.afterDrop && opt.afterDrop(store, opt)
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
  preventTextSelection: true,
  edgeScrollTriggerMargin: 50,
  edgeScrollSpeed: 0.35,
  edgeScrollTriggerMode: 'top_left_corner',
}
export interface Options extends Partial<typeof defaultOptions>{
  triggerClassName?: string|string[] // triggerElement must have the class name.
  triggerBySelf?: boolean // directTriggerElement must be the triggerElement
  getTriggerElement?: (directTriggerElement: HTMLElement, store: Store) => HTMLElement|undefined // get triggerElement by directTriggerElement. override triggerClassName.
  getMovedOrClonedElement?: (directTriggerElement: HTMLElement, store: Store, opt: Options) => HTMLElement
  beforeFirstMove?: (store:Store, opt:Options) => boolean|undefined
  afterFirstMove?: (store:Store, opt:Options) => void
  beforeMove?: (store:Store, opt:Options) => boolean|undefined
  afterMove?: (store:Store, opt:Options) => void
  beforeDrop?: (store:Store, opt:Options) => boolean|undefined
  afterDrop?: (store:Store, opt:Options) => void
  preventTextSelection?: boolean
  // edge scroll
  edgeScroll?: boolean
  edgeScrollTriggerMargin?: number
  edgeScrollSpeed?: number
  edgeScrollTriggerMode?: 'top_left_corner'|'mouse'
  edgeScrollSpecifiedContainerX?: HTMLElement|((store:Store, opt:Options) => HTMLElement)
  edgeScrollSpecifiedContainerY?: HTMLElement|((store:Store, opt:Options) => HTMLElement)
  // native event hooks
  onmousedown?: (e: MouseEvent) => void
  onmousemove?: (e: MouseEvent) => void
  onmouseup?: (e: MouseEvent) => void
  ontouchstart?: (e: TouchEvent) => void
  ontouchmove?: (e: TouchEvent) => void
  ontouchend?: (e: TouchEvent) => void
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
  move: EventPosition2 // Moved displacement relative to viewport. 相对于视窗的位移
  movedOrClonedElement: HTMLElement // The element to be moved or cloned.
  movedElement: HTMLElement // The element to be moved.
  initialPosition: EventPosition2 // fixed position. The position relative to viewport by default. Relative to stacking context. Sometimes stacking context is not html, for example a parent with css 'transform' defined.
  initialPositionRelativeToViewport: EventPosition2 // fixed position. The position relative to viewport
  updateMovedElementStyle: () => void
}
// Other type
// 其他类型
type EventPosition2 = {x: number, y: number}

// edge scroll
// 边缘滚动
let stopHorizontalScroll, stopVerticalScroll
_edgeScroll.afterMove = (store: Store, opt: Options) => {
  if (!opt.edgeScroll) {
    return
  }
  const margin = opt.edgeScrollTriggerMargin
  stopOldScrollAnimation()
  // get triggerPoint. The point trigger edge scroll.
  let triggerPoint = {x: store.mouse.clientX, y: store.mouse.clientY}
  if (opt.edgeScrollTriggerMode === 'top_left_corner') {
    const vp = hp.getViewportPosition(store.movedElement)
    triggerPoint = {x: vp.x, y: vp.y}
  }
  // 
  let foundHorizontal: HTMLElement, foundVertical: HTMLElement, prevElement: HTMLElement, horizontalDir:'left'|'right',verticalDir:'up'|'down'
  let findInElements: HTMLElement[]
  let cachedElementsFromPoint: HTMLElement[]
  // find x container
  const minScrollableDisplacement = 10
  if (opt.edgeScrollSpecifiedContainerX) {
    let containerX
    if (typeof opt.edgeScrollSpecifiedContainerX === 'function') {
      containerX = opt.edgeScrollSpecifiedContainerX(store, opt)
    } else {
      containerX = opt.edgeScrollSpecifiedContainerX
    }
    findInElements = [containerX]
  } else {
    findInElements = hp.elementsFromPoint(triggerPoint.x, triggerPoint.y) as HTMLElement[]
    cachedElementsFromPoint = findInElements
  }
  for (const itemEl of findInElements) {
    if (prevElement && !hp.isDescendantOf(prevElement, itemEl)) {
      // itemEl is being covered by other elements
      // itemEl被其他元素遮挡
      continue
    }
    const t = minScrollableDisplacement // min scrollable displacement. 最小可滚动距离, 小于此距离不触发滚动.
    if (!foundHorizontal) {
      if (itemEl.scrollWidth > itemEl.clientWidth) {
        const vp = fixedGetViewportPosition(itemEl)
        if (triggerPoint.x <= vp.left + margin) {
          if (scrollableDisplacement(itemEl, 'left') > t && isScrollable(itemEl, 'x')) {
            foundHorizontal = itemEl
            horizontalDir = 'left'
          }
        } else if (triggerPoint.x >= vp.left + itemEl.clientWidth - margin) {
          if (scrollableDisplacement(itemEl, 'right') > t && isScrollable(itemEl, 'x')) {
            foundHorizontal = itemEl
            horizontalDir = 'right'
          }
        }
      }
    }
    if (foundHorizontal) {
      break
    }
    prevElement = itemEl
  }
  prevElement = null
  // find y container
  if (opt.edgeScrollSpecifiedContainerY) {
    let containerY
    if (typeof opt.edgeScrollSpecifiedContainerY === 'function') {
      containerY = opt.edgeScrollSpecifiedContainerY(store, opt)
    } else {
      containerY = opt.edgeScrollSpecifiedContainerY
    }
    findInElements = [containerY]
  } else {
    findInElements = cachedElementsFromPoint || hp.elementsFromPoint(triggerPoint.x, triggerPoint.y) as HTMLElement[]
  }
  for (const itemEl of findInElements) {
    if (prevElement && !hp.isDescendantOf(prevElement, itemEl)) {
      // itemEl is being covered by other elements
      // itemEl被其他元素遮挡
      continue
    }
    const t = minScrollableDisplacement // min scrollable displacement. 最小可滚动距离, 小于此距离不触发滚动.
    if (!foundVertical) {
      if (itemEl.scrollHeight > itemEl.clientHeight) {
        const vp = fixedGetViewportPosition(itemEl)
        if (triggerPoint.y <= vp.top + margin) {
          if (scrollableDisplacement(itemEl, 'up') > t && isScrollable(itemEl, 'y')) {
            foundVertical = itemEl
            verticalDir = 'up'
          }
        } else if (triggerPoint.y >= vp.top + itemEl.clientHeight - margin) {
          if (scrollableDisplacement(itemEl, 'down') > t && isScrollable(itemEl, 'y')) {
            foundVertical = itemEl
            verticalDir = 'down'
          }
        }
      }
    }
    if (foundVertical) {
      break
    }
    prevElement = itemEl
  }
  // scroll
  if (foundHorizontal) {
    if (horizontalDir === 'left') {
      stopHorizontalScroll = hp.scrollTo({x: 0, element: foundHorizontal, duration: scrollableDisplacement(foundHorizontal, 'left') / opt.edgeScrollSpeed})
    } else {
      stopHorizontalScroll = hp.scrollTo({x: foundHorizontal.scrollWidth - foundHorizontal.clientWidth, element: foundHorizontal, duration: scrollableDisplacement(foundHorizontal, 'right') / opt.edgeScrollSpeed})
    }
  }
  if (foundVertical) {
    if (verticalDir === 'up') {
      stopVerticalScroll = hp.scrollTo({y: 0, element: foundVertical, duration: scrollableDisplacement(foundVertical, 'up') / opt.edgeScrollSpeed})
    } else {
      stopVerticalScroll = hp.scrollTo({y: foundVertical.scrollHeight - foundVertical.clientHeight, element: foundVertical, duration: scrollableDisplacement(foundVertical, 'down') / opt.edgeScrollSpeed})
    }
  }
  // is element scrollable in a direction
  // 元素某方向是否可滚动
  function isScrollable(el:HTMLElement, dir:'x'|'y') {
    const style = getComputedStyle(el)
    const key = `overflow-${dir}`
    // document.documentElement is special
    const special = document.scrollingElement || document.documentElement
    if (el === special) {
      return style[key] === 'visible' || style[key] === 'auto' || style[key] === 'scroll'
    }
    return style[key] === 'auto' || style[key] === 'scroll'
  }
  // scrollable displacement of element  in a direction
  // 元素某方向可滚动距离
  function scrollableDisplacement(el:HTMLElement, dir: 'up'|'down'|'left'|'right') {
    if (dir === 'up') {
      return el.scrollTop
    } else if (dir === 'down') {
      return el.scrollHeight - el.scrollTop - el.clientHeight
    } else if (dir === 'left') {
      return el.scrollLeft
    } else if (dir === 'right') {
      return el.scrollWidth - el.scrollLeft - el.clientWidth
    }
  }
  function fixedGetViewportPosition(el: HTMLElement) {
    const r = hp.getViewportPosition(el)
    // document.documentElement is special
    const special = document.scrollingElement || document.documentElement
    if (el === special) {
      r.top = 0
      r.left = 0
    }
    return r
  }
}
_edgeScroll.afterDrop = (store: Store, opt: Options) => {
  if (!opt.edgeScroll) {
    return
  }
  stopOldScrollAnimation()
}

// stop old scroll animation
// 结束之前的滚动动画
function stopOldScrollAnimation() {
  if (stopHorizontalScroll) {
    stopHorizontalScroll()
    stopHorizontalScroll = null
  }
  if (stopVerticalScroll) {
    stopVerticalScroll()
    stopVerticalScroll = null
  }
}

