const util = require("util");
const exec = util.promisify(require("child_process").exec);
const path = require("path");
const { promises: fs } = require("fs");
const { createHash } = require("crypto");
const test = require("ava");
const createProject = require("./_create-project-rev");
let dir;
let cssContent = "body{color:red}";
let revHash = createHash("md5").update(cssContent).digest("hex").slice(0, 8);

test.before(async t => {
  dir = createProject("rev-with-permalink-function-that-returns-async-render-function");
  await exec("npx @11ty/eleventy --config=config-with-permalink-function-that-returns-async-render-function.js", { cwd: dir });
});

test("create css file with rev hash", async t => {
  await t.notThrowsAsync(async () => await fs.access(path.join(dir, `_site/css/style-${ revHash }.css`)));
});

test("rev filter", async t => {
  let content = await fs.readFile(path.join(dir, "_site/css-style-css--rev/index.html"), { encoding: "utf8" });
  t.is(content, `<p>/css/style-${ revHash }.css</p>\n`);
});

test("inputToRevvedOutput filter", async t => {
  let content = await fs.readFile(path.join(dir, "_site/stylesheets-style-scss--input-to-revved-output/index.html"), { encoding: "utf8" });
  t.is(content, `<p>/css/style-${ revHash }.css</p>\n`);
});
