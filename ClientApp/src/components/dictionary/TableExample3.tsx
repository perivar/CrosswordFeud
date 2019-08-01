import React, { useState, useEffect } from 'react';
// import produce, { Draft } from 'immer';
import '../shared/bulma-components/bulma-table.scss';
import BulmaTable, {
  SortableTableState,
  SortableTableColumn,
  SortableActionButton
} from '../shared/bulma-components/BulmaTable';
import { useDataApi } from '../shared/hooks/data-api-hook';

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

const columns: SortableTableColumn[] = [
  {
    header: 'Id',
    key: 'wordId',
    uniqueId: true
  },
  {
    header: 'Synonym',
    key: 'value'
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
    key: 'createdDate'
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

  // data api for reading data over ODATA
  const { response } = useDataApi({
    // , isLoading, isError, error, setUrl
    initialUrl: 'http://116.203.83.168:8000/odata/Words?%24top=100&%24count=true'
  });

  // instead of using the callback in the data api hook we can use the useEffect hook to monitor the response
  useEffect(() => {
    if (response) {
      console.log('useEffect() being executed (response)');
      // console.log(response);

      const localData = response.data.value;
      const localTotalCount = response.data['@odata.count'];
      setData(localData);
    }
  }, [response]);

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
    tableState,
    setTableState,
    actionButtons: actionButtons
  });

  return <>{bulmaTable}</>;
}
