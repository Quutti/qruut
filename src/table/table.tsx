import * as React from "react";
import * as classNames from "classnames";

import {
    TableFilterItem, TableFilterFunction, defaultFilter,
    TableSorterItem, defaultSorterFactory, TableSorterFunction, TableSortDirection, TableSorterFunctionFactory
} from "./helpers";

import { Button } from "../button/button";
import { TablePagination } from "./table-pagination";
import { TableColumnProps } from "./table-column";

const faStyles: { [key: string]: any } = require("font-awesome/css/font-awesome.min.css");
const styles: { [key: string]: any } = require("./table.css");

export type TableRowDataEntry = { [key: string]: any };

export interface TableProps {
    data: TableRowDataEntry[];
    filterable?: boolean;
    sortable?: boolean;
    uniqueIdKey?: string;
    itemsPerPage?: number;
    selectable?: boolean;
    onSelectionChange?: (selectedIds: any[]) => void;
}

export interface TableState {
    firstRenderedItemIndex: number;
    selectedRows: any[];
    activeFilters: { [key: string]: TableFilterItem };
    activeSorter: TableSorterItem;
}

export class Table extends React.Component<TableProps, TableState> {

    constructor(props) {
        super(props);

        this.state = {
            firstRenderedItemIndex: 0,
            selectedRows: [],
            activeFilters: {},
            activeSorter: null
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
        const sortedData = this._getSortedData(filteredData);

        return (
            <div className={styles.root}>
                <table className={styles.table}>
                    {this._createTableHead()}
                    {this._createTableBody(sortedData)}
                </table>

                {(
                    !!itemsPerPage &&
                    <TablePagination
                        itemsPerPage={itemsPerPage}
                        itemCount={sortedData.length}
                        onPageChange={(firstItemIndex: number) => this.setState({ firstRenderedItemIndex: firstItemIndex })}
                    />
                )}

            </div>
        )
    }

    private _createTableHead(): JSX.Element {
        const { selectable, filterable, sortable } = this.props;
        const { activeSorter } = this.state;
        const headers = this._getChildrenOfType("TableColumn");
        let filterCells = [];
        let headerCells = [];
        let cellContent: JSX.Element | string;

        headers.forEach((header, index) => {
            const { text, type, propertyKey, customFilter, customSorterFactory } = header.props as TableColumnProps;
            const style = { textAlign: (type === "numeric") ? "right" : "left" };

            // If sortable mode is on, add sortable buttons to the table head
            if (sortable) {
                const sorterFactory = (typeof customSorterFactory === "function")
                    ? customSorterFactory
                    : defaultSorterFactory;

                let sortDirection = null;
                if (activeSorter && activeSorter.propertyKey === propertyKey) {
                    sortDirection = activeSorter.direction;
                }

                const iconClasses = classNames({
                    [styles.sortIcon]: true,
                    [faStyles.fa]: true,
                    [faStyles["fa-sort"]]: sortDirection === null,
                    [faStyles["fa-sort-asc"]]: sortDirection === TableSortDirection.ASC,
                    [faStyles["fa-sort-desc"]]: sortDirection === TableSortDirection.DESC
                });

                cellContent = (
                    <button className={styles.sortButton} onClick={() => this._handleSort(propertyKey, sorterFactory)}>
                        <span className={iconClasses} /> {text}
                    </button>
                );
            } else {
                cellContent = text;
            }

            headerCells.push(<th key={index} style={style} className={styles.header}>{cellContent}</th>);

            if (filterable) {
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
            if (filterable) {
                filterCells.unshift(<th key={"selection-filter-header"} />);
            }
        }

        return (
            <thead>
                {!!filterCells.length && <tr>{filterCells}</tr>}
                <tr className={styles.headerRow}>{headerCells}</tr>
            </thead>
        );
    }

    private _createTableBody(data: TableRowDataEntry[]): JSX.Element {
        const { itemsPerPage } = this.props;

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

            console.log(value);

            window["R"] = React;

            let content;
            if (typeof value === "string") {
                content = value;
            } else if (typeof value === "number") {
                content = `${value}`;
            } else if (typeof value === "boolean") {
                content = value ? "True" : "False";
            } else if (typeof value === "function") {
                content = value(rowData);
            } else if (typeof value === "undefined") {
                content = "";
            } else if (this._isReactComponent(value)) {
                content = value;
            } else {
                content = value.toString();
            }

            const style: Partial<CSSStyleDeclaration> = {
                textAlign: (type === "numeric") ? "right" : "left"
            }

            if (width) {
                style.width = width as string;
            }

            return <td key={index} className={styles.cell} style={style as any}>{content}</td>
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

    private _isReactComponent(obj: any): boolean {
        return (typeof obj === "object") && ("type" in obj) && ("props" in obj) && ("$$typeof" in obj);
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

        if (!this.props.filterable) {
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
            activeFilters: {
                ...currentActiveFilters,
                ...newActiveFilters
            }
        });
    }

    private _getSortedData(data: TableRowDataEntry[]): TableRowDataEntry[] {
        const { activeSorter } = this.state;

        if (this.props.sortable && activeSorter) {
            const newData = [...data];
            const sorter = activeSorter.factory(activeSorter.propertyKey, activeSorter.direction);
            newData.sort(sorter);
            return newData;
        }

        return data;
    }

    private _handleSort(propertyKey: string, factory: TableSorterFunctionFactory) {
        const { activeSorter } = this.state;

        // Swap only direction if the new sorting occurs
        // in a same column than last time,
        let direction = TableSortDirection.ASC;
        if (activeSorter && activeSorter.propertyKey === propertyKey) {
            direction = (activeSorter.direction === TableSortDirection.ASC)
                ? TableSortDirection.DESC
                : TableSortDirection.ASC;
        }

        this.setState({
            activeSorter: {
                propertyKey,
                direction,
                factory
            }
        });
    }

}