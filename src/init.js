const pg = require ('pg');

const config = require('../server/config/dev');

const pool = new pg.Pool(config.db);


pool.query(" \
CREATE SEQUENCE users_id_seq; \
CREATE SEQUENCE id_notif_seq; \
CREATE SEQUENCE id_notif_msg_seq; \
CREATE SEQUENCE id_msg_seq; \
    CREATE TABLE users ( \
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass), \
    username character varying(128) COLLATE pg_catalog.\"default\", \
    first_name character varying(128) COLLATE pg_catalog.\"default\", \
    last_name character varying(128) COLLATE pg_catalog.\"default\", \
    mail character varying(128) COLLATE pg_catalog.\"default\", \
    password character varying(128) COLLATE pg_catalog.\"default\", \
    key character varying(128) COLLATE pg_catalog.\"default\", \
    active integer DEFAULT 0, \
    profile_picture character varying(128) COLLATE pg_catalog.\"default\", \
    online integer DEFAULT 0, \
    last_connexion timestamp(6) without time zone DEFAULT now(), \
    CONSTRAINT users_pkey PRIMARY KEY (id) \
) \
WITH ( \
    OIDS = FALSE \
) \
TABLESPACE pg_default; \
CREATE TABLE profiles \
( \
    user_id integer NOT NULL, \
    age integer, \
    location character varying(128) COLLATE pg_catalog.\"default\", \
    bio character varying(128) COLLATE pg_catalog.\"default\", \
    gender integer, \
    orientation integer DEFAULT 0, \
    img_1 character varying(128) COLLATE pg_catalog.\"default\", \
    img_2 character varying(128) COLLATE pg_catalog.\"default\", \
    img_3 character varying(128) COLLATE pg_catalog.\"default\", \
    img_4 character varying(128) COLLATE pg_catalog.\"default\", \
    img_5 character varying(128) COLLATE pg_catalog.\"default\" \
) \
WITH ( \
    OIDS = FALSE \
) \
TABLESPACE pg_default; \
CREATE TABLE matchs \
( \
    user_id integer NOT NULL, \
    CONSTRAINT matchs_pkey PRIMARY KEY (user_id) \
) \
WITH ( \
    OIDS = FALSE \
) \
TABLESPACE pg_default; \
CREATE TABLE scores \
( \
    user_id integer NOT NULL, \
    nb_visit integer DEFAULT 0, \
    nb_like integer DEFAULT 0, \
    nb_report integer DEFAULT 0, \
    total integer DEFAULT 0, \
    CONSTRAINT \"Scores_pkey\" PRIMARY KEY (user_id) \
) \
WITH ( \
    OIDS = FALSE \
) \
TABLESPACE pg_default; \
CREATE TABLE tags \
( \
    user_id integer NOT NULL, \
    CONSTRAINT tags_pkey PRIMARY KEY (user_id) \
) \
WITH ( \
    OIDS = FALSE \
) \
TABLESPACE pg_default;\
CREATE TABLE notifications\
(\
    id integer NOT NULL DEFAULT nextval('id_notif_seq'::regclass),\
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
CREATE TABLE notifications_messages\
(\
    id integer NOT NULL DEFAULT nextval('id_notif_msg_seq'::regclass),\
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
CREATE TABLE public.messages\
(\
    id integer NOT NULL DEFAULT nextval('id_msg_seq'::regclass),\
    user_from_id integer,\
    user_for_id integer,\
    content character varying(254) COLLATE pg_catalog."default",\
    read integer DEFAULT 0,\
    CONSTRAINT messages_pkey PRIMARY KEY (id)\
)\
WITH (\
    OIDS = FALSE\
)\
TABLESPACE pg_default;", (err, res) => {
    console.log(err, res);
    pool.end();
})