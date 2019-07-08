import React, { Component } from 'react';
import BootstrapTable, { BootstrapTableProps } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter, numberFilter, Comparator } from 'react-bootstrap-table2-filter';
import { bool } from 'prop-types';
import { JSXFragment, JSXElement } from '@babel/types';

let products: any = [
  {
    id: 1,
    name: 'King Kong',
    price: 156.23
  },
  {
    id: 2,
    name: 'Baby Boomer',
    price: 26.13
  },
  {
    id: 3,
    name: 'Whats Up?',
    price: 0.12
  },
  {
    id: 4,
    name: 'Yessir!',
    price: 50.5
  }
];

const columns = [
  {
    dataField: 'id',
    text: 'Product ID',
    sort: true
  },
  {
    dataField: 'name',
    text: 'Product Name',
    filter: textFilter({
      defaultValue: 'King'
    }),
    sort: true
  },
  {
    dataField: 'price',
    text: 'Product Price',
    filter: numberFilter(),
    sort: true
  }
];

const defaultSorted = [
  {
    dataField: 'name',
    order: 'desc'
  }
];

const cellEditProps = {
  mode: 'click'
};

interface DictionaryComponentProps extends BootstrapTableProps {
  dictionary: string;
}

interface DictionaryComponentState extends TableChangeNewState {
  totalSize: number;
  sortAsc?: Record<string, boolean>;
}

export default class DictionaryComponent extends Component<DictionaryComponentProps, DictionaryComponentState> {
  constructor(props: DictionaryComponentProps) {
    super(props);
    this.state = {
      page: 1,
      data: products.slice(0, 10),
      totalSize: products.length,
      sizePerPage: 10
    };
    this.handleTableChange = this.handleTableChange.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  onSort(event: any, sortKey: string) {
    let { data, sortAsc } = this.state;

    const mySortAsc: Record<string, boolean> = { ...sortAsc };
    if (sortAsc == undefined || sortAsc[sortKey] == undefined) {
      // default to ascending
      mySortAsc[sortKey] = true;
    }

    data!.sort((a, b) => this.sort(a[sortKey], b[sortKey], mySortAsc[sortKey]));

    // toggle the sort order
    mySortAsc[sortKey] = !mySortAsc[sortKey];

    // and set updated state
    this.setState({ data, sortAsc: mySortAsc });
  }

  // sort two objects
  sort(a: any, b: any, asc: boolean) {
    var result;

    /* Default ascending order */
    if (typeof asc == 'undefined') asc = true;

    if (a === null) return 1;
    if (b === null) return -1;
    if (a === null && b === null) return 0;

    result = a - b;

    if (isNaN(result)) {
      return asc ? a.toString().localeCompare(b) : b.toString().localeCompare(a);
    } else {
      return asc ? result : -result;
    }
  }

  handleTableChange = (
    type: string,
    { page, sizePerPage, filters, sortField, sortOrder, cellEdit }: TableChangeNewState
  ) => {
    const currentIndex = (page! - 1) * sizePerPage!;

    setTimeout(() => {
      // Handle cell editing
      if (type === 'cellEdit') {
        const { rowId, dataField, newValue } = cellEdit!;
        products = products.map((row: any) => {
          if (row.id === rowId) {
            const newRow = { ...row };
            newRow[dataField] = newValue;
            return newRow;
          }
          return row;
        });
      }

      // sort will mutate the original array
      let result = products;

      // Handle column filters
      result = result.filter((row: any) => {
        let valid = true;
        for (const dataField in filters!) {
          const { filterVal, filterType, comparator } = filters[dataField];

          if (filterType === 'TEXT') {
            if (comparator === Comparator.LIKE) {
              valid = row[dataField].toString().indexOf(filterVal) > -1;
            } else {
              valid = row[dataField] === filterVal;
            }
          }
          if (!valid) break;
        }
        return valid;
      });

      // Handle column sort
      const mySortField = sortField!;
      if (sortOrder === 'asc') {
        result = result.sort((a: any, b: any) => {
          if (a[mySortField] > b[mySortField]) {
            return 1;
          } else if (b[mySortField] > a[mySortField]) {
            return -1;
          }
          return 0;
        });
      } else {
        result = result.sort((a: any, b: any) => {
          if (a[mySortField] > b[mySortField]) {
            return -1;
          } else if (b[mySortField] > a[mySortField]) {
            return 1;
          }
          return 0;
        });
      }

      this.setState(() => ({
        page,
        data: result.slice(currentIndex, currentIndex + sizePerPage!),
        totalSize: result.length,
        sizePerPage
      }));
    }, 3000);
  };

  render() {
    const { data, sizePerPage, page, totalSize, sortAsc } = this.state;

    // set correct sort icons
    const mySortIcons: Record<string, JSX.Element> = {};

    for (let keyField of ['id', 'name', 'price']) {
      if (sortAsc == undefined || sortAsc[keyField] == undefined) {
        mySortIcons[keyField] = <i className="fas fa-sort"></i>;
      } else {
        if (sortAsc[keyField]) {
          mySortIcons[keyField] = <i className="fas fa-sort-up"></i>;
        } else {
          mySortIcons[keyField] = <i className="fas fa-sort-down"></i>;
        }
      }
    }

    return (
      <div>
        {/* <BootstrapTable
          remote
          keyField="id"
          data={data!}
          columns={columns}
          defaultSorted={defaultSorted}
          filter={filterFactory()}
          pagination={paginationFactory({ page, sizePerPage, totalSize })}
          cellEdit={cellEditFactory(cellEditProps)}
          onTableChange={this.handleTableChange}
				/> */}

        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th onClick={e => this.onSort(e, 'id')}>Product Id {mySortIcons['id']}</th>
              <th onClick={e => this.onSort(e, 'name')}>Product Name {mySortIcons['name']}</th>
              <th onClick={e => this.onSort(e, 'price')}>Product Price {mySortIcons['price']}</th>
            </tr>
          </thead>
          <tbody>
            {data!.map(function(entry, index) {
              return (
                <tr key={index} data-item={entry}>
                  <td data-title="Id">{entry.id}</td>
                  <td data-title="Name">{entry.name}</td>
                  <td data-title="Price">{entry.price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
