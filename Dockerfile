FROM node:15-alpine
ENV NODE_ENV="production"
WORKDIR /home/dashboard
RUN apk add --no-cache curl bash
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
COPY package.json .
RUN npm install --only=production --legacy-peer-deps
RUN /usr/local/bin/node-prune
RUN apk del curl bash \
    && rm -rf /usr/include \
    && rm -rf /var/cache/apk/* /usr/share/man /tmp/*
COPY . .
ENV PORT=8080
EXPOSE 8080
# CMD ["node", "."]
CMD ["npm", "start"]