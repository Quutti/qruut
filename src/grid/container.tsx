import * as React from "react";
import * as classNames from "classnames";

const bootstrapGrid: { [key: string]: any } = require("bootstrap/dist/css/bootstrap-grid.min.css");

export interface GridContainerProps {
    fixed?: boolean;
}

export class GridContainer extends React.Component<GridContainerProps, {}> {

    public render(): JSX.Element {
        const { fixed } = this.props;
        const classes = classNames({
            [bootstrapGrid.container]: fixed,
            [bootstrapGrid["container-fluid"]]: !fixed
        });

        return <div className={classes}>{this.props.children}</div>
    }

}