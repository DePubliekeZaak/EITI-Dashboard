const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const isProduction = process.env.NODE_ENV == "production";

const config = (env) =>  {

  return {
    entry: {
      scaffold: {
        import: "./src/browser/index.ts",
      },
      payments: {
        filename: "scripts/payments.bundle.js",
        import: "./src/pages/payments/index.ts",
        library: {
          name: 'payments',
          type: 'window',
          export: 'default',
        }
      },
      reconciliation: {
        filename: "scripts/reconciliation.bundle.js",
        import: "./src/pages/reconciliation/index.ts",
        library: {
          name: 'reconciliation',
          type: 'window',
          export: 'default',
        }
      },
      ebn: {
        filename: "scripts/ebn.bundle.js",
        import: "./src/pages/ebn/index.ts",
        library: {
          name: 'ebn',
          type: 'window',
          export: 'default',
        }
      },
      economy: {
        filename: "scripts/economy.bundle.js",
        import: "./src/pages/economy/index.ts",
        library: {
          name: 'economy',
          type: 'window',
          export: 'default',
        }
      },
      ubo: {
        filename: "scripts/ubo.bundle.js",
        import: "./src/pages/ubo/index.ts",
        library: {
          name: 'ubo',
          type: 'window',
          export: 'default',
        }
      },
      company: {
        filename: "scripts/company.bundle.js",
        import: "./src/pages/company/index.ts",
        library: {
          name: 'company',
          type: 'window',
          export: 'default',
        }
      },
      not_available: {
        filename: "scripts/not_available.bundle.js",
        import: "./src/pages/not_available/index.ts",
        library: {
          name: 'not_available',
          type: 'window',
          export: 'default',
        }
      },
      charts: {
        import: "./src/charts/index.ts"
      },
      css: {
        import: "/styling/main.scss"
      }
    },
    output: {
      path: path.resolve(__dirname, "public/"),
      filename: 'scripts/[name].bundle.js',
      assetModuleFilename: (pathData) => {
        const filepath = path
            .dirname(pathData.filename)
            .split("/")
            .slice(1)
            .join("/");
        return `./styles/${filepath}/[name].[hash][ext][query]`;
      },
    },
    mode: 'development',
    optimization: {
      usedExports: false,
    },
    devServer: {
      open:false,
      port: 3339,
      hot: true,
      historyApiFallback: {
        index: 'index.html'
      },
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
      modules: ['public/scripts','node_modules'],
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
