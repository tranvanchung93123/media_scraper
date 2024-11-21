# Step 1: Use an official Node.js runtime as a base image
FROM node:18-alpine AS build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application
COPY . .

# Step 6: Build the Next.js application
RUN npm run build

# Step 7: Use Node.js runtime for serving the application
FROM node:18-alpine

# Step 8: Set the working directory
WORKDIR /app

# Step 9: Copy the built application from the build stage
COPY --from=build /app ./

# Step 10: Install production dependencies
RUN npm install --production

# Step 11: Expose the port
EXPOSE 3000

# Step 12: Start the application
CMD ["npm", "start"]
