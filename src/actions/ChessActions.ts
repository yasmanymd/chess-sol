export enum ChessActionType {
    INIT = "INIT", 
    CHANGE_VIEW = "CHANGE_VIEW"
}

export interface IAction {
    type: ChessActionType;
}

export function init(): IAction {
    return {
        type: ChessActionType.INIT
    };
}

export function changeView(): IAction {
    return {
        type: ChessActionType.CHANGE_VIEW
    };
}