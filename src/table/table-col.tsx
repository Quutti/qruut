import * as React from "react";

import { TableCellAlign } from "./table-cell";
const styles: { [key: string]: any } = require("./table.css");

export interface TableColProps {
    text: string;
    width?: number | string;
    align?: TableCellAlign
}

export class TableCol extends React.Component<TableColProps, {}> {

    static defaultProps: Partial<TableColProps> = {
        width: "auto",
        align: "left"
    }

    public render(): JSX.Element {
        const { text, width, align } = this.props;
        const style = { width, textAlign: align };
        return <th className={styles.header} style={style}>{text}</th>
    }
}