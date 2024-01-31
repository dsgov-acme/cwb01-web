# Required Tools

- Helm
- Skaffold
- Minikube

## File Purpose Overview

- `skaffold.yaml` --> for local cluster deployment, default file used when running `skaffold run` without passing a filename.

- `skaffold.agency.yaml` --> consumed by Cloud Deploy for cloud deployment for the Agency Portal. More info in `.ci/cloudbuild-push-request.yaml`.
- `skaffold.public.yaml` --> consumed by Cloud Deploy for cloud deployment for the Public Portal. More info in `.ci/cloudbuild-push-request.yaml`.

## Adding New Applications

When adding a new application in the mono-repo that is intended to have a different deployment lifecycle than existing apps, the relevant `skaffold.APP_NAME.yaml` file needs to be created and configured to handle it cleanly.

## Adding New Environments

For new environments that need to be supported by Cloud Deploy that is not already created, the following must be done:

1. Add a new `env.ENV_NAME.yaml` file under the particular application folder.
2. Configure a `ENV_NAME` profile within that application's `skaffold.APP_NAME.yaml` that calls the specific Helm values file that you created for the environment.

## Commands

start minikube:

```shell
minikube start && minikube addons enable gcp-auth --refresh
```

run with port forwarding:

```shell
skaffold dev # ctrl-c to stop
```

run once and return:

```shell
skaffold run
```

teardown:

```shell
skaffold delete
```
