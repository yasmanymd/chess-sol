import { IBoardProps } from '../components/Board/Board';

export enum ChessActionType {
    INIT = "INIT", 
    CHANGE_VIEW = "CHANGE_VIEW",
    SELECT_PIECE = "SELECT_PIECE"
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

export function selectPiece(board: IBoardProps, position: number): any {
    return {
        type: ChessActionType.SELECT_PIECE,
        board: board,
        position: position
    };
}

