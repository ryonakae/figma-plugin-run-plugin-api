/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) =>
  /** @type {import('webpack').Configuration} */
  ({
    mode: argv.mode || 'development',
    entry: {
      main: './src/main.ts',
      ui: './src/ui.tsx'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader'
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            { loader: 'css-loader', options: { sourceMap: true } }
          ]
        },
        {
          test: /\.(jpe?g|png|bmp|gif|webp|svg)$/,
          type: 'asset/inline'
        },
        {
          test: /\.dts$/i,
          use: 'raw-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/ui.html',
        filename: 'ui.html',
        inlineSource: '.(js)$',
        chunks: ['ui']
      })
    ]
  })
