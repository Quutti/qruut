import * as React from "react";
import * as classNames from "classnames";

const bootstrapGrid: { [key: string]: any } = require("bootstrap/dist/css/bootstrap-grid.min.css");

export interface GridColProps {
    xl?: number;
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
    className?: string;
}

export const GridCol: React.SFC<GridColProps> = (props) => {
    const { xl, lg, md, sm, xs, className, children } = props;

    const classes = classNames(
        bootstrapGrid["col"],
        bootstrapGrid[`col-${xs}`],
        bootstrapGrid[`col-sm-${sm}`],
        bootstrapGrid[`col-md-${md}`],
        bootstrapGrid[`col-lg-${lg}`],
        bootstrapGrid[`col-xl-${xl}`],
        className
    );

    return <div className={classes}>{children}</div>;
}

GridCol.defaultProps = {
    xl: 12,
    lg: 12,
    md: 12,
    sm: 12,
    xs: 12,
    className: ""
}