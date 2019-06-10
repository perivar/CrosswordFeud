import React, { Component } from 'react';
import { connect } from 'react-redux';
import { crosswordActions } from "./ducks/actions";
import { IStoreState } from '../../state/store';
import { ICrosswordReduxState } from './types';

class CrosswordContainer extends Component<any, ICrosswordReduxState> {

    componentDidMount() {
        this.props.get();
    }

    render() {

        const {
            data,
            loading,
            error
        } = this.props;

        if (loading) {
            return null;
        }

        // return <Crossword data={data} />;
        return (
            <div>
                {error}
                {JSON.stringify(data)}
            </div>
        );

    }
}

const mapStateToProps = (state: IStoreState) : ICrosswordReduxState => {
    const { crossword } = state;
    const data = crossword.data;
    const loading = crossword.loading;
    const error = crossword.error;
    return {
        data,
        loading,
        error
    };
}

// inject methods *and* dispatch
const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatch,
        get: () => dispatch(crosswordActions.get()),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CrosswordContainer);
