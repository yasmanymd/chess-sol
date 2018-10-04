import { IBoardApp } from '../reducers/GameReducers';
import Board, { IBoardProps } from '../components/Board/Board';
import { connect } from 'react-redux';
import { init, changeView } from '../actions/ChessActions';

const mapStateToProps = (state: IBoardApp): IBoardProps => {
    return Object.assign({}, state.BoardPieces, state.BoardState);
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        onInit: () => {
            dispatch(init())
        },
        onChangeView: () => {
            dispatch(changeView())
        }
    };
}

const BoardContainer = connect(mapStateToProps, mapDispatchToProps)(Board);

export default BoardContainer;