import * as React from "react";

import { TableFilterFunction, TableSorterFunctionFactory, TableCustomValueFunction } from "./helpers";

export type TableColumnType = "text" | "numeric";

export interface TableColumnProps {
    text: string;
    propertyKey: string;
    filterable?: boolean;
    sortable?: boolean;
    width?: number | string;
    type?: TableColumnType;
    customValue?: TableCustomValueFunction;
    customFilter?: TableFilterFunction;
    customSorterFactory?: TableSorterFunctionFactory;
}

export const TableColumn: React.SFC<TableColumnProps> = (props) => {
    return null;
};

TableColumn.defaultProps = {
    type: "text",

    // On a column level, filterable and sortable are true by default
    filterable: true,
    sortable: true
}

TableColumn.displayName = 'TableColumn';

export default TableColumn;