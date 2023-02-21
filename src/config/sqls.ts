enum SQL {
    INSERT_USER_AUDIT_LOG = "insert into abbvie.action_log (action_date, user_id, called_service, parameters) \
                                values(current_timestamp, :userId, :calledService, :parameters)",
    GET_ROLES = "select * from abbvie.roles",
    GET_ROLE = "select * from abbvie.roles where id=:roleCode",
    DELETE_ROLE_SCREEN_OBJECTS = "delete from abbvie.roles_screen_objects where role_code=:roleCode",
    DELETE_ROLE = "delete from abbvie.roles where id=:roleCode",
    INSERT_ROLE_SCREEN_OBJECTS = "insert into abbvie.roles_screen_objects (role_code, screen_object_id) values ",
    GET_SCREEN_OBJECTS = "select * from abbvie.screen_objects where id <> 1001",
    GET_ROLE_SCREEN_OBJECTS = "select screen_object_id from abbvie.roles_screen_objects where role_code = ANY(:roleCodes::varchar[]) and screen_object_id <> 1001 ",
    GET_USER_ROLES = "select role_code from abbvie.user_roles where user_id=:userId",
    INSERT_USER_ROLES = "insert into abbvie.user_roles (user_id, role_code) values ",
    ADD_USER_ROLE = "insert into abbvie.user_roles (user_id, role_code) values (:userId, :roleCode)",
    DELETE_USER_ROLES = "delete from abbvie.user_roles where user_id=:userId"
}

global.as.SQL=SQL