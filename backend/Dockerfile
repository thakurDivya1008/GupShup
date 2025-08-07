# Step 1: Use Node base image
FROM node:20

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy all other files
COPY . .

# Step 5: Expose port
EXPOSE 7000

# Step 6: Start the server
CMD ["node", "index.js"]
