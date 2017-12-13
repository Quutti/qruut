import * as React from "react";
import * as classNames from "classnames";

import { Button } from "../button/button";
import { TableColumnProps } from "./table-column";
import { TablePrimaryKeyProps } from "./table-primary-key";

const styles: { [key: string]: any } = require("./table.css");

export type TableRowDataEntry = { [key: string]: any };

export interface TableProps {
    data: TableRowDataEntry[];
    itemsPerPage?: number;
    selectable?: boolean;
    onSelectionChange?: (selectedIds: any[]) => void;
}

export interface TableState {
    activePage: number;
    selectedRows: any[];
}

export class Table extends React.Component<TableProps, TableState> {

    constructor(props) {
        super(props);

        this.state = {
            activePage: 0,
            selectedRows: []
        }

        this._handleNextButtonClick = this._handleNextButtonClick.bind(this);
        this._handlePrevButtonClick = this._handlePrevButtonClick.bind(this);
        this._handleRowCheckboxClick = this._handleRowCheckboxClick.bind(this);
    }

    public render(): JSX.Element {

        // Throw if table has selectable prop but TablePrimaryKey element is not in childrens
        if (this.props.selectable && !this._getPrimaryKeyPropertyName()) {
            throw new Error("Table must have TablePrimaryKey children when using Table with selectable");
        }

        return (
            <div className={styles.root}>
                <table className={styles.table}>
                    {this._createTableHead()}
                    {this._createTableBody()}
                </table>

                {this._createPagination()}
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
            const { activePage } = this.state;
            const start = itemsPerPage * activePage;
            const end = (itemsPerPage * (activePage + 1));

            visibleRowsData = data.slice(start, end);
        } else {
            visibleRowsData = data;
        }

        const rows = visibleRowsData.map((rowData, index) => {
            return <tr key={index} className={styles.row}>{this._createCellsOfRow(rowData)}</tr>;
        });

        return <tbody>{rows}</tbody>;
    }

    private _createCellsOfRow(rowData: TableRowDataEntry): JSX.Element[] {
        const { selectable } = this.props;

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
            const id = rowData[this._getPrimaryKeyPropertyName()];
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

    private _getPrimaryKeyPropertyName(): string {
        const primary = this._getChildrenOfType("TablePrimaryKey")[0];
        if (primary) {
            const { propertyKey } = primary.props as TablePrimaryKeyProps;
            if (propertyKey) {
                return propertyKey;
            }
        }

        return null;
    }

    private _handleRowCheckboxClick(evt: any, rowData: TableRowDataEntry) {
        const id = rowData[this._getPrimaryKeyPropertyName()];
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

    private _getTotalPageCount() {
        return Math.ceil(this.props.data.length / this.props.itemsPerPage)
    }

    private _createPagination(): JSX.Element {
        const { itemsPerPage } = this.props;
        if (!itemsPerPage) {
            return null;
        }

        const { activePage } = this.state;
        const totalPages = this._getTotalPageCount();

        return (
            <div className={styles.paginationContainer}>
                <Button text="Prev" disabled={activePage === 0} onClick={this._handlePrevButtonClick} />
                <span className={styles.paginationLabel}>{`${activePage + 1} of ${totalPages}`}</span>
                <Button text="Next" disabled={activePage === (totalPages - 1)} onClick={this._handleNextButtonClick} />
            </div>
        )
    }

    private _handlePrevButtonClick() {
        if (this.state.activePage > 0) {
            this.setState({ activePage: this.state.activePage - 1 })
        }
    }

    private _handleNextButtonClick() {
        if (this.state.activePage < this._getTotalPageCount() - 1) {
            this.setState({ activePage: this.state.activePage + 1 })
        }
    }
}