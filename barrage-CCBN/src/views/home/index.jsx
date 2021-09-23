import React, { useEffect } from 'react';
import { getBarrageCommentsList } from '@/api/system';
import BulletScreen from 'rc-bullets';
import './index.less';

let screenObj = null;
let timer = null;

const Bullets = () => {
  useEffect(() => {
    // 给页面中某个元素初始化弹幕屏幕，一般为一个大区块。此处的配置项全局生效
    screenObj = new BulletScreen('.screen', {
      duration: 20,
      loopCount: 1,
    });
    getBullets(0);

    return () => {
      clearTimeout(timer);
    }
  }, []);
  const getBullets = async (id) => {
    try {
      const result = await getBarrageCommentsList({ id });
      if (id) {
        screenObj.push(<span style={{color: '#fff', fontSize: '42px'}}>{result.data.content}</span>);
      }
      clearTimeout(timer);
      timer = null;
      timer = setTimeout(() => {
        // 递归请求下一个弹幕
        getBullets(result.data.id);
      }, 2000);
    } catch (error) {
      // 递归请求下一个弹幕
      // TODO: 存在服务器短线的可能，最好使用websocket长连接
      getBullets(0);
    }
  }
  return (
    <main>
      <div className="screen"></div>
    </main>
  );
}

export default Bullets