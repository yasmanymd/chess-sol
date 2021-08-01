import * as React from 'react';
import './css/GameCard.css';
import { Game } from '../../models/Game';
import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button } from '@material-ui/core';
import piece from './../../piece.png';

export function GameCard(props: {game: Game, onGameCardSelected: (game: Game)=>void}) {
    return (
        <div style={{padding: 10}}>
            <Card className="card">
                <CardActionArea>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <CardMedia
                            component="img"
                            className="media"
                            image={piece}
                            title="Contemplative Reptile"
                            style={{width: 140}} />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">{props.game.title}</Typography>
                            <Typography component="p">{props.game.time/60} min</Typography>
                            <Typography component="p">White: {props.game.whitePlayer}</Typography>
                            <Typography component="p">Black: {props.game.blackPlayer}</Typography>
                        </CardContent>
                    </div>
                </CardActionArea>
                <CardActions>
                    <Button size="small" color="primary" onClick={() => { props.onGameCardSelected(props.game) }}>Join</Button>
                </CardActions>
            </Card>
        </div>
    );
}

/*
<div id={props.game.id} className="card" >
            <div>Title: </div>
            <div>White: </div>
            <div>Black: {props.game.blackPlayer}</div>
            <div>Time: </div>
        </div>
 */