# CDS Expression Parser Tool

> A standalone tool for parsing CDS (Core Data Services) expressions, inspired by SAP CAP's `cds repl` command.

## 📦 Files in This Directory

### Core Tool
- **`cds-parser.js`** - Main parser implementation (can be used as CLI or module)

### Documentation
- **`README.md`** - Complete documentation with examples and API reference
- **`QUICKSTART.md`** - Quick start guide for getting up and running fast
- **`SUMMARY.md`** - Project summary and feature overview
- **`INDEX.md`** - This file - directory guide

### Examples & Tests
- **`example-usage.js`** - Comprehensive examples showing programmatic usage
- **`sample-queries.txt`** - Sample CDS queries for testing
- **`test-parser.js`** - Test suite (30 tests)

## 🚀 Quick Start

### 1. Interactive REPL
```bash
npm run cds:repl
```

### 2. Parse Single Expression
```bash
npm run cds:parse "SELECT from Books { ID, title }"
```

### 3. Run Tests
```bash
npm run cds:test-parser
```

### 4. Test with Samples
```bash
npm run cds:test
```

## 📖 Documentation Guide

**Just getting started?**
→ Read `QUICKSTART.md` first

**Want full details?**
→ Read `README.md` for comprehensive documentation

**Need a quick overview?**
→ Read `SUMMARY.md`

**Want to see code examples?**
→ Run `node tools/example-usage.js`

**Want to understand what queries are supported?**
→ Check `sample-queries.txt`

## 🔧 NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run cds:repl` | Start interactive REPL |
| `npm run cds:parse "query"` | Parse single query |
| `npm run cds:test` | Test with sample queries |
| `npm run cds:test-parser` | Run test suite |

## ✨ Features

- ✅ Parse CDS SELECT statements
- ✅ Support WHERE, ORDER BY, GROUP BY clauses
- ✅ Column aliases (AS)
- ✅ Nested field references
- ✅ Interactive REPL mode
- ✅ Multiple output formats (JSON, Pretty, CQN)
- ✅ Utility functions (ref, val, xpr, func)
- ✅ Batch file processing
- ✅ Can be used as Node.js module
- ✅ Zero dependencies
- ✅ 30 passing tests

## 📚 Learn More

- [SAP CAP Documentation](https://cap.cloud.sap/docs/node.js/cds-ql)
- [CDS Query Language](https://cap.cloud.sap/docs/cds/cql)
- [CQN Specification](https://cap.cloud.sap/docs/cds/cqn)

## 🎯 Use Cases

1. **Learning** - Understand CDS syntax and CQN format
2. **Prototyping** - Design queries before implementation
3. **Testing** - Validate query structure
4. **Development** - Offline CDS query development
5. **Documentation** - Generate CQN examples

## 🔍 Quick Reference

### Interactive Commands
- `.help` - Show help
- `.exit` - Exit REPL
- `.format [type]` - Set output format
- `.examples` - Show examples
- `.ref <path>` - Create reference
- `.val <value>` - Create value
- `.func <name> <arg>` - Create function

### CLI Options
- `-e, --expression` - Parse expression
- `-i, --interactive` - Interactive mode
- `-f, --file` - Parse from file
- `-o, --output` - Set format (json/pretty/cqn)
- `-h, --help` - Show help

### Example Queries
```sql
-- Simple
SELECT from Books { ID, title }

-- With WHERE
SELECT from Books { ID, title } WHERE price > 20

-- With ORDER BY
SELECT from Books { ID, title } ORDER BY title DESC

-- With alias
SELECT from Books { ID, title as bookTitle }

-- Complex
SELECT from Authors {
  ID,
  name,
  books.title as bookTitle
} WHERE name = 'Hemingway' ORDER BY name
```

## 🤝 Support

For issues or questions:
1. Check the documentation in `README.md`
2. Look at examples in `example-usage.js`
3. Try the interactive REPL: `npm run cds:repl`
4. Run the tests: `npm run cds:test-parser`

---

**Created:** 2026-03-11
**Version:** 1.0.0
**License:** MIT
