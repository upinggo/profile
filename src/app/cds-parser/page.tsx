'use client';

import { useState } from 'react';
import styles from './cds-parser.module.css';

// Import the CDS Parser logic (browser-compatible version)
class CDSParser {
  functions: string[];
  keywords: string[];
  operators: string[];

  constructor() {
    this.functions = ['count', 'sum', 'avg', 'min', 'max', 'exists'];
    this.keywords = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'AS', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL'];
    this.operators = ['<=', '>=', '!=', '<>', '||', '=', '<', '>', '+', '-', '*', '/'];
  }

  parse(expression: string): any {
    if (!expression || typeof expression !== 'string') {
      throw new Error('Expression must be a non-empty string');
    }

    const trimmed = expression.trim();

    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        throw new Error('Invalid CQN JSON format');
      }
    }

    if (trimmed.toUpperCase().startsWith('SELECT')) {
      return this.parseSelect(trimmed);
    }

    return this.parseExpression(trimmed);
  }

  parseSelect(sql: string): any {
    const result: any = { SELECT: {} };

    const columnsMatch = sql.match(/SELECT\s+(.*?)\s+FROM/i);
    if (columnsMatch) {
      const columns = columnsMatch[1].trim();
      if (columns !== '*') {
        result.SELECT.columns = this.parseColumns(columns);
      }
    }

    const fromMatch = sql.match(/FROM\s+([^\s\{]+)/i);
    if (fromMatch) {
      const entity = fromMatch[1].trim();
      result.SELECT.from = { ref: [entity] };
    }

    const nestedMatch = sql.match(/\{\s*([^}]+)\s*\}/);
    if (nestedMatch) {
      result.SELECT.columns = this.parseColumns(nestedMatch[1]);
    }

    const whereMatch = sql.match(/WHERE\s+(.+?)(?:ORDER BY|GROUP BY|$)/i);
    if (whereMatch) {
      result.SELECT.where = this.parseWhereClause(whereMatch[1].trim());
    }

    const orderMatch = sql.match(/ORDER BY\s+(.+?)(?:GROUP BY|$)/i);
    if (orderMatch) {
      result.SELECT.orderBy = this.parseOrderBy(orderMatch[1].trim());
    }

    const groupMatch = sql.match(/GROUP BY\s+(.+?)$/i);
    if (groupMatch) {
      result.SELECT.groupBy = this.parseGroupBy(groupMatch[1].trim());
    }

    return result;
  }

  parseColumns(columnsStr: string): any[] {
    const columns: any[] = [];
    const parts = this.splitByComma(columnsStr);

    for (const part of parts) {
      const trimmed = part.trim();
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

  parseWhereClause(whereStr: string): any {
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

  parseOrderBy(orderStr: string): any[] {
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

  parseGroupBy(groupStr: string): any[] {
    const parts = this.splitByComma(groupStr);
    return parts.map(part => ({ ref: [part.trim()] }));
  }

  parseExpression(expr: string): any {
    if (/^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(expr)) {
      return this.ref(expr);
    }

    if (/^['"].*['"]$/.test(expr) || /^\d+$/.test(expr)) {
      return this.val(expr);
    }

    const funcMatch = expr.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\((.+)\)$/);
    if (funcMatch) {
      return this.func(funcMatch[1], this.parseExpression(funcMatch[2]));
    }

    return { xpr: [expr] };
  }

  ref(path: string | string[]): any {
    if (typeof path === 'string') {
      return { ref: path.split('.') };
    }
    return { ref: Array.isArray(path) ? path : [path] };
  }

  val(value: any): any {
    if (typeof value === 'string' && /^['"].*['"]$/.test(value)) {
      return { val: value.slice(1, -1) };
    }
    if (typeof value === 'string' && /^\d+$/.test(value)) {
      return { val: parseInt(value, 10) };
    }
    return { val: value };
  }

  func(name: string, ...args: any[]): any {
    return {
      func: name,
      args: args
    };
  }

  splitByComma(str: string): string[] {
    const parts: string[] = [];
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

  parseValue(value: string): any {
    const trimmed = value.trim();

    if (/^['"].*['"]$/.test(trimmed)) {
      return { val: trimmed.slice(1, -1) };
    }

    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return { val: parseFloat(trimmed) };
    }

    if (trimmed.toLowerCase() === 'true' || trimmed.toLowerCase() === 'false') {
      return { val: trimmed.toLowerCase() === 'true' };
    }

    if (trimmed.toLowerCase() === 'null') {
      return { val: null };
    }

    return { ref: [trimmed] };
  }
}

const EXAMPLE_QUERIES = [
  {
    name: 'Simple SELECT',
    query: 'SELECT from Books { ID, title }'
  },
  {
    name: 'SELECT with WHERE',
    query: "SELECT from Books { ID, title } WHERE genre = 'Fiction'"
  },
  {
    name: 'SELECT with ORDER BY',
    query: 'SELECT from Books { ID, title, price } ORDER BY price DESC'
  },
  {
    name: 'SELECT with Alias',
    query: 'SELECT from Authors { ID, name, books.title as bookTitle }'
  },
  {
    name: 'Complex Query',
    query: "SELECT from Books { ID, title, price } WHERE price > 20 ORDER BY price DESC"
  }
];

export default function CDSParserPage() {
  const [input, setInput] = useState('SELECT from Books { ID, title }');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [format, setFormat] = useState<'json' | 'pretty'>('pretty');

  const parser = new CDSParser();

  const handleParse = () => {
    try {
      setError('');
      const result = parser.parse(input);
      const formatted = format === 'pretty'
        ? JSON.stringify(result, null, 2)
        : JSON.stringify(result);
      setOutput(formatted);
    } catch (err: any) {
      setError(err.message || 'Parse error');
      setOutput('');
    }
  };

  const handleExampleClick = (query: string) => {
    setInput(query);
    setError('');
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🔍 CDS Expression Parser</h1>
        <p className={styles.subtitle}>
          Parse CDS (Core Data Services) SELECT statements into CQN (CDS Query Notation)
        </p>
      </header>

      <div className={styles.content}>
        {/* Examples Section */}
        <section className={styles.examplesSection}>
          <h2>📚 Examples</h2>
          <div className={styles.exampleButtons}>
            {EXAMPLE_QUERIES.map((example, index) => (
              <button
                key={index}
                className={styles.exampleButton}
                onClick={() => handleExampleClick(example.query)}
              >
                {example.name}
              </button>
            ))}
          </div>
        </section>

        {/* Input Section */}
        <section className={styles.inputSection}>
          <div className={styles.sectionHeader}>
            <h2>📝 CDS Query</h2>
            <div className={styles.controls}>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'json' | 'pretty')}
                className={styles.formatSelect}
              >
                <option value="pretty">Pretty JSON</option>
                <option value="json">Compact JSON</option>
              </select>
              <button onClick={handleClear} className={styles.clearButton}>
                Clear
              </button>
              <button onClick={handleParse} className={styles.parseButton}>
                Parse →
              </button>
            </div>
          </div>
          <textarea
            className={styles.textarea}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your CDS query here..."
            rows={6}
          />
        </section>

        {/* Output Section */}
        <section className={styles.outputSection}>
          <h2>📤 CQN Output</h2>
          {error ? (
            <div className={styles.error}>
              <span className={styles.errorIcon}>⚠️</span>
              <span>{error}</span>
            </div>
          ) : (
            <pre className={styles.output}>
              {output || 'Click "Parse" to see the CQN output...'}
            </pre>
          )}
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <h2>ℹ️ Supported Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>✅ SELECT Statements</h3>
              <p>Parse SELECT queries with column selection</p>
            </div>
            <div className={styles.featureCard}>
              <h3>✅ WHERE Clauses</h3>
              <p>Support for comparison operators (=, !=, &lt;, &gt;, &lt;=, &gt;=)</p>
            </div>
            <div className={styles.featureCard}>
              <h3>✅ ORDER BY</h3>
              <p>Sort results with ASC/DESC</p>
            </div>
            <div className={styles.featureCard}>
              <h3>✅ Column Aliases</h3>
              <p>Rename columns with AS keyword</p>
            </div>
            <div className={styles.featureCard}>
              <h3>✅ Nested Fields</h3>
              <p>Access nested properties (e.g., books.author.name)</p>
            </div>
            <div className={styles.featureCard}>
              <h3>✅ GROUP BY</h3>
              <p>Group results by columns</p>
            </div>
          </div>
        </section>

        {/* Documentation Link */}
        <section className={styles.docsSection}>
          <h2>📖 Documentation</h2>
          <p>
            This tool is based on SAP CAP CDS Query Language. For more information:
          </p>
          <ul className={styles.docsList}>
            <li>
              <a href="https://cap.cloud.sap/docs/node.js/cds-ql" target="_blank" rel="noopener noreferrer">
                SAP CAP CDS Documentation
              </a>
            </li>
            <li>
              <a href="https://cap.cloud.sap/docs/cds/cql" target="_blank" rel="noopener noreferrer">
                CDS Query Language Reference
              </a>
            </li>
            <li>
              <a href="https://cap.cloud.sap/docs/cds/cqn" target="_blank" rel="noopener noreferrer">
                CQN Specification
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
