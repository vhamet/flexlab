FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

ENV DATABASE_USER=flexlab
ENV DATABASE_PASSWORD=flexlab
ENV ACCESS_TOKEN_SECRET=flexlab_secret

CMD ["npm", "start"]