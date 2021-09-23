/**
 * 电话验证11位数字
 * @param {}} phoneNumber 
 */
const phoneValidator = (phoneNumber) => {
  if (/^1[3|4|5|7|8]\d{9}$/.test(phoneNumber)) {
    return true;
  }
  return false;
}
/**
 * 银行卡验证16-19位数字
 * @param {*} number 
 */
const bankAccountValidator = (number) => {
  if (/^([1-9]{1})(\d{15}|\d{18})$/.test(number)) {
    return true;
  }
  return false;
}

export {
  phoneValidator,
  bankAccountValidator
}