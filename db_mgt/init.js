const pg = require("pg");

const config = require("../server/config/dev");

const pool = new pg.Pool(config.db);

pool.query(
  ' \
CREATE SEQUENCE IF NOT EXISTS users_id_seq; \
CREATE SEQUENCE IF NOT EXISTS id_notif_seq; \
CREATE SEQUENCE IF NOT EXISTS id_notif_msg_seq; \
CREATE SEQUENCE IF NOT EXISTS id_msg_seq; \
CREATE SEQUENCE IF NOT EXISTS id_images_seq;\
CREATE TABLE IF NOT EXISTS users ( \
id integer NOT NULL DEFAULT nextval(\'users_id_seq\'::regclass), \
username character varying(128) COLLATE pg_catalog."default", \
first_name character varying(128) COLLATE pg_catalog."default", \
last_name character varying(128) COLLATE pg_catalog."default", \
mail character varying(128) COLLATE pg_catalog."default", \
password character varying(128) COLLATE pg_catalog."default", \
key character varying(128) COLLATE pg_catalog."default", \
ip character varying(128) COLLATE pg_catalog."default", \
geoloc character varying(128) COLLATE pg_catalog."default", \
active integer DEFAULT 0, \
online integer DEFAULT 0, \
complete integer DEFAULT 0, \
last_connexion timestamp(6) without time zone DEFAULT now(), \
CONSTRAINT users_pkey PRIMARY KEY (id) \
) \
WITH ( \
    OIDS = FALSE \
) \
TABLESPACE pg_default; \
CREATE TABLE IF NOT EXISTS profiles \
( \
    user_id integer NOT NULL, \
    age integer, \
    location character varying(128) COLLATE pg_catalog."default", \
    bio character varying(128) COLLATE pg_catalog."default", \
    gender integer, \
    orientation integer DEFAULT 0, \
    profile_img character varying(128) COLLATE pg_catalog."default" \
) \
WITH ( \
    OIDS = FALSE \
) \
TABLESPACE pg_default; \
CREATE TABLE IF NOT EXISTS matchs \
( \
    user_id integer NOT NULL, \
    CONSTRAINT matchs_pkey PRIMARY KEY (user_id) \
) \
WITH ( \
    OIDS = FALSE \
) \
TABLESPACE pg_default; \
CREATE TABLE IF NOT EXISTS scores \
( \
    user_id integer NOT NULL, \
    nb_visit integer DEFAULT 0, \
    nb_like integer DEFAULT 0, \
    nb_report integer DEFAULT 0, \
    total integer DEFAULT 0, \
    CONSTRAINT "Scores_pkey" PRIMARY KEY (user_id) \
) \
WITH ( \
    OIDS = FALSE \
) \
TABLESPACE pg_default; \
CREATE TABLE IF NOT EXISTS tags \
( \
    user_id integer NOT NULL, \
    CONSTRAINT tags_pkey PRIMARY KEY (user_id) \
) \
WITH ( \
    OIDS = FALSE \
) \
TABLESPACE pg_default;\
CREATE TABLE IF NOT EXISTS public.images\
(\
    id integer NOT NULL DEFAULT nextval(\'id_images_seq\'::regclass),\
    user_id integer,\
    path character varying(128) COLLATE pg_catalog."default",\
    CONSTRAINT images_pkey PRIMARY KEY (id)\
)\
WITH (\
    OIDS = FALSE\
)\
TABLESPACE pg_default;\
CREATE TABLE IF NOT EXISTS notifications\
(\
    id integer NOT NULL DEFAULT nextval(\'id_notif_seq\'::regclass),\
    user_id integer,\
    user_from_id integer,\
    type integer,\
    date timestamp without time zone NOT NULL DEFAULT now(),\
    read integer DEFAULT 0,\
    CONSTRAINT notifications_pkey PRIMARY KEY (id)\
)\
WITH (\
    OIDS = FALSE\
)\
TABLESPACE pg_default;\
CREATE TABLE IF NOT EXISTS notifications_messages\
(\
    id integer NOT NULL DEFAULT nextval(\'id_notif_msg_seq\'::regclass),\
    user_id integer,\
    user_from_id integer,\
    last_msg character varying(254) COLLATE pg_catalog."default",\
    date timestamp without time zone NOT NULL DEFAULT now(),\
    read integer DEFAULT 0,\
    CONSTRAINT notifications_messages_pkey PRIMARY KEY (id)\
)\
WITH (\
    OIDS = FALSE\
)\
TABLESPACE pg_default;\
CREATE TABLE IF NOT EXISTS public.messages\
(\
    id integer NOT NULL DEFAULT nextval(\'id_msg_seq\'::regclass),\
    user_from_id integer,\
    user_for_id integer,\
    content character varying(254) COLLATE pg_catalog."default",\
    read integer DEFAULT 0,\
    CONSTRAINT messages_pkey PRIMARY KEY (id)\
)\
WITH (\
    OIDS = FALSE\
)\
TABLESPACE pg_default;',
  (err, res) => {
    console.log(err, res);
    pool.end();
  }
);
