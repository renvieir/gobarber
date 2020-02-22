# gobarber

## Pre-requisites

* docker
* node
* yarn
* postbird
* insomnia

## start development

```
# clone project
git clone git@github.com:renvieir/gobarber.git

# install packages
yarn install

# create docker container for mongo
docker run --name mongobarber -p 27017:27017 -d -t mongo

# create docker container for postgres database
docker run --name database -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres

# start postgresql cli to create database
docker exec -it database psql -U postgres

# create gobarber database
CREATE DATABASE gobarber;

# next time you can just run
# docker start database
# docker start mongobarber

# run migrations and seeds
yarn sequelize db:migrate
yarn sequelize db:seed:all

```
