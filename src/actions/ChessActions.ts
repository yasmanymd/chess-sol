import { IBoardProps } from '../components/Board/Board';

export enum ChessActionType {
    SET_WHITE = "SET_WHITE", 
    SET_BLACK = "SET_BLACK", 
    CHANGE_VIEW = "CHANGE_VIEW",
    SELECT_PIECE = "SELECT_PIECE",
    DO_MOVE = "DO_MOVE", 
    CORONATE = "CORONATE"
}

export interface IAction {
    type: ChessActionType;
}

export function setWhite(game: string): any {
    return {
        type: ChessActionType.SET_WHITE,
        game: game
    };
}

export function setBlack(game: string): any {
    return {
        type: ChessActionType.SET_BLACK,
        game: game
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

export function doMove(board: IBoardProps, position: number): any {
    return {
        type: ChessActionType.DO_MOVE,
        board: board,
        position: position
    };
}

export function coronate(board: IBoardProps, position: number, piece: string): any {
    return {
        type: ChessActionType.CORONATE,
        board: board, 
        position: position,
        piece: piece
    };
}

