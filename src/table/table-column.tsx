import * as React from "react";

export type TableColumnType = "text" | "numeric";

export interface TableColumnProps {
    text: string;
    propertyKey: string;
    width?: number | string;
    type?: TableColumnType;
}

export class TableColumn extends React.Component<TableColumnProps, {}> {

    static defaultProps: Partial<TableColumnProps> = {
        type: "text"
    }

    public render(): JSX.Element {
        return null;
    }
}