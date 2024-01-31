FROM nginx:1.23.1
ARG APP

# # Update Installed packages
RUN apt-get update && \
    apt-get upgrade -y

WORKDIR /usr/share/nginx/

COPY ./dist/apps/$APP/ html/

COPY ./.ci/helm/web/conf/nginx.conf /etc/nginx/nginx.conf
