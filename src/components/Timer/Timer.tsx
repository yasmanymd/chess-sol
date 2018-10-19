import * as React from 'react';

export interface ITimerProps {
    totalSeconds: number;

    onTimeout: () => void;
}

export interface ITimerState {
    seconds: number;
}

export class Timer extends React.Component<ITimerProps, ITimerState>{
    interval: any;

    constructor(props: ITimerProps) {
        super(props);

        this.state = { seconds: props.totalSeconds };
        this.interval = null;
    }

    tick() {
        if (this.state.seconds === 0){
            this.stop();
            if (this.props.onTimeout) {
                this.props.onTimeout();
            }
        } else {
            this.setState({ seconds: this.state.seconds - 1 });
        }
    }

    start() {
        this.interval = setTimeout(this.tick, 1000);
    }

    stop() {
        clearInterval(this.interval);
    }

    public render(){
        return (
            <div>
                {this.state.seconds/60}:{this.state.seconds%60}
            </div>
        );
    }
}