const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const getFilesFromDir = require("./config/files");
const autoprefixer = require('autoprefixer');
const PAGE_DIR = path.join("src", "pages", path.sep);
const paths = require('./paths');


const htmlPlugins = getFilesFromDir(PAGE_DIR, [".html"]).map( filePath => {
  const fileName = filePath.replace(PAGE_DIR, "");
  // { chunks:["contact", "vendor"], template: "src/pages/contact.html",  filename: "contact.html"}
  return new HtmlWebPackPlugin({
    chunks:[fileName.replace(path.extname(fileName), ""), "vendor"],
    template: filePath,
    filename: fileName
  })
});

// { contact: "./src/pages/contact.js" }
const entry = getFilesFromDir(PAGE_DIR, [".js"]).reduce( (obj, filePath) => {
  const entryChunkName = filePath.replace(path.extname(filePath), "").replace(PAGE_DIR, "");
  obj[entryChunkName] = `./${filePath}`;
  return obj;
}, {}); 

module.exports = { 
  entry: entry,
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].[hash:4].js"
  },
  plugins: [
    ...htmlPlugins
  ],
  resolve:{
		alias:{
      '@styles': path.resolve(__dirname, '..', 'src', 'styles'),
			src: path.resolve(__dirname, "src"),
			components: path.resolve(__dirname, "src", "components")
		}
	},
  module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader:"babel-loader",
					options:{
						presets: [
							"@babel/preset-env",
							"@babel/preset-react"
						], 
					}
				},
      },
      {
        test: /\.scss$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          {
            loader: require.resolve('sass-loader'),
            options: {
              includePaths: [path.resolve(paths.appSrc, 'styles')]
            },
          },
        ],
      }],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: "initial",
            name: "vendor",
            enforce: true
          }
        }
      }
    }
};