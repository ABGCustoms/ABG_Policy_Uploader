# Use an official Node image to build the React app
FROM node:18 AS build

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Serve the app using Nginx
FROM nginx:alpine

# Copy built React files to Nginx web directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config if you have one (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
