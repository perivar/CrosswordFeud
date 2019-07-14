import React, { Component } from 'react';
import ReactTable, { Column, RowInfo } from 'react-table';
import selectTableHOC, {
  SelectTableAdditionalProps,
  SelectAllInputComponentProps,
  SelectInputComponentProps
} from 'react-table/lib/hoc/selectTable';

import 'react-table/react-table.css';
import './my-react-table.scss';
// import SortableTable from './sortable-table';

interface IDictionary {
  [key: string]: any;
}

interface Data {
  id?: number;
  firstName: string;
  lastName: string;
  age: number;
}

interface DictionaryComponentProps {
  empty: any;
}

interface DictionaryComponentState {
  selection: any[];
  selectAll: boolean;
}

const SelectTable = selectTableHOC(ReactTable);

const SelectInput: React.StatelessComponent<SelectInputComponentProps> = ({
  selectType,
  onClick,
  id,
  checked,
  row
}) => (
  <input
    type={selectType || 'checkbox'}
    aria-label={`${checked ? 'Un-select' : 'Select'} row with id:${id}`}
    checked={checked}
    id={id}
    onClick={e => {
      const { shiftKey } = e;
      e.stopPropagation();
      onClick(id, shiftKey, row);
    }}
    onChange={() => {}}
  />
);

const SelectAllInput: React.StatelessComponent<SelectAllInputComponentProps> = ({ selectType, onClick, checked }) => (
  <input
    type={selectType || 'checkbox'}
    aria-label={`${checked ? 'Un-select all' : 'Select all'}`}
    checked={checked}
    onClick={e => {
      e.stopPropagation();
      onClick();
    }}
    onChange={() => {}}
  />
);

const selectTableAdditionalProps: SelectTableAdditionalProps = {
  keyField: 'id',
  selectType: 'checkbox',
  selectWidth: 50,
  SelectInputComponent: SelectInput,
  SelectAllInputComponent: SelectAllInput
};

const columns: Column[] = [
  { Header: 'ID', accessor: 'id' },
  { Header: 'First Name', accessor: 'firstName' },
  { Header: 'Last Name', accessor: 'lastName' },
  { Header: 'Age', accessor: 'age' }
];

export default class DictionaryComponent extends Component<DictionaryComponentProps, DictionaryComponentState> {
  private selectTable: any = null; // add any to avoid getWrappedInstance() might be null

  constructor(props: DictionaryComponentProps) {
    super(props);
    this.state = {
      selection: [],
      selectAll: false
    };
  }
  toggleSelection = (key: string, shiftKeyPressed: boolean, row: string) => {
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);
    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [...selection.slice(0, keyIndex), ...selection.slice(keyIndex + 1)];
    } else {
      // it does not exist so add it
      selection.push(key);
    }
    // update the state
    this.setState({ selection });
  };

  toggleAll = () => {
    const { keyField } = selectTableAdditionalProps;
    const selectAll = this.state.selectAll ? false : true;
    const selection = [] as any[];
    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.selectTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach((item: any) => {
        if (item._original) {
          selection.push(`select-${item._original[keyField!]}`);
        }
      });
    }
    this.setState({ selectAll, selection });
  };

  isSelected = (key: string) => {
    return this.state.selection.includes(`select-${key}`);
  };

  rowFn = (
    state: DictionaryComponentState,
    rowInfo: RowInfo | undefined,
    column: Column | undefined,
    instance: any
  ) => {
    const { selection } = this.state;

    if (rowInfo && rowInfo !== undefined && rowInfo.row) {
      return {
        onClick: (e: any, handleOriginal: any) => {
          console.log('It was in this row:', rowInfo);

          // toggle selection
          this.toggleSelection(`select-${rowInfo.original.id}`, false, '');

          // IMPORTANT! React-Table uses onClick internally to trigger
          // events like expanding SubComponents and pivots.
          // By default a custom 'onClick' handler will override this functionality.
          // If you want to fire the original onClick handler, call the
          // 'handleOriginal' function.
          if (handleOriginal) {
            handleOriginal();
          }
        },
        style: {
          background: rowInfo && selection.includes(`select-${rowInfo.original.id}`) && 'lightgreen'
        }
      };
    } else {
      return {};
    }
  };

  render() {
    return (
      <SelectTable
        {...selectTableAdditionalProps}
        data={getUniqueData()}
        columns={columns}
        // norwmal ref won't work since we need the wrapped instance
        // therefore use an arrow function to set the ref
        ref={ref => {
          this.selectTable = ref;
        }}
        toggleSelection={this.toggleSelection}
        selectAll={this.state.selectAll}
        toggleAll={this.toggleAll}
        isSelected={this.isSelected}
        getTrProps={this.rowFn}
        className="-striped -highlight"
      />
    );
    // const columns = [
    //   {
    //     header: 'Id',
    //     key: 'id',
    //     defaultSorting: 'ASC',
    //     headerStyle: { fontSize: '15px', backgroundColor: '#FFDAB9', width: '100px' },
    //     dataStyle: { fontSize: '15px', backgroundColor: '#FFDAB9' },
    //     dataProps: { className: 'align-right' },
    //     render: (id: string) => {
    //       return <a href={'user/' + id}>{id}</a>;
    //     }
    //   },
    //   {
    //     header: 'Age',
    //     key: 'age',
    //     headerStyle: { fontSize: '15px' },
    //     sortable: false
    //   },
    //   {
    //     header: 'First Name',
    //     key: 'firstName',
    //     headerStyle: { fontSize: '15px' },
    //     headerProps: { className: 'align-left' }
    //   },
    //   {
    //     header: 'Last Name',
    //     key: 'lastName',
    //     headerStyle: { fontSize: '15px' },
    //     headerProps: { className: 'align-left' }
    //   }
    // ];
    // const style = {
    //   backgroundColor: '#eee'
    // };
    // const iconStyle = {
    //   // color: '#aaa',
    //   paddingLeft: '5px',
    //   paddingRight: '5px'
    // };
    // return <SortableTable data={getUniqueData()} columns={columns} style={style} iconStyle={iconStyle} />;
  }
}

const getUniqueData = (): Data[] => {
  const result = makeData();

  // we are adding a unique ID to the data for tracking the selected records
  return result.map((item: any, index: number) => {
    const id = index;
    return {
      id,
      ...item
    };
  });
};

const makeData = (): Data[] => {
  return [
    {
      firstName: 'judge',
      lastName: 'babies',
      age: 16
    },
    {
      firstName: 'quarter',
      lastName: 'driving',
      age: 17
    },
    {
      firstName: 'division',
      lastName: 'society',
      age: 3
    },
    {
      firstName: 'lamp',
      lastName: 'point',
      age: 2
    },
    {
      firstName: 'argument',
      lastName: 'insurance',
      age: 13
    },
    {
      firstName: 'pets',
      lastName: 'fan',
      age: 27
    },
    {
      firstName: 'learning',
      lastName: 'board',
      age: 9
    },
    {
      firstName: 'observation',
      lastName: 'drink',
      age: 28
    },
    {
      firstName: 'burst',
      lastName: 'glove',
      age: 1
    },
    {
      firstName: 'acoustics',
      lastName: 'animal',
      age: 19
    },
    {
      firstName: 'beetle',
      lastName: 'branch',
      age: 25
    },
    {
      firstName: 'invention',
      lastName: 'servant',
      age: 14
    },
    {
      firstName: 'letters',
      lastName: 'driving',
      age: 12
    },
    {
      firstName: 'seashore',
      lastName: 'metal',
      age: 18
    },
    {
      firstName: 'cat',
      lastName: 'stranger',
      age: 26
    },
    {
      firstName: 'group',
      lastName: 'dinner',
      age: 20
    },
    {
      firstName: 'mom',
      lastName: 'pipe',
      age: 27
    },
    {
      firstName: 'desk',
      lastName: 'pail',
      age: 6
    },
    {
      firstName: 'oranges',
      lastName: 'interest',
      age: 22
    },
    {
      firstName: 'umbrella',
      lastName: 'legs',
      age: 9
    },
    {
      firstName: 'carpenter',
      lastName: 'apparel',
      age: 19
    },
    {
      firstName: 'seat',
      lastName: 'wrench',
      age: 14
    },
    {
      firstName: 'carpenter',
      lastName: 'steam',
      age: 27
    },
    {
      firstName: 'chess',
      lastName: 'bread',
      age: 21
    },
    {
      firstName: 'men',
      lastName: 'pie',
      age: 5
    },
    {
      firstName: 'group',
      lastName: 'action',
      age: 21
    },
    {
      firstName: 'coil',
      lastName: 'mine',
      age: 11
    },
    {
      firstName: 'care',
      lastName: 'partner',
      age: 17
    },
    {
      firstName: 'queen',
      lastName: 'cows',
      age: 20
    },
    {
      firstName: 'wilderness',
      lastName: 'cracker',
      age: 24
    },
    {
      firstName: 'chair',
      lastName: 'scarecrow',
      age: 5
    },
    {
      firstName: 'cast',
      lastName: 'nation',
      age: 16
    },
    {
      firstName: 'fear',
      lastName: 'wave',
      age: 28
    },
    {
      firstName: 'cook',
      lastName: 'drug',
      age: 2
    },
    {
      firstName: 'thrill',
      lastName: 'marble',
      age: 25
    },
    {
      firstName: 'ship',
      lastName: 'muscle',
      age: 29
    },
    {
      firstName: 'drug',
      lastName: 'suit',
      age: 13
    },
    {
      firstName: 'edge',
      lastName: 'statement',
      age: 19
    },
    {
      firstName: 'chickens',
      lastName: 'start',
      age: 20
    },
    {
      firstName: 'donkey',
      lastName: 'laugh',
      age: 14
    },
    {
      firstName: 'tiger',
      lastName: 'tendency',
      age: 27
    },
    {
      firstName: 'steam',
      lastName: 'argument',
      age: 17
    },
    {
      firstName: 'riddle',
      lastName: 'adjustment',
      age: 15
    },
    {
      firstName: 'silver',
      lastName: 'women',
      age: 2
    },
    {
      firstName: 'month',
      lastName: 'babies',
      age: 13
    },
    {
      firstName: 'van',
      lastName: 'flowers',
      age: 29
    },
    {
      firstName: 'yak',
      lastName: 'book',
      age: 5
    },
    {
      firstName: 'quicksand',
      lastName: 'fall',
      age: 11
    },
    {
      firstName: 'beggar',
      lastName: 'dinner',
      age: 4
    },
    {
      firstName: 'money',
      lastName: 'mind',
      age: 0
    }
  ];
};
