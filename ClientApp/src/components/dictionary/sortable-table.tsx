import React, { Component, CSSProperties } from 'react';
import SortableTableHeader from './sortable-table-header';
import SortableTableBody from './sortable-table-body';

export type SortingType = 'desc' | 'asc' | 'both';

export interface SortableTableData {
  [key: string]: any;
}

export interface SortableTableColumn {
  header: string;
  key: string;
  defaultSorting?: string; // ASC or asc or DESC or desc
  headerStyle?: CSSProperties; // { fontSize: '15px', backgroundColor: '#FFDAB9', width: '100px' },
  headerProps?: CSSProperties; // { className: 'align-left' },
  dataStyle?: CSSProperties; // { fontSize: '15px', backgroundColor: '#FFDAB9' },
  dataProps?: CSSProperties; // { className: 'align-right' },
  sortable?: boolean;
  render?: (id: number) => JSX.Element;
  descSortFunction?: (sortedData: SortableTableData, key: string) => SortableTableData;
  ascSortFunction?: (sortedData: SortableTableData, key: string) => SortableTableData;
}

export interface SortableTableIconInfo {
  iconStyle?: CSSProperties;
  iconDesc?: JSX.Element;
  iconAsc?: JSX.Element;
  iconBoth?: JSX.Element;
}

interface SortableTableProps extends SortableTableIconInfo {
  data: SortableTableData;
  columns: SortableTableColumn[];
  style?: CSSProperties;
}

interface SortableTableState {
  sortings: SortingType[];
}

export default class SortableTable extends Component<SortableTableProps, SortableTableState> {
  constructor(props: SortableTableProps) {
    super(props);

    this.state = {
      sortings: this.getDefaultSortings(props)
    };

    // This binding is necessary to make `this` work in the callback
    this.onStateChange = this.onStateChange.bind(this);
  }

  getDefaultSortings(props: SortableTableProps): SortingType[] {
    return props.columns.map((column: SortableTableColumn) => {
      let sorting = 'both';
      if (column.defaultSorting) {
        const defaultSorting = column.defaultSorting.toLowerCase();

        if (defaultSorting === 'desc') {
          sorting = 'desc';
        } else if (defaultSorting === 'asc') {
          sorting = 'asc';
        }
      }
      return sorting as SortingType;
    });
  }

  sortData(data: SortableTableData, sortings: string[]): SortableTableData {
    // let sortedData = this.props.data;
    let sortedData = data;
    for (var i in sortings) {
      const sorting = sortings[i];
      const column = this.props.columns[i];
      const key = this.props.columns[i].key;
      switch (sorting) {
        case 'desc':
          if (column.descSortFunction && typeof column.descSortFunction == 'function') {
            sortedData = column.descSortFunction(sortedData, key);
          } else {
            sortedData = this.descSortData(sortedData, key);
          }
          break;
        case 'asc':
          if (column.ascSortFunction && typeof column.ascSortFunction == 'function') {
            sortedData = column.ascSortFunction(sortedData, key);
          } else {
            sortedData = this.ascSortData(sortedData, key);
          }
          break;
      }
    }
    return sortedData;
  }

  ascSortData(data: SortableTableData, key: string): SortableTableData {
    return this.sortDataByKey(data, key, (a: any, b: any) => {
      if (this.parseFloatable(a) && this.parseFloatable(b)) {
        a = this.parseIfFloat(a);
        b = this.parseIfFloat(b);
      }
      if (a >= b) {
        return 1;
      } else if (a < b) {
        return -1;
      }
    });
  }

  descSortData(data: SortableTableData, key: string): SortableTableData {
    return this.sortDataByKey(data, key, (a: any, b: any) => {
      if (this.parseFloatable(a) && this.parseFloatable(b)) {
        a = this.parseIfFloat(a);
        b = this.parseIfFloat(b);
      }
      if (a <= b) {
        return 1;
      } else if (a > b) {
        return -1;
      }
    });
  }

  parseFloatable(value: any): boolean {
    return typeof value === 'string' && (/^\d+$/.test(value) || /^\d+$/.test(value.replace(/[,.%$]/g, '')))
      ? true
      : false;
  }

  parseIfFloat(value: any): number {
    return parseFloat(value.replace(/,/g, ''));
  }

  sortDataByKey(data: SortableTableData, key: string, fn: any): SortableTableData {
    const clone = Array.apply(null, data as any);

    return clone.sort((a: any, b: any) => {
      return fn(a[key], b[key]);
    });
  }

  onStateChange(index: number) {
    const sortings = this.state.sortings.map((sorting: SortingType, i: number) => {
      // set next sorting type for the selected sorting
      // the others need to be reset back to both
      if (i === index) {
        sorting = this.nextSortingState(sorting);
      } else {
        sorting = 'both';
      }

      return sorting;
    });

    this.setState({
      sortings
    });
  }

  nextSortingState(state: SortingType): SortingType {
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
  }

  render() {
    const sortedData = this.sortData(this.props.data, this.state.sortings);

    return (
      <table className="table table-bordered" style={this.props.style}>
        <SortableTableHeader
          columns={this.props.columns}
          sortings={this.state.sortings}
          onStateChange={this.onStateChange}
          iconStyle={this.props.iconStyle}
          iconDesc={this.props.iconDesc}
          iconAsc={this.props.iconAsc}
          iconBoth={this.props.iconBoth}
        />
        <SortableTableBody columns={this.props.columns} data={sortedData} sortings={this.state.sortings} />
      </table>
    );
  }
}
