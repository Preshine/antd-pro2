import { queryResources, queryFakeList, removeFakeList, addFakeList, updateFakeList } from '@/services/api';

export default {
  namespace: 'role',

  state: {
    list: [],
    treeList: []
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = [{
        "id": "fake-list-3",
        "owner": "周星星",
        "name": "Ant Design Pro",
        "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png",
        "cover": "https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png",
        "status": "0",
        "percent": 59,
        "logo": "https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png",
        "href": "https://ant.design",
        "updatedAt": "2018-11-14T00:19:56.252Z",
        "createdAt": "2018-11-14T00:19:56.252Z",
        "subDescription": "城镇中有那么多的酒馆，她却偏偏走进了我的酒馆",
        "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。",
        "activeUser": 123346,
        "newUser": 1884,
        "star": 170,
        "like": 199,
        "message": 19,
        "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。",
        "members": [{
          "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png",
          "name": "曲丽丽",
          "id": "member1"
        }, {
          "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png",
          "name": "王昭君",
          "id": "member2"
        }, {
          "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png",
          "name": "董娜娜",
          "id": "member3"
        }]
      }, {
        "id": "fake-list-4",
        "owner": "吴加好",
        "name": "Bootstrap",
        "avatar": "https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png",
        "cover": "https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png",
        "status": "1",
        "percent": 54,
        "logo": "https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png",
        "href": "https://ant.design",
        "updatedAt": "2018-11-13T22:19:56.252Z",
        "createdAt": "2018-11-13T22:19:56.252Z",
        "subDescription": "那时候我只会想自己想要什么，从不想自己拥有什么",
        "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。",
        "activeUser": 187250,
        "newUser": 1354,
        "star": 169,
        "like": 163,
        "message": 14,
        "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。",
        "members": [{
          "avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png",
          "name": "曲丽丽",
          "id": "member1"
        }, {
          "avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png",
          "name": "王昭君",
          "id": "member2"
        }, {
          "avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png",
          "name": "董娜娜",
          "id": "member3"
        }]
      }];
      //yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchResTree({ payload }, { call, put }) {
      const response = yield call(queryResources, payload);
      yield put({
        type: 'queryTreeList',
        payload: response,
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    queryTreeList(state, action) {
      return {
        ...state,
        treeList: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
