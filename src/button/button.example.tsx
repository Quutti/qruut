import * as React from "react";
import { DocProps } from "../../examples/doc";
import { Button } from "./button";

export class ButtonExample extends React.Component<{}, {}> {

    static docProps: DocProps = {
        name: "Button"
    }

    render(): JSX.Element {
        return (
            <div>
                <div>Normal button <Button text="Save" onClick={() => { }} /></div>
                <div>Disabled button <Button text="Save" disabled={true} onClick={() => { }} /></div>
            </div>
        )
    }

}