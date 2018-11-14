import { queryResources, removeRule, addResources } from '@/services/api';

export default {
  namespace: 'resources',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryResources, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addResources, payload);
      if (response.success) {
        const response = yield call(queryResources, payload);
        yield put({
          type: 'queryList',
          payload: response,
        });
      }
      if (callback) {
        callback(response.message);
      }
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
