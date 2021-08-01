import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import './css/Lobby.css';

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
                <Grid container spacing={8} alignItems="center">
                    <Grid item>
                        <AccountCircle />
                    </Grid>
                    <Grid item>
                        <TextField id="input-with-icon-grid" label="Username" onChange={this.updateInput} />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={this.onClick}>
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}