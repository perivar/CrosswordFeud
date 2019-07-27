import { useState } from 'react';

export type FilterOperation =
  | 'contains'
  // | "notContains"
  // | "startsWith"
  // | "endsWith"
  | 'equal'
  // | "notEqual"
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan';
// | "lessThanOrEqual"

export type DataType = 'number' | 'string' | 'guid';

export interface OdataFilter {
  name: string;
  operation: FilterOperation;
  value: string;
  dataType: DataType;
}

export interface OrderBy {
  name: string;
  direction: 'asc' | 'desc';
}

const mapToOdataFilter = ({ name, operation: operand, value, dataType }: OdataFilter) => {
  switch (operand) {
    case 'contains': {
      return `contains(${name}, ${dataType === 'number' ? value : `'${value}'`})`;
    }
    case 'equal': {
      return `${name} eq ${dataType !== 'string' ? value : `'${value}'`}`;
    }
    case 'greaterThanOrEqual': {
      return `${name} ge ${dataType !== 'string' ? value : `'${value}'`}`;
    }
    case 'greaterThan': {
      return `${name} gt ${dataType !== 'string' ? value : `'${value}'`}`;
    }
    case 'lessThan': {
      return `${name} lt ${dataType !== 'string' ? value : `'${value}'`}`;
    }
  }
  throw Error(`unknown operand '${operand}'`);
};

interface InitialValues {
  initialPageSize?: number;
  initialOrderBy?: OrderBy[];
}

export const useOdata = ({ initialPageSize = 20, initialOrderBy = [] }: InitialValues) => {
  const [top, setTop] = useState(initialPageSize);
  const [skip, setSkip] = useState(0);
  const [filters, setFilters] = useState<OdataFilter[]>([]);
  const [orderBy, setOrderBy] = useState<OrderBy[]>(initialOrderBy);
  const orderByPara = orderBy.map(sort => `${sort.name} ${sort.direction}`).join(',');
  const orderByQuery = orderByPara ? `&$orderBy=${orderByPara}` : '';

  const query = `$top=${top}${skip ? `&$skip=${skip}` : ''}${
    filters.length > 0 ? `&$filter=${filters.map(mapToOdataFilter).reduce((prev, curr) => `${prev} and ${curr}`)}` : ''
  }${orderByQuery}`;
  return { query, setTop, top, setSkip, setFilters, setOrderBy };
};
