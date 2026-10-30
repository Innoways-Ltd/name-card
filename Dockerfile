# Step 1: Build Application
FROM node:20.4.0 AS build

ARG NODE_ENV

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
# RUN npm config set registry https://registry.npmmirror.com
RUN npm install
# RUN npm audit fix --force

# Copy the application source code
COPY . .

# Build the application
RUN npm run build:${NODE_ENV} --prod

# Step 2: Setup NGINX for serving and proxy configuration
# FROM FROM nginx:stable-alpine
FROM harbor-hk.a4appz.com/common/nginx:1.31.8-alpine AS runtime

# Copy the built application to the NGINX HTML folder
COPY --from=build --chown=nginx:nginx /app/build /usr/share/nginx/html

# Copy the custom NGINX configuration
# COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Security hardening:
# - Remove the optional NGINX modules (not loaded here), which also removes libxml2 and libxslt
# - Allow the non-root user to bind port 80 and write its runtime files
# - Remove busybox, as 1.38.0 has no fix for CVE-2026-38753, CVE-2026-38754 and CVE-2026-38755.
#   This also removes the shell, so it has to be the last step. The apk database is kept so
#   the image scan still covers the remaining packages.
RUN apk del --no-network nginx-module-xslt nginx-module-njs nginx-module-geoip nginx-module-image-filter nginx-module-acme \
    && apk upgrade --no-cache \
    && apk add --no-cache --virtual .setcap-deps libcap-setcap \
    && setcap cap_net_bind_service=+ep /usr/sbin/nginx \
    && apk del --no-network .setcap-deps \
    && sed -i -e 's|^pid .*|pid /tmp/nginx.pid;|' -e '/^user /d' /etc/nginx/nginx.conf \
    && chown -R nginx:nginx /var/cache/nginx \
    && rm -rf /docker-entrypoint.sh /docker-entrypoint.d /etc/busybox-paths.d \
    && awk 'BEGIN { RS = ""; ORS = "\n\n" } !/^(C:[^\n]*\n)?P:(busybox|busybox-binsh|ssl_client)\n/' /lib/apk/db/installed > /tmp/installed \
    && cat /tmp/installed > /lib/apk/db/installed \
    && rm -f /tmp/installed \
    && for applet in $(/bin/busybox --list-full); do \
        if [ "$(/bin/busybox readlink "/$applet")" = /bin/busybox ]; then /bin/busybox rm -f "/$applet"; fi; \
    done \
    && /bin/busybox rm -f /usr/bin/ssl_client \
    && exec /bin/busybox rm -f /bin/busybox

# Step 3: Flatten into a single layer so the removed packages are not left in the image history
FROM scratch

COPY --from=runtime / /

# Expose port 80 for HTTP traffic
EXPOSE 80

# Run as non-root
USER nginx

# Start NGINX server
STOPSIGNAL SIGQUIT
ENTRYPOINT ["/usr/sbin/nginx", "-g", "daemon off;"]
