import * as React from "react";
import { DocProps } from "../../doc";
import { Card } from "@components/card";

import { Table, TableCol, TableCel, TableRow } from "@components/table";

const css: { [key: string]: any } = require("../helpers.css");

export class TableExample extends React.Component<{}, {}> {

    static docProps: DocProps = {
        name: "Table"
    }

    public render(): JSX.Element {
        return (
            <div>
                <h2>Examples</h2>

                <Card heading="Table example" className={css.mb3}>

                    <Table>
                        <TableCol text="Test" />
                        <TableCol text="Test col 2" />
                        <TableCol text="Test column 3" width="50%" />

                        <TableRow key={0}>
                            <TableCel text="abs" />
                            <TableCel text="1515" align="right" />
                            <TableCel text="abs" />
                        </TableRow>

                        <TableRow key={1}>
                            <TableCel text="abs" />
                            <TableCel text="16161" align="right" />
                            <TableCel text="abs" />
                        </TableRow>

                        <TableRow key={2}>
                            <TableCel text="abs" />
                            <TableCel text="1661" align="right" />
                            <TableCel text="abs" />
                        </TableRow >

                        <TableRow key={3}>
                            <TableCel text="abs" />
                            <TableCel text="151" align="right" />
                            <TableCel text="abs" />
                        </TableRow>
                    </Table>

                </Card>
            </div>
        )
    }

}