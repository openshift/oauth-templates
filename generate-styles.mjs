import { PurgeCSS } from 'purgecss'
import fs from 'fs';

/** Should match the files in ./_layouts minus compress and base */
const layouts = ["errors", "login", "providers", "index"];

/**
 * Removes all font faces rules from a string containing CSS
 * (since we embed the fonts directly in a different file)
 * @see https://stackoverflow.com/a/63979428
 */
const removeFontFace = css => css.replace(/@font-face[^{]*{([^{}]|{[^{}]*})*}/gi,'');

const purgePromises = layouts.map(async (layout) => {
    return new PurgeCSS().purge({
        content: [`./_site/**/${layout}.html`, `./_site/${layout}.html'`],
        css: ['./node_modules/@patternfly/patternfly/patternfly.css'],
        keyframes: true,
        variables: true,
        safelist: ['.pf-v6-theme-dark']
    }).then(purgeCSSResult => {
        fs.writeFileSync(
            `./_includes/styles/${layout}.css`,
            /** There is only one CSS file (PatternFly.css) so the result array is always length 1 */
            removeFontFace(purgeCSSResult[0]['css'])
        );
    });
});

await Promise.all(purgePromises);
