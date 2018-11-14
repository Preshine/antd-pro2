import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Button, Modal, message, Form, Input, TreeSelect, } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';


import styles from './ResourcesTree.less';

const FormItem = Form.Item;

class AddForm extends React.Component {
  state = {
    value: undefined,
  }

  onChange = (value) => {
    // console.log(arguments);
    this.setState({ value });
  }

  render () {
    const { getFieldDecorator, dataSource } = this.props;

    const onChange = function (value, selectedOptions) {
      console.log(value, selectedOptions);
    }
    
    const filter = function (inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    }

    return (<Form layout="vertical">
      <FormItem label="资源名称">
        {getFieldDecorator('name', {
          rules: [{ required: true, message: 'Please input the title of collection!' }],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem label="上级资源">
        {getFieldDecorator('parentId')(
        <TreeSelect
        treeNodeFilterProp="label"
        showSearch
        style={{ width: 300 }}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="请选择..."
        allowClear
        treeData={dataSource}
        onChange={onChange}
        >
        </TreeSelect>
        )}
      </FormItem>
    </Form>);
  }
}

const CreateForm = Form.create()(props => {
  const { modalVisible, form, list, handleAdd, handleModalVisible, confirmLoading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
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
      <AddForm {...form} dataSource={list}/>
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
        name: fields.name,
        parentId: fields.parentId,
      },
      callback: function (msg) {
        this.handleModalVisible(false);
        this.handleModalLoading(false);
        message.success(msg || '添加成功');
        this.setState({
          modalVisible: false,
        });
      }.bind(this)
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleModalLoading = flag => {
    this.setState({
      confirmLoading: !!flag,
    });
  };

  render() {
    const { resources: { list }, loading } = this.props;
    const { modalVisible, confirmLoading } = this.state;

    const parentDataAndMethods = {
      list: list,
      confirmLoading: confirmLoading,
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: '12%',
    }, {
      title: 'Address',
      dataIndex: 'address',
      width: '30%',
      key: 'address',
    }];

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
      <PageHeaderWrapper
        title="资源列表"
        content="展示资源的列表"
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
            <Table loading= {loading} columns={columns} rowSelection={rowSelection} dataSource={list} />
          </div>
        </Card>
        <CreateForm {...parentDataAndMethods}  modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}
