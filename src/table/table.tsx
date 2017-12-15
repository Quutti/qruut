import * as React from "react";
import * as classNames from "classnames";

import { TableFilterItem, TableFilterFunction, defaultFilter } from "./filters";

import { Button } from "../button/button";
import { TablePagination } from "./table-pagination";
import { TableColumnProps } from "./table-column";

const styles: { [key: string]: any } = require("./table.css");

export type TableRowDataEntry = { [key: string]: any };

export interface TableProps {
    data: TableRowDataEntry[];
    filters?: boolean;
    uniqueIdKey?: string;
    itemsPerPage?: number;
    selectable?: boolean;
    onSelectionChange?: (selectedIds: any[]) => void;
}

export interface TableState {
    firstRenderedItemIndex: number;
    selectedRows: any[];
    activeFilters: { [key: string]: TableFilterItem };
}

export class Table extends React.Component<TableProps, TableState> {

    constructor(props) {
        super(props);

        this.state = {
            firstRenderedItemIndex: 0,
            selectedRows: [],
            activeFilters: {}
        }

        this._handleRowCheckboxClick = this._handleRowCheckboxClick.bind(this);
    }

    public render(): JSX.Element {

        const { selectable, uniqueIdKey, itemsPerPage, data } = this.props;

        // Throw if table has selectable prop but TablePrimaryKey element is not in childrens
        if (selectable && !uniqueIdKey) {
            throw new Error("Table property uniqueIdKey is required when using selectable mode");
        }

        const filteredData = this._getFilteredData(data);

        return (
            <div className={styles.root}>
                <table className={styles.table}>
                    {this._createTableHead()}
                    {this._createTableBody(filteredData)}
                </table>

                {(
                    itemsPerPage &&
                    <TablePagination
                        itemsPerPage={itemsPerPage}
                        itemCount={filteredData.length}
                        onPageChange={(firstItemIndex: number) => this.setState({ firstRenderedItemIndex: firstItemIndex })}
                    />
                )}

            </div>
        )
    }

    private _createTableHead(): JSX.Element {
        const { selectable, filters } = this.props;
        const headers = this._getChildrenOfType("TableColumn");
        let filterCells = [];
        let headerCells = [];

        headers.forEach((header, index) => {
            const { text, type, propertyKey, customFilter } = header.props as TableColumnProps;
            const style = { textAlign: (type === "numeric") ? "right" : "left" };
            headerCells.push(<th key={index} style={style} className={styles.header}>{text}</th>);

            if (filters) {
                // If col has customFilter specified use it, in other cases use defaultFilter
                // from filters.ts module
                const filterFunction = (typeof customFilter === "function") ? customFilter : defaultFilter;

                filterCells.push(
                    <th key={index}>
                        <input
                            className={styles.filter}
                            placeholder="Filter..."
                            onKeyUp={(evt) => this._handleFilterInput(evt, propertyKey, filterFunction)}
                        />
                    </th>
                );
            }
        });

        if (selectable) {
            const selectedCount = this.state.selectedRows.length;
            const text = (selectedCount > 0) ? `${selectedCount}` : "";
            const classes = [styles.header, styles.checkboxCell].join(" ");
            headerCells.unshift(<th key={"selection-header"} className={classes}>{text}</th>);

            // Add empty cell to the beginning of the filters array too
            if (filters) {
                filterCells.unshift(<th />);
            }
        }

        return (
            <thead>
                {!!filterCells.length && <tr>{filterCells}</tr>}
                <tr className={styles.headerRow}>{headerCells}</tr>
            </thead>
        );
    }

    private _createTableBody(filteredData: TableRowDataEntry[]): JSX.Element {
        const { itemsPerPage } = this.props;

        let visibleRowsData;
        if (itemsPerPage) {
            const { firstRenderedItemIndex } = this.state;
            const last = firstRenderedItemIndex + itemsPerPage;
            visibleRowsData = filteredData.slice(firstRenderedItemIndex, last);
        } else {
            visibleRowsData = filteredData;
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

    private _getFilteredData(data: TableRowDataEntry[]): TableRowDataEntry[] {

        const { activeFilters } = this.state;

        if (!this.props.filters) {
            return data;
        }

        return data.filter(item => {
            for (let key of Object.keys(activeFilters)) {
                const af = activeFilters[key];
                const match = af.filterFunction(item[key], af.value)

                if (!match) {
                    return false;
                }
            }

            return true;
        });
    }

    private _handleFilterInput(evt: any, propertyKey: string, filterFunction: TableFilterFunction) {
        const value: string = evt.target.value;
        const currentActiveFilters = this.state.activeFilters;
        const newActiveFilters = {
            [propertyKey]: { filterFunction, value }
        };

        this.setState({
            activeFilters: { ...currentActiveFilters, ...newActiveFilters }
        });
    }

}