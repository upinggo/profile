/**
 * Example: Using CDS Parser as a Node.js Module
 *
 * This file demonstrates how to use the CDS Expression Parser
 * programmatically in your Node.js applications.
 *
 * Run: node tools/example-usage.js
 */

const { CDSParser } = require('./cds-parser.js');

// Create a parser instance
const parser = new CDSParser();

console.log('=== CDS Expression Parser - Usage Examples ===\n');

// Example 1: Parse a simple SELECT query
console.log('1. Simple SELECT Query:');
const query1 = 'SELECT from Books { ID, title }';
console.log('   Input:', query1);
const cqn1 = parser.parse(query1);
console.log('   Output:', JSON.stringify(cqn1, null, 2));
console.log();

// Example 2: Parse SELECT with WHERE
console.log('2. SELECT with WHERE:');
const query2 = 'SELECT from Books { ID, title } WHERE genre = \'Fiction\'';
console.log('   Input:', query2);
const cqn2 = parser.parse(query2);
console.log('   Output:', JSON.stringify(cqn2, null, 2));
console.log();

// Example 3: Parse SELECT with ORDER BY
console.log('3. SELECT with ORDER BY:');
const query3 = 'SELECT from Books { ID, title, price } ORDER BY price DESC';
console.log('   Input:', query3);
const cqn3 = parser.parse(query3);
console.log('   Output:', JSON.stringify(cqn3, null, 2));
console.log();

// Example 4: Create reference objects
console.log('4. Creating References:');
const ref1 = parser.ref('books.author.name');
console.log('   books.author.name →', JSON.stringify(ref1));

const ref2 = parser.ref(['orders', 'customer', 'address']);
console.log('   [orders, customer, address] →', JSON.stringify(ref2));
console.log();

// Example 5: Create value objects
console.log('5. Creating Values:');
const val1 = parser.val('Hello World');
console.log('   "Hello World" →', JSON.stringify(val1));

const val2 = parser.val(123);
console.log('   123 →', JSON.stringify(val2));

const val3 = parser.val(true);
console.log('   true →', JSON.stringify(val3));
console.log();

// Example 6: Create expressions
console.log('6. Creating Expressions:');
const xpr1 = parser.xpr(
  parser.ref('price'),
  '>',
  parser.val(100)
);
console.log('   price > 100 →', JSON.stringify(xpr1));

const xpr2 = parser.xpr(
  parser.ref('status'),
  '=',
  parser.val('active')
);
console.log('   status = "active" →', JSON.stringify(xpr2));
console.log();

// Example 7: Create function calls
console.log('7. Creating Function Calls:');
const func1 = parser.func('count', parser.ref('books'));
console.log('   count(books) →', JSON.stringify(func1));

const func2 = parser.func('sum', parser.ref('orders.total'));
console.log('   sum(orders.total) →', JSON.stringify(func2));

const func3 = parser.func('avg', parser.ref('products.price'));
console.log('   avg(products.price) →', JSON.stringify(func3));
console.log();

// Example 8: Complex query with aliases
console.log('8. Complex Query with Aliases:');
const query4 = 'SELECT from Authors { ID, name, books.title as bookTitle, books.genre.name as genreType }';
console.log('   Input:', query4);
const cqn4 = parser.parse(query4);
console.log('   Output:', JSON.stringify(cqn4, null, 2));
console.log();

// Example 9: Format output in different ways
console.log('9. Different Output Formats:');
const query5 = 'SELECT from Products { ID, name, price } WHERE price > 50';
const cqn5 = parser.parse(query5);

console.log('   JSON (compact):');
console.log('  ', parser.format(cqn5, 'json'));

console.log('\n   JSON (pretty):');
console.log(parser.format(cqn5, 'pretty').split('\n').map(line => '   ' + line).join('\n'));

console.log('\n   CQN (human-readable):');
console.log(parser.format(cqn5, 'cqn').split('\n').map(line => '   ' + line).join('\n'));
console.log();

// Example 10: Error handling
console.log('10. Error Handling:');
try {
  parser.parse(''); // Empty expression
} catch (error) {
  console.log('   Empty expression error:', error.message);
}

try {
  parser.parse(null); // Null expression
} catch (error) {
  console.log('   Null expression error:', error.message);
}
console.log();

// Example 11: Building complex queries programmatically
console.log('11. Building Complex Queries Programmatically:');
const complexCQN = {
  SELECT: {
    from: parser.ref('Books').ref,
    columns: [
      parser.ref('ID'),
      parser.ref('title'),
      { ...parser.ref('author.name'), as: 'authorName' },
      { ...parser.ref('genre.name'), as: 'genreType' }
    ],
    where: parser.xpr(
      parser.ref('price'),
      '>',
      parser.val(20)
    ),
    orderBy: [
      { ...parser.ref('title'), sort: 'ASC' }
    ]
  }
};
console.log('   Built CQN:', JSON.stringify(complexCQN, null, 2));
console.log();

// Example 12: Chaining multiple conditions (advanced)
console.log('12. Advanced: Building Query Step by Step:');
const step1 = { SELECT: { from: parser.ref('Orders') } };
console.log('   Step 1 - Base query:', JSON.stringify(step1));

step1.SELECT.columns = [
  parser.ref('ID'),
  parser.ref('customer.name'),
  parser.ref('total')
];
console.log('   Step 2 - Add columns:', JSON.stringify(step1));

step1.SELECT.where = parser.xpr(
  parser.ref('total'),
  '>',
  parser.val(1000)
);
console.log('   Step 3 - Add WHERE:', JSON.stringify(step1));

step1.SELECT.orderBy = [{ ...parser.ref('total'), sort: 'DESC' }];
console.log('   Step 4 - Add ORDER BY:', JSON.stringify(step1));
console.log();

console.log('=== Examples Complete ===');
console.log('\nTry running the interactive REPL:');
console.log('  node tools/cds-parser.js');
console.log('\nOr parse a single expression:');
console.log('  node tools/cds-parser.js -e "SELECT from Books { ID, title }"');
