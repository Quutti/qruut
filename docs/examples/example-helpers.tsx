import * as React from "react";
import * as styleVars from "../../src/style-variables";

export const createStylingTable = (name: string) => {
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