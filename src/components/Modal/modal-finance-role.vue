<template>
  <!-- 抛账规则设置 -->
  <a-modal :title="title" :visible="state.visible" :confirm-loading="state.confirmSubmit" @ok="onSubmit" :width="'80%'" @cancel="close">
    <a-row :gutter="16">
      <a-card :bordered="true">
        <div class="table-page-search-wrapper">
          <a-form layout="inline" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
            <a-row :gutter="18">
              <a-col :md="8" :sm="24">
                <a-form-item label="抛帐规则编号">
                  <a-input @keyup.enter.native="onSearch" v-model="queryParam.financeRoleId" placeholder="" allowClear />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="抛帐规则名称">
                  <a-input @keyup.enter.native="onSearch" v-model="queryParam.financeRoleName" placeholder="" allowClear />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <span class="table-page-search-submitButtons">
                  <a-button type="primary" @click="onSearch">查询</a-button>
                  <a-button @click="reset">重置</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <a-table
          ref="table"
          size="default"
          :columns="columns"
          :dataSource="data"
          :pagination="pagination"
          :scroll="{ x: true }"
          :loading="loadingData"
          :rowSelection="rowSelection"
          @change="handleTableChange"
          rowKey="roleRecId"
        >
        </a-table>
      </a-card>
    </a-row>
  </a-modal>
</template>

<script>
import modalList from '@/components/diboot/mixins/modal-list';
export default {
  name: 'modal-business',
  mixins: [modalList],
  components: {},
  props: {},
  data() {
    return {
      title: '新增',
      // 列表api
      baseApi: '/tMmFinanceRoleConfig',
      attachMoreList: [
        {
          target: 'TMmBusiness',
          label: 'businessName',
          value: 'businessId',
        },
      ],
      columns: [
        this.getColumnSerial(),
        {
          title: '抛帐规则编号',
          dataIndex: 'financeRoleId',
        },
        {
          title: '抛帐规则名称',
          dataIndex: 'financeRoleName',
          ellipsis: true,
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
