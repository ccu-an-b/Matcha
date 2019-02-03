const pg = require("pg");

const config = require("../server/config/dev");

const pool = new pg.Pool(config.db);

pool.query(
  `INSERT INTO users (id, username, first_name, last_name, mail, password, key, active, online, complete, connexion)
  VALUES (5, 'trndlz', 'Denzel', 'Washington', 'trestan.mervin@gmail.com', '$2b$10$X1U8nQxfrhPRxBm9StWPT.F2Evu9523uJevGpbBh/upznxc8dJWyq', '-K0ehlzcXVoKH2U3Yx8Xb1wX6eq8K7neJEjVMSjBCHN1_vvl0gef8w', 1, 1 ,0 , '1549011155893');
  INSERT INTO matchs (user_id) VALUES(5);
  INSERT INTO scores (user_id) VALUES(5);
  INSERT INTO geoloc (user_id) VALUES(5);
  INSERT INTO profiles (user_id) VALUES(5);
  INSERT INTO tags (user_id) VALUES(5);
  ALTER TABLE tags ADD COLUMN romantique INTEGER default 0;
  ALTER TABLE tags ADD COLUMN randonnées INTEGER default 0;`,
  (err, res) => {
    console.log(err, res);
    pool.end();
  }
);
