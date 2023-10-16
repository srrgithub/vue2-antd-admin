<template>
  <div class="diboot-tree">
    <a-row style="margin-bottom: 10px" v-if="currentNode[nodeName] && showLabel">
      <a-col :span="24">
        <a-alert type="info" showIcon>
          <template slot="message">
            {{ label }}：{{ currentNode[nodeName] }}
            <a v-if="showCancel" @click="cancelSelect" href="javascript:;" style="margin-left: 10px">取消选中</a>
            <slot name="header" :currentNodeId="currentNodeId"></slot>
          </template>
        </a-alert>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-input-search style="margin-bottom: 8px" placeholder="请输入搜索内容" @change="onSearchChange" allowClear />
      </a-col>
    </a-row>
    <a-tree
      v-bind="$attrs"
      v-on="$listeners"
      :replaceFields="{
        key: nodeKey,
        title: nodeName,
        children: nodeChildrenKey,
      }"
      v-if="treeList?.length > 0"
      @select="onTreeSelect"
      @expand="onExpand"
      :expandedKeys="expandedKeys"
      :autoExpandParent="autoExpandParent"
      :selectedKeys="selectedKeys"
      :treeData="treeList"
    >
      <template slot="title" slot-scope="slotProps">
        <span v-if="slotProps[nodeName].indexOf(searchValue) > -1">
          {{ slotProps[nodeName].substr(0, slotProps[nodeName].indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ slotProps[nodeName].substr(slotProps[nodeName].indexOf(searchValue) + searchValue?.length) }}
        </span>
        <span v-else>{{ slotProps[nodeName] }}</span>
      </template>
    </a-tree>
  </div>
</template>

<script>
import { dibootApi } from '@/utils/request';
import { treeList2list } from '@/utils/treeDataUtil';
import _ from 'lodash';

export default {
  name: 'TreeIndex',
  props: {
    treeData: {
      default() {
        return [];
      },
    },
    treeApi: {
      type: String,
    },
    replaceFields: {
      default() {
        return {
          children: 'children',
          title: 'cname',
          key: 'recId',
        };
      },
    },
    /**
     * tree的头部标题
     */
    label: {
      type: String,
      default: '当前节点',
    },
    // 是否头部显示标题
    showLabel: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否可以取消选中
     */
    showCancel: {
      type: Boolean,
      default: false,
    },
    // 选中节点是否可以取消
    selectCancel: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      treeList: [],
      currentNodeId: 0,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      selectedKeys: [],
      // tree 的key值
      nodeKey: 'recId',
      // tree的显示值
      nodeName: 'cname',
      // tree children键
      nodeChildrenKey: 'children',
    };
  },
  computed: {
    dataList: function () {
      if (this.treeList == null || this.treeList?.length === 0) {
        return [];
      }
      return treeList2list(_.cloneDeep(this.treeList), { children: this.nodeChildrenKey });
    },
    currentNode: function () {
      if (
        this.dataList?.length === 0 ||
        this.currentNodeId === 0 ||
        this.currentNodeId === '0' ||
        this.currentNodeId == null ||
        this.currentNodeId === ''
      ) {
        return {};
      }
      return (
        this.dataList.find((item) => {
          return item[this.nodeKey] === this.currentNodeId || `${item[this.nodeKey]}` === this.currentNodeId;
        }) || {}
      );
    },
  },
  watch: {
    replaceFields: {
      immediate: true,
      deep: true,
      handler(newValue, oldValue) {
        const { key = 'recId', title = 'cname', children = 'children' } = this.replaceFields;
        this.nodeKey = key;
        this.nodeName = title;
        this.nodeChildrenKey = children;
      },
    },
    treeData: {
      immediate: true,
      handler(newValue, oldValue) {
        if (!this.treeApi) {
          this.treeList = newValue || [];
        }
      },
    },
  },
  created() {
    this.loadTree();
  },
  methods: {
    loadTree() {
      if (this.treeApi) {
        dibootApi.get(this.treeApi).then((res) => {
          if (res.code === 0) {
            // this.treeList = this.treeListFormatter(res.data)
            this.treeList = res.data || [];
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.treeList = this.treeData;
      }
    },
    onTreeSelect(selectedKeys, e) {
      if (this.selectCancel) {
        if (selectedKeys && selectedKeys?.length > 0) {
          // 设置当前节点
          this.currentNodeId = selectedKeys[0];
          this.selectedKeys = [selectedKeys[0]];
          this.$emit('changeCurrentNode', this.currentNode);
        } else {
          this.currentNodeId = 0;
          this.selectedKeys = [];
        }
      } else {
        if (selectedKeys && selectedKeys?.length > 0) {
          // 设置当前节点
          this.currentNodeId = selectedKeys[0];
          this.selectedKeys = [selectedKeys[0]];
          this.$emit('changeCurrentNode', this.currentNode);
        }
      }
      // this.$emit('select', selectedKeys, e)
    },

    cancelSelect() {
      this.currentNodeId = 0;
      this.selectedKeys = [];
      this.$emit('changeCurrentNode', this.currentNode);
    },
    onExpand(expandedKeys, e) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
      this.$emit('expand', expandedKeys, e);
    },
    /**
     * 搜索
     */
    onSearchChange(e) {
      const value = e.target.value;
      const expandedKeys = this.getExpandedKeys(this.treeList, value);
      if (expandedKeys?.length > 0) {
        Object.assign(this, {
          expandedKeys,
          searchValue: value,
          autoExpandParent: true,
        });
      }
      this.$emit('onSearchChange', e);
    },
    getExpandedKeys(list, value) {
      const allExpandedKeys = [];
      const expandedKeys = list
        .map((item) => {
          // 对children进行查找
          if (item[this.nodeChildrenKey] && item[this.nodeChildrenKey]?.length > 0) {
            const childrenExpandedKeys = this.getExpandedKeys(item[this.nodeChildrenKey], value);
            if (childrenExpandedKeys?.length > 0) {
              allExpandedKeys.push(...childrenExpandedKeys);
            }
          }
          if (item[this.nodeName].indexOf(value) > -1) {
            return this.getParentKey(item[this.nodeKey], this.treeList);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      if (expandedKeys?.length > 0) {
        allExpandedKeys.push(...expandedKeys);
      }

      return allExpandedKeys;
    },
    getParentKey(key, tree) {
      let parentKey;
      for (let i = 0; i < tree?.length; i++) {
        const node = tree[i];
        const children = node[this.nodeChildrenKey];
        if (children) {
          if (children.some((item) => item[this.nodeKey] === key)) {
            parentKey = node[this.nodeKey];
          } else if (this.getParentKey(key, children)) {
            parentKey = this.getParentKey(key, children);
          }
        }
      }
      return parentKey;
    },
    // 智能展开树状结构，默认只智能展开第一层（有maxCount个以上的节点，第一层收起，maxCount及maxCount个以下的节点，第一层展开）
    getInitSmartExpandedKeys(list, maxCount) {
      if (list?.length > maxCount) {
        return [];
      }
      return list.map((item) => {
        return item[this.nodeKey];
      });
    },
    getInitExpandedKeys(list) {
      const keys = [];
      list.forEach((item) => {
        const children = item[this.nodeChildrenKey];
        if (children && children?.length > 0) {
          keys.push(item[this.nodeKey]);
          keys.push(...this.getInitExpandedKeys(children));
        }
      });
      return keys;
    },
    refresh() {
      this.loadTree();
    },

    /***
     * list格式化
     * @param originTreeList
     * @returns {undefined}
     */
    treeListFormatter(originTreeList) {
      if (!originTreeList || originTreeList?.length === 0) {
        return undefined;
      }
      // const formatterItemList = []
      // originTreeList.forEach((item) => {
      //   const formatterItem = {}
      //   formatterItem.key = item[this.nodeKey]
      //   formatterItem.value = item[this.nodeKey]
      //   formatterItem.title = item[this.nodeName]
      //   formatterItem.scopedSlots = { title: 'title' }
      //   formatterItem.originData = item
      //   const children = this.treeListFormatter(item.children)
      //   if (children != null) {
      //     formatterItem.children = children
      //   }
      //   formatterItemList.push(formatterItem)
      // })
      // 如果需要默认展开所有，则初始化展开数据
      // this.expandedKeys = this.getInitSmartExpandedKeys(formatterItemList, 50)
      this.expandedKeys = this.getInitExpandedKeys(formatterItemList);
      return originTreeList;
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus"></style>
