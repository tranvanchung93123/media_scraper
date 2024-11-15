# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Expose the port the frontend runs on
EXPOSE 3000

# Start the app using a simple static server
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
