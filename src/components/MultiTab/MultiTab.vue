<script>
import { ADD_INCLUDE, DEL_INCLUDE, INIT_CLUDES } from '@/store/mutation-types';
import { firstLetterUpperCase } from '@/utils/util';
import { mapMutations, mapState } from 'vuex';
import events from './events';
export default {
  name: 'MultiTab',
  data() {
    return {
      fullPathList: [],
      pages: [],
      activeKey: '',
      newTabIndex: 0,
    };
  },
  computed: {
    ...mapState('tagsView', ['include']),
  },
  created() {
    // bind event
    events
      .$on('open', (val) => {
        if (!val) {
          throw new Error(`multi-tab: open tab ${val} err`);
        }
        this.activeKey = val;
      })
      .$on('close', (val) => {
        const targetKey = !val ? this.activeKey : val;
        this.closeThat(targetKey);
        this.autoSelectedPath(targetKey);
      })
      .$on('rename', ({ key, name }) => {
        console.log('rename', key, name);
        try {
          const item = this.pages.find((item) => item.path === key);
          item.meta.customTitle = name;
          this.$forceUpdate();
        } catch (e) {}
      });

    this.pages.push(this.$route);
    this.fullPathList.push(this.$route.fullPath);
    this.autoSelectedPath();
  },
  methods: {
    ...mapMutations('tagsView', [ADD_INCLUDE, DEL_INCLUDE]),
    onEdit(targetKey, action) {
      this[action](targetKey);
      this.autoSelectedPath(targetKey);
    },
    remove(targetKey) {
      let route = this.pages.find((page) => page.fullPath === targetKey);
      if (this.include.includes(firstLetterUpperCase(route.name))) {
        this[DEL_INCLUDE](firstLetterUpperCase(route.name));
      }
      this.pages = this.pages.filter((page) => page.fullPath !== targetKey);
      this.fullPathList = this.fullPathList.filter((path) => path !== targetKey);
    },
    autoSelectedPath(targetKey) {
      // 判断当前标签是否关闭，若关闭则跳转标签页
      if (!this.fullPathList.includes(this.activeKey)) {
        // 点击标签存在，则跳转当前点击页签，反之跳转最后一个页签
        this.activeKey = this.fullPathList.includes(targetKey) ? targetKey : this.fullPathList[this.fullPathList.length - 1];
      }
    },
    // content menu
    closeThat(e) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (this.fullPathList.length > 1) {
        this.remove(e);
      } else {
        this.$message.info('这是最后一个标签了, 无法被关闭');
      }
    },
    closeLeft(e) {
      const currentIndex = this.fullPathList.indexOf(e);
      if (currentIndex > 0) {
        this.fullPathList.forEach((item, index) => {
          if (index < currentIndex) {
            this.remove(item);
          }
        });
      } else {
        this.$message.info('左侧没有标签');
      }
    },
    closeRight(e) {
      const currentIndex = this.fullPathList.indexOf(e);
      if (currentIndex < this.fullPathList.length - 1) {
        this.fullPathList.forEach((item, index) => {
          if (index > currentIndex) {
            this.remove(item);
          }
        });
      } else {
        this.$message.info('右侧没有标签');
      }
    },
    closeOther(e) {
      const currentIndex = this.fullPathList.indexOf(e);
      this.fullPathList.forEach((item, index) => {
        if (index !== currentIndex) {
          this.remove(item);
        }
      });
    },
    closeMenuClick(key, route) {
      this[key](route);
      this.autoSelectedPath(route);
    },
    renderTabPaneMenu(e) {
      return (
        <a-menu
          {...{
            on: {
              click: ({ key, item, domEvent }) => {
                this.closeMenuClick(key, e);
              },
            },
          }}
        >
          <a-menu-item key='closeThat'>关闭当前页签</a-menu-item>
          <a-menu-item key='closeOther'>关闭其他页签</a-menu-item>
          <a-menu-item key='closeRight'>关闭右侧页签</a-menu-item>
          <a-menu-item key='closeLeft'>关闭左侧页签</a-menu-item>
        </a-menu>
      );
    },
    // render
    renderTabPane(title, keyPath) {
      const menu = this.renderTabPaneMenu(keyPath);

      return (
        <a-dropdown overlay={menu} trigger={['contextmenu']}>
          <span style={{ userSelect: 'none' }}>{title}</span>
        </a-dropdown>
      );
    },
  },
  watch: {
    $route: function (newVal) {
      this.activeKey = newVal.fullPath;
      if (this.fullPathList.indexOf(newVal.fullPath) < 0 && newVal?.meta?.showTab !== false) {
        this.fullPathList.push(newVal.fullPath);
        this.pages.push(newVal);
        if (newVal?.meta?.keepAlive) {
          this[ADD_INCLUDE](firstLetterUpperCase(newVal.name));
        }
      }
    },
    activeKey: function (newPathKey) {
      this.$router.push({ path: newPathKey });
    },
  },
  render() {
    const {
      onEdit,
      $data: { pages },
    } = this;
    const panes = pages.map((page) => {
      return (
        <a-tab-pane
          style={{ height: 0 }}
          tab={this.renderTabPane(page.meta.customTitle || page.meta.title, page.fullPath)}
          key={page.fullPath}
          closable={pages.length > 1}
        ></a-tab-pane>
      );
    });

    return (
      <div class='ant-pro-multi-tab'>
        <div class='ant-pro-multi-tab-wrapper'>
          <a-tabs
            hideAdd
            type={'editable-card'}
            v-model={this.activeKey}
            tabBarStyle={{ background: '#FFF', margin: 0, paddingLeft: '16px', paddingTop: '1px' }}
            {...{ on: { edit: onEdit } }}
          >
            {panes}
          </a-tabs>
        </div>
      </div>
    );
  },
};
</script>
