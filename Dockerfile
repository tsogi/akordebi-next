# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only (skip devDependencies like better-sqlite3)
RUN npm install --omit=dev

# Bundle app source inside the Docker image
COPY . .

# Build the Next.js application
# RUN npm run build

# Your app will bind to port 3000, so use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3002

# Define the command to run the app
CMD ["npm", "start"]