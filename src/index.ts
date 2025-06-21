#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface SearchResult {
  section: string;
  content: string;
  url?: string;
  relevanceScore: number;
}

interface AngularTopic {
  title: string;
  url?: string;
  content: string;
  category: string;
}

class AngularMCPServer {
  private server: Server;
  private angularDocs: AngularTopic[] = [];
  private llmsContent: string = '';
  private llmsFullContent: string = '';

  constructor() {
    console.error('[Setup] Initializing Angular MCP server...');
    
    this.server = new Server(
      {
        name: 'angular-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.loadDocumentation();
    this.setupToolHandlers();
    
    this.server.onerror = (error) => console.error('[Error]', error);
    
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private loadDocumentation() {
    try {
      // Load llms.txt (structured overview) - files are in src directory
      const llmsPath = join(__dirname, 'llms.txt');
      this.llmsContent = readFileSync(llmsPath, 'utf-8');
      
      // Load llms-full.txt (detailed content)
      const llmsFullPath = join(__dirname, 'llms-full.txt');
      this.llmsFullContent = readFileSync(llmsFullPath, 'utf-8');
      
      // Parse the structured documentation
      this.parseAngularDocs();
      
      console.error(`[Setup] Loaded Angular documentation with ${this.angularDocs.length} topics`);
    } catch (error) {
      console.error('[Error] Failed to load documentation files:', error);
    }
  }

  private parseAngularDocs() {
    const lines = this.llmsContent.split('\n');
    let currentCategory = '';
    let currentTopic: AngularTopic | null = null;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and main title
      if (!trimmedLine || trimmedLine === '# Angular' || trimmedLine.startsWith('Angular — Deliver')) {
        continue;
      }
      
      // Category headers (## Title)
      if (trimmedLine.startsWith('## ')) {
        currentCategory = trimmedLine.replace('## ', '');
        continue;
      }
      
      // Topic items (- [Title](url))
      const topicMatch = trimmedLine.match(/^- \[([^\]]+)\]\(([^)]+)\)/);
      if (topicMatch) {
        const [, title, url] = topicMatch;
        
        // Get detailed content from llms-full.txt if available
        const detailedContent = this.extractDetailedContent(title, url);
        
        this.angularDocs.push({
          title,
          url,
          content: detailedContent || `${currentCategory}: ${title}`,
          category: currentCategory
        });
      }
    }
  }

  private extractDetailedContent(title: string, url: string): string {
    // Try to find relevant content in llms-full.txt
    const sections = this.llmsFullContent.split(/\n#{1,3}\s+/);
    
    for (const section of sections) {
      if (section.toLowerCase().includes(title.toLowerCase()) || 
          section.includes(url)) {
        return section.substring(0, 1000) + (section.length > 1000 ? '...' : '');
      }
    }
    
    return '';
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'search_angular_docs',
          description: 'Search Angular documentation for specific topics, concepts, or keywords',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query (e.g., "components", "dependency injection", "routing")',
              },
              category: {
                type: 'string',
                description: 'Optional: Filter by category (Components, Templates, Directives, etc.)',
              },
              limit: {
                type: 'number',
                description: 'Maximum number of results to return (default: 5)',
                default: 5,
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'get_angular_topic',
          description: 'Get detailed information about a specific Angular topic',
          inputSchema: {
            type: 'object',
            properties: {
              topic: {
                type: 'string',
                description: 'Specific topic name (e.g., "Component lifecycle", "Signals overview")',
              },
            },
            required: ['topic'],
          },
        },
        {
          name: 'list_angular_categories',
          description: 'List all available Angular documentation categories',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_angular_overview',
          description: 'Get a comprehensive overview of Angular framework and its features',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'find_angular_examples',
          description: 'Find code examples and practical implementations for Angular concepts',
          inputSchema: {
            type: 'object',
            properties: {
              concept: {
                type: 'string',
                description: 'Angular concept to find examples for (e.g., "component", "service", "directive")',
              },
            },
            required: ['concept'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case 'search_angular_docs':
            return await this.searchAngularDocs(args as { query: string; category?: string; limit?: number });
          
          case 'get_angular_topic':
            return await this.getAngularTopic(args as { topic: string });
          
          case 'list_angular_categories':
            return await this.listAngularCategories();
          
          case 'get_angular_overview':
            return await this.getAngularOverview();
          
          case 'find_angular_examples':
            return await this.findAngularExamples(args as { concept: string });
          
          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        console.error('[Error] Tool execution failed:', error);
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error}`);
      }
    });
  }

  private async searchAngularDocs(args: { query: string; category?: string; limit?: number }) {
    const { query, category, limit = 5 } = args;
    
    if (!query.trim()) {
      throw new McpError(ErrorCode.InvalidParams, 'Search query cannot be empty');
    }

    console.error(`[API] Searching Angular docs for: "${query}" in category: "${category || 'all'}"`);

    const results: SearchResult[] = [];
    const searchTerms = query.toLowerCase().split(' ');

    for (const doc of this.angularDocs) {
      if (category && !doc.category.toLowerCase().includes(category.toLowerCase())) {
        continue;
      }

      let relevanceScore = 0;
      const searchableText = `${doc.title} ${doc.content} ${doc.category}`.toLowerCase();

      // Calculate relevance score
      for (const term of searchTerms) {
        if (doc.title.toLowerCase().includes(term)) {
          relevanceScore += 3; // Title matches are most important
        }
        if (doc.category.toLowerCase().includes(term)) {
          relevanceScore += 2; // Category matches are important
        }
        if (doc.content.toLowerCase().includes(term)) {
          relevanceScore += 1; // Content matches
        }
      }

      if (relevanceScore > 0) {
        results.push({
          section: doc.title,
          content: doc.content || `${doc.category}: ${doc.title}`,
          url: doc.url,
          relevanceScore,
        });
      }
    }

    // Sort by relevance and limit results
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const limitedResults = results.slice(0, limit);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            query,
            category: category || 'all',
            totalResults: results.length,
            results: limitedResults.map(r => ({
              title: r.section,
              content: r.content.substring(0, 300) + (r.content.length > 300 ? '...' : ''),
              url: r.url,
              relevanceScore: r.relevanceScore,
            })),
          }, null, 2),
        },
      ],
    };
  }

  private async getAngularTopic(args: { topic: string }) {
    const { topic } = args;
    
    if (!topic.trim()) {
      throw new McpError(ErrorCode.InvalidParams, 'Topic name cannot be empty');
    }

    console.error(`[API] Getting Angular topic: "${topic}"`);

    const foundTopic = this.angularDocs.find(doc => 
      doc.title.toLowerCase().includes(topic.toLowerCase()) ||
      topic.toLowerCase().includes(doc.title.toLowerCase())
    );

    if (!foundTopic) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: `Topic "${topic}" not found`,
              suggestion: 'Try searching with the search_angular_docs tool or list available categories',
              availableTopics: this.angularDocs.slice(0, 10).map(doc => doc.title),
            }, null, 2),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            title: foundTopic.title,
            category: foundTopic.category,
            url: foundTopic.url,
            content: foundTopic.content,
          }, null, 2),
        },
      ],
    };
  }

  private async listAngularCategories() {
    console.error('[API] Listing Angular categories');

    const categories = [...new Set(this.angularDocs.map(doc => doc.category))];
    const categoryStats = categories.map(category => ({
      name: category,
      topicCount: this.angularDocs.filter(doc => doc.category === category).length,
      topics: this.angularDocs
        .filter(doc => doc.category === category)
        .map(doc => doc.title)
        .slice(0, 5), // Show first 5 topics as examples
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            totalCategories: categories.length,
            totalTopics: this.angularDocs.length,
            categories: categoryStats,
          }, null, 2),
        },
      ],
    };
  }

  private async getAngularOverview() {
    console.error('[API] Getting Angular overview');

    // Extract overview content from llms-full.txt
    const overviewSections = this.llmsFullContent.split('\n').slice(0, 50).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            framework: 'Angular',
            description: 'Angular is a web framework that empowers developers to build fast, reliable applications.',
            maintainer: 'Google',
            keyFeatures: [
              'Component-based architecture',
              'TypeScript support',
              'Dependency injection',
              'Reactive programming with RxJS',
              'Powerful CLI tools',
              'Comprehensive testing utilities',
            ],
            gettingStarted: {
              prerequisites: ['Node.js v20.11.1 or newer', 'Text editor (VS Code recommended)', 'Terminal'],
              installation: 'npm install -g @angular/cli',
              createProject: 'ng new my-app',
              runProject: 'npm start',
            },
            overview: overviewSections.substring(0, 1000),
            totalDocumentationTopics: this.angularDocs.length,
            categories: [...new Set(this.angularDocs.map(doc => doc.category))],
          }, null, 2),
        },
      ],
    };
  }

  private async findAngularExamples(args: { concept: string }) {
    const { concept } = args;
    
    if (!concept.trim()) {
      throw new McpError(ErrorCode.InvalidParams, 'Concept cannot be empty');
    }

    console.error(`[API] Finding Angular examples for: "${concept}"`);

    // Search for code examples in the full documentation
    const codeBlocks: string[] = [];
    const lines = this.llmsFullContent.split('\n');
    let inCodeBlock = false;
    let currentCodeBlock = '';

    for (const line of lines) {
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          if (currentCodeBlock.toLowerCase().includes(concept.toLowerCase())) {
            codeBlocks.push(currentCodeBlock.trim());
          }
          currentCodeBlock = '';
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
      } else if (inCodeBlock) {
        currentCodeBlock += line + '\n';
      }
    }

    // Also search for related topics
    const relatedTopics = this.angularDocs.filter(doc =>
      doc.title.toLowerCase().includes(concept.toLowerCase()) ||
      doc.content.toLowerCase().includes(concept.toLowerCase())
    ).slice(0, 5);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            concept,
            codeExamples: codeBlocks.slice(0, 3), // Limit to 3 examples
            relatedTopics: relatedTopics.map(topic => ({
              title: topic.title,
              category: topic.category,
              url: topic.url,
            })),
            totalExamplesFound: codeBlocks.length,
          }, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Angular MCP server running on stdio');
  }
}

const server = new AngularMCPServer();
server.run().catch(console.error);
