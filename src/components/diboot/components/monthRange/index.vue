<template>
  <div class="month-range">
    <a-month-picker
      style="width: calc(50% - 15px)"
      allowClear
      v-model="value[0]"
      :format="format"
      :placeholder="placeholder[0]"
      @openChange="handleStartOpenChange"
    />
    ~
    <a-month-picker
      style="width: calc(50% - 10px)"
      allowClear
      v-model="value[1]"
      :format="format"
      @change="onChange"
      :open="endOpen"
      :placeholder="placeholder[1]"
      @openChange="handleEndOpenChange"
    />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'MonthRange',
  props: {
    value: {
      type: Array,
      default: () => [undefined, undefined],
    },
    format: {
      type: String,
      default: 'YYYY-MM',
    },
    allowClear: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: Array,
      default() {
        return ['开始月份', '结束月份']
      },
    },
  },
  data() {
    return {
      endOpen: false,
    }
  },
  methods: {
    onChange() {
      const { value } = this
      // if (moment(value[0]).format(this.format) > moment(value[1]).format(this.format)) {
      //   this.endOpen = true
      //   return
      // }
      this.$emit('input', value)
      this.$emit('change', value)
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
  },
}
</script>

<style>
.date-range .ant-calendar-picker {
  min-width: unset !important;
}
</style>
