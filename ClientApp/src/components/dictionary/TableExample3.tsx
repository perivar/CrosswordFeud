import React, { useState, useCallback } from 'react';
// import produce, { Draft } from 'immer';
import '../shared/bulma-components/bulma-table.scss';
import BulmaTable, {
  SortableTableState,
  SortableTableColumn,
  SortableActionButton,
  RenderProps,
  QueryParams,
  getInitialSortings
} from '../shared/bulma-components/BulmaTable';
import { BulmaEditableTextField } from '../shared/bulma-components/BulmaEditableTextField';
import { useOdata } from '../shared/hooks/odata-hook';

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
const renderDateFormat = (dateObject: RenderProps) => {
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

const handleValueChanged = (renderProps: RenderProps, newValue: string) => {
  // use immer
  // this.setState(
  //   produce((draft: Draft<TableExample1State>) => {
  //     draft.data[renderProps.index][renderProps.column.id!] = newValue;
  //   })
  // );
  console.log(renderProps);
  console.log('new value: ' + newValue);
};

const renderEditable = (renderProps: RenderProps) => {
  return (
    <BulmaEditableTextField
      value={renderProps.value}
      onValueChanged={value => handleValueChanged(renderProps, value)}
    />
  );
};
renderEditable.displayName = 'Editable';

const handleSynonymSearch = (renderProps: RenderProps) => {
  renderProps.setUrl(
    // "/odata/Words/Synonyms(Word='" + renderProps.row.value + "')?%24orderby=WordId%20desc&%24top=50&%24count=true"
    "/odata/Words/Synonyms(Word='" + renderProps.row.value + "')"
  );
};

const renderSynonymSearch = (renderProps: RenderProps) => {
  return (
    <>
      <button
        type="button"
        className="button is-link is-outlined is-fullwidth"
        value={renderProps.value}
        onClick={() => handleSynonymSearch(renderProps)}>
        {renderProps.value}
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
  sortings: getInitialSortings(columns),
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

  // const { query, setTop, setSkip, setFilters, setOrderBy } = useOdata({});
  // const queryParams = useCallback(
  //   (params: QueryParams): string => {
  //     setTop(params.limit);
  //     setSkip(params.offset);
  //     setFilters([
  //       {
  //         name: 'Value',
  //         operation: 'contains',
  //         value: params.search,
  //         dataType: 'string'
  //       }
  //     ]);
  //     setOrderBy([
  //       {
  //         name: params.sort,
  //         direction: params.order === 'asc' ? 'asc' : params.order === 'desc' ? 'desc' : 'asc'
  //       }
  //     ]);
  //     return query;
  //   },
  //   [query, setFilters, setOrderBy, setSkip, setTop]
  // );

  // const queryParams = useCallback((params: QueryParams) => {
  //   return {
  //     $filter: params.search === '' ? undefined : "contains(Value,'" + params.search + "')",
  //     $orderby:
  //       (params.sort === undefined ? 'wordId' : params.sort) +
  //       ' ' +
  //       (params.order === undefined ? 'desc' : params.order),
  //     $skip: params.offset,
  //     $top: params.limit,
  //     $count: true
  //   };
  // }, []);

  const bulmaTable = BulmaTable({
    columns,
    data,
    setData,
    tableState,
    setTableState,
    pagination: true,
    search: true,
    pageSize: 10,
    baseUrl: 'http://localhost:5000',
    url: '/odata/Words',
    sidePagination: 'server',
    sortOrder: 'desc',
    queryParams: function(params) {
      return {
        $filter: params.search === '' ? undefined : "contains(Value,'" + params.search + "')",
        $orderby:
          (params.sort === undefined ? 'wordId' : params.sort) +
          ' ' +
          (params.order === undefined ? 'desc' : params.order),
        $skip: params.offset,
        $top: params.limit,
        $count: true
      };
    },
    responseHandler: function(res: any) {
      return {
        total: res['@odata.count'],
        rows: res.value
      };
    },
    actionButtons: actionButtons
  });

  return <>{bulmaTable}</>;
}
