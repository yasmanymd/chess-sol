import { BitGameState } from 'src/models/Game';
import { Player } from 'src/models/Player';

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

export function setWhite(game: string, time?: number): any {
    return {
        type: ChessActionType.SET_WHITE,
        game: game,
        time: time
    };
}

export function setBlack(game: string, whitePlayer: Player, time?: number): any {
    return {
        type: ChessActionType.SET_BLACK,
        game: game,
        whitePlayer: whitePlayer,
        time: time
    };
}

export function start(blackPlayer: Player): any {
    return {
        type: ChessActionType.START, 
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
    return (dispatch: any, getState: any, io: any) => {
        var state = getState();
        if (!((position >= 56 && BitGameState.getPiece(state.BoardPieces, state.BoardPieces.SELECTED_POSITION) === BitGameState.W_PAWNS_CHAR) ||
            (position <= 7 && BitGameState.getPiece(state.BoardPieces, state.BoardPieces.SELECTED_POSITION) === BitGameState.B_PAWNS_CHAR))) {
                io.emit(state.BoardState.game, { to: state.BoardState.P_WHITE ? state.BoardState.blackPlayer.Id : state.BoardState.whitePlayer.Id, action: {type: ChessActionType.DO_MOVE, selected: state.BoardPieces.SELECTED_POSITION, position: position } });
        }
        dispatch({
            type: ChessActionType.DO_MOVE,
            state: state,
            position: position
        });
    }
}

export function coronate(position: number, piece: string): any {
    return (dispatch: any, getState: any, io: any) => {
        var state = getState();
        io.emit(state.BoardState.game, { to: state.BoardState.P_WHITE ? state.BoardState.blackPlayer.Id : state.BoardState.whitePlayer.Id, action: {type: ChessActionType.CORONATE, lastPosition: state.BoardPieces.SELECTED_POSITION, position: position, piece: piece } })
        
        dispatch({
            type: ChessActionType.CORONATE,
            state: state, 
            position: position,
            piece: piece
        });
    }
}

export function gameOver(reason: number) {
    return (dispatch: any, getState: any, io: any) => {
        var state = getState();
        io.emit(state.BoardState.game, { to: state.BoardState.P_WHITE ? state.BoardState.blackPlayer.Id : state.BoardState.whitePlayer.Id, action: {type: ChessActionType.GAME_OVER, reason: reason } })
        
        dispatch({
            type: ChessActionType.GAME_OVER,
            reason: reason
        });
    }
}