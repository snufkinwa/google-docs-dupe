FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy the local dependency
COPY ../packages/core /usr/src/packages/core

# Install dependencies, including the local dependency
RUN npm install

# Copy the entire frontend directory
COPY . .

# Expose Nuxt's default port
EXPOSE 3000

# Run the Nuxt development server
CMD ["npm", "run", "dev"]
