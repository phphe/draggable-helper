import { EventPosition, MouseOrTouchEvent } from '../../DragEventService';
export default function (listenerElement: HTMLElement, opt?: Options): {
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
};
export interface Options extends Partial<typeof defaultOptions> {
    triggerClassName?: string | string[];
    triggerBySelf?: boolean;
    getTriggerElement?: (directTriggerElement: HTMLElement, store: Store) => HTMLElement | undefined;
    getMovedOrClonedElement?: (directTriggerElement: HTMLElement, store: Store, opt: Options) => HTMLElement;
    beforeFirstMove?: (store: Store, opt: Options) => boolean | undefined;
    beforeMove?: (store: Store, opt: Options) => boolean | undefined;
    beforeDrop?: (store: Store, opt: Options) => boolean | undefined;
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
    initialPosition: EventPosition;
    updateMovedElementStyle: () => void;
}
declare type EventPosition2 = {
    x: number;
    y: number;
};
export declare const defaultOptionsForFixScrollBox: {
    triggerMargin: number;
    triggerOutterMargin: number;
    scrollSpeed: number;
};
export declare type OptionsForFixScrollBox = Partial<typeof defaultOptionsForFixScrollBox>;
export declare const allListeningElementsOfFixScrollBox: Set<unknown>;
export declare function fixScrollBox(boxElement: HTMLElement, opt?: OptionsForFixScrollBox): {
    options: Partial<{
        triggerMargin: number;
        triggerOutterMargin: number;
        scrollSpeed: number;
    }>;
    destroy: () => void;
};
export {};
