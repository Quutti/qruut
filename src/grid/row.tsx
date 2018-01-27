import * as React from "react";
import * as classNames from "classnames";

const bootstrapGrid: { [key: string]: any } = require("bootstrap/dist/css/bootstrap-grid.min.css");

export interface GridRowProps {
    className?: string;
}

export const GridRow: React.SFC<GridRowProps> = (props) => {
    const classes = classNames(bootstrapGrid.row, props.className);
    return <div className={classes}>{props.children}</div>;
}

GridRow.defaultProps = {
    className: ""
}