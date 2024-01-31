ARG NODE_BUILDER
FROM $NODE_BUILDER as BUILDER
ARG APP
ARG ENVIRONMENT
RUN yarn nx build $APP --configuration $ENVIRONMENT

FROM nginx:1.23.1-alpine
ARG APP

# Update Installed packages
RUN apk update && \
    apk upgrade

WORKDIR /usr/share/nginx/

COPY --from=BUILDER /builder/dist/apps/$APP/ html/

COPY ./.ci/helm/web/conf/nginx.conf /etc/nginx/nginx.conf
