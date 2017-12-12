import * as React from "react";
import * as classNames from "classnames";

const styles: { [key: string]: any } = require("./table.css");

export interface TableProps {

}

export class Table extends React.Component<TableProps, {}> {

    public render(): JSX.Element {
        const rows = this._getChildrenOfType("TableRow");

        return (
            <div className={styles.root}>
                <table className={styles.table}>
                    {this._createTableHead()}
                    <tbody>{rows}</tbody>
                </table>
            </div>
        )
    }

    private _createTableHead(): JSX.Element {
        const headers = this._getChildrenOfType("TableCol");
        return (headers.length) ? <thead><tr className={styles.headerRow}>{headers}</tr></thead> : null;
    }

    private _getChildrenOfType(type: string): any[] {
        const children = [];
        React.Children.forEach(this.props.children, (c: any, index: number) => {
            if (c.type.name === type) {
                children.push(c);
            }
        });

        return children;
    }

}