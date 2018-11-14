import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Table,
  Divider,
  Select,
  Popconfirm,
  Card,
  Button,
  Modal,
  message,
  Form,
  Input,
  TreeSelect,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './ResourcesTree.less';

const FormItem = Form.Item;

class AddForm extends React.Component {
  state = {
    value: undefined,
  };

  onChange = value => {
    // console.log(arguments);
    this.setState({ value });
  };

  render() {
    const { getFieldDecorator, dataSource, currentRecord } = this.props;
    const onChange = function(value, selectedOptions) {
      console.log(value, selectedOptions);
    };

    const filter = function(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    };

    return (
      <Form layout="vertical">
        <FormItem label="上级资源">
          {getFieldDecorator('parentId', {
            initialValue: (currentRecord && currentRecord.parentId) || '',
          })(
            <TreeSelect
              treeNodeFilterProp="label"
              showSearch
              value={this.state.value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择上级资源..."
              allowClear
              treeData={dataSource}
              onChange={onChange}
            />
          )}
        </FormItem>
        <FormItem label="资源名称">
          {getFieldDecorator('name', {
            initialValue: (currentRecord && currentRecord.name) || '',
            rules: [{ required: true, message: '填写资源名称' }],
          })(<Input placeholder="填写资源名称" />)}
        </FormItem>
        <FormItem label="var1">
          {getFieldDecorator('var1', {})(<Input placeholder="填写资源扩展属性1" />)}
        </FormItem>
        <FormItem label="var2">
          {getFieldDecorator('var2', {})(<Input placeholder="填写资源扩展属性2" />)}
        </FormItem>
        <FormItem label="var3">
          {getFieldDecorator('var3', {})(<Input placeholder="填写资源扩展属性3" />)}
        </FormItem>
        <FormItem label="资源类型">
          {getFieldDecorator('resType', {
            rules: [{ required: true, message: '选择资源类型' }],
          })(
            <Select defaultValue="menu">
              <Option value="menu">菜单</Option>
              <Option value="button">按钮</Option>
              <Option value="element" disabled>
                元素
              </Option>
              <Option value="controller">控制器</Option>
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    list,
    currentRecord,
    handleAdd,
    handleModalVisible,
    confirmLoading,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建资源"
      maskClosable={false}
      visible={modalVisible}
      onOk={okHandle}
      okText="添加"
      confirmLoading={confirmLoading}
      onCancel={() => handleModalVisible()}
    >
      <AddForm {...form} dataSource={list} currentRecord={currentRecord} />
    </Modal>
  );
});

@connect(({ resources, loading }) => ({
  resources,
  loading: loading.models.resources,
}))
export default class ResourcesTree extends PureComponent {
  state = {
    modalVisible: false,
    confirmLoading: false,
    currentRecord: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resources/fetch',
    });
  }

  handleAdd = fields => {
    this.handleModalLoading(true);
    this.props.dispatch({
      type: 'resources/add',
      payload: {
        ...fields,
      },
      callback: function(msg) {
        this.handleModalVisible(false);
        this.handleModalLoading(false);
        message.success(msg || '添加成功');
        this.setState({
          modalVisible: false,
        });
      }.bind(this),
    });
  };

  handleDelete = id => {
    this.props.dispatch({
      type: 'resources/delete',
      payload: id,
      callback: function(msg) {
        message.success(msg || '删除成功');
      }.bind(this),
    });
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      currentRecord: record,
    });
  };

  handleModalLoading = flag => {
    this.setState({
      confirmLoading: !!flag,
    });
  };

  render() {
    const {
      resources: { list },
      loading,
    } = this.props;
    const { modalVisible, confirmLoading, currentRecord } = this.state;

    const parentDataAndMethods = {
      list: list,
      currentRecord,
      confirmLoading,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

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
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={() => this.handleModalVisible(true, record)}>
              Edit
            </a>
            <Divider type="vertical" />
            <Popconfirm title="确认要删除?" onConfirm={() => this.handleDelete(record.id)}>
              <a href="javascript:;">Delete</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    // rowSelection objects indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };

    return (
      // <PageHeaderWrapper
      //   title="资源列表"
      //   content="展示资源的列表"
      // >
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true, {})}>
              新建资源
            </Button>
          </div>
          <Table loading={loading} pagination={false} columns={columns} dataSource={list} />
        </div>
        <CreateForm {...parentDataAndMethods} modalVisible={modalVisible} />
      </Card>
      //</PageHeaderWrapper>
    );
  }
}
