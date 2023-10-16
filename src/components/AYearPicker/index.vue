<template>
  <a-date-picker
    mode="year"
    format="YYYY"
    v-bind="$attrs"
    v-on="$listeners"
    :open="open"
    @change="onChange"
    @openChange="openChange"
    valueFormat="YYYY"
    @panelChange="panelChange"
    :value="value"
  />
</template>

<script>
export default {
  name: 'AYearPicker',
  props: {
    value: {
      default: undefined,
    },
  },
  // model: {
  //   prop: 'value',
  //   event: 'input',
  // },
  data() {
    return {
      open: false,
    }
  },
  methods: {
    openChange(open) {
      this.open = !!open
    },
    onChange(date, dateString) {
      this.$emit('input', date)
      this.$emit('change', date, dateString)
      this.open = false
    },
    panelChange(value, mode) {
      this.$emit('panelChange', value, mode)
      let dateString = value.format(this.$attrs.valueFormat || this.$attrs.format || 'YYYY')
      let date = this.$attrs.valueFormat ? dateString : value
      this.$emit('input', date)
      this.$emit('change', date, dateString)
      this.open = false
    },
  },
}
</script>

<style lang="less" scoped></style>
