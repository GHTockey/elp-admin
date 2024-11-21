// SacManage.js

import * as Rule from '@/utils/rule';
import { storeToRefs } from 'pinia';
import { usePermissionStore } from '@/store/modules/permission';
// const { admin } = storeToRefs(usePermissionStore());


class SacManage {
  static admin: any = null;
  // static admin = storeToRefs(usePermissionStore()).admin.value;
  // static admin = storeToRefs(usePermissionStore());
  // 静态属性只能通过类名访问
  // static admin = { "id": 82, "auth": "readread------------", "sort": null, "auth_role": 1, "role_id": 0, "login": "System", "nick": "SYSTEM", "last_login_ip": "221.14.206.189", "last_login_time": "2024-11-18 16:37:02" }
  static _adminRoleTableList = {};
  static _adminRoleColumnList = {};

  // 获取管理员角色表格列表
  static async adminRoleTableList() {
    if (!SacManage.admin || Rule.hasSa(SacManage.admin)) {
      return [];
    }

    if (SacManage._adminRoleTableList == null) {
      // 这里替换为实际的 API 调用，获取表格列表
      // const response = await fetch('/api/admin-role-table-list', {
      //   method: 'GET',
      //   headers: { 'Content-Type': 'application/json' },
      // });
      // const data = await response.json();
      const data = [];
      SacManage._adminRoleTableList = {};
      data.forEach((tmp) => {
        SacManage._adminRoleTableList[tmp['my_table_name']] = tmp;
      });
    }

    return SacManage._adminRoleTableList;
  }

  // 获取管理员角色列列表
  static async adminRoleColumnList() {
    if (!SacManage.admin || Rule.hasSa(SacManage.admin)) {
      return [];
    }

    if (SacManage._adminRoleColumnList == null) {
      // TODO: 这里替换为实际的 API 调用，获取列列表
      // const response = await fetch('/api/admin-role-column-list', {
      //   method: 'GET',
      //   headers: { 'Content-Type': 'application/json' },
      // });
      // const data = await response.json();

      const data = [{}];
      SacManage._adminRoleColumnList = {};
      data.forEach((tmp) => {
        if (!SacManage._adminRoleColumnList[tmp['my_table_name']]) {
          SacManage._adminRoleColumnList[tmp['my_table_name']] = {};
        }
        SacManage._adminRoleColumnList[tmp['my_table_name']][tmp['my_column_name']] = tmp;
      });
    }

    return SacManage._adminRoleColumnList;
  }

  // 检查是否有 SA 权限
  static hasSa() {
    return Rule.hasSa(SacManage.admin);
  }

  // 检查是否为管理员
  static isAdmin() {
    return Rule.isAdmin(SacManage.admin);
  }

  // 检查是否为 SA
  static isSa() {
    return Rule.isSa(SacManage.admin);
  }

  // 检查是否为系统
  static isSystem() {
    return Rule.isSystem(SacManage.admin);
  }

  // 检查字段是否有读取权限
  static async has_auth_read_field(field) {
    return SacManage.has_auth_field(field, Rule.OBJ_AUTH_CHAR_READ);
  }

  // 检查字段是否有编辑权限
  static has_auth_edit_field(field) {
    // console.log('field', field)
    return SacManage.has_auth_field(field, Rule.OBJ_AUTH_CHAR_EDIT);
  }

  // 检查字段是否有添加权限
  static async has_auth_add_field(field) {
    return SacManage.has_auth_field(field, Rule.OBJ_AUTH_CHAR_ADD);
  }

  // 检查字段是否有权限
  static has_auth_field(field, auth_char) {
    // console.log('field',field)
    if (!SacManage.admin || !field) {
      return false;
    }

    // console.log('SacManage.admin', SacManage.admin)
    // return
    const config = Rule.getAuthCharConfig(SacManage.admin, field, auth_char);
    // console.log('config',config)
    if (!config) {
      return false;
    }

    if (!Rule.hasSa(SacManage.admin)) {
      const admin_role_column_list = SacManage.adminRoleColumnList();
      if (admin_role_column_list[field['my_table_name']] && admin_role_column_list[field['my_table_name']][field['my_column_name']]) {
        return admin_role_column_list[field['my_table_name']][field['my_column_name']]['sac'].includes(auth_char);
      }
    }

    return config === auth_char;
  }

  // 检查行是否有读取权限
  static async has_auth_read_row(target_row) {
    return SacManage.has_auth_row(target_row, Rule.OBJ_AUTH_CHAR_READ);
  }

  // 检查行是否有编辑权限
  static async has_auth_edit_row(target_row) {
    return SacManage.has_auth_row(target_row, Rule.OBJ_AUTH_CHAR_EDIT);
  }

  // 检查行是否有添加权限
  static async has_auth_add_row(target_row) {
    return SacManage.has_auth_row(target_row, Rule.OBJ_AUTH_CHAR_ADD);
  }

  // 检查行是否有删除权限
  static async has_auth_delete_row(target_row) {
    return SacManage.has_auth_row(target_row, Rule.OBJ_AUTH_CHAR_DELETE);
  }

  // 检查行是否有权限
  static async has_auth_row(target_row, auth_char) {
    if (!SacManage.admin || !target_row) {
      return false;
    }

    const config = await Rule.getAuthCharConfig(SacManage.admin, target_row, auth_char);
    if (!config) {
      return true; // 单条数据未指定权限控制，允许一切操作
    }
    return config === auth_char;
  }

  // 检查表格是否有读取权限
  static async has_auth_read_table(target_table) {
    return SacManage.has_auth_table(target_table, Rule.OBJ_AUTH_CHAR_READ);
  }

  // 检查表格是否有编辑权限
  static async has_auth_edit_table(target_table) {
    return SacManage.has_auth_table(target_table, Rule.OBJ_AUTH_CHAR_EDIT);
  }

  // 检查表格是否有添加权限
  static async has_auth_add_table(target_table) {
    return SacManage.has_auth_table(target_table, Rule.OBJ_AUTH_CHAR_ADD);
  }

  // 检查表格是否有删除权限
  static async has_auth_delete_table(target_table) {
    return SacManage.has_auth_table(target_table, Rule.OBJ_AUTH_CHAR_DELETE);
  }

  // 检查表格是否有权限
  static async has_auth_table(target_table, auth_char) {
    if (!SacManage.admin || !target_table) {
      return false;
    }

    const config = await Rule.getAuthCharConfig(SacManage.admin, target_table, auth_char);
    if (config !== auth_char) {
      return false;
    }

    if (!Rule.hasSa(SacManage.admin)) {
      const admin_role_table_list = await SacManage.adminRoleTableList();
      const table_name = target_table['my_table_name'];
      if (admin_role_table_list[table_name]) {
        return admin_role_table_list[table_name]['sac'].includes(auth_char);
      }
    }

    return true;
  }
}

export default SacManage;