import * as React from 'react';

export interface ILobbyProps {
    onSetName: (name: string) => void;
}

export class Lobby extends React.Component<ILobbyProps, any> {
    constructor(props: ILobbyProps) {
        super(props);
    
        this.state = { inputValue: '' };
        this.onClick = this.onClick.bind(this);
        this.updateInput = this.updateInput.bind(this);
    }
    updateInput(e: any) {
        this.setState({ inputValue: e.target.value });
    }

    onClick() {
        if (this.props.onSetName) {
            this.props.onSetName(this.state.inputValue);
        }
    }

    public render() {
        return (
            <div className="App-lobby">
                Name: 
                <input type="text" onChange={this.updateInput} />
                <button onClick={this.onClick}>Submit</button>
            </div>
        );
    }
}