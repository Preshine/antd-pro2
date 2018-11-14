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
    *delete({payload, callback}, {put}) {
      const response = {success: true};// yield call(deleteResources, payload);
      if (response.success) {
        yield put({
          type: 'deleteById',
          payload
        });
      }
      if (callback) {
          callback();
      }
    }
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    deleteById(state, action) {
      return {
        ...state,
        list: state.list.filter(item => item.id != action.payload),
      };
    },
  },
};
