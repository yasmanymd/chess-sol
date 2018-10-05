import { IBoardApp } from '../reducers/GameReducers';
import Board, { IBoardProps } from '../components/Board/Board';
import { connect } from 'react-redux';
import { init, changeView, selectPiece, doMove } from '../actions/ChessActions';

const mapStateToProps = (state: IBoardApp): IBoardProps => {
    return Object.assign({}, state.BoardPieces, state.BoardState);
}

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    return {
        onInit: () => {
            dispatch(init());
        },
        onChangeView: () => {
            dispatch(changeView());
        }, 
        onSelectedPiece: (props: IBoardProps, position: number) => {
            dispatch(selectPiece(props, position));
        },
        onDoMove: (props: IBoardProps, position: number) => {
            dispatch(doMove(props, position));
        }
    };
}

const BoardContainer = connect(mapStateToProps, mapDispatchToProps)(Board);

export default BoardContainer;