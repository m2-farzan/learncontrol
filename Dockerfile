FROM node as base
WORKDIR /src
COPY package.json ./
COPY package-lock.json ./

# FROM base as production
# ENV NODE_ENV=production
# RUN npm install
# #RUN npm ci
# COPY . /
# CMD ["npm", "run", "build"] ...etc

FROM base as dev
WORKDIR /src
ENV NODE_ENV=development
RUN npm install -g nodemon
RUN npm install -g --prefix /node_modules
RUN npm config set prefix /node_modules
RUN npm config set cache /node_modules/.cache
COPY . ./
CMD ["npm", "run", "start"]