## 项目功能介绍

这是一个校园周边奖励系统前端项目，主要提供以下功能：

### 用户端功能：
1. 用户认证管理：
   - 用户登录
   - 用户注册
   - 密码修改

2. 积分商城：
   - 浏览商品
   - 兑换商品
   - 查看订单

3. 签到系统：
   - 每日签到获取积分
   - 连续签到奖励
   - 签到记录查看

4. 个人信息管理：
   - 查看和编辑个人资料
   - 用户头像上传
   - 个人信息维护（昵称、性别、邮箱、手机号等）

### 管理端功能：
1. 商品管理：
   - 商品分类管理
   - 商品信息维护

2. 用户管理：
   - 用户信息查看与编辑
   - 用户状态管理

3. 签到管理：
   - 签到规则设置
   - 签到记录查看

4. 订单管理：
   - 用户兑换订单查看
   - 订单状态管理

## 清空 node_modules 文件夹
```sh
Remove-item -Recurse -Force node_modules
```
## 清空 dist 文件夹
```sh
Remove-item -Recurse -Force dist
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
openapi --input http://localhost:8084/api/v2/api-docs --output ./generated --client axios
```