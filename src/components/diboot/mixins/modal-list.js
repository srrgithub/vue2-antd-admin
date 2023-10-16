import list from '@/components/diboot/mixins/list';
import { downloadFileFromRes } from '@/utils/fileUtil';
import { dibootApi } from '@/utils/request';
import { list2tree } from '@/utils/treeDataUtil';
import _ from 'lodash';
import merge from 'lodash.merge';
import moment from 'moment';

export default {
  mixins: [list],
  props: {
    requestFn: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      getListFromMixin: false,
      getAttachMoreFromMixin: false,
      createApi: '',
      title: '',
      // 当前组件状态对象
      state: {
        // 当前抽屉/模态框是否显示
        visible: false,
        // 当前表单提交按钮状态
        confirmSubmit: false,
        // 当前表单数据加载状态
        formDataLoading: false,
      },
    };
  },
  methods: {
    async beforeOpen(id) {},
    async open(id) {
      this.state.visible = true;
      await this.beforeOpen(id);
      this.onSearch();
      await this.attachMore();
      this.afterOpen(id);
    },
    afterOpen(id) {},
    close() {
      // 清空列表的查询条件
      this.queryParam = {};
      this.dateRangeQuery = {};

      this.state.visible = false;
      this.state.formDataLoading = false;
      this.state.confirmSubmit = false;
      this.selectedRowKeys = [];
      this.selectedRows = [];
      this.data = [];
      this.afterClose();
    },
    afterClose() {},
    async buildValues() {
      return {};
    },
    async submitFn() {},
    async onSubmit() {
      if (this.selectedRowKeys == null || this.selectedRowKeys.length === 0) {
        this.$message.error('请选择需要操作的行');
        return false;
      }
      this.state.confirmSubmit = true;

      try {
        let res = {};
        if (this.requestFn && typeof this.requestFn == 'function') {
          res = await this.requestFn();
        } else if (this.createApi) {
          const values = await this.buildValues();
          res = await dibootApi.post(this.createApi, values);
        } else {
          await this.submitFn();
          return;
        }

        if (res.code == 0) {
          this.submitSuccess(res);
        } else {
          this.submitFailed(res);
        }
      } catch (error) {
        console.error(error);
        this.submitFailed(error);
      }
    },
    submitSuccess(result) {
      this.state.confirmSubmit = false;
      this.$notification.success({
        message: '操作成功',
        description: result?.msg,
      });
      this.close();
      this.$emit('complete');
    },
    submitFailed(e) {
      console.error(e);
      // 如果是字符串，直接提示
      let msg;
      if (typeof e === 'string') {
        msg = e;
      } else {
        msg = e.message || e.msg;
      }

      // 如果还没有消息内容，则可能是校验错误信息，进行校验错误信息提取
      if (!msg && typeof e === 'object') {
        msg = this.validateErrorToMsg(e);
      }
      this.state.confirmSubmit = false;
      this.$notification.error({
        message: '操作失败',
        description: msg,
      });
    },
    validateErrorToMsg(err) {
      return '表单校验不通过,请检查';
    },
  },
};
