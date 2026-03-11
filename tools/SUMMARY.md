# CDS Expression Parser Tool - Summary

## What Was Created

A complete standalone CDS (Core Data Services) expression parser tool inspired by SAP CAP's `cds repl` command. This tool can parse CDS SELECT statements and expressions into CQN (CDS Query Notation) format.

## Files Created

1. **`tools/cds-parser.js`** (Main Tool)
   - Complete CDS parser implementation
   - Interactive REPL mode
   - CLI interface with multiple options
   - Can be used as a Node.js module
   - ~800 lines of well-documented code

2. **`tools/README.md`** (Comprehensive Documentation)
   - Full feature list and capabilities
   - Installation and usage instructions
   - API documentation
   - Multiple examples
   - Integration with SAP CAP
   - Known limitations

3. **`tools/QUICKSTART.md`** (Quick Reference)
   - Fast start guide
   - Common use cases
   - Interactive commands reference
   - Troubleshooting tips
   - Quick examples

4. **`tools/sample-queries.txt`** (Test Queries)
   - 18 sample CDS queries
   - Cover various features
   - Can be used for batch testing
   - Documented with comments

5. **`tools/example-usage.js`** (Code Examples)
   - 12 detailed examples
   - Shows programmatic usage
   - Demonstrates all API methods
   - Can be run directly

## Key Features

### 1. Interactive REPL Mode
```bash
node tools/cds-parser.js
```
- Interactive query testing
- Built-in help commands
- Multiple output formats
- Expression utilities

### 2. Single Query Parsing
```bash
node tools/cds-parser.js -e "SELECT from Books { ID, title }"
```

### 3. Batch File Processing
```bash
node tools/cds-parser.js -f queries.txt -o pretty
```

### 4. Multiple Output Formats
- `json` - Compact JSON
- `pretty` - Indented JSON
- `cqn` - Human-readable CQN format

### 5. NPM Scripts (Added to package.json)
```bash
npm run cds:repl    # Start interactive REPL
npm run cds:parse   # Parse single expression
npm run cds:test    # Test with sample queries
```

## Supported CDS Features

✅ **Implemented:**
- SELECT statements
- FROM clause with entity names
- Column selection and wildcards
- Column aliases (AS)
- WHERE clauses with operators (=, !=, <, >, <=, >=)
- ORDER BY with ASC/DESC
- GROUP BY clauses
- Nested field references (e.g., `books.author.name`)
- Expression utilities:
  - `ref()` - Create references
  - `val()` - Create values
  - `xpr()` - Create expressions
  - `func()` - Create function calls

⚠️ **Limited Support:**
- Complex nested queries
- JOIN operations
- Subqueries in WHERE
- Advanced CDS associations
- EXISTS operator (basic support)

## Usage Examples

### Example 1: Simple Query
```bash
$ node tools/cds-parser.js -e "SELECT from Books { ID, title }" -o pretty
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

### Example 2: With WHERE and ORDER BY
```bash
$ node tools/cds-parser.js -e "SELECT from Books { ID, title, price } WHERE price > 20 ORDER BY price DESC" -o pretty
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
      { "ref": ["price"], "sort": "DESC" }
    ]
  }
}
```

### Example 3: Programmatic Usage
```javascript
const { CDSParser } = require('./tools/cds-parser.js');

const parser = new CDSParser();
const cqn = parser.parse('SELECT from Books { ID, title }');
console.log(JSON.stringify(cqn, null, 2));
```

## Quick Start

1. **Interactive Mode:**
   ```bash
   node tools/cds-parser.js
   ```

2. **Parse Query:**
   ```bash
   node tools/cds-parser.js -e "SELECT from Books { ID, title }"
   ```

3. **Test Samples:**
   ```bash
   npm run cds:test
   ```

## Documentation

- **Full Documentation:** `tools/README.md`
- **Quick Start:** `tools/QUICKSTART.md`
- **Examples:** `tools/example-usage.js`
- **Sample Queries:** `tools/sample-queries.txt`

## Integration Options

### As CLI Tool
```bash
./tools/cds-parser.js -e "your query here"
```

### As NPM Script
```bash
npm run cds:parse "your query here"
```

### As Node.js Module
```javascript
const { CDSParser } = require('./tools/cds-parser.js');
const parser = new CDSParser();
const result = parser.parse('SELECT from Books');
```

## Testing

All features have been tested and verified:
- ✅ Simple SELECT queries
- ✅ WHERE clauses with operators
- ✅ ORDER BY with ASC/DESC
- ✅ Column aliases
- ✅ Nested field references
- ✅ Multiple output formats
- ✅ Batch file processing
- ✅ Interactive REPL
- ✅ Error handling
- ✅ Programmatic API

## Performance

- Fast parsing for simple queries
- Efficient for batch processing
- Lightweight (no external dependencies)
- Single file, easy to distribute

## Comparison with Official CDS REPL

| Feature | This Tool | Official `cds repl` |
|---------|-----------|---------------------|
| Syntax Parsing | ✅ Yes | ✅ Yes |
| CQN Output | ✅ Yes | ✅ Yes |
| No Dependencies | ✅ Yes | ❌ Requires @sap/cds |
| Database Connection | ❌ No | ✅ Yes |
| Query Execution | ❌ No | ✅ Yes |
| Offline Use | ✅ Yes | ⚠️ Limited |
| Learning Tool | ✅ Ideal | ✅ Yes |

## Use Cases

1. **Learning CDS Syntax**
   - Experiment with queries
   - Understand CQN format
   - Test expressions

2. **Prototyping**
   - Design queries before implementation
   - Validate syntax
   - Generate CQN for applications

3. **Development**
   - Offline development
   - Quick syntax checking
   - Integration testing

4. **Documentation**
   - Generate CQN examples
   - Create query documentation
   - Training materials

## Next Steps

To use the tool:
1. Read `tools/QUICKSTART.md` for quick start
2. Try the interactive REPL: `npm run cds:repl`
3. Run the examples: `node tools/example-usage.js`
4. Test with samples: `npm run cds:test`
5. Read full docs: `tools/README.md`

## Resources

- **SAP CAP Documentation:** https://cap.cloud.sap/docs/node.js/cds-ql
- **CDS Query Language:** https://cap.cloud.sap/docs/cds/cql
- **CQN Specification:** https://cap.cloud.sap/docs/cds/cqn

## Notes

- This is a learning/prototyping tool, not a replacement for SAP CAP
- For production use with databases, use the official SAP CAP framework
- The parser handles common CDS patterns but may not support all edge cases
- Contributions and improvements are welcome!

---

**Created:** 2026-03-11
**Version:** 1.0.0
**License:** MIT
