Abbvie Backend App

##Installation

First create DB schema 

```
-- DROP ROLE abbvieapp;
CREATE ROLE abbvieapp NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT LOGIN PASSWORD 'abbvieapp.';

-- DROP SCHEMA abbvie;
CREATE SCHEMA abbvie AUTHORIZATION abbvieapp;
```


Then follow the commands from https://github.com/MehmetKaplan/serial-entrepreneur/blob/master/database-setup/README.md but be sure to use the proper role in place (i.e. abbvieapp)

Create the admin user. TODO: admin pwd hash 
Increase user seq by one;

```
SELECT nextval('serialentrepreneur.users_id_seq');
```

Then first run the ddl then the dml sql files from the docs folder. Be sure that the admin user has the user id 1. 

Finally execute the following command for starting the application;

```
yarn
yarn start-win-nodemon
```