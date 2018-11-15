import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './RoleDetail.less';

@connect(({ loading, user, role, project }) => ({
  listLoading: loading.effects['list/fetch'],
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  detailItem: role.itemDetail,
  project,
  projectLoading: loading.effects['project/fetchNotice'],
}))
class RoleDetail extends PureComponent {
  state = {
    tabKey: 'resources',
    newTags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentDidMount() {
    const { dispatch, detailItem } = this.props;

    const roleId = this.props.match.params.roleId;
    console.log(roleId);
    console.log(detailItem);
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
    // dispatch({
    //   type: 'role/getRoleById',
    //   payload: { roleId: roleId }
    // });
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
      detailItem
    } = this.props;

    const operationTabList = [
      {
        key: 'resources',
        tab: (
          <span>
            资源 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
      {
        key: 'users',
        tab: (
          <span>
            用户 <span style={{ fontSize: 14 }}>(8)</span>
          </span>
        ),
      },
    ];
    const tabContent = {
      resources: 'res',
      users: 'user'
    }

    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={currentUserLoading}>
              {currentUser && Object.keys(currentUser).length ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser.avatar} />
                    <div className={styles.name}>{detailItem.name}</div>
                    <p>{detailItem.description}</p>
                  </div>
                  <Divider dashed />
                  <div className={styles.tags}>
                    <div className={styles.tagsTitle}>标签</div>
                    {currentUser.tags.concat(newTags).map(item => (
                      <Tag key={item.key}>{item.label}</Tag>
                    ))}
                    {inputVisible && (
                      <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                      />
                    )}
                    {!inputVisible && (
                      <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                      >
                        <Icon type="plus" />
                      </Tag>
                    )}
                  </div>
                  <Divider style={{ marginTop: 16 }} dashed />
                </div>
              ) : (
                  'loading...'
                )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
              loading={listLoading}
            >
              {tabContent[tabKey]}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default RoleDetail;
