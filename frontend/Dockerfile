# Base image
FROM node:alpine

# Build stage
WORKDIR /frontend
COPY package.json .
COPY package-lock.json .

RUN npm install --quiet
COPY . .
RUN npm run build
RUN npm install -g serve --quiet

# Running the app
EXPOSE 3000
CMD serve -s build