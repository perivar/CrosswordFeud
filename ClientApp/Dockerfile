# https://jskim1991.medium.com/improving-performance-of-react-app-using-nginx-a7460db423d4
# build environment
FROM node:16-alpine as builder

# Set the working directory to /app inside the container
WORKDIR /app

# Copy app files
# COPY . .
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
# RUN npm ci 

# install and cache app dependencies
COPY package.json /app
RUN yarn install # or RUN npm install
COPY . /app

# Build the app
RUN npm run build

# production environment
# Bundle static assets with nginx
FROM nginx:1.25-alpine as production
ENV NODE_ENV production

# Copy built assets from `build` image
COPY --from=builder /app/build /usr/share/nginx/html

# Add your nginx.conf
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d
COPY nginx/gzip.conf /etc/nginx/conf.d

# EXPOSE 3000 # Remember, I like to expose ports in docker-compose

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
