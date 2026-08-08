const babelOptions = {
  presets: [
    ["babel-preset-gatsby", { targets: { node: "current" } }],
  ],
}

module.exports = require("babel-jest").createTransformer(babelOptions)
