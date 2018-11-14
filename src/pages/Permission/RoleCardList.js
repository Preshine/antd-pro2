import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'dva';
import {
  Card, Form, Select, Tree, Modal, Input, Button, Icon, Switch,
  Tooltip, List
} from 'antd';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './RoleCardList.less';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const { TextArea } = Input;
const SelectOption = Select.Option;


@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
class RoleCardList extends PureComponent {

  state = { visible: false, treeVisible: false };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetch',
      payload: {
        count: 8,
      },
    });
    dispatch({
      type: 'role/fetchResTree'
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showTreeModal = item => {
    this.setState({
      treeVisible: true,
      current: item,
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
      treeVisible: false,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue); return;
      fieldsValue.status = fieldsValue.status ? 1 : 0;
      dispatch({
        type: 'role/submit',
        payload: { id, ...fieldsValue },
      });
    });
  };

  handleDelete = item => {
    Modal.confirm({
      maskClosable: true,
      title: '删除角色',
      content: '确定删除该角色吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        return;
        dispatch({
          type: 'role/delete',
          payload: { id: item.id },
        });
      },
    });
  }

  handleStatus = item => {
    const { dispatch, form } = this.props;
    return;
    dispatch({
      type: 'role/handleStatus',
      payload: { id: item.id, status: item.status == 1 ? 0 : 1 },
    });

  }

  render() {
    const {
      role: { list, treeList },
      loading,
      form: { getFieldDecorator },
    } = this.props;


    const { visible, treeVisible, current = {} } = this.state;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          Preshine：快来添加角色吧。
        </p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
            快速开始
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
            产品简介
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
            产品文档
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );

    const getModalContent = () => {
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="角色名称" {...this.formLayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入角色名称' }],
              initialValue: current.name,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="开启角色" {...this.formLayout}>
            {getFieldDecorator('status', {
              initialValue: current.status ? !!current.status : true,
              valuePropName: 'checked'
            })(<Switch />)}
          </FormItem>
          <FormItem
            {...this.formLayout}
            label={
              <span>
                克隆角色
                  <em className={styles.optional}>
                  （选填）
                    <Tooltip title="将生成与选择的角色一致的资源访问权限">
                    <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                  </Tooltip>
                </em>
              </span>
            }
          >
            {getFieldDecorator('target')(
              <Select
                showSearch
                placeholder="请选择"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <SelectOption value="admin">admin</SelectOption>
                <SelectOption value="commoner">commoner</SelectOption>
                <SelectOption value="saler">saler</SelectOption>
              </Select>,
            )}
          </FormItem>
          <FormItem {...this.formLayout} label="角色描述">
            {getFieldDecorator('description', {
              rules: [{ message: '请输入至少五个字符的角色描述！', min: 5 }],
              initialValue: current.description,
            })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
          </FormItem>
        </Form>
      );
    };

    const getResTree = () => {
      const onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
          expandedKeys,
          autoExpandParent: false,
        });
      }

      const onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
      }

      const onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
      }

      const renderTreeNodes = (data) => {
        return data.map((item) => {
          if (item.children) {
            return (
              <TreeNode title={item.name} key={item.key} dataRef={item}>
                {renderTreeNodes(item.children)}
              </TreeNode>
            );
          }
          return <TreeNode title={item.name} key={item.key} dataRef={item} />;
        });
      }

      return (
        <Tree
          checkable
          onExpand={onExpand}
          expandedKeys={this.state.expandedKeys}
          autoExpandParent={this.state.autoExpandParent}
          onCheck={onCheck}
          checkedKeys={this.state.checkedKeys}
          onSelect={onSelect}
          selectedKeys={this.state.selectedKeys}
        >
          {renderTreeNodes(treeList)}
        </Tree>
      );

    };

    return (
      <PageHeaderWrapper title="角色列表" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...list]}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card hoverable className={styles.card}
                    actions={[
                      <Tooltip title="编辑">
                        <a href="javascript:void(0)"
                          onClick={e => {
                            e.preventDefault();
                            this.showEditModal(item);
                          }} >
                          <Icon type="form" />
                          &nbsp;&nbsp;编辑
                        </a>
                      </Tooltip>,
                      <Tooltip title="分配资源">
                        <a href="javascript:void(0)" onClick={() => this.showTreeModal(item)} >
                          <Icon type="edit" />
                          &nbsp;&nbsp;分配资源
                        </a>
                      </Tooltip>,
                      <Tooltip title="禁用">
                        <a href="javascript:void(0)" onClick={() => this.handleStatus(item)} >
                          <Icon type={item.status == 1 ? 'lock' : 'unlock'} />
                          &nbsp;&nbsp;{item.status == 1 ? '禁用' : '启用'}
                        </a>
                      </Tooltip>,
                      <Tooltip title="删除">
                        <a href="javascript:void(0)" onClick={() => this.handleDelete(item)} >
                          <Icon type="delete" />
                          &nbsp;&nbsp;删除
                        </a>
                      </Tooltip>
                    ]}
                  >
                    <Card.Meta
                      // avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                      title={<a>{item.name}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.description}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                  <List.Item>
                    <Button type="dashed"
                      className={styles.newButton}
                      onClick={this.showModal}
                      ref={component => {
                        /* eslint-disable */
                        this.addBtn = findDOMNode(component);
                        /* eslint-enable */
                      }}
                    >
                      <Icon type="plus" /> 新增角色
                  </Button>
                  </List.Item>
                )
            }
          />
        </div>
        <Modal
          title={`角色${current ? '编辑' : '添加'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...{ okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel }}
        >
          {getModalContent()}
        </Modal>
        <Modal
          title='角色分配资源'
          className={styles.standardListForm}
          width={640}
          bodyStyle={{ padding: '28px 0 0' }}
          destroyOnClose
          visible={treeVisible}
          {...{ okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel }}
        >
          {getResTree()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default RoleCardList;
