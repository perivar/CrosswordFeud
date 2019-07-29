import React, { PureComponent } from 'react';
import TableExample1 from './TableExample1';
import TableExample2 from './TableExample2';

interface DictionaryComponentProps {
  empty: any;
}

interface DictionaryComponentState {
  data: any[];
  selection: any[];
  selectAll: boolean;
}

export default class DictionaryComponent extends PureComponent<DictionaryComponentProps, DictionaryComponentState> {
  render() {
    return <TableExample1 />;
  }
}
