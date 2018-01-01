import * as React from "react";

import { TableFilterFunction, TableSorterFunctionFactory } from "./helpers";

export type TableColumnType = "text" | "numeric";

export interface TableColumnProps {
    text: string;
    propertyKey: string;
    filterable?: boolean;
    sortable?: boolean;
    width?: number | string;
    type?: TableColumnType;
    customFilter?: TableFilterFunction;
    customSorterFactory?: TableSorterFunctionFactory;
}

export class TableColumn extends React.Component<TableColumnProps, {}> {

    static defaultProps: Partial<TableColumnProps> = {
        type: "text",

        // On a column level, filterable and sortable are true by default
        filterable: true,
        sortable: true
    }

    public render(): JSX.Element {
        return null;
    }
}