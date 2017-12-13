import * as React from "react";

const styles: { [key: string]: any } = require("./table.css");

export type TableColumnType = "text" | "numeric";

export interface TableColumnProps {
    text: string;
    propertyKey: string;
    width?: number | string;
    type?: TableColumnType;
}

export class TableColumn extends React.Component<TableColumnProps, {}> {

    static defaultProps: Partial<TableColumnProps> = {
        width: "auto",
        type: "text"
    }

    public render(): JSX.Element {
        return null;
    }
}