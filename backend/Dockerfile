# Base image
FROM node:alpine

# Build stage
WORKDIR /backend
COPY package.json .
COPY package-lock.json .

RUN npm install --quiet
COPY . .

# Running the app
EXPOSE 8000
CMD npm run start