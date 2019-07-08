import React, { Component } from 'react';
import SortableTableHeader from './sortable-table-header';
import SortableTableBody from './sortable-table-body';

interface SortableTableProps {
  data: any[];
  columns: any[];
  style?: any;
  iconStyle?: any;
  iconDesc?: any;
  iconAsc?: any;
  iconBoth?: any;
}

interface SortableTableState {
  sortings: any;
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

  getDefaultSortings(props: SortableTableProps) {
    return props.columns.map((column: any) => {
      let sorting = 'both';
      if (column.defaultSorting) {
        const defaultSorting = column.defaultSorting.toLowerCase();

        if (defaultSorting === 'desc') {
          sorting = 'desc';
        } else if (defaultSorting === 'asc') {
          sorting = 'asc';
        }
      }
      return sorting;
    });
  }

  sortData(data: any[], sortings: string[]) {
    let sortedData = this.props.data;
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

  ascSortData(data: any[], key: string): any[] {
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

  descSortData(data: any[], key: string): any[] {
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

  parseFloatable(value: any) {
    return typeof value === 'string' && (/^\d+$/.test(value) || /^\d+$/.test(value.replace(/[,.%$]/g, '')))
      ? true
      : false;
  }

  parseIfFloat(value: any) {
    return parseFloat(value.replace(/,/g, ''));
  }

  sortDataByKey(data: any[], key: string, fn: any): any[] {
    const clone = Array.apply(null, data);

    return clone.sort((a: any, b: any) => {
      return fn(a[key], b[key]);
    });
  }

  onStateChange(index: number) {
    const sortings = this.state.sortings.map((sorting: any, i: number) => {
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

  nextSortingState(state: string) {
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
    return next;
  }

  render() {
    const sortedData = this.sortData(this.props.data, this.state.sortings);

    return (
      <table className="table" style={this.props.style}>
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
