<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 20 }">
        <template v-if="formType === 'INPUT'">
          <a-form-item>
            <a-input
              :disabled="disabled"
              v-decorator="[
                'tempValue',
                {
                  initialValue: tempValue,
                  rules: [
                    { required: true, message: validateMessages.message },
                    { max: validateMessages.contentLength, message: validateMessages.lengthPromptMessage },
                  ],
                },
              ]"
              :placeholder="placeholder"
              @change="(e) => changeValue(e.target.value)"
            />
          </a-form-item>
        </template>
        <template v-if="formType === 'INPUT_NUMBER'">
          <a-form-item>
            <a-input-number
              :disabled="disabled"
              v-decorator="[
                'tempValue',
                {
                  initialValue: tempValue,
                  rules: [{ required: true, message: validateMessages.message }],
                },
              ]"
              controls-position="right"
              @change="changeValue"
              :placeholder="placeholder"
            />
          </a-form-item>
        </template>
        <template v-else-if="formType === 'TEXTAREA'">
          <a-form-item>
            <a-textarea
              :disabled="disabled"
              @change="(e) => changeValue(e.target.value)"
              type="textarea"
              v-decorator="['tempValue']"
              :placeholder="placeholder"
            />
          </a-form-item>
        </template>
        <template v-else-if="formType === 'S_SELECT'">
          <a-form-item>
            <a-select
              show-search
              :disabled="disabled"
              filterable
              @change="changeValue"
              allowClear
              v-decorator="['tempValue']"
              :placeholder="placeholder"
            >
              <a-select-option v-for="(item, index) in options || []" :disabled="!!item.disabled" :key="index" :value="item[valueField]">
                {{ item[labelField] }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template v-else-if="formType === 'M_SELECT'">
          <a-form-item>
            <a-select
              :disabled="disabled"
              mode="multiple"
              filterable
              allowClear
              @change="changeValue"
              v-decorator="['tempValue']"
              :placeholder="placeholder"
            >
              <a-select-option v-for="(item, index) in options || []" :key="index" :value="item[valueField]">
                {{ item[labelField] }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <template v-else-if="formType === 'SWITCH'">
          <a-form-item>
            <a-switch :disabled="disabled" @change="changeValue" v-decorator="['tempValue']" />
          </a-form-item>
        </template>
        <template v-else-if="formType === 'DATEPICKER'">
          <a-form-item>
            <a-date-picker
              :disabled="disabled"
              v-decorator="['tempValue']"
              @change="changeValue"
              :placeholder="placeholder"
              valueFormat="YYYY-MM-DD"
            />
          </a-form-item>
        </template>
        <template v-else-if="formType === 'DATETIMEPICKER'">
          <a-form-item>
            <a-date-picker
              :disabled="disabled"
              v-decorator="['tempValue']"
              @change="changeValue"
              :placeholder="placeholder"
              :showTime="{ format: 'HH:mm:ss' }"
              valueFormat="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-item>
        </template>
        <template v-else-if="formType === 'TREE'">
          <a-form-item>
            <a-tree-select
              :disabled="disabled"
              v-if="treeData.length > 0"
              :placeholder="placeholder"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="treeData"
              treeNodeFilterProp="name"
              showSearch
              treeDefaultExpandAll
              @change="changeValue"
              v-decorator="['tempValue']"
            >
            </a-tree-select>
          </a-form-item>
        </template>
      </a-form>
    </div>
    <div v-else :class="{ 'text-ellipsis': ellipsis, 'editable-cell-text-wrapper': true }">
      <template v-if="label"> {{ label }} </template>
      <template v-else-if="formType === 'S_SELECT'">
        {{ ((options || []).find((item) => item[valueField] === tempValue) || {})[labelField] }}
      </template>
      <template v-else-if="!label && formType === 'TREE'"> - </template>
      <template v-else> {{ (isBoolean ? (tempValue ? '是' : '否') : tempValue) || '-' }} </template>
    </div>
  </div>
</template>

<script>
import { dibootApi } from '@/utils/request';
import { treeListFormatter } from '@/utils/treeDataUtil';

export default {
  name: 'EditTableCellValidate',
  // 文本值， 表单类型， 选择类型的数据集
  props: {
    // record:{
    //   default() {return {}}
    // },
    // disabled: {
    //   type: Function,
    //   default: () => {
    //     return false
    //   },
    // },
    row: {
      default() {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    value: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Boolean | Number | Array,
      required: true,
    },
    valueField: {
      type: String,
      default: 'value',
    },
    labelField: {
      type: String,
      default: 'label',
    },
    label: {
      type: String,
      default: '',
    },
    // 表单类型: 支持INPUT、INPUT_NUMBER、TEXTAREA、S_SELECT、SWITCH、DATEPICKER、DATETIMEPICKER
    formType: {
      type: String,
      required: true,
    },
    //  表单的校验规则
    validateMessages: {
      type: Object,
      default: {
        message: '不能为空',
        lengthPromptMessage: '50字符以内',
        contentLength: 50,
      },
    },
    // 是否是布尔
    isBoolean: {
      type: Boolean,
      default: false,
    },
    // 选择类型的数据集
    options: {
      type: Array,
      default: () => [],
    },
    // 选择类型的数据集
    ellipsis: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    // 基础请求路径
    baseUrl: {
      type: String,
      default: '',
    },
    // 完整请求路径
    fullUrl: {
      type: String,
      default: '',
    },
    // 树的value字段
    treeValueField: {
      type: String,
      default: 'id',
    },
    // 树的显示字段
    treeTitleField: {
      type: String,
      default: 'label',
    },
  },
  data() {
    return {
      form: this.$form.createForm(this),
      tempValue: this.value || undefined,
      treeData: [],
    };
  },
  watch: {
    editable(val) {
      val && this.reloadData();
    },
    value(val) {
      this.tempValue = val || undefined;
    },
  },
  methods: {
    changeValue(val) {
      this.$emit('input', val);
      this.$emit('change', val, this.row);
    },
    /**
     * 重新加载数据
     */
    async reloadData() {
      if (this.formType === 'TREE') {
        const res = await dibootApi.get(this.fullUrl ? this.fullUrl : `${this.baseUrl}/list`);
        if (res.code === 0) {
          const data = res.data || [];
          if (data.length > 0) {
            this.treeData = treeListFormatter(data, this.treeValueField, this.treeTitleField, true);
          }
          this.treeData.splice(0, 0, {
            key: '0',
            value: '0',
            title: '-- 无 --',
          });
        }
      }
    },
    checkValidate() {
      return new Promise((resolve, reject) => {
        if (this.form?.validateFields) {
          this.form?.validateFields((err, values) => {
            if (!err) {
              resolve(values);
            } else {
              reject(err);
            }
          });
        } else {
          resolve({});
        }
      });
    },
  },
};
</script>

<style scoped>
.editable-cell {
  position: relative;
}
.editable-cell-input-wrapper {
  display: flex;
  .ant-select {
    width: 100%;
  }
  .ant-input-number {
    width: 100%;
  }
}
.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}
/deep/.ant-form-item {
  margin-bottom: 0px;
  padding-bottom: 0px;
}
</style>
