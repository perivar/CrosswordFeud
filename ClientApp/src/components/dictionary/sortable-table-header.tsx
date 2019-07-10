import React, { Component, CSSProperties, ChangeEvent } from 'react';
import { SortIconBoth, SortIconDesc, SortIconAsc } from './sortable-table-icons';
import { SortingType, SortableTableColumn, SortableTableIconInfo, SortableCheckboxMap } from './sortable-table';
import Checkbox from './Checkbox';

interface ISortableTableHeaderItemProps extends SortableTableIconInfo {
  headerProps?: any;
  sortable?: boolean;
  sorting?: SortingType;
  style?: CSSProperties;
  header?: any;

  index: number;
  onClick: (index: number) => void;
}

class SortableTableHeaderItem extends Component<ISortableTableHeaderItemProps> {
  // constructor(props: ISortableTableHeaderItemProps) {
  //   super(props);

  //   // This binding is necessary to make `this` work in the callback
  //   // unless we use arrow functions
  //   this.onClick = this.onClick.bind(this);
  // }

  static defaultProps: Partial<ISortableTableHeaderItemProps> = {
    headerProps: {},
    sortable: true
  };

  // notice that this is an arrow function to avoid having to bind this in constructor.
  onClick = () => {
    if (this.props.sortable) this.props.onClick(this.props.index);
  };

  render() {
    let sortIcon;
    if (this.props.sortable) {
      if (this.props.iconBoth) {
        sortIcon = this.props.iconBoth;
      } else {
        sortIcon = <SortIconBoth style={this.props.iconStyle} />;
      }
      if (this.props.sorting === 'desc') {
        if (this.props.iconDesc) {
          sortIcon = this.props.iconDesc;
        } else {
          sortIcon = <SortIconDesc style={this.props.iconStyle} />;
        }
      } else if (this.props.sorting === 'asc') {
        if (this.props.iconAsc) {
          sortIcon = this.props.iconAsc;
        } else {
          sortIcon = <SortIconAsc style={this.props.iconStyle} />;
        }
      }
    }

    return (
      <th style={this.props.style} onClick={this.onClick} {...this.props.headerProps}>
        {this.props.header}
        {sortIcon}
      </th>
    );
  }
}

interface SortableTableHeaderProps extends SortableTableIconInfo {
  columns: SortableTableColumn[];
  sortings: SortingType[];
  onStateChange: (index: number) => void;
  checkboxes: SortableCheckboxMap;
  onCheckboxChange: (changeEvent: ChangeEvent<HTMLInputElement>) => void;
  isAllSelected: boolean;
}

export default class SortableTableHeader extends Component<SortableTableHeaderProps> {
  render() {
    const headers = this.props.columns.map((column: SortableTableColumn, index: number) => {
      const sorting = this.props.sortings[index];
      return (
        <SortableTableHeaderItem
          sortable={column.sortable}
          key={index}
          index={index}
          header={column.header}
          sorting={sorting}
          onClick={this.props.onStateChange}
          style={column.headerStyle}
          headerProps={column.headerProps}
          iconStyle={this.props.iconStyle}
          iconDesc={this.props.iconDesc}
          iconAsc={this.props.iconAsc}
          iconBoth={this.props.iconBoth}
        />
      );
    });

    const name = 'checkAll';
    const checkbox = (
      <th>
        <Checkbox
          key={name}
          name={name}
          isSelected={this.props.isAllSelected}
          onCheckboxChange={this.props.onCheckboxChange}
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
  }
}
