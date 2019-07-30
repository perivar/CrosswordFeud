import React, { Dispatch, SetStateAction, ChangeEvent } from 'react';
import './bulma-table.scss';
import produce, { Draft } from 'immer';
import { BulmaCheckboxField } from './BulmaCheckboxField';

export type SortingType = 'desc' | 'asc' | 'both';

export interface SortableTableData {
  [key: string]: any;
}

export interface SortableCheckboxMap {
  [key: string]: boolean;
}

export interface SortableTableColumn {
  header: string;
  key: string;
  defaultSorting?: string; // ASC or asc or DESC or desc
  sortable?: boolean;
  // render?: (id: string) => JSX.Element;
  descSortFunction?: (sortedData: SortableTableData, key: string) => SortableTableData;
  ascSortFunction?: (sortedData: SortableTableData, key: string) => SortableTableData;
}

interface SortableTableHeaderProps {
  columns: SortableTableColumn[];
  tableState: SortableTableState;
  setTableState: Dispatch<SetStateAction<SortableTableState>>;
  handleCheckboxChange: (changeEvent: ChangeEvent<HTMLInputElement>) => void;
}

const SortableTableHeader = ({
  columns,
  tableState,
  setTableState,
  handleCheckboxChange
}: SortableTableHeaderProps) => {
  const headers = columns.map((column: SortableTableColumn, index: number) => {
    const sorting = tableState.sortings[index];

    const handleHeaderClick = () => {
      if (column.sortable || column.sortable === undefined) {
        setTableState(
          produce((draft: Draft<SortableTableState>) => {
            draft.sortings = draft.sortings.map((sorting: SortingType, i: number) => {
              // set next sorting type for the selected sorting
              // the others need to be reset back to both
              if (i === index) {
                sorting = nextSortingState(sorting);
              } else {
                sorting = 'both';
              }
              return sorting;
            });
          })
        );
      }
    };

    // default to being sortable (i.e. undefined)
    let sortIcon;
    if (column.sortable || column.sortable === undefined) {
      sortIcon = (
        <span className="icon has-text-grey-light">
          <i className="fas fa-sort" />
        </span>
      );
      if (sorting === 'desc') {
        sortIcon = (
          <span className="icon has-text-grey-light">
            <i className="fas fa-sort-up" />
          </span>
        );
      } else if (sorting === 'asc') {
        sortIcon = (
          <span className="icon has-text-grey-light">
            <i className="fas fa-sort-down" />
          </span>
        );
      }
    }
    return (
      <th key={column.key} onClick={handleHeaderClick}>
        {column.header}
        {sortIcon}
      </th>
    );
  });

  const name = 'checkAll';
  const checkbox = (
    <th>
      <BulmaCheckboxField
        label=""
        name={name}
        checked={tableState.isAllSelected}
        handleChange={handleCheckboxChange}
        checkboxProps={{ 'aria-label': `${tableState.isAllSelected ? 'Un-select all' : 'Select all'}` }}
      />
    </th>
  );

  return (
    <thead>
      <tr>
        {checkbox}
        {headers}
      </tr>
    </thead>
  );
};

interface SortableTableBodyProps {
  columns: SortableTableColumn[];
  data: SortableTableData;
  tableState: SortableTableState;
  setTableState: Dispatch<SetStateAction<SortableTableState>>;
  handleCheckboxChange: (changeEvent: ChangeEvent<HTMLInputElement>) => void;
}

const SortableTableBody = ({
  columns,
  data,
  tableState,
  setTableState,
  handleCheckboxChange
}: SortableTableBodyProps) => {
  const bodies = data.map((item: any) => {
    console.log(`render table row :: ${item.id}`);

    const tds = columns.map((column: SortableTableColumn) => {
      const value = item[column.key];
      return <td key={`${item.id}-${column.key}`}>{value}</td>;
    });

    const isRowSelected = tableState.checkboxes[item.id];
    const checkbox = (
      <td>
        <BulmaCheckboxField
          label=""
          name={`${item.id}`}
          checked={isRowSelected}
          handleChange={handleCheckboxChange}
          checkboxProps={{ 'aria-label': `${isRowSelected ? 'Un-select' : 'Select'} row with id: ${item.id}` }}
        />
      </td>
    );

    return (
      <tr key={item.id}>
        {checkbox}
        {tds}
      </tr>
    );
  });

  return <tbody>{bodies}</tbody>;
};

const parseFloatable = (value: any): boolean => {
  return typeof value === 'string' && (/^\d+$/.test(value) || /^\d+$/.test(value.replace(/[,.%$]/g, '')))
    ? true
    : false;
};

const parseIfFloat = (value: any): number => {
  return parseFloat(value.replace(/,/g, ''));
};

const ascSortData = (data: SortableTableData, key: string): SortableTableData => {
  return sortDataByKey(data, key, (a: any, b: any) => {
    if (parseFloatable(a) && parseFloatable(b)) {
      a = parseIfFloat(a);
      b = parseIfFloat(b);
    }
    if (a >= b) {
      return 1;
    } else if (a < b) {
      return -1;
    }
  });
};

const descSortData = (data: SortableTableData, key: string): SortableTableData => {
  return sortDataByKey(data, key, (a: any, b: any) => {
    if (parseFloatable(a) && parseFloatable(b)) {
      a = parseIfFloat(a);
      b = parseIfFloat(b);
    }
    if (a <= b) {
      return 1;
    } else if (a > b) {
      return -1;
    }
  });
};

const sortData = (data: SortableTableData, columns: SortableTableColumn[], sortings: string[]): SortableTableData => {
  let sortedData = data;
  for (var i in sortings) {
    const sorting = sortings[i];
    const column = columns[i];
    const key = columns[i].key;
    switch (sorting) {
      case 'desc':
        if (column.descSortFunction && typeof column.descSortFunction == 'function') {
          sortedData = column.descSortFunction(sortedData, key);
        } else {
          sortedData = descSortData(sortedData, key);
        }
        break;
      case 'asc':
        if (column.ascSortFunction && typeof column.ascSortFunction == 'function') {
          sortedData = column.ascSortFunction(sortedData, key);
        } else {
          sortedData = ascSortData(sortedData, key);
        }
        break;
    }
  }
  return sortedData;
};

const sortDataByKey = (data: SortableTableData, key: string, fn: any): SortableTableData => {
  const clone = Array.apply(null, data as any);

  return clone.sort((a: any, b: any) => {
    return fn(a[key], b[key]);
  });
};

const nextSortingState = (state: SortingType): SortingType => {
  let next;
  switch (state) {
    case 'both':
      next = 'desc';
      break;
    case 'desc':
      next = 'asc';
      break;
    case 'asc':
      next = 'both';
      break;
  }
  return next as SortingType;
};

export interface SortableTableState {
  sortings: SortingType[];
  isAllSelected: boolean;
  checkboxes: SortableCheckboxMap;
}

interface BulmaTableProps {
  data: SortableTableData;
  columns: SortableTableColumn[];
  tableState: SortableTableState;
  setTableState: Dispatch<SetStateAction<SortableTableState>>;
}

export default function BulmaTable({ columns, data, tableState, setTableState }: BulmaTableProps) {
  const handleCheckboxChange = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    const { name: id } = changeEvent.target;

    if (id === 'checkAll') {
      setTableState(
        produce((draft: Draft<SortableTableState>) => {
          // toggle isAllSelected
          draft.isAllSelected = !draft.isAllSelected;

          // and update all checkboxes
          Object.keys(draft.checkboxes).forEach(id => {
            draft.checkboxes[id] = draft.isAllSelected;
          });
        })
      );
    } else {
      setTableState(
        produce((draft: Draft<SortableTableState>) => {
          // only toggle the given id
          draft.checkboxes[id] = !draft.checkboxes[id];

          // check if all is selected
          draft.isAllSelected = Object.keys(draft.checkboxes).every(id => draft.checkboxes[id]);
        })
      );
    }
  };

  const sortableTableHeader = SortableTableHeader({
    columns,
    tableState,
    setTableState,
    handleCheckboxChange
  });

  const sortedData = sortData(data, columns, tableState.sortings);
  const sortableTableBody = SortableTableBody({
    columns,
    data: sortedData,
    tableState,
    setTableState,
    handleCheckboxChange
  });

  return (
    <>
      <div className="table-container">
        <table className="table is-bordered is-striped is-hoverable is-fullwidth">
          {sortableTableHeader}
          {sortableTableBody}
        </table>
      </div>
    </>
  );
}
