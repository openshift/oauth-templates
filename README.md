# OpenShift oauth templates

The upstream source for the login, errors, and providers HTML templates for OpenShift.

View the templates at https://rhamilto.github.io/oauth-templates/.

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

## Deployment

### OKD

1. Copy the generated source in `_site/okd/errors.html` to the corresponding template at https://github.com/openshift/oauth-server/blob/master/pkg/server/errorpage/templates.go.
1. Copy the generated source in `_site/okd/login.html` to the corresponding template at https://github.com/openshift/oauth-server/blob/master/pkg/server/login/templates.go.
1. Copy the generated source in `_site/okd/providers.html` to the corresponding template at https://github.com/openshift/oauth-server/blob/master/pkg/server/selectprovider/templates.go.
1. Submit a pull request to https://github.com/openshift/oauth-server containing the copied changes.

To test the changes:

1. Deploy an image containing the changes in the pull request.
1. Set branding to OKD via `oc create -f https://raw.githubusercontent.com/openshift/origin-branding/master/manifests/0000_10_origin-branding_configmap.yaml`.

To undo the changes for testing:

1. Run `oc delete configmap console-config -n openshift-config-managed`.

### Red Hat OpenShift Container Platform

1. Copy a [Base64-encoded](https://www.base64encode.org/) version of the generated source in `_site/okd/errors.html` to https://github.com/openshift/cluster-authentication-operator/blob/master/manifests/06_branding_secret.yaml#L9.
1. Copy a [Base64-encoded](https://www.base64encode.org/) version of the generated source in `_site/okd/login.html` to https://github.com/openshift/cluster-authentication-operator/blob/master/manifests/06_branding_secret.yaml#L7.
1. Copy a [Base64-encoded](https://www.base64encode.org/) version of the generated source in `_site/okd/providers.html` to https://github.com/openshift/cluster-authentication-operator/blob/master/manifests/06_branding_secret.yaml#L8.
1. Submit a pull request to https://github.com/openshift/cluster-authentication-operator containing the copied changes.

To test the changes:

1. Scale `cluster-version-operator` to zero pods in the web console by visiting `https://<HOSTNAME>/k8s/ns/openshift-cluster-version/deployments/cluster-version-operator` and using the pod donut controls to set pods to zero.  Additionally, pause rollouts via `Actions > Pause Rollouts`.
1. Delete the existing branding secret via `oc delete secret v4-0-config-system-ocp-branding-template -n openshift-authentication`
1. Recreate the branding secret via `oc create -f https://raw.githubusercontent.com/openshift/cluster-authentication-operator/<HASH>/manifests/06_branding_secret.yaml`
1. Delete existing openshift-authentication pods so they are regenerated with the new branding secret via `oc delete pods --all -n openshift-authentication`

To undo the changes for testing:

1. Resume rollouts of `cluster-version-operator` in the web console by visiting `https://<HOSTNAME>/k8s/ns/openshift-cluster-version/deployments/cluster-version-operator` via `Actions > Resume Rollouts` and scale pods back to one using the pod donut controls.
