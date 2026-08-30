FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the frontend
RUN npm run build

# Expose port
EXPOSE 9600

# Start the server
CMD ["node", "server.js"]
