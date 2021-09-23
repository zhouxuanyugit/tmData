import moment from 'moment';

const formartMoney = (money: any) => money && (money.toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ','); //格式化钱
const uniqueArr = (arr: any) => Array.from(new Set(arr)); //数组去重
const getPathByMenu = (menu: any) => { //登陆刚进来时 根据权限设置初始路由
  if (menu.indexOf('0-0') > -1) {
    return '/family/index';
  }
  if (menu.indexOf('0-1') > -1) {
    return '/task/type';
  }
  if (menu.indexOf('0-2') > -1) {
    return '/task/list';
  }
  if (menu.indexOf('0-3') > -1) {
    return '/charge/type';
  }
  if (menu.indexOf('0-4') > -1) {
    return '/charge/reimburse';
  }
  if (menu.indexOf('0-5') > -1) {
    return '/charge/pay';
  }
  if (menu.indexOf('0-6') > -1) {
    return '/charge/cashout';
  }
  if (menu.indexOf('0-7') > -1) {
    return '/system/role';
  }
  if (menu.indexOf('0-8') > -1) {
    return '/system/user';
  }
  if (menu.indexOf('0-9') > -1) {
    return '/system/externalUser';
  }
}

// 根据某个属性值从MenuList查找拥有该属性值的menuItem
const getMenuItemInMenuListByProperty = (menuList: any, key: any, value: any) => {
  let stack: any = [];
  stack = stack.concat(menuList);
  let res;
  while (stack.length) {
    let cur = stack.shift();
    if (cur.children && cur.children.length > 0) {
      stack = cur.children.concat(stack);
    }
    if (value === cur[key]) {
      res = cur;
    }
  }
  return res;
}

const categoryByCreateTime = (fileList: any) => {
  // 时间戳改成字符串日期
  fileList.forEach((ele: any) => {
    ele.create_time = moment(ele.create_time * 1000).format('YYYY-MM-DD')
  });

  // 收集所有时间日期
  const dateList: any = [];
  fileList.forEach((ele: any) => {
    dateList.push(ele.create_time);
  })

  // 日期去重
  const dateUniq = [...new Set(dateList)];

  // 根据去重的日期来分类
  const resultList: any = [];
  dateUniq.forEach(ele => {
    const someDay: any = {};
    const items: any = [];
    someDay.date = ele;
    fileList.forEach((fEle: any) => {
      if (fEle.create_time === ele) {
        items.push(fEle);
      }
    })
    someDay.urls = items;
    resultList.push(someDay);
  })

  return resultList;
}

const randomString = () => {
  let len = 16;
  let $chars =
    'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

export {
  formartMoney,
  uniqueArr,
  getPathByMenu,
  getMenuItemInMenuListByProperty,
  categoryByCreateTime,
  randomString
}
