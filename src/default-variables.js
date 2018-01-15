let variables = {
    "primary-color-1": "#4e7494",

    "success-color": "#8de057",
    "error-color": "#e05757",
    "warning-color": "",

    "separator-border-color": "#e0e0e0",
    "selectable-hover-color": "#becad4"
}

function setVariable(propName, value) {
    variables[propName] = value;
}

function getVariables() {

    let styleObjects = [];

    // Globals

    styleObjects.push({
        "font-family": "Roboto",
        "font-size": "16px",
        "color": "#333",
        "shadow": "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
    });

    // Button

    styleObjects.push({
        "button-color": variables["primary-color-1"]
    });

    // Card

    styleObjects.push({
        "card-border-color": variables["primary-color-1"],
        "card-border-radius": "3px"
    });

    // Table

    styleObjects.push({
        "table-header-row-border": variables["primary-color-1"],
        "table-row-border": variables["separator-border-color"]
    });

    // List

    styleObjects.push({
        "list-item-border": variables["separator-border-color"],
        "list-item-link-hover": variables["selectable-hover-color"]
    });

    // Line chart

    styleObjects.push({
        "line-chart-default-line-color": variables["primary-color-1"]
    });

    // Input

    styleObjects.push({
        "input-error-color": variables["error-color"],
        "input-border-color": "#c3c3c3",
        "input-padding": ".375rem .75rem",
        "input-font-size": "1rem"
    });

    // Popover

    styleObjects.push({
        "popover-max-width": "120px",
        "popover-min-width": "320px",
        "popover-padding": ".75rem"
    });

    styleObjects.push(variables);

    return Object.assign({}, ...styleObjects);
}

module.exports = {
    setVariable,
    getVariables
}