import fs from 'fs';

/** get list of brands from _config.yml */
const brands = fs.readFileSync('./_config.yml', 'utf8')
                 .match(/collections:\s*\n(  .*\n)+/)[0] // collections block
                 .match(/^(  [a-z]*)/mg) // collection names
                 .map(x => x.trim())
                 .filter(x => x);

// read layout from argv
if (process.argv.length < 3 || !brands.includes(process.argv[2])) {
    console.error("Usage: node generate-branding-secret.mjs <brand>");
    console.error(`Available brands: ${brands.join(', ')}`);
    process.exit(1);
}

const brand = process.argv[2];

fs.writeFileSync('branding-secret.yaml',
`apiVersion: v1
kind: Secret
metadata:
  namespace: openshift-authentication
  name: v4-0-config-system-ocp-branding-template
data:
  login.html: ${Buffer.from(fs.readFileSync(`./_site/${brand}/login.html`, 'utf8')).toString('base64')}
  providers.html: ${Buffer.from(fs.readFileSync(`./_site/${brand}/providers.html`, 'utf8')).toString('base64')}
  errors.html: ${Buffer.from(fs.readFileSync(`./_site/${brand}/errors.html`, 'utf8')).toString('base64')}
`);

console.log(`Generated branding secret for ${brand} to branding-secret.yaml`);
