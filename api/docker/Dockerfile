FROM registry.ewanhe.com/software/node:8.8.1-alpine
MAINTAINER Zhang Xiang <zhangxiang199101@gmail.com>

# Install global pm2 
RUN npm install pm2 -g --registry=https://registry.npm.taobao.org

# Bundle app source
RUN mkdir -p /data
ADD ./app /data

WORKDIR /data
VOLUME /data

CMD ["pm2", "start", "bin/app.json", "--no-daemon"]

EXPOSE 8002