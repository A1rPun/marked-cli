#!/usr/bin/env node
"use strict";
const marked = require("marked");
const getStdin = require("get-stdin");
const meow = require("meow");
const fs = require('fs');
const path = require('path');
const terminal = require("./terminal");

const cli = meow(
  `
  Usage
    $ marked-cli [filename]
  Options
    -v, --version     Show this help
  Examples
    $ marked-cli README.md
    Hello world
`,
  {
    alias: {
      v: "version"
    }
  }
);

const input = cli.input[0];
if (input) {
  const fileName = path.join(process.cwd(), input);
  init(fs.readFileSync(fileName, { encoding: 'utf8' }));
} else {
  getStdin().then(init);
}

function decodeMarked(txt) {
  return txt
    .replace(/&#39;/, "'")
    .replace(/&quot;/, '"')
    .replace(/&amp;/, "&")
    .replace(/&gt;/, ">")
    .replace(/&lt;/, "<");
}

function curry(fn) {
  return function(...args) {
    return decodeMarked(fn.apply(this, args));
  };
}

function init(data) {
  const renderer = new marked.Renderer();
  Object.keys(terminal).forEach(fn => (renderer[fn] = curry(terminal[fn])));
  const markdown = marked(data, { renderer });
  console.log(markdown);
}
