import { downloadFileFromRes } from '@/utils/fileUtil';
import { dibootApi } from '@/utils/request';
import { list2tree } from '@/utils/treeDataUtil';
import _ from 'lodash';
import merge from 'lodash.merge';
import moment from 'moment';
import more from './more';

const defaultPageSize = 10;
export default {
  mixins: [more],
  data() {
    return {
      primaryKey: 'id',
      // 流程key
      flowKey: '',
      // 发起流程接口
      flowApi: '',
      // 请求接口基础路径
      baseApi: '/',
      // 列表数据接口
      listApi: '',
      // 删除接口
      deleteApiPrefix: '',
      // 导出接口
      exportApi: '',
      // 自定义参数（不被查询表单重置和改变的参数）
      customQueryParam: {},
      // 是否从mixin中自动添加排序参数
      getOrderParamFromMixin: true,
      // 默认的自定义排序字段
      customOrderParam: { orderBy: 'recCreateTime:DESC' },
      // 与查询条件绑定的参数（会被查询表单重置和改变的参数）
      queryParam: {},
      // 日期格式转换 { dateTime: 'YYYY-MM-DD' }
      queryParamDateFormat: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 列表数据
      data: [],
      // 是否从mixin中自动获取初始的列表数据
      getListFromMixin: true,
      // 是否从mixin中自动获取字典
      getAttachMoreFromMixin: true,
      // 是否重新加载
      reload: false,
      // 当前激活value
      currentPrimaryValue: '',
      // 日期区间选择配置
      dateRangeQuery: {},
      // 日期区间转换配置 { dateRange: { startKey: 'startTime', endKey: 'endTime', format: 'YYYY-MM-DD',  formatToTime: false  } }
      dateRangeQueryOps: {},
      // 标记加载状态
      loadingData: false,
      // 窗口高度
      windowHeight: 240,
      // 是否允许撤回删除
      allowCanceledDelete: false,
      // 分页数据
      pagination: {
        pageSize: defaultPageSize,
        current: 1,
        total: 0,
        showTotal: (total, range) => `当前显示 ${range[0]} - ${range[1]} 条/共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
      },
      // 选中keys
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
  methods: {
    // 获取序列号
    getColumnSerial() {
      return {
        title: '序号',
        dataIndex: 'index',
        width: 80,
        align: 'center',
        fixed: 'left',
        customRender: (text, record, index) => {
          const { pageSize, current } = this.pagination;
          return (current - 1) * pageSize + (index + 1);
        },
      };
    },
    /**
     *
     * @param {number} wordsLength  字数
     * @param {number} wordsGropLength 字数组
     */
    calcActionWidth(wordsLength = 6, wordsGropLength = 3) {
      return wordsLength * 14 + (wordsGropLength - 1) * 17 + 20 + 12;
    },
    list2tree,
    /**
     * 分页、排序、筛选变化时触发
     * @param pagination 分页
     * @param filters 排序
     * @param sorter 筛选
     */
    handleTableChange(pagination, filters, sorter) {
      this.queryParam.pageIndex = pagination.current;
      this.queryParam.pageSize = pagination.pageSize;
      this.appendSorterParam(sorter);
      this.getList();
    },
    /**
     * 构建排序
     * @param sorter
     */
    appendSorterParam(sorter) {
      if (sorter != null && sorter.field != null) {
        const field = sorter.field;
        const order = sorter.order === 'ascend' ? 'ASC' : 'DESC';
        const orderBy = `${field}:${order}`;
        this.queryParam.orderBy = orderBy;
      } else {
        this.queryParam.orderBy = undefined;
      }
    },
    /**
     * 切换展示更多搜索框
     */
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    /**
     * 搜索，查询第一页（默认查询按钮触发）
     */
    onSearch() {
      this.pagination.current = 1;
      this.handleTableChange(this.pagination);
    },
    /**
     * post请求的获取列表（可以传递更长、更复杂参数）
     * @returns {Promise<any>}
     */
    postList() {
      return new Promise((resolve, reject) => {
        this.loadingData = true;
        // 使用post方式请求列表数据（多用于复杂参数通过json对象进行传输到后端进行筛选）
        dibootApi
          .post(this.listApi ? this.listApi : `${this.baseApi}/list`, this.buildQueryParam())
          .then((res) => {
            this.loadingData = false;
            if (res.code === 0) {
              this.data = res.data;
              this.afterLoadList(this.data);
              if (res.page) {
                this.pagination.pageSize = res.page.pageSize;
                this.pagination.current = res.page.pageIndex;
                this.pagination.total = res.page.totalCount ? Number(res.page.totalCount) : 0;
              }
              // eslint-disable-next-line no-undef
              resolve(this.data);
            } else {
              this.$notification.error({
                message: '获取列表数据失败',
                description: res.msg,
              });
              reject(res.msg);
            }
          })
          .catch((err) => {
            this.loadingData = false;
            // eslint-disable-next-line prefer-promise-reject-errors
            this.$notification.error({
              message: '获取列表数据失败',
              description: err.message,
            });
            reject(err);
          });
      });
    },
    async getListBefore() {},
    /**
     * get请求获取列表
     * @returns {Promise<any>}
     */
    async getList() {
      await this.getListBefore();
      return new Promise((resolve, reject) => {
        this.loadingData = true;
        dibootApi
          .get(this.listApi ? this.listApi : `${this.baseApi}/list`, this.buildQueryParam())

          .then((res) => {
            this.loadingData = false;
            if (res.code === 0) {
              this.data = res.data;
              this.afterLoadList(this.data);
              if (res.page) {
                this.pagination.pageSize = res.page.pageSize;
                this.pagination.current = res.page.pageIndex;
                this.pagination.total = res.page.totalCount ? Number(res.page.totalCount) : 0;
              }
              resolve(this.data);
            } else {
              this.$notification.error({
                message: '获取列表数据失败',
                description: res.msg,
              });
              reject(res.msg);
            }
          })
          .catch((err) => {
            this.loadingData = false;
            this.$notification.error({
              message: '获取列表数据失败',
              description: err.message,
            });
            reject(err);
          });
      });
    },
    /**
     * 重新构建查询条件 (接收已经定义的customQueryParam与queryParam的合并值)
     * @param query
     * @returns {*}
     */
    rebuildQuery(query) {
      return query;
    },
    /**
     * 重置
     */
    reset() {
      this.queryParam = {};
      this.dateRangeQuery = {};
      if (this.pagination.pageSize != defaultPageSize) {
        this.queryParam.pageSize = this.pagination.pageSize;
      }
      this.getList();
    },
    // reset 和 onSearch 结合
    resetQuery() {
      this.queryParam = {};
      this.dateRangeQuery = {};
      this.onSearch();
    },
    /**
     * 删除
     * @param id
     * @returns {Promise<any>}
     */
    remove(id) {
      return new Promise((resolve, reject) => {
        var _this = this;
        _this.$confirm({
          title: '删除',
          content: `确定删除该数据吗？`,
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            const deleteApiPrefix = _this.deleteApiPrefix ? _this.deleteApiPrefix : '';
            dibootApi
              .delete(`${_this.baseApi}${deleteApiPrefix}/${id}`)
              .then(async (res) => {
                if (res.code === 0) {
                  if (_this.allowCanceledDelete) {
                    _this.$message.success((h) => {
                      return h('span', [
                        '当前数据删除成功',
                        h(
                          'a-button',
                          {
                            props: {
                              type: 'link',
                            },
                            on: {
                              click: (event) => {
                                _this.canceledDelete(id);
                              },
                            },
                          },
                          '撤回'
                        ),
                      ]);
                    });
                  } else {
                    _this.$message.success('当前数据删除成功');
                  }
                  await _this.getList();
                  resolve(res.data);
                } else {
                  _this.$notification.error({
                    message: '删除失败',
                    description: res.msg,
                    duration: 3,
                  });
                  // eslint-disable-next-line prefer-promise-reject-errors
                  reject(res.msg);
                }
              })
              .catch((err) => {
                _this.$notification.error({
                  message: '删除失败',
                  description: err.msg,
                  duration: 3,
                });
                reject(err.msg);
              });
          },
        });
      });
    },
    async canceledDelete(id) {
      const res = await dibootApi.post(`${this.baseApi}/cancelDeleted/${id}`);
      if (res.code === 0) {
        this.$message.destroy();
        this.$message.success('撤回成功');
        this.getList();
      } else {
        this.$message.error('撤回失败');
      }
    },
    /**
     * 批量开始流程
     * @returns
     */
    batchFlow() {
      const keys = this.flowKey ? this.selectedRows.map((item) => item[this.flowKey]) : this.selectedRowKeys;
      if (!keys?.length) {
        this.$message.error('请选择需要操作的行');
        return false;
      }

      this.$confirm({
        title: '您是否确认操作？',
        onOk: () => {
          dibootApi.post(this.flowApi || `${this.baseApi}/batchStartFlow`, keys).then((res) => {
            if (res.code === 0) {
              this.selectedRowKeys = [];
              this.selectedRows = [];
              this.$message.success(res.msg);
              this.getList();
            } else {
              this.$message.error(res.msg);
            }
          });
        },
      });
    },
    /***
     * 删除
     * @returns {boolean}
     */
    batchRemove() {
      if (this.selectedRowKeys == null || this.selectedRowKeys.length === 0) {
        this.$message.error('请选择需要操作的行');
        return false;
      }
      const _this = this;
      this.$confirm({
        title: '您是否确认批量删除所选项？',
        onOk() {
          // 开始删除选中的行
          dibootApi.post(`${_this.baseApi}/batchDelete`, _this.selectedRowKeys).then((res) => {
            if (res.code === 0) {
              _this.selectedRowKeys = [];
              _this.selectedRows = [];
              _this.$message.success(res.msg);
              _this.getList();
            } else {
              _this.$message.error(res.msg);
            }
          });
        },
      });
    },
    /**
     * 选中更改
     * @param {*} selectedRowKeys
     */
    onRowSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    /**
     * 导出数据至excel
     */
    exportData() {
      const exportApi = this.exportApi ? this.exportApi : '/excel/export';
      dibootApi.download(`${this.baseApi}${exportApi}`, this.buildQueryParam()).then((res) => {
        if (res.filename) {
          this.downloadFile(res);
        } else {
          var decoder = new TextDecoder('utf-8');
          var result = JSON.parse(decoder.decode(new Uint8Array(res)));
          this.$message.error(result.msg);
        }
      });
    },
    /**
     * 构建查询参数
     */
    buildQueryParam() {
      this.dateRange2queryParam();
      // 转化包含moment的时间类型
      this.contentTransform(this.queryParam, this.queryParamDateFormat);
      let tempQueryParam = {};
      // 合并默认的自定义排序字段
      if (this.getOrderParamFromMixin) {
        merge(tempQueryParam, this.customOrderParam);
      }
      // 合并自定义查询参数
      merge(tempQueryParam, this.customQueryParam);
      // 合并搜索参数
      merge(tempQueryParam, this.queryParam);
      // 改造查询条件（用于列表页扩展）
      tempQueryParam = this.rebuildQuery(tempQueryParam);
      return tempQueryParam;
    },
    /**
     * 编辑表格结束后触发
     * @param value
     * @param oldValue
     */
    async handleEditTableRow(model) {
      if (this.currentPrimaryValue) {
        try {
          const findModel = this.data.find((e) => e[this.primaryKey] === this.currentPrimaryValue);
          const res = await dibootApi.put(`${this.baseApi}/${findModel[this.primaryKey]}`, findModel);
          if (res.code === 0) {
            await this.getList();
          } else {
            this.$message.warning(res.msg);
          }
        } catch (e) {
          this.$message.warning('网络异常');
        } finally {
          this.reload = !this.reload;
        }
      }
      if (this.currentPrimaryValue === model[this.primaryKey]) {
        this.currentPrimaryValue = '';
      } else {
        this.currentPrimaryValue = model[this.primaryKey];
      }
    },
    /**
     * 下载文件
     * @param res
     */
    downloadFile(res) {
      downloadFileFromRes(res);
    },
    /**
     * 加载数据之后操作
     * @param list
     */
    afterLoadList(list) {},
    /**
     * 解决带有下拉框组件在滚动时下拉框不随之滚动的问题
     * @param trigger
     * @returns {HTMLElement}
     */
    getPopupContainer(trigger) {
      return trigger.parentElement;
    },
    /**
     * 处理查询参数中的moment数据 默认转化为YYYY-MM-DD
     * 如果需要单独处理属性，那么请传入transform对象，指定属性的转化类型
     * 示例：{createTime: 'YYYY-MM-DD'}
     * @param content 待转化内容
     * @param transform 需要转化的格式
     */
    contentTransform(content, transform = {}) {
      if (content) {
        for (const key in content) {
          const value = content[key];
          const format = transform[key] || 'YYYY-MM-DD';
          if (value instanceof Array) {
            // 如果类型是moment，那么进行转化
            if (value && value[0] instanceof moment) {
              const transformTime = [];
              for (let i = 0; i < value.length; i++) {
                transformTime[i] = value[i].format(format);
              }
              content[key] = transformTime;
            }
          } else if (value instanceof moment) {
            content[key] = value.format(format);
          }
        }
      }
      return content;
    },
    /**
     * 构建区间查询参数
     *
     */
    dateRange2queryParam() {
      // 示例：
      // let dateRangeQuery = { time: ['2023', '2024'] }
      // let dateRangeQueryOps = {
      //   time: {
      //     startKey: 'Begin',
      //     endKey: 'End',
      //     format: 'YYYY-MM-DD',
      //     formatToTime: false
      //   },
      // }

      _.forEach(this.dateRangeQuery, (v, k) => {
        if (k && v && v.length === 2) {
          let obj = this.dateRangeQueryOps[k];
          let format = obj?.format || 'YYYY-MM-DD';
          let startKey = obj?.startKey || `${k}Begin`;
          let endKey = obj?.endKey || `${k}End`;

          let startKeyValue, endKeyValue;
          if (obj?.formatToTime) {
            startKeyValue = v[0] ? v[0].format('YYYY-MM-DD 00:00:00') : '';
            endKeyValue = v[1] ? v[1].format('YYYY-MM-DD 23:59:59') : '';
          } else if (obj?.formatToDate) {
            startKeyValue = v[0] ? v[0].startOf('month').format('YYYY-MM-DD') : '';
            endKeyValue = v[1] ? v[1].endOf('month').format('YYYY-MM-DD') : '';
          } else {
            startKeyValue = v[0] ? v[0].format(format) : '';
            endKeyValue = v[1] ? v[1].format(format) : '';
          }
          this.queryParam[startKey] = startKeyValue;
          this.queryParam[endKey] = endKeyValue;
        } else {
          let obj = this.dateRangeQueryOps[k];
          let startKey = obj?.startKey || `${k}Begin`;
          let endKey = obj?.endKey || `${k}End`;
          this.queryParam[startKey] = undefined;
          this.queryParam[endKey] = undefined;
        }
      });
    },
    windowResize() {
      // 设置workPanel的高度
      this.windowHeight = window.innerHeight;
    },
    /**
     * 点击级联类型后，加载select数据
     */
    handleCascaderSelectNext(data, clearParams = []) {
      // 将级联已经选中的统一清理
      clearParams.forEach((param) => delete this.queryParam[param]);
      // 选中的数据初始化
      Object.assign(this.more, data);
      this.$forceUpdate();
    },
    /**
     * 路由返回
     */
    handleBack() {
      let path = this.$route.meta.activeMenu;
      path ? this.$router.push({ path }) : this.$router.back();
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  },
  async mounted() {
    if (this.getListFromMixin === true) {
      await this.getList();
    }
    if (this.getAttachMoreFromMixin === true) {
      await this.attachMore();
    }
  },
  computed: {
    tableScrollData: function () {
      // return { x: 'calc(700px + 50%)', y: `${this.windowHeight > 560 ? this.windowHeight - 420 : 1200}px` }
      return { x: true, y: `${this.windowHeight > 560 ? this.windowHeight - 420 : 1200}px` };
    },
    /**
     * 控制是否显示行的checkbox
     * @returns {*}
     */
    rowSelection() {
      return { selectedRowKeys: this.selectedRowKeys, onChange: this.onRowSelectChange };
    },
  },
  created() {
    // 设置workPanel的高度
    this.windowResize(false);
    window.addEventListener('resize', this.windowResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.windowResize);
  },
};
