const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const isProduction = process.env.NODE_ENV == "production";

const config = (env) =>  {

  return {
    entry: "./src/browser/index.ts",
    output: {
      path: path.resolve(__dirname, "public/"),
      chunkFilename: 'scripts/bundle.js',
      filename: 'scripts/bundle.js',
      assetModuleFilename: (pathData) => {
        const filepath = path
            .dirname(pathData.filename)
            .split("/")
            .slice(1)
            .join("/");
        return `./styles/${filepath}/[name].[hash][ext][query]`;
      },
    },
    devServer: {
      open:true,
      port: 3333,
      hot: true,
      client: {
        overlay: true,
        progress: true,
        reconnect: true,
      },
    },
    devtool:'source-map',
    plugins: [
      new MiniCssExtractPlugin({
        filename: "./styles/main.css"
      }),
      new webpack.DefinePlugin({
        ENV: JSON.stringify(env.ENV),
        DOMAIN: JSON.stringify(env.DOMAIN),
        APIBASE: JSON.stringify(env.APIBASE)
      })
  ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/i,
          loader: "ts-loader",
          exclude: ["/node_modules/"],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
          type: "asset/resource",
        }
      ],
    },
    resolve: {
      extensions: [".ts",".js"]
    }
  }
};

module.exports = (env) => {

  let c = config(env);

  if (isProduction) {
    c.mode = "production";
  } else {
    c.mode = "development";
  }
  return c;
};
