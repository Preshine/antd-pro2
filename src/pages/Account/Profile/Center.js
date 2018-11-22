import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';

@connect(({ loading, user, project }) => ({
  listLoading: loading.effects['list/fetch'],
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  project,
  projectLoading: loading.effects['project/fetchNotice'],
}))
class Center extends PureComponent {
  state = {
    tabKey: 'resources',
    newTags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
    dispatch({
      type: 'project/fetchNotice',
    });
  }

  onTabChange = key => {
    this.setState({ tabKey: key });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  saveInputRef = input => {
    this.input = input;
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }
    this.setState({
      newTags,
      inputVisible: false,
      inputValue: '',
    });
  };

  render() {
    const { newTags, inputVisible, inputValue, tabKey } = this.state;
    const {
      listLoading,
      currentUser,
      currentUserLoading,
      project: { notice },
      projectLoading,
      match,
      location,
      children,
    } = this.props;

    const operationTabList = [
      {
        key: 'usrInfo',
        tab: (
          <span>
            个人资料 <span style={{ fontSize: 14 }}></span>
          </span>
        ),
      },
      {
        key: 'updatePwd',
        tab: (
          <span>
            修改密码 <span style={{ fontSize: 14 }}></span>
          </span>
        ),
      },
      {
        key: 'safety',
        tab: (
          <span>
            安全设置 <span style={{ fontSize: 14 }}></span>
          </span>
        ),
      },
    ];

    const operationTab = {
      usrInfo: 'userInfo',
      updatePwd: 'updatePwd',
      safety: 'safety',
    }

    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={24} md={24}>
            <Card bordered={false} loading={currentUserLoading}>
              {currentUser && Object.keys(currentUser).length ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser.avatar} />
                    <div className={styles.name}>{currentUser.name}</div>
                    <div>{currentUser.signature}</div>
                  </div>
                  <Divider dashed />
                </div>
              ) : (
                  'loading...'
                )}
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={24} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              // activeTabKey={location.pathname.replace(`${match.path}/`, '')}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
              loading={listLoading}
            >
              {operationTab[tabKey]}
            </Card>
          </Col>
        </Row>
      </GridContent >
    );
  }
}

export default Center;
