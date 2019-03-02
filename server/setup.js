const   faker = require('faker'),
        bcrypt = require('bcrypt'),
        crypto = require('crypto'),
        base64url = require('base64url'),
        randomLocation = require('random-location'),
        random_name = require('node-random-name'),
        axios = require("axios"),
        pg = require("pg"),
        db = require('./models/db'),
        config = require("./config/dev");

db.create_database(config.db.database)
    .then(() => {
        console.log("Database created")
        return save_user();
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

const Data = require('./config/randomData');

const randomConnexionDate = () => Math.round(Math.random() * (Date.now() - Date.parse("October 31, 2018")) + Date.parse("October 31, 2018"))

const randomAge = () => Math.round(Math.random() * (100 - 18) + 18)

const randomScore = () => Math.round(Math.random() * (500 - 0) + 0)

const randomOrientation = () => Math.round(Math.random() * (2 - 0) + 0)

const randomBool = () =>  Math.round(Math.random() * (1 - 0) + 0)

const randomCoord = () => {
    const P = Data.city[Math.round(Math.random() * (9 - 0) + 0)]
    const R = 4000 // meters
 
    return randomLocation.randomCirclePoint(P, R);
}

const givePassword = () => bcrypt.hashSync('Matcha2019', 10)

const giveKey = () => base64url(crypto.randomBytes(40))

const getFullAddress = () => {
    const coord = randomCoord()
    return axios
      .get(
        `http://nominatim.openstreetmap.org/reverse?format=json&lon=${escape(coord.longitude)}&lat=${escape(coord.latitude)}`
      )
    .then( response => {
        const address = response.data

        let city = address.address.city ||  address.address.town  ||  address.address.village
        let country = address.address.country;
        if (country.includes("Belgique"))
        {
            city ="Bruxelles";
            country = "Belgique";
        }
        if (country.includes("Suisse"))
            country = "Suisse";
        userLoc = {
            lat : address.lat,
            lon: address.lon,
            city: city.normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
            country: country,
            display_adress_user: address.display_name.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        }
        return userLoc
    })
}

function fake_user(gender, index) {
    const User = {
        id: index,
        first_name: random_name({ first: true, gender: gender === 0 ? 'male' : 'female' }),
        last_name: faker.name.lastName(),
        mail: faker.internet.email(),
        password: givePassword(),
        key: giveKey(),
        gender: gender,
        connexion: randomConnexionDate(),
        age: randomAge(),
        orientation: randomOrientation(),
        bio: faker.lorem.sentence(),
        profile_img: Data.pictures[index],
        score: randomScore(),
        ip: faker.internet.ip()
    }
    return getFullAddress().then((result) => {
        return  {...User, ...result}
    })

}

function insert_user(userData){
    const   pool = new pg.Pool(config.db);
    
    const {
        id,
        first_name,
        last_name,
        mail,
        password,
        key,
        gender,
        connexion,
        age,
        orientation,
        bio,
        profile_img,
        score,
        ip,
        lat,
        lon,
        city,
        country,
        display_adress_user
    } = userData

    const username = first_name+"."+last_name[0];

    const query = {
        text: `
        INSERT INTO users (id, username, first_name, last_name, mail, password, key, active, online, complete, connexion) 
            VALUES (${id}, '${username.toLowerCase()}', '${first_name}', '${last_name}', '${mail}', '${password}', '${key}', 1, 0, 1, '${connexion}');
        INSERT INTO matchs (user_id) 
            VALUES(${id});
        INSERT INTO scores (user_id, total) 
            VALUES(${id}, ${score});
        INSERT INTO geoloc (user_id, ip, latitude_ip, longitude_ip, city_ip, country_ip, latitude_user, longitude_user, display_adress_user, city_user, country_user) 
            VALUES(${id}, '${ip}', '${lat}', '${lon}', '${city}', '${country}', '${lat}', '${lon}', '${display_adress_user.replace(/[&\/\\#+()$~%.'":*?<>{}]/g, '')}', '${city}', '${country}');
        INSERT INTO profiles (user_id, age, bio, gender, orientation, profile_img) 
            VALUES(${id}, ${age}, '${bio}', ${gender}, ${orientation}, '${profile_img}');
        INSERT INTO tags (user_id,"desperate", "available", "critical","emotional","traditional","sexual","old","young","odd","suitable", "curious","reasonable","afraid","mental","rare","terrible","scared","serious","remarkable","existing","weak","wonderful","huge", "unhappy","happy","cheater","lover","liar","rich","affordable","alcoholic","friendly","guilty","unemployed","nice") 
            VALUES(${id}, ${randomBool()}, ${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()}, ${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()}, ${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()},${randomBool()});
        ALTER TABLE matchs ADD COLUMN "${id}" INTEGER default 0;`
    }

    pool.query(query,
        (err, res) => {
            pool.end();
            return res;                                                                                                            
        }
    );
    return true
}

const save_user = async () => {
    let i = 0;
    do {
        const user = await fake_user(0, i)
        await insert_user(user)
        i += 1
        console.log(`... User ${i} has been created`)
    } while (i < 300)
    do {
        const user = await fake_user(1, i)
        await insert_user(user)
        i += 1
        console.log(`... User ${i} has been created`)
    } while (i < 600)
    return  'Database filled';
 }

module.exports = {
    save_user
}