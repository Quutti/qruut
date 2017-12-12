import * as React from "react";

const styles: { [key: string]: any } = require("./table.css");

export class TableRow extends React.Component<{}, {}> {
    public render(): JSX.Element {
        return <tr className={styles.row}>{this.props.children}</tr>;
    }
}