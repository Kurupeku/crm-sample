FROM node:16

WORKDIR /app
#COPY package*.json ./
COPY . ./
RUN npm install

EXPOSE ${PORT}
CMD ["npm", "start","-port=${PORT}"]
