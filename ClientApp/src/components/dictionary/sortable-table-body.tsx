import React, { Component } from 'react';
import { SortingType, SortableTableColumn, SortableTableData } from './sortable-table';

interface SortableTableRowProps {
  data: SortableTableData;
  columns: SortableTableColumn[];
}

class SortableTableRow extends Component<SortableTableRowProps> {
  render() {
    let myData = this.props.data;
    var tds = this.props.columns.map(function(column: SortableTableColumn, index: number) {
      var value = myData[column.key];
      if (column.render) {
        value = column.render(value);
      }
      return (
        <td key={index} style={column.dataStyle} {...(column.dataProps || {})}>
          {value}
        </td>
      );
    });

    return <tr>{tds}</tr>;
  }
}

interface SortableTableBodyProps {
  data: SortableTableData;
  columns: SortableTableColumn[];
  sortings: SortingType[];
}

export default class SortableTableBody extends Component<SortableTableBodyProps> {
  render() {
    var bodies = this.props.data.map((item: any, index: number) => {
      return <SortableTableRow key={index} data={item} columns={this.props.columns} />;
    });

    return <tbody>{bodies}</tbody>;
  }
}
