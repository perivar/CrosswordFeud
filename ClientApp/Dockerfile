# https://jskim1991.medium.com/improving-performance-of-react-app-using-nginx-a7460db423d4
# old version https://github.com/perivar/CrosswordFeud/blob/4cf7ecf1e5d943d8e49143341f90166c91660d2d/ClientApp/Dockerfile

# build environment
FROM node:alpine as builder

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
RUN npm run build

# production environment
# Bundle static assets with nginx
FROM nginx:stable-alpine as production

# Copy built assets from `build` image
COPY --from=builder /app/build /usr/share/nginx/html

# Add your nginx.conf
# If you are using react-router, uncomment below lines
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx/default.conf /etc/nginx/conf.d
# COPY nginx/gzip.conf /etc/nginx/conf.d

# EXPOSE 3000 # Remember, I like to expose ports in docker-compose

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
