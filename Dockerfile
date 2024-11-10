# Step 1: Use a Node.js image to install dependencies and build the app
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code to the working directory
COPY . .

# Run the build script (this will build both frontend and backend)
RUN npm run build

# Step 2: Create a lightweight production image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only the build artifacts from the builder stage
COPY --from=builder /app/build /app/build
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package*.json ./

# Expose the server port
EXPOSE 5000

# Set the command to run the server
CMD ["node", "build/server.js"]
