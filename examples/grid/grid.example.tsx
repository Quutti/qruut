import * as React from "react";
import { DocProps } from "../../examples/doc";
import { Card } from "@components/card";

import { GridCol, GridContainer, GridRow } from "@components/grid";

const css: { [key: string]: any } = require("../helpers.css");

export class GridExample extends React.Component<{}, {}> {

    static docProps: DocProps = {
        name: "Grid"
    }

    render(): JSX.Element {
        return (
            <div>
                <h2>Examples</h2>
                <div className={css.mb3}>Grid component are build on top of Bootstrap 4 grid. Documentation can be found from <a href="https://getbootstrap.com/docs/4.0/getting-started/introduction/">here</a>.</div>

                <Card heading="Grid example" className={css.mb3}>
                    <div>Library specific documentation coming soon...</div>
                </Card>
            </div>
        )
    }

}