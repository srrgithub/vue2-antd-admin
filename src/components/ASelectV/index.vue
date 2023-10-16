<template>
  <a-select
    v-bind="$attrs"
    v-on="$listeners"
    v-model="selectId"
    @blur="onBlur"
    @search="handleSearch"
    @change="handleChange"
    @popupScroll="handlePopupScroll"
  >
    <template v-if="isBol">
      <a-select-option value=""> -- 请选择 -- </a-select-option>
    </template>
    <a-select-option v-for="item in partList || []" :key="item[valueField]">
      {{ item[labelField] }}
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  name: 'ASelectV',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      default: undefined,
    },
    optionList: {
      type: Array,
      default: () => [],
    },
    labelField: {
      type: String,
      default: 'label',
    },
    valueField: {
      type: String,
      default: 'value',
    },
    isBol: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectId: undefined,
      partList: [],
      scrollPage: 1,
      pageSize: 30,
      keyWords: null,
      timer: null,
    };
  },
  mounted() {
    // this.loadOption()
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          if (this.selectId != val) {
            this.selectId = val;
            this.loadOption();
          }
        } else {
          this.selectId = val;
        }
      },
    },
    optionList: {
      immediate: true,
      handler(newValue, oldValue) {
        if (newValue?.length) {
          if (this.value != undefined && this.value !== '') {
            this.partList = this.optionList.filter((item) => item[this.valueField] == this.value);
            setTimeout(() => {
              this.loadOption();
            }, 0);
          } else {
            this.loadOption();
          }
        }
      },
    },
  },

  methods: {
    handlePopupScroll(e) {
      // e.persist()
      const { target } = e;
      // scrollHeight：代表包括当前不可见部分的元素的高度
      // scrollTop：代表当有滚动条时滚动条向下滚动的距离，也就是元素顶部被遮住的高度
      // clientHeight：包括padding但不包括border、水平滚动条、margin的元素的高度
      const rmHeight = target.scrollHeight - target.scrollTop;
      const clHeight = target.clientHeight;
      // 当下拉框失焦的时候，也就是不下拉的时候
      if (rmHeight === 0 && clHeight === 0) {
        this.scrollPage = 1;
      } else {
        // 当下拉框下拉并且滚动条到达底部的时候
        // 可以看成是分页，当滚动到底部的时候就翻到下一页
        if (rmHeight < clHeight + 5) {
          const scrollPage = this.scrollPage;
          this.scrollPage = scrollPage + 1;
          //调用处理数据的函数增加下一页的数据
          this.loadOption(scrollPage + 1);
        }
      }
    },
    loadOption(pageIndex = 1) {
      if (!this.optionList?.length) return [];

      let data = this.optionList;

      const { pageSize, keyWords } = this;
      // 通过每页的数据条数和页数得到总的需要展示的数据条数
      const newPageSize = pageSize * pageIndex;
      let newOptionsData = [],
        len; // len 能展示的数据的最大条数
      if (data.length > newPageSize) {
        // 如果总数据的条数大于需要展示的数据
        len = newPageSize;
      } else {
        // 否则
        len = data.length;
      }
      // 如果有搜索的话，就走这里
      if (!!keyWords) {
        let data_ = data.filter((item) => item[this.labelField].indexOf(keyWords) > -1) || [];
        data_.forEach((item, index) => {
          if (index < len) {
            newOptionsData.push(item);
          }
        });
      } else {
        data.forEach((item, index) => {
          if (index < len) {
            newOptionsData.push(item);
          }
        });
      }
      // this.partList = newOptionsData
      this.partList = Array.from(new Set(newOptionsData));
    },
    handleSearch(val) {
      if (!this.timer) {
        const that = this;
        this.timer = setTimeout(function () {
          that.searchValue(val);
          that.timer = null;
        }, 200);
      }
      this.keyWords = val;
    },
    searchValue(value) {
      let data = this.optionList;
      let data_ = data.filter((item) => item[this.labelField].indexOf(value) > -1);
      if (data_.length > this.pageSize || value === '') {
        data_ = data_.slice(0, this.pageSize);
      }
      this.partList = Array.from(new Set(data_));
    },
    handleChange(val) {
      this.$emit('change', val);
    },
    onBlur() {
      this.scrollPage = 1;
      this.keyWords = null;
      this.loadOption();
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  },
};
</script>

<style></style>
