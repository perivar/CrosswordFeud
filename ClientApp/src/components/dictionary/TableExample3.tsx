import React, { useState } from 'react';
import produce, { Draft } from 'immer';
import { getUniqueData, Data } from './TableExampleData';
import '../shared/bulma-components/bulma-table.scss';
import BulmaTable, {
  SortableTableState,
  SortableTableColumn,
  SortableActionButton
} from '../shared/bulma-components/BulmaTable';

// render methods must have displayName
const renderIdUrl = (id: string) => {
  return <a href={'user/' + id}>{id}</a>;
};
renderIdUrl.displayName = 'RenderIdUrl';

const columns: SortableTableColumn[] = [
  {
    header: 'Id',
    key: 'id'
    // defaultSorting: 'ASC'
    // headerStyle: { fontSize: '15px', backgroundColor: '#FFDAB9', width: '100px' },
    // dataStyle: { fontSize: '15px', backgroundColor: '#CCCCCC' },
    // dataProps: { className: 'align-right' },
    // render: renderIdUrl
  },
  {
    header: 'Age',
    key: 'age',
    // headerStyle: { fontSize: '20px' },
    sortable: false
  },
  {
    header: 'First Name',
    key: 'firstName',
    defaultSorting: 'ASC',
    // headerStyle: { fontSize: '15px' },
    // headerProps: { className: 'align-left' }
    searchable: false
  },
  {
    header: 'Last Name',
    key: 'lastName'
    // headerStyle: { fontSize: '15px' },
    // headerProps: { className: 'align-left' }
  }
];

const style = {
  // backgroundColor: '#eee'
};

const iconStyle = {
  // color: '#aaa',
  // paddingLeft: '5px',
  // paddingRight: '5px'
};

// initial table state
const intialState: SortableTableState = {
  sortings: [],
  isAllSelected: false,
  checkboxes: {},
  filter: ''
};

export default function TableExample3() {
  // data state
  // have to memoize data to avoid triggering the effect all the time since the data object is changing every render
  // const data = useMemo(() => getUniqueData(), []);
  const [data, setData] = useState<Data[]>(() => getUniqueData());

  const [tableState, setTableState] = useState<SortableTableState>(intialState);

  // create action buttons
  const handleOnDeleteClick = () => {
    const ids = Object.keys(tableState.checkboxes).filter(id => tableState.checkboxes[id]);
    console.log('delete: ' + ids);
    setData(
      produce((draft: Draft<Data[]>) => {
        return draft.filter(element => !ids.includes(element.id!.toString()));
      })
    );
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
    style,
    iconStyle,
    actionButtons: actionButtons
  });

  return <>{bulmaTable}</>;
}
