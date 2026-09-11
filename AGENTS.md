# OpenShift Console OAuth Templates - Agent context

This document outlines the core development conventions for the OpenShift OAuth Templates codebase. For comprehensive project structure, deployment workflows, and additional context, see [./README.md](./README.md).

## Project Overview

This repository contains the upstream source for the login, errors, and provider selection HTML templates used by OpenShift's OAuth server. Templates are styled with PatternFly and customized for different OpenShift brands (OKD, RHO, OCP, OD, ROSA).

## Development Commands

- **Setup**: `yarn install`
- **Build**: `yarn build`
- **Dev server**: `yarn serve`

## Directory Structure

- `_layouts/` - Liquid layout templates (base, errors, login, providers)
- `_includes/` - Reusable HTML partials (logos, favicons, styles)
- `_okd/`, `_rho/`, `_ocp/`, `_od/`, `_rosa/` - Brand-specific template collections
- `_site/` - Generated static site (do NOT commit)

## Code Conventions

### HTML Templates

- Use Liquid templating syntax: `{% include %}` for partials, `{{ variable }}` for data
- Keep brand-specific content in collection directories (`_okd/`, `_rho/`, `_ocp/`, `_od/`, `_rosa/`)
- Share common structure in `_layouts/` and `_includes/`
- Follow PatternFly design system patterns
- Ensure accessibility: semantic HTML, ARIA labels, keyboard navigation (WCAG 2.1 AA compliant)

### CSS

- Use PatternFly utility classes whenever possible
- Avoid custom CSS; prefer PatternFly components

## Common Patterns

### Brand Management

- Each brand has its own collection directory with three templates: `errors.html`, `login.html`, `providers.html`
- Brand-specific logos: `_includes/logo-{brand}.html`
- Brand-specific favicons: `_includes/favicon-{brand}.html`
- Configure new brands in `_config.yml` collections
- **Special case**: ROSA and OD hide the `kubeadmin` provider in `providers.html`

### Eleventy Workflow

Refer to https://www.11ty.dev/docs/ for more information

- Layouts in `_layouts/` define page structure
- Brand collections inherit from layouts via front matter
- Shared components referenced via `{% include 'path.html' %}`

## Deployment

See [README.md](./README.md) for detailed deployment instructions for each OpenShift variant (OKD, RHO, OD, ROSA).

## Branch Naming

- Feature work: `CONSOLE-####` (Jira ticket number)
- Bug fixes: `OCPBUGS-####` (Jira bug number)
