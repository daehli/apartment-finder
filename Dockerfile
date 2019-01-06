FROM node:carbon

WORKDIR /usr/src/app

COPY . .

RUN npm install && \ 
    chmod 777 /usr/src/app/entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

CMD ["npm", "start"]

