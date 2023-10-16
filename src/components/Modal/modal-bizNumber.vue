<template>
  <!-- 业务单据可用字段配置 -->
  <a-modal :title="title" :visible="state.visible" :confirm-loading="state.confirmSubmit" @ok="onSubmit" :width="'80%'" @cancel="close">
    <a-row :gutter="16">
      <a-card :bordered="true">
        <a-table
          ref="table"
          size="default"
          :columns="columns"
          :dataSource="data"
          :pagination="pagination"
          :loading="loadingData"
          :rowSelection="rowSelection"
          @change="handleTableChange"
          rowKey="recId"
          :scroll="{ x: true }"
        >
        </a-table>
      </a-card>
    </a-row>
  </a-modal>
</template>

<script>
import modalList from '@/components/diboot/mixins/modal-list';
export default {
  name: 'ModelBizNumber',
  mixins: [modalList],
  components: {},
  props: {},
  data() {
    return {
      title: '新增',
      // 列表api
      baseApi: '/tMmFinanceRoleConfigBusiness',
      columns: [
        this.getColumnSerial(),
        {
          title: '业务编号',
          dataIndex: 'businessId',
        },
        {
          title: '业务遍号名称',
          dataIndex: 'businessName',
        },
        {
          title: '抛账规则编号',
          dataIndex: 'financeRoleId',
        },
        {
          title: '抛账规则名称',
          dataIndex: 'tmmFinanceRoleConfigFinanceRoleName',
        },
      ],
      pagination: {
        pageSize: 5,
        current: 1,
        total: 0,
        showTotal: (total, range) => `当前显示 ${range[0]} - ${range[1]} 条/共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '20', '30', '50', '100'],
      },
    };
  },
  computed: {
    rowSelection() {
      return { type: 'radio', selectedRowKeys: this.selectedRowKeys, onChange: this.onRowSelectChange };
    },
  },
  methods: {
    rebuildQuery(query) {
      return { ...query };
    },
    async submitFn() {
      this.$emit('submit', this.selectedRows);
      this.close();
    },
  },
};
</script>
<style lang="less" scoped></style>
