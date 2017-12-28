import * as React from "react";
import { DocProps } from "../../doc";
import { Doc } from "../../components/doc";
import { Card } from "@components/card";
import { GridContainer, GridRow, GridCol } from "@components/grid";
import * as helpers from "../example-helpers";

import { LineChart, LineChartLine } from "@components/line-chart";

const css: { [key: string]: any } = require("../helpers.css");

const randomValue = (): number => {
    return Math.round(Math.random() * 100);
}

export class LineChartExample extends React.Component<{}, {}> {

    static docProps: DocProps = {
        name: "LineChart",
        properties: {}
    }

    private _lines: LineChartLine[] = [];

    constructor(props) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div>
                <h2>Examples</h2>
                <GridContainer>
                    <GridRow>

                        <GridCol xl={12} lg={12} md={12} sm={12}>
                            <Card heading="Line chart example" className={css.mb3}>
                                <LineChart lines={this._lines} />
                            </Card>
                        </GridCol>

                    </GridRow>
                </GridContainer>
                <Doc doc={LineChartExample.docProps} />
            </div>
        )
    }

    public componentDidMount() {
        this._randomLines();
        setInterval(this._randomLines.bind(this), 7500);
    }

    private _randomLines() {
        this._lines = [{
            color: "red",
            data: []
        }, {
            color: "green",
            data: []
        }, {
            color: "blue",
            data: []
        }];
        const startDate = new Date();

        for (let i = 0; i < 15; i++) {
            const date = new Date(startDate.valueOf());
            date.setDate(date.getDate() + i);
            date.setHours(0, 0, 0, 0);

            this._lines.forEach(o => {
                o.data.push({
                    date: new Date(date.valueOf()),
                    value: randomValue()
                })
            });
        }

        this.forceUpdate();
    }

}