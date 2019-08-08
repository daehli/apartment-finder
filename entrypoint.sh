#!/bin/bash

echo "Wait for DB to be up and running"

## Wait till the service response 

until nc -z db 5432 >/dev/null 2>&1; do :; done && echo "Connected Database"

echo "Running Migrations"

npm install

npm run migrations

npm start 