# ----------------------------------------------- First Stage Build

# Order of instructions are important because of docker Caching
# if anything changes in the instruction, when building the image it will run from that specific instruction and onwards
# avoiding heavy resource consumer task such as NPM install to be repeated

FROM node:alpine AS build

WORKDIR /frontend

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ----------------------------------------------- Second Stage Deployment

FROM nginx:alpine

# Copies the built files from the build stage (/Frontend/dist) into the Nginx default public folder.
COPY --from=build /frontend/dist /usr/share/nginx/html
# Copies the custom nginx.conf for SPA support Becuase of react router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# This is the command that runs Nginx.
# The -g daemon off; tells it to run in the foreground (so Docker keeps the container alive).
CMD ["nginx", "-g", "daemon off;"]