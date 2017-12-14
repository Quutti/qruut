const styleObjects = [];
const primaryColor = "#4e7494";
const separatorBorderColor = "#e0e0e0";
const selectableHoverColor = "#becad4";
// Globals

styleObjects.push({
    "primary-color-1": primaryColor,
    "separator-border-color": separatorBorderColor
})

styleObjects.push({
    "font-family": "Roboto",
    "font-size": "16px",
    "color": "#333",
    "shadow": "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
});

// Button

styleObjects.push({
    "button-color": primaryColor
});

// Card

styleObjects.push({
    "card-border-color": primaryColor,
    "card-border-radius": "3px"
});

// Table

styleObjects.push({
    "table-header-row-border": primaryColor,
    "table-row-border": separatorBorderColor
});

// List

styleObjects.push({
    "list-item-border": separatorBorderColor,
    "list-item-link-hover": selectableHoverColor
});

module.exports = Object.assign({}, ...styleObjects);