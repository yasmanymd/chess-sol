import * as React from 'react';
import './css/board.css';
import { Utils } from '../../models/GameUtils';
import { BitGameState } from '../../models/Game';
import { Piece } from '../../models/Piece';

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
    onCellClick?: (event: any) => void;
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
                                let cellColor = (r%2 === c%2) ? " dark" : " light";
                                let piece = " " + Piece.getClassName(BitGameState.getPiece(props, cellNumber));
                                let fmove =  "";
                                if (props.FUTURE_MOVES && props.FUTURE_MOVES.filter((iterator) => iterator === cellNumber).length > 0) {
                                    fmove = "f-move";
                                }
                                return (
                                    <div key={cellNumber} className={"cell c" + (cellNumber) + (cellColor) + (piece) + (fmove)} onClick={props.onCellClick!.bind(null, props, cellNumber)} />
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