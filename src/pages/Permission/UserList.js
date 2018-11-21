import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Tag, 
  Row,
  Col,
  Card,
  Form,
  Tooltip,
  Input,
  Select,
  Icon,
  Button,
  Modal,
  message,
  Badge,
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './UserList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['女', '男', '保密', '异常'];



const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const prefixSelector = form.getFieldDecorator('prefix', {
    initialValue: '86',
  })(
    <Select style={{ width: 70 }}>
      <Option value="86">+86</Option>
      <Option value="87">+87</Option>
    </Select>
  );
  return (
    <Modal
      destroyOnClose
      title="新建用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}
        label="用户名"
      >
        {form.getFieldDecorator('userName', {
          rules: [{ required: true, message: '填写正确的用户名!' }],
        })(
          <Input style={{ width: '100%' }} />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}
        label="手机号"
      >
        {form.getFieldDecorator('mobile', {
          rules: [{ required: true, message: '填写正确的手机号!' }],
        })(
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}
        label="邮箱"
      >
        {form.getFieldDecorator('email', {
          rules: [{
            type: 'email', message: '填写正确的邮箱地址',
          }, {
            required: true, message: '填写邮箱地址',
          }],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}
        label="性别"
      >
        {form.getFieldDecorator('sex', {
          initialValue: 2
        })(
          <RadioGroup >
            <Radio value={1}>男</Radio>
            <Radio value={0}>女</Radio>
            <Radio value={2}>保密</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}
        label={(
          <span>
            用户描述&nbsp;
              <Tooltip title="用户的个人描述信息">
              <Icon type="question-circle-o" />
            </Tooltip>
          </span>
        )}
      >
        {form.getFieldDecorator('remark')(
          <TextArea rows={4} placeholder="输入用户的描述信息" />
        )}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  okHandle = () => {
    const { form, handleUpdateModalVisible, values, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log('values', values);
      console.log('fieldsValue', fieldsValue);
      dispatch({
        type: 'rule/saveRole',
        payload: { userId: values.id, roleIds: fieldsValue.roleIds.join(',') }
      });
      handleUpdateModalVisible();
      message.success('角色分配成功');
    });
  };

  renderContent = (formVals) => {
    console.log('formVals', formVals);
    const { form, roleList, dispatch } = this.props;
    // dispatch({
    //   type: 'role/fetch',
    // });
    const children = [];
    roleList.forEach(role => {
      children.push(<Option key={role.id}>{role.name}</Option>);
    });
    return [
      <FormItem key="roles" {...this.formLayout} label="选择角色">
        {form.getFieldDecorator('roleIds', {
          initialValue: (formVals && formVals.roleIds) ? formVals.roleIds.split(',') : [],
        })(
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="选择角色..."
          >
            {children}
          </Select>
        )}
      </FormItem>,
    ];
  };

  renderFooter = () => {
    const { handleUpdateModalVisible } = this.props;

    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={this.okHandle}>
        提交
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    console.log('formVals is :', values);
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="分配角色"
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateModalVisible()}
      >

        {this.renderContent(values)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ rule, role, loading }) => ({
  rule,
  role,
  loading: loading.models.rule,
}))
@Form.create()
class UserList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    formVals: {},
  };

  columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
    },
    {
      title: '手机号',
      needTotal: true,
      dataIndex: 'mobile',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      filters: [
        {
          text: '男',
          value: 1,
        },
        {
          text: '女',
          value: 0,
        },
        {
          text: '保密',
          value: 2,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '身份角色',
      dataIndex: 'roleNames',
      render(val) {
        let roles = val.split(',');
        const tagColor = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
        let tags = [], endTag = roles.length > 5;
        if (roles.length > 0) {

          if (endTag) {
            roles = roles.splice(0, 5);
          }
          tags = roles.map((role, i) => <Tag color={tagColor[i]}>{role}</Tag>);
          if (endTag) {
            tags.push(<Tag color={tagColor[5]}>. . .</Tag>);
          }
        }
        return tags;
      }
    },
    {
      title: '创建用户时间',
      dataIndex: 'createTime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>配置角色</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
    });
    dispatch({
      type: 'role/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order.substr(0, sorter.order.length - 3)}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };


  deleteUsers = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    dispatch({
      type: 'rule/delete',
      payload: {
        ids: selectedRows.map(row => row.id).join(),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      formVals: record || {},
    });
  };


  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: fields
    });

    message.success('添加成功');
    this.handleModalVisible();
  };


  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('userName')(<Input placeholder="请输入用户名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('mobile')(<Input placeholder="请输入手机号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('userName')(<Input placeholder="请输入用户名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机号">
              {getFieldDecorator('mobile')(<Input placeholder="请输入手机号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="性别">
              {getFieldDecorator('sex')(
                <Select placeholder="请选择性别" style={{ width: '100%' }}>
                  <Option value="1">男</Option>
                  <Option value="0">女</Option>
                  <Option value="2">保密</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="邮箱">
              {getFieldDecorator('email')(<Input placeholder="请输入邮箱" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="真实姓名">
              {getFieldDecorator('realName')(<Input placeholder="请输入真实姓名" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      rule: { data },
      role: { list: roleList },
      loading,
      dispatch
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, formVals } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };
    return (
      <PageHeaderWrapper title="用户列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.deleteUsers}>删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              rowKey="id"
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {formVals && Object.keys(formVals).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={formVals}
            roleList={roleList}
            dispatch={dispatch}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default UserList;
