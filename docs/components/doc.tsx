import * as React from "react";
import * as doc from "../doc";
import * as styleVars from "../../src/style-variables";
import { Card } from "@components/card";

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
                <Card>
                    {createStylingTable(this.props.doc.name)}
                </Card>
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
                <Card className={css.mb3}>
                    {createPropsTable(properties)}
                </Card>
            </div>

        )
    }

}

const createStylingTable = (name: string) => {
    const prefix = name.toLocaleLowerCase();

    const rows = Object.keys(styleVars)
        .filter(v => v.indexOf(prefix) === 0)
        .map((v, index) => {
            return (
                <tr key={index}>
                    <td>{v}</td>
                    <td>{styleVars[v]}</td>
                </tr>
            )
        });

    return (
        <table>
            <thead>
                <tr>
                    <th>Variable</th>
                    <th>Default value</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )

}

const createPropsTable = (p: { [key: string]: doc.DocPropsProp }) => {

    const rows = Object.keys(p)
        .map((prop, index) => {
            const item = p[prop];
            return (
                <tr key={index}>
                    <td>{prop}</td>
                    <td>{item.type}</td>
                    <td>{(item.required) ? "true" : "false"}</td>
                    <td>{item.desc}</td>
                </tr>
            )
        });

    return (
        <table>
            <thead>
                <tr>
                    <th>Property name</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}