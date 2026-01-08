const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 3000,
    hot: true,
    historyApiFallback: true,
    // Proxy API requests to the Node.js backend
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    ],
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Add custom route to serve index.html with userData injected - must be before other middlewares
      devServer.app.get('/', async (req, res) => {
        try {
          console.log('=== DEV SERVER: Serving custom index.html');

          const fs = require('fs').promises;
          const path = require('path');

          // Read the HTML template
          const htmlPath = path.join(__dirname, 'public', 'index.html');
          let html = await fs.readFile(htmlPath, 'utf-8');

          console.log('=== DEV SERVER: HTML file read successfully');

          // Fetch auth data
          const fetch = (await import('node-fetch')).default;
          console.log('=== DEV SERVER: Fetching auth data...');

          let userData;
          try {
            // Create abort controller for timeout
            const AbortController = globalThis.AbortController || (await import('abort-controller')).AbortController;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            // Generate random user ID between 1 and 10
            const randomUserId = Math.floor(Math.random() * 10) + 1;
            console.log('=== DEV SERVER: Fetching user ID:', randomUserId);

            // GET request to fetch actual user data
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${randomUserId}`, {
              method: 'GET',
              headers: {
                'content-type': 'application/json'
              },
              signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            userData = await response.json();
          } catch (error) {
            console.error('=== DEV SERVER: Error fetching auth data:', error.message);
            // Use fallback data
            userData = {
              id: 0,
              name: 'Guest User',
              username: 'guest',
              email: 'guest@example.com',
              error: error.message
            };
          }

          console.log('=== DEV SERVER: userData fetched:', JSON.stringify(userData));

          // Inject userData into the HTML
          const originalInput = '<input type="hidden" id="userData" />';
          const userDataJson = JSON.stringify(userData || {});
          const escapedJson = userDataJson.replace(/'/g, "&#39;");
          const newInput = `<input type="hidden" id="userData" value='${escapedJson}' />`;

          html = html.replace(originalInput, newInput);

          // Add the webpack script tag
          html = html.replace('</head>', '<script defer src="/bundle.js"></script></head>');

          console.log('=== DEV SERVER: userData injected successfully');

          res.setHeader('Content-Type', 'text/html');
          res.send(html);
        } catch (error) {
          console.error('=== DEV SERVER: Error:', error);
          res.status(500).send('Error loading page');
        }
      });

      return middlewares;
    }
  }
};
