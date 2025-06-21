# Angular MCP Server

A Model Context Protocol (MCP) server that provides access to Angular documentation, allowing AI assistants to search and retrieve Angular-related information from `llms.txt` and `llms-full.txt` files.

## Features

The server provides 5 powerful tools for Angular documentation:

### 🔍 `search_angular_docs`
Search Angular documentation for specific topics, concepts, or keywords.
- **Parameters:**
  - `query` (required): Search query (e.g., "components", "dependency injection", "routing")
  - `category` (optional): Filter by category (Components, Templates, Directives, etc.)
  - `limit` (optional): Maximum number of results (default: 5)

### 📖 `get_angular_topic`
Get detailed information about a specific Angular topic.
- **Parameters:**
  - `topic` (required): Specific topic name (e.g., "Component lifecycle", "Signals overview")

### 📋 `list_angular_categories`
List all available Angular documentation categories with topic counts.

### 🌟 `get_angular_overview`
Get a comprehensive overview of the Angular framework and its features.

### 💡 `find_angular_examples`
Find code examples and practical implementations for Angular concepts.
- **Parameters:**
  - `concept` (required): Angular concept to find examples for (e.g., "component", "service", "directive")

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the server:**
   ```bash
   npm run build
   ```

3. **Test the server:**
   ```bash
   npm run test
   ```

## Usage

### With Claude Desktop

Add this configuration to your Claude Desktop MCP settings:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "angular-docs": {
      "command": "node",
      "args": ["/Users/sai.gangula/Desktop/angular-mcp-server/build/index.js"]
    }
  }
}
```

### With VSCode (Cline)

Add to your Cline MCP settings:
`~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

```json
{
  "mcpServers": {
    "angular-docs": {
      "command": "node",
      "args": ["/Users/sai.gangula/Desktop/angular-mcp-server/build/index.js"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Manual Testing

You can test the server manually using the MCP inspector:

```bash
npx @modelcontextprotocol/inspector build/index.js
```

## Example Queries

Once integrated with your AI assistant, you can ask questions like:

- "Search for Angular component lifecycle methods"
- "Show me information about Angular signals"
- "Find examples of dependency injection in Angular"
- "List all Angular documentation categories"
- "Get an overview of Angular framework"

## Documentation Sources

The server reads from two files located in the `src` directory:
- `src/llms.txt`: Structured overview of Angular documentation with links
- `src/llms-full.txt`: Detailed Angular documentation content

These files are automatically copied to the `build` directory during compilation.

## Development

### Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm run start`: Run the compiled server
- `npm run dev`: Build and run in one command
- `npm run test`: Test with MCP inspector

### Project Structure

```
angular-mcp-server/
├── src/
│   ├── index.ts          # Main server implementation
│   ├── llms.txt         # Angular docs structure
│   └── llms-full.txt    # Detailed Angular content
├── build/                # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Features Loaded

The server successfully loads **84 Angular documentation topics** across multiple categories:

- Components
- Templates guides  
- Directives
- Signals
- Dependency injection (DI)
- Forms
- HTTP client
- Routing
- Testing
- And many more...

## Troubleshooting

1. **File not found errors**: Ensure `llms.txt` and `llms-full.txt` are in the `src` directory and run `npm run build`
2. **Permission errors**: Make sure the build directory is writable
3. **Port conflicts**: The server uses stdio, so no port conflicts should occur

## License

MIT License - Feel free to use and modify as needed.
