# OpenShift oauth templates

The upstream source for the login, errors, and providers HTML templates for OpenShift.

View the templates at https://openshift.github.io/oauth-templates/.

## Development

1. Install [Jekyll](https://jekyllrb.com/docs/installation/).
1. Run `bundle install`.
1. Run `bundle exec jekyll serve`.

### Updating PatternFly

Github Pages only runs in safe mode, preventing the usage of [symlinks](https://github.com/jekyll/jekyll/pull/6670), so PatternFly source must be manually copied to `_includes`.

1. Install [Yarn](https://yarnpkg.com/lang/en/docs/install).
1. Run `yarn upgrade @patternfly/patternfly`.
1. Copy the contents of `node_modules/@patternfly/patternfly` to `_includes/patternfly`.
1. Delete `_includes/patternfly/assets` and `_includes/patternfly/icons` as they are not needed.
1. Commit the changes.
