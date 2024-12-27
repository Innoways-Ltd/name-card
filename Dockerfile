# Dockerfile
FROM harbor-hk.a4appz.com/common/nginx:latest


COPY ./build  /usr/share/nginx/html/
EXPOSE 80
 CMD ["nginx", "-g", "daemon off;"]
#CMD [ "npm", "start" ]
