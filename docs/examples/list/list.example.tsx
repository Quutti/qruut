import * as React from "react";
import { DocProps } from "../../doc";
import { Doc } from "../../components/doc";
import { Card } from "@components/card";
import { GridContainer, GridRow, GridCol } from "@components/grid";
import * as helpers from "../example-helpers";

import { List, ListItem } from "@components/list";

const css: { [key: string]: any } = require("../helpers.css");

export class ListExample extends React.Component<{}, {}> {

    static docProps: DocProps = {
        name: "List",
        properties: {}
    }

    render(): JSX.Element {
        return (
            <div>
                <h2>Examples</h2>
                <GridContainer>
                    <GridRow>

                        <GridCol xl={4} lg={4} md={6} sm={6}>
                            <Card heading="List example" className={css.mb3}>
                                <List>
                                    <ListItem>Item 1</ListItem>
                                    <ListItem>Item 2</ListItem>
                                    <ListItem>Item 3</ListItem>
                                    <ListItem>Item 4</ListItem>
                                    <ListItem>Item 5</ListItem>
                                </List>
                            </Card>
                        </GridCol>

                        <GridCol xl={4} lg={4} md={6} sm={6}>
                            <Card heading="List example with links" className={css.mb3}>

                                <List>
                                    <ListItem to="/">Item 1</ListItem>
                                    <ListItem to="/">Item 2</ListItem>
                                    <ListItem to="/">Item 3</ListItem>
                                    <ListItem to="/">Item 4</ListItem>
                                    <ListItem to="/">Item 5</ListItem>
                                </List>

                            </Card>
                        </GridCol>

                    </GridRow>
                </GridContainer>
                <Doc doc={ListExample.docProps} />
            </div>
        )
    }

}