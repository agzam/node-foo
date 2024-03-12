FROM node:20-alpine3.19
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install --verbose
EXPOSE 5000
ENTRYPOINT ["npm", "start"]
