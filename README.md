# OpenShift OAuth templates

The upstream source for the login, errors, and providers HTML templates for OpenShift.

## Development

1. Install [Jekyll](https://jekyllrb.com/docs/installation/) and run `bundle install`.
1. Install [Yarn](https://yarnpkg.com/lang/en/docs/install) and run `yarn install`.
   - Note that certain dependencies require Node.js 20+. You can install [n](https://www.npmjs.com/package/n) to switch between node versions.
1. Run `yarn serve-jekyll`
   - Note that `yarn generate-styles` will have to be run if there are new PatternFly classes added to the HTML.

### Updating PatternFly

Github Pages only runs in safe mode, preventing the usage of [symlinks](https://github.com/jekyll/jekyll/pull/6670), so PatternFly source must be manually copied to `_includes`.

1. Install [Jekyll](https://jekyllrb.com/docs/installation/) and run `bundle install`.
1. Install [Yarn](https://yarnpkg.com/lang/en/docs/install) and run `yarn install`.
1. Run `yarn upgrade @patternfly/patternfly`.
1. Run `yarn generate-styles`.
1. Verify there are no regressions by running `yarn serve-jekyll`. Note that the CSS will not be automatically updated, so if you make changes to the HTML, you will need to run `yarn generate-styles` again.
1. Make manual changes to the generated CSS if needed.
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
    -  Secret Name: `error`

        Key:  `errors.html`

        Value:  html from `https://github.com/openshift/oauth-server/blob/<HASH>/pkg/server/errorpage/templates.go`
    -  Secret Name: `login`

        Key: `login.html`

        Value:  html from `https://github.com/openshift/oauth-server/blob/<HASH>/pkg/server/login/templates.go`
    -  Secret Name: `provider`

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

### Red Hat OpenShift

The RHO branded templates take advantage of the override mechanism by providing customized templates via secrets via the following method:

1. Copy the output from `yarn generate-branding-secret` to https://github.com/openshift/cluster-authentication-operator/blob/master/bindata/oauth-openshift/branding-secret.yaml.
1. Submit a pull request to https://github.com/openshift/cluster-authentication-operator containing the copied changes.

To test the changes:

1. Scale `cluster-version-operator` to zero pods in the web console by visiting `https://<HOSTNAME>/k8s/ns/openshift-cluster-version/deployments/cluster-version-operator` and using the pod donut controls to set pods to zero.  Additionally, pause rollouts via `Actions > Pause Rollouts`.
1. Scale `authentication-operator` to zero pods in the web console by visiting `https://<HOSTNAME>/k8s/ns/openshift-authentication-operator/deployments/authentication-operator` and using the pod donut controls to set pods to zero.
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
1. Visit `https://<HOSTNAME>/k8s/ns/openshift-authentication-operator/deployments/authentication-operator` and use the pod donut controls to set pods to one.

### Red Hat OpenShift Dedicated and Red Hat OpenShift Service on AWS (ROSA)

The OpenShift Dedicated and OpenShift Service on AWS branded templates also take advantage of the override mechanism. Note that the `provider` template has a special override for these brands: the `kube:admin` provider is hidden.

To update the templates used by OpenShift Dedicated and OpenShift Service on AWS, follow these steps:

1. Install [Jekyll](https://jekyllrb.com/docs/installation/) and run `bundle install`.
1. Install [Yarn](https://yarnpkg.com/lang/en/docs/install) and run `yarn install`.
1. Run `yarn build-jekyll` to generate the HTML templates. The
1. You can find the templates for OpenShift Service on AWS and OpenShift Dedicated in the `_site/rosa` and `_site/od` directories respectively.
1. Follow the instructions on the [managed-cluster-config](https://github.com/openshift/managed-cluster-config) repository for [OpenShift Dedicated](https://github.com/openshift/managed-cluster-config/tree/master/source/html/osd) and [OpenShift Service on AWS](https://github.com/openshift/managed-cluster-config/tree/master/source/html/rosa) to update the templates.
