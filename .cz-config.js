module.exports = {
  types: [
    {
      value: '✨ feat: ',
      name: '✨ feat:     新功能',
    },
    {
      value: '🐛 fix:',
      name: '🐛 fix:      bug修复',
    },
    {
      value: '👌 conflict:',
      name: '👌 conflict: 代码冲突解决',
    },
    {
      value: '🚀 chore:',
      name: '🚀 chore:    依赖/构建/工具修改',
    },
    {
      value: '⚡️ perf:',
      name: '⚡️ perf:     性能优化',
    },
    {
      value: '💄 style:',
      name: '💄 style:    不影响代码含义的更改(空格、格式、缺少分号等)',
    },
    {
      value: '♻️  refactor:',
      name: '♻️  refactor: 代码重构(既不修复错误也不添加功能)',
    },
    {
      value: '✏️  docs:',
      name: '✏️  docs:     文档变更',
    },
    {
      value: '🎉 release:',
      name: '🎉 release:  发布版本',
    },
    {
      value: '✅ test:',
      name: '✅ test:     测试用例/单元测试',
    },
    {
      value: '⏪️ revert:',
      name: '⏪️ revert:   回退',
    },

    {
      value: '👷 ci:',
      name: '👷 ci:       CI/CD自动化',
    },
  ],
  messages: {
    type: '请选择提交类型(必填)',
    customScope: '请输入文件修改范围(可选)',
    subject: '请输入提交信息(必填)',
    body: '请输入详细描述(可选)',
    breaking: '列出任何BREAKING CHANGES(可选)',
    footer: '请输入要关闭的issue(可选)',
    confirmCommit: '确定提交此说明吗？',
  },
  allowCustomScopes: false,
  skipEmptyScopes: true,
  subjectSeparator: ' ',
  typeSuffix: '',
  skipQuestions: ['scope', 'body', 'footer'],
  subjectLimit: 72,
};
