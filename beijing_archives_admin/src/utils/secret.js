import CryptoJS from "crypto-js";
import { getToken } from "@/utils/auth";

/**
 *  加密算法
 * @param {Object} data 
 * @returns 
 */
const encryption = (data) => {
  const token = getToken();
  const str = token ? token.substr(0, 16) : 'beijindangantmgc';
  // 十六位十六进制数作为密钥
  const key = CryptoJS.enc.Utf8.parse(str);
  // 十六位十六进制数作为密钥偏移量
  const iv = CryptoJS.enc.Utf8.parse(str);

  let endData = JSON.stringify(data);
  let encryptResult = CryptoJS.AES.encrypt(endData, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return encryptResult.ciphertext.toString();
}

/**
 *  解密算法
 * @param {Object} data 
 * @returns 
 */
const decryption = (data) => {
  const token = getToken();
  const str = token ? token.substr(0, 16) : 'beijindangantmgc';
  // 十六位十六进制数作为密钥
  const key = CryptoJS.enc.Utf8.parse(str);
  // 十六位十六进制数作为密钥偏移量
  const iv = CryptoJS.enc.Utf8.parse(str);

  let baseResult = CryptoJS.enc.Hex.parse(data);
  let ciphertext = CryptoJS.enc.Base64.stringify(baseResult);
  let decryptResult = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  let resData = decryptResult.toString(CryptoJS.enc.Utf8).toString();

  return JSON.parse(resData);
}

export {
  encryption,
  decryption
}

