const   faker = require('faker'),
        bcrypt = require('bcrypt'),
        crypto = require('crypto'),
        base64url = require('base64url'),
        randomLocation = require('random-location'),
        axios = require("axios"),
        db = require('../models/db');

const Data = require('../../db_mgt/randomData');

const randomConnexionDate = () => Math.round(Math.random() * (Date.now() - Date.parse("March 21, 2017")) + Date.parse("March 21, 2017"))

const randomAge = () => Math.round(Math.random() * (100 - 18) + 18)

const randomScore = () => Math.round(Math.random() * (500 - 0) + 0)

const randomOrientation = () => Math.round(Math.random() * (2 - 0) + 0)

const randomCoord = () => {
    const P = Data.city[Math.round(Math.random() * (9 - 0) + 0)]
    const R = 20000 // meters
 
    return randomLocation.randomCircumferencePoint(P, R);
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
        userLoc = {
            lat : address.lat,
            lon: address.lon,
            city: address.address.city ||  address.address.town || address.address.city_district || address.address.village,
            country: address.address.country.includes("Belgique") ? 'Belgique' : address.address.country,
            display_adress_user: address.display_name
        }
        console.log(userLoc)
        console.log(response.data)
    })
}

function fake_user(req, res) {

    const User = {
        first_name: faker.name.firstName('female'),
        last_name: faker.name.lastName(),
        mail: faker.internet.email(),
        password: givePassword(),
        key: giveKey(),
        active: 1,
        online: 0,
        complete:1,
        connexion: randomConnexionDate(),

        age: randomAge(),
        orientation: randomOrientation(),
        bio: faker.lorem.sentence(),
        profile_img: Data.manPic[0],

        score: randomScore(),

        ip: faker.internet.ip(),
    }
    getFullAddress()
    db.create_database('test')
    return res.json(User)

}

module.exports = {
    fake_user
}