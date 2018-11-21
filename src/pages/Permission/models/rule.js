import { queryUser, deleteUsers, addUser, updateRule, saveUserRole } from '@/services/api';

export default {
  namespace: 'rule',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUser, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addUser, payload);
      if (response.success) {
        if (callback) callback();
        const data = yield call(queryUser, {});
        yield put({
          type: 'save',
          payload: data,
        });
      }
    },
    *saveRole({ payload, callback }, { call, put }) {
      const response = yield call(saveUserRole, payload);
      if (response.success) {
        if (callback) callback();
        const data = yield call(queryUser, {});
        yield put({
          type: 'save',
          payload: data,
        });
      }
    },
    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteUsers, payload);
      if (response.success) {
        if (callback) callback();
        const data = yield call(queryUser, {});
        yield put({
          type: 'save',
          payload: data,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
