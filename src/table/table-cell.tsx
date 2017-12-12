import * as React from "react";
import * as classNames from "classnames";

const styles: { [key: string]: any } = require("./table.css");

export type TableCellAlign = "left" | "center" | "right";

export interface TableCellProps {
    text: string;
    align?: TableCellAlign;
}

export class TableCel extends React.Component<TableCellProps, {}> {

    static defaultProps: Partial<TableCellProps> = {
        align: "left"
    }

    public render(): JSX.Element {
        const { text, align } = this.props;
        const style = { textAlign: align };

        return <td className={styles.cell} style={style}>{text}</td>
    }
}