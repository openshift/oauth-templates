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

## Deployment

### OKD

The default templates for OKD are built into the oauth server template.go files via the following method:

1. Copy the generated source in `_site/okd/errors.html` to the corresponding template at https://github.com/openshift/oauth-server/blob/master/pkg/server/errorpage/templates.go.
1. Copy the generated source in `_site/okd/login.html` to the corresponding template at https://github.com/openshift/oauth-server/blob/master/pkg/server/login/templates.go.
1. Copy the generated source in `_site/okd/providers.html` to the corresponding template at https://github.com/openshift/oauth-server/blob/master/pkg/server/selectprovider/templates.go.
1. Submit a pull request to https://github.com/openshift/oauth-server containing the copied changes.

To test the changes:

1.  Create three key/value secrets in the `openshift-config` namespace with the following values:
    1.  Secret Name: `error`

        Key:  `errors.html`

        Value:  html from `https://github.com/openshift/oauth-server/blob/<HASH>/pkg/server/errorpage/templates.go`
    1.  Secret Name: `login`

        Key: `login.html`

        Value:  html from `https://github.com/openshift/oauth-server/blob/<HASH>/pkg/server/login/templates.go`
    1.  Secret Name: `provider`

        Key: `providers.html`

        Value:  html from `https://github.com/openshift/oauth-server/blob/<HASH>/pkg/server/selectprovider/templates.go`
1.  Update `spec` in `https://<HOSTNAME>/k8s/cluster/config.openshift.io~v1~OAuth/cluster/yaml` with the following:
    ```
      templates:
        error:
            name: error
        login:
            name: login
        providerSelection:
            name: provider
    ```
1.  Wait for new pods to be deployed at `https://<HOSTNAME>/k8s/ns/openshift-authentication/pods`

To undo the changes for testing:

1. Remove the changes from step 2 above at `https://<HOSTNAME>/k8s/cluster/config.openshift.io~v1~OAuth/cluster/yaml`.
1. Delete the secrets created in step 1 above.

### Red Hat OpenShift Container Platform

The OCP branded templates take advantage of the override mechanism by providing customized templates via secrets via the following method:

1. Copy a [Base64-encoded](https://www.base64encode.org/) version of the generated source in `_site/ocp/errors.html` to https://github.com/openshift/cluster-authentication-operator/blob/master/bindata/oauth-openshift/branding-secret.yaml#L9.
1. Copy a [Base64-encoded](https://www.base64encode.org/) version of the generated source in `_site/ocp/login.html` to https://github.com/openshift/cluster-authentication-operator/blob/master/bindata/oauth-openshift/branding-secret.yaml#L7.
1. Copy a [Base64-encoded](https://www.base64encode.org/) version of the generated source in `_site/ocp/providers.html` to https://github.com/openshift/cluster-authentication-operator/blob/master/bindata/oauth-openshift/branding-secret.yaml#L8.
1. Submit a pull request to https://github.com/openshift/cluster-authentication-operator containing the copied changes.

To test the changes:

1. Scale `cluster-version-operator` to zero pods in the web console by visiting `https://<HOSTNAME>/k8s/ns/openshift-cluster-version/deployments/cluster-version-operator` and using the pod donut controls to set pods to zero.  Additionally, pause rollouts via `Actions > Pause Rollouts`.
1. Delete the existing branding secret:
    ```
    oc delete secret v4-0-config-system-ocp-branding-template -n openshift-authentication
    ```
1. Recreate the branding secret:
    ```
    oc create -f https://raw.githubusercontent.com/openshift/cluster-authentication-operator/<HASH>/bindata/oauth-openshift/branding-secret.yaml
    ```
1. Delete existing openshift-authentication pods so they are regenerated with the new branding secret:
    ```
    oc delete pods --all -n openshift-authentication
    ```

To undo the changes for testing:

1. Resume rollouts of `cluster-version-operator` in the web console by visiting `https://<HOSTNAME>/k8s/ns/openshift-cluster-version/deployments/cluster-version-operator` via `Actions > Resume Rollouts` and scale pods back to one using the pod donut controls.
