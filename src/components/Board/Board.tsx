import * as React from 'react';
import './css/board.css';
import { Utils } from '../../models/GameUtils';
import { BitGameState } from '../../models/GameClient';
import { Piece } from '../../models/Piece';
import * as classnames from "classnames";
import { Timer } from '../Timer/Timer';
import { Button, Card, CardActionArea, CardMedia, CardContent, Typography, CardActions } from '@material-ui/core';
import gameover from './themes/default/gameover.png';

export interface IBoardProps {
    game?: string;
    time?:number;
    whitePlayer?: string;
    blackPlayer?: string;

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

    W_MOVE?: boolean; //True - White, False - Black, null - no one
    P_WHITE?: boolean;
    
    B_CASTLING: number;
    W_CASTLING: number;
    W_VIEW: boolean; //True - White, False - Black
    SELECTED_POSITION?: number;
    LAST_MOVE?: number[];
    FUTURE_MOVES?: number[];
    CORONATE: number | null;
    isCheck?: boolean;
    GAME_OVER?: number;

    onChangeView?: (event: any) => void;
    onSelectedPiece?: (event: any) => void;
    onDoMove?: (event: any) => void;
    onCoronate?: (event: any) => void;
    onTimeout?: (event: any) => void;
    onSurrender?: (event: any) => void;
    onGameOver?: (event: any) => void;
}

function Board(props: IBoardProps) {
    let whiteMove = undefined; 
    if ((props.GAME_OVER === undefined || props.GAME_OVER === null || props.GAME_OVER === 0) && props.W_MOVE != undefined) {
        whiteMove = props.W_MOVE;
    }
    return (
        <div className="room">
            <div>
                <div className={"board" + (props.isCheck === true ? " check" : "")}>
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
                                            "f-move": props.FUTURE_MOVES && props.FUTURE_MOVES.filter((iterator) => iterator === cellNumber).length > 0,
                                            "l-move": props.LAST_MOVE && props.LAST_MOVE.filter((iterator) => iterator === cellNumber).length > 0
                                        })
                                    };
                                    let onClick = null;
                                    if (props.W_MOVE != null && props.W_MOVE === props.P_WHITE) {
                                        onClick = (pieceChar && ((props.W_MOVE === true && pieceChar == pieceChar.toLowerCase()) || (props.W_MOVE === false && pieceChar == pieceChar.toUpperCase()))) ? props.onSelectedPiece!.bind(null, cellNumber) : null;

                                        if (cellAttrs.className.includes("f-move")) {
                                            onClick = props.onDoMove!.bind(null, cellNumber)
                                        }
                                        if (props.CORONATE || (props.GAME_OVER != undefined && props.GAME_OVER > 0)) {
                                            onClick = null;
                                        }
                                    }                                
                                    return (
                                        <div key={cellNumber} {...cellAttrs} onClick={onClick} />
                                    );
                                }) }
                            </div>
                        );                
                    }) }
                </div>
                { props.CORONATE != null && props.CORONATE >= 56 && (
                    <div className="cor-pieces">
                        <div className={"cell-cor-pieces " + Piece.getClassName(BitGameState.W_QUEENS_CHAR)} onClick={props.onCoronate!.bind(null, props.CORONATE, BitGameState.W_QUEENS_CHAR)} />
                        <div className={"cell-cor-pieces " + Piece.getClassName(BitGameState.W_ROOKS_CHAR)} onClick={props.onCoronate!.bind(null, props.CORONATE, BitGameState.W_ROOKS_CHAR)} />
                        <div className={"cell-cor-pieces " + Piece.getClassName(BitGameState.W_BISHOPS_CHAR)} onClick={props.onCoronate!.bind(null, props.CORONATE, BitGameState.W_BISHOPS_CHAR)} />
                        <div className={"cell-cor-pieces " + Piece.getClassName(BitGameState.W_KNIGHTS_CHAR)} onClick={props.onCoronate!.bind(null, props.CORONATE, BitGameState.W_KNIGHTS_CHAR)} />
                    </div>
                ) }
                { props.CORONATE != null && props.CORONATE < 8 && (
                    <div className="cor-pieces">
                        <div className={"cell-cor-pieces " + Piece.getClassName(BitGameState.B_QUEENS_CHAR)} onClick={props.onCoronate!.bind(null, props.CORONATE, BitGameState.B_QUEENS_CHAR)} />
                        <div className={"cell-cor-pieces " + Piece.getClassName(BitGameState.B_ROOKS_CHAR)} onClick={props.onCoronate!.bind(null, props.CORONATE, BitGameState.B_ROOKS_CHAR)} />
                        <div className={"cell-cor-pieces " + Piece.getClassName(BitGameState.B_BISHOPS_CHAR)} onClick={props.onCoronate!.bind(null, props.CORONATE, BitGameState.B_BISHOPS_CHAR)} />
                        <div className={"cell-cor-pieces " + Piece.getClassName(BitGameState.B_KNIGHTS_CHAR)} onClick={props.onCoronate!.bind(null, props.CORONATE, BitGameState.B_KNIGHTS_CHAR)} />
                    </div>
                ) }
                <div className="actions">
                    <Button variant="contained" color="default" onClick={props.onChangeView}>
                        Change
                    </Button>
                    {props.W_MOVE != undefined && (
                     <Button variant="contained" color="default" onClick={props.onSurrender!.bind(null, props.P_WHITE === true ? 6 : 7)}>
                        Surrender
                    </Button>
                    )}
                </div>
                {props.GAME_OVER != undefined && props.GAME_OVER > 0 && (
                    <Card>
                        <CardActionArea>
                        <CardMedia
                            className="gameover"
                            component="img"
                            image={gameover}
                        />
                        <CardContent>
                            {props.GAME_OVER === 1 && <Typography component="p">Whites wins by checkmate.</Typography>}
                            {props.GAME_OVER === 2 && <Typography component="p">Blacks wins by checkmate.</Typography>}
                            {props.GAME_OVER === 3 && <Typography component="p">Draws.</Typography>}
                            {props.GAME_OVER === 4 && <Typography component="p">Whites win. Blacks timeout.</Typography>}
                            {props.GAME_OVER === 5 && <Typography component="p">Blacks win. Whites timeout.</Typography>}
                            {props.GAME_OVER === 6 && <Typography component="p">White surrenders.</Typography>}
                            {props.GAME_OVER === 7 && <Typography component="p">Blacks surrenders.</Typography>}
                        </CardContent>
                        </CardActionArea>
                        <CardActions>
                        <Button size="small" color="primary" onClick={props.onGameOver}>
                            Continue
                        </Button>
                        </CardActions>
                    </Card>
                )}
            </div>
            <div>
            {props.time && <Timer whiteSeconds={props.time} blackSeconds={props.time} whitePlayer={props.whitePlayer} blackPlayer={props.blackPlayer} whiteMove={whiteMove} whiteView={props.W_VIEW} onTimeout={props.onTimeout!.bind(null, props.W_MOVE === true ? 5 : 4)} />}
            </div>
        </div>
    );
}
  
export default Board;