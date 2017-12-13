import * as React from "react";
import * as classNames from "classnames";

import { Button } from "../button/button";
import { TableColumnProps } from "./table-column";

const styles: { [key: string]: any } = require("./table.css");

export interface TableProps {
    itemsPerPage?: number;
    data: { [key: string]: any };
}

export interface TableState {
    activePage: number;
}

export class Table extends React.Component<TableProps, TableState> {

    constructor(props) {
        super(props);

        this.state = {
            activePage: 0
        }

        this._handleNextButtonClick = this._handleNextButtonClick.bind(this);
        this._handlePrevButtonClick = this._handlePrevButtonClick.bind(this);
    }

    public render(): JSX.Element {
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
        const elems = this._getChildrenOfType("TableColumn").map((header, index) => {
            const { text, type } = header.props as TableColumnProps;
            const style = { textAlign: (type === "numeric") ? "right" : "left" };
            return <th key={index} style={style} className={styles.header}>{text}</th>
        });

        return <thead><tr className={styles.headerRow}>{elems}</tr></thead>;
    }

    private _createTableBody(): JSX.Element {
        const { data, itemsPerPage } = this.props;
        const headers = this._getChildrenOfType("TableColumn");

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
            const cells = headers.map((header, index) => {
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

            return <tr key={index} className={styles.row}>{cells}</tr>;
        });

        return <tbody>{rows}</tbody>;
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

    private _getTotalPageCount() {
        return Math.floor(this.props.data.length / this.props.itemsPerPage)
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