const styleObjects = [];
const primaryColor = "#4e7494";

// Globals

styleObjects.push({
    "primary-color-1": primaryColor
})

styleObjects.push({
    "font-family": "Roboto",
    "font-size": "16px",
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

module.exports = Object.assign({}, ...styleObjects);