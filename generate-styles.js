import { PurgeCSS } from 'purgecss'
import fs from 'fs';

/** Should match the files in ./_layouts minus compress and base */
const layouts = ["errors", "login", "providers", "index"];

/** 
 * Removes all font faces rules from a string containing CSS (we inline our own). 
 * @see https://stackoverflow.com/a/63979428 
 */
const removeFontFace = css => css.replace(/@font-face[^{]*{([^{}]|{[^{}]*})*}/gi,'');

for (const layout of layouts) {
    const purgeCSSResult = await new PurgeCSS().purge({
        content: [`./_site/**/${layout}.html`, `./_site/${layout}.html'`],
        css: ['./node_modules/@patternfly/patternfly/patternfly.css']
    });

    /** There is only one CSS file (PatternFly.css) so the result array is always length 1 */
    const css = removeFontFace(purgeCSSResult[0]['css']);

    await fs.writeFileSync(`./_includes/styles/${layout}.css`, css);
}
