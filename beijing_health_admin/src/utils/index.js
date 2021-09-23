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
//百度坐标转高德（传入经度、纬度）
const bgps_gps = (bd_lng, bd_lat) => {
  let X_PI = Math.PI * 3000.0 / 180.0;
  let x = bd_lng - 0.0065;
  let y = bd_lat - 0.006;
  let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  let gg_lng = z * Math.cos(theta);
  let gg_lat = z * Math.sin(theta);
  return { lng: gg_lng, lat: gg_lat }
}
//高德坐标转百度（传入经度、纬度）
function gps_bgps(gg_lng, gg_lat) {
  var X_PI = Math.PI * 3000.0 / 180.0;
  var x = gg_lng, y = gg_lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
  var bd_lng = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return {
      bd_lat: bd_lat,
      bd_lng: bd_lng
  };
}

export {
  formartMoney,
  uniqueArr,
  getPathByMenu,
  bgps_gps,
  gps_bgps
}
