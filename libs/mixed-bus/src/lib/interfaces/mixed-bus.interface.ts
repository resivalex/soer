export type BusEmitter<T = {[key: string]: any}> = {sid: symbol, schema: T};

export const ANY_SERVICE: BusEmitter = {sid: Symbol('AnyService'), schema: {}};

/**
 *  EVENTS
 *  события используются для информирования о состоянии команды в начале,
 *  середине и конце выполнения
 */
export class BusEvent {
    constructor(public owner: BusEmitter = ANY_SERVICE, public payload: any = {}, public params: {[key: string]: any} = {}) {}
}

/**
 *   COMMANDS
 *   Команды используются для инициирования действия
 */
export class BusCommand {
    constructor(public owner: BusEmitter = ANY_SERVICE, public payload: any = {}, public params: {[key: string]: any} = {} ) {}
}

/**
 *   ERRORS
 *   Ошибки в процессе обработки событий
 */
export class BusError {
    constructor(public owner: BusEmitter = ANY_SERVICE, public errors: string[] ) {}
}


export type BusMessage = BusCommand | BusEvent;

export interface IBus {
    channel: string;
    message: BusMessage | BusError;
}
