import * as React from "react";
import { DocProps } from "../doc";
import * as helpers from "../example-helpers";
import { Card } from "@components/card";
const css: { [key: string]: any } = require("../helpers.css");

import { Button } from "@components/button";

export class ButtonExample extends React.Component<{}, {}> {

    static docProps: DocProps = {
        name: "Button"
    }

    render(): JSX.Element {
        return (
            <div>
                <h2>Examples</h2>
                <Card className={css.mb3}>
                    <Button text="Normal button" className={css.mr2} onClick={() => { }} />
                    <Button text="Disabled button" disabled={true} onClick={() => { }} />
                </Card>

                <h2>Component styling</h2>
                <Card>
                    {helpers.createStylingTable(ButtonExample.docProps.name)}
                </Card>
            </div>
        )
    }

}