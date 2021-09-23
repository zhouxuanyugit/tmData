import moment from 'moment';

const formartMoney = (money) => money && (money.toFixed(2) + '').replace(/\B(?=(\d{3})+(?!\d))/g, ','); //格式化钱
const uniqueArr = (arr) => Array.from(new Set(arr)); //数组去重
const getPathByMenu = (menu) => { //登陆刚进来时 根据权限设置初始路由
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
const getMenuItemInMenuListByProperty = (menuList, key, value) => {
  let stack = [];
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

const categoryByCreateTime = (fileList) => {
  // 时间戳改成字符串日期
  fileList.forEach(ele => {
    ele.create_time = moment(ele.create_time * 1000).format('YYYY-MM-DD')
  });

  // 收集所有时间日期
  const dateList = [];
  fileList.forEach(ele => {
    dateList.push(ele.create_time);
  })

  // 日期去重
  const dateUniq = [...new Set(dateList)];

  // 根据去重的日期来分类
  const resultList = [];
  dateUniq.forEach(ele => {
    const someDay = {};
    const items = [];
    someDay.date = ele;
    fileList.forEach(fEle => {
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

const debounce = (fn, wait, time) => {
  var previous = null // 记录上一次运行的时间
  var timer = null
  return function () {
    var now = +new Date()
    if (!previous) previous = now
    // 当上一次执行的时间与当前的时间差大于设置的执行间隔时长的话，就主动执行一次
    if (now - previous > time) {
      clearTimeout(timer)
      fn()
      previous = now // 执行函数后，马上记录当前时间
    } else { // 否则重新开始新一轮的计时
      clearTimeout(timer)
      timer = setTimeout(function () {
        fn()
      }, wait)
    }
  }
}

const throttle = (fn, time) => {
  let _self = fn
  let timer = ''
  let firstTime = true // 记录是否是第一次执行的flag

  return function () {
    let args = arguments // 解决闭包传参问题
    let _me = this // 解决上下文丢失问题

    if (firstTime) { // 若是第一次，则直接执行
      _self.apply(_me, args)
      firstTime = false
      return
    }
    if (timer) { // 定时器存在，说明有事件监听器在执行，直接返回
      return false
    }

    timer = setTimeout(function () {
      clearTimeout(timer)
      timer = null
      _self.apply(_me, args)
    }, time || 500)
  }
}

export {
  formartMoney,
  uniqueArr,
  getPathByMenu,
  getMenuItemInMenuListByProperty,
  categoryByCreateTime,
  randomString,
  debounce,
  throttle
}
