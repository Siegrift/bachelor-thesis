# Backend

## Database

Using PostgreSQL database with [knex](https://github.com/tgriesser/knex) query builder. To be able
to work with the database, follow these steps:

1. Install PostrgreSQL
2. Open psql terminal: `sudo -u postgres psql`.

   If you have multiple psql instances installed, you might have to specify different port than
   implicit `5432`  
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
5. Exit psql using `Ctrl+D`, and log as a new user: `psql editor -h 127.0.0.1 -d editordb` or 
   `psql editor -p PORT -h 127.0.0.1 -d editordb` if you are using different port than `5432`
6. Write psql login info to `.env` file.

Do not modify the database directly! Use knex cli to generate
[migrations](https://knexjs.org/#Migrations). _(Useful commands are `knex migrate:make "name"` and
`knex migrate:latest`)_

## Running code to test

Code is run in a dockerized environment. This is not 100% safe, and best solution would be to use a
proper virtual environment and restrict the libraries user can use... But it's still better than
nothing.

**The work is heavily inspired and ported from: https://github.com/remoteinterview/compilebox**

The setup was not working and small changes needed to be done *(at least in ./installMint script)*.
To install follow these steps

1. Install docker (after installation I had problems running docker without sudo. This link solved
   he issue https://askubuntu.com/questions/477551/how-can-i-use-docker-without-sudo)
2. Verify that docker is properly installed by running `sudo service docker status` and also 
   `dockerrun hello-world`
3. Run `./installMint script` (or script for your distro, however 
   **only the script for Mint is working properly**)

## Compile and run script

Compile script provides a way how to build the sources and test the code.
You can find the information in [source file](https://github.com/Siegrift/bachelor-thesis/blob/master/backend/src/sandbox/sandbox.ts)
