import * as React from "react";
import { DocProps } from "../../doc";
import { Doc } from "../../components/doc";
import { Card } from "@components/card";
import * as helpers from "../example-helpers";

import * as styleVariables from "../../../src/default-variables";

const css: { [key: string]: any } = require("../helpers.css");

export class CardExample extends React.Component<{}, {}> {

    static docProps: DocProps = {
        name: "Card",
        properties: {
            heading: {
                type: "string",
                desc: "Title shown in the component heading"
            },
            className: helpers.getClassNameDescriptor(),
            style: {
                type: "object",
                desc: "Css styles for component"
            }
        }
    }

    render(): JSX.Element {
        const styleVars = styleVariables.getVariables();

        return (
            <div>
                <h2>Examples</h2>
                <Card heading="Example card" className={css.mb3}>
                    <div>And because the Card component is the base of the all examples, here is a brief introduction.</div>
                </Card>

                <div className={css.mb3}>Card can be also rendered without a header. Just do not add heading property.</div>

                <Card className={css.mb3}>
                    <div>This can be used i.e. creating a differend color of cards...</div>
                </Card>

                <Card style={{ backgroundColor: styleVars["primary-color-1"], color: "#fff" }} className={css.mb3}>
                    <div>Using header with a colored card is not the best practise.</div>
                </Card>

                <Doc doc={CardExample.docProps} />
            </div>
        )
    }

}