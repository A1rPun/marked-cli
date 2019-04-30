#!/usr/bin/env node
"use strict";
const marked = require("marked");
const getStdin = require("get-stdin");
const meow = require("meow");
const terminal = require("./terminal");

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

function init(data) {
  const renderer = new marked.Renderer();
  Object.keys(terminal).forEach(fn => (renderer[fn] = terminal[fn]));
  const markdown = marked(data, { renderer });
  console.log(markdown);
}
