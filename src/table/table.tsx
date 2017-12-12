import * as React from "react";
import * as classNames from "classnames";

import { Button } from "../button/button";

const styles: { [key: string]: any } = require("./table.css");

export interface TableProps {
    itemsPerPage?: number;
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
                    <tbody>{this._createRows()}</tbody>
                </table>

                {this._createPagination()}
            </div>
        )
    }

    private _createTableHead(): JSX.Element {
        const headers = this._getChildrenOfType("TableCol");
        return (headers.length) ? <thead><tr className={styles.headerRow}>{headers}</tr></thead> : null;
    }

    private _createRows(): any[] {
        const rows = this._getChildrenOfType("TableRow");
        const { itemsPerPage } = this.props;

        if (!itemsPerPage) {
            return rows;
        }

        const { activePage } = this.state;
        const start = itemsPerPage * activePage;
        const end = (itemsPerPage * (activePage + 1));

        return rows.slice(start, end);
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
        const rows = this._getChildrenOfType("TableRow");
        return Math.floor(rows.length / this.props.itemsPerPage)
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