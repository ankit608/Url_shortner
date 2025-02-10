FROM node:20

WORKDIR /myapp/backend

# Copy package.json first for better Docker layer caching
COPY backend/package*.json ./

RUN npm install
RUN npm prune --production

# Now copy all backend files
COPY backend . 

EXPOSE 8080

CMD ["node", "index.js"]
