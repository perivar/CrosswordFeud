import React, { PureComponent } from 'react';
import { DictionaryProps, DictionaryDispatchProps } from './DictionaryContainer';
// import TableExample1 from './TableExample1';
// import TableExample2 from './TableExample2';
import TableExample3 from './TableExample3';
// import BulmaTableExample from '../shared/bulma-components/BulmaTableExample';

interface DictionaryComponentState {
  data: any[];
  selection: any[];
  selectAll: boolean;
}

export default class DictionaryComponent extends PureComponent<
  DictionaryProps & DictionaryDispatchProps,
  DictionaryComponentState
> {
  render() {
    return <TableExample3 {...this.props} />;
    // return <BulmaTableExample />;
  }
}
