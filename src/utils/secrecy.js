import smCrypto from 'sm-crypto';
const sm2 = smCrypto.sm2;
const sm4 = smCrypto.sm4;

const publicKey =
  '04be084f151082dfaadafe1dd8936ae7d5e9ee810eb18b182e83c50e568aefa4f4fbc547c4eb4355329c2bdfa3f60db54c3c2a126f38328534f45e88bc06b4411c';

//转字节数组

let str = 'MatPublic#123%@!';
let key = []; // 可以为 16 进制串或字节数组，要求为 128 比特
for (let i = 0; i < str.length; i++) {
  key.push(str.charCodeAt(i));
}

//sm2加密
export const doEncrypt = (msgString) => {
  return sm2.doEncrypt(msgString, publicKey);
};

// sm4加密;
export const encryptData = (msgString) => {
  return sm4.encrypt(msgString, key);
};

//sm4解密
export const decryptData = (msgString) => {
  return sm4.decrypt(msgString, key);
};
