export enum ChessActionType {
    SET_WHITE = "SET_WHITE", 
    SET_BLACK = "SET_BLACK", 
    START = "START",
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

export function setBlack(game: string, whiteId: string): any {
    return {
        type: ChessActionType.SET_BLACK,
        game: game,
        whiteId: whiteId
    };
}

export function start(blackId: string): any {
    return {
        type: ChessActionType.START, 
        blackId: blackId
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
        io.emit(state.BoardState.game, { to: state.BoardState.P_WHITE ? state.BoardState.blackId : state.BoardState.whiteId, action: {type: ChessActionType.DO_MOVE, selected: state.BoardPieces.SELECTED_POSITION, position: position } });
        dispatch({
            type: ChessActionType.DO_MOVE,
            state: state,
            position: position
        });
    }
}

export function coronate(position: number, piece: string): any {
    return (dispatch: any, getState: any) => {
        dispatch({
            type: ChessActionType.CORONATE,
            state: getState(), 
            position: position,
            piece: piece
        });
    };
}

