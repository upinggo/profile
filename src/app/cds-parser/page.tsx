'use client';

import { useState } from 'react';
import React from 'react';
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
    const upper = trimmed.toUpperCase();

    // Check if it's a CQN JSON object
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        throw new Error('Invalid CQN JSON format');
      }
    }

    // Parse different SQL statement types
    if (upper.startsWith('SELECT')) {
      return this.parseSelect(trimmed);
    } else if (upper.startsWith('INSERT')) {
      return this.parseInsert(trimmed);
    } else if (upper.startsWith('UPDATE')) {
      return this.parseUpdate(trimmed);
    } else if (upper.startsWith('DELETE')) {
      return this.parseDelete(trimmed);
    } else if (upper.startsWith('CREATE')) {
      return this.parseCreate(trimmed);
    } else if (upper.startsWith('DROP')) {
      return this.parseDrop(trimmed);
    } else if (upper.startsWith('ALTER')) {
      return this.parseAlter(trimmed);
    }

    // Fallback to expression parsing
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

  /**
   * Parse INSERT statement
   */
  parseInsert(sql: string): any {
    const result: any = { INSERT: {} };

    // Extract INTO entity
    const intoMatch = sql.match(/INSERT\s+INTO\s+([^\s\(]+)/i);
    if (intoMatch) {
      result.INSERT.into = { ref: [intoMatch[1].trim()] };
    }

    // Extract columns
    const columnsMatch = sql.match(/\(([^)]+)\)\s+VALUES/i);
    if (columnsMatch) {
      const columns = columnsMatch[1].split(',').map(c => c.trim());
      result.INSERT.columns = columns;
    }

    // Extract values
    const valuesMatch = sql.match(/VALUES\s*\(([^)]+)\)/i);
    if (valuesMatch) {
      const values = this.splitByComma(valuesMatch[1]);
      result.INSERT.values = values.map(v => this.parseValue(v.trim()));
    }

    return result;
  }

  /**
   * Parse UPDATE statement
   */
  parseUpdate(sql: string): any {
    const result: any = { UPDATE: {} };

    // Extract entity
    const entityMatch = sql.match(/UPDATE\s+([^\s]+)\s+SET/i);
    if (entityMatch) {
      result.UPDATE.entity = { ref: [entityMatch[1].trim()] };
    }

    // Extract SET clause
    const setMatch = sql.match(/SET\s+(.+?)(?:WHERE|$)/i);
    if (setMatch) {
      const assignments = this.splitByComma(setMatch[1]);
      result.UPDATE.set = assignments.map(assignment => {
        const [column, value] = assignment.split('=').map(s => s.trim());
        return {
          ref: [column],
          value: this.parseValue(value)
        };
      });
    }

    // Extract WHERE clause
    const whereMatch = sql.match(/WHERE\s+(.+)$/i);
    if (whereMatch) {
      result.UPDATE.where = this.parseWhereClause(whereMatch[1].trim());
    }

    return result;
  }

  /**
   * Parse DELETE statement
   */
  parseDelete(sql: string): any {
    const result: any = { DELETE: {} };

    // Extract FROM entity
    const fromMatch = sql.match(/DELETE\s+FROM\s+([^\s]+)/i);
    if (fromMatch) {
      result.DELETE.from = { ref: [fromMatch[1].trim()] };
    }

    // Extract WHERE clause
    const whereMatch = sql.match(/WHERE\s+(.+)$/i);
    if (whereMatch) {
      result.DELETE.where = this.parseWhereClause(whereMatch[1].trim());
    }

    return result;
  }

  /**
   * Parse CREATE statement
   */
  parseCreate(sql: string): any {
    const result: any = { CREATE: {} };

    // Extract object type (TABLE, INDEX, VIEW, etc.)
    const typeMatch = sql.match(/CREATE\s+(\w+)\s+([^\s\(]+)/i);
    if (typeMatch) {
      result.CREATE.type = typeMatch[1].toUpperCase();
      result.CREATE.name = typeMatch[2].trim();
    }

    // For CREATE TABLE, extract columns
    if (result.CREATE.type === 'TABLE') {
      const columnsMatch = sql.match(/\(([^)]+)\)/i);
      if (columnsMatch) {
        result.CREATE.columns = columnsMatch[1].trim();
      }
    }

    return result;
  }

  /**
   * Parse DROP statement
   */
  parseDrop(sql: string): any {
    const result: any = { DROP: {} };

    // Extract object type and name
    const match = sql.match(/DROP\s+(\w+)\s+(.+?)(?:;|$)/i);
    if (match) {
      result.DROP.type = match[1].toUpperCase();
      result.DROP.name = match[2].trim();
    }

    return result;
  }

  /**
   * Parse ALTER statement
   */
  parseAlter(sql: string): any {
    const result: any = { ALTER: {} };

    // Extract object type and name
    const match = sql.match(/ALTER\s+(\w+)\s+([^\s]+)\s+(.+)/i);
    if (match) {
      result.ALTER.type = match[1].toUpperCase();
      result.ALTER.name = match[2].trim();
      result.ALTER.action = match[3].trim();
    }

    return result;
  }

  /**
   * Parse columns
   */
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

  /**
   * Unparse CQN back to CDS query string
   */
  unparse(cqn: any): string {
    if (!cqn) {
      throw new Error('CQN object cannot be empty');
    }

    // Handle different statement types
    if (cqn.SELECT) {
      return this.unparseSelect(cqn.SELECT);
    } else if (cqn.INSERT) {
      return this.unparseInsert(cqn.INSERT);
    } else if (cqn.UPDATE) {
      return this.unparseUpdate(cqn.UPDATE);
    } else if (cqn.DELETE) {
      return this.unparseDelete(cqn.DELETE);
    } else if (cqn.CREATE) {
      return this.unparseCreate(cqn.CREATE);
    } else if (cqn.DROP) {
      return this.unparseDrop(cqn.DROP);
    } else if (cqn.ALTER) {
      return this.unparseAlter(cqn.ALTER);
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

  unparseSelect(select: any): string {
    let query = 'SELECT';

    // Add columns
    if (select.columns && select.columns.length > 0) {
      query += ' from ' + this.unparseRef(select.from);
      query += ' { ' + select.columns.map((col: any) => {
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
      query += ' ORDER BY ' + select.orderBy.map((ord: any) => {
        let ordStr = this.unparseRef(ord);
        if (ord.sort) {
          ordStr += ' ' + ord.sort;
        }
        return ordStr;
      }).join(', ');
    }

    // Add GROUP BY clause
    if (select.groupBy && select.groupBy.length > 0) {
      query += ' GROUP BY ' + select.groupBy.map((grp: any) => {
        return this.unparseRef(grp);
      }).join(', ');
    }

    return query;
  }

  unparseInsert(insert: any): string {
    let query = 'INSERT INTO ' + this.unparseRef(insert.into);

    if (insert.columns && insert.columns.length > 0) {
      query += ' (' + insert.columns.join(', ') + ')';
    }

    if (insert.values && insert.values.length > 0) {
      const values = insert.values.map((v: any) => {
        if (v.val !== undefined) {
          return this.unparseVal(v);
        }
        return v;
      }).join(', ');
      query += ' VALUES (' + values + ')';
    }

    return query;
  }

  unparseUpdate(update: any): string {
    let query = 'UPDATE ' + this.unparseRef(update.entity) + ' SET ';

    if (update.set && update.set.length > 0) {
      query += update.set.map((assignment: any) => {
        const col = this.unparseRef(assignment);
        const val = assignment.value ? this.unparseVal(assignment.value) : '';
        return col + ' = ' + val;
      }).join(', ');
    }

    if (update.where) {
      query += ' WHERE ' + this.unparseExpression(update.where);
    }

    return query;
  }

  unparseDelete(del: any): string {
    let query = 'DELETE FROM ' + this.unparseRef(del.from);

    if (del.where) {
      query += ' WHERE ' + this.unparseExpression(del.where);
    }

    return query;
  }

  unparseCreate(create: any): string {
    let query = 'CREATE ' + create.type + ' ' + create.name;

    if (create.columns) {
      query += ' (' + create.columns + ')';
    }

    return query;
  }

  unparseDrop(drop: any): string {
    return 'DROP ' + drop.type + ' ' + drop.name;
  }

  unparseAlter(alter: any): string {
    return 'ALTER ' + alter.type + ' ' + alter.name + ' ' + alter.action;
  }

  unparseRef(ref: any): string {
    if (ref.ref) {
      return Array.isArray(ref.ref) ? ref.ref.join('.') : ref.ref;
    }
    return '';
  }

  unparseVal(val: any): string {
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

  unparseXpr(xpr: any): string {
    if (!xpr.xpr || !Array.isArray(xpr.xpr)) {
      return '';
    }

    return xpr.xpr.map((item: any) => {
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

  unparseFunc(func: any): string {
    if (!func.func) {
      return '';
    }
    const args = func.args || [];
    const argsStr = args.map((arg: any) => {
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

  unparseExpression(expr: any): string {
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
   * Validate CDS syntax
   */
  validateSyntax(query: string): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!query || query.trim().length === 0) {
      errors.push('Query cannot be empty');
      return { valid: false, errors, warnings };
    }

    const trimmed = query.trim();
    const upper = trimmed.toUpperCase();

    // Check if it starts with a valid SQL keyword
    const validStartKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER'];
    const startsWithValidKeyword = validStartKeywords.some(kw => upper.startsWith(kw));

    if (!startsWithValidKeyword) {
      errors.push(`Query must start with one of: ${validStartKeywords.join(', ')}`);
    }

    // Statement-specific validation
    if (upper.startsWith('SELECT')) {
      if (!upper.includes('FROM')) {
        errors.push('SELECT statement must include FROM clause');
      }
    } else if (upper.startsWith('INSERT')) {
      if (!upper.includes('INTO')) {
        errors.push('INSERT statement must include INTO clause');
      }
      if (!upper.includes('VALUES')) {
        errors.push('INSERT statement must include VALUES clause');
      }
    } else if (upper.startsWith('UPDATE')) {
      if (!upper.includes('SET')) {
        errors.push('UPDATE statement must include SET clause');
      }
    } else if (upper.startsWith('DELETE')) {
      if (!upper.includes('FROM')) {
        errors.push('DELETE statement must include FROM clause');
      }
    } else if (upper.startsWith('CREATE')) {
      const hasType = /CREATE\s+(TABLE|INDEX|VIEW|DATABASE|SCHEMA)/i.test(trimmed);
      if (!hasType) {
        warnings.push('CREATE statement should specify object type (TABLE, INDEX, VIEW, etc.)');
      }
    } else if (upper.startsWith('DROP')) {
      const hasType = /DROP\s+(TABLE|INDEX|VIEW|DATABASE|SCHEMA)/i.test(trimmed);
      if (!hasType) {
        warnings.push('DROP statement should specify object type (TABLE, INDEX, VIEW, etc.)');
      }
    } else if (upper.startsWith('ALTER')) {
      const hasType = /ALTER\s+(TABLE|INDEX|VIEW)/i.test(trimmed);
      if (!hasType) {
        warnings.push('ALTER statement should specify object type (TABLE, INDEX, VIEW, etc.)');
      }
    }

    // Check for balanced braces
    const openBraces = (trimmed.match(/\{/g) || []).length;
    const closeBraces = (trimmed.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push(`Unbalanced braces: ${openBraces} opening, ${closeBraces} closing`);
    }

    // Check for balanced parentheses
    const openParens = (trimmed.match(/\(/g) || []).length;
    const closeParens = (trimmed.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push(`Unbalanced parentheses: ${openParens} opening, ${closeParens} closing`);
    }

    // Check for balanced quotes
    const singleQuotes = (trimmed.match(/'/g) || []).length;
    if (singleQuotes % 2 !== 0) {
      errors.push('Unbalanced single quotes');
    }

    const doubleQuotes = (trimmed.match(/"/g) || []).length;
    if (doubleQuotes % 2 !== 0) {
      warnings.push('Unbalanced double quotes (use single quotes for strings)');
    }

    // Check for valid keywords order (for SELECT)
    if (upper.startsWith('SELECT')) {
      const selectPos = upper.indexOf('SELECT');
      const fromPos = upper.indexOf('FROM');
      if (selectPos > -1 && fromPos > -1 && selectPos > fromPos) {
        errors.push('SELECT must come before FROM');
      }

      const wherePos = upper.indexOf('WHERE');
      if (wherePos > -1 && fromPos > -1 && wherePos < fromPos) {
        errors.push('WHERE must come after FROM');
      }

      const orderPos = upper.indexOf('ORDER BY');
      if (orderPos > -1 && wherePos > -1 && orderPos < wherePos) {
        warnings.push('ORDER BY typically comes after WHERE');
      }
    }

    // Check for garbage text after valid query keywords
    const keywords = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'ASC', 'DESC', 'VALUES', 'SET', 'INTO'];
    let lastKeywordPos = -1;
    let lastKeyword = '';

    keywords.forEach(kw => {
      const pos = upper.lastIndexOf(kw);
      if (pos > lastKeywordPos) {
        lastKeywordPos = pos;
        lastKeyword = kw;
      }
    });

    // Check what comes after the last keyword
    if (lastKeywordPos > -1 && (lastKeyword === 'DESC' || lastKeyword === 'ASC')) {
      const afterLastKeyword = trimmed.substring(lastKeywordPos + lastKeyword.length).trim();
      const remainder = afterLastKeyword.replace(/[\s\n\r]/g, '');
      if (remainder.length > 0) {
        errors.push(`Invalid text after ${lastKeyword}: "${remainder.substring(0, 20)}${remainder.length > 20 ? '...' : ''}"`);
      }
    }

    // Check for text after closing brace in SELECT statements
    if (upper.startsWith('SELECT') && trimmed.includes('}')) {
      const lastBracePos = trimmed.lastIndexOf('}');
      const afterBrace = trimmed.substring(lastBracePos + 1).trim();

      // Check if there's anything after the closing brace that's not a valid keyword
      if (afterBrace.length > 0) {
        const afterBraceUpper = afterBrace.toUpperCase();
        const validAfterBrace = ['WHERE', 'ORDER BY', 'GROUP BY', 'HAVING'];
        const hasValidKeyword = validAfterBrace.some(kw => afterBraceUpper.startsWith(kw));

        if (!hasValidKeyword) {
          // Check if it's just whitespace or newlines
          const nonWhitespace = afterBrace.replace(/[\s\n\r]/g, '');
          if (nonWhitespace.length > 0) {
            errors.push(`Invalid text after closing brace: "${nonWhitespace.substring(0, 20)}${nonWhitespace.length > 20 ? '...' : ''}"`);
          }
        }
      }
    }

    // Check for invalid characters
    const validCharPattern = /^[\w\s\{\}\(\)\[\],;'"=!<>+\-*/.:\n\r]*$/;
    if (!validCharPattern.test(trimmed)) {
      const invalidChars = trimmed.match(/[^\w\s\{\}\(\)\[\],;'"=!<>+\-*/.:\n\r]/g);
      if (invalidChars) {
        const uniqueChars = Array.from(new Set(invalidChars));
        errors.push(`Invalid characters found: ${uniqueChars.join(', ')}`);
      }
    }

    // Check for multiple lines with suspicious content
    const lines = trimmed.split('\n');
    if (lines.length > 1) {
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.length > 0) {
          const hasKeyword = keywords.some(kw => line.toUpperCase().includes(kw));
          const looksLikeGibberish = /^[a-z]{3,10}$/i.test(line);

          if (!hasKeyword && looksLikeGibberish) {
            warnings.push(`Suspicious text on line ${i + 1}: "${line}"`);
          }
        }
      }
    }

    // Check for common mistakes
    if (upper.includes('SELECT *') && upper.includes('{')) {
      warnings.push('Using SELECT * with column braces is redundant');
    }

    // Check for trailing semicolon
    if (trimmed.endsWith(';')) {
      warnings.push('Trailing semicolon is not needed in CDS');
    }

    // Check for common SQL keywords that might not be supported
    const unsupportedKeywords = ['JOIN', 'UNION', 'HAVING', 'LIMIT', 'OFFSET', 'DISTINCT'];
    unsupportedKeywords.forEach(keyword => {
      if (upper.includes(keyword)) {
        warnings.push(`${keyword} may have limited support`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate CQN structure
   */
  validateCQN(cqn: any): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!cqn) {
      errors.push('CQN cannot be null or undefined');
      return { valid: false, errors, warnings };
    }

    if (typeof cqn !== 'object') {
      errors.push('CQN must be an object');
      return { valid: false, errors, warnings };
    }

    // Check for SELECT statement
    if (cqn.SELECT) {
      const select = cqn.SELECT;

      // Validate from clause
      if (!select.from) {
        errors.push('SELECT must have a from clause');
      } else if (!select.from.ref) {
        errors.push('from clause must have a ref property');
      }

      // Validate columns
      if (select.columns) {
        if (!Array.isArray(select.columns)) {
          errors.push('columns must be an array');
        } else {
          select.columns.forEach((col: any, index: number) => {
            if (!col.ref) {
              errors.push(`Column ${index} must have a ref property`);
            }
            if (col.as && typeof col.as !== 'string') {
              errors.push(`Column ${index} alias must be a string`);
            }
          });
        }
      }

      // Validate WHERE clause
      if (select.where) {
        if (!select.where.xpr && !select.where.ref && select.where.val === undefined) {
          warnings.push('WHERE clause has unexpected structure');
        }
      }

      // Validate ORDER BY
      if (select.orderBy) {
        if (!Array.isArray(select.orderBy)) {
          errors.push('orderBy must be an array');
        } else {
          select.orderBy.forEach((ord: any, index: number) => {
            if (!ord.ref) {
              errors.push(`ORDER BY item ${index} must have a ref property`);
            }
            if (ord.sort && !['ASC', 'DESC'].includes(ord.sort)) {
              errors.push(`ORDER BY item ${index} sort must be ASC or DESC`);
            }
          });
        }
      }

      // Validate GROUP BY
      if (select.groupBy) {
        if (!Array.isArray(select.groupBy)) {
          errors.push('groupBy must be an array');
        }
      }
    } else {
      warnings.push('Only SELECT statements are fully supported');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
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
    name: 'INSERT Statement',
    query: "INSERT INTO Books (ID, title, price) VALUES (1, 'New Book', 29.99)"
  },
  {
    name: 'UPDATE Statement',
    query: "UPDATE Books SET price = 19.99 WHERE ID = 1"
  },
  {
    name: 'DELETE Statement',
    query: "DELETE FROM Books WHERE price < 10"
  },
  {
    name: 'CREATE TABLE',
    query: "CREATE TABLE Authors (ID INT, name VARCHAR(100))"
  }
];

const EXAMPLE_CQN = [
  {
    name: 'Simple SELECT CQN',
    cqn: `{
  "SELECT": {
    "from": { "ref": ["Books"] },
    "columns": [
      { "ref": ["ID"] },
      { "ref": ["title"] }
    ]
  }
}`
  },
  {
    name: 'INSERT CQN',
    cqn: `{
  "INSERT": {
    "into": { "ref": ["Books"] },
    "columns": ["ID", "title", "price"],
    "values": [
      { "val": 1 },
      { "val": "New Book" },
      { "val": 29.99 }
    ]
  }
}`
  },
  {
    name: 'UPDATE CQN',
    cqn: `{
  "UPDATE": {
    "entity": { "ref": ["Books"] },
    "set": [
      {
        "ref": ["price"],
        "value": { "val": 19.99 }
      }
    ],
    "where": {
      "xpr": [
        { "ref": ["ID"] },
        "=",
        { "val": 1 }
      ]
    }
  }
}`
  },
  {
    name: 'DELETE CQN',
    cqn: `{
  "DELETE": {
    "from": { "ref": ["Books"] },
    "where": {
      "xpr": [
        { "ref": ["price"] },
        "<",
        { "val": 10 }
      ]
    }
  }
}`
  },
  {
    name: 'CREATE TABLE CQN',
    cqn: `{
  "CREATE": {
    "type": "TABLE",
    "name": "Authors",
    "columns": "ID INT, name VARCHAR(100)"
  }
}`
  }
];

export default function CDSParserPage() {
  const [mode, setMode] = useState<'parse' | 'unparse'>('parse');
  const [input, setInput] = useState('SELECT from Books { ID, title }');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [format, setFormat] = useState<'json' | 'pretty'>('pretty');
  const [showCDSInfo, setShowCDSInfo] = useState(false);

  const parser = new CDSParser();

  const handleParse = () => {
    try {
      setError('');
      setWarnings([]);

      // Validate syntax first
      const validation = parser.validateSyntax(input);
      if (!validation.valid) {
        setError('Syntax errors: ' + validation.errors.join('; '));
        setWarnings(validation.warnings);
        setOutput('');
        return;
      }

      // Set warnings even if valid
      setWarnings(validation.warnings);

      // Parse the query
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

  const handleUnparse = () => {
    try {
      setError('');
      setWarnings([]);

      // Parse JSON first
      const cqn = JSON.parse(input);

      // Validate CQN structure
      const validation = parser.validateCQN(cqn);
      if (!validation.valid) {
        setError('CQN validation errors: ' + validation.errors.join('; '));
        setWarnings(validation.warnings);
        setOutput('');
        return;
      }

      // Set warnings even if valid
      setWarnings(validation.warnings);

      // Unparse the CQN
      const result = parser.unparse(cqn);
      setOutput(result);
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON: ' + err.message);
      } else {
        setError(err.message || 'Unparse error');
      }
      setOutput('');
    }
  };

  const handleProcess = () => {
    if (mode === 'parse') {
      handleParse();
    } else {
      handleUnparse();
    }
  };

  const handleExampleClick = (text: string) => {
    setInput(text);
    setError('');
    setOutput('');
  };

  const handleModeChange = (newMode: 'parse' | 'unparse') => {
    setMode(newMode);
    setError('');
    setOutput('');
    if (newMode === 'parse') {
      setInput('SELECT from Books { ID, title }');
    } else {
      setInput(EXAMPLE_CQN[0].cqn);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🔍 SQL Statement Parser & Unparser</h1>
        <p className={styles.subtitle}>
          {mode === 'parse'
            ? 'Parse SQL statements (SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER) into CQN'
            : 'Unparse CQN back to readable SQL syntax'
          }
        </p>
      </header>

      <div className={styles.content}>
        {/* Mode Switcher */}
        <section className={styles.modeSwitcher}>
          <button
            className={`${styles.modeButton} ${mode === 'parse' ? styles.modeButtonActive : ''}`}
            onClick={() => handleModeChange('parse')}
          >
            🔄 Parse (CDS → CQN)
          </button>
          <button
            className={`${styles.modeButton} ${mode === 'unparse' ? styles.modeButtonActive : ''}`}
            onClick={() => handleModeChange('unparse')}
          >
            ↩️ Unparse (CQN → CDS)
          </button>
        </section>

        {/* Examples Section */}
        <section className={styles.examplesSection}>
          <h2>📚 Examples</h2>
          <div className={styles.exampleButtons}>
            {mode === 'parse' ? (
              EXAMPLE_QUERIES.map((example, index) => (
                <button
                  key={index}
                  className={styles.exampleButton}
                  onClick={() => handleExampleClick(example.query)}
                >
                  {example.name}
                </button>
              ))
            ) : (
              EXAMPLE_CQN.map((example, index) => (
                <button
                  key={index}
                  className={styles.exampleButton}
                  onClick={() => handleExampleClick(example.cqn)}
                >
                  {example.name}
                </button>
              ))
            )}
          </div>
        </section>

        {/* Input Section */}
        <section className={styles.inputSection}>
          <div className={styles.sectionHeader}>
            <h2>{mode === 'parse' ? '📝 CDS Query' : '📋 CQN Input'}</h2>
            <div className={styles.controls}>
              <button
                onClick={() => setShowCDSInfo(!showCDSInfo)}
                className={styles.infoButton}
                title="Show info about official SAP CDS CLI"
              >
                ℹ️ Official CDS CLI
              </button>
              {mode === 'parse' && (
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as 'json' | 'pretty')}
                  className={styles.formatSelect}
                >
                  <option value="pretty">Pretty JSON</option>
                  <option value="json">Compact JSON</option>
                </select>
              )}
              <button onClick={handleClear} className={styles.clearButton}>
                Clear
              </button>
              <button onClick={handleProcess} className={styles.parseButton}>
                {mode === 'parse' ? 'Parse →' : 'Unparse →'}
              </button>
            </div>
          </div>

          {/* Official CDS CLI Info Panel */}
          {showCDSInfo && (
            <div className={styles.infoPanel}>
              <h4>🎯 Using Official SAP CDS CLI</h4>
              <p>
                This page uses a <strong>custom parser</strong> for learning and prototyping.
                For production use, install the official SAP CDS tools:
              </p>
              <div className={styles.codeBlock}>
                <code># Install globally</code><br/>
                <code>npm install -g @sap/cds-dk</code>
              </div>
              <p><strong>Official CDS REPL Usage:</strong></p>
              <div className={styles.codeBlock}>
                <code># Start interactive REPL</code><br/>
                <code>cds repl -u ql</code><br/><br/>
                <code># Parse a query</code><br/>
                <code>cds.ql`SELECT from Books &#123; ID, title &#125;`</code><br/><br/>
                <code># Test against running app</code><br/>
                <code>cds repl -u ql -r your-app</code>
              </div>
              <p><strong>Key Differences:</strong></p>
              <ul className={styles.comparisonList}>
                <li>✅ <strong>This tool:</strong> Browser-based, instant, no installation, learning-focused</li>
                <li>✅ <strong>Official CDS:</strong> Database connections, full CDS features, production-ready</li>
              </ul>
              <p>
                <a href="https://cap.cloud.sap/docs/node.js/cds-ql#using-cds-repl" target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                  📖 Read Official CDS REPL Documentation
                </a>
              </p>
            </div>
          )}

          <textarea
            className={styles.textarea}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'parse'
              ? 'Enter your CDS query here...'
              : 'Enter your CQN JSON here...'
            }
            rows={mode === 'parse' ? 6 : 12}
          />
        </section>

        {/* Output Section */}
        <section className={styles.outputSection}>
          <h2>{mode === 'parse' ? '📤 CQN Output' : '📤 CDS Query Output'}</h2>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className={styles.warning}>
              <span className={styles.warningIcon}>⚠️</span>
              <div>
                <strong>Warnings:</strong>
                <ul className={styles.warningList}>
                  {warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Errors */}
          {error ? (
            <div className={styles.error}>
              <span className={styles.errorIcon}>❌</span>
              <span>{error}</span>
            </div>
          ) : (
            <pre className={styles.output}>
              {output || `Click "${mode === 'parse' ? 'Parse' : 'Unparse'}" to see the output...`}
            </pre>
          )}
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <h2>ℹ️ Supported Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>✅ All SQL Statements</h3>
              <p>SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER</p>
            </div>
            <div className={styles.featureCard}>
              <h3>✅ Bidirectional</h3>
              <p>Parse SQL to CQN and unparse CQN back to SQL</p>
            </div>
            <div className={styles.featureCard}>
              <h3>✅ Syntax Validation</h3>
              <p>Real-time syntax checking with error and warning messages</p>
            </div>
            <div className={styles.featureCard}>
              <h3>✅ WHERE Clauses</h3>
              <p>Support for comparison operators (=, !=, &lt;, &gt;, &lt;=, &gt;=)</p>
            </div>
            <div className={styles.featureCard}>
              <h3>✅ INSERT/UPDATE/DELETE</h3>
              <p>Full DML (Data Manipulation Language) support</p>
            </div>
            <div className={styles.featureCard}>
              <h3>✅ DDL Statements</h3>
              <p>CREATE, DROP, ALTER for schema management</p>
            </div>
            <div className={styles.featureCard}>
              <h3>✅ ORDER BY & GROUP BY</h3>
              <p>Sort and aggregate results</p>
            </div>
            <div className={styles.featureCard}>
              <h3>✅ Column Aliases</h3>
              <p>Rename columns with AS keyword</p>
            </div>
            <div className={styles.featureCard}>
              <h3>✅ Functions</h3>
              <p>Support for count, sum, avg, min, max functions</p>
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
