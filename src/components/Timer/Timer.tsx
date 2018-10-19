import * as React from 'react';
import './css/timer.css';
import * as classnames from "classnames";
import { Player } from 'src/models/Player';

export interface ITimerProps {
    whiteSeconds: number;
    blackSeconds: number;
    whitePlayer?: Player;
    blackPlayer?: Player;
    whiteMove?: boolean;
    whiteView?: boolean;

    onTimeout?: () => void;
}

export interface ITimerState {
    whiteSeconds: number;
    blackSeconds: number;
}

export class Timer extends React.Component<ITimerProps, ITimerState>{
    interval: any;

    constructor(props: ITimerProps) {
        super(props);

        this.state = { whiteSeconds: props.whiteSeconds, blackSeconds: props.blackSeconds };
        this.interval = null;

        this.tick = this.tick.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
    }

    componentDidMount() {
        this.start();
    }

    componentWillUnmount() {
        this.stop();
    }

    tick() {
        let seconds = this.props.whiteMove === true ? this.state.whiteSeconds : this.state.blackSeconds;

        if (seconds === 0) {
            this.stop();
            if (this.props.onTimeout) {
                this.props.onTimeout();
            }
        } else {
            this.setState(() => { return this.props.whiteMove === true ? { whiteSeconds: seconds - 1, blackSeconds: this.state.blackSeconds } : {whiteSeconds: this.state.whiteSeconds, blackSeconds: seconds - 1}});
        }
    }

    start() {
        if ((this.interval == undefined || this.interval === null) && this.props.whiteMove !== undefined) {
            this.interval = setInterval(this.tick, 1000);
        }
    }

    stop() {
        clearInterval(this.interval);
    }

    public render() {
        this.start();
        let wm = Math.floor(this.state.whiteSeconds/60);
        let ws = this.state.whiteSeconds%60;
        let bm = Math.floor(this.state.blackSeconds/60);
        let bs = this.state.blackSeconds%60;
        let infoAttrs = {
            className: classnames("info", {
                "w-view": this.props.whiteView === true || this.props.whiteView === null || this.props.whiteView === undefined,
                "b-view": this.props.whiteView === false
            })
        };
        return (
            <div {...infoAttrs}>
                <div className="white-info">
                    <div>{this.props.whitePlayer != undefined ? this.props.whitePlayer!.Name : null}</div>
                    <div>{wm < 10 ? "0" + wm : wm}:{ws < 10 ? "0" + ws : ws}</div>
                </div>
                <div className="black-info">
                    <div>{this.props.blackPlayer != undefined ? this.props.blackPlayer!.Name : null}</div>
                    <div>{bm < 10 ? "0" + bm : bm}:{bs < 10 ? "0" + bs : bs}</div>
                </div>
            </div>
        );
    }
}