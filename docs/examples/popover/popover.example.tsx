import * as React from "react";
import { DocProps } from "../../doc";
import { Doc } from "../../components/doc";
import { Card } from "@components/card";
import { GridContainer, GridRow, GridCol } from "@components/grid";
import * as helpers from "../example-helpers";

import { Button } from "@components/button";
import { List, ListItem } from "@components/list";
import { Popover } from "../../../src/popover/index";

const css: { [key: string]: any } = require("../helpers.css");

export interface PopoverExampleState {
    popover1Visible: boolean;
    popover2Visible: boolean;
}

export class PopoverExample extends React.Component<{}, PopoverExampleState> {

    static docProps: DocProps = {
        name: "Popover",
        properties: {}
    }

    private _button1: Button = null;
    private _htmlDiv1: HTMLDivElement = null;

    constructor(props) {
        super(props);
        this.state = {
            popover1Visible: false,
            popover2Visible: false
        }
    }

    render(): JSX.Element {

        const button1Text = (this.state.popover1Visible) ? "Hide" : "Show";
        const button2Text = (this.state.popover2Visible) ? "Hide" : "Show";

        return (
            <div>
                <h2>Examples</h2>
                <GridContainer>
                    <GridRow>

                        <GridCol>
                            <Card heading="Popover example 1" className={css.mb3}>
                                <Button
                                    text={button1Text}
                                    onClick={() => this.setState({ popover1Visible: !this.state.popover1Visible })}
                                    ref={(btn) => this._button1 = btn}
                                />

                                <Popover
                                    visible={this.state.popover1Visible}
                                    onCloseRequest={() => this.setState({ popover1Visible: false })}
                                    positionElement={this._button1}>
                                    <p style={{ margin: 0 }}>This is the text content of the popover 1. It will go to for two lines.</p>
                                </Popover>
                            </Card>
                        </GridCol>

                        <GridCol>
                            <Card heading="Popover example 2" className={css.mb3}>
                                <Button
                                    text={button2Text}
                                    onClick={() => this.setState({ popover2Visible: !this.state.popover2Visible })}
                                />

                                <div style={{ position: "relative" }}>
                                    <div
                                        style={{ position: "absolute", left: 150, top: -35, width: 75, border: "1px solid #000", height: 25 }}
                                        ref={(ref) => this._htmlDiv1 = ref}
                                    >Target!</div>
                                </div>

                                <Popover
                                    visible={this.state.popover2Visible}
                                    onCloseRequest={() => this.setState({ popover2Visible: false })}
                                    positionElement={this._htmlDiv1}>
                                    <p style={{ margin: 0 }}>This is the text content of the popover 1. It will go to for two lines.</p>
                                </Popover>
                            </Card>
                        </GridCol>

                    </GridRow>
                </GridContainer>
                <Doc doc={PopoverExample.docProps} />
            </div>
        )
    }

    componentDidMount() {
        // Force update when component has been mounted to provide
        // positionElements for Popover components
        this.forceUpdate();
    }

}