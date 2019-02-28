const   pg = require('pg'),
        config = require("./dev");

const   pool = new pg.Pool(config.db);

function create_tables() {

    return pool.query(
    `CREATE SEQUENCE IF NOT EXISTS users_id_seq RESTART 600; 
      CREATE SEQUENCE IF NOT EXISTS id_notif_seq; 
      CREATE SEQUENCE IF NOT EXISTS id_notif_msg_seq; 
      CREATE SEQUENCE IF NOT EXISTS id_msg_seq; 
      CREATE SEQUENCE IF NOT EXISTS id_images_seq;
      CREATE TABLE IF NOT EXISTS users ( 
      id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass), 
      username character varying(128) COLLATE pg_catalog."default", 
      first_name character varying(128) COLLATE pg_catalog."default", 
      last_name character varying(128) COLLATE pg_catalog."default", 
      mail character varying(128) COLLATE pg_catalog."default", 
      password character varying(128) COLLATE pg_catalog."default", 
      key character varying(128) COLLATE pg_catalog."default", 
      active integer DEFAULT 0, 
      online integer DEFAULT 0, 
      complete integer DEFAULT 0, 
      connexion character varying(128) COLLATE pg_catalog."default" DEFAULT now(),
      CONSTRAINT users_pkey PRIMARY KEY (id) 
      ) 
      WITH ( 
          OIDS = FALSE 
      ) 
      TABLESPACE pg_default;
      CREATE TABLE IF NOT EXISTS profiles 
      ( 
          user_id integer NOT NULL, 
          age integer, 
          bio text COLLATE pg_catalog."default", 
          gender integer, 
          orientation integer DEFAULT 0, 
          profile_img character varying(254) COLLATE pg_catalog."default"  
      ) 
      WITH ( 
          OIDS = FALSE 
      ) 
      TABLESPACE pg_default;
      CREATE TABLE IF NOT EXISTS matchs 
        ( 
            user_id integer NOT NULL, 
            CONSTRAINT matchs_pkey PRIMARY KEY (user_id) 
        ) 
        WITH ( 
            OIDS = FALSE 
        ) 
        TABLESPACE pg_default; 
        CREATE TABLE IF NOT EXISTS scores 
        ( 
            user_id integer NOT NULL, 
            total integer DEFAULT 0, 
            CONSTRAINT "Scores_pkey" PRIMARY KEY (user_id) 
        ) 
        WITH ( 
            OIDS = FALSE 
        )
        TABLESPACE pg_default; 
        CREATE TABLE IF NOT EXISTS geoloc 
        ( 
            user_id integer NOT NULL, 
            ip character varying(128) COLLATE pg_catalog."default", 
            latitude_ip character varying(128) COLLATE pg_catalog."default", 
            longitude_ip character varying(128) COLLATE pg_catalog."default",
            city_ip character varying(128) COLLATE pg_catalog."default",
            country_ip character varying(128) COLLATE pg_catalog."default",
            latitude_user character varying(128) COLLATE pg_catalog."default", 
            longitude_user character varying(128) COLLATE pg_catalog."default",
            display_adress_user text COLLATE pg_catalog."default",
            city_user character varying(128) COLLATE pg_catalog."default",
            country_user character varying(128) COLLATE pg_catalog."default",
            CONSTRAINT "Geoloc_pkey" PRIMARY KEY (user_id) 
        ) 
        WITH ( 
            OIDS = FALSE 
        ) 
        TABLESPACE pg_default; 
        CREATE TABLE IF NOT EXISTS tags 
        (   
            user_id integer NOT NULL, 
            "desperate" integer DEFAULT 0,
            "available" integer DEFAULT 0,
            "critical" integer DEFAULT 0,
            "emotional" integer DEFAULT 0,
            "traditional" integer DEFAULT 0,
            "sexual" integer DEFAULT 0,
            "old" integer DEFAULT 0,
            "young" integer DEFAULT 0,
            "odd" integer DEFAULT 0,
            "suitable" integer DEFAULT 0,
            "curious" integer DEFAULT 0,
            "reasonable" integer DEFAULT 0,
            "afraid" integer DEFAULT 0,
            "mental" integer DEFAULT 0,
            "rare" integer DEFAULT 0,
            "terrible" integer DEFAULT 0,
            "scared" integer DEFAULT 0,
            "serious" integer DEFAULT 0,
            "remarkable" integer DEFAULT 0,
            "existing" integer DEFAULT 0,
            "weak" integer DEFAULT 0,
            "wonderful" integer DEFAULT 0,
            "huge" integer DEFAULT 0,
            "unhappy" integer DEFAULT 0,
            "happy" integer DEFAULT 0,
            "cheater" integer DEFAULT 0,
            "lover" integer DEFAULT 0,
            "liar" integer DEFAULT 0,
            "rich" integer DEFAULT 0,
            "affordable" integer DEFAULT 0,
            "alcoholic" integer DEFAULT 0,
            "friendly" integer DEFAULT 0,
            "guilty" integer DEFAULT 0,
            "unemployed" integer DEFAULT 0,
            "nice" integer DEFAULT 0,
            CONSTRAINT tags_pkey PRIMARY KEY (user_id) 
        ) 
        WITH ( 
            OIDS = FALSE 
        ) 
        TABLESPACE pg_default;
        CREATE TABLE IF NOT EXISTS images
        (
            id integer NOT NULL DEFAULT nextval('id_images_seq'::regclass),
            user_id integer,
            path character varying(128) COLLATE pg_catalog."default",
            CONSTRAINT images_pkey PRIMARY KEY (id)
        )
        WITH (
            OIDS = FALSE
        )
        TABLESPACE pg_default;
        CREATE TABLE IF NOT EXISTS notifications
        (
            id integer NOT NULL DEFAULT nextval('id_notif_seq'::regclass),
            user_id integer,
            user_from_id integer,
            type integer,
            date character varying(128) DEFAULT 0,
            read integer DEFAULT 0,
            match_id text,
            CONSTRAINT notifications_pkey PRIMARY KEY (id)
        )
        WITH (
            OIDS = FALSE
        )
        TABLESPACE pg_default;
        CREATE TABLE IF NOT EXISTS notifications_messages
        (
            id integer NOT NULL DEFAULT nextval('id_notif_msg_seq'::regclass),
            user_id integer,
            user_from_id integer,
            last_msg character varying(254) COLLATE pg_catalog."default",
            date  character varying(128) DEFAULT 0,
            read integer DEFAULT 0,
            room_id text,
            CONSTRAINT notifications_messages_pkey PRIMARY KEY (id)
        )
        WITH (
            OIDS = FALSE
        )
        TABLESPACE pg_default;
        CREATE TABLE IF NOT EXISTS messages
        (
            id integer NOT NULL DEFAULT nextval('id_msg_seq'::regclass),
            user_from_id integer,
            user_for_id integer,
            content character varying(254) COLLATE pg_catalog."default",
            read integer DEFAULT 0,
            room_id character varying(128),
            date character varying(128),
            CONSTRAINT messages_pkey PRIMARY KEY (id)
        )
        WITH (
            OIDS = FALSE
        )
        TABLESPACE pg_default;`,
        () => {
            pool.end();
        }
      );
}

module.exports = {
    create_tables
}

     