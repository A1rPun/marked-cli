const chalk = require("chalk");

const newline = "\n";
const block = text => text + newline + newline;
const width = process.stdout.columns - 4;

module.exports = {
  // Block elements
  blockquote: quote => {
    const prepend = chalk.bgWhite(" ") + " ";
    let currentWidth = 0;
    const block = quote.match(/\S+/g).reduce((acc, cur) => {
      currentWidth += cur.length;
      if (currentWidth > width) {
        acc.push([cur]);
	currentWidth = 0;
      } else {
	acc[acc.length - 1].push(cur);
      }
      currentWidth += cur.length;
      return acc;
    }, [[]]).map(x => x.join(" "))
      .join(newline + prepend);
    return prepend + chalk.yellow(block);
  },
  checkbox: checked => (checked ? "\u2611 " : "\u2610 "),
  code: (code, infostring, escaped) => {
    let codes = code.split("\n");
    let max = Math.max(...codes.map(x => x.length));
    codes = codes.map(x => x.padEnd(max)).join("\n");
    return block(chalk.inverse(codes));
  },
  heading: (text, level, raw, slugger) => block(chalk.red.bold.underline(`${"#".repeat(level)} ${text}`)),
  hr: () => block(" ─── "),
  html: html => html,
  list: (body, ordered, start) => body + newline,
  listitem: (text, task) => ` ${task ? "" : "•"} ${chalk.white(text)}${newline}`,
  paragraph: text => block(text),
  table: (header, body) => block(chalk.bold(header) + body),
  tablecell: (content, flags) => content + "\t│",
  tablerow: content => "│" + content + newline,
  // Inline elements
  br: () => newline,
  codespan: code => chalk.inverse(code),
  del: text => chalk.strikethrough(text),
  em: text => chalk.italic(text),
  image: function (...args) { return this.link(...args) },
  link: (href, title, text) => `${chalk.blue(text)} (${chalk.magenta(href)})`,
  strong: text => chalk.bold(text),
  text: text => text
};
