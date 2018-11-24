import * as React from 'react';
import { Game } from 'src/models/Game';
import { GameCard } from 'src/components/GameCard/GameCard';
import { Utils } from '../../models/GameUtils';
import './css/GameRoom.css';
import { Drawer, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

export interface IGameRoomState {
    games: Game[];
    title: string;
    colorPiece: string;
    time: number;
}

export interface IGameRoomProps {
    socket: any; 
    player: string;
    onActionReceived: (action: any) => void;
}

export class GameRoom extends React.Component<IGameRoomProps, IGameRoomState> {
    constructor(props: IGameRoomProps) {
        super(props);

        this.state = { games: [], title: '', colorPiece: 'w', time: 300 };

        this.onNewGame = this.onNewGame.bind(this);
        this.onTitleChanged = this.onTitleChanged.bind(this);
        this.onTimeChanged = this.onTimeChanged.bind(this);
        this.joinGame = this.joinGame.bind(this);
    }

    componentDidMount() {
        const socket = this.props.socket;
        let self = this;
        Utils.getData('/game')
            .then((games: Game[]) => {
                self.setState({ games: games});
            });

        socket.on('game', () => {
            Utils.getData('/game')
                .then((games: Game[]) => {
                    self.setState({ games: games});
                });
        });
    }

    componentWillUnmount() {
        const socket = this.props.socket;
        socket.off('game');
    }

    onNewGame() {
        const p = this.props;
        const s = this.state;
        if (s.title != null && s.title != '') {
            Utils.postData('/newgame', {
                title: s.title, 
                whitePlayer: p.player, 
                blackPlayer: undefined, 
                time: s.time 
            })
            .then(response => response.json())
            .then(res => {
                if (p.onActionReceived) {
                    p.onActionReceived(res);

                    p.socket.on(res.game, (action: any) => {
                        p.onActionReceived(action);
                    });
                }
            });
        }
    }

    joinGame(game: Game) {
        const p = this.props;

        Utils.postData('/joingame', {
            game: game.id,
            whitePlayer: game.whitePlayer == undefined || game.whitePlayer == null || game.whitePlayer == '' ? p.player : game.whitePlayer, 
            blackPlayer: game.blackPlayer == undefined || game.blackPlayer == null || game.blackPlayer == '' ? p.player : game.blackPlayer
        })
        .then(response => response.json())
        .then(res => {
            if (p.onActionReceived) {
                p.onActionReceived(res);
                
                p.socket.on(game.id, (action: any) => {
                    p.onActionReceived(action);
                });

                Utils.postData('/execute', {game: game.id, action: {type: 'START', whitePlayer: res['whitePlayer'], blackPlayer: res['blackPlayer']}});
            }
        });
    }

    onTitleChanged(e: any) {
        this.setState({title: e.currentTarget.value });
    }

    onTimeChanged(e: any) {
        this.setState({time: e.target.value * 1 });
    }

    public render() {
        return (
            <div className="game-room">
            <Drawer
                className="drawer"
                variant="permanent">
                <div className="game-new">
                    <TextField id="input-with-icon-grid" label="Title" onChange={this.onTitleChanged} />
                    
                    <div> 
                        <FormControl>
                            <InputLabel htmlFor="time-simple">Time</InputLabel>
                            <Select
                                value={this.state.time}
                                onChange={this.onTimeChanged}>
                                <MenuItem value={300}>5 min</MenuItem>
                                <MenuItem value={420}>7 min</MenuItem>
                                <MenuItem value={600}>10 min</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{paddingTop: 10}}>
                        <Button variant="contained" color="primary" onClick={this.onNewGame}>
                            New
                        </Button>
                    </div>
                </div>
            </Drawer>
            <main className="game-list">
                {Object.keys(this.state.games).map((key: any) => {
                    var game = this.state.games[key];
                    return <GameCard key={game.id} game={game} onGameCardSelected={this.joinGame}></GameCard>;
                })}
            </main>
                
                
            </div>
        );
    }
}