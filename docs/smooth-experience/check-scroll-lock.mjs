// Isolated ownership checks, not a browser/Safari scroll-lock acceptance test.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../../app/components/scrollLock.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const context = { exports: {}, document: { body: { style: { overflow: 'auto' } } } };
vm.runInNewContext(outputText, context);
const lock = context.exports.lockPageScroll;
const style = context.document.body.style;
const drawer = lock();
assert.equal(style.overflow, 'hidden');
const calendar = lock();
drawer();
assert.equal(style.overflow, 'hidden');
drawer(); // Cleanup is idempotent.
assert.equal(style.overflow, 'hidden');
calendar();
assert.equal(style.overflow, 'auto');
const first = lock();
const second = lock();
second();
assert.equal(style.overflow, 'hidden');
first();
assert.equal(style.overflow, 'auto');
style.overflow = '';
lock()();
assert.equal(style.overflow, '');
console.log('PASS: 7 assertions; both release orders, idempotent cleanup, original value restored.');
