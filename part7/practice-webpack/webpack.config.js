const path = require('path')

// i'm guessing this takes index.js as entry and bundles the code
// into main.js in the build directory
const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.js'
  },
  devServer: {
    static: path.resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
  },
  devtool: 'source-map',
  module: {
    /*
    each of the objects in the rules array below is an object describing a 'loader'.
    we need to include a loader for each type of file, to enable webpack to bundle it,
    by informing webpack of files which need to be processed before they are bundled.
    In the 'presets', we describe the transpilers which need to be used. Transpilers
    take code written in one kind of javascript (for example JSX or different ES versions),
    and transform it into another form of javascript. Browsers typically do not support the latest
    features introduced in ES6 and ES7 (such as arrow functions, 'const' etc), so the code is transpiled to ES5.
    The css loaders load the CSS files and the style loader generates and injects a style element, containing all
    the styles of the application. The CSS definitions are included in the main.js file of the application,
    and therefore don't need to be loaded separately/explicitly in index.html 
    */
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
module.exports = config
