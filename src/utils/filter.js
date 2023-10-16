import moment from 'moment';
import 'moment/locale/zh-cn';
import Vue from 'vue';
import * as dictMap from './dict';
moment.locale('zh-cn');
Vue.filter('NumberFormat', function (value) {
  if (!value) {
    return '0';
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); // 将整数部分逢三一断
  return intPartFormat;
});

Vue.filter('BooleanFormat', function (value) {
  if (value == null) {
    return '';
  }
  if (value === true || value === 'true') {
    return '是';
  }
  if (value === false || value === 'false') {
    return '否';
  }
  return '';
});

Vue.filter('moment', function (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern);
});

export const filterDict = (dataStr, arr) => {
  if (typeof arr == 'String') arr = dictMap[arr] || [];
  return arr?.find((item) => item.value == dataStr)?.label;
};

Vue.filter('dict', filterDict);
