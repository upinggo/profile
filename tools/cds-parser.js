#!/usr/bin/env node

/**
 * CDS Expression Parser Tool
 *
 * A standalone tool for parsing and evaluating CDS (Core Data Services) expressions
 * Based on SAP CAP CDS Query Language
 *
 * Usage:
 *   node cds-parser.js [options]
 *
 * Options:
 *   -e, --expression <expr>  Parse a single CDS expression
 *   -i, --interactive        Start interactive REPL mode
 *   -f, --file <path>        Parse expressions from a file
 *   -o, --output <format>    Output format: json (default), pretty, cqn
 *   -h, --help               Show help
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

class CDSParser {
  constructor() {
    this.functions = ['count', 'sum', 'avg', 'min', 'max', 'exists'];
    this.keywords = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'AS', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL'];
    // Sort operators by length (longest first) to match multi-char operators before single-char ones
    this.operators = ['<=', '>=', '!=', '<>', '||', '=', '<', '>', '+', '-', '*', '/'];
  }

  /**
   * Parse a CDS SELECT expression into CQN (CDS Query Notation)
   */
  parse(expression) {
    if (!expression || typeof expression !== 'string') {
      throw new Error('Expression must be a non-empty string');
    }

    const trimmed = expression.trim();

    // Check if it's already a CQN object
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        throw new Error('Invalid CQN JSON format');
      }
    }

    // Parse SELECT statement
    if (trimmed.toUpperCase().startsWith('SELECT')) {
      return this.parseSelect(trimmed);
    }

    // Parse as expression
    return this.parseExpression(trimmed);
  }

  /**
   * Parse SELECT statement
   */
  parseSelect(sql) {
    const result = { SELECT: {} };

    // Extract columns
    const columnsMatch = sql.match(/SELECT\s+(.*?)\s+FROM/i);
    if (columnsMatch) {
      const columns = columnsMatch[1].trim();
      if (columns !== '*') {
        result.SELECT.columns = this.parseColumns(columns);
      }
    }

    // Extract FROM clause
    const fromMatch = sql.match(/FROM\s+([^\s\{]+)/i);
    if (fromMatch) {
      const entity = fromMatch[1].trim();
      result.SELECT.from = { ref: [entity] };
    }

    // Extract nested query in braces
    const nestedMatch = sql.match(/\{\s*([^}]+)\s*\}/);
    if (nestedMatch) {
      result.SELECT.columns = this.parseColumns(nestedMatch[1]);
    }

    // Extract WHERE clause
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:ORDER BY|GROUP BY|$)/i);
    if (whereMatch) {
      result.SELECT.where = this.parseWhereClause(whereMatch[1].trim());
    }

    // Extract ORDER BY clause
    const orderMatch = sql.match(/ORDER BY\s+(.+?)(?:GROUP BY|$)/i);
    if (orderMatch) {
      result.SELECT.orderBy = this.parseOrderBy(orderMatch[1].trim());
    }

    // Extract GROUP BY clause
    const groupMatch = sql.match(/GROUP BY\s+(.+?)$/i);
    if (groupMatch) {
      result.SELECT.groupBy = this.parseGroupBy(groupMatch[1].trim());
    }

    return result;
  }

  /**
   * Parse column list
   */
  parseColumns(columnsStr) {
    const columns = [];
    const parts = this.splitByComma(columnsStr);

    for (const part of parts) {
      const trimmed = part.trim();

      // Handle column with alias
      const asMatch = trimmed.match(/(.+)\s+as\s+([^\s]+)/i);
      if (asMatch) {
        columns.push({
          ref: [asMatch[1].trim()],
          as: asMatch[2].trim()
        });
      } else {
        columns.push({ ref: [trimmed] });
      }
    }

    return columns;
  }

  /**
   * Parse WHERE clause into CQN format
   */
  parseWhereClause(whereStr) {
    // Simple expression parsing
    // Handle operators
    for (const op of this.operators) {
      if (whereStr.includes(op)) {
        const parts = whereStr.split(op).map(s => s.trim());
        if (parts.length === 2) {
          return {
            xpr: [
              { ref: [parts[0]] },
              op,
              this.parseValue(parts[1])
            ]
          };
        }
      }
    }

    // Handle EXISTS
    if (whereStr.toUpperCase().includes('EXISTS')) {
      const existsMatch = whereStr.match(/EXISTS\s+(.+)/i);
      if (existsMatch) {
        return {
          xpr: [
            'exists',
            { ref: [existsMatch[1].trim()] }
          ]
        };
      }
    }

    return { ref: [whereStr] };
  }

  /**
   * Parse ORDER BY clause
   */
  parseOrderBy(orderStr) {
    const parts = this.splitByComma(orderStr);
    return parts.map(part => {
      const trimmed = part.trim();
      const descMatch = trimmed.match(/(.+)\s+(ASC|DESC)/i);
      if (descMatch) {
        return {
          ref: [descMatch[1].trim()],
          sort: descMatch[2].toUpperCase()
        };
      }
      return { ref: [trimmed] };
    });
  }

  /**
   * Parse GROUP BY clause
   */
  parseGroupBy(groupStr) {
    const parts = this.splitByComma(groupStr);
    return parts.map(part => ({ ref: [part.trim()] }));
  }

  /**
   * Parse expression
   */
  parseExpression(expr) {
    // Check if it's a reference
    if (/^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(expr)) {
      return this.ref(expr);
    }

    // Check if it's a value
    if (/^['"].*['"]$/.test(expr) || /^\d+$/.test(expr)) {
      return this.val(expr);
    }

    // Check if it's a function call
    const funcMatch = expr.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.+)\)$/);
    if (funcMatch) {
      return this.func(funcMatch[1], this.parseExpression(funcMatch[2]));
    }

    return { xpr: [expr] };
  }

  /**
   * Create a reference object
   */
  ref(path) {
    if (typeof path === 'string') {
      return { ref: path.split('.') };
    }
    return { ref: Array.isArray(path) ? path : [path] };
  }

  /**
   * Create a value object
   */
  val(value) {
    // Remove quotes if present
    if (typeof value === 'string' && /^['"].*['"]$/.test(value)) {
      return { val: value.slice(1, -1) };
    }
    // Parse number
    if (typeof value === 'string' && /^\d+$/.test(value)) {
      return { val: parseInt(value, 10) };
    }
    return { val: value };
  }

  /**
   * Create an expression object
   */
  xpr(...args) {
    return { xpr: args };
  }

  /**
   * Create a function call expression
   */
  func(name, ...args) {
    return {
      func: name,
      args: args
    };
  }

  /**
   * Helper: Split by comma, respecting parentheses
   */
  splitByComma(str) {
    const parts = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === '(') depth++;
      if (char === ')') depth--;

      if (char === ',' && depth === 0) {
        parts.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    if (current) {
      parts.push(current);
    }

    return parts;
  }

  /**
   * Parse value with type detection
   */
  parseValue(value) {
    const trimmed = value.trim();

    // String literal
    if (/^['"].*['"]$/.test(trimmed)) {
      return { val: trimmed.slice(1, -1) };
    }

    // Number
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return { val: parseFloat(trimmed) };
    }

    // Boolean
    if (trimmed.toLowerCase() === 'true' || trimmed.toLowerCase() === 'false') {
      return { val: trimmed.toLowerCase() === 'true' };
    }

    // Null
    if (trimmed.toLowerCase() === 'null') {
      return { val: null };
    }

    // Reference
    return { ref: [trimmed] };
  }

  /**
   * Unparse CQN back to CDS query string
   */
  unparse(cqn) {
    if (!cqn) {
      throw new Error('CQN object cannot be empty');
    }

    // Handle SELECT statements
    if (cqn.SELECT) {
      return this.unparseSelect(cqn.SELECT);
    }

    // Handle reference objects
    if (cqn.ref) {
      return this.unparseRef(cqn);
    }

    // Handle value objects
    if (cqn.val !== undefined) {
      return this.unparseVal(cqn);
    }

    // Handle expression objects
    if (cqn.xpr) {
      return this.unparseXpr(cqn);
    }

    // Handle function objects
    if (cqn.func) {
      return this.unparseFunc(cqn);
    }

    throw new Error('Unknown CQN structure');
  }

  unparseSelect(select) {
    let query = 'SELECT';

    // Add columns
    if (select.columns && select.columns.length > 0) {
      query += ' from ' + this.unparseRef(select.from);
      query += ' { ' + select.columns.map(col => {
        let colStr = this.unparseRef(col);
        if (col.as) {
          colStr += ' as ' + col.as;
        }
        return colStr;
      }).join(', ') + ' }';
    } else {
      query += ' from ' + this.unparseRef(select.from);
    }

    // Add WHERE clause
    if (select.where) {
      query += ' WHERE ' + this.unparseExpression(select.where);
    }

    // Add ORDER BY clause
    if (select.orderBy && select.orderBy.length > 0) {
      query += ' ORDER BY ' + select.orderBy.map(ord => {
        let ordStr = this.unparseRef(ord);
        if (ord.sort) {
          ordStr += ' ' + ord.sort;
        }
        return ordStr;
      }).join(', ');
    }

    // Add GROUP BY clause
    if (select.groupBy && select.groupBy.length > 0) {
      query += ' GROUP BY ' + select.groupBy.map(grp => {
        return this.unparseRef(grp);
      }).join(', ');
    }

    return query;
  }

  unparseRef(ref) {
    if (ref.ref) {
      return Array.isArray(ref.ref) ? ref.ref.join('.') : ref.ref;
    }
    return '';
  }

  unparseVal(val) {
    const value = val.val;
    if (typeof value === 'string') {
      return `'${value}'`;
    }
    if (value === null) {
      return 'null';
    }
    if (typeof value === 'boolean') {
      return value.toString();
    }
    return String(value);
  }

  unparseXpr(xpr) {
    if (!xpr.xpr || !Array.isArray(xpr.xpr)) {
      return '';
    }

    return xpr.xpr.map(item => {
      if (typeof item === 'string') {
        return item;
      }
      if (item.ref) {
        return this.unparseRef(item);
      }
      if (item.val !== undefined) {
        return this.unparseVal(item);
      }
      if (item.xpr) {
        return '(' + this.unparseXpr(item) + ')';
      }
      if (item.func) {
        return this.unparseFunc(item);
      }
      return '';
    }).join(' ');
  }

  unparseFunc(func) {
    if (!func.func) {
      return '';
    }
    const args = func.args || [];
    const argsStr = args.map(arg => {
      if (arg.ref) {
        return this.unparseRef(arg);
      }
      if (arg.val !== undefined) {
        return this.unparseVal(arg);
      }
      return '';
    }).join(', ');
    return `${func.func}(${argsStr})`;
  }

  unparseExpression(expr) {
    if (expr.xpr) {
      return this.unparseXpr(expr);
    }
    if (expr.ref) {
      return this.unparseRef(expr);
    }
    if (expr.val !== undefined) {
      return this.unparseVal(expr);
    }
    return '';
  }

  /**
   * Format output based on format type
   */
  format(cqn, format = 'json') {
    switch (format) {
      case 'pretty':
        return JSON.stringify(cqn, null, 2);
      case 'cqn':
        return this.formatCQN(cqn);
      case 'json':
      default:
        return JSON.stringify(cqn);
    }
  }

  /**
   * Format as human-readable CQN
   */
  formatCQN(cqn) {
    if (cqn.SELECT) {
      let result = 'SELECT:\n';
      if (cqn.SELECT.from) {
        result += `  from: ${this.formatRef(cqn.SELECT.from)}\n`;
      }
      if (cqn.SELECT.columns) {
        result += '  columns:\n';
        cqn.SELECT.columns.forEach(col => {
          result += `    - ${this.formatRef(col)}${col.as ? ` as ${col.as}` : ''}\n`;
        });
      }
      if (cqn.SELECT.where) {
        result += `  where: ${JSON.stringify(cqn.SELECT.where)}\n`;
      }
      if (cqn.SELECT.orderBy) {
        result += '  orderBy:\n';
        cqn.SELECT.orderBy.forEach(ord => {
          result += `    - ${this.formatRef(ord)}${ord.sort ? ` ${ord.sort}` : ''}\n`;
        });
      }
      return result;
    }
    return JSON.stringify(cqn, null, 2);
  }

  formatRef(obj) {
    if (obj.ref) {
      return Array.isArray(obj.ref) ? obj.ref.join('.') : obj.ref;
    }
    return JSON.stringify(obj);
  }
}

// CLI Interface
class CDSParserCLI {
  constructor() {
    this.parser = new CDSParser();
    this.outputFormat = 'json';
  }

  run(args) {
    const options = this.parseArgs(args);

    if (options.help) {
      this.showHelp();
      return;
    }

    if (options.expression) {
      this.parseExpression(options.expression);
      return;
    }

    if (options.file) {
      this.parseFile(options.file);
      return;
    }

    // Default to interactive mode
    this.startREPL();
  }

  parseArgs(args) {
    const options = {
      help: false,
      expression: null,
      file: null,
      interactive: false,
      output: 'json'
    };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      switch (arg) {
        case '-h':
        case '--help':
          options.help = true;
          break;
        case '-e':
        case '--expression':
          options.expression = args[++i];
          break;
        case '-f':
        case '--file':
          options.file = args[++i];
          break;
        case '-i':
        case '--interactive':
          options.interactive = true;
          break;
        case '-o':
        case '--output':
          options.output = args[++i];
          this.outputFormat = options.output;
          break;
      }
    }

    return options;
  }

  showHelp() {
    console.log(`
CDS Expression Parser Tool

Usage:
  node cds-parser.js [options]

Options:
  -e, --expression <expr>  Parse a single CDS expression
  -i, --interactive        Start interactive REPL mode (default)
  -f, --file <path>        Parse expressions from a file
  -o, --output <format>    Output format: json (default), pretty, cqn
  -h, --help               Show this help message

Examples:
  # Parse a single expression
  node cds-parser.js -e "SELECT from Books { ID, title }"

  # Start interactive mode
  node cds-parser.js -i

  # Parse expressions from file with pretty output
  node cds-parser.js -f queries.txt -o pretty

Interactive Commands:
  .help      Show help
  .exit      Exit REPL
  .format    Change output format (json|pretty|cqn)
  .examples  Show example queries
`);
  }

  parseExpression(expr) {
    try {
      const result = this.parser.parse(expr);
      console.log(this.parser.format(result, this.outputFormat));
    } catch (error) {
      console.error('Parse error:', error.message);
      process.exit(1);
    }
  }

  parseFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));

      lines.forEach((line, index) => {
        console.log(`\n--- Expression ${index + 1} ---`);
        console.log('Input:', line);
        try {
          const result = this.parser.parse(line);
          console.log('Output:', this.parser.format(result, this.outputFormat));
        } catch (error) {
          console.error('Error:', error.message);
        }
      });
    } catch (error) {
      console.error('File error:', error.message);
      process.exit(1);
    }
  }

  startREPL() {
    console.log('CDS Expression Parser REPL');
    console.log('Type .help for commands, .exit to quit\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'cds> '
    });

    rl.prompt();

    rl.on('line', (line) => {
      const input = line.trim();

      if (!input) {
        rl.prompt();
        return;
      }

      // Handle commands
      if (input.startsWith('.')) {
        this.handleCommand(input, rl);
        rl.prompt();
        return;
      }

      // Parse expression
      try {
        const result = this.parser.parse(input);
        console.log(this.parser.format(result, this.outputFormat));
      } catch (error) {
        console.error('Error:', error.message);
      }

      rl.prompt();
    });

    rl.on('close', () => {
      console.log('\nGoodbye!');
      process.exit(0);
    });
  }

  handleCommand(cmd, rl) {
    const [command, ...args] = cmd.split(' ');

    switch (command) {
      case '.help':
        console.log(`
Commands:
  .help      Show this help
  .exit      Exit REPL
  .format    Change output format (json|pretty|cqn)
  .examples  Show example queries
  .ref       Create reference: .ref path.to.field
  .val       Create value: .val "string" or .val 123
  .func      Create function: .func count field
        `);
        break;

      case '.exit':
        rl.close();
        break;

      case '.format':
        if (args.length > 0) {
          const format = args[0];
          if (['json', 'pretty', 'cqn'].includes(format)) {
            this.outputFormat = format;
            console.log(`Output format set to: ${format}`);
          } else {
            console.log('Invalid format. Use: json, pretty, or cqn');
          }
        } else {
          console.log(`Current format: ${this.outputFormat}`);
        }
        break;

      case '.examples':
        console.log(`
Example Queries:

1. Simple SELECT:
   SELECT from Books { ID, title }

2. SELECT with WHERE:
   SELECT from Books { ID, title } WHERE genre = 'Fiction'

3. SELECT with ORDER BY:
   SELECT from Books { ID, title } ORDER BY title DESC

4. Reference:
   author.name

5. Value:
   "Hello World"

6. Complex query:
   SELECT from Authors { ID, name, books { title, genre.name as genre } } WHERE exists books
        `);
        break;

      case '.ref':
        if (args.length > 0) {
          const ref = this.parser.ref(args[0]);
          console.log(this.parser.format(ref, this.outputFormat));
        } else {
          console.log('Usage: .ref path.to.field');
        }
        break;

      case '.val':
        if (args.length > 0) {
          const val = this.parser.val(args.join(' '));
          console.log(this.parser.format(val, this.outputFormat));
        } else {
          console.log('Usage: .val <value>');
        }
        break;

      case '.func':
        if (args.length >= 2) {
          const func = this.parser.func(args[0], this.parser.ref(args[1]));
          console.log(this.parser.format(func, this.outputFormat));
        } else {
          console.log('Usage: .func <name> <arg>');
        }
        break;

      default:
        console.log(`Unknown command: ${command}. Type .help for available commands.`);
    }
  }
}

// Run CLI if executed directly
if (require.main === module) {
  const cli = new CDSParserCLI();
  const args = process.argv.slice(2);
  cli.run(args);
}

// Export for use as module
module.exports = { CDSParser, CDSParserCLI };
