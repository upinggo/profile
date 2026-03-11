/**
 * Test Suite for CDS Expression Parser
 *
 * Run: node tools/test-parser.js
 */

const { CDSParser } = require('./cds-parser.js');

class TestRunner {
  constructor() {
    this.parser = new CDSParser();
    this.passed = 0;
    this.failed = 0;
    this.tests = [];
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  assertEqual(actual, expected, message) {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);

    if (actualStr === expectedStr) {
      return true;
    } else {
      throw new Error(`${message}\nExpected: ${expectedStr}\nActual: ${actualStr}`);
    }
  }

  assertThrows(fn, message) {
    try {
      fn();
      throw new Error(`${message} - Expected error but none was thrown`);
    } catch (error) {
      if (error.message.includes('Expected error')) {
        throw error;
      }
      return true;
    }
  }

  async run() {
    console.log('🧪 Running CDS Parser Tests\n');
    console.log('='.repeat(60));

    for (const test of this.tests) {
      try {
        await test.fn();
        this.passed++;
        console.log(`✅ ${test.name}`);
      } catch (error) {
        this.failed++;
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${error.message}\n`);
      }
    }

    console.log('='.repeat(60));
    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);

    if (this.failed === 0) {
      console.log('✨ All tests passed!\n');
      return 0;
    } else {
      console.log(`⚠️  ${this.failed} test(s) failed\n`);
      return 1;
    }
  }
}

// Create test runner
const runner = new TestRunner();

// Test 1: Simple SELECT
runner.test('Simple SELECT query', () => {
  const result = runner.parser.parse('SELECT from Books { ID, title }');
  runner.assertEqual(
    result,
    {
      SELECT: {
        from: { ref: ['Books'] },
        columns: [
          { ref: ['ID'] },
          { ref: ['title'] }
        ]
      }
    },
    'Simple SELECT should parse correctly'
  );
});

// Test 2: SELECT with WHERE
runner.test('SELECT with WHERE clause', () => {
  const result = runner.parser.parse("SELECT from Books { ID, title } WHERE genre = 'Fiction'");
  runner.assertEqual(
    result.SELECT.where,
    {
      xpr: [
        { ref: ['genre'] },
        '=',
        { val: 'Fiction' }
      ]
    },
    'WHERE clause should parse correctly'
  );
});

// Test 3: SELECT with ORDER BY
runner.test('SELECT with ORDER BY', () => {
  const result = runner.parser.parse('SELECT from Books { ID, title } ORDER BY title');
  runner.assertEqual(
    result.SELECT.orderBy,
    [{ ref: ['title'] }],
    'ORDER BY should parse correctly'
  );
});

// Test 4: SELECT with ORDER BY DESC
runner.test('SELECT with ORDER BY DESC', () => {
  const result = runner.parser.parse('SELECT from Books { ID, title } ORDER BY title DESC');
  runner.assertEqual(
    result.SELECT.orderBy,
    [{ ref: ['title'], sort: 'DESC' }],
    'ORDER BY DESC should parse correctly'
  );
});

// Test 5: Column with alias
runner.test('Column with alias', () => {
  const result = runner.parser.parse('SELECT from Books { ID, title as bookTitle }');
  runner.assertEqual(
    result.SELECT.columns[1],
    { ref: ['title'], as: 'bookTitle' },
    'Column alias should parse correctly'
  );
});

// Test 6: Multiple columns
runner.test('Multiple columns', () => {
  const result = runner.parser.parse('SELECT from Authors { ID, name, country, birthYear }');
  runner.assertEqual(
    result.SELECT.columns.length,
    4,
    'Should parse all four columns'
  );
});

// Test 7: WHERE with numeric comparison
runner.test('WHERE with numeric comparison', () => {
  const result = runner.parser.parse('SELECT from Books { ID, price } WHERE price > 20');
  runner.assertEqual(
    result.SELECT.where,
    {
      xpr: [
        { ref: ['price'] },
        '>',
        { val: 20 }
      ]
    },
    'Numeric comparison should parse correctly'
  );
});

// Test 8: Nested field reference
runner.test('Nested field reference', () => {
  const result = runner.parser.parse('SELECT from Books { ID, author.name }');
  runner.assertEqual(
    result.SELECT.columns[1],
    { ref: ['author.name'] },
    'Nested field should parse correctly'
  );
});

// Test 9: ref() utility
runner.test('ref() creates reference object', () => {
  const result = runner.parser.ref('books.author.name');
  runner.assertEqual(
    result,
    { ref: ['books', 'author', 'name'] },
    'ref() should create reference object'
  );
});

// Test 10: val() utility with string
runner.test('val() with string', () => {
  const result = runner.parser.val('"Hello World"');
  runner.assertEqual(
    result,
    { val: 'Hello World' },
    'val() should handle string values'
  );
});

// Test 11: val() utility with number
runner.test('val() with number', () => {
  const result = runner.parser.val('123');
  runner.assertEqual(
    result,
    { val: 123 },
    'val() should handle numeric values'
  );
});

// Test 12: xpr() utility
runner.test('xpr() creates expression', () => {
  const result = runner.parser.xpr(
    { ref: ['price'] },
    '>',
    { val: 100 }
  );
  runner.assertEqual(
    result,
    { xpr: [{ ref: ['price'] }, '>', { val: 100 }] },
    'xpr() should create expression'
  );
});

// Test 13: func() utility
runner.test('func() creates function call', () => {
  const result = runner.parser.func('count', { ref: ['books'] });
  runner.assertEqual(
    result,
    { func: 'count', args: [{ ref: ['books'] }] },
    'func() should create function call'
  );
});

// Test 14: Multiple ORDER BY columns
runner.test('Multiple ORDER BY columns', () => {
  const result = runner.parser.parse('SELECT from Books { ID, title } ORDER BY author, title');
  runner.assertEqual(
    result.SELECT.orderBy.length,
    2,
    'Should parse multiple ORDER BY columns'
  );
});

// Test 15: Complex query with all features
runner.test('Complex query with WHERE, ORDER BY, and aliases', () => {
  const result = runner.parser.parse(
    'SELECT from Books { ID, title as bookTitle, price } WHERE price > 15 ORDER BY price DESC'
  );

  runner.assertEqual(result.SELECT.from, { ref: ['Books'] }, 'FROM clause');
  runner.assertEqual(result.SELECT.columns.length, 3, 'Column count');
  runner.assertEqual(result.SELECT.columns[1].as, 'bookTitle', 'Alias');
  runner.assertEqual(result.SELECT.where !== undefined, true, 'WHERE exists');
  runner.assertEqual(result.SELECT.orderBy !== undefined, true, 'ORDER BY exists');
});

// Test 16: Error handling - empty expression
runner.test('Error handling: empty expression', () => {
  runner.assertThrows(
    () => runner.parser.parse(''),
    'Should throw error for empty expression'
  );
});

// Test 17: Error handling - null expression
runner.test('Error handling: null expression', () => {
  runner.assertThrows(
    () => runner.parser.parse(null),
    'Should throw error for null expression'
  );
});

// Test 18: Format output as JSON
runner.test('Format output as JSON', () => {
  const cqn = { SELECT: { from: { ref: ['Books'] } } };
  const result = runner.parser.format(cqn, 'json');
  runner.assertEqual(
    typeof result,
    'string',
    'Should return string'
  );
  runner.assertEqual(
    JSON.parse(result),
    cqn,
    'Should be valid JSON'
  );
});

// Test 19: Format output as pretty JSON
runner.test('Format output as pretty JSON', () => {
  const cqn = { SELECT: { from: { ref: ['Books'] } } };
  const result = runner.parser.format(cqn, 'pretty');
  runner.assertEqual(
    result.includes('\n'),
    true,
    'Pretty format should include newlines'
  );
});

// Test 20: Parse CQN object
runner.test('Parse CQN JSON object', () => {
  const cqnString = '{"SELECT":{"from":{"ref":["Books"]}}}';
  const result = runner.parser.parse(cqnString);
  runner.assertEqual(
    result,
    { SELECT: { from: { ref: ['Books'] } } },
    'Should parse CQN JSON string'
  );
});

// Test 21: WHERE with different operators
runner.test('WHERE with < operator', () => {
  const result = runner.parser.parse('SELECT from Books { ID } WHERE price < 10');
  runner.assertEqual(
    result.SELECT.where.xpr[1],
    '<',
    'Should parse < operator'
  );
});

// Test 22: WHERE with >= operator
runner.test('WHERE with >= operator', () => {
  const result = runner.parser.parse('SELECT from Books { ID } WHERE price >= 25');
  runner.assertEqual(
    result.SELECT.where.xpr[1],
    '>=',
    'Should parse >= operator'
  );
});

// Test 23: Reference with array input
runner.test('ref() with array input', () => {
  const result = runner.parser.ref(['books', 'author', 'name']);
  runner.assertEqual(
    result,
    { ref: ['books', 'author', 'name'] },
    'ref() should handle array input'
  );
});

// Test 24: Value parsing - boolean true
runner.test('Parse boolean true', () => {
  const result = runner.parser.parseValue('true');
  runner.assertEqual(
    result,
    { val: true },
    'Should parse boolean true'
  );
});

// Test 25: Value parsing - boolean false
runner.test('Parse boolean false', () => {
  const result = runner.parser.parseValue('false');
  runner.assertEqual(
    result,
    { val: false },
    'Should parse boolean false'
  );
});

// Test 26: Value parsing - null
runner.test('Parse null value', () => {
  const result = runner.parser.parseValue('null');
  runner.assertEqual(
    result,
    { val: null },
    'Should parse null value'
  );
});

// Test 27: splitByComma utility
runner.test('splitByComma respects parentheses', () => {
  const result = runner.parser.splitByComma('a, b, func(c, d), e');
  runner.assertEqual(
    result.length,
    4,
    'Should split correctly respecting parentheses'
  );
});

// Test 28: Complex nested path
runner.test('Complex nested field path', () => {
  const result = runner.parser.parse('SELECT from Orders { customer.address.street }');
  runner.assertEqual(
    result.SELECT.columns[0],
    { ref: ['customer.address.street'] },
    'Should handle complex nested paths'
  );
});

// Test 29: Multiple aliases
runner.test('Multiple column aliases', () => {
  const result = runner.parser.parse(
    'SELECT from Books { ID, title as bookTitle, author.name as authorName }'
  );
  runner.assertEqual(
    result.SELECT.columns[1].as,
    'bookTitle',
    'First alias'
  );
  runner.assertEqual(
    result.SELECT.columns[2].as,
    'authorName',
    'Second alias'
  );
});

// Test 30: FROM with simple entity
runner.test('Simple FROM entity', () => {
  const result = runner.parser.parse('SELECT from Users');
  runner.assertEqual(
    result.SELECT.from,
    { ref: ['Users'] },
    'Should parse simple entity name'
  );
});

// Run all tests
runner.run().then(exitCode => {
  process.exit(exitCode);
});
