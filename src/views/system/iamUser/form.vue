<template>
  <a-drawer :title="title" :width="720" @close="close" :visible="state.visible" :body-style="{ paddingBottom: '80px' }">
    <a-form layout="vertical" :form="form">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="所属部门">
            <template v-if="orgTreeList.length > 0">
              <a-tree-select
                placeholder="请选择所属部门"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                :treeData="orgTreeList"
                treeNodeFilterProp="title"
                showSearch
                treeDefaultExpandAll
                v-decorator="[
                  'orgId',
                  {
                    rules: [{ required: true, message: '请选择上级部门' }],
                    initialValue: model.orgId != null ? `${model.orgId}` : currentNodeId,
                  },
                ]"
              >
              </a-tree-select>
            </template>
            <template v-else> 无 </template>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="用户名">
            <a-input
              readOnly
              onfocus="this.removeAttribute('readonly');"
              onblur="this.setAttribute('readonly',true);"
              placeholder="请输入用户名"
              v-decorator="[
                'username',
                {
                  initialValue: model.username,
                  rules: [{ required: true, message: '用户名不能为空', whitespace: true }, { validator: this.checkUsernameDuplicate }],
                },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="用户编号">
            <a-input
              placeholder="请输入用户编号"
              v-decorator="[
                'userNum',
                {
                  initialValue: model.userNum,
                  rules: [{ required: true, message: '用户编号不能为空', whitespace: true }, { validator: this.checkUserNumDuplicate }],
                },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="姓名">
            <a-input
              placeholder="请输入姓名"
              v-decorator="[
                'realname',
                {
                  initialValue: model.realname,
                  rules: [{ required: true, message: '姓名不能为空', whitespace: true }],
                },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="角色">
            <a-select
              :getPopupContainer="getPopupContainer"
              mode="multiple"
              placeholder="请选择角色"
              v-decorator="[
                'roleIdList',
                {
                  initialValue:
                    model.roleList &&
                    model.roleList.map((role) => {
                      return `${role.id}`;
                    }),
                  rules: [{ required: true, message: '角色不能为空' }],
                },
              ]"
            >
              <a-select-option v-for="(role, index) in more.iamRoleOptions" :key="index" :value="`${role.value}`">
                {{ role.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="性别">
            <a-select
              :getPopupContainer="getPopupContainer"
              placeholder="请选择"
              v-decorator="[
                'gender',
                {
                  initialValue: model.gender,
                  rules: [{ required: true, message: '性别不能为空' }],
                },
              ]"
            >
              <a-select-option v-for="(gender, index) in more.genderOptions" :key="index" :value="gender.value">
                {{ gender.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="状态">
            <a-select
              :getPopupContainer="getPopupContainer"
              placeholder="请选择"
              v-decorator="[
                'status',
                {
                  initialValue: model.status,
                  rules: [{ required: true, message: '用户状态不能为空' }],
                },
              ]"
            >
              <a-select-option v-for="(status, index) in more.userStatusOptions" :key="index" :value="status.value">
                {{ status.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="电话">
            <a-input
              placeholder="请输入电话"
              v-decorator="[
                'mobilePhone',
                {
                  initialValue: model.mobilePhone,
                  rules: [{ pattern: patternMap.mphone, message: '请正确输入电话' }],
                },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="邮箱">
            <a-input
              placeholder="xxx@xxx.com"
              v-decorator="[
                'email',
                {
                  initialValue: model.email,
                  rules: [{ pattern: patternMap.email, message: '请正确输入邮箱' }],
                },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="密码">
            <a-button v-if="setPassword === false" @click="setPassword = true" size="small" type="primary">重设密码</a-button>
            <a-input
              readOnly
              onfocus="this.removeAttribute('readonly');"
              onblur="this.setAttribute('readonly',true);"
              v-if="setPassword === true"
              type="password"
              v-decorator="[
                'password',
                {
                  initialValue: '',
                  rules: [{ required: true, message: '密码不能为空', whitespace: true }],
                  rules: [
                    { required: true, message: '密码不能为空', whitespace: true },
                    { pattern: patternMap.password, message: '数字+大小写字母+特殊字符,长度不小于8位' },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="drawer-footer">
      <a-button @click="close">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import form from '@/components/diboot/mixins/form';
import { dibootApi } from '@/utils/request';
import { decryptData, doEncrypt } from '@/utils/secrecy';
import { treeListFormatter } from '@/utils/treeDataUtil';
import { patternMap } from '@/utils/util';
import _ from 'lodash';

export default {
  name: 'IamUserForm',

  data() {
    return {
      baseApi: '/iam/user',
      form: this.$form.createForm(this),
      orgList: [],
      noAutocomplete: false,
      patternMap,
      setPassword: false,
      attachMoreList: [
        {
          target: 'GENDER',
        },
        {
          target: 'USER_STATUS',
        },
        {
          target: 'iamRole',
          label: 'name',
          value: 'id',
        },
      ],
    };
  },
  created() {
    this.noAutocomplete = true;
  },
  methods: {
    async open(id, ...args) {
      this.state.visible = true;
      await this.beforeOpen(id, ...args);
      if (id == null) {
        // 没有id数据则认为是新增
        this.model = {};
        this.title = '新增';
        this.afterOpen(id, ...args);
      } else {
        // 否则作为更新处理
        this.state.formDataLoading = true;
        try {
          const res = await dibootApi.get('/iam/user/editShow', { id: id });
          if (res.code === 0) {
            let models = res.data || {};
            if (models?.mobilePhone) {
              models.mobilePhone = decryptData(models?.mobilePhone);
            }
            if (models?.email) {
              models.email = decryptData(models?.email);
            }

            this.model = models || {};
            this.title = '编辑';
            this.state.visible = true;
            this.state.formDataLoading = false;
            this.afterOpen(id, ...args);
          } else {
            this.$notification.error({
              message: '获取表单数据失败，请重试',
              description: res.msg,
            });
            this.close();
            return false;
          }
        } catch (e) {
          this.$message.error('获取数据出错，请重试');
          this.close();
          return false;
        }
      }
      await this.attachMore();
    },

    async onSubmit() {
      this.state.confirmSubmit = true;
      try {
        const values = await this.validate();

        await this.enhance(values);
        let result = {};
        if (this.model[this.primaryKey] == null) {
          // 新增该记录
          let params = this.rebuildValues(values);

          if (params?.email) {
            params.email = doEncrypt(params?.email);
          }
          if (params?.password) {
            params.password = doEncrypt(params?.password);
          }

          if (params?.mobilePhone) {
            params.mobilePhone = doEncrypt(params?.mobilePhone);
          }

          result = await this.add(params);
        } else {
          // 更新该记录
          // values[this.primaryKey] = this.model[this.primaryKey]
          // 更新要传所有字段， 不传会被覆盖
          let mergeValues = { ...(this.model || {}), ...values };
          delete mergeValues.recCreator;
          delete mergeValues.creatorName;
          delete mergeValues.recCreateTime;
          delete mergeValues.recRevisor;
          delete mergeValues.recRevisorName;
          delete mergeValues.recReviseTime;

          let params = this.rebuildValues(mergeValues);

          if (params?.email) {
            params.email = doEncrypt(params?.email);
          }
          if (params?.password) {
            params.password = doEncrypt(params?.password);
          }

          if (params?.mobilePhone) {
            params.mobilePhone = doEncrypt(params?.mobilePhone);
          }

          result = await this.update(params);
        }

        // 执行提交成功后的一系列后续操作
        this.state.confirmSubmit = false;
        this.submitSuccess(result);
      } catch (e) {
        console.error(e);
        // 执行一系列后续操作
        this.state.confirmSubmit = false;
        this.submitFailed(e);
      }
    },
    async afterOpen(id) {
      // 新增显示密码填写，更新隐藏密码填写
      if (id == null) {
        this.setPassword = true;
      } else {
        this.setPassword = false;
      }
      // 加载部门树数据
      this.loadOrgTree();
      // 获取account的username信息到表单中
      this.loadUsername();
    },
    async loadOrgTree() {
      const res = await dibootApi.get(`/iam/org/tree`);
      if (res.code === 0) {
        this.orgList = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },
    async loadUsername() {
      const id = this.model.id;
      if (id != null) {
        const res = await dibootApi.get(`${this.baseApi}/getUsername/${id}`);
        if (res.code === 0 && res.data) {
          this.systemUser = true;
          setTimeout(() => {
            this.form.setFieldsValue({ username: res.data });
          }, 200);
        }
      }
    },
    async checkUsernameDuplicate(rule, value, callback) {
      if (!value) {
        callback();
        return;
      }
      const params = { id: this.model.id, username: value };
      const res = await dibootApi.get(`${this.baseApi}/checkUsernameDuplicate`, params);
      if (res.code === 0) {
        callback();
      } else {
        callback(res.msg.split(':')[1]);
      }
    },
    async checkUserNumDuplicate(rule, value, callback) {
      if (!value) {
        callback();
        return;
      }
      const params = { id: this.model.id, userNum: value };
      const res = await dibootApi.get(`${this.baseApi}/checkUserNumDuplicate`, params);
      if (res.code === 0) {
        callback();
      } else {
        callback(res.msg.split(':')[1]);
      }
    },
    afterClose() {
      this.setPassword = false;
    },
  },

  computed: {
    orgTreeList: function () {
      if (this.orgList == null || this.orgList.length === 0) {
        return [];
      }
      const orgTreeList = treeListFormatter(_.cloneDeep(this.orgList), 'id', 'shortName', true);
      orgTreeList.unshift({ title: '无', value: '0', key: '0' });
      return orgTreeList;
    },
  },
  mixins: [form],
  props: {
    currentNodeId: {
      type: String,
      default: () => {
        return '0';
      },
    },
  },
};
</script>

<style lang="less" scoped></style>
