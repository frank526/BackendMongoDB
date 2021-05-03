FROM node:10.19.0-alpine
COPY . /app
WORKDIR /app/
RUN npm install
ENV DB_HOST=mongo
EXPOSE 3000
CMD ["npm", "start"]
