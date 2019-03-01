# Matcha
Welcome to Matcha, a simple yet great dating website ! 
<<<<<<< HEAD
Create your profile, browse through a customized suggestion of profile, like, match, chat in just few clicks. 

![Alt text](public/img/preview_readme.png?raw=true )
=======
Create your profile, browse through a customized suggestion of profiles, like, match, chat in just few clicks. 
>>>>>>> dbb49f8618c95918060d5fe179fcf7c9e0b4ac2f

### Build with
* [NodeJS](https://nodejs.org/en/) - Backend
* [Express](https://expressjs.com/) - Web application framework
* [ReactJS](https://reactjs.org/) - Frontend
* [PostgreSQL](https://www.postgresql.org/) - Database
* [Socket.io](https://socket.io/) - Used to get real time notifications and messages

## Get the requirement

### Prerequisites
You need to have installed [NodeJS](https://nodejs.org/en/) and [PostgreSQL](https://www.postgresql.org/).

### Modify the config file
*server/config/dev.js* contains all the information needed by [PostgreSQL](https://www.postgresql.org/) to connect Matcha to its database. Modify it so it matches your Pg config.
```
const db = {
    user: 'yourPgUsername',
    database: 'yourDatabseName',
    password: 'yourPgPassord',
    port: 'yourPgport'
};
```

## Let's start

### Make sure all your node modules are installed
```
npm update
```

### Run your server
```
node server/index.js
```

### Create and fill your database with 600 random profiles
```
npm run init
```

### Start the App
```
npm start
```

## Ready Set Match !
Congrats you have successfully set up your Matcha ! You can now create a new profile or sign in with one of the 600 created (password: *Matcha2019*).

## Authors
<<<<<<< HEAD
* **Chloe** - *Front/Back* - [check her profile](https://github.com/ccu-an-b)
* **Trestan** - *Back* - [check his profile](https://github.com/trndlz)
=======
* **Trestan** - *Back* - [check his profile](https://github.com/trndlz)
* **Chloe** - *Front/Back* - [check her profile](https://github.com/ccu-an-b)
>>>>>>> dbb49f8618c95918060d5fe179fcf7c9e0b4ac2f
