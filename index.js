#!/usr/bin/env node
"use strict";
const marked = require("marked");
const getStdin = require("get-stdin");
const meow = require("meow");
const chalk = require("chalk");

const cli = meow(
  `
  Usage
    $ marked-cli [--limit=<number>]
  Options
    -v, --version     Show this help
  Examples
    $ marked-cli
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
  init(input);
} else {
  getStdin().then(init);
}

function processToken(token) {
  return token.text;
}

function init(data) {
  const markdown = marked.lexer(data)
    .reduce((acc, token) => acc + processToken(token), '');
  console.log(markdown);
}
