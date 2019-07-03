FROM registry.ewanhe.com/software/nginx:1.13.6
MAINTAINER Zhang Xiang <zhangxiang199101@gmail.com>

# Bundle app source
RUN mkdir -p /data
ADD ./app /data
ADD nginx /etc/nginx/conf.d
ADD certs.d /etc/nginx/certs.d

EXPOSE 80