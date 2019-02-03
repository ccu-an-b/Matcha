const pg = require("pg");

const config = require("../server/config/dev");

const pool = new pg.Pool(config.db);

pool.query(`
  INSERT INTO users (id, username, first_name, last_name, mail, password, key, active, online, complete, connexion) VALUES (5, 'trndlz', 'Denzel', 'Washington', 'trestan.mervin@gmail.com', '$2b$10$X1U8nQxfrhPRxBm9StWPT.F2Evu9523uJevGpbBh/upznxc8dJWyq', '-K0ehlzcXVoKH2U3Yx8Xb1wX6eq8K7neJEjVMSjBCHN1_vvl0gef8w', 1, 1 ,0 , '1549011155893');
  INSERT INTO matchs (user_id) VALUES(5);
  INSERT INTO scores (user_id) VALUES(5);
  INSERT INTO geoloc (user_id, ip, latitude_ip, longitude_ip, city_ip, country_ip, latitude_user, longitude_user, display_adress_user, city_user, country_user) VALUES(5, '78.194.143.18', '48.8412', '2.3876', 'Paris', 'France', '48.8566101', '2.3514992', 'Paris, Île-de-France, France métropolitaine, France', 'Paris', 'France');
  INSERT INTO profiles (user_id, age, bio, gender, orientation, profile_img) VALUES(5, 17, 'Jaime les frites.', 0, 0, 'profile-1549202669041.jpeg');
  INSERT INTO tags (user_id) VALUES(5);

  INSERT INTO users (id, username, first_name, last_name, mail, password, key, active, online, complete, connexion) VALUES (6, 'fdurand', 'Françoise', 'Durand', 'f.durand@g2YIUEYF.com', '$2b$10$X1U8nQxfrhPRxBm9StWPT.F2Evu9523uJevGpbBh/upznxc8dJWyq', '-K0ehlzcXVoKH2U3Yx8Xb1wX6eq8K7neJEjVMSjBCHN1_vvl0gef8w', 1, 1 ,0 , '1549011155893');
  INSERT INTO matchs (user_id) VALUES(6);
  INSERT INTO scores (user_id) VALUES(6);
  INSERT INTO geoloc (user_id, ip, latitude_ip, longitude_ip, city_ip, country_ip, latitude_user, longitude_user, display_adress_user, city_user, country_user) VALUES(6, '78.194.143.18', '48.8960275' , '2.379391', 'Paris', 'France', '48.8960275' , '2.379391', 'Paris, Île-de-France, France métropolitaine, France', 'Paris', 'France');
  INSERT INTO profiles (user_id, age, bio, gender, orientation, profile_img) VALUES(6, 17, 'Jaime rigoler.', 0, 0, 'profile-1548341842221.jpeg');
  INSERT INTO tags (user_id) VALUES(6);

  ALTER TABLE tags ADD COLUMN romantique INTEGER default 0;
  ALTER TABLE tags ADD COLUMN randonnées INTEGER default 0;`,
  (err, res) => {
    console.log(err, res);
    pool.end();
  }
);
