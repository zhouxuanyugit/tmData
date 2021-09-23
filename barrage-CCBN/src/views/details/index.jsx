import React, { useState, useEffect } from 'react';
import {
  Button
} from "antd";
import {
  getSessionStorage
} from '@/utils/auth';
import {
  getDetails
} from '@/api/system';
import './index.less';

const Details = () => {
  const [url, setUrl] = useState(getSessionStorage('url'));
  const [html, setHtml] = useState('');
  const [size, setSize] = useState(14);

  useEffect(() => {
    getDetails(url, {}).then((res) => {
      setHtml(res);
    })
  }, []);

  const handleZoomIn = (e) => {
    e.preventDefault();
    if (size === 12) {
      return;
    }
    setSize(size - 2);
  }

  const handleZoomOut = (e) => {
    e.preventDefault();
    if (size === 30) {
      return;
    }
    setSize(size + 2);
  }

  return (
    <div className="detials-container">
      <header className="app-header">
        <div className="header-container">
          <div className="logo">
            logo
          </div>
          <div className="selection-header">
            <Button type="link" className="ant-dropdown-link" disabled={size === 12} onClick={e => handleZoomIn(e)}>
              -A
            </Button>
            <Button type="link" className="ant-dropdown-link" disabled={size === 30} onClick={e => handleZoomOut(e)}>
              +A
            </Button>
          </div>
        </div>
      </header>
      <div className="details-html" style={{ fontSize: `${size}px` }} dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  )
}

export default Details;

