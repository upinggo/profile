# CDS Expression Parser Tool

A standalone Node.js tool for parsing and evaluating CDS (Core Data Services) expressions based on SAP CAP CDS Query Language.

## Features

- **Parse CDS SELECT statements** into CQN (CDS Query Notation)
- **Interactive REPL mode** for experimenting with queries
- **Batch processing** from files
- **Multiple output formats**: JSON, Pretty JSON, and human-readable CQN
- **Expression utilities**: ref(), val(), xpr(), func()
- **Support for**:
  - SELECT statements with columns
  - WHERE clauses
  - ORDER BY and GROUP BY
  - Nested queries
  - References and values
  - Function calls

## Installation

No installation required! Just Node.js (version 12+).

```bash
# Make the script executable
chmod +x tools/cds-parser.js
```

## Usage

### Interactive REPL Mode (Default)

```bash
node tools/cds-parser.js
```

or

```bash
node tools/cds-parser.js -i
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

### Simple SELECT

```javascript
// Input
SELECT from Books { ID, title }

// Output (CQN)
{
  "SELECT": {
    "from": { "ref": ["Books"] },
    "columns": [
      { "ref": ["ID"] },
      { "ref": ["title"] }
    ]
  }
}
```

### SELECT with WHERE

```javascript
// Input
SELECT from Books { ID, title } WHERE genre = 'Fiction'

// Output (CQN)
{
  "SELECT": {
    "from": { "ref": ["Books"] },
    "columns": [
      { "ref": ["ID"] },
      { "ref": ["title"] }
    ],
    "where": {
      "xpr": [
        { "ref": ["genre"] },
        "=",
        { "val": "Fiction" }
      ]
    }
  }
}
```

### SELECT with ORDER BY

```javascript
// Input
SELECT from Books { ID, title } ORDER BY title DESC

// Output (CQN)
{
  "SELECT": {
    "from": { "ref": ["Books"] },
    "columns": [
      { "ref": ["ID"] },
      { "ref": ["title"] }
    ],
    "orderBy": [
      { "ref": ["title"], "sort": "DESC" }
    ]
  }
}
```

### Column with Alias

```javascript
// Input
SELECT from Authors { ID, name, books.title as bookTitle }

// Output (CQN)
{
  "SELECT": {
    "from": { "ref": ["Authors"] },
    "columns": [
      { "ref": ["ID"] },
      { "ref": ["name"] },
      { "ref": ["books.title"], "as": "bookTitle" }
    ]
  }
}
```

### Expression Utilities

```javascript
// Reference
cds> author.name
{ "ref": ["author", "name"] }

// Value
cds> "Hello World"
{ "val": "Hello World" }

cds> 123
{ "val": 123 }

// Function
cds> count(books)
{ "func": "count", "args": [{ "ref": ["books"] }] }
```

## Interactive Commands

When in REPL mode, you can use these commands:

- `.help` - Show help
- `.exit` - Exit REPL
- `.format [json|pretty|cqn]` - Change output format
- `.examples` - Show example queries
- `.ref <path>` - Create a reference object
- `.val <value>` - Create a value object
- `.func <name> <arg>` - Create a function call

## Sample Session

```bash
$ node tools/cds-parser.js
CDS Expression Parser REPL
Type .help for commands, .exit to quit

cds> SELECT from Books { ID, title }
{"SELECT":{"from":{"ref":["Books"]},"columns":[{"ref":["ID"]},{"ref":["title"]}]}}

cds> .format pretty
Output format set to: pretty

cds> SELECT from Authors { ID, name } WHERE name = 'Hemingway'
{
  "SELECT": {
    "from": {
      "ref": [
        "Authors"
      ]
    },
    "columns": [
      {
        "ref": [
          "ID"
        ]
      },
      {
        "ref": [
          "name"
        ]
      }
    ],
    "where": {
      "xpr": [
        {
          "ref": [
            "name"
          ]
        },
        "=",
        {
          "val": "Hemingway"
        }
      ]
    }
  }
}

cds> .ref books.author.name
{
  "ref": [
    "books",
    "author",
    "name"
  ]
}

cds> .exit
Goodbye!
```

## Integration with SAP CAP

This tool is inspired by the `cds repl` command from SAP CAP. While this is a standalone parser, for full CDS functionality with database connections, use the official SAP CAP tools:

```bash
# Install SAP CAP globally
npm install -g @sap/cds-dk

# Use official CDS REPL
cds repl -u ql

# Test against a running app
cds repl -u ql -r cap/samples/bookshop
```

## Limitations

This is a simplified parser for educational and prototyping purposes. It supports basic CDS query syntax but may not handle all edge cases. For production use, please use the official SAP CAP CDS tools.

**Current limitations:**
- Complex nested queries may not parse correctly
- Advanced CDS features (associations, compositions) are simplified
- JOIN operations are not fully supported
- Subqueries in WHERE clauses have limited support

## API Usage

You can also use this as a Node.js module:

```javascript
const { CDSParser } = require('./tools/cds-parser.js');

const parser = new CDSParser();

// Parse a query
const cqn = parser.parse('SELECT from Books { ID, title }');
console.log(cqn);

// Create references
const ref = parser.ref('author.name');
console.log(ref); // { ref: ['author', 'name'] }

// Create values
const val = parser.val('Hello');
console.log(val); // { val: 'Hello' }

// Create expressions
const xpr = parser.xpr({ ref: ['price'] }, '>', { val: 100 });
console.log(xpr); // { xpr: [{ ref: ['price'] }, '>', { val: 100 }] }

// Create function calls
const func = parser.func('count', parser.ref('books'));
console.log(func); // { func: 'count', args: [{ ref: ['books'] }] }
```

## Resources

- [SAP CAP CDS Documentation](https://cap.cloud.sap/docs/node.js/cds-ql)
- [CDS Query Language Reference](https://cap.cloud.sap/docs/cds/cql)
- [CQN (CDS Query Notation) Spec](https://cap.cloud.sap/docs/cds/cqn)

## License

MIT
