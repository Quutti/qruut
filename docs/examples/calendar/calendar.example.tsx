import * as React from "react";
import { DocProps } from "../../doc";
import { Doc } from "../../components/doc";
import { Card } from "@components/card";
import { GridContainer, GridRow, GridCol } from "@components/grid";
import * as helpers from "../example-helpers";

import { Calendar } from "@components/calendar";

const css: { [key: string]: any } = require("../helpers.css");

export interface CalendarExampleState {
    selectedDate1: Date;
}

export class CalendarExample extends React.Component<{}, CalendarExampleState> {

    static docProps: DocProps = {
        name: "Calendar",
        properties: {}
    }

    constructor(props) {
        super(props);

        this.state = {
            selectedDate1: new Date()
        }
    }

    render(): JSX.Element {
        return (
            <div>
                <h2>Examples</h2>
                <GridContainer>
                    <GridRow>

                        <GridCol lg={4} xl={4} md={4} sm={6}>
                            <Card heading="Calendar example" className={css.mb3}>
                                <Calendar onSelectedDateChange={(date: Date) => this.setState({ selectedDate1: date })} defaultDate={this.state.selectedDate1} />
                                <p>Selected date: {dateToString(this.state.selectedDate1)}</p>
                            </Card>
                        </GridCol>

                    </GridRow>
                </GridContainer>
                <Doc doc={CalendarExample.docProps} />
            </div>
        )
    }

    componentDidMount() {
        // Force update when component has been mounted to provide
        // positionElements for Popover components
        this.forceUpdate();
    }

}

function dateToString(date: Date): string {
    const p = (n: number): string => ((n < 10) ? "0" : "") + n;
    return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}