FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install express cors

# Copy app files and build frontend
COPY . .
RUN npm run build

EXPOSE 9600
ENV PORT=9600

CMD ["node", "server.js"]
