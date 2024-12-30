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
FROM harbor-hk.a4appz.com/common/nginx:latest

# Copy the built application to the NGINX HTML folder
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom NGINX configuration
# COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
