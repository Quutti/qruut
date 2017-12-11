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

export class GridCol extends React.Component<GridColProps, {}> {

    static defaultProps: Partial<GridColProps> = {
        xl: 12,
        lg: 12,
        md: 12,
        sm: 12,
        xs: 12,
        className: ""
    }

    public render(): JSX.Element {
        const { xl, lg, md, sm, xs, className } = this.props;

        const classes = [
            bootstrapGrid["col"],
            bootstrapGrid[`col-${xs}`],
            bootstrapGrid[`col-sm-${sm}`],
            bootstrapGrid[`col-md-${md}`],
            bootstrapGrid[`col-lg-${lg}`],
            bootstrapGrid[`col-xl-${xl}`],
            ...className.split(" ")
        ].join(" ");

        return <div className={classes}>{this.props.children}</div>
    }

}