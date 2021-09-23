import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button } from "antd";
import { Editor } from '@tinymce/tinymce-react';
import "./index.less";

const RichTextEditor = () => {
  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [content, setContent] = useState(`<p>te</p>
    <table style="border-collapse: collapse; width: 36.004%;" border="1">
    <tbody>
    <tr>
    <td style="width: 48.8604%;">姓名：周周</td>
    <td style="width: 48.8604%;">性别你好</td>
    </tr>
    <tr>
    <td style="width: 48.8604%;">&nbsp;</td>
    <td style="width: 48.8604%;">&nbsp;</td>
    </tr>
    </tbody>
    </table>`);

  // const onEditorStateChange = (editorState) => setEditorState(editorState);

  // useEffect(() => {
  //   const html = '<p>Hey this <strong>editor</strong> 11111111rocks 😀</p>';
  //   const contentBlock = htmlToDraft(html);
  //   if (contentBlock) {
  //     const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
  //     const editorState = EditorState.createWithContent(contentState);
  //     setEditorState(editorState);
  //   }
  // }, []);

  const handleEditorChange = (content, editor) => {
    console.log('Content was updated:', content);
  }

  const printOnNewWindow = () => {
    let printContent = `<p>te</p>
    <table style="border-collapse: collapse; width: 36.004%;" border="1">
    <tbody>
    <tr>
    <td style="width: 48.8604%;">姓名：周周123</td>
    <td style="width: 48.8604%;">性别你好</td>
    </tr>
    <tr>
    <td style="width: 48.8604%;">&nbsp;</td>
    <td style="width: 48.8604%;">&nbsp;</td>
    </tr>
    </tbody>
    </table>`;
    //  console.log(this.waterMark(arr[0]))
    // for (let i = 0; i < arr.length; i++) {
    //   printContent += `<img src=\"${arr[i]}\" width=\"100%\" />`;
    // }
    //判断iframe是否存在，不存在则创建iframe
    let iframe = document.getElementById("print-iframe");
    if (iframe) {
      document.body.removeChild(iframe);
    }
    iframe = document.createElement('IFRAME');
    iframe.setAttribute("id", "print-iframe");
    iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
    document.body.appendChild(iframe);
    let doc = iframe.contentWindow.document;
    doc.write(`<div>${printContent}</div>`);
    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }

  const print = () => {
    window.print();
  }

  return (
    <div>
      <Button type="primary" onClick={printOnNewWindow}>Print</Button>
      <Editor
        inline={false}
        selector='editorStateRef'
        apiKey='razhe3i401ud6ihc0wlba51w4jpcrznir2vjw3baz7401im4'
        // ref='tinyEditor'    
        value={content}
        onEditorChange={handleEditorChange}
        init={{
          height: 500,
          language: 'zh_CN',
          plugins: 'table lists',
          toolbar: `formatselect |  bold italic strikethrough forecolor backcolor 
        alignleft aligncenter alignright alignjustify          
        numlist bullist outdent indent`,
          // file_picker_types: 'file image media',        
          // file_picker_callback: this.file_picker_callback,        
          // automatic_uploads={false}        
          images_upload_url: '',
          image_uploadtab: true,
        }} />

      <Card bordered={false}>
        {/* <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
          localization={{ locale: "zh" }}
        /> */}
      </Card>
    </div>
  );
};

export default RichTextEditor;
