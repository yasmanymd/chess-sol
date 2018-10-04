import { IBoardProps } from '../components/Board/Board';
import { GameChar } from './GameChar';
import { Utils } from './GameUtils';

export class Game {
    private static pieceToClass = {
        "r": "w-rook",
        "n": "w-knight",
        "b": "w-bishop",
        "q": "w-queen",
        "k": "w-king",
        "p": "w-pawn",
        "R": "b-rook",
        "N": "b-knight",
        "B": "b-bishop",
        "Q": "b-queen",
        "K": "b-king",
        "P": "b-pawn"
    };

    public static getPiece(board: IBoardProps, position: number): string {
        var pos = Utils.longPow(2, position);
        if (board.W_PAWNS.and(pos).notEquals(0)) {
            return GameChar.W_PAWNS_CHAR;
        }
        if (board.W_ROOKS.and(pos).notEquals(0)) {
            return GameChar.W_ROOKS_CHAR;
        }
        if (board.W_KNIGHTS.and(pos).notEquals(0)) {
            return GameChar.W_KNIGHTS_CHAR;
        }
        if (board.W_BISHOPS.and(pos).notEquals(0)) {
            return GameChar.W_BISHOPS_CHAR;
        }
        if (board.W_QUEENS.and(pos).notEquals(0)) {
            return GameChar.W_QUEENS_CHAR;
        }
        if (board.W_KING.and(pos).notEquals(0)) {
            return GameChar.W_KING_CHAR;
        }
        if (board.B_PAWNS.and(pos).notEquals(0)) {
            return GameChar.B_PAWNS_CHAR;
        }
        if (board.B_ROOKS.and(pos).notEquals(0)) {
            return GameChar.B_ROOKS_CHAR;
        }
        if (board.B_KNIGHTS.and(pos).notEquals(0)) {
            return GameChar.B_KNIGHTS_CHAR;
        }
        if (board.B_BISHOPS.and(pos).notEquals(0)) {
            return GameChar.B_BISHOPS_CHAR;
        }
        if (board.B_QUEENS.and(pos).notEquals(0)) {
            return GameChar.B_QUEENS_CHAR;
        }
        if (board.B_KING.and(pos).notEquals(0)) {
            return GameChar.B_KING_CHAR;
        }
        return ""; 
    }

    public static getClassName(piece: string): string {
        if (!piece) return "";

        return this.pieceToClass[piece];
    }
}