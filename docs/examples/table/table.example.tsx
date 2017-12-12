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

        const rows: JSX.Element[] = [];
        for (let i = 0; i < 40; i++) {
            rows.push(
                <TableRow key={i}>
                    <TableCel text={`Item ${i}`} />
                    <TableCel text={`${1000 + i}`} align="right" />
                    <TableCel text={`Some decription for item ${i}. This must be so long text that cell will go into two lines so i can test it`} />
                </TableRow>
            )
        }

        return (
            <div>
                <h2>Examples</h2>

                <Card heading="Table example" className={css.mb3}>
                    <Table itemsPerPage={10}>
                        <TableCol text="Test" />
                        <TableCol text="Numeric value" align="right" />
                        <TableCol text="Test column 3" width="50%" />

                        {rows}

                    </Table>
                </Card>
            </div>
        )
    }

}