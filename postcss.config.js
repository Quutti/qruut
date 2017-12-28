const webpack = require("webpack");

module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-simple-vars': {
            variables: () => {
                // Remove existing entry from the cache
                // and force reloading the module. This 
                // assures that the changes are propagated
                // to the webpack when using webpack-dev-server.
                const m = "./src/style-variables";
                delete require.cache[require.resolve(m)];
                return require(m).getVariables();
            }
        },
        'postcss-cssnext': {}
    }
}