# OpenShift Console OAuth Templates - Agent context

This document outlines the core development conventions for the OpenShift OAuth Templates codebase. For comprehensive project structure, deployment workflows, and additional context, see [./README.md](./README.md).

## Project Overview

This repository contains the upstream source for the login, errors, and provider selection HTML templates used by OpenShift's OAuth server. Templates are styled with PatternFly and customized for different OpenShift brands (OKD, RHO, OCP, OD, ROSA).

## Development Commands

- **Setup**: `bundle install && yarn install`
- **Build**: `yarn build-jekyll`
- **Dev server**: `yarn serve-jekyll`
- **Generate styles**: `yarn generate-styles` (run after using new PatternFly classes)
- **Generate branding secret**: `yarn generate-branding-secret`, used to update https://github.com/openshift/cluster-authentication-operator

## Directory Structure

- `_layouts/` - Jekyll layout templates (base, errors, login, providers)
- `_includes/` - Reusable HTML partials (logos, favicons, styles)
- `_okd/`, `_rho/`, `_ocp/`, `_od/`, `_rosa/` - Brand-specific template collections
- `_includes/styles/` - Generated CSS (auto-generated, commit to git)
- `_site/` - Generated static site (do NOT commit)
- `generate-styles.mjs` - PurgeCSS script for CSS optimization

## Code Conventions

### HTML Templates

- Use Jekyll's Liquid templating syntax: `{% include %}` for partials, `{{ variable }}` for data
- Keep brand-specific content in collection directories (`_okd/`, `_rho/`, `_ocp/`, `_od/`, `_rosa/`)
- Share common structure in `_layouts/` and `_includes/`
- Follow PatternFly design system patterns
- Ensure accessibility: semantic HTML, ARIA labels, keyboard navigation (WCAG 2.1 AA compliant)

### CSS

- Use PatternFly utility classes whenever possible
- Avoid custom CSS; prefer PatternFly components
- CSS is auto-generated via PurgeCSS - do NOT manually edit files in `_includes/styles/`
- After adding new PatternFly classes to HTML, run `yarn generate-styles`

## Common Patterns

### Brand Management

- Each brand has its own collection directory with three templates: `errors.html`, `login.html`, `providers.html`
- Brand-specific logos: `_includes/logo-{brand}.html`
- Brand-specific favicons: `_includes/favicon-{brand}.html`
- Configure new brands in `_config.yml` collections
- **Special case**: ROSA and OD hide the `kubeadmin` provider in `providers.html`

### Jekyll Workflow

- Layouts in `_layouts/` define page structure
- Brand collections inherit from layouts via front matter
- Shared components referenced via `{% include path.html %}`
- Site config accessed via `{{ site.variable }}`, page data via `{{ page.variable }}`

### CSS Generation

- PurgeCSS removes unused CSS from PatternFly automatically
- Safelist defined in `generate-styles.mjs` for dynamic classes
- Font faces removed (embedded separately)
- Always commit generated CSS to git

## Deployment

See [README.md](./README.md) for detailed deployment instructions for each OpenShift variant (OKD, RHO, OD, ROSA).

## Branch Naming

- Feature work: `CONSOLE-####` (Jira ticket number)
- Bug fixes: `OCPBUGS-####` (Jira bug number)