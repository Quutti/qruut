import * as React from "react";
import * as doc from "../doc";
import * as styleVars from "../../src/style-variables";
import { Card } from "@components/card";
import { Table, TableColumn } from "@components/table";

import * as helpers from "../examples/example-helpers";

const css: { [key: string]: any } = require("../examples/helpers.css");

export interface DocProps {
    doc: doc.DocProps;
}

export class Doc extends React.Component<DocProps, {}> {

    public render(): JSX.Element {

        return (
            <div>
                {this._getPropsTable()}
                <h2>Component styling</h2>
                <Card>{createStylingTable(this.props.doc.name)}</Card>
            </div>
        )

    }

    private _getPropsTable(): JSX.Element {
        const { properties } = this.props.doc;

        if (!properties) {
            return null;
        }

        return (
            <div>
                <h2>Component properties</h2>
                <Card className={css.mb3}>{createPropsTable(properties)}</Card>
            </div>
        )
    }

}

const createStylingTable = (name: string) => {
    const prefix = name.toLocaleLowerCase();

    const rows = Object.keys(styleVars)
        .filter(v => v.indexOf(prefix) === 0)
        .map((v, index) => {
            return { prop: `$${v}`, value: styleVars[v] };
        });

    return (
        <Table data={rows}>
            <TableColumn propertyKey="prop" text="Variable" />
            <TableColumn propertyKey="value" text="Default value" />
        </Table>
    );
}

const createPropsTable = (p: { [key: string]: doc.DocPropsProp }) => {

    const rows = Object.keys(p)
        .map((prop, index) => {
            const item = p[prop];
            return { ...item, ...{ prop } };
        });

    return (
        <Table data={rows}>
            <TableColumn propertyKey="prop" text="Property name" />
            <TableColumn propertyKey="type" text="Type" />
            <TableColumn propertyKey="required" text="Required" />
            <TableColumn propertyKey="desc" text="Description" />
        </Table>
    );
}