import * as React from "react";
import { Button } from "../button/button";

const styles: { [key: string]: any } = require("./table.css");

export type TableRowDataEntry = { [key: string]: any };

export interface TablePaginationProps {
    itemCount: number;
    itemsPerPage: number;
    onPageChange: (firstItemIndex: number) => void;
}

export interface TablePaginationState {
    activePage: number;
}

export class TablePagination extends React.Component<TablePaginationProps, TablePaginationState> {

    constructor(props) {
        super(props);

        this.state = {
            activePage: 0
        }

        this._handleNextButtonClick = this._handleNextButtonClick.bind(this);
        this._handlePrevButtonClick = this._handlePrevButtonClick.bind(this);
    }

    public render(): JSX.Element {
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

    public componentWillReceiveProps(newProps: TablePaginationProps) {
        // Jump to the first page if itemCount changes
        if (newProps.itemCount !== this.props.itemCount) {
            this._handlePageChange(0);
        }
    }

    private _getTotalPageCount() {
        return Math.ceil(this.props.itemCount / this.props.itemsPerPage)
    }

    private _handlePrevButtonClick() {
        if (this.state.activePage > 0) {
            this._handlePageChange(this.state.activePage - 1);
        }
    }

    private _handleNextButtonClick() {
        if (this.state.activePage < this._getTotalPageCount() - 1) {
            this._handlePageChange(this.state.activePage + 1);
        }
    }

    private _handlePageChange(newPage: number) {
        this.setState({ activePage: newPage });
        this.props.onPageChange(this.props.itemsPerPage * newPage);
    }
}