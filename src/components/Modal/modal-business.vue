<template>
  <!-- 业务单据可用字段配置 -->
  <a-modal :title="title" :visible="state.visible" :confirm-loading="state.confirmSubmit" @ok="onSubmit" :width="'80%'" @cancel="close">
    <a-row :gutter="16">
      <a-card :bordered="true">
        <div class="table-page-search-wrapper">
          <a-form layout="inline" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
            <a-row :gutter="18">
              <a-col :md="8" :sm="24">
                <a-form-item label="业务单据号">
                  <a-select-v
                    show-search
                    :filter-option="filterOption"
                    @change="onSearch"
                    v-model="queryParam.businessId"
                    placeholder="请选择业务单据号"
                    allowClear
                    :optionList="more.tMmBusinessOptions"
                  >
                  </a-select-v>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="业务单据名称">
                  <a-input @keyup.enter.native="onSearch" v-model="queryParam.businessName" placeholder="" allowClear />
                </a-form-item>
              </a-col>
              <a-col :md="(!advanced && 8) || 24" :sm="24">
                <span class="table-page-search-submitButtons" :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}">
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
  name: 'modal-business',
  mixins: [modalList],
  components: {},
  props: {},
  data() {
    return {
      title: '新增',
      // 列表api
      baseApi: '/tMmBusinessFieldConfig',
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
          title: '业务单据号',
          dataIndex: 'businessId',
        },
        {
          title: '业务单据名称',
          dataIndex: 'tmmBusinessBusinessName',
        },
        {
          title: '表名',
          dataIndex: 'tableEname',
        },
        {
          title: '表中文名',
          dataIndex: 'tableCname',
        },
        {
          title: '字段名',
          dataIndex: 'fieldEname',
        },
        {
          title: '字段中文名',
          dataIndex: 'fieldCname',
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
