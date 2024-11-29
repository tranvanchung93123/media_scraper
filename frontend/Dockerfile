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


# Expose the frontend port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run dev"]
