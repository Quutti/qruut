import * as React from "react";

const bootstrapGrid: { [key: string]: any } = require("bootstrap/dist/css/bootstrap-grid.min.css");

export interface GridRowProps {
    className?: string;
}

export class GridRow extends React.Component<GridRowProps, {}> {

    static defaultProps: Partial<GridRowProps> = {
        className: ""
    }

    public render(): JSX.Element {
        const classes = [
            bootstrapGrid.row,
            ...this.props.className.split(" ")
        ].join(" ");

        return <div className={classes}>{this.props.children}</div>
    }

}