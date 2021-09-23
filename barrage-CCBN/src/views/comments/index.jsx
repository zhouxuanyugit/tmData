import React, { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { submitComments } from '@/api/system';
import imgAdd from "@/assets/images/u8.png";
import './index.less';

const { TextArea } = Input;

const Comments = () => {
  const [value, setValue] = useState('');

  useEffect(() => {
    document.title = "内容评论";
  }, [])

  const onChange = e => {
    setValue(e.target.value)
  };

  const handleSubmit = async () => {
    if (!value) {
      message.error('评论内容不能为空！');
      return
    }
    try {
      await submitComments({ content: value });
      message.success('评论提交成功，请等待审核！');
      setValue('');
    } catch (error) {
      message.error('网络错误，稍后再试！');
    }
  }

  return (
    <div>
      <div className="comments-img-container">
        <img src={imgAdd} alt="img" className="comments-img" />
      </div>
      <div className="comments-form">
        <div>我要评论</div>
        <div className="textarea">
          <TextArea
            showCount
            maxLength={30}
            autoSize={{ minRows: 4 }}
            value={value}
            onChange={onChange} />
        </div>
        <div className="btn">
          <Button
            type="primary"
            block
            onClick={handleSubmit}
          >
            提交评论
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Comments;