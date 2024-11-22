Installation
  1. you need to copy this project into your local project directory
  2. need to download node.js(18.18.0 or upper) and PostgreSQL(idk version) based on dependencies and its version (found in package.json file)

  ** to download specific version of node.js**
  you can use nvm(node version manager) which can install specific version of node.js and switch between version to match dependencies of different project. you can go to installation link in 'https://github.com/coreybutler/nvm-windows#readme'
  
  3. click 'download me' and select latest version of nvm-setup.exe
  4. when installation complete, try to run command 'nvm -v' to check if it exists
  5. then run command 'nvm install v<X.Y.Z> which is specific version you want to install (ex. nvm install v18.17.0 )
  6. run command 'nvm use 18.17.0' and 'nvm alias default 18.17.0' ,respectively.
  7. check node version by running 'node -v'

  Connecting the project to postgresql
  
    1.create .env file on root directory, by adding code DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database_name>?schema=public"
    2. check schema.prisma and after 
    **set DOTENV_CONFIG_PATH=.\.env && npx prisma migrate dev --name <migration-name(it's like description, so first time i write 'init' )>
    the above command can migrate(as update, can changing over time) schema.prisma to .env which loads into Postgresql.


  Running project For windows
  1. open command prompt(CMD) to project directory (ex. D:\HardwareEcommerceProject )
  2. run command 'npm install' to install all dependencies
  3. For CMD. go to frontend and backend path and run 'npm run dev' for each one of them.
  ** NOTE THAT to use next.js v15.13.0 it requires node.js version 18.18.0 and higher to support it.**

  
     
             .......................................add more na krub.................................
  
  
