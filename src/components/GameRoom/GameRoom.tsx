import * as React from 'react';
import { Game } from 'src/models/Game';
import { Player } from 'src/models/Player';
import { GameCard } from 'src/components/GameCard/GameCard';
import './css/GameRoom.css';

export interface IGameRoomState {
    games: Game[];
    title: string;
    colorPiece: string;
    time: number;
}

export interface IGameRoomProps {
    socket: any; 
    player: Player;
}

export class GameRoom extends React.Component<IGameRoomProps, IGameRoomState> {
    constructor(props: IGameRoomProps) {
        super(props);

        this.state = { games: [], title: '', colorPiece: 'w', time: 300 };

        this.onNewGame = this.onNewGame.bind(this);
        this.onTitleChanged = this.onTitleChanged.bind(this);
        this.onColorChanged = this.onColorChanged.bind(this);
        this.onTimeChanged = this.onTimeChanged.bind(this);
    }

    componentDidMount() {
        const socket = this.props.socket;
        let self = this;
        socket.get('/subscribe', (games: Game[]) => {
            self.setState({ games: games});

            socket.on('game', (body: any) => {
                socket.get('/game', (games: Game[]) => {
                    self.setState({ games: games});
                });
            });
        });
    }

    onNewGame() {
        const p = this.props;
        const s = this.state;
        if (s.title != null && s.title != '') {
            p.socket.post('/newgame', 
            {
                title: s.title, 
                whitePlayer: this.state.colorPiece === 'w' ? this.props.player.name : undefined, 
                blackPlayer: this.state.colorPiece !== 'w' ? this.props.player.name : undefined, 
                time: this.state.time 
            }, (response: any, body: any) => {})
        }
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
                    <select onChange={this.onTimeChanged}>
                        <option selected value="300">5 min</option>
                        <option value="420">7 min</option>
                        <option value="600">10 min</option>
                    </select>
                    </div> 
                    <button onClick={this.onNewGame}>New</button>
                </div>
                <div className="game-list">
                    {this.state.games.map((game: Game) => {
                        return <GameCard game={game}></GameCard>;
                    })}
                </div>
            </div>
        );
    }
}