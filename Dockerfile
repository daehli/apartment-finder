FROM node:carbon

RUN apt-get update && apt-get install -y netcat

WORKDIR /usr/src/app

COPY entrypoint.sh /entrypoint.sh 

RUN npm install && \ 
    chmod 777 /entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

CMD ["npm", "start"]

