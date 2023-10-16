import moment from 'moment';

export function timeFix() {
  const time = new Date();
  const hour = time.getHours();
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好';
}

export function welcome() {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了'];
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents');
  event.initEvent('resize', true, true);
  event.eventType = 'message';
  window.dispatchEvent(event);
}

export function handleScrollHeader(callback) {
  let timer = 0;

  let beforeScrollTop = window.pageYOffset;
  callback = callback || function () {};
  window.addEventListener(
    'scroll',
    (event) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        let direction = 'up';
        const afterScrollTop = window.pageYOffset;
        const delta = afterScrollTop - beforeScrollTop;
        if (delta === 0) {
          return false;
        }
        direction = delta > 0 ? 'down' : 'up';
        callback(direction);
        beforeScrollTop = afterScrollTop;
      }, 50);
    },
    false
  );
}

export function isIE() {
  const bw = window.navigator.userAgent;
  const compare = (s) => bw.indexOf(s) >= 0;
  const ie11 = (() => 'ActiveXObject' in window)();
  return compare('MSIE') || ie11;
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = '', timeout = 1500) {
  if (id === '') {
    return;
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id));
  }, timeout);
}
export function scorePassword(pass) {
  let score = 0;
  if (!pass) {
    return score;
  }
  // award every unique letter until 5 repetitions
  const letters = {};
  for (let i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1;
    score += 5.0 / letters[pass[i]];
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass),
  };

  let variationCount = 0;
  for (var check in variations) {
    variationCount += variations[check] === true ? 1 : 0;
  }
  score += (variationCount - 1) * 10;

  return parseInt(score);
}

/**
 * 获取表格的body高度
 * @param {*} extraHeight 额外的高度(分页组件等，不传默认 42)
 */
export function getTableScroll(extraHeight = 42) {
  // 版权信息所占高度
  const copyrightHeight = 74;
  let tHeader = null;
  tHeader = document.getElementsByClassName('ant-table-thead')[0];
  // 表格内容距离顶部的距离
  let tBodyToTop = 0;
  if (tHeader) {
    tBodyToTop = tHeader.getBoundingClientRect().bottom;
  }
  // 窗体高度-表格内容顶部的高度-额外的高度-版权信息高度
  return `calc(100vh - ${tBodyToTop + extraHeight + copyrightHeight}px)`;
}

/**
 * @description 获取传入日期所在月份的 日期列表
 * @param {string | date} date 获取此日期所在的月份
 * @param {string} format 日期格式
 * @param {string | date} fromDate 开始日期, 不传则从第一天开始
 */
export function getMonthDateList({ date, format = 'YYYY-MM-DD', fromDate } = {}) {
  // 月天数
  // let days = moment(date).daysInMonth()
  // 月首日
  let firstDate = moment(date || fromDate)
    .startOf('month')
    .format(format);
  // 月尾日
  let lastDate = moment(date || fromDate)
    .endOf('month')
    .format(format);
  // 从哪天开始计算
  fromDate = fromDate || firstDate;
  let diff = moment(lastDate).diff(moment(fromDate), 'days') + 1;

  return Array.from({ length: diff }).map((item, index) => moment(fromDate).add(index, 'days').format(format));
}

const diffTypeMap = {
  day: {
    diffType: 'days',
    format: 'YYYY-MM-DD',
  },
  month: {
    diffType: 'months',
    format: 'YYYY-MM',
  },
  year: {
    diffType: 'years',
    format: 'YYYY',
  },
};
/**
 * @description 获取2个时间之间 时间列表
 * @param {string | date} start 开始时间
 * @param {string | date} end 结束时间
 * @param {string} type 类型 day | month | year
 * @param {string} format 日期格式
 */
export function getDiffTimeList({ start, end, type = 'day', format }) {
  if (!start || !end) return [];
  let diffType = diffTypeMap[type]?.diffType || 'days';
  format = format || diffTypeMap[type]?.format || 'YYYY-MM-DD';
  let diff = moment(end).diff(moment(start), diffType) + 1;
  return Array.from({ length: diff }).map((item, index) => moment(start).add(index, diffType).format(format));
}

/**
 * @description 获取2个月份之间月份列表
 * @param {string | date} start 开始月份
 * @param {string | date} end 结束月份
 * @param {string} format 日期格式
 */
export function getMonthList({ start, end, format = 'YYYY-MM' } = {}) {
  if (!start || !end) return [];
  let diff = moment(end).diff(moment(start), 'months') + 1;
  return Array.from({ length: diff }).map((item, index) => moment(start).add(index, 'months').format(format));
}

// /**
//  * @description 获取2个日期之间日期列表
//  * @param {string | date} start 开始日期
//  * @param {string | date} end 结束日期
//  * @param {string} format 日期格式
//  */
// export function getDateList({ start, end, format = 'YYYY-MM-DD' } = {}) {
//   if (!start || !end) return []
//   let diff = moment(end).diff(moment(start), 'days') + 1
//   return Array.from({ length: diff }).map((item, index) => moment(start).add(index, 'days').format(format))
// }

1; /**讲对象转换为url参数形式
2 * @property {Object} obj 将要转换为URL参数的对象
6      */
export function objectToUrlParams(obj) {
  const params = new URLSearchParams();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      params.append(key, obj[key]);
    }
  }
  return params.toString();
}

// 校验正则
export const patternMap = {
  fax: /^(?:\d{3,4}-)?\d{7,8}(?:-\d{1,6})?$/,
  idCard: /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/, // 身份证
  mphone: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, // 手机
  phone: /^(?:(?:\+|00)86)?1\d{10}|^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/, // 手机|座机
  chinese: /^[\u4e00-\u9fa5]*$/, // 中文
  bankNo: /^[1-9]\d{9,29}$/, // 银行卡号
  bankSequence: /^\d{12}$/, // 开户行行号
  number: /^\d*$/, // 数字校验
  numberLetter: /^[0-9a-zA-Z]+$/, // 数字+字母校验
  integer: /^(?:0|(?:-?[1-9]\d*))$/, // 整数
  pinteger: /^[1-9]\d*$/, // 正整数
  money: /^([1-9]\d{0,6}(\.\d{1,2})?|0\.(0[1-9]|[1-9]\d?))$/, // 金额(正数，保留两位)
  moneyAll: /^-?\d+(\.\d{1,2})?$/, // 金额
  email: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, // 邮箱

  // password: /^(?=(.*\d.*))(?=(.*[a-zA-Z].*|.*[^a-zA-Z0-9].*|.*\W.*))[a-zA-Z\d\W\S]{6,}$/, // 密码正则
  // password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, // 密码正则
  password: /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).{8,}$/, //最终密码正则
};

// 首字母大写
export function firstLetterUpperCase(str) {
  return (str?.slice(0, 1)?.toUpperCase() || '') + (str?.slice(1) || '');
}

// 首字母小写
export function firstLetterLowerCase(str) {
  return (str?.slice(0, 1)?.toLowerCase() || '') + (str?.slice(1) || '');
}

export function getCookie(name) {
  //获取指定名称的cookie值
  // (^| )name=([^;]*)(;|$),match[0]为与整个正则表达式匹配的字符串，match[i]为正则表达式捕获数组相匹配的数组；
  var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
  if (arr != null) {
    console.log(arr);
    return unescape(arr[2]);
  }
  return null;
}

// 获取url的参数
export function getQueryParams(url, key) {
  if (!url) {
    if (key) return '';
    return {};
  }

  const paramArr = url.slice(url.indexOf('?') + 1).split('&');
  const params = {};
  paramArr.map((param) => {
    const [key, val] = param.split('=');
    params[key] = decodeURIComponent(val);
  });

  return key ? params[key] : params;
}
