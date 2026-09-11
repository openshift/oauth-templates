import { defineConfig } from '11ty.ts';
import { minify } from 'html-minifier-next';
import { PurgeCSS } from 'purgecss';
import posthtml from 'posthtml';

const brands = {
    ocp: { label: 'ocp', name: 'Red Hat OpenShift Container Platform' },
    rho: { label: 'rho', name: 'Red Hat OpenShift' },
    od: { label: 'od', name: 'Red Hat OpenShift Dedicated' },
    rosa: { label: 'rosa', name: 'Red Hat OpenShift Service on AWS' },
    okd: { label: 'okd', name: 'OKD' },
};

export default defineConfig(config => {
    config.setIncludesDirectory('_includes');
    config.setLayoutsDirectory('_layouts');
    config.setOutputDirectory('_site');

    // Removes all font faces rules from a string containing CSS
    // (since we embed the fonts directly in a different file)
    // https://stackoverflow.com/a/63979428
    config.addFilter("removeFontFace", css => css.replace(/@font-face[^{]*{([^{}]|{[^{}]*})*}/gi, ''));

    // Minify HTML
    config.addTransform("htmlmin", function (content) {
        if (this.page.outputFileExtension !== "html") return content;

        return minify(content, {
            collapseAttributeWhitespace: true,
            collapseBooleanAttributes: true,
            collapseInlineTagWhitespace: true,
            collapseWhitespace: true,
            mergeScripts: true,
            minifyCSS: true,
            minifyJS: true,
            minifySVG: true,
            removeComments: true,
            removeDefaultTypeAttributes: true,
            removeUnusedCSS: true,
        })
    });

    // html-minifier-next does not strip CSS variables, use purgeCSS to further optimize the <style id="c"> tag
    config.addTransform("purgecss", async function (content) {
        if (this.page.outputFileExtension !== "html") return content;

        const { html } = await posthtml([async tree => {
            let styleNode = null;
            tree.match({ tag: 'style', attrs: { id: 'c' } }, node => {
                styleNode = node;
                return node;
            });

            if (!styleNode) return;

            const css = styleNode.content.join('');
            const [result] = await new PurgeCSS().purge({
                content: [{ raw: content, extension: 'html' }],
                css: [{ raw: css }],
                keyframes: true,
                variables: true,
                safelist: {
                    variables: [
                        '--pf-t--global--background--color--secondary--default',
                        '--pf-t--color--gray--10',
                        '--pf-t--global--background--color--200',
                        '--pf-t--global--dark--background--color--100'
                    ]
                },
            });

            styleNode.content = [result.css];
        }]).process(content);

        return html;
    });

    // Register each brand as a named collection
    for (const key of Object.keys(brands)) {
        config.addCollection(key, col => col.getFilteredByGlob(`_${key}/*.html`));
    }

    // Expose brands as an ordered array for iteration in index.html
    config.addGlobalData('brands', Object.values(brands));

    // Compute `collection` per page from its directory (e.g. _ocp/ -> brands.ocp)
    config.addGlobalData('eleventyComputed', {
        collection: data => {
            const match = data.page?.inputPath?.match(/\/_([^/]+)\//);
            return match ? (brands[match[1]] ?? null) : null;
        }
    });

    // Markdown only used for repo documentation
    config.ignores.add('*.md')
});
