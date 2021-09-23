import React, { useState } from "react";
import { Form, Input, Modal, Descriptions, message, Upload, Button } from "antd";
import { connect } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import { getAliyunToken } from "@/api/public";
import moment from 'moment';
import AliOss from 'ali-oss';
const { TextArea } = Input;

const FinishPay = ({ token, name, id, visible, onCancel, onOk, confirmLoading, finishPayInfo }) => {
  const [dataObj, setDataObj] = useState({
    sts_info: {
      SecurityToken: '',
      AccessKeyId: '',
      AccessKeySecret: '',
    },
    bucket: '',
    cdn: '',
    region_id: '',
  })
  const [fileList, setFileList] = useState([]);
  const [payFileList, setPayFileList] = useState([]);
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const beforeUpload = (file) => {
    if (!file.size) {
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 20
    if (
      file.type !== 'application/msword' &&
      file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
      file.type !== 'application/pdf' &&
      file.type !== 'image/jpeg' &&
      file.type !== 'image/png' &&
      file.type !== 'image/jpg'
    ) {
      message.error('请上传正确文件格式!')
      return false;
    } else if (!isLt2M) {
      message.error('上传图片大小不能超过 20MB!')
      return false;
    }
    return new Promise((resolve, reject) => {
      getAliyunToken().then(response => {
        setDataObj(response.data);
        resolve(true);
      }).catch(err => {
        reject(false);
      })
    });
  };
  const customRequest = ({ onSuccess, onError, file, onProgress }) => {
    const client = new AliOss({
      region: 'oss-' + dataObj.region_id,
      accessKeyId: dataObj.sts_info.AccessKeyId,
      accessKeySecret: dataObj.sts_info.AccessKeySecret,
      bucket: dataObj.bucket,
      stsToken: dataObj.sts_info.SecurityToken
    });
    const random_name = `${moment().format('YYYYMMDD')}/${file.name.split('.')[0]}-${moment().unix()}.${file.name.split('.')[1]}`;
    client.multipartUpload(random_name, file,
      {
        progress: function (p) { //获取进度条的值
          onProgress({ percent: p });
        },
      }).then(
        result => {
          console.log(result, `${dataObj.cdn}/${result.name}`);
          onSuccess(result);
        }).catch(err => {
          onError(err)
        })
  };
  const props = {
    headers: {
      'token': token,
    },
    data: dataObj,
    fileList,
    showUploadList: { showRemoveIcon: false, showDownloadIcon: false },
    customRequest: customRequest,
    beforeUpload: beforeUpload,
    onChange: (info) => {
      if (info.file.status !== 'uploading') {
      }
      if (info.file.status === 'done') {
        let fileObj = {
          "file_type": info.file.type === 'image/jpeg' || info.file.type === 'image/png' ? 1 : 3,
          "file_name": info.file.name,
          "file_url": `${dataObj.cdn}/${info.file.response.name}`,
          "file_size": (info.file.size / 1024 / 1024).toFixed(2),
          "file_time": moment().unix(),
          "admin_id": id,
          "admin_name": name
        }
        let payFileListTemp = [...payFileList];
        payFileListTemp.push(fileObj);
        setPayFileList(payFileListTemp);
        message.success(`${info.file.name} 文件上传成功！`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败！`);
      }
      setFileList(info.fileList.filter(file => !!file.status));
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    }
  };
  return (
    <Modal
      title="完成付费"
      maskClosable={false}
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            values.payment_attachment = JSON.stringify(payFileList);
            onOk({ ...values });
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
      confirmLoading={confirmLoading}
      width={700}
    >
      <Descriptions title="收款方联系人" column={2}>
        <Descriptions.Item label="姓名">{finishPayInfo.accept_contact ? finishPayInfo.accept_contact : '-'}</Descriptions.Item>
        <Descriptions.Item label="电话">{finishPayInfo.accept_mobile ? finishPayInfo.accept_mobile : '-'}</Descriptions.Item>
      </Descriptions>
      <Descriptions title="收款账户信息" column={2}>
        <Descriptions.Item label="单位">{finishPayInfo.accept_company ? finishPayInfo.accept_company : '-'}</Descriptions.Item>
        <Descriptions.Item label="开户行">{finishPayInfo.accept_bank ? finishPayInfo.accept_bank : '-'}</Descriptions.Item>
        <Descriptions.Item label="账号">{finishPayInfo.accept_account ? finishPayInfo.accept_account : '-'}</Descriptions.Item>
      </Descriptions>
      <Descriptions title="打款信息" column={2}>
      </Descriptions>
      <Form
        form={form}
        {...formItemLayout}
      >
        <Form.Item
          label="银行流水号:"
          name="payment_bank_id"
        >
          <Input placeholder="请输入银行流水号" maxLength={30} />
        </Form.Item>
        <Form.Item
          label="备注:"
          name="payment_remark">
          <TextArea rows={4} showCount maxLength={300} />
        </Form.Item>
        <Form.Item
          label="附件上传:">
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>上传文件</Button>
          </Upload>
          <span style={{ color: '#ccc' }}>支持扩展名：.doc .docx .pdf .jpg .png</span>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default connect((state) => state.user, null)(FinishPay);
