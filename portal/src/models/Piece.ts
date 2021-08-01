export class Piece {
    public static getClassName(piece?: string): string | null {
        if (!piece) return "";

        var mapping = {
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

        return mapping[piece];
    }

    public static getPiece(className: string): string {
        var mapping = {
            "w-rook": "r",
            "w-knight": "n",
            "w-bishop": "b",
            "w-queen": "q",
            "w-king": "k",
            "w-pawn": "p",
            "b-rook": "R",
            "b-knight": "N",
            "b-bishop": "B",
            "b-queen": "Q",
            "b-king": "K",
            "b-pawn": "P"
        };

        return mapping[className];
    }

    public static isWhite(piece: string): boolean | null {
        var result = Piece.getClassName(piece);
        if (result === null) return null;
        return result[0] === 'w';
    }
}