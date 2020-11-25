const path = require('path');
const themes = require('./antd.themes');

module.exports = [
  // Add support for native node modules
  {
    test: /\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@marshallofsound/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.(ts|tsx)$/,
    enforce: 'pre',
    use: [
      {
        options: {
          formatter: require.resolve('react-dev-utils/eslintFormatter'),
          eslintPath: require.resolve('eslint'),
        },
        loader: require.resolve('eslint-loader'),
      },
    ],
    exclude: /(node_modules|bower_components|lib|\.webpack)/,
    include: path.resolve(__dirname, 'src'),
  },
  // web worker start
  { 
    test: /\.worker\.(ts)$/,
    exclude: /(node_modules|bower_components|\.webpack)/,
    include: path.resolve(__dirname, 'src'),
    use: [
      {
        loader: 'worker-loader',
        options: {
          filename: '[name].[hash:8].js',
        }
      },
    ],
  },
  // web worker end
  {
    test: /\.(ts|tsx)$/,
    exclude: /(node_modules|bower_components|\.webpack)/,
    include: path.resolve(__dirname, 'src'),
    use: [
      // {
      //   loader: 'cache-loader',
      // },
      {
        loader: 'babel-loader',
      },
      {
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            noEmit: false,
          }
        }
      },
    ],
  },
  {
    test: /\.(less)$/,
    exclude: /(src)/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
      },
      {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
              ...themes.theme1,
            },
          },
        },
      },
    ]
  },
  {
    test: /\.(scss)$/,
    exclude: /(node_modules|bower_components|\.webpack)/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: '[local]--[hash:base64:5]',
          },
        },
      },
      'sass-loader'
    ]
  },
  {
    test: /\.(png|svg|jpg|gif|ico)$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: false,
          fallback: 'file-loader',
          name: '[name][contentHash:8].[ext]',
          outputPath: 'assets/images/',
        }
      },
    ],
  }, 
  {
    test: /\.(woff|woff2|eot|ttf|otf|mp3)$/,
    use: ['file-loader'],
  }
];
