FROM node:alpine AS build

RUN apk update && apk upgrade && apk add git
RUN git clone -b main --single-branch https://github.com/DavidTangarife/tapio_front-end.git
WORKDIR /tapio_front-end
RUN npm ci
RUN npm run build

FROM nginx:alpine

# Copies the built files from the build stage (/Frontend/dist) into the Nginx default public folder.
COPY --from=build /tapio_front-end/dist/ /usr/share/nginx/html
# Copies the custom nginx.conf for SPA support Becuase of react router
RUN ls
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# This is the command that runs Nginx.
# The -g daemon off; tells it to run in the foreground (so Docker keeps the container alive).
CMD ["nginx", "-g", "daemon off;"]
