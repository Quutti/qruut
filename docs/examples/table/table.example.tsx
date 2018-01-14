import * as React from "react";
import { DocProps } from "../../doc";
import { Card } from "@components/card";

import { Table, TableColumn } from "@components/table";

const css: { [key: string]: any } = require("../helpers.css");

export class TableExample extends React.Component<{}, {}> {

    static docProps: DocProps = {
        name: "Table"
    }

    public render(): JSX.Element {

        const data1 = [];
        const data2 = [];

        for (let i = 0; i < 44; i++) {
            data1.push({
                id: `id-${i}`,
                v1: `Some value of item ${i}`,
                v2: "15125",
                v3: [<span style={{ color: "red" }}>Red text inside JSX Element!</span>, <span>And another</span>]
            });

            data2.push({
                id: `id-${i}`,
                v1: `Value ${i}`,
                v2: "15125",
                v3: new Date()
            });
        }

        return (
            <div>
                <h2>Examples</h2>

                <Card heading="Table example" className={css.mb3}>
                    <Table itemsPerPage={10} data={data1} selectable filterable sortable uniqueIdKey="id">
                        <TableColumn text="Test" propertyKey="v1" />
                        <TableColumn text="Numeric value" propertyKey="v2" type="numeric" />
                        <TableColumn text="Unsortable and unfilterable" filterable={false} sortable={false} propertyKey="v3" />
                    </Table>
                </Card>

                <Card heading="Table example 2" className={css.mb3}>
                    <Table itemsPerPage={10} data={data2} selectable filterable sortable uniqueIdKey="id">
                        <TableColumn text="Test" propertyKey="v1" />
                        <TableColumn text="Numeric value" propertyKey="v2" type="numeric" />
                        <TableColumn text="Unsortable and unfilterable" filterable={false} sortable={false} propertyKey="v3" customValue={(val) => val.toJSON().split("T")[0]} />
                    </Table>
                </Card>
            </div>
        )
    }

}