# draggable-helper

A js library to simplify your drag and drop functions. Start with a element, it will expose hooks(drag, moving, drop). You can stop drag, moving and drop by conditions. You can set minTranslate. It uses Typescript.

## features

- support touch simplify(single touch)
- to prevent page scrolling when touch
- expose hooks(drag, moving, drop)
- prevent drag and moving by return false in hook
- set min translate to trigger drag
- set the style of dragging element
- set the class of dragging element
- move the element or move a cloned one
- check if event is triggered by mouse left button
- to prevent text be selected when dragging
- Advance usage: bind to parent element, make children element as trigger element or moved element. Check example.
- Edge scroll. Auto scroll when drag to edge of another scrollable element.

## install

```sh
npm install draggable-helper
```

## usage & api

```js
import draggableHelper from 'draggable-helper'
// dragHandlerEl will be added mouse and touch event listener
const {destroy, options} = draggableHelper(HTMLElement dragHandlerEl, Object opt = {})

```

## types

```ts
import { EventPosition, MouseOrTouchEvent } from "drag-event-service";
export default function (
  listenerElement: HTMLElement,
  opt?: Options
): {
  destroy: () => void;
  options: Options;
};
export declare const defaultOptions: {
  ingoreTags: string[];
  undraggableClassName: string;
  minDisplacement: number;
  draggingClassName: string;
  clone: boolean;
  updateMovedElementStyleManually: boolean;
  preventTextSelection: boolean;
  edgeScrollTriggerMargin: number;
  edgeScrollSpeed: number;
  edgeScrollTriggerMode: string;
};
export interface Options extends Partial<typeof defaultOptions> {
  triggerClassName?: string | string[];
  triggerBySelf?: boolean;
  getTriggerElement?: (
    directTriggerElement: HTMLElement,
    store: Store
  ) => HTMLElement | undefined;
  getMovedOrClonedElement?: (
    directTriggerElement: HTMLElement,
    store: Store,
    opt: Options
  ) => HTMLElement;
  beforeFirstMove?: (store: Store, opt: Options) => boolean | undefined;
  afterFirstMove?: (store: Store, opt: Options) => void;
  beforeMove?: (store: Store, opt: Options) => boolean | undefined;
  afterMove?: (store: Store, opt: Options) => void;
  beforeDrop?: (store: Store, opt: Options) => boolean | undefined;
  afterDrop?: (store: Store, opt: Options) => void;
  preventTextSelection?: boolean;
  edgeScroll?: boolean;
  edgeScrollTriggerMargin?: number;
  edgeScrollSpeed?: number;
  edgeScrollTriggerMode?: "top_left_corner" | "mouse";
  edgeScrollSpecifiedContainerX?:
    | HTMLElement
    | ((store: Store, opt: Options) => HTMLElement);
  edgeScrollSpecifiedContainerY?:
    | HTMLElement
    | ((store: Store, opt: Options) => HTMLElement);
  onmousedown?: (e: MouseEvent) => void;
  onmousemove?: (e: MouseEvent) => void;
  onmouseup?: (e: MouseEvent) => void;
  ontouchstart?: (e: TouchEvent) => void;
  ontouchmove?: (e: TouchEvent) => void;
  ontouchend?: (e: TouchEvent) => void;
  onClone?: (store: Store, opt: Options) => boolean;
}
export declare const initialStore: {
  movedCount: number;
};
declare type InitialStore = typeof initialStore;
export interface Store extends InitialStore {
  listenerElement: HTMLElement;
  directTriggerElement: HTMLElement;
  triggerElement: HTMLElement;
  startEvent: MouseOrTouchEvent;
  moveEvent: MouseOrTouchEvent;
  endEvent: MouseOrTouchEvent;
  mouse: EventPosition;
  initialMouse: EventPosition;
  move: EventPosition2;
  movedOrClonedElement: HTMLElement;
  movedElement: HTMLElement;
  initialPosition: EventPosition2;
  initialPositionRelativeToViewport: EventPosition2;
  updateMovedElementStyle: () => void;
  _isMovingElementCloned: boolean;
}
declare type EventPosition2 = {
  x: number;
  y: number;
};
export {};
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

- Event target element is follow

```js
const IGNORE_TRIGGERS = ["INPUT", "TEXTAREA", "SELECT", "OPTGROUP", "OPTION"];
```

- Event target has class `undraggable` or its ancestor till dragHandlerEl has.
- opt.beforeDrag or opt.drag return false
