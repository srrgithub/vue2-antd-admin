<script>
export default {
  name: 'TimeLine',
  props: {
    data: {
      default() {
        return [
          // {
          //   create: '2023-08-13 09:37:52',
          //   end: '2023-08-13 09:37:52',
          //   taskName: '队长',
          //   opinion: '通过',
          // },
          // {
          //   create: '2023-08-13 09:37:52',
          //   end: '2023-08-13 09:37:52',
          //   taskName: '工程师',
          //   opinion: '进行中',
          // },
          // {
          //   create: '2023-08-13 09:37:52',
          //   end: '2023-08-13 09:37:52',
          //   taskName: '总工',
          //   opinion: '待处理',
          // },
        ]
      },
    },
  },
  data() {
    return {
      dataRender: (record, index) => {
        const isLast = index === this.data.length - 1
        return (
          <div class="time-line">
            <div class={isLast ? 'header isLast' : 'header'}>
              <span class="item-name"> {record?.taskName}</span> {record?.opinion}
            </div>
            <div>开始时间：{record?.create}</div>
            <div>{record?.end ? `结束时间：${record?.end}` : ''}</div>
          </div>
        )
      },
    }
  },
  methods: {
    getIcon(item, index) {
      // let iconType = typeof item?.iconType == 'fucntion' ? item?.iconType() : item.iconType

      if (index === 0) {
        return <a-button slot="dot" type="primary" shape="circle" size="small" icon="check" />
      }

      if (index === this.data.length - 1) {
        return (
          <a-button slot="dot" type="" shape="circle" size="small">
            {index + 1}
          </a-button>
        )
      }

      return (
        <a-button slot="dot" type="primary" shape="circle" size="small">
          {index + 1}
        </a-button>
      )
    },
  },
  render() {
    const { data, getIcon, dataRender } = this
    return data?.length ? (
      <a-timeline>
        {data.map((item, index) => (
          <a-timeline-item key={index}>
            {getIcon(item, index)}
            {dataRender(item, index)}
          </a-timeline-item>
        ))}
      </a-timeline>
    ) : (
      <a-empty />
    )
  },
}
</script>

<style lang="less" scoped>
.time-line {
  line-height: 40px;
  padding-bottom: 20px;
}
.header {
  font-weight: 600;
  color: #87d068;
  line-height: 26px;
  &.isLast {
    color: #1890ff;
  }
}
.item-name {
  width: 50%;
  display: inline-block;
  color: #000;
}
/deep/ .ant-timeline-item {
  padding-bottom: 0px;
  min-height: 70px;
  .ant-timeline-item-content {
    margin-left: 25px;
  }
}
</style>
