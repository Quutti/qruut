import * as React from "react";
import { DocProps } from "../../doc";
import { Doc } from "../../components/doc";
import * as helpers from "../example-helpers";
import { Card } from "@components/card";
const css: { [key: string]: any } = require("../helpers.css");

import { Button } from "@components/button";

export class ButtonExample extends React.Component<{}, {}> {

    static docProps: DocProps = {
        name: "Button",
        properties: {
            text: {
                required: true,
                type: "string",
                desc: "Text for the Button",
            },
            className: helpers.getClassNameDescriptor(),
            disabled: {
                type: "boolean",
                desc: "Is button enabled or disabled"
            },
            onClick: {
                required: true,
                type: "function(evt)",
                desc: "Handles button click"
            }
        }
    }

    render(): JSX.Element {
        return (
            <div>
                <h2>Examples</h2>
                <Card className={css.mb3}>
                    <Button text="Normal button" className={css.mr2} onClick={() => { }} />
                    <Button text="Disabled button" disabled={true} onClick={() => { }} />
                </Card>

                <Doc doc={ButtonExample.docProps} />
            </div>
        )
    }

}