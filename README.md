## 项目功能介绍

这是一个用户管理中心前端项目，主要提供以下功能：

1. 用户认证管理：
   - 用户登录
   - 用户注册
   - 密码修改

2. 用户信息管理：
   - 查看和编辑个人资料
   - 用户头像展示
   - 个人信息维护（昵称、性别、邮箱、手机号等）

3. 用户权限管理：
   - 用户角色区分（普通用户/管理员）
   - 用户状态管理（正常/封禁）

4. 系统功能：
   - 响应式布局界面
   - 用户友好的操作界面
   - 完整的用户信息表格展示

## 清空 node_modules 文件夹
```sh
Remove-Item -Recurse -Force node_modules
```
## 清空 dist 文件夹
```sh
Remove-Item -Recurse -Force dist
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
# 或指定开发模式
npm run dev
```
### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```sh
npm run lint
```

### 调用openapi生成前端接口
```sh
openapi --input http://localhost:8083/api/v2/api-docs --output ./generated --client axios
```