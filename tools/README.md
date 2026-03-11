# CDS Expression Parser Tool

A standalone Node.js tool and web application for parsing and evaluating CDS (Core Data Services) expressions based on SAP CAP CDS Query Language.

## Overview

This project provides two ways to work with CDS Query Notation (CQN):

1. **Web Application** (`/cds-parser`) - Interactive browser-based parser with UI
2. **CLI Tool** (`tools/cds-parser.js`) - Command-line REPL and batch processor

## Features

### ✅ Full SQL Statement Support
- **SELECT** - with columns, WHERE, ORDER BY, GROUP BY
- **INSERT** - with columns and VALUES
- **UPDATE** - with SET and WHERE clauses
- **DELETE** - with WHERE conditions
- **CREATE** - table definitions
- **DROP** - table removal
- **ALTER** - table modifications

### ✅ Bidirectional Conversion
- **Parse**: CDS/SQL → CQN (JSON)
- **Unparse**: CQN (JSON) → CDS/SQL

### ✅ Syntax Validation
- Real-time error detection
- Warning messages for invalid syntax
- Detects:
  - Missing required clauses (FROM, SET, VALUES, INTO)
  - Unbalanced delimiters (braces, parentheses, quotes)
  - Invalid characters (?, @, #)
  - Garbage text after keywords
  - Wrong keyword order

### ✅ Web Application Features
- Interactive textarea for query input
- Parse/Unparse mode switching
- Example buttons for quick testing
- Multiple output formats (Pretty JSON, Compact JSON)
- Info panel about official CDS CLI
- Static export compatible (GitHub Pages ready)

### ✅ CLI Features
- Interactive REPL mode
- Parse single expressions
- Batch processing from files
- Multiple output formats (JSON, Pretty, CQN)
- Expression utilities (ref, val, xpr, func)

## Web Application Usage

Visit `/cds-parser` on the deployed site or run locally:

```bash
npm run dev
# Navigate to http://localhost:3000/cds-parser
```

### Parse Mode (CDS → CQN)
1. Enter CDS/SQL query in textarea
2. Click "Parse →" button
3. View CQN output in JSON format

### Unparse Mode (CQN → CDS)
1. Switch to "Unparse" mode
2. Enter CQN JSON in textarea
3. Click "Unparse →" button
4. View generated CDS/SQL query

## CLI Tool Usage

### Interactive REPL Mode (Default)

```bash
node tools/cds-parser.js
```

### Parse Single Expression

```bash
node tools/cds-parser.js -e "SELECT from Books { ID, title }"
```

### Parse from File

```bash
node tools/cds-parser.js -f queries.txt -o pretty
```

### Change Output Format

```bash
# JSON (default)
node tools/cds-parser.js -e "SELECT from Books" -o json

# Pretty JSON (indented)
node tools/cds-parser.js -e "SELECT from Books" -o pretty

# Human-readable CQN
node tools/cds-parser.js -e "SELECT from Books" -o cqn
```

## Examples

### SELECT Statement

```javascript
// Input
SELECT from Books { ID, title, price } WHERE price > 20 ORDER BY title DESC

// Output (CQN)
{
  "SELECT": {
    "from": { "ref": ["Books"] },
    "columns": [
      { "ref": ["ID"] },
      { "ref": ["title"] },
      { "ref": ["price"] }
    ],
    "where": {
      "xpr": [
        { "ref": ["price"] },
        ">",
        { "val": 20 }
      ]
    },
    "orderBy": [
      { "ref": ["title"], "sort": "DESC" }
    ]
  }
}
```

### INSERT Statement

```javascript
// Input
INSERT INTO Books (ID, title, price) VALUES (1, 'My Book', 29.99)

// Output (CQN)
{
  "INSERT": {
    "into": { "ref": ["Books"] },
    "columns": ["ID", "title", "price"],
    "values": [
      { "val": 1 },
      { "val": "My Book" },
      { "val": 29.99 }
    ]
  }
}
```

### UPDATE Statement

```javascript
// Input
UPDATE Books SET title = 'New Title', price = 19.99 WHERE ID = 1

// Output (CQN)
{
  "UPDATE": {
    "entity": { "ref": ["Books"] },
    "data": {
      "title": { "val": "New Title" },
      "price": { "val": 19.99 }
    },
    "where": {
      "xpr": [
        { "ref": ["ID"] },
        "=",
        { "val": 1 }
      ]
    }
  }
}
```

### DELETE Statement

```javascript
// Input
DELETE FROM Books WHERE ID = 1

// Output (CQN)
{
  "DELETE": {
    "from": { "ref": ["Books"] },
    "where": {
      "xpr": [
        { "ref": ["ID"] },
        "=",
        { "val": 1 }
      ]
    }
  }
}
```

### Unparse (CQN → SQL)

```javascript
// Input (CQN)
{
  "SELECT": {
    "from": { "ref": ["Books"] },
    "columns": [
      { "ref": ["ID"] },
      { "ref": ["title"], "as": "bookTitle" }
    ]
  }
}

// Output (SQL)
SELECT from Books { ID, title as bookTitle }
```

## CLI Interactive Commands

When in REPL mode:

- `.help` - Show help message
- `.exit` - Exit REPL
- `.format [json|pretty|cqn]` - Change output format
- `.examples` - Show example queries
- `.ref <path>` - Create a reference object
- `.val <value>` - Create a value object
- `.func <name> <arg>` - Create a function call

## Supported SQL Features

- ✅ SELECT with columns, WHERE, ORDER BY, GROUP BY
- ✅ INSERT with columns and VALUES
- ✅ UPDATE with SET and WHERE
- ✅ DELETE with WHERE
- ✅ CREATE, DROP, ALTER table statements
- ✅ Comparison operators: `=`, `!=`, `<`, `>`, `<=`, `>=`
- ✅ String concatenation: `||`
- ✅ Arithmetic operators: `+`, `-`, `*`, `/`
- ✅ Column aliases with AS
- ✅ Functions: count, sum, avg, min, max, exists
- ✅ Nested column selections
- ✅ Multiple WHERE conditions

## NPM Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build and deploy to GitHub Pages
npm run deploy

# CDS Parser CLI commands
npm run cds:repl          # Start interactive REPL
npm run cds:parse         # Parse single expression
npm run cds:test          # Test with sample queries
npm run cds:test-parser   # Run parser test suite
```

## API Usage

Use as a Node.js module:

```javascript
const { CDSParser } = require('./tools/cds-parser.js');

const parser = new CDSParser();

// Parse a query
const cqn = parser.parse('SELECT from Books { ID, title }');
console.log(cqn);

// Unparse CQN back to SQL
const sql = parser.unparse(cqn);
console.log(sql); // SELECT from Books { ID, title }

// Create references
const ref = parser.ref('author.name');
console.log(ref); // { ref: ['author', 'name'] }

// Create values
const val = parser.val('Hello');
console.log(val); // { val: 'Hello' }

// Create expressions
const xpr = parser.xpr({ ref: ['price'] }, '>', { val: 100 });
console.log(xpr); // { xpr: [{ ref: ['price'] }, '>', { val: 100 }] }

// Format output
const formatted = parser.format(cqn, 'pretty');
console.log(formatted);
```

## Project Structure

```
profile/
├── src/
│   ├── app/
│   │   └── cds-parser/
│   │       ├── page.tsx                    # Web UI component
│   │       └── cds-parser.module.css       # Styles
│   └── components/                          # React components
├── tools/
│   ├── cds-parser.js                       # CLI tool & parser engine
│   └── README.md                           # This file
├── package.json
└── next.config.mjs
```

## Deployment

The web application is configured for static export and can be deployed to:

- **GitHub Pages** (current deployment)
- Netlify
- Vercel Static
- Any static hosting service

Build command:
```bash
npm run build
```

Output directory: `out/`

## Integration with Official SAP CAP

This tool is inspired by the `cds repl` command from SAP CAP. While this is a custom implementation for learning and prototyping, for full CDS functionality with database connections and complete feature set, use the official SAP CAP tools:

```bash
# Install SAP CAP globally
npm install -g @sap/cds-dk

# Use official CDS REPL
cds repl

# Check version
cds version
```

## Technical Details

### Architecture

**Parser Engine**:
- Pure JavaScript/TypeScript implementation
- No external SAP dependencies
- Browser and Node.js compatible
- Regex-based parsing with CQN structure generation

**Parser Components**:
```
CDSParser
├── parse()           # SQL → CQN
├── unparse()         # CQN → SQL
├── validateSyntax()  # Syntax checking
├── parseSelect()     # SELECT statements
├── parseInsert()     # INSERT statements
├── parseUpdate()     # UPDATE statements
├── parseDelete()     # DELETE statements
├── parseCreate()     # CREATE statements
├── parseDrop()       # DROP statements
└── parseAlter()      # ALTER statements
```

### Supported Operators

- **Comparison**: `=`, `!=`, `<`, `>`, `<=`, `>=`, `<>`
- **String**: `||` (concatenation)
- **Arithmetic**: `+`, `-`, `*`, `/`
- **Logical**: AND, OR, NOT
- **Special**: EXISTS, IN, LIKE, BETWEEN

### Supported Functions

count, sum, avg, min, max, exists

## Differences from Official CDS

This is a **custom educational implementation**, not the official SAP CDS CLI:

### What This Tool Provides:
- ✅ Browser-based parsing (no installation needed)
- ✅ Learning CQN structure and syntax
- ✅ Quick prototyping and testing
- ✅ Static export compatible
- ✅ Bidirectional conversion (parse/unparse)
- ✅ Syntax validation

### What Official CDS Provides:
- ✅ Full CDS feature set
- ✅ Database connections
- ✅ Service deployments
- ✅ Model compilation
- ✅ File system operations
- ✅ Complete SAP CAP ecosystem integration

### Key Differences:

| Feature | This Tool | Official @sap/cds-dk |
|---------|-----------|---------------------|
| Browser Support | ✅ Yes | ❌ No (Node.js only) |
| Installation | ✅ Not required | ❌ ~200MB+ package |
| Database Connectivity | ❌ No | ✅ Yes |
| Service Runtime | ❌ No | ✅ Yes |
| File-based Models | ❌ No | ✅ Yes |
| Learning Tool | ✅ Perfect | ⚠️ Overkill |
| Production Use | ❌ Not recommended | ✅ Production-ready |

## Limitations

This is a simplified parser for educational and prototyping purposes. It supports basic CDS query syntax but may not handle all edge cases.

**Current limitations:**
- Complex nested queries may not parse correctly
- Advanced CDS features (associations, compositions) are simplified
- JOIN operations are not fully supported
- Subqueries in WHERE clauses have limited support
- No database connectivity
- No service runtime
- No file-based model definitions

For production use, please use the official SAP CAP CDS tools.

## Deployment

### Live Sites
- **GitHub Pages**: [https://upinggo.github.io/profile/cds-parser](https://upinggo.github.io/profile/cds-parser)
- **Vercel**: [https://vercel.com/upinggo/profile](https://vercel.com/upinggo/profile)

### Build Configuration
- Static export enabled (`output: 'export'`)
- Base path: `/profile` (for GitHub Pages)
- Asset prefix configured for GitHub Pages URLs
- Bundle size: ~7 kB (optimized)

### Build Commands
```bash
npm run build   # Build for production
npm run deploy  # Build and deploy to GitHub Pages
```

## Project Structure

```
profile/
├── src/
│   ├── app/
│   │   └── cds-parser/
│   │       ├── page.tsx                    # Web UI component
│   │       └── cds-parser.module.css       # Styles
│   └── components/                          # React components
├── tools/
│   ├── cds-parser.js                       # CLI tool & parser engine
│   └── README.md                           # This file
├── package.json
└── next.config.mjs
```

## Version History

**Current: 1.2.0**

Features in v1.2.0:
- CDS Parser web interface
- CLI tool with REPL mode
- Bidirectional parse/unparse
- Syntax validation with errors/warnings
- Support for all major SQL statements (SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER)
- Example queries and comprehensive documentation

See [CHANGELOG.md](../CHANGELOG.md) for full version history.

## Resources

- [SAP CAP CDS Documentation](https://cap.cloud.sap/docs/node.js/cds-ql)
- [CDS Query Language Reference](https://cap.cloud.sap/docs/cds/cql)
- [CQN (CDS Query Notation) Spec](https://cap.cloud.sap/docs/cds/cqn)
- [SAP CAP Official REPL Guide](https://cap.cloud.sap/docs/node.js/cds-ql#using-cds-repl)

## License

MIT

## Version

Current version: 1.2.0

See [CHANGELOG.md](../CHANGELOG.md) for version history.
