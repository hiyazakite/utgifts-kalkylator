# Step 1: Use a Node.js image to install dependencies and build the app
FROM node:20 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x ./node_modules/.bin/tsc
RUN chmod +x ./node_modules/.bin/vite

# Build the backend and frontend
RUN npm run build

# Step 2: Create a production image and install only production dependencies
FROM node:20-alpine

WORKDIR /app

# Copy only the build artifacts from the builder stage
COPY --from=builder /app/build /app/build
COPY --from=builder /app/package*.json ./

# Set environment variables for production
ENV NODE_ENV=production
ENV DATABASE_PATH=/data/database.sqlite

# Create /data directory for storing SQLite database file
RUN mkdir -p /data

# Install only production dependencies, including sqlite3
RUN npm install --only=production

EXPOSE 5000

CMD ["node", "build/server.js"]