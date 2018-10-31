import * as React from 'react';
import './css/GameCard.css';
import { Game } from '../../models/Game';

export function GameCard(props: {game: Game, onGameCardSelected: (game: Game)=>void}) {
    return (
        <div id={props.game.id} className="card" onClick={() => { props.onGameCardSelected(props.game) }}>
            <div>Title: {props.game.title}</div>
            <div>White: {props.game.whitePlayer}</div>
            <div>Black: {props.game.blackPlayer}</div>
            <div>Time: {props.game.time}</div>
        </div>
    );
}