import React, { Component, ChangeEvent } from 'react';
import { SortingType, SortableTableColumn, SortableTableData, SortableCheckboxMap } from './sortable-table';
import Checkbox from './Checkbox';

interface SortableTableRowProps {
  index: number;
  data: SortableTableData;
  columns: SortableTableColumn[];
  sortings: SortingType[];
  onCheckboxChange: (changeEvent: ChangeEvent<HTMLInputElement>) => void;
  isSelected: boolean;
}

class SortableTableRow extends Component<SortableTableRowProps> {
  // only render the row if the sorting or the checking has changed
  shouldComponentUpdate(nextProps: SortableTableRowProps, nextState: SortableTableRowProps) {
    if (this.props.isSelected !== nextProps.isSelected) {
      return true;
    }
    if (this.props.sortings !== nextProps.sortings) {
      return true;
    }
    return false;
  }

  render() {
    const { data, columns } = this.props;
    console.log(`render TableRow :: ${data.id}`);
    const tds = columns.map(function(column: SortableTableColumn, index: number) {
      let value = data[column.key];
      if (column.render) {
        value = column.render(value);
      }
      return (
        <td key={index} style={column.dataStyle} {...(column.dataProps || {})}>
          {value}
        </td>
      );
    });

    const checkbox = (
      <td>
        <Checkbox
          key={this.props.data.id}
          name={this.props.data.id.toString()}
          isSelected={this.props.isSelected}
          onCheckboxChange={this.props.onCheckboxChange}
        />
      </td>
    );

    return (
      <tr>
        {checkbox}
        {tds}
      </tr>
    );
  }
}

interface SortableTableBodyProps {
  data: SortableTableData;
  columns: SortableTableColumn[];
  sortings: SortingType[];
  checkboxes: SortableCheckboxMap;
  onCheckboxChange: (changeEvent: ChangeEvent<HTMLInputElement>) => void;
  isAllSelected: boolean;
}

export default class SortableTableBody extends Component<SortableTableBodyProps> {
  render() {
    const bodies = this.props.data.map((item: any, index: number) => {
      return (
        <SortableTableRow
          key={index}
          index={index}
          data={item}
          columns={this.props.columns}
          sortings={this.props.sortings}
          onCheckboxChange={this.props.onCheckboxChange}
          isSelected={this.props.checkboxes[item.id]}
        />
      );
    });

    return <tbody>{bodies}</tbody>;
  }
}
