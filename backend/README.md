# Backend

## Database

Using PostgreSQL database with [knex](https://github.com/tgriesser/knex) query builder.
To be able to work with the database, follow these steps:

1. Install PostrgreSQL
2. Open psql terminal: `sudo -u postgres psql`.

   If you have only multiple psql instances installed, you might have to specify different port
   than implicit `5432`  
   a) Determine correct port: `pg_lsclusters`  
   b) Use: `sudo -u postgres psql -p "port"`

   If you have problems connecting to psql service try: `sudo service postgresql restart`

3. Create a new db user:  
   a) `CREATE USER editor WITH ENCRYPTED PASSWORD 'editor**';`  
   b) verify: `\du`
4. Create a database for this user:  
   a) `CREATE DATABASE editordb;`  
   b) `ALTER DATABASE editordb OWNER TO editor;`  
   c) verify: `\list`
5. Exit psql using `Ctrl+D`, and log as a new user: `psql editor -p 5433 -h 127.0.0.1 -d editordb`
6. Write psql login info to `.env` file.

Do not modify the database directly! Use knex cli to generate
[migrations](https://knexjs.org/#Migrations). _(Useful commands are `knex migrate:make "name"` and
`knex migrate:latest`)_

## Running code to test

Code is run in a dockerized environment. This is not 100% safe, and best solution would be 
to use a proper virtual environment and restrict the libraries user can use... But it's still
better than nothing.

**The work is heavily inspired and ported from: https://github.com/remoteinterview/compilebox**

The setup was not working and small changes needed to be done *(at least in ./installMint script)*.

## Compile and run script

TODO:
