import * as React from "react";
import { DocProps } from "../../doc";
import { Doc } from "../../components/doc";
import { GridCol, GridRow, GridContainer } from "@components/grid";
import { Card } from "@components/card";
import { Input } from "@components/input";
import * as helpers from "../example-helpers";

const css: { [key: string]: any } = require("../helpers.css");

export class InputExample extends React.Component<{}, {}> {

    static docProps: DocProps = {
        name: "Input",
        properties: {

        }
    }

    render(): JSX.Element {
        return (
            <div>
                <h2>Examples</h2>
                <Card heading="Input examples" className={css.mb3}>
                    <GridContainer>

                        <h3>Types</h3>

                        <GridRow>

                            <GridCol lg={4} xl={4} md={4} sm={6} className={css.mb3}>
                                <Input label="Normal text type" name="text1" onChange={() => { }} />
                            </GridCol>

                            <GridCol lg={4} xl={4} md={4} sm={6} className={css.mb3}>
                                <Input label="Password type" type="password" name="pw1" onChange={() => { }} />
                            </GridCol>

                            <GridCol lg={4} xl={4} md={4} sm={6} className={css.mb3}>
                                <Input label="Integer type" type="integer" name="int1" onChange={() => { }} />
                            </GridCol>

                            <GridCol lg={4} xl={4} md={4} sm={6} className={css.mb3}>
                                <Input label="Floating type" type="number" name="float1" onChange={() => { }} />
                            </GridCol>

                            <GridCol lg={4} xl={4} md={4} sm={6} className={css.mb3}>
                                <Input label="Date type" type="date" name="date1" onChange={() => { }} />
                            </GridCol>

                        </GridRow>

                        <h3>Other</h3>

                        <GridRow>

                            <GridCol lg={4} xl={4} md={4} sm={6} className={css.mb3}>
                                <Input label="With default value" name="default1" defaultValue="Default!" onChange={() => { }} />
                            </GridCol>

                            <GridCol lg={4} xl={4} md={4} sm={6} className={css.mb3}>
                                <Input label="With required value" name="required1" isRequired onChange={() => { }} />
                            </GridCol>


                        </GridRow>
                    </GridContainer>
                </Card>

                <Doc doc={InputExample.docProps} />
            </div>
        )
    }

}