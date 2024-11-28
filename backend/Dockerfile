# Backend Dockerfile

# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY . .

# Expose the backend port
EXPOSE 4000

# Start the server
CMD ["npm", "start"]
