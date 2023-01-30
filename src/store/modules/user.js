import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    companyName: '',
    avatar: '',
    roles: [],
    permissions: [],
    roleId: '',
    userId: '',
    id: '',
    tenantId: '',
    corpname: '',
    fullname: '',
  },

  mutations: {
    SET_TENANTID: (state, tenantId) => {
      state.tenantId = tenantId
    },

    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_ROLE: (state, roleId) => {
      state.roleId = roleId
    },
    SET_USER: (state, userId) => {
      state.userId = userId
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_CORPNAME: (state, corpname) => {
      state.corpname = corpname
    },
    SET_FULLNAME: (state, fullname) => {
      state.fullname = fullname
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid)
          .then((res) => {
            setToken(res.token)
            commit('SET_TOKEN', res.token)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then((res) => {
            const user = res.user
            commit('SET_ROLE', user.role.roleId)
            commit('SET_USER', user.userId)
            commit('SET_ID', user.id)
            commit('SET_CORPNAME', res.corpName)
            commit('SET_FULLNAME', res.corpFullName)
            const avatar =
              user.avatar == ''
                ? require('@/assets/image/profile.jpg')
                : user.avatar
            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', res.roles)
              commit('SET_PERMISSIONS', res.permissions)
            } else {
              commit('SET_ROLES', ['ROLE_DEFAULT'])
            }
            commit('SET_NAME', user.userName)
            commit('SET_AVATAR', avatar)

            state.nickName = user.nickName
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            localStorage.setItem("tenantId", '')
            localStorage.removeItem("tenantId")
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            // commit("SET_TENANTID",'')
            commit('SET_PERMISSIONS', [])
            removeToken()
            resolve()
          })
          .catch((error) => {
            localStorage.setItem("tenantId", '')
            localStorage.removeItem("tenantId")
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            // commit("SET_TENANTID",'')
            commit('SET_PERMISSIONS', [])
            removeToken()
            resolve()
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit("SET_TENANTID", '')
        removeToken()
        resolve()
      })
    }
  },
  getters: {
    getRole: (state) => {
      return state.roleId
    },
    getUser: (state) => {
      return state.userId
    },
    getID: (state) => {
      return state.id
    },
    getTenantId: (state) => {
      return state.tenantId
    }
  }
}

export default user
