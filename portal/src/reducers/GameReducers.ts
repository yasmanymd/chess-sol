import * as Long from 'long';
import { ChessActionType } from '../actions/ChessActions';
import { combineReducers } from 'redux';
import { Utils } from '../models/GameUtils';
import { GameClient, BitGameState } from '../models/GameClient';

export interface IBoardApp {
    BoardPieces: IBoardPieces,
    BoardState: IBoardState
}

export interface IBoardPieces {
    B_PAWNS: Long;
    B_ROOKS: Long;
    B_KNIGHTS: Long;
    B_BISHOPS: Long;
    B_QUEENS: Long;
    B_KING: Long;

    W_PAWNS: Long;
    W_ROOKS: Long;
    W_KNIGHTS: Long;
    W_BISHOPS: Long;
    W_QUEENS: Long;
    W_KING: Long;
    FUTURE_MOVES?: number[];
    SELECTED_POSITION?: number;
    LAST_MOVE?: number[];
    isCheck?: boolean;
}

export interface IBoardState {
    game?: string;
    time?: number;
    whitePlayer?: string;
    blackPlayer?: string;
    W_MOVE?: boolean; //True - White, False - Black
    P_WHITE?: boolean;

    B_CASTLING: number;
    W_CASTLING: number;
    W_VIEW: boolean; //True - White, False - Black
    CORONATE: number | null;
    GAME_OVER?: number;
    onGameOver?: (event: any) => void;
}

function createBoardPieces(): IBoardPieces {
    var result: IBoardPieces = {
        B_PAWNS: Long.fromInt(0),
        B_ROOKS: Long.fromInt(0),
        B_KNIGHTS: Long.fromInt(0),
        B_BISHOPS: Long.fromInt(0),
        B_QUEENS: Long.fromInt(0),
        B_KING: Long.fromInt(0),

        W_PAWNS: Long.fromInt(0),
        W_ROOKS: Long.fromInt(0),
        W_KNIGHTS: Long.fromInt(0),
        W_BISHOPS: Long.fromInt(0),
        W_QUEENS: Long.fromInt(0),
        W_KING: Long.fromInt(0)
    };

    return result;
}

function initBoardPieces(): IBoardPieces {
    var wPawns: Long = Long.fromInt(0);
    Utils.forEach(8, 15, (index: number) => { wPawns = wPawns.add(Utils.longPos(index)) });
    var bPawns: Long = Long.fromInt(0);
    Utils.forEach(48, 55, (index: number) => { bPawns = bPawns.add(Utils.longPos(index)) });
    var init: IBoardPieces = {
        B_PAWNS: bPawns,
        B_ROOKS: Utils.longPos(56).add(Utils.longPos(63)),
        B_KNIGHTS: Utils.longPos(57).add(Utils.longPos(62)),
        B_BISHOPS: Utils.longPos(58).add(Utils.longPos(61)),
        B_QUEENS: Utils.longPos(59),
        B_KING: Utils.longPos(60),

        W_PAWNS: wPawns,
        W_ROOKS: Utils.longPos(0).add(Utils.longPos(7)),
        W_KNIGHTS: Utils.longPos(1).add(Utils.longPos(6)),
        W_BISHOPS: Utils.longPos(2).add(Utils.longPos(5)),
        W_QUEENS: Utils.longPos(3),
        W_KING: Utils.longPos(4)
    };

    return init;
}

function initBoardState(): IBoardState {

    var init: IBoardState = {
        B_CASTLING: 0,
        W_CASTLING: 0,
        W_VIEW: true,
        CORONATE: null,
        GAME_OVER: undefined
    };

    return init;
}

function checkGameOver(state: any): number | null {
    let g = GameClient.instance();
    if (state.BoardState.W_MOVE && g.isCheckMate(false)) {
        return 1;
    }
    if (!state.BoardState.W_MOVE && g.isCheckMate(true)) {
        return 2;
    }

    if (g.isTable(!state.BoardState.W_MOVE)) {
        return 3;
    }
    return null;
}

export function BoardPiecesReducer(state: IBoardPieces = createBoardPieces(), action: any): IBoardPieces {
    let g = GameClient.instance();

    switch (action.type) {
        case ChessActionType.SET_WHITE:
            return initBoardPieces();
        case ChessActionType.SET_BLACK:
            return initBoardPieces();
        case ChessActionType.SELECT_PIECE:
            var s = action.state;
            g.loadGame(s.BoardPieces, s.BoardState);
            g.updateState(s.BoardState.W_MOVE);
            return Object.assign({}, state, {
                SELECTED_POSITION: action.position,
                FUTURE_MOVES: g.getFutureMove(action.position)
            });
        case ChessActionType.DO_MOVE:
            var s = action.state;
            g.loadGame(s.BoardPieces, s.BoardState);
            g.updateState(s.BoardState.W_MOVE);

            var selectedPosition = null;
            var includeLastMove = true;
            if ((action.position >= 56 && BitGameState.getPiece(s.BoardPieces, s.BoardPieces.SELECTED_POSITION) === BitGameState.W_PAWNS_CHAR) ||
                (action.position <= 7 && BitGameState.getPiece(s.BoardPieces, s.BoardPieces.SELECTED_POSITION) === BitGameState.B_PAWNS_CHAR)) {
                selectedPosition = s.BoardPieces.SELECTED_POSITION;
                includeLastMove = false;
            }

            g.move(s.BoardPieces.SELECTED_POSITION || action.selected, action.position);

            return Object.assign({}, state, {
                B_PAWNS: g.B_PAWNS,
                B_ROOKS: g.B_ROOKS,
                B_KNIGHTS: g.B_KNIGHTS,
                B_BISHOPS: g.B_BISHOPS,
                B_QUEENS: g.B_QUEENS,
                B_KING: g.B_KING,

                W_PAWNS: g.W_PAWNS,
                W_ROOKS: g.W_ROOKS,
                W_KNIGHTS: g.W_KNIGHTS,
                W_BISHOPS: g.W_BISHOPS,
                W_QUEENS: g.W_QUEENS,
                W_KING: g.W_KING,

                SELECTED_POSITION: selectedPosition,
                FUTURE_MOVES: null,
                isCheck: g.isCheck(!s.BoardState.W_MOVE),
                GAME_OVER: checkGameOver(s)
            },
                includeLastMove ? { LAST_MOVE: [s.BoardPieces.SELECTED_POSITION || action.selected, action.position] } : {});
        case ChessActionType.CORONATE:
            var s = action.state;
            g.loadGame(s.BoardPieces, s.BoardState);
            g.updateState(s.BoardState.W_MOVE);
            g.move(s.BoardPieces.SELECTED_POSITION || action.lastPosition, action.position);
            g.setPiece(action.piece, action.position);
            return Object.assign({}, state, {
                B_PAWNS: g.B_PAWNS,
                B_ROOKS: g.B_ROOKS,
                B_KNIGHTS: g.B_KNIGHTS,
                B_BISHOPS: g.B_BISHOPS,
                B_QUEENS: g.B_QUEENS,
                B_KING: g.B_KING,

                W_PAWNS: g.W_PAWNS,
                W_ROOKS: g.W_ROOKS,
                W_KNIGHTS: g.W_KNIGHTS,
                W_BISHOPS: g.W_BISHOPS,
                W_QUEENS: g.W_QUEENS,
                W_KING: g.W_KING,

                SELECTED_POSITION: null,
                LAST_MOVE: [s.BoardPieces.SELECTED_POSITION || action.lastPosition, action.position],
                FUTURE_MOVES: null,
                isCheck: g.isCheck(!s.BoardState.W_MOVE)
            });
        default:
            return state;
    }
}

export function BoardStateReducer(state: IBoardState = initBoardState(), action: any): IBoardState {
    switch (action.type) {
        case ChessActionType.SET_WHITE:
            return Object.assign({}, state, {
                game: action.game,
                time: action.time * 1,
                whitePlayer: action.whitePlayer,
                blackPlayer: action.blackPlayer,
                P_WHITE: true,
                W_VIEW: true
            });
        case ChessActionType.SET_BLACK:
            return Object.assign({}, state, {
                game: action.game,
                time: action.time * 1,
                whitePlayer: action.whitePlayer,
                blackPlayer: action.blackPlayer,
                P_WHITE: false,
                W_VIEW: false
            });
        case ChessActionType.START:
            return Object.assign({}, state, {
                whitePlayer: action.whitePlayer,
                blackPlayer: action.blackPlayer,
                W_MOVE: true
            });
        case ChessActionType.CHANGE_VIEW:
            return Object.assign({}, state, {
                W_VIEW: !state.W_VIEW
            });
        case ChessActionType.DO_MOVE:
            Utils.saveNotation(action.state.BoardState.game, Utils.getPosition(action.selected), Utils.getPosition(action.position));
            var s = action.state;
            var g = GameClient.instance();
            if ((action.position >= 56 && BitGameState.getPiece(s.BoardPieces, s.BoardPieces.SELECTED_POSITION) === BitGameState.W_PAWNS_CHAR) ||
                (action.position <= 7 && BitGameState.getPiece(s.BoardPieces, s.BoardPieces.SELECTED_POSITION) === BitGameState.B_PAWNS_CHAR)) {
                return Object.assign({}, state, {
                    CORONATE: action.position
                });
            }
            var isGameOver = checkGameOver(s);

            if (isGameOver && action.state.BoardState.P_WHITE) {
                var result = "";
                if (isGameOver == 1) {
                    result = "1-0"
                }
                if (isGameOver == 2) {
                    result = "0-1"
                }
                if (isGameOver == 3) {
                    result = "1/2-1/2"
                }
                var game = {
                    name: action.state.BoardState.whitePlayer + " vs " + action.state.BoardState.blackPlayer + " [" + new Date().toLocaleString() + "]",
                    whiteName: action.state.BoardState.whitePlayer,
                    blackName: action.state.BoardState.blackPlayer,
                    strategyName: "",
                    result: result,
                    movements: Utils.getNotation(action.state.BoardState.game)
                };
                fetch("http://localhost:6000/game", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(game)
                });
                Utils.removeNotation(action.state.BoardState.game);
            }

            return Object.assign({}, state, {
                W_CASTLING: g.whiteCastling,
                B_CASTLING: g.blackCastling,

                W_MOVE: !isGameOver ? !state.W_MOVE : null,
                GAME_OVER: isGameOver
            });
        case ChessActionType.CORONATE:
            Utils.saveNotation(action.state.BoardState.game, Utils.getPosition(action.selected), Utils.getPosition(action.position));
            var s = action.state;
            var isGameOver = checkGameOver(s);
            return Object.assign({}, state, {
                CORONATE: null,
                W_MOVE: !isGameOver ? !state.W_MOVE : null,
                GAME_OVER: isGameOver
            });
        case ChessActionType.GAME_OVER:
            return Object.assign({}, state, {
                GAME_OVER: action.reason,
                W_MOVE: null
            });
        default:
            return state;
    }
}

const BoardApp = combineReducers({
    BoardPieces: BoardPiecesReducer,
    BoardState: BoardStateReducer
});

export default BoardApp;