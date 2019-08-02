import React, { useState } from 'react';
// import produce, { Draft } from 'immer';
import '../shared/bulma-components/bulma-table.scss';
import BulmaTable, {
  SortableTableState,
  SortableTableColumn,
  SortableActionButton,
  CellInfo
} from '../shared/bulma-components/BulmaTable';
import { BulmaEditableTextField } from '../shared/bulma-components/BulmaEditableTextField';

interface WordData {
  wordId: number;
  language: string;
  value: string;
  numberOfLetters: number;
  numberOfWords: number;
  relatedFrom: any[];
  relatedTo: any[];
  comment: string | null;
  createdDate: string;
  source: string;
}

// render methods must have displayName
const renderDateFormat = (dateObject: CellInfo) => {
  const d = new Date(dateObject.value);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  let dayString = day.toString();
  if (day < 10) {
    dayString = '0' + day;
  }

  let monthString = month.toString();
  if (month < 10) {
    monthString = '0' + month;
  }
  var date = dayString + '/' + monthString + '/' + year;

  return <>{date}</>;
};
renderDateFormat.displayName = 'DateFormat';

const handleValueChanged = (cellInfo: CellInfo, newValue: string) => {
  // use immer
  // this.setState(
  //   produce((draft: Draft<TableExample1State>) => {
  //     draft.data[cellInfo.index][cellInfo.column.id!] = newValue;
  //   })
  // );
  console.log(cellInfo);
  console.log('new value: ' + newValue);
};

const renderEditable = (cellInfo: CellInfo) => {
  return (
    <BulmaEditableTextField value={cellInfo.value} onValueChanged={value => handleValueChanged(cellInfo, value)} />
  );
};
renderEditable.displayName = 'Editable';

const handleSynonymSearch = (cellInfo: CellInfo, word: string) => {
  cellInfo.setUrl(
    "http://116.203.83.168:8000/odata/Words/Synonyms(Word='" +
      cellInfo.row.value +
      "')?%24orderby=WordId%20desc&%24top=50&%24count=true"
  );
};

const renderSynonymSearch = (cellInfo: CellInfo) => {
  return (
    <>
      <button
        type="button"
        className="button is-link is-outlined"
        value={cellInfo.value}
        onClick={e => handleSynonymSearch(cellInfo, e.currentTarget.value)}>
        {cellInfo.value}
      </button>
    </>
  );
};
renderSynonymSearch.displayName = 'SynonymSearch';

const columns: SortableTableColumn[] = [
  {
    header: 'Id',
    key: 'wordId',
    uniqueId: true,
    render: renderSynonymSearch
  },
  {
    header: 'Synonym',
    key: 'value',
    render: renderEditable
    // dataProps: { className: 'align-right' }
    // dataStyle: { verticalAlign: 'middle' }
  },
  {
    header: 'Ant. Ord',
    key: 'numberOfWords'
  },
  {
    header: 'Lengde',
    key: 'numberOfLetters'
  },
  {
    header: 'Bruker',
    key: 'comment'
  },
  {
    header: 'Dato',
    key: 'createdDate',
    render: renderDateFormat
  }
];

// initial table state
const intialState: SortableTableState = {
  sortings: [],
  isAllSelected: false,
  checkboxes: {},
  filter: ''
};

export default function TableExample3() {
  const [data, setData] = useState<WordData[]>(() => []);
  const [tableState, setTableState] = useState<SortableTableState>(intialState);

  // create action buttons
  const handleOnDeleteClick = () => {
    const ids = Object.keys(tableState.checkboxes).filter(id => tableState.checkboxes[id]);
    console.log('delete: ' + ids);
  };
  const deleteButton: React.ReactNode = SortableActionButton({
    label: 'Delete',
    key: 'deleteRows',
    classNames: 'is-danger',
    disabled: Object.keys(tableState.checkboxes).some(id => tableState.checkboxes[id]) ? false : true,
    handleOnClick: handleOnDeleteClick
  });

  const handleOnDisconnectClick = () => {
    const ids = Object.keys(tableState.checkboxes).filter(id => tableState.checkboxes[id]);
    console.log('disconnect: ' + ids);
  };
  const disconnectButton: React.ReactNode = SortableActionButton({
    label: 'Disconnect',
    key: 'disconnectRows',
    classNames: 'is-warning',
    disabled: Object.keys(tableState.checkboxes).some(id => tableState.checkboxes[id]) ? false : true,
    handleOnClick: handleOnDisconnectClick
  });

  const actionButtons: React.ReactNode[] = [deleteButton, disconnectButton];

  const bulmaTable = BulmaTable({
    columns,
    data,
    setData,
    tableState,
    setTableState,
    initialRowsPerPage: 15,
    initialUrl: 'http://116.203.83.168:8000/odata/Words?%24orderby=WordId%20desc&%24top=50&%24count=true',
    actionButtons: actionButtons
  });

  return <>{bulmaTable}</>;
}
