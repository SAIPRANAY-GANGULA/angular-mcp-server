# Angular MCP Server

A Model Context Protocol (MCP) server that provides comprehensive access to Angular documentation, enabling AI assistants to search and retrieve Angular-related information with intelligent relevance scoring.

[![npm version](https://badge.fury.io/js/angular-mcp-server.svg)](https://badge.fury.io/js/angular-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

The server provides 5 powerful tools for Angular documentation:

### 🔍 `search_angular_docs`
Search Angular documentation for specific topics, concepts, or keywords with intelligent relevance scoring.
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

## Usage

### With Claude Desktop

Add this configuration to your Claude Desktop MCP settings:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "angular-docs": {
      "command": "npx",
      "args": ["angular-mcp-server"]
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
      "command": "npx",
      "args": ["angular-mcp-server"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### With Amazon Q for command line

Amazon Q CLI supports MCP servers through configuration. Add this to your MCP configuration:

```json
{
  "mcpServers": {
    "angular-docs": {
      "command": "npx",
      "args": ["angular-mcp-server"]
    }
  }
}
```

Once configured, you can interact with Angular documentation directly through Amazon Q:

```bash
# Start Amazon Q chat with MCP support
q chat

# Example queries you can ask:
# "Search for Angular component lifecycle methods"
# "Show me dependency injection examples"
# "How do I implement reactive forms?"
# "List all Angular documentation categories"
```

Amazon Q will automatically use the Angular MCP Server to provide comprehensive Angular documentation and code examples.

## Example Queries

Once integrated with your AI assistant, you can ask questions like:

- "Search for Angular component lifecycle methods"
- "Show me information about Angular signals"
- "Find examples of dependency injection in Angular"
- "List all Angular documentation categories"
- "Get an overview of Angular framework"
- "How do I implement reactive forms in Angular?"
- "What are the best practices for Angular testing?"

## Documentation Coverage

The server provides access to **84 Angular documentation topics** across **15 categories**:

- **Components** (7 topics) - Component basics, lifecycle, styling, inputs/outputs
- **Templates** (7 topics) - Template syntax, binding, control flow, variables
- **Directives** (5 topics) - Built-in and custom directives, composition
- **Signals** (3 topics) - Reactive programming with Angular signals
- **Dependency Injection** (7 topics) - DI patterns, providers, services
- **Forms** (6 topics) - Reactive and template-driven forms, validation
- **Routing** (7 topics) - Navigation, route guards, lazy loading
- **HTTP Client** (5 topics) - API communication, interceptors, testing
- **Testing** (12 topics) - Unit testing, component testing, e2e testing
- **Server-Side Rendering** (6 topics) - SSR, hydration, prerendering
- **Animations** (3 topics) - Component and route animations
- **RxJS Integration** (2 topics) - Observables with Angular
- **APIs & CLI** (2 topics) - Reference documentation
- **Advanced Topics** (9 topics) - Performance, security, best practices
- **Getting Started** (3 topics) - Installation, setup, style guide

## Development

### Building from Source

```bash
git clone https://github.com/SAIPRANAY-GANGULA/angular-mcp-server.git
cd angular-mcp-server
npm install
npm run build
```

### Scripts

- `npm run build`: Compile TypeScript and copy documentation files
- `npm run start`: Run the compiled server
- `npm run dev`: Build and run in development mode
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
├── LICENSE
└── README.md
```

## Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Server not starting**: Ensure Node.js v18+ is installed
2. **Permission errors**: Try running with `sudo` for global installation
3. **MCP client not connecting**: Verify the configuration file syntax
4. **No search results**: Check that the documentation files are properly loaded

### Getting Help

- 📖 [Documentation](https://github.com/SAIPRANAY-GANGULA/angular-mcp-server#readme)
- 🐛 [Report Issues](https://github.com/SAIPRANAY-GANGULA/angular-mcp-server/issues)
- 💬 [Discussions](https://github.com/SAIPRANAY-GANGULA/angular-mcp-server/discussions)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk)
- Angular documentation sourced from [angular.dev](https://angular.dev)
- Inspired by the growing MCP ecosystem

---

**Made with ❤️ for the Angular and AI community**
