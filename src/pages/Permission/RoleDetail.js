import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import router from 'umi/router';
import { Card, Radio, Row, Col, Icon, Table, Avatar, Tag, Divider, List, Input } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './RoleDetail.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;


@connect(({ loading, user, role, project }) => ({
  listLoading: loading.effects['list/fetch'],
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  detailItem: role.itemDetail,
  roleUsers: role.roleUsers,
  resTree: role.resTree,
  resTree: role.resTree,
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
    dispatch({
      type: 'role/fetchResTreeByRole',
      payload: { roleId: roleId }
    });
    dispatch({
      type: 'role/fetchRoleUsers',
      payload: { roleId: roleId }
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
      loading,
      resTree,
      projectLoading,
      match,
      location,
      children,
      roleUsers,
      detailItem
    } = this.props;

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: '12%',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        width: '30%',
        key: 'address',
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    const ListContent = ({ data: { mobile, createTime, userName } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>手机号</span>
          <p>{mobile}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>用户名</span>
          <p>{userName}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>创建时间</span>
          <p>{moment(createTime).format('YYYY-MM-DD HH:mm')}</p>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">进行中</RadioButton>
          <RadioButton value="waiting">等待中</RadioButton>
        </RadioGroup>
        <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
      </div>
    );

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
      resources: <Table loading={loading} pagination={false} columns={columns} dataSource={resTree} />,
      users: <div className={styles.standardList}>
        <Card
          className={styles.listCard}
          bordered={false}
          title={'list'}
          style={{ marginTop: 5 }}
          bodyStyle={{ padding: '0 32px 40px 32px' }}
          extra={extraContent}
        >
          <List
            size="large"
            rowKey="id"
            loading={loading}
            pagination={paginationProps}
            dataSource={roleUsers}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.logo} shape="square" size="large" />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={item.remark}
                />
                <ListContent data={item} />
              </List.Item>
            )}
          />
        </Card>
      </div>
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
