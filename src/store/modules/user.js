import { getInfo, login, logout } from '@/api/login';
import defaultAvatar from '@/assets/logo.png';
import { ACCESS_TOKEN } from '@/store/mutation-types';
import { permissionListToPermissions } from '@/utils/permissions';
import { baseURL } from '@/utils/request';
import { doEncrypt } from '@/utils/secrecy';
import { logout as ssoLogout } from '@/utils/sso';
import { welcome } from '@/utils/util';
import storage from 'store';
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name;
      state.welcome = welcome;
    },
    SET_AVATAR: (state, avatar) => {
      if (avatar) {
        state.avatar = avatar + '/image';
      } else {
        state.avatar = defaultAvatar;
      }
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_INFO: (state, info) => {
      state.info = info;
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        // let user = { ...userInfo, username: doEncrypt(userInfo.username), password: doEncrypt(userInfo.password) };
        // login(user)
        //   // login(userInfo)
        //   .then((response) => {
        //     const data = response.data;
        //     storage.set(ACCESS_TOKEN, data, 7 * 24 * 60 * 60 * 1000);
        //     commit('SET_TOKEN', data);
        //     resolve(response);
        //   })
        //   .catch((error) => {
        //     reject(error);
        //   });

        login(userInfo)
          .then((response) => {
            console.log('Login response', response);
            const result = response.result;
            storage.set(ACCESS_TOKEN, result.token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
            commit('SET_TOKEN', result.token);
            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((response) => {
            const result = response.data;
            if (result.role) {
              const role = result.role;
              // 更改permission的默认的列表字段
              if (result.role.permissionList.length > 0) {
                role.permissions = permissionListToPermissions(result.role.permissionList);
                role.permissionList = role.permissions.map((permission) => {
                  return permission.permissionId;
                });
              } else {
                role.permissions = [];
                role.permissionList = [];
              }
              commit('SET_ROLES', result.role);
              commit('SET_INFO', result);
            } else {
              result.role = {};
              const role = result.role;

              // reject(new Error('请配置该账号的角色与权限！'))
              role.permissions = [];
              role.permissionList = [];
              commit('SET_ROLES', role);
              commit('SET_INFO', result);
            }

            commit('SET_NAME', { name: result.name, welcome: welcome() });
            const avatarUrl = result && result.avatarUrl;
            const isExternal = /^(https?:|mailto:|tel:|\/\/)/.test(avatarUrl);
            commit('SET_AVATAR', isExternal ? avatarUrl : avatarUrl ? baseURL + avatarUrl : null);

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        const reset = () => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          storage.remove(ACCESS_TOKEN);
          ssoLogout();
          resolve();
        };

        logout(state.token)
          .then(() => {
            reset();
          })
          .catch(() => {
            reset();
          });
      });
    },
  },
};

export default user;
