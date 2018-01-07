import * as React from "react";
import { DocProps } from "../../doc";
import { Doc } from "../../components/doc";
import { Card } from "@components/card";
import { GridContainer, GridRow, GridCol } from "@components/grid";
import * as helpers from "../example-helpers";

import { LineChart, LineChartLine, LineCustomChartTickFormatFunction } from "@components/line-chart";

const css: { [key: string]: any } = require("../helpers.css");

const randomValue = (): number => {
    return Math.round(Math.random() * 100);
}

export class LineChartExample extends React.Component<{}, {}> {

    static docProps: DocProps = {
        name: "LineChart",
        properties: {}
    }

    private _lines1: LineChartLine<Date>[] = [];
    private _lines2: LineChartLine<number>[] = [];

    constructor(props) {
        super(props);
    }

    public render(): JSX.Element {

        const tickCount = (this._lines2[0]) ? this._lines2[0].data.length : 0;
        const tickFormat: LineCustomChartTickFormatFunction<number> = (val: number, index: number) => {
            if (index === 0) { return "1" };
            if (index === tickCount - 1) { return "Last" };
            return "";
        }
        return (
            <div>
                <h2>Examples</h2>
                <GridContainer>
                    <GridRow>

                        <GridCol xl={12} lg={12} md={12} sm={12}>

                            <Card heading="Line chart example" className={css.mb3}>
                                <LineChart lines={this._lines1} />
                            </Card>

                            <Card heading="Line chart example 2" className={css.mb3}>
                                <LineChart lines={this._lines2} xAxis={{ tickCount, tickFormat, scale: "linear" }} />
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
        this._randomLines1();
        this._randomLines2();
        this.forceUpdate();
    }

    private _randomLines1() {
        this._lines1 = [{
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

            this._lines1.forEach(o => {
                o.data.push({
                    xValue: new Date(date.valueOf()),
                    yValue: randomValue()
                })
            });
        }

    }

    private _randomLines2() {
        this._lines2 = [{
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
            this._lines2.forEach(o => {
                o.data.push({
                    xValue: i,
                    yValue: randomValue()
                })
            });
        }
    }

}