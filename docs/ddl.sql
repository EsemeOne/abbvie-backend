-- abbvie.action_log definition

-- Drop table

-- DROP TABLE abbvie.action_log;

CREATE TABLE abbvie.action_log (
	id serial4 NOT NULL,
	action_date timestamp NULL,
	user_id int4 NULL,
	called_service varchar(500) NULL,
	parameters varchar(10000) NULL,
	CONSTRAINT wmt_action_log_pkey PRIMARY KEY (id)
);


-- abbvie.roles definition

-- Drop table

-- DROP TABLE abbvie.roles;

CREATE TABLE abbvie.roles (
	description varchar(100) NOT NULL,
	code varchar NOT NULL,
	CONSTRAINT roles_pk PRIMARY KEY (code)
);


-- abbvie.roles_screen_objects definition

-- Drop table

-- DROP TABLE abbvie.roles_screen_objects;

CREATE TABLE abbvie.roles_screen_objects (
	screen_object_id int4 NOT NULL,
	role_code varchar NOT NULL,
	CONSTRAINT roles_screen_objects_pk PRIMARY KEY (screen_object_id, role_code),
	CONSTRAINT fk_roles_screen_objects_roles FOREIGN KEY (role_code) REFERENCES abbvie.roles(code)
);


-- abbvie.user_roles definition

-- Drop table

-- DROP TABLE abbvie.user_roles;

CREATE TABLE abbvie.user_roles (
	user_id int4 NOT NULL,
	role_code varchar NOT NULL,
	CONSTRAINT user_roles_pk PRIMARY KEY (user_id, role_code),
	CONSTRAINT fk_user_roles_roles FOREIGN KEY (role_code) REFERENCES abbvie.roles(code)
);

grant all on all tables in schema abbvie to abbvieapp;
grant all on all sequences in schema abbvie to abbvieapp;