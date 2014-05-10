/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Java for math blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Java.math');

goog.require('Blockly.Java');


Blockly.Java['math_number'] = function(block) {
  // Numeric value.
  var code = parseFloat(block.getFieldValue('NUM'));
  return [code, Blockly.Java.ORDER_ATOMIC];
};

Blockly.Java['math_arithmetic'] = function(block) {
  Blockly.Java.addImport("java.lang.Math");
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'ADD': [' + ', Blockly.Java.ORDER_ADDITION],
    'MINUS': [' - ', Blockly.Java.ORDER_SUBTRACTION],
    'MULTIPLY': [' * ', Blockly.Java.ORDER_MULTIPLICATION],
    'DIVIDE': [' / ', Blockly.Java.ORDER_DIVISION],
    'POWER': [null, Blockly.Java.ORDER_COMMA]  // Handle power separately.
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.Java.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Java.valueToCode(block, 'B', order) || '0';
  var code;
  // Power in Java requires a special case since it has no operator.
  if (!operator) {
    code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.Java.ORDER_FUNCTION_CALL];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.Java['math_single'] = function(block) {
  Blockly.Java.addImport("java.lang.Math");
  // Math operators with single operand.
  var operator = block.getFieldValue('OP');
  var code;
  var arg;
  if (operator == 'NEG') {
    // Negation is a special case given its different operator precedence.
    arg = Blockly.Java.valueToCode(block, 'NUM',
        Blockly.Java.ORDER_UNARY_NEGATION) || '0';
    if (arg[0] == '-') {
      // --3 is not legal in JS.
      arg = ' ' + arg;
    }
    code = '-' + arg;
    return [code, Blockly.Java.ORDER_UNARY_NEGATION];
  }
  if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
    arg = Blockly.Java.valueToCode(block, 'NUM',
        Blockly.Java.ORDER_DIVISION) || '0';
  } else {
    arg = Blockly.Java.valueToCode(block, 'NUM',
        Blockly.Java.ORDER_NONE) || '0';
  }
  // First, handle cases which generate values that don't need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ABS':
      code = 'Math.abs(' + arg + ')';
      break;
    case 'ROOT':
      code = 'Math.sqrt(' + arg + ')';
      break;
    case 'LN':
      code = 'Math.log(' + arg + ')';
      break;
    case 'EXP':
      code = 'Math.exp(' + arg + ')';
      break;
    case 'POW10':
      code = 'Math.pow(10,' + arg + ')';
      break;
    case 'ROUND':
      code = 'Math.round(' + arg + ')';
      break;
    case 'ROUNDUP':
      code = 'Math.ceil(' + arg + ')';
      break;
    case 'ROUNDDOWN':
      code = 'Math.floor(' + arg + ')';
      break;
    case 'SIN':
      code = 'Math.sin(' + arg + ' / 180 * Math.PI)';
      break;
    case 'COS':
      code = 'Math.cos(' + arg + ' / 180 * Math.PI)';
      break;
    case 'TAN':
      code = 'Math.tan(' + arg + ' / 180 * Math.PI)';
      break;
  }
  if (code) {
    return [code, Blockly.Java.ORDER_FUNCTION_CALL];
  }
  // Second, handle cases which generate values that may need parentheses
  // wrapping the code.
  switch (operator) {
    case 'LOG10':
      code = 'Math.log(' + arg + ') / Math.log(10)';
      break;
    case 'ASIN':
      code = 'Math.asin(' + arg + ') / Math.PI * 180';
      break;
    case 'ACOS':
      code = 'Math.acos(' + arg + ') / Math.PI * 180';
      break;
    case 'ATAN':
      code = 'Math.atan(' + arg + ') / Math.PI * 180';
      break;
    default:
      throw 'Unknown math operator: ' + operator;
  }
  return [code, Blockly.Java.ORDER_DIVISION];
};

Blockly.Java['math_constant'] = function(block) {
  Blockly.Java.addImport("java.lang.Math");
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
  var CONSTANTS = {
    'PI': ['Math.PI', Blockly.Java.ORDER_MEMBER],
    'E': ['Math.E', Blockly.Java.ORDER_MEMBER],
    'GOLDEN_RATIO': ['(1 + Math.sqrt(5)) / 2', Blockly.Java.ORDER_DIVISION],
    'SQRT2': ['Math.SQRT2', Blockly.Java.ORDER_MEMBER], //@todo Does not exist
    'SQRT1_2': ['Math.SQRT1_2', Blockly.Java.ORDER_MEMBER], //@todo Does not exist
    'INFINITY': ['Infinity', Blockly.Java.ORDER_ATOMIC]
  };
  return CONSTANTS[block.getFieldValue('CONSTANT')];
};

Blockly.Java['math_number_property'] = function(block) {
  Blockly.Java.addImport("java.lang.Math");
  // Check if a number is even, odd, prime, whole, positive, or negative
  // or if it is divisible by certain number. Returns true or false.
  var number_to_check = Blockly.Java.valueToCode(block, 'NUMBER_TO_CHECK',
      Blockly.Java.ORDER_MODULUS) || '0';
  var dropdown_property = block.getFieldValue('PROPERTY');
  var code;
  if (dropdown_property == 'PRIME') {
    // Prime is a special case as it is not a one-liner test.
    var functionName = Blockly.Java.provideFunction_(
        'math_isPrime',
        [ 'function ' + Blockly.Java.FUNCTION_NAME_PLACEHOLDER_ + '(n) {',
          '  // https://en.wikipedia.org/wiki/Primality_test#Naive_methods',
          '  if (n == 2 || n == 3) {',
          '    return true;',
          '  }',
          '  // False if n is NaN, negative, is 1, or not whole.',
          '  // And false if n is divisible by 2 or 3.',
          '  if (isNaN(n) || n <= 1 || n % 1 != 0 || n % 2 == 0 ||' +
            ' n % 3 == 0) {',
          '    return false;',
          '  }',
          '  // Check all the numbers of form 6k +/- 1, up to sqrt(n).',
          '  for (var x = 6; x <= Math.sqrt(n) + 1; x += 6) {',
          '    if (n % (x - 1) == 0 || n % (x + 1) == 0) {',
          '      return false;',
          '    }',
          '  }',
          '  return true;',
          '}']);
    code = functionName + '(' + number_to_check + ')';
    return [code, Blockly.Java.ORDER_FUNCTION_CALL];
  }
  switch (dropdown_property) {
    case 'EVEN':
      code = number_to_check + ' % 2 == 0';
      break;
    case 'ODD':
      code = number_to_check + ' % 2 == 1';
      break;
    case 'WHOLE':
      code = number_to_check + ' % 1 == 0';
      break;
    case 'POSITIVE':
      code = number_to_check + ' > 0';
      break;
    case 'NEGATIVE':
      code = number_to_check + ' < 0';
      break;
    case 'DIVISIBLE_BY':
      var divisor = Blockly.Java.valueToCode(block, 'DIVISOR',
          Blockly.Java.ORDER_MODULUS) || '0';
      code = number_to_check + ' % ' + divisor + ' == 0';
      break;
  }
  return [code, Blockly.Java.ORDER_EQUALITY];
};

// Blockly.Java['math_change'] = function(block) {
//   // Add to a variable in place.
//   var argument0 = Blockly.Java.valueToCode(block, 'DELTA',
//       Blockly.Java.ORDER_ADDITION) || '0';
//   var varName = Blockly.Java.variableDB_.getName(
//       block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
//   return varName + ' = (typeof ' + varName + ' == \'number\' ? ' + varName +
//       ' : 0) + ' + argument0 + ';\n';
// };

// Rounding functions have a single operand.
Blockly.Java['math_round'] = Blockly.Java['math_single'];
// Trigonometry functions have a single operand.
Blockly.Java['math_trig'] = Blockly.Java['math_single'];

// Blockly.Java['math_on_list'] = function(block) {
//   // Math functions for lists.
//   var func = block.getFieldValue('OP');
//   var list, code;
//   switch (func) {
//     case 'SUM':
//       list = Blockly.Java.valueToCode(block, 'LIST',
//           Blockly.Java.ORDER_MEMBER) || '[]';
//       code = list + '.reduce(function(x, y) {return x + y;})';
//       break;
//     case 'MIN':
//       list = Blockly.Java.valueToCode(block, 'LIST',
//           Blockly.Java.ORDER_COMMA) || '[]';
//       code = 'Math.min.apply(null, ' + list + ')';
//       break;
//     case 'MAX':
//       list = Blockly.Java.valueToCode(block, 'LIST',
//           Blockly.Java.ORDER_COMMA) || '[]';
//       code = 'Math.max.apply(null, ' + list + ')';
//       break;
//     case 'AVERAGE':
//       // math_median([null,null,1,3]) == 2.0.
//       var functionName = Blockly.Java.provideFunction_(
//           'math_mean',
//           [ 'function ' + Blockly.Java.FUNCTION_NAME_PLACEHOLDER_ +
//               '(myList) {',
//             '  return myList.reduce(function(x, y) {return x + y;}) / ' +
//                   'myList.length;',
//             '}']);
//       list = Blockly.Java.valueToCode(block, 'LIST',
//           Blockly.Java.ORDER_NONE) || '[]';
//       code = functionName + '(' + list + ')';
//       break;
//     case 'MEDIAN':
//       // math_median([null,null,1,3]) == 2.0.
//       var functionName = Blockly.Java.provideFunction_(
//           'math_median',
//           [ 'function ' + Blockly.Java.FUNCTION_NAME_PLACEHOLDER_ +
//               '(myList) {',
//             '  var localList = myList.filter(function (x) ' +
//               '{return typeof x == \'number\';});',
//             '  if (!localList.length) return null;',
//             '  localList.sort(function(a, b) {return b - a;});',
//             '  if (localList.length % 2 == 0) {',
//             '    return (localList[localList.length / 2 - 1] + ' +
//               'localList[localList.length / 2]) / 2;',
//             '  } else {',
//             '    return localList[(localList.length - 1) / 2];',
//             '  }',
//             '}']);
//       list = Blockly.Java.valueToCode(block, 'LIST',
//           Blockly.Java.ORDER_NONE) || '[]';
//       code = functionName + '(' + list + ')';
//       break;
//     case 'MODE':
//       // As a list of numbers can contain more than one mode,
//       // the returned result is provided as an array.
//       // Mode of [3, 'x', 'x', 1, 1, 2, '3'] -> ['x', 1].
//       var functionName = Blockly.Java.provideFunction_(
//           'math_modes',
//           [ 'function ' + Blockly.Java.FUNCTION_NAME_PLACEHOLDER_ +
//               '(values) {',
//             '  var modes = [];',
//             '  var counts = [];',
//             '  var maxCount = 0;',
//             '  for (var i = 0; i < values.length; i++) {',
//             '    var value = values[i];',
//             '    var found = false;',
//             '    var thisCount;',
//             '    for (var j = 0; j < counts.length; j++) {',
//             '      if (counts[j][0] === value) {',
//             '        thisCount = ++counts[j][1];',
//             '        found = true;',
//             '        break;',
//             '      }',
//             '    }',
//             '    if (!found) {',
//             '      counts.push([value, 1]);',
//             '      thisCount = 1;',
//             '    }',
//             '    maxCount = Math.max(thisCount, maxCount);',
//             '  }',
//             '  for (var j = 0; j < counts.length; j++) {',
//             '    if (counts[j][1] == maxCount) {',
//             '        modes.push(counts[j][0]);',
//             '    }',
//             '  }',
//             '  return modes;',
//             '}']);
//       list = Blockly.Java.valueToCode(block, 'LIST',
//           Blockly.Java.ORDER_NONE) || '[]';
//       code = functionName + '(' + list + ')';
//       break;
//     case 'STD_DEV':
//       var functionName = Blockly.Java.provideFunction_(
//           'math_standard_deviation',
//           [ 'function ' + Blockly.Java.FUNCTION_NAME_PLACEHOLDER_ +
//               '(numbers) {',
//             '  var n = numbers.length;',
//             '  if (!n) return null;',
//             '  var mean = numbers.reduce(function(x, y) {return x + y;}) / n;',
//             '  var variance = 0;',
//             '  for (var j = 0; j < n; j++) {',
//             '    variance += Math.pow(numbers[j] - mean, 2);',
//             '  }',
//             '  variance = variance / n;',
//             '  return Math.sqrt(variance);',
//             '}']);
//       list = Blockly.Java.valueToCode(block, 'LIST',
//           Blockly.Java.ORDER_NONE) || '[]';
//       code = functionName + '(' + list + ')';
//       break;
//     case 'RANDOM':
//       var functionName = Blockly.Java.provideFunction_(
//           'math_random_list',
//           [ 'function ' + Blockly.Java.FUNCTION_NAME_PLACEHOLDER_ +
//               '(list) {',
//             '  var x = Math.floor(Math.random() * list.length);',
//             '  return list[x];',
//             '}']);
//       list = Blockly.Java.valueToCode(block, 'LIST',
//           Blockly.Java.ORDER_NONE) || '[]';
//       code = functionName + '(' + list + ')';
//       break;
//     default:
//       throw 'Unknown operator: ' + func;
//   }
//   return [code, Blockly.Java.ORDER_FUNCTION_CALL];
// };

Blockly.Java['math_modulo'] = function(block) {
  // Remainder computation.
  var argument0 = Blockly.Java.valueToCode(block, 'DIVIDEND',
      Blockly.Java.ORDER_MODULUS) || '0';
  var argument1 = Blockly.Java.valueToCode(block, 'DIVISOR',
      Blockly.Java.ORDER_MODULUS) || '0';
  var code = argument0 + ' % ' + argument1;
  return [code, Blockly.Java.ORDER_MODULUS];
};

Blockly.Java['math_constrain'] = function(block) {
  Blockly.Java.addImport("java.lang.Math");
  // Constrain a number between two limits.
  var argument0 = Blockly.Java.valueToCode(block, 'VALUE',
      Blockly.Java.ORDER_COMMA) || '0';
  var argument1 = Blockly.Java.valueToCode(block, 'LOW',
      Blockly.Java.ORDER_COMMA) || '0';
  var argument2 = Blockly.Java.valueToCode(block, 'HIGH',
      Blockly.Java.ORDER_COMMA) || 'Infinity';
  var code = 'Math.min(Math.max(' + argument0 + ', ' + argument1 + '), ' +
      argument2 + ')';
  return [code, Blockly.Java.ORDER_FUNCTION_CALL];
};

// http://files.team2648.com/javadoc/index.html
// Blockly.Java['math_random_int'] = function(block) {
//   // Random integer between [X] and [Y].
//   var argument0 = Blockly.Java.valueToCode(block, 'FROM',
//       Blockly.Java.ORDER_COMMA) || '0';
//   var argument1 = Blockly.Java.valueToCode(block, 'TO',
//       Blockly.Java.ORDER_COMMA) || '0';
//   var functionName = Blockly.Java.provideFunction_(
//       'math_random_int',
//       [ 'function ' + Blockly.Java.FUNCTION_NAME_PLACEHOLDER_ +
//           '(a, b) {',
//         '  if (a > b) {',
//         '    // Swap a and b to ensure a is smaller.',
//         '    var c = a;',
//         '    a = b;',
//         '    b = c;',
//         '  }',
//         '  return Math.floor(Math.random() * (b - a + 1) + a);',
//         '}']);
//   var code = functionName + '(' + argument0 + ', ' + argument1 + ')';
//   return [code, Blockly.Java.ORDER_FUNCTION_CALL];
// };

// Blockly.Java['math_random_float'] = function(block) {
//   // Random fraction between 0 and 1.
//   return ['Math.random()', Blockly.Java.ORDER_FUNCTION_CALL];
// };
