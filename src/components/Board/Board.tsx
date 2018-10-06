import * as React from 'react';
import './css/board.css';
import { Utils } from '../../models/GameUtils';
import { BitGameState } from '../../models/Game';
import { Piece } from '../../models/Piece';
import * as classnames from "classnames";

export interface IBoardProps {
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

    W_MOVE: boolean; //True - White, False - Black
    
    B_CASTLING: boolean;
    W_CASTLING: boolean;
    W_VIEW: boolean; //True - White, False - Black
    FUTURE_MOVES?: number[];

    onInit?: (event: any) => void;
    onChangeView?: (event: any) => void;
    onSelectedPiece?: (event: any) => void;
    onDoMove?: (event: any) => void;
}

function Board(props: IBoardProps) {
    return (
        <div>
            <div className="board">
                { Utils.times(8, (row: number) => {
                    return (
                        <div key={row} className="row">
                            { Utils.times(8, (col: number) => {
                                let r = props.W_VIEW ? 7-row : row;
                                let c = props.W_VIEW ? col : 7-col;
                                let cellNumber =  r*8+c;
                                let pieceChar = BitGameState.getPiece(props, cellNumber);
                                let cellAttrs = {
                                    className: classnames("cell", "c" + cellNumber, Piece.getClassName(pieceChar), {
                                        "dark": r%2 === c%2,
                                        "light": r%2 !== c%2,
                                        "f-move": props.FUTURE_MOVES && props.FUTURE_MOVES.filter((iterator) => iterator === cellNumber).length > 0
                                    })
                                };
                                let onClick = (pieceChar && ((props.W_MOVE && pieceChar == pieceChar.toLowerCase()) || (!props.W_MOVE && pieceChar == pieceChar.toUpperCase()))) ? props.onSelectedPiece!.bind(null, props, cellNumber) : null;
                                if (cellAttrs.className.includes("f-move")) {
                                    onClick = props.onDoMove!.bind(null, props, cellNumber)
                                }
                                
                                return (
                                    <div key={cellNumber} {...cellAttrs} onClick={onClick} />
                                );
                            }) }
                        </div>
                    );                
                }) }
            </div>
            <div className="actions">
                <button onClick={props.onInit}>Init</button>
                <button onClick={props.onChangeView}>Change</button>
            </div>
        </div>
    );
}
  
export default Board;