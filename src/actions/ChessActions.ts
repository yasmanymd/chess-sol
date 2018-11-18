import { BitGameState } from 'src/models/GameClient';
import { Utils } from 'src/models/GameUtils';

export enum ChessActionType {
    SET_WHITE = "SET_WHITE", 
    SET_BLACK = "SET_BLACK", 
    START = "START",
    CHANGE_VIEW = "CHANGE_VIEW",
    SELECT_PIECE = "SELECT_PIECE",
    DO_MOVE = "DO_MOVE", 
    CORONATE = "CORONATE",
    GAME_OVER = "GAME_OVER"
}

export interface IAction {
    type: ChessActionType;
}

export function setWhite(game: string, title: string, whitePlayer: string, blackPlayer: string, time: number): any {
    return {
        type: ChessActionType.SET_WHITE,
        game: game,
        title: title, 
        whitePlayer: whitePlayer,
        blackPlayer: blackPlayer,
        time: time
    };
}

export function setBlack(game: string, title: string, whitePlayer: string, blackPlayer: string, time: number): any {
    return {
        type: ChessActionType.SET_BLACK,
        game: game,
        title: title, 
        whitePlayer: whitePlayer,
        blackPlayer: blackPlayer,
        time: time
    };
}

export function start(whitePlayer: string, blackPlayer: string): any {
    return {
        type: ChessActionType.START,
        whitePlayer: whitePlayer, 
        blackPlayer: blackPlayer
    };
}

export function changeView(): IAction {
    return {
        type: ChessActionType.CHANGE_VIEW
    };
}

export function selectPiece(position: number): any {
    return (dispatch: any, getState: any) => {
        dispatch({
            type: ChessActionType.SELECT_PIECE,
            state: getState(),
            position: position
        });
    };
}

export function doMove(position: number): any {
    return (dispatch: any, getState: any, socket: any) => {
        var state = getState();
        if (!((position >= 56 && BitGameState.getPiece(state.BoardPieces, state.BoardPieces.SELECTED_POSITION) === BitGameState.W_PAWNS_CHAR) ||
            (position <= 7 && BitGameState.getPiece(state.BoardPieces, state.BoardPieces.SELECTED_POSITION) === BitGameState.B_PAWNS_CHAR))) {
                Utils.postData('/execute', {game: state.BoardState.game, action: {type: ChessActionType.DO_MOVE, selected: state.BoardPieces.SELECTED_POSITION, position: position } });
        }        
    }
}

export function coronate(position: number, piece: string): any {
    return (dispatch: any, getState: any, socket: any) => {
        var state = getState();
        Utils.postData('/execute', {game: state.BoardState.game, action: {type: ChessActionType.CORONATE, lastPosition: state.BoardPieces.SELECTED_POSITION, position: position, piece: piece } });
    }
}

export function gameOver(reason: number) {
    return (dispatch: any, getState: any, socket: any) => {
        var state = getState();
        Utils.postData('/execute', {game: state.BoardState.game, action: {type: ChessActionType.GAME_OVER, reason: reason } });
    }
}