import React, { Component } from 'react';
import { connect } from 'react-redux';
import { crosswordActions } from "./ducks/actions";
import { IStoreState } from '../../state/store';

class CrosswordContainer extends Component<any, any> {

    componentDidMount() {
        this.props.get();
    }

    render() {

        const {
            data,
            loading
        } = this.props;

        if (loading) {
            return null;
        }

        // return <Crossword data={data} />;
        return (
            <div>
                {JSON.stringify(data)}
            </div>
        );

    }
}

const mapStateToProps = (state: IStoreState) => {
    const { crossword } = state;
    const data = crossword.data;
    const loading = crossword.loading;
    return {
        data,
        loading
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
