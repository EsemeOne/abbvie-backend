INSERT INTO abbvie.roles (description,code) VALUES ('Administrator','Admin'),	 ('Super User','SuperUser'),	 ('User','User'),	 ('Anonymous','None');

INSERT INTO abbvie.user_roles (user_id,role_code) VALUES (1,'Admin');

INSERT INTO abbvie.roles_screen_objects (screen_object_id, role_code) VALUES(1001, 'Admin');
INSERT INTO abbvie.roles_screen_objects (screen_object_id, role_code) VALUES(1003, 'Admin');
INSERT INTO abbvie.roles_screen_objects (screen_object_id, role_code) VALUES(1004, 'Admin');
INSERT INTO abbvie.roles_screen_objects (screen_object_id, role_code) VALUES(1005, 'Admin');
INSERT INTO abbvie.roles_screen_objects (screen_object_id, role_code) VALUES(1008, 'Admin');
INSERT INTO abbvie.roles_screen_objects (screen_object_id, role_code) VALUES(1009, 'Admin');
INSERT INTO abbvie.roles_screen_objects (screen_object_id, role_code) VALUES(1010, 'Admin');
INSERT INTO abbvie.roles_screen_objects (screen_object_id, role_code) VALUES(1001, 'None');
INSERT INTO abbvie.roles_screen_objects (screen_object_id, role_code) VALUES(1001, 'User');
INSERT INTO abbvie.roles_screen_objects (screen_object_id, role_code) VALUES(1005, 'User');
INSERT INTO abbvie.roles_screen_objects (screen_object_id, role_code) VALUES(1008, 'User');
INSERT INTO abbvie.roles_screen_objects (screen_object_id, role_code) VALUES(1009, 'User');
INSERT INTO abbvie.roles_screen_objects (screen_object_id, role_code) VALUES(1010, 'User');
