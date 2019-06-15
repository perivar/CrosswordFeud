import React, { Component } from 'react';
import { connect } from 'react-redux';
import { crosswordActions } from "./ducks/actions";
import { IStoreState } from '../../state/store';
import { ICrosswordContainerState, ICrosswordData } from './types';
import Crossword from './crosswords/crossword';
import { CrosswordAdapter } from './CrosswordAdapter';

class CrosswordContainer extends Component<any, ICrosswordContainerState> {

    private crosswordData: ICrosswordData;
    private adapter: CrosswordAdapter;

    constructor(props: any) {
        super(props);
        this.getCrossword = this.getCrossword.bind(this);

        this.crosswordData = Crossword.defaultProps.data;
        this.adapter = new CrosswordAdapter();
    }

    getCrossword() {
        this.props.get();

        // if (this.props.data.clues !== undefined) {
        //     // this.crosswordData.entries = Object.entries(this.props.data.clues).map(([key, value]: any) => value.map(([k, v]: any) => this.adapter.adapt(v)));

        //     Object.keys(this.props.data.clues).forEach((key: string) => {
        //         const values = this.props.data.clues[key];

        //         values.forEach((item: string) => {
        //             const clue: IClue = {
        //                 id: '',
        //                 number: 0,
        //                 humanNumber: '0',
        //                 group: [''],
        //                 clue: item,
        //                 position: { x: 0, y: 0 },
        //                 separatorLocations: {},
        //                 direction: key as Direction,
        //                 length: 0,
        //                 solution: ''
        //             }
        //             this.crosswordData.entries.push(clue);
        //         });
        //     });

        //     const size = this.props.data.size;
        //     var cols = size.cols;
        //     var rows = size.rows;
        //     this.crosswordData.dimensions = { cols: cols, rows: rows };
        // }
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

        return (
            <div>
                {error}
                {/* {JSON.stringify(data)} */}
                <Crossword data={data} />
                {/* {JSON.stringify(this.crosswordData)} */}
                {/* <Crossword data={this.crosswordData} /> */}
                <button className="btn btn-primary" onClick={this.getCrossword}>Get crossword</button>
            </div>
        );

    }
}

const mapStateToProps = (state: IStoreState): ICrosswordContainerState => {
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
