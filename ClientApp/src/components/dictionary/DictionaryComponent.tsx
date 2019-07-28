import React, { Component, useEffect, useRef, SyntheticEvent, CSSProperties } from 'react';
import ReactTable, { Column, RowInfo, CellInfo } from 'react-table';
import selectTableHOC, {
  SelectTableAdditionalProps,
  SelectAllInputComponentProps,
  SelectInputComponentProps
} from 'react-table/lib/hoc/selectTable';

import 'react-table/react-table.css';
import './my-react-table.scss';
import { useEditableState, UseEditableStateArguments, EditableState } from '../shared/hooks/editable-hook';
import { useKeyboardEvent } from '../shared/hooks/keyboard-hook';
import { useOutsideClick } from '../shared/hooks/outside-click-hook';
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
  data: any[];
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

const EditableTextField = ({ value, onValueChanged }: UseEditableStateArguments<string>) => {
  const {
    onEditBegin,
    onEditConfirm,
    onEditCancel,
    isEditing,
    editValue,
    setEditValue
  }: EditableState<string> = useEditableState({
    value,
    onValueChanged
  });

  // creating the ref by passing initial value null
  // The type of our ref is an input element
  const editInputRef = useRef<HTMLInputElement>(null);

  // The function passed to useEffect will run after the render is committed to the screen.
  // 1. If you don’t pass an array into the useEffect Hook, your component will continuously reload repeatedly.
  // 2. If you pass an empty array, we are not watching any variables, and therefore it will only update state on the first render, exactly like componentDidMount.
  // 3. By default, useEffect looks to see if the array values are different and if they are different, the arrow function is automatically called.
  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  });

  // add handlers for escape and return keys
  const cancelEditHandler = (event: KeyboardEvent) => {
    if (isEditing) {
      onEditCancel();
    }
  };

  const confirmEditHandler = (event: KeyboardEvent) => {
    if (isEditing) {
      onEditConfirm();
    }
  };

  useKeyboardEvent('Escape', cancelEditHandler);
  useKeyboardEvent('Enter', confirmEditHandler);

  // add handlers for clicking outside the input element
  const editWrapperRef = useRef<HTMLDivElement>(null);

  // add handler for clicking outside the input
  useOutsideClick(editWrapperRef, () => {
    if (isEditing) {
      onEditCancel();
    }
  });

  // add onClick handler to the a href
  const handleClick = (e: SyntheticEvent) => {
    e.preventDefault();
    onEditBegin();
  };

  const onEditClear = (e: SyntheticEvent) => {
    e.preventDefault();
    setEditValue('');
  };

  const inputStyle: CSSProperties = {
    // width: '80%'
  };

  if (isEditing) {
    return (
      <form>
        <div className="field is-grouped" ref={editWrapperRef}>
          <div className="control is-expanded has-icons-right">
            <input
              type="text"
              className="input is-small"
              ref={editInputRef}
              value={editValue}
              onChange={event => setEditValue(event.target.value)}
              style={inputStyle}
            />
            <button type="button" className="icon is-right editable-clear is-small" onClick={onEditClear}>
              <i className="fas fa-times fa-xs" />
            </button>
          </div>
          <p className="control">
            <button type="button" className="button is-info is-small" onClick={onEditConfirm}>
              <i className="fas fa-check" />
            </button>
            <button type="button" className="button is-small" onClick={onEditCancel}>
              <i className="fas fa-times" />
            </button>
          </p>
        </div>
      </form>
    );
  } else {
    return (
      // <button type="button" className="btn btn-link editable-click" onClick={onEditBegin}>
      //   {value}
      // </button>
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a href="#" className="editable-click" onClick={handleClick}>
        {value ? value : <i>Empty</i>}
      </a>
    );
  }
};

export default class DictionaryComponent extends Component<DictionaryComponentProps, DictionaryComponentState> {
  private selectTable: any = null; // add any to avoid getWrappedInstance() might be null

  constructor(props: DictionaryComponentProps) {
    super(props);
    this.state = {
      data: getUniqueData(),
      selection: [],
      selectAll: false
    };
  }

  handleValueChanged = (cellInfo: CellInfo, newValue: string) => {
    // let data = [...this.state.data];
    // data[cellInfo.index][cellInfo.column.id!] = newValue;
    // this.setState({ data });

    this.setState(prevState => ({
      data: {
        ...prevState.data,
        [cellInfo.index]: {
          ...prevState.data[cellInfo.index],
          [cellInfo.column.id!]: newValue
        }
      }
    }));
  };

  renderEditable = (cellInfo: CellInfo) => {
    return <EditableTextField value={cellInfo.value} onValueChanged={this.handleValueChanged.bind(null, cellInfo)} />;
  };

  toggleSelection = (key: string, shiftKeyPressed: boolean, row: string) => {
    this.setState(prevState => {
      let selection = [...prevState.selection];

      const keyIndex = selection.indexOf(key);

      // check to see if the key exists
      if (keyIndex >= 0) {
        // it does exist so we will remove it using destructing
        selection = [...selection.slice(0, keyIndex), ...selection.slice(keyIndex + 1)];
      } else {
        // it does not exist so add it
        selection.push(key);
      }

      return { selection };
    });
  };

  toggleAll = () => {
    const { keyField } = selectTableAdditionalProps;

    this.setState(prevState => {
      // toggle
      const selectAll = !prevState.selectAll;

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

      return { selectAll, selection };
    });
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
        // onClick: (e: any, handleOriginal: any) => {
        //   console.log('It was in this row:', rowInfo);

        //   // toggle selection
        //   // this.toggleSelection(`select-${rowInfo.original.id}`, false, '');

        //   // IMPORTANT! React-Table uses onClick internally to trigger
        //   // events like expanding SubComponents and pivots.
        //   // By default a custom 'onClick' handler will override this functionality.
        //   // If you want to fire the original onClick handler, call the
        //   // 'handleOriginal' function.
        //   if (handleOriginal) {
        //     handleOriginal();
        //   }
        // },
        // style: {
        //   background: rowInfo && selection.includes(`select-${rowInfo.original.id}`) && 'lightgreen'
        // }
        className: rowInfo && selection.includes(`select-${rowInfo.original.id}`) ? 'has-background-grey-lighter' : ''
      };
    } else {
      return {};
    }
  };

  render() {
    const columns: Column[] = [
      { Header: 'ID', accessor: 'id', maxWidth: 100, className: 'has-text-centered' },
      { Header: 'First Name', accessor: 'firstName', minWidth: 200, Cell: this.renderEditable },
      { Header: 'Last Name', accessor: 'lastName', minWidth: 200, Cell: this.renderEditable },
      { Header: 'Age', accessor: 'age', maxWidth: 100, className: 'has-text-centered' }
    ];

    return (
      <SelectTable
        {...selectTableAdditionalProps}
        data={this.state.data}
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
        className="-striped -highlight has-text-left"
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
