<template>
  <!-- 科目信息管理 -->
  <a-modal :title="title" :visible="state.visible" :confirm-loading="state.confirmSubmit" @ok="onSubmit" :width="'80%'" @cancel="close">
    <a-row :gutter="16">
      <a-col class="gutter-row" :span="6">
        <a-tree-v :treeApi="treeApi" :replaceFields="{ title: 'accountName' }" @select="handleSelect" />
      </a-col>
      <a-col :span="18">
        <div class="table-page-search-wrapper">
          <a-form layout="inline" :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
            <a-row :gutter="18">
              <a-col :md="8" :sm="24">
                <a-form-item label="公司代码">
                  <a-input @keyup.enter.native="onSearch" v-model="queryParam.companyCode" placeholder="" allowClear />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="科目编码">
                  <a-input @keyup.enter.native="onSearch" v-model="queryParam.accountNumber" placeholder="" allowClear />
                </a-form-item>
              </a-col>

              <template v-if="advanced">
                <a-col :md="8" :sm="24">
                  <a-form-item label="科目名称">
                    <a-input @keyup.enter.native="onSearch" v-model="queryParam.accountName" placeholder="" allowClear />
                  </a-form-item>
                </a-col>
              </template>
              <a-col :md="(!advanced && 8) || 24" :sm="24">
                <span class="table-page-search-submitButtons" :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}">
                  <a-button type="primary" @click="onSearch">查询</a-button>
                  <a-button @click="reset">重置</a-button>
                  <a @click="toggleAdvanced">
                    {{ advanced ? '收起' : '展开' }}
                    <a-icon :type="advanced ? 'up' : 'down'" />
                  </a>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <div class="table-operator"></div>

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
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import modalList from '@/components/diboot/mixins/modal-list';
export default {
  name: 'modal-role-account',
  mixins: [modalList],
  data() {
    return {
      title: '新增',
      // 列表api
      treeApi: '/tMmRoleAccountTree/tree',
      baseApi: '/tMmRoleAccount',
      attachMoreList: [],
      columns: [
        this.getColumnSerial(),
        {
          title: '科目编码',
          dataIndex: 'accountNumber',
        },
        {
          title: '科目名称',
          dataIndex: 'accountName',
        },
        // {
        //   title: '科目类型',
        //   dataIndex: 'accountType',
        // },
        {
          title: '科目类型名称',
          dataIndex: 'accountTypeName',
        },
        {
          title: '辅助账类型名称',
          dataIndex: 'asstActName',
        },
        // {
        //   title: '币种',
        //   dataIndex: 'currencyNumber',
        // },
        // {
        //   title: '汇率',
        //   dataIndex: 'localRate',
        // },
        {
          title: '余额方向',
          dataIndex: 'entryDc',
        },
      ],
      curNode: {},
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
      return { ...query, parentId: this.curNode?.recId };
    },
    handleSelect(selectedKeys, { selectedNodes, selected, node, event }) {
      this.curNode = selected ? node?.dataRef : {};
      this.onSearch();
    },
    async submitFn() {
      this.$emit('submit', this.selectedRows);
      this.close();
    },
  },
};
</script>
<style lang="less" scoped></style>
