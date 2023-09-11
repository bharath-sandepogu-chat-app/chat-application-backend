FROM node:alpine3.18
# Pull the base docker image of python with tag 3.10.6-slim

WORKDIR /app
# Change the working dir inside the container - cd /app

COPY config ./config
COPY controller ./controller
COPY middleware ./middleware
COPY models ./models
COPY routes ./routes
COPY service ./service
COPY socketHandlers ./socketHandlers
COPY store ./store
COPY utils ./utils
COPY package.json ./
COPY index.js ./

RUN npm i 

EXPOSE 8000

CMD ["npm","run","start"]