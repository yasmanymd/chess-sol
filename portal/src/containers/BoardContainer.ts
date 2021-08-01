import { IBoardApp } from '../reducers/GameReducers';
import Board, { IBoardProps } from '../components/Board/Board';
import { connect } from 'react-redux';
import { changeView, selectPiece, doMove, coronate, gameOver } from '../actions/ChessActions';

const mapStateToProps = (state: IBoardApp): IBoardProps => {
    return Object.assign({}, state.BoardPieces, state.BoardState);
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        onChangeView: () => {
            dispatch(changeView());
        }, 
        onSelectedPiece: (position: number) => {
            dispatch(selectPiece(position));
        },
        onDoMove: (position: number) => {
            dispatch(doMove(position));
        }, 
        onCoronate: (position: number, piece: string) => {
            dispatch(coronate(position, piece))
        },
        onTimeout: (reason: number) => {
            dispatch(gameOver(reason))
        },
        onSurrender: (reason: number) => {
            dispatch(gameOver(reason))
        }
    };
}

const mergeProps = (stateProps: any, dispatchProps: any, ownProps: any) => {
    return Object.assign({}, ownProps, stateProps, dispatchProps);
}

const BoardContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Board);

export default BoardContainer;