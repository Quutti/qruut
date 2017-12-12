import * as React from "react";

const styles: { [key: string]: any } = require("./table.css");

export interface TableColProps {
    text: string;
    width?: number | string;
}

export class TableCol extends React.Component<TableColProps, {}> {

    static defaultProps: Partial<TableColProps> = {
        width: "auto"
    }

    public render(): JSX.Element {
        const { text, width } = this.props;
        const style = { width };
        return <th className={styles.header} style={style}>{text}</th>
    }
}