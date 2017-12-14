import * as React from "react";
import * as classNames from "classnames";

import { Button } from "../button/button";
import { TablePagination } from "./table-pagination";
import { TableColumnProps } from "./table-column";

const styles: { [key: string]: any } = require("./table.css");

export type TableRowDataEntry = { [key: string]: any };

export interface TableProps {
    data: TableRowDataEntry[];
    uniqueIdKey?: string;
    itemsPerPage?: number;
    selectable?: boolean;
    onSelectionChange?: (selectedIds: any[]) => void;
}

export interface TableState {
    firstRenderedItemIndex: number;
    selectedRows: any[];
}

export class Table extends React.Component<TableProps, TableState> {

    constructor(props) {
        super(props);

        this.state = {
            firstRenderedItemIndex: 0,
            selectedRows: []
        }

        this._handleRowCheckboxClick = this._handleRowCheckboxClick.bind(this);
    }

    public render(): JSX.Element {

        const { selectable, uniqueIdKey, itemsPerPage, data } = this.props;

        // Throw if table has selectable prop but TablePrimaryKey element is not in childrens
        if (selectable && !uniqueIdKey) {
            throw new Error("Table property uniqueIdKey is required when using selectable mode");
        }

        return (
            <div className={styles.root}>
                <table className={styles.table}>
                    {this._createTableHead()}
                    {this._createTableBody()}
                </table>

                {(
                    itemsPerPage &&
                    <TablePagination
                        itemsPerPage={itemsPerPage}
                        itemCount={data.length}
                        onPageChange={(firstItemIndex: number) => this.setState({ firstRenderedItemIndex: firstItemIndex })}
                    />
                )}

            </div>
        )
    }

    private _createTableHead(): JSX.Element {
        const { selectable } = this.props;

        const headerCells = this._getChildrenOfType("TableColumn").map((header, index) => {
            const { text, type } = header.props as TableColumnProps;
            const style = { textAlign: (type === "numeric") ? "right" : "left" };
            return <th key={index} style={style} className={styles.header}>{text}</th>
        });

        if (selectable) {
            const selectedCount = this.state.selectedRows.length;
            const text = (selectedCount > 0) ? `${selectedCount}` : "";
            const classes = [styles.header, styles.checkboxCell].join(" ");
            headerCells.unshift(<td key={"selection-header"} className={classes}>{text}</td>);
        }

        return <thead><tr className={styles.headerRow}>{headerCells}</tr></thead>;
    }

    private _createTableBody(): JSX.Element {
        const { data, itemsPerPage } = this.props;

        let visibleRowsData;
        if (itemsPerPage) {
            const { firstRenderedItemIndex } = this.state;
            const last = firstRenderedItemIndex + itemsPerPage;
            visibleRowsData = data.slice(firstRenderedItemIndex, last);
        } else {
            visibleRowsData = data;
        }

        const rows = visibleRowsData.map((rowData, index) => {
            return <tr key={index} className={styles.row}>{this._createCellsOfRow(rowData)}</tr>;
        });

        return <tbody>{rows}</tbody>;
    }

    private _createCellsOfRow(rowData: TableRowDataEntry): JSX.Element[] {
        const { selectable, uniqueIdKey } = this.props;

        const cells = this._getChildrenOfType("TableColumn").map((header, index) => {
            const { type, width, propertyKey } = header.props as TableColumnProps;
            const value = rowData[propertyKey];

            let text;
            if (typeof value === "string") {
                text = value;
            } else if (typeof value === "number") {
                text = `${value}`;
            } else if (typeof value === "boolean") {
                text = value ? "True" : "False";
            } else if (typeof value === "function") {
                text = value(rowData);
            } else if (typeof value === "undefined") {
                text = "";
            } else {
                text = value.toString();
            }

            const style: Partial<CSSStyleDeclaration> = {
                textAlign: (type === "numeric") ? "right" : "left"
            }

            if (width) {
                style.width = width as string;
            }

            return <td key={index} className={styles.cell} style={style as any}>{text}</td>
        });

        // If selectable mode is on add checkbox cell as a first cell of every row
        if (selectable) {
            const id = rowData[uniqueIdKey];
            const checked = this.state.selectedRows.indexOf(id) > -1;
            const tdClasses = [styles.cell, styles.checkboxCell].join(" ");

            cells.unshift(
                <td key={"selection-cell"} className={tdClasses}>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(evt) => this._handleRowCheckboxClick(evt, rowData)}
                    />
                </td>
            );
        }

        return cells;
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

    private _handleRowCheckboxClick(evt: any, rowData: TableRowDataEntry) {
        const id = rowData[this.props.uniqueIdKey];
        const newSelectedRows = [...this.state.selectedRows];

        if (evt.target.checked) {
            newSelectedRows.push(id);
        } else {
            const index = newSelectedRows.indexOf(id);
            if (index > -1) {
                newSelectedRows.splice(index, 1);
            }
        }

        this.setState({ selectedRows: newSelectedRows });

        if (typeof this.props.onSelectionChange === "function") {
            this.props.onSelectionChange(this.state.selectedRows);
        }
    }

}