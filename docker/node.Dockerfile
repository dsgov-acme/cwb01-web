# This repository only contains one single package.json file that lists the dependencies
# of all its frontend and backend applications. When a frontend application is built,
# its external dependencies (aka Node modules) are bundled in the resulting artifact.
# However, it is not the case for a backend application (for various valid reasons).
# Installing all the production dependencies would dramatically increase the size of the
# artifact. Instead, we need to extract the dependencies which are actually used by the
# backend application. To implement this behavior NX provides a flag that generates
# package.json and yarn.lock files, that only include the applications production dependencies
# as part of the build artifacts. This is enabled by setting the flag `"generatePackageJson": true`
# in the applications build configuration in `apps/${appName}/project.json`.

ARG NODE_BUILDER
FROM $NODE_BUILDER as BUILDER
ARG APP
ARG ENVIRONMENT
# Building the app creates package.json and yarn.lock files with the app specific production dependencies
RUN yarn nx build $APP --configuration $ENVIRONMENT

FROM node
ARG APP

WORKDIR /app

COPY --from=BUILDER /builder/dist/apps/$APP/ .
# We must install again here to create a lightweight version of only the external dependensies relevant to the app
RUN yarn install --production --frozen-lockfile

CMD [ "node", "main.js" ]

