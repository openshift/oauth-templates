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

/**
 * Since GH pages + Jekyll does not support PurgeCSS, we pre-generate the CSS files.
 * This script should be run after the site is built. After running this script,
 * make sure to build the site again to include the generated CSS files.
 */
const cssForLayouts = layouts.map(async (layout) => {
    return new PurgeCSS().purge({
        content: [`./_site/**/${layout}.html`, `./_site/${layout}.html'`],
        css: ['./node_modules/@patternfly/patternfly/{patternfly,patternfly-addons}.css'],
        keyframes: true,
        variables: true
    }).then(purgeResult => {
        // Concatenate all the purged CSS files into one
        const css = purgeResult.reduce((acc, result) => `${acc} ${result['css']}`, '');

        fs.writeFileSync(
            `./_includes/styles/${layout}.css`,
            removeFontFace(css)
        );
    });
});

await Promise.all(cssForLayouts);
