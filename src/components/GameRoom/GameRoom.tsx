import * as React from 'react';
import { Game } from 'src/models/Game';
import { GameCard } from 'src/components/GameCard/GameCard';
import { Utils } from '../../models/GameUtils';
import './css/GameRoom.css';

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
        this.onColorChanged = this.onColorChanged.bind(this);
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
                whitePlayer: s.colorPiece === 'w' ? p.player : undefined, 
                blackPlayer: s.colorPiece !== 'w' ? p.player : undefined, 
                time: s.time 
            }).then(res => {
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
        }).then(res => {
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

    onColorChanged(e: any) {
        this.setState({colorPiece: e.currentTarget.value });
    }

    onTimeChanged(e: any) {
        this.setState({time: e.currentTarget.value * 1 });
    }

    public render() {
        return (
            <div className="game-room">
                <div className="game-new">
                    <div>Title: <input type="text" onChange={this.onTitleChanged}></input></div> 
                    <div>Color: 
                        <input type="radio" name="color" 
                            value="w"
                            checked={this.state.colorPiece === "w"} 
                            onChange={this.onColorChanged} />White
                        <input type="radio" name="color" 
                            value="b"
                            checked={this.state.colorPiece === "b"} 
                            onChange={this.onColorChanged} />Black
                    </div> 
                    <div>Time: 
                    <select onChange={this.onTimeChanged} value={this.state.time}>
                        <option value="300">5 min</option>
                        <option value="420">7 min</option>
                        <option value="600">10 min</option>
                    </select>
                    </div> 
                    <button onClick={this.onNewGame}>New</button>
                </div>
                <div className="game-list">
                    {Object.keys(this.state.games).map((key: any) => {
                        var game = this.state.games[key];
                        return <GameCard key={game.id} game={game} onGameCardSelected={this.joinGame}></GameCard>;
                    })}
                </div>
            </div>
        );
    }
}