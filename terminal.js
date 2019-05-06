const chalk = require("chalk");

const newline = "\n";
const space = " ";
const horizontalRow = "─";
const listItem = "•";
const checkedBox = "\u2611";
const emptyBox = "\u2610";
const block = text => text + newline + newline;
const width = process.stdout.columns;

module.exports = {
  // Block elements
  blockquote: quote => {
    const prepend = `${chalk.bgYellow(space)} `;
    let currentWidth = 0;
    const fixedQuote = quote
      .match(/\S+/g)
      .reduce(
        (acc, cur) => {
          currentWidth += cur.length + space.length;
          if (currentWidth > width - 2) { // 2 = prepend length
            acc.push([cur]);
            currentWidth = cur.length + space.length;
          } else {
            acc[acc.length - 1].push(cur);
          }
          return acc;
        },
        [[]]
      )
      .map(x => x.join(space))
      .join(newline + prepend);
    return block(prepend + chalk.yellow(fixedQuote));
  },
  checkbox: checked => chalk.red(`${checked ? checkedBox : emptyBox} `),
  code: (code, infostring, escaped) => {
    let codes = code
      .split(newline)
      .map(x => chalk.inverse(x.padEnd(width)))
      .join(newline);
    return block(codes);
  },
  heading: (text, level, raw, slugger) => {
    let format = chalk.red;
    if (level < 3) format = format.bold;
    if (level < 5) format = format.underline;
    return block(format(text.toUpperCase()));
  },
  hr: () => block(chalk.magenta(horizontalRow.repeat(width))),
  html: html => html,
  list: (body, ordered, start) => body + newline,
  listitem: (text, task) => {
    const prefix = task ? "" : chalk.red(listItem);
    return ` ${prefix} ${chalk.white(text)}${newline}`;
  },
  paragraph: text => block(text),
  table: (header, body) => block(chalk.bold(header) + body),
  tablecell: (content, flags) => content + "\t│",
  tablerow: content => "│" + content + newline,
  // Inline elements
  br: () => newline,
  codespan: code => chalk.inverse(code),
  del: text => chalk.strikethrough(text),
  em: text => chalk.green.italic(text),
  image: function(...args) { return this.link(...args); },
  link: (href, title, text) => `${chalk.cyan(text)} (${chalk.blue(href)})`,
  strong: text => chalk.green.bold(text),
  text: text => text
};
