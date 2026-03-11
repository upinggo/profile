# CDS Expression Parser - Quick Start Guide

## 🚀 Quick Start

### 1. Interactive Mode (Recommended for Learning)

```bash
node tools/cds-parser.js
```

Try these commands:
```
cds> SELECT from Books { ID, title }
cds> .format pretty
cds> SELECT from Authors { ID, name } WHERE name = 'Hemingway'
cds> .examples
cds> .ref books.author.name
cds> .exit
```

### 2. Parse Single Query

```bash
node tools/cds-parser.js -e "SELECT from Books { ID, title }"
```

### 3. Test with Sample Queries

```bash
node tools/cds-parser.js -f tools/sample-queries.txt -o pretty
```

## 📝 Common Use Cases

### Parse and Format a Query

```bash
# JSON (compact)
node tools/cds-parser.js -e "SELECT from Books { ID, title }" -o json

# JSON (pretty)
node tools/cds-parser.js -e "SELECT from Books { ID, title }" -o pretty

# Human-readable CQN
node tools/cds-parser.js -e "SELECT from Books { ID, title }" -o cqn
```

### Test WHERE Clauses

```bash
node tools/cds-parser.js -e "SELECT from Books { ID, title } WHERE genre = 'Fiction'" -o pretty
```

### Test ORDER BY

```bash
node tools/cds-parser.js -e "SELECT from Books { ID, title } ORDER BY title DESC" -o pretty
```

### Test Column Aliases

```bash
node tools/cds-parser.js -e "SELECT from Books { ID, title as bookTitle }" -o pretty
```

## 🔧 Using as a Module

Create a file `test-parser.js`:

```javascript
const { CDSParser } = require('./tools/cds-parser.js');

const parser = new CDSParser();

// Parse a query
const query = 'SELECT from Books { ID, title } WHERE price > 20';
const cqn = parser.parse(query);

console.log('Parsed CQN:');
console.log(JSON.stringify(cqn, null, 2));

// Use utility functions
console.log('\nReference:', parser.ref('author.name'));
console.log('Value:', parser.val('Hello World'));
console.log('Function:', parser.func('count', parser.ref('books')));
```

Run it:
```bash
node test-parser.js
```

## 🎯 Example Queries

### Basic SELECT
```sql
SELECT from Books { ID, title }
```

### With WHERE
```sql
SELECT from Books { ID, title } WHERE genre = 'Fiction'
```

### With ORDER BY
```sql
SELECT from Books { ID, title, price } ORDER BY price DESC
```

### With Aliases
```sql
SELECT from Authors { ID, name, books.title as bookTitle }
```

### Complex Query
```sql
SELECT from Books { ID, title, price } WHERE price > 20 ORDER BY price DESC
```

## 🛠️ Utility Functions

### Create Reference
```javascript
parser.ref('books.author.name')
// Output: { ref: ['books', 'author', 'name'] }
```

### Create Value
```javascript
parser.val('Hello')    // String
parser.val(123)        // Number
parser.val(true)       // Boolean
// Output: { val: 'Hello' }, { val: 123 }, { val: true }
```

### Create Expression
```javascript
parser.xpr({ ref: ['price'] }, '>', { val: 100 })
// Output: { xpr: [{ ref: ['price'] }, '>', { val: 100 }] }
```

### Create Function Call
```javascript
parser.func('count', parser.ref('books'))
// Output: { func: 'count', args: [{ ref: ['books'] }] }
```

## 📚 Interactive REPL Commands

| Command | Description | Example |
|---------|-------------|---------|
| `.help` | Show help | `.help` |
| `.exit` | Exit REPL | `.exit` |
| `.format` | Change output format | `.format pretty` |
| `.examples` | Show examples | `.examples` |
| `.ref` | Create reference | `.ref books.title` |
| `.val` | Create value | `.val "Hello"` |
| `.func` | Create function | `.func count books` |

## 🔍 Troubleshooting

### Parse Error
If you get a parse error, try:
1. Check your syntax matches CDS QL format
2. Use quotes for string values: `'Fiction'` not `Fiction`
3. Check column names are comma-separated
4. Verify parentheses and braces are balanced

### File Not Found
Make sure you're running from the project root:
```bash
cd /path/to/profile
node tools/cds-parser.js
```

## 🌟 Tips

1. **Start Simple**: Begin with basic SELECT queries
2. **Use Pretty Format**: `-o pretty` for readable output
3. **Test Incrementally**: Add WHERE, ORDER BY one at a time
4. **Use REPL**: Interactive mode is great for experimenting
5. **Check Examples**: Use `.examples` in REPL for reference

## 📖 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [sample-queries.txt](sample-queries.txt) for more examples
- Explore the [SAP CAP CDS documentation](https://cap.cloud.sap/docs/node.js/cds-ql)
- Try the official `cds repl` if you have SAP CAP installed

## 🤝 Integration with SAP CAP

This tool complements but doesn't replace the official SAP CAP tools:

```bash
# Install SAP CAP (requires additional setup)
npm install -g @sap/cds-dk

# Use official CDS REPL with database
cds repl -u ql -r cap/samples/bookshop
```

The CDS parser tool is useful for:
- Learning CDS syntax
- Quick prototyping
- Testing query structure
- Understanding CQN format
- Offline development

For production applications, use the official SAP CAP framework.
