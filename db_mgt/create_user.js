const pg = require("pg");

const config = require("../server/config/dev");

const pool = new pg.Pool(config.db);

pool.query(
  `INSERT INTO users (id, username, first_name, last_name, mail, password, key, ip, latitude, longitude, active, online, complete, connexion)
  VALUES (DEFAULT, 'trndlz', 'Denzel', 'Washington', 'trestan.mervin@gmail.com', '$2b$10$X1U8nQxfrhPRxBm9StWPT.F2Evu9523uJevGpbBh/upznxc8dJWyq', '-K0ehlzcXVoKH2U3Yx8Xb1wX6eq8K7neJEjVMSjBCHN1_vvl0gef8w', '195.68.26.194', '48.8333', '2.25', 1, 1 ,0 , '1549011155893');`,
  (err, res) => {
    console.log(err, res);
    pool.end();
  }
);
