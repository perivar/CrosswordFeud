import React, { Component } from 'react';

interface SortableTableRowProps {
  data: any[];
  columns: any[];
}

class SortableTableRow extends Component<SortableTableRowProps, any> {
  render() {
    let myData = this.props.data;
    var tds = this.props.columns.map(function(item: any, index: number) {
      var value = myData[item.key];
      if (item.render) {
        value = item.render(value);
      }
      return (
        <td key={index} style={item.dataStyle} {...(item.dataProps || {})}>
          {value}
        </td>
      );
    });

    return <tr>{tds}</tr>;
  }
}

interface SortableTableBodyProps {
  data: any[];
  columns: any[];
  sortings: any[];
}

export default class SortableTableBody extends Component<SortableTableBodyProps, any> {
  render() {
    var bodies = this.props.data.map((item: any, index: number) => {
      return <SortableTableRow key={index} data={item} columns={this.props.columns} />;
    });

    return <tbody>{bodies}</tbody>;
  }
}
