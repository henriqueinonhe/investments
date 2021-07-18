const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");

//Plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const WatchMissingNodeModulesPlugin = require("@nenado/watch-missing-node-modules-plugin");
const EsLintWebpackPlugin = require("eslint-webpack-plugin");
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const styledComponentsTransformer = createStyledComponentsTransformer();
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionPlugin = require("compression-webpack-plugin");
const CircularDependencyPlugin = require("circular-dependency-plugin");


//Initializing Environment Variables
dotenv.config();
const environmentVariables = [
  "API_BASE_URL",
  "API_BASE_URL",
  "AUTH0_DOMAIN",
  "AUTH0_CLIENT_ID",
  "AUTH0_AUDIENCE"
];

const config = env => {
  const srcPath = path.resolve(__dirname, "src");
  
  const typescriptLoaderRule = {
    test: /(?<!\.test)\.(ts|tsx)$/,
    include: [srcPath],
    use: {
      loader: "ts-loader",
      options: {
        //Type checking is handled by ForkTsChecker
        transpileOnly: true,
        //Build paralelization
        happyPackMode: true,
        getCustomTransformers: () => ({ before: [styledComponentsTransformer] })
      }
    },
  };
  
  //React and styled components transpiling
  const babelLoaderRule = {
    test: /(?<!\.test)\.(mjs|js|jsx)$/,
    include: [srcPath],
    use: {
      loader: "babel-loader",
      options: {
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
        ],
        cacheDirectory: true,
        //Gzipping cache
        compact: env.NODE_ENV === "production"
      }
    }
  };

  //Importing CSS
  const cssLoaderRule = {
    test: /\.css$/i,
    use: ["style-loader", "css-loader"]
  };

  //Importing assets
  const fileLoaderRule = {
    test: /\.(png|jpe?g|gif|mp3|svg|woff|woff2|eot|ttf|otf|mp4)$/i,
    type: "asset/resource"
  };

  return {
    mode: env.NODE_ENV,
    //Stops compilation on the first error
    bail: env.NODE_ENV === "production",
    devtool: env.NODE_ENV === "development" ? "eval-cheap-module-source-map" : "source-map",
    entry: {
      index: "./src/index.tsx"
    },
    output: {
      path: path.resolve(__dirname, "public"),
      filename: env.NODE_ENV === "development" ? "[fullhash].[name].js" : "[fullhash].[name].js",
      pathinfo: false,
      assetModuleFilename: "assets/[name][ext]",
      //So that every resource will be served as if the URL was "/" (client side routing)
      publicPath: "/",
      clean: true
    },
    module: {
      strictExportPresence: true,
      rules: [
        typescriptLoaderRule,
        babelLoaderRule,
        cssLoaderRule,
        fileLoaderRule,
      ]
    },
    resolve: {
      //Only tries to resolve modules with these extensions
      extensions: [".mjs", ".ts", ".tsx", ".js", ".jsx", ".json"],
      //Doesn't resolve symlinks to actual location (improves build performance)
      symlinks: false,
      //Allows us to reference files (when importing) without specifying 
      //their extensions (.js, .ts, etc)
      enforceExtension: false,
      //Not sure what this does, so be aware (but should improve build performance)
      cacheWithContext: false
    },
    plugins: [
      new webpack.EnvironmentPlugin(environmentVariables),
      new ForkTsCheckerWebpackPlugin({
        async: env.NODE_ENV === "development",
        typescript: {
          checkSyntacticErrors: true,
          tsconfig: "./tsconfig.json"
        }
      }),
      new CaseSensitivePathsPlugin(),
      new CircularDependencyPlugin({
        include: /src/
      }),
      new WatchMissingNodeModulesPlugin(),
      new HtmlWebpackPlugin({
        title: "Title",
        filename: "index.html",
        meta: { viewport: "width=device-width, initial-scale=1, user-scalable=no" },
        chunks: ["index"]
      }),
      env.NODE_ENV === "production" ? new EsLintWebpackPlugin({
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx']
      }) : null,
      // new BundleAnalyzerPlugin(),
      env.NODE_ENV === "production" ? new CompressionPlugin() : null
    ].filter(plugin => plugin !== null),
    optimization: {
      minimize: env.NODE_ENV === "production",
      mergeDuplicateChunks: true,
      removeEmptyChunks: env.NODE_ENV === "production",
      removeAvailableModules: env.NODE_ENV === "production",
      splitChunks: {
        chunks: "all",
        //Test this
        name: false
      },
    },
    devServer: {
      contentBase: "./public",
      //Gzip compression for everything
      compress: true,
      liveReload: true,
      //Opens browser automatically
      open: true,
      //Shows warnings/errors as overlay on the web page
      overlay: true,
      //Serves index.html to every route (client side routing)
      historyApiFallback: true,
      https: true,
      port: process.env.PORT,

      //To be accessible from places other than localhost
      host: '0.0.0.0',
      disableHostCheck: true,
      watchOptions: {
        poll: 500
      },
      //AWS Amplify doesn't understand nullish coalescence operator
      sockPort: process.env.SOCK_PORT !== undefined ? 
        process.env.SOCK_PORT : process.env.PORT
    },
    watchOptions: {
      ignored: /cypress/
    }
  };
}

module.exports = [config];
