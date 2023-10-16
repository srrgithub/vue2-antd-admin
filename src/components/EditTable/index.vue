<template>
  <div>
    <a-button type="primary" @click="add(((value && value.length) || 0) - 1)" v-if="isEdit">新增</a-button>
    <a-table ref="table" size="default" :columns="columns" :dataSource="value" :pagination="false">
      <template
        v-for="(
          { title, dataIndex, scopedSlots, cellEvent = {}, cellConfig: { disabled, formType = 'INPUT', ...res } = {}, validateMessages }, i
        ) in columns"
        :slot="dataIndex"
        slot-scope="text, record, index"
      >
        <edit-table-cell
          v-if="record !== undefined && dataIndex != 'action'"
          :key="dataIndex + String(i)"
          :editable="editIndex === index"
          :validateMessages="validateMessages"
          v-bind="{
            ...(res || {}),
            formType: formType,
            disabled: typeof disabled == 'function' ? disabled(record) : !!disabled,
          }"
          :row="{ text, record, index }"
          v-model="record[dataIndex]"
          v-on="cellEvent"
        />
      </template>

      <span slot="action" slot-scope="text, record, index">
        <a-space>
          <a-button
            type="link"
            @click="handleEditTableRow(record, index)"
            :icon="editIndex === index ? 'check-circle' : 'form'"
            :title="editIndex === index ? '完成' : '行内编辑'"
          />
          <a-button type="link" @click="add(index)" icon="plus" title="新增" />
          <a-button type="link" @click="remove(record, index)" icon="delete" title="删除" />
        </a-space>
        <!-- <a-dropdown v-permission="['update', 'delete']">
        <a class="ant-dropdown-link"> 更多 <a-icon type="down" /> </a>
        <a-menu slot="overlay">
          <a-menu-item v-action:update>
            <a @click="$refs.form.open(record.id)">编辑</a>
          </a-menu-item>
          <a-menu-item v-action:delete>
            <a @click="remove(record.id)">删除</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown> -->
      </span>
    </a-table>
  </div>
</template>

<script>
// import list from '@/components/diboot/mixins/list'
import EditTableCell from './editTableCell';
import EditTableCellValidate from './editTableCellValidate';

export default {
  name: 'EditTable',
  components: {
    EditTableCell,
    EditTableCellValidate,
  },
  props: {
    value: {
      default() {
        return [];
      },
    },
    primaryKey: {
      default: 'id',
    },
    columns: {
      default() {
        return [];
      },
    },
    isEdit: {
      type: Boolean,
      default: true,
    },
  },
  // mixins: [list],
  computed: {
    /**
     * 控制是否显示行的checkbox
     * @returns {*}
     */
    rowSelection() {
      return { selectedRowKeys: this.selectedRowKeys, onChange: this.onRowSelectChange };
    },
  },
  data() {
    return {
      // baseApi: '/tMtBusinessRole',
      // getListFromMixin: false,
      // 当前激活value
      editIndex: -1,
      currentRow: {},
      currentPrimaryValue: '',
      // tbData: [
      //   {
      //     id: 1,
      //     businessName: '1',
      //     financeRoleId: '2',
      //     companyName: '3',
      //   },
      //   {
      //     id: 2,
      //     businessName: '1',
      //     financeRoleId: '2',
      //     companyName: '3',
      //   },
      // ],
      // columns: [
      //   {
      //     title: '业务单据名称',
      //     dataIndex: 'businessName',
      //     scopedSlots: { customRender: 'businessName' },
      //   },
      //   {
      //     title: '操作',
      //     width: '200px',
      //     dataIndex: 'action',
      //     scopedSlots: { customRender: 'action' },
      //   },
      // ],
      selectedRowKeys: [],
    };
  },
  mounted() {
    // console.log('this.columns', this.columns)
  },
  methods: {
    async afterOpen() {
      this.editIndex = -1;
      this.currentPrimaryValue = '';
    },
    /**
     * 编辑表格结束后触发
     * @param value
     * @param oldValue
     */
    async handleEditTableRow(model, index) {
      if (this.currentPrimaryValue) {
        // try {
        //   const findModel = this.data.find((e) => e[this.primaryKey] === this.currentPrimaryValue)
        //   const res = await dibootApi.put(`${this.baseApi}/${findModel[this.primaryKey]}`, findModel)
        //   if (res.code === 0) {
        //     await this.getList()
        //   } else {
        //     this.$message.warning(res.msg)
        //   }
        // } catch (e) {
        //   this.$message.warning('网络异常')
        // } finally {
        //   this.reload = !this.reload
        // }
      }

      if (this.editIndex == index) {
        this.editIndex = -1;
      } else {
        this.editIndex = index;
      }
      this.currentRow = model;
      if (this.currentPrimaryValue === model[this.primaryKey]) {
        this.currentPrimaryValue = '';
      } else {
        this.currentPrimaryValue = model[this.primaryKey];
      }
    },
    add(index) {
      let maxId = Math.max(...(this.value || []).map((item) => item[this.primaryKey]), 0);
      let arr = [...(this.value || [])];
      // let model = { [this.primaryKey]: Number(maxId || 0) + 1 }
      let model = {};
      arr.splice(index + 1, 0, model);
      this.editIndex = index + 1;
      this.currentPrimaryValue = model[this.primaryKey];
      // let arr = [...(this.value || [])]
      // arr.splice(index+1, 0, {})
      this.$emit('input', arr);
    },
    remove(record, index) {
      return new Promise((resolve, reject) => {
        var _this = this;
        _this.$confirm({
          title: '删除',
          content: `确定删除该数据吗？`,
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _this.value?.splice(index, 1);
            _this.editIndex = -1;
          },
        });
      });
    },
    onRowSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
  },
};
</script>
<style lang="less" scoped></style>
