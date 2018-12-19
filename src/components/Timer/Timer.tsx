import * as React from 'react';
import './css/timer.css';
import * as classnames from "classnames";
import { Paper, Typography } from '@material-ui/core';

export interface ITimerProps {
    whiteSeconds: number;
    blackSeconds: number;
    whitePlayer?: string;
    blackPlayer?: string;
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
        if ((this.interval == undefined || this.interval === null) && this.props.whiteMove !== undefined && this.props.whiteMove !== null) {
            this.interval = setInterval(this.tick, 1000);
        }
        if (this.interval != null && this.interval != undefined && (this.props.whiteMove === null || this.props.whiteMove === undefined)) {
            this.stop();
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
        let infoWhite = {
            className: classnames("section", "white-info", {
                "playing": this.props.whiteMove === true,
                "w-view": this.props.whiteView === true || this.props.whiteView === null || this.props.whiteView === undefined,
                "b-view": this.props.whiteView === false
            })
        };
        let infoBlack = {
            className: classnames("section", "black-info", {
                "playing": this.props.whiteMove === false,
                "w-view": this.props.whiteView === true || this.props.whiteView === null || this.props.whiteView === undefined,
                "b-view": this.props.whiteView === false
            })
        };
        return (
            <>
                <Paper {...infoWhite} elevation={1}>
                    <Typography variant="h5" component="h3">
                        {this.props.whitePlayer != undefined ? this.props.whitePlayer : null}
                    </Typography>
                    <Typography component="p">
                        {wm < 10 ? "0" + wm : wm}:{ws < 10 ? "0" + ws : ws}
                    </Typography>
                </Paper>
                <Paper {...infoBlack} elevation={1}>
                    <Typography variant="h5" component="h3">
                        {this.props.blackPlayer != undefined ? this.props.blackPlayer : null}
                    </Typography>
                    <Typography component="p">
                        {bm < 10 ? "0" + bm : bm}:{bs < 10 ? "0" + bs : bs}
                    </Typography>
                </Paper>
                </>
        );
    }
}