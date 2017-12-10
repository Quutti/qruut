import * as React from "react";
import * as ReactDOM from "react-dom";

import { BrowserRouter, NavLink } from "react-router-dom";
import { Switch, Route } from "react-router";

import { DocumentedComponent } from "./doc";
import * as Examples from "./examples";

const exampleComponents: DocumentedComponent[] = [];

for (let c of Object.keys(Examples)) {
    const component: any = Examples[c];
    if (typeof component === 'function' && !!component.prototype.isReactComponent) {
        exampleComponents.push(component as DocumentedComponent);
    }
}

const routes = exampleComponents.map((c, i) => {
    return <Route key={i} path={`/${c.docProps.name}`} exact={true} component={c as any} />
});

const links = exampleComponents.map((c, i) => {
    return <li key={i}><NavLink to={`/${c.docProps.name}`}>{c.docProps.name}</NavLink></li>
})

ReactDOM.render((
    <BrowserRouter>
        <div>
            <ul>
                {links}
            </ul>
            <Switch>
                {routes}
            </Switch>
        </div>
    </BrowserRouter>
), document.getElementById("app"));