import React, { useState, useCallback } from 'react';
import produce, { Draft } from 'immer';
import '../shared/bulma-components/bulma-table.scss';
import BulmaTable, {
  SortableTableState,
  SortableTableColumn,
  SortableActionButton,
  RenderProps,
  getInitialSortings,
  ActionButtonProps,
  ActionButton,
  QueryParams
} from '../shared/bulma-components/BulmaTable';
import { BulmaEditableTextField } from '../shared/bulma-components/BulmaEditableTextField';
import { OdataFilter, OrderBy, OdataValues, getOdataQueryObject } from '../shared/hooks/odata-hook';

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

// column render methods
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
// renderDateFormat.displayName = 'DateFormat';

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
// renderEditable.displayName = 'Editable';

const handleSynonymSearch = (renderProps: RenderProps) => {
  // reset filter
  renderProps.setTableState(
    produce((draft: Draft<ExtendedTableState>) => {
      draft.filter = '';
      draft.extraInfo = renderProps.row.value;
    })
  );

  renderProps.setUrl("/odata/Words/Synonyms(Word='" + renderProps.row.value + "')");
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
// renderSynonymSearch.displayName = 'SynonymSearch';

// create action buttons
const renderDeleteButton = (renderProps: ActionButtonProps) => {
  const handleOnDeleteClick = () => {
    const ids = Object.keys(renderProps.tableState.checkboxes).filter(id => renderProps.tableState.checkboxes[id]);
    console.log('delete: ' + ids);
  };
  const deleteButton = SortableActionButton({
    label: 'Slett',
    key: 'deleteRows',
    classNames: 'is-danger',
    disabled: Object.keys(renderProps.tableState.checkboxes).some(id => renderProps.tableState.checkboxes[id])
      ? false
      : true,
    handleOnClick: handleOnDeleteClick
  });

  return deleteButton;
};

const renderDisconnectButton = (renderProps: ActionButtonProps) => {
  const handleOnDisconnectClick = () => {
    const ids = Object.keys(renderProps.tableState.checkboxes).filter(id => renderProps.tableState.checkboxes[id]);
    console.log('disconnect: ' + ids);
  };
  const disconnectButton = SortableActionButton({
    label: 'Koble fra',
    key: 'disconnectRows',
    classNames: 'is-warning',
    disabled: Object.keys(renderProps.tableState.checkboxes).some(id => renderProps.tableState.checkboxes[id])
      ? false
      : true,
    handleOnClick: handleOnDisconnectClick
  });

  return disconnectButton;
};

const renderResetButton = (renderProps: ActionButtonProps) => {
  const handleResetClick = () => {
    renderProps.setTableState(
      produce((draft: Draft<ExtendedTableState>) => {
        draft.filter = '';
        draft.sortings = getInitialSortings(columns);
        draft.extraInfo = '';
      })
    );

    renderProps.setUrl('/odata/Words');
  };
  const resetButton = SortableActionButton({
    label: 'Tilbakestill',
    key: 'resetRows',
    classNames: 'is-primary',
    disabled: false,
    handleOnClick: handleResetClick
  });

  return resetButton;
};

const actionButtons: ActionButton[] = [
  {
    key: 'deleteRows',
    render: renderDeleteButton
  },
  {
    key: 'disconectRows',
    render: renderDisconnectButton
  },
  {
    key: 'resetRows',
    render: renderResetButton
  }
];

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

// convert QueryParams2ODataValues
const convertQueryParamsToODataValues = (params: QueryParams): OdataValues => {
  const top = params && params.limit;
  const skip = params && params.offset;
  const filters: OdataFilter[] | undefined =
    params && params.search
      ? [
          {
            name: 'Value',
            operation: 'contains',
            value: params.search,
            dataType: 'string'
          }
        ]
      : undefined;
  const orderBy: OrderBy[] | undefined =
    params && params.sort && params.order
      ? [
          {
            name: params.sort,
            direction: params.order === 'asc' ? 'asc' : params.order === 'desc' ? 'desc' : 'asc'
          }
        ]
      : undefined;

  return { top, skip, filters, orderBy, count: true };
};

interface ExtendedTableState extends SortableTableState {
  extraInfo?: string;
}

// initial table state
const intialState: ExtendedTableState = {
  sortings: getInitialSortings(columns),
  isAllSelected: false,
  checkboxes: {},
  filter: '',
  extraInfo: ''
};

export default function TableExample3() {
  const [data, setData] = useState<WordData[]>(() => []);
  const [tableState, setTableState] = useState<ExtendedTableState>(intialState);

  const queryParams = useCallback((params: QueryParams) => {
    return getOdataQueryObject(convertQueryParamsToODataValues(params));
  }, []);

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

  const renderShowing = useCallback((fromRow: number, toRow: number, numberOfRows: number) => {
    return (
      <>
        Viser {fromRow} til {toRow} av {numberOfRows} treff
      </>
    );
  }, []);

  const renderNumberOfRows = useCallback((numberOfRows: number, tableState: ExtendedTableState) => {
    return (
      <>
        {tableState.extraInfo ? (
          <p>
            Fant <strong>{numberOfRows}</strong> synonym til {tableState.extraInfo}
          </p>
        ) : (
          <p>
            Viser <strong>{numberOfRows}</strong> ord
          </p>
        )}
      </>
    );
  }, []);

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
    // url: '/odata/Words?%24orderby=WordId%20desc&%24top=50&%24count=true',
    sidePagination: 'server',
    sortOrder: 'desc',
    queryParams: queryParams,
    responseHandler: res => {
      return {
        total: res['@odata.count'],
        rows: res.value
      };
    },
    actionButtons: actionButtons,
    previousText: 'Forrige',
    nextText: 'Neste',
    rowsPerPageText: 'rader på hver side',
    renderShowing: renderShowing,
    findInText: 'Finn',
    searchText: 'Søk',
    elementsText: 'treff',
    renderNumberOfRows
  });

  return <>{bulmaTable}</>;
}
