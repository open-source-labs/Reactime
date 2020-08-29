/**
 * A tool to generate Markdown documentation from JSDoc comments in the SDK source,
 * in a format suited for publication on readme.io.
 *
 * The general pipeline is:
 *   bundled source (mixpanel.js) -> dox -> data transformation -> .md template -> compiled .md
 *
 * The rendered doc is published with https://www.npmjs.com/package/rdme and lives at
 * https://developer.mixpanel.com/docs/javascript-full-api-reference
 */

const dox = require(`dox`);
const fs = require(`fs`);
const {mapValues, template, trim} = require(`lodash`);
const path = require(`path`);


const SOURCE_FILE = path.join(__dirname, `..`, `mixpanel.js`);
const TEMPLATE_FILE = path.join(__dirname, `template.md`);
const OUTPUT_FILE = path.join(__dirname, `readme.io`, `javascript-full-api-reference.md`);

const NAMESPACES = {
  MixpanelLib: `mixpanel`,
  MixpanelPeople: `mixpanel.people`,
  MixpanelGroup: `mixpanel.group`,
};

// dox generates some HTML markup automatically out of JSDoc description blocks. We parse a few
// sections out of these blocks with the following RegExps
const DESCRIPTION_REGEXES = {
  description: /([\S\s]+?)(<h3>|$)/,
  usage: /<h3>Usage:<\/h3>([\S\s]+?)(<h3>|$)/,
  notes: /<h3>Notes:<\/h3>([\S\s]+?)(<h3>|$)/,
};
function parseDescriptionAttrs(html) {
  return mapValues(DESCRIPTION_REGEXES, regex => {
    const match = html.match(regex);
    return match && match[1]
      .trim()
      .replace(/<br \/>/g, ` `)
      .replace(/<p>([\S\s]+?)<\/p>/g, (str, match) => match.replace(/\n/g, ` `) + `\n`)
      .replace(/<pre><code>([\s\S]+?)<\/code><\/pre>/g, '\n```javascript\n$1\n```\n')
      ;
  });
}

function stripPTags(str) {
  return str.replace(/<p>([\S\s]+?)<\/?p>/g, `$1`);
}

function isDeprecated(item) {
  return item.tags.find(tag => tag.type === `deprecated`);
}

// transform the structured data dox parses out of our JSDoc and feed it through
// the lodash template at template.md
function doxToMD(items) {
  const renderMD = template(fs.readFileSync(TEMPLATE_FILE).toString());
  return renderMD({
    namespaces: Object.entries(NAMESPACES).map(([constructor, namespace]) => ({
      name: namespace,
      items: items

        // filter down to public methods of the current namespace/class
        .filter(item =>
          !item.isPrivate &&
          item.ctx &&
          !item.ctx.name.startsWith(`_`) &&
          item.ctx.constructor === constructor &&
          !isDeprecated(item)
        )

        // sort by method name within each namespace
        .sort((a, b) => a.ctx.name > b.ctx.name ? 1 : -1)

        // transform each method's data into the format we want (for instance stripping out
        // <p> tags and adding a `required` field rather than [] around param names)
        .map(item => ({
          name: `${namespace}.${item.ctx.name}`,
          arguments: item.tags
            .filter(arg => !!arg.name)
            .map(arg => ({
              name: trim(arg.name, `[]`),
              description: stripPTags(arg.description),
              required: !arg.name.startsWith(`[`),
              types: arg.typesDescription === `<code>*</code>` ? `any` : arg.types.join(` or `),
            })),
          returns: item.tags
            .filter(tag => tag.type === `returns`)
            .map(tag => ({
              description: stripPTags(tag.description),
              types: tag.types.join(` or `),
            })),
          ...parseDescriptionAttrs(item.description.full),
        })),
    })),
  });
}

const rawCode = fs.readFileSync(SOURCE_FILE).toString().trim();
const parsed = dox.parseComments(rawCode);

fs.writeFileSync(OUTPUT_FILE, doxToMD(parsed));
console.log(`Wrote docs to ${OUTPUT_FILE}`);
