# Frontend Dockerfile

# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY . .

# Build the frontend application
RUN npm run build

# Expose the frontend port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
