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
FROM harbor-hk.a4appz.com/common/nginx:1.31.8-alpine

# Security hardening:
# - Remove the optional NGINX modules (not loaded here), which also removes libxml2 and libxslt
# - Take busybox 1.38 from edge, as Alpine v3.24 has no fix for CVE-2025-60876 and CVE-2025-46394
# - Allow the non-root user to bind port 80 and write its runtime files
RUN apk del --no-network nginx-module-xslt nginx-module-njs nginx-module-geoip nginx-module-image-filter nginx-module-acme \
    && apk upgrade --no-cache \
    && apk add --no-cache --repository https://dl-cdn.alpinelinux.org/alpine/edge/main "busybox>=1.38" "busybox-binsh>=1.38" "ssl_client>=1.38" \
    && apk add --no-cache --virtual .setcap-deps libcap-setcap \
    && setcap cap_net_bind_service=+ep /usr/sbin/nginx \
    && apk del --no-network .setcap-deps \
    && sed -i -e 's|^pid .*|pid /tmp/nginx.pid;|' -e '/^user /d' /etc/nginx/nginx.conf \
    && chown -R nginx:nginx /var/cache/nginx /etc/nginx/conf.d

# Copy the built application to the NGINX HTML folder
COPY --from=build --chown=nginx:nginx /app/build /usr/share/nginx/html

# Copy the custom NGINX configuration
# COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for HTTP traffic
EXPOSE 80

# Run as non-root
USER nginx

# Start NGINX server
