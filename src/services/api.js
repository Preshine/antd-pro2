import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export function fakeAccountLogin(params) {
  return request('/api/login/login', {
    method: 'POST',
    body: params,
  });
  let { password, userName } = params;
  if (password === '888888' && userName === 'admin') {
    return {
      status: 'ok',
      type: 'account',
      currentAuthority: 'admin',
    };
  }
  if (password === '123456' && userName === 'user') {
    return {
      status: 'ok',
      type: 'account',
      currentAuthority: 'user',
    };
  }
  return {
    status: 'error',
    type: 'account',
    currentAuthority: 'guest',
  };
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

// new
export async function queryResources() {
  return request('/api/resources/treeList');
}
export async function fetchResTreeByRole(roleId) {
  return request(`/api/role/getResTreeList?roleId=${roleId}`);
}
export async function queryUsersByrole(params) {
  return request(`/api/role/getUsersByrole?${stringify(params)}`);
}

export async function addResources(params) {
  return request('/api/resources/addOrEdit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function handleRoleStatus(params) {
  return request('/api/role/handleStatus', {
    method: 'POST',
    body: {
      ...params
    },
  });
}

export async function deleteRole(roleId) {
  return request('/api/role/delete', {
    method: 'POST',
    body: {
      roleId
    },
  });
}

export async function deleteResources(params) {
  return request('/api/resources/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryRole() {
  return request('/api/role/list');
}

export async function addRole(params) {
  return request('/api/role/addOrEdit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function addorEditRoleRes(params) {
  return request('/api/role/addorEditRoleRes', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getResByRoleId(roleId) {
  return request(`/api/role/getResByRoleId?roleId=${roleId}`);
}


//user
export async function queryUser(params) {
  return request(`/api/user/list?${stringify(params)}`);
}

export async function addUser(params) {
  return request('/api/user/add', {
    method: 'POST',
    body: params,
  });
}

export async function deleteUsers(ids) {
  return request('/api/user/delete', {
    method: 'POST',
    body: ids,
  });
}

export async function saveUserRole(params) {
  return request('/api/user/saveUserRole', {
    method: 'POST',
    body: params,
  });
}