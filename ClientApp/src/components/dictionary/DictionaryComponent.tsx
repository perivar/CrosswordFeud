import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter, numberFilter, Comparator } from 'react-bootstrap-table2-filter';

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

type DictionaryComponentProps = {
  page: number;
  data: object[];
  totalSize: number;
  sizePerPage: number;
  onTableChange: any;
};

type DictionaryComponentState = {
  page: number;
  data: object[];
  totalSize: number;
  sizePerPage: number;
};

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
  }

  handleTableChange = (type: string, { page, sizePerPage, filters, sortField, sortOrder, cellEdit }: any) => {
    const currentIndex = (page - 1) * sizePerPage;
    setTimeout(() => {
      // Handle cell editing
      if (type === 'cellEdit') {
        const { rowId, dataField, newValue } = cellEdit;
        products = products.map((row: any) => {
          if (row.id === rowId) {
            const newRow = { ...row };
            newRow[dataField] = newValue;
            return newRow;
          }
          return row;
        });
      }
      let result = products;

      // Handle column filters
      result = result.filter((row: any) => {
        let valid = true;
        for (const dataField in filters) {
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
      if (sortOrder === 'asc') {
        result = result.sort((a: any, b: any) => {
          if (a[sortField] > b[sortField]) {
            return 1;
          } else if (b[sortField] > a[sortField]) {
            return -1;
          }
          return 0;
        });
      } else {
        result = result.sort((a: any, b: any) => {
          if (a[sortField] > b[sortField]) {
            return -1;
          } else if (b[sortField] > a[sortField]) {
            return 1;
          }
          return 0;
        });
      }

      this.setState(() => ({
        page,
        data: result.slice(currentIndex, currentIndex + sizePerPage),
        totalSize: result.length,
        sizePerPage
      }));
    }, 2000);
  };

  render() {
    const { data, sizePerPage, page, totalSize } = this.state;
    return (
      <div>
        <BootstrapTable
          remote
          keyField="id"
          data={data}
          columns={columns}
          defaultSorted={defaultSorted}
          filter={filterFactory()}
          pagination={paginationFactory({ page, sizePerPage, totalSize })}
          cellEdit={cellEditFactory(cellEditProps)}
          onTableChange={this.handleTableChange}
        />
      </div>
    );
  }
}
