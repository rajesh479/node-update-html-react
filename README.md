# Todo App - React + Node.js + Webpack

A full-stack Todo application built with React and Node.js, running on the same port using Webpack Dev Server proxy configuration.

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete todos
- **Real-time Updates**: Changes are immediately reflected in the UI
- **Edit Mode**: Click "Edit" to modify existing todos
- **Completion Status**: Mark todos as complete/incomplete with checkboxes
- **Modern UI**: Beautiful gradient design with smooth animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: User-friendly error messages for failed operations

## Tech Stack

### Frontend
- **React 18**: Modern UI library with hooks
- **Webpack 5**: Module bundler with hot module replacement
- **Babel**: JavaScript transpiler for modern ES6+ syntax
- **CSS3**: Custom styling with gradients and animations

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **CORS**: Cross-origin resource sharing support
- **Body Parser**: Parse incoming request bodies

## Architecture

The application uses Webpack Dev Server's proxy feature to run both frontend and backend on the same port:

```
Browser (localhost:3000)
    ↓
Webpack Dev Server (port 3000)
    ↓ (proxies /api/* requests)
Node.js Backend (port 3001)
```

- **Frontend**: Served by Webpack Dev Server on port 3000
- **Backend**: Node.js/Express server on port 3001
- **Proxy**: Webpack Dev Server proxies all `/api/*` requests to the backend

## Project Structure

```
WebpackTodo/
├── public/
│   └── index.html          # HTML template
├── server/
│   └── index.js            # Node.js/Express backend
├── src/
│   ├── api/
│   │   └── todoApi.js      # API service functions
│   ├── components/
│   │   ├── TodoForm.js     # Add new todo form
│   │   ├── TodoItem.js     # Individual todo item
│   │   └── TodoList.js     # List of todos
│   ├── App.js              # Main React component
│   ├── index.js            # React entry point
│   └── styles.css          # Application styles
├── .babelrc                # Babel configuration
├── webpack.config.js       # Webpack configuration
└── package.json            # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd WebpackTodo
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

#### Development Mode (Recommended)

Run both frontend and backend concurrently:

```bash
npm run dev
```

This will:
- Start the Node.js backend on port 3001
- Start the Webpack Dev Server on port 3000
- Open your browser automatically at http://localhost:3000
- Enable hot module replacement for instant updates

#### Separate Commands

If you prefer to run them separately:

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

#### Production Build

Build the optimized production bundle:

```bash
npm run build
```

Then run the backend and serve the built files:

```bash
npm start
```

## API Endpoints

All API endpoints are prefixed with `/api`:

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `GET /api/health` - Health check endpoint

## Webpack Dev Server Proxy Configuration

The key to running on the same port is the proxy configuration in `webpack.config.js`:

```javascript
devServer: {
  port: 3000,
  proxy: [
    {
      context: ['/api'],
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false
    }
  ]
}
```

This configuration:
- Serves the React app on port 3000
- Intercepts all requests to `/api/*`
- Forwards them to the Node.js backend on port 3001
- Returns the backend response to the frontend

## How It Works

1. **User visits http://localhost:3000**
   - Webpack Dev Server serves the React application

2. **React app makes API call to `/api/todos`**
   - The request goes to http://localhost:3000/api/todos

3. **Webpack Dev Server intercepts the request**
   - Recognizes the `/api` prefix
   - Proxies it to http://localhost:3001/api/todos

4. **Node.js backend processes the request**
   - Express routes handle the API logic
   - Returns JSON response

5. **Response flows back to React**
   - Through the proxy back to the frontend
   - React updates the UI

## Benefits of This Approach

1. **No CORS Issues**: Both frontend and backend appear to be on the same origin
2. **Hot Module Replacement**: Instant updates during development
3. **Production-Ready**: Easy to switch to separate deployments
4. **Simple Configuration**: Single proxy setting handles all API routes
5. **Clean URLs**: No need for full URLs in API calls (just `/api/...`)

## Customization

### Changing Ports

To change the ports, update:

1. **Backend port** in `server/index.js`:
```javascript
const PORT = process.env.PORT || 3001;
```

2. **Frontend port** in `webpack.config.js`:
```javascript
devServer: {
  port: 3000,
  // ...
}
```

3. **Proxy target** in `webpack.config.js`:
```javascript
proxy: [
  {
    context: ['/api'],
    target: 'http://localhost:3001', // Update this
    // ...
  }
]
```

### Adding New Features

1. Add new API endpoints in `server/index.js`
2. Create corresponding API functions in `src/api/todoApi.js`
3. Use the API functions in React components

## Troubleshooting

### Port Already in Use

If you get a port in use error:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Proxy Not Working

1. Ensure the backend server is running on port 3001
2. Check the proxy configuration in `webpack.config.js`
3. Restart the Webpack Dev Server

### Hot Reload Not Working

1. Ensure `hot: true` is set in `webpack.config.js`
2. Clear browser cache
3. Restart the dev server

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
