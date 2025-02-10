FROM node:20
WORKDIR /myapp

COPY . .

RUN npm install 
RUN npm start
EXPOSE 3000

CMD["node","index.js"]