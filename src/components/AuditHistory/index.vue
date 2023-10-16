<template>
  <a-drawer
    class="detail-wrapper"
    :title="title"
    :width="720"
    @close="close"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <TimeLine :data="data" />

    <div class="drawer-footer">
      <a-button @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'
import TimeLine from '@/components/TimeLine/'
import { dibootApi } from '@/utils/request'
export default {
  name: 'TableExamineDetail',
  mixins: [detail],
  components: {
    TimeLine,
  },
  data() {
    return {
      baseApi: '/team/tableExamine',
      data: [],
    }
  },
  methods: {
    onAfterOpen() {
      // 事件处理代码
    },
    afterOpen() {
      this.onAfterOpen()
    },
    async open(id) {
      const res = await dibootApi.get(`/flow/getSpeed/${id}`)
      if (res.code === 0) {
        this.model = res.data
        this.data = res.data?.taskInfoList
        this.title = '查看流程'
        this.visible = true
        this.afterOpen(id)
      } else {
        this.$notification.error({
          message: '获取详情信息失败',
          description: res.msg,
        })
      }
    },
  },
}
</script>
<style lang="less" scoped></style>
