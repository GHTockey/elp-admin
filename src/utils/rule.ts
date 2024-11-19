// auth.js

// 定义常量
export const FIELD_AUTH_OBJ = 'auth';
export const FIELD_OBJ_AUTH_LENGTH = 20; // readreadreadreadread

export const FIELD_USER_CORE_ROLE_ID = 'auth_role';

export const USER_CORE_ROLE_NORMAL = 0;
export const USER_CORE_ROLE_SYSTEM = 1;
export const USER_CORE_ROLE_SA = 2;
export const USER_CORE_ROLE_CODE = 3;
export const USER_CORE_ROLE_USER = 4;

export const OBJ_AUTH_CHAR_READ = 'r';
export const OBJ_AUTH_CHAR_EDIT = 'e';
export const OBJ_AUTH_CHAR_ADD = 'a';
export const OBJ_AUTH_CHAR_DELETE = 'd';

// 角色索引映射
const objAuthCoreRoleIndex = {
    [USER_CORE_ROLE_CODE]: 0,
    [USER_CORE_ROLE_SYSTEM]: 1,
    [USER_CORE_ROLE_SA]: 2,
    [USER_CORE_ROLE_NORMAL]: 3,
    [USER_CORE_ROLE_USER]: 4
};

// 权限字符索引映射
const authObjIndex = {
    [OBJ_AUTH_CHAR_READ]: 0,
    [OBJ_AUTH_CHAR_EDIT]: 1,
    [OBJ_AUTH_CHAR_ADD]: 2,
    [OBJ_AUTH_CHAR_DELETE]: 3
};

// 私有函数 _obj_auth
function _obj_auth(objOrAuth) {
    // console.log('objOrAuth',objOrAuth)
    if (Array.isArray(objOrAuth) || objOrAuth instanceof Object) {
        if (objOrAuth.hasOwnProperty(FIELD_AUTH_OBJ)) {
            return objOrAuth[FIELD_AUTH_OBJ];
        } else {
            return null;
        }
    }
    return objOrAuth;
}

// 私有函数 _user_auth
function _user_auth(userOrAuth) {
    // console.log('userOrAuth',userOrAuth)
    // console.log('私有函数_user_auth_user_auth');
    if (Array.isArray(userOrAuth)) {
        if (userOrAuth.hasOwnProperty(FIELD_USER_CORE_ROLE_ID)) {
            return userOrAuth[FIELD_USER_CORE_ROLE_ID];
        } else {
            return null;
        }
    }

    if (userOrAuth instanceof Object) {
        // console.log('对象userOrAuth',  userOrAuth);
        if (userOrAuth.hasOwnProperty(FIELD_USER_CORE_ROLE_ID)) {
            return userOrAuth[FIELD_USER_CORE_ROLE_ID];
        } else {
            return null;
        }
    }

    return userOrAuth;
}

// 公共函数
export function hasSa(userAuth) {
    // console.log('hasSahasSa');
    return isSa(userAuth) || isSystem(userAuth);
}

export function isAdmin(userAuth) {
    const userAuthValue = _user_auth(userAuth);
    return userAuthValue === USER_CORE_ROLE_NORMAL;
}

export function isSa(userAuth) {
    // console.log('管理员isSaisSaisSaisSa');
    const userAuthValue = _user_auth(userAuth);
    return userAuthValue === USER_CORE_ROLE_SA;
}

export function isSystem(userAuth) {
    // console.log('后台系统isSystemisSystem');
    const userAuthValue = _user_auth(userAuth);
    return userAuthValue === USER_CORE_ROLE_SYSTEM;
}

export function getAuthCharConfig(userOrAuth, objOrAuth, authChar) {
    // console.log('userOrAuth',userOrAuth)
    // console.log('objOrAuth',objOrAuth)
    // console.log('authChar',authChar)

    const userAuth = _user_auth(userOrAuth);
    const objAuth = _obj_auth(objOrAuth);

    // console.log('userAuth',userAuth) // 1
    // console.log('objAuth',objAuth) // readread------------
    // console.log('authChar',authChar) // r

    if (!objAuth || objAuth.length !== FIELD_OBJ_AUTH_LENGTH) {
        return null;
    }

    if (objAuthCoreRoleIndex.hasOwnProperty(userAuth) && authObjIndex.hasOwnProperty(authChar)) {
        const index = objAuthCoreRoleIndex[userAuth] * Object.keys(authObjIndex).length + authObjIndex[authChar];
        return objAuth[index];
    }
    return null;
}

export function isTableName(tableName) {
    return /^[a-z][a-z0-9_]+$/i.test(tableName);
}

export function isColumnName(column_name) {
    return isTableName(column_name);
}

export function isRowId(rowId) {
    return /^[0-9]+$/i.test(rowId) && rowId !== '';
}