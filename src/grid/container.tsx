import * as React from "react";
import * as classNames from "classnames";

const bootstrapGrid: { [key: string]: any } = require("bootstrap/dist/css/bootstrap-grid.min.css");

export interface GridContainerProps {
    fixed?: boolean;
    className?: string;
}

export const GridContainer: React.SFC<GridContainerProps> = (props) => {
    const classes = classNames(props.className, {
        [bootstrapGrid.container]: props.fixed,
        [bootstrapGrid["container-fluid"]]: props.fixed
    });

    return <div className={classes}>{props.children}</div>;
}

GridContainer.defaultProps = {
    className: ""
}