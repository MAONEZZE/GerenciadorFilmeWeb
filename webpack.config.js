const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

  // O ponto de entrada da aplicação
  entry: {
    index: path.resolve(__dirname, 'src/views', 'tela-inicio','tela-inicio.ts'),
    detalhe: path.resolve(__dirname, 'src/views', 'filme-detalhe','filme-detalhe.ts'),
    listagem: path.resolve(__dirname, 'src/views', 'filme-listagem','filme-listagem.ts')
  },

  performance: { 
    hints: false, 
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },//colocar isso aqui caso de o problema de imgem sobrecarregada na pagina

  // Configuração de output do build
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }      
    ]
  },

  // aliases
  resolve: {
    extensions: ['.ts', '.js', '.css'],

    alias: {
      assets: path.resolve(__dirname, 'src/assets')
    }
  },

  plugins: [
    
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/views', 'tela-inicio', 'tela-inicio.html'),
      chunks: ['index']
    }),

    new HtmlWebpackPlugin({
      filename: 'filme-detalhe.html',
      template: path.resolve(__dirname, 'src/views', 'filme-detalhe','filme-detalhe.html'),
      chunks: ['detalhe']
    }),

    new HtmlWebpackPlugin({
      filename: 'filme-listagem.html',
      template: path.resolve(__dirname, 'src/views', 'filme-listagem','filme-listagem.html'),
      chunks: ['listagem']
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }
      ]
    })
  ],

  // Ambiente de desenvolvimento
  devtool: 'source-map',
  
  devServer: {
    liveReload: true,
    port: 8080,
    static: {
      directory: path.resolve(__dirname, 'dist')
    },
    watchFiles: {
      paths: ['src']
    }
  }
};