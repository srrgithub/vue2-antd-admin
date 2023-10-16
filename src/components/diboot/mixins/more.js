import { dibootApi } from '@/utils/request';
import { firstLetterLowerCase, firstLetterUpperCase } from '@/utils/util';
export default {
  data() {
    return {
      // 是否从当前业务的attachMore接口中自动获取关联数据
      getMore: false,
      // 获取关联数据列表的配置列表
      attachMoreList: [],
      // 远程过滤关联数据列表的配置对象
      attachMoreLoader: {},
      // 远程过滤加载状态
      attachMoreLoading: false,
      // 关联相关的更多数据
      more: {},
      // 控制，用于级联控制选择的选择加载控制
      control: {},
    };
  },
  methods: {
    afterAttachMore() {},
    /**
     * 加载当前页面关联的对象或者字典
     */
    async attachMore() {
      const reqList = [];
      // 个性化接口
      this.getMore === true && reqList.push(dibootApi.get(`${this.baseApi}/attachMore`));
      // 通用获取当前对象关联的数据的接口
      this.attachMoreList.length > 0 && reqList.push(dibootApi.post('/common/attachMore', this.attachMoreList));
      if (reqList.length > 0) {
        const resList = await Promise.all(reqList);
        resList.forEach((res) =>
          res.ok
            ? Object.keys(res.data).forEach((key) => this.$set(this.more, key, res.data[key]))
            : this.$notification.error({
                title: '获取选项数据失败',
                message: res.msg,
              })
        );
      }
      this.afterAttachMore(this.more);
    },
    // 自定义字典查询
    afterAttachMoreCustom() {},
    async attachMoreCustom(attachMoreList) {
      // 1.LINE_STAGE 2.TMmSupplierInfo  => lineStageOptions , tMmSupplierInfoOptions
      let keyObj = attachMoreList.reduce((total, cur) => {
        let key = cur.target;
        if (key.indexOf('_') >= 0) {
          key = key
            .split('_')
            .map((str, index) => (index == 0 ? str.toLocaleLowerCase() : firstLetterUpperCase(str.toLocaleLowerCase())))
            .join('');
        } else {
          key = firstLetterLowerCase(key);
        }
        total[key + 'Options'] = cur;
        return total;
      }, {});

      await dibootApi.post('/common/attachMore', attachMoreList).then((res) => {
        res.ok
          ? Object.keys(res.data).forEach((key) => {
              // console.log('keyObj[key]?.moreKey ', key, keyObj[key]);
              this.$set(this.more, keyObj[key]?.moreKey || key, res.data[key]);
            })
          : this.$notification.error({
              title: '获取选项数据失败',
              message: res.msg,
            });
      });
      this.afterAttachMoreCustom(this.more);
    },
    /**
     * 远程过滤加载选项
     *
     * @param value 输入值
     * @param loader 加载器类型
     */
    async attachMoreFilter(value, loader) {
      if (value == null || (value = value.trim()).length === 0) {
        this.$set(this.more, `${loader}Options`, []);
        return;
      }
      this.attachMoreLoading = true;
      const moreLoader = this.attachMoreLoader[loader];
      moreLoader.keyword = value;
      this.$set(this.more, `${loader}Options`, await this.loadAttachMore(moreLoader));
      this.attachMoreLoading = false;
    },
    /**
     * 加载AttachMore
     *
     * @param moreLoader 加载器
     * @param node 节点（可空）
     */
    async loadAttachMore(moreLoader, node = {}) {
      if (moreLoader.disabled) {
        return;
      }
      const build = (item) => (item ? `/${item}` : '');
      const res = await dibootApi.post('/common/attachMoreFilter' + build(node.type) + build(node.value), moreLoader);
      if (res.ok) {
        return res.data;
      } else {
        this.$notification.error({
          title: '获取选项数据失败',
          message: res.msg,
        });
      }
    },
    /**
     * 异步加载更多
     *
     * @param node 当前节点
     * @param loader 加载器名称
     */
    async lazyLoadMore(node, loader) {
      const targetNode = node[node.length - 1];
      targetNode.loading = true;
      const moreLoader = this.attachMoreLoader[loader];
      const dataLsit = (await this.loadAttachMore(moreLoader, targetNode)) || [];
      dataLsit.length === 0 && moreLoader.next != null && this.$set(targetNode, 'disabled', true);
      targetNode.children = dataLsit.map((e) => {
        e.isLeaf = e.isLeaf || false;
        return e;
      });
      targetNode.loading = false;
      this.$set(this.more, `${loader}Options`, [...this.more[`${loader}Options`]]);
    },
    /**
     * 控制相关选项的获取
     *
     * @param value 选项值
     * @param control 控制器名称
     * @param resetValue 是否需要重置被控属性值
     */
    controlRelationOptions(value, control, resetValue = true) {
      const controlItem = this.control[control];
      const isNull = value == null || value.length === 0;
      const execute = async ({ name, loader, condition, lazy }) => {
        const moreLoader = this.attachMoreLoader[loader];
        moreLoader.disabled = isNull;
        moreLoader.condition == null && (moreLoader.condition = {});
        moreLoader.condition[condition] = value;
        if (resetValue) {
          const obj = {};
          obj[name] = undefined;
          this.form.setFieldsValue(obj);
        }
        this.$set(this.more, `${loader}Options`, isNull || lazy ? [] : await this.loadAttachMore(moreLoader));
      };
      controlItem instanceof Array ? controlItem.forEach((item) => execute(item)) : execute(controlItem || {});
    },
  },
};

// /**
//  * attachMore 用于加载关联数据传递的DTO格式
//  * <p>
//  * [{target: 'Category', label: 'name’, value: 'id'}, {target: 'GENDER'}]
//  * </p>
//  *
//  * @author mazc@dibo.ltd
//  * @version v2.0
//  * @date 2018/12/27
//  */
// @Getter
// @Setter
// @Accessors(chain = true)
// public class AttachMoreDTO implements Serializable {
//     private static final long serialVersionUID = 10301L;

//     /**
//      * 关联类型
//      */
//     @Deprecated
//     public enum REF_TYPE {
//         /**
//          * 绑定的是对象
//          */
//         T,
//         /**
//          * 绑定的是字典
//          */
//         D
//     }

//     /**
//      * 关联的类型
//      */
//     @Deprecated
//     private REF_TYPE type;

//     /**
//      * <h3>需要查询的目标数据<br/>当label 为空时，则为获取字典，否则获取对象</h3>
//      * target应为 实体名 或 字典的type{@link Dictionary#type}
//      */
//     @NotNull(message = "查询类型不能为空！")
//     private String target;

//     /**
//      * <h3>别名</h3>
//      * 仅在批量获取选项时生效
//      */
//     private String alias;

//     /**
//      * <h3>需要查询的label字段</h3>
//      * 当为空时，则为获取字典，label为{@link Dictionary#itemName}
//      */
//     private String label;

//     /**
//      * <h3>需要查询的value字段</h3>
//      * 当获取对象时，value默认为主键字段；<br/>
//      * 当获取字典时，value为{@link Dictionary#itemValue}
//      */
//     private String value;

//     /**
//      * <h3>需要查询的ext字段</h3>
//      * 当获取字典时，ext为表中{@link Dictionary#extdata}
//      */
//     private String ext;

//     /**
//      * <h3>筛选条件</h3>
//      * 可重写{@link BaseController#buildAttachMoreCondition(AttachMoreDTO, QueryWrapper, Function)}进行自定义筛选条件规则
//      */
//     private Map<String, Object> condition;  示例：condition : { name: 'xx' } | { name: ['xx', 'yy'] }

//     /**
//      * <h3>关键字</h3>
//      * 用于前端远程搜索label
//      */
//     private String keyword;

//     /**
//      * <h3>排序</h3>
//      * 示例 `id:DESC,age:ASC`
//      */
//     private String orderBy;

//     /**
//      * <h3>父级关联属性</h3>
//      * 存储关联数据的属性
//      */
//     private String parent;

//     /**
//      * <h3>是否构建树</h3>
//      * 仅且第一层生效
//      */
//     private boolean tree;

//     /**
//      * <h3>异步加载</h3>
//      * 推荐异步加载，默认为true；为false时会同步加载下一级，且当为树时会加载整个树
//      */
//     private boolean lazy = true;

//     /**
//      * <h3>下一层</h3>
//      */
//     private AttachMoreDTO next;

//     @JsonIgnore
//     public String getTargetClassName(){
//         return S.capFirst(S.toLowerCaseCamel(this.target));
//     }

// }
