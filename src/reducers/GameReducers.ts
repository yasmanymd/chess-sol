import * as Long from 'long';
import { IAction, ChessActionType } from '../actions/ChessActions';
import { combineReducers } from 'redux';
import { Utils } from '../models/GameUtils';
import { Game } from '../models/Game';

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
}

export interface IBoardState {
    W_MOVE: boolean; //True - White, False - Black
    
    B_CASTLING: boolean;
    W_CASTLING: boolean;
    W_VIEW: boolean; //True - White, False - Black
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
      B_CASTLING: false,
      W_CASTLING: false,
      W_MOVE: true,
      W_VIEW: true
    };

    return init;
}

export function BoardPiecesReducer(state: IBoardPieces = createBoardPieces(), action: any): IBoardPieces {
    let g = Game.instance();

    switch (action.type) {
        case ChessActionType.INIT:
            return initBoardPieces();
        case ChessActionType.SELECT_PIECE:
            g.loadGame(action.board);
            g.updateState(action.board.W_MOVE);
            return Object.assign({}, state, {
                SELECTED_POSITION: action.position,
                FUTURE_MOVES: Game.instance().getFutureMove(action.position)
            });
        case ChessActionType.DO_MOVE:
            g.loadGame(action.board);
            g.updateState(action.board.W_MOVE);
            g.move(action.board.SELECTED_POSITION, action.position);
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
                FUTURE_MOVES: null
            });
        default:
            return state;
    }
}

export function BoardStateReducer(state: IBoardState = initBoardState(), action: IAction): IBoardState {
    switch (action.type) {
        case ChessActionType.INIT:
            return initBoardState();
        case ChessActionType.CHANGE_VIEW:
            return Object.assign({}, state, {
                W_VIEW: !state.W_VIEW
            });
        case ChessActionType.DO_MOVE:
            return Object.assign({}, state, {
                W_MOVE: !state.W_MOVE
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