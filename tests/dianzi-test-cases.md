# Test Cases: 点子项目 (Idea Lab)

## Overview
- **Feature**: 点子项目 - 创意孵化平台
- **Requirements Source**: docs/dianzi-prd.md
- **Test Coverage**: 7个用户故事 + 5个核心功能模块
- **Last Updated**: 2026-01-21

---

## 1. 首页展示 (US-1, US-6, F1)

### Functional Tests

#### TC-F-001: 首页 Hero 区域展示
- **Requirement**: US-1 首页展示已完成点子
- **Priority**: High
- **Preconditions**:
  - 应用正常运行
- **Test Steps**:
  1. 访问首页 `/`
  2. 检查 Hero 区域内容
- **Expected Results**:
  - Hero 区域包含平台标题和副标题
  - 显示两个 CTA 按钮：「提交点子」和「浏览工具」
  - CTA 按钮可点击且链接正确
- **Postconditions**: 无

#### TC-F-002: 首页展示已完成点子卡片
- **Requirement**: US-1, US-6 首页展示已完成点子
- **Priority**: High
- **Preconditions**:
  - 数据库中存在状态为「已完成」的点子
- **Test Steps**:
  1. 访问首页 `/`
  2. 滚动至工具展示区域
  3. 检查卡片内容
- **Expected Results**:
  - 以卡片网格布局展示所有「已完成」状态的点子
  - 每张卡片显示：标题、描述摘要、标签
  - 按完成时间倒序排列
- **Postconditions**: 无

#### TC-F-003: 导航栏功能
- **Requirement**: F1 首页
- **Priority**: High
- **Preconditions**:
  - 用户未登录
- **Test Steps**:
  1. 访问首页
  2. 检查导航栏元素
  3. 点击各导航项
- **Expected Results**:
  - 导航栏包含：Logo、首页、提交点子、登录按钮
  - Logo 和首页链接到 `/`
  - 提交点子链接到 `/submit`
  - 登录按钮链接到 `/login`
- **Postconditions**: 无

#### TC-F-004: 已登录用户导航栏显示
- **Requirement**: F1 首页
- **Priority**: Medium
- **Preconditions**:
  - 用户已登录
- **Test Steps**:
  1. 以登录用户访问首页
  2. 检查导航栏
- **Expected Results**:
  - 登录按钮替换为用户头像/用户中心入口
  - 显示用户相关菜单
- **Postconditions**: 无

### Edge Case Tests

#### TC-E-001: 首页空状态展示
- **Requirement**: US-1 空状态显示引导文案
- **Priority**: Medium
- **Preconditions**:
  - 数据库中无「已完成」状态的点子
- **Test Steps**:
  1. 访问首页 `/`
  2. 查看工具展示区域
- **Expected Results**:
  - 显示空状态引导文案（如「暂无已完成的工具，快来提交你的点子吧！」）
  - 不显示空的卡片网格
- **Postconditions**: 无

#### TC-E-002: 响应式布局 - 移动端
- **Requirement**: US-1 支持响应式布局
- **Priority**: High
- **Preconditions**:
  - 使用移动端设备或模拟器 (375px 宽度)
- **Test Steps**:
  1. 在移动端访问首页
  2. 检查卡片布局
- **Expected Results**:
  - 卡片以单列布局展示
  - 所有内容可正常显示，无水平滚动
  - Hero 区域适配移动端
- **Postconditions**: 无

#### TC-E-003: 响应式布局 - 桌面端
- **Requirement**: US-1 支持响应式布局
- **Priority**: High
- **Preconditions**:
  - 使用桌面端浏览器 (1024px+ 宽度)
- **Test Steps**:
  1. 在桌面端访问首页
  2. 检查卡片布局
- **Expected Results**:
  - 卡片以多列网格布局展示
  - 利用屏幕宽度，一行显示多个卡片
- **Postconditions**: 无

#### TC-E-004: 点子状态变更后首页更新
- **Requirement**: US-6 状态变更后首页自动更新
- **Priority**: High
- **Preconditions**:
  - 存在「开发中」状态的点子
- **Test Steps**:
  1. 管理员将点子状态改为「已完成」
  2. 刷新首页
  3. 管理员将点子状态改回「开发中」
  4. 刷新首页
- **Expected Results**:
  - 状态变为「已完成」后，点子出现在首页
  - 状态从「已完成」变更后，点子从首页移除
- **Postconditions**: 无

---

## 2. 用户注册与登录 (US-2, F2)

### Functional Tests

#### TC-F-005: 用户注册成功
- **Requirement**: US-2 用户注册
- **Priority**: High
- **Preconditions**:
  - 访客未登录
  - 使用未注册的邮箱
- **Test Steps**:
  1. 访问注册页 `/register`
  2. 输入有效邮箱
  3. 输入密码（6位以上）
  4. 输入确认密码（与密码一致）
  5. 点击注册按钮
- **Expected Results**:
  - 注册成功
  - 自动登录或跳转至登录页
  - 显示成功提示
- **Postconditions**: 用户账户已创建

#### TC-F-006: 用户登录成功
- **Requirement**: US-2 用户登录
- **Priority**: High
- **Preconditions**:
  - 用户已注册
- **Test Steps**:
  1. 访问登录页 `/login`
  2. 输入正确的邮箱
  3. 输入正确的密码
  4. 点击登录按钮
- **Expected Results**:
  - 登录成功
  - 跳转至用户中心 `/dashboard`
- **Postconditions**: 用户已登录

#### TC-F-007: 登录状态持久化
- **Requirement**: US-2 登录状态持久化
- **Priority**: High
- **Preconditions**:
  - 用户已登录
- **Test Steps**:
  1. 刷新页面
  2. 关闭浏览器标签页，重新打开
  3. 检查登录状态
- **Expected Results**:
  - 刷新后仍保持登录状态
  - 重新打开后仍保持登录状态
- **Postconditions**: 无

### Edge Case Tests

#### TC-E-005: 注册 - 密码边界值（6位）
- **Requirement**: US-2 密码最少6位
- **Priority**: Medium
- **Preconditions**:
  - 使用未注册的邮箱
- **Test Steps**:
  1. 访问注册页
  2. 输入有效邮箱
  3. 输入正好6位密码
  4. 确认密码
  5. 提交
- **Expected Results**:
  - 注册成功（6位为最小有效长度）
- **Postconditions**: 无

### Error Handling Tests

#### TC-ERR-001: 注册 - 无效邮箱格式
- **Requirement**: US-2 邮箱格式验证
- **Priority**: High
- **Preconditions**:
  - 无
- **Test Steps**:
  1. 访问注册页
  2. 输入无效邮箱（如 `invalid-email`, `test@`, `@test.com`）
  3. 尝试提交
- **Expected Results**:
  - 显示邮箱格式错误提示
  - 阻止表单提交
- **Postconditions**: 无

#### TC-ERR-002: 注册 - 密码少于6位
- **Requirement**: US-2 密码最少6位
- **Priority**: High
- **Preconditions**:
  - 无
- **Test Steps**:
  1. 访问注册页
  2. 输入有效邮箱
  3. 输入少于6位的密码（如 `12345`）
  4. 尝试提交
- **Expected Results**:
  - 显示密码长度错误提示
  - 阻止表单提交
- **Postconditions**: 无

#### TC-ERR-003: 注册 - 确认密码不匹配
- **Requirement**: US-2 确认密码
- **Priority**: High
- **Preconditions**:
  - 无
- **Test Steps**:
  1. 访问注册页
  2. 输入有效邮箱
  3. 输入密码 `password123`
  4. 输入确认密码 `password456`
  5. 尝试提交
- **Expected Results**:
  - 显示密码不匹配错误提示
  - 阻止表单提交
- **Postconditions**: 无

#### TC-ERR-004: 注册 - 邮箱已存在
- **Requirement**: US-2 邮箱唯一
- **Priority**: High
- **Preconditions**:
  - 邮箱 `existing@test.com` 已注册
- **Test Steps**:
  1. 访问注册页
  2. 输入已存在的邮箱 `existing@test.com`
  3. 输入有效密码和确认密码
  4. 提交
- **Expected Results**:
  - 显示邮箱已注册错误提示
  - 建议用户登录
- **Postconditions**: 无

#### TC-ERR-005: 登录 - 错误密码
- **Requirement**: US-2 用户登录
- **Priority**: High
- **Preconditions**:
  - 用户已注册
- **Test Steps**:
  1. 访问登录页
  2. 输入正确的邮箱
  3. 输入错误的密码
  4. 点击登录
- **Expected Results**:
  - 显示登录失败提示（邮箱或密码错误）
  - 不泄露具体是邮箱还是密码错误
- **Postconditions**: 无

#### TC-ERR-006: 登录 - 不存在的邮箱
- **Requirement**: US-2 用户登录
- **Priority**: Medium
- **Preconditions**:
  - 无
- **Test Steps**:
  1. 访问登录页
  2. 输入未注册的邮箱
  3. 输入任意密码
  4. 点击登录
- **Expected Results**:
  - 显示登录失败提示（邮箱或密码错误）
  - 不泄露具体是邮箱不存在
- **Postconditions**: 无

---

## 3. 管理员登录 (US-3, F2)

### Functional Tests

#### TC-F-008: 管理员登录成功
- **Requirement**: US-3 管理员登录
- **Priority**: High
- **Preconditions**:
  - 管理员账号已通过种子数据预设
- **Test Steps**:
  1. 访问登录页 `/login`
  2. 输入管理员邮箱和密码
  3. 点击登录
- **Expected Results**:
  - 登录成功
  - 自动识别管理员角色
  - 跳转至管理后台 `/admin`
- **Postconditions**: 管理员已登录

### Error Handling Tests

#### TC-ERR-007: 普通用户访问管理后台
- **Requirement**: US-3 普通用户无法访问管理后台
- **Priority**: High
- **Preconditions**:
  - 普通用户已登录
- **Test Steps**:
  1. 以普通用户身份尝试访问 `/admin`
  2. 尝试访问 `/admin/ideas`
  3. 尝试访问 `/admin/users`
  4. 尝试访问 `/admin/trash`
- **Expected Results**:
  - 所有管理后台页面拒绝访问
  - 重定向至首页或显示无权限提示
- **Postconditions**: 无

#### TC-ERR-008: 未登录用户访问管理后台
- **Requirement**: US-3 管理后台访问控制
- **Priority**: High
- **Preconditions**:
  - 用户未登录
- **Test Steps**:
  1. 直接访问 `/admin`
- **Expected Results**:
  - 重定向至登录页
  - 或显示需要登录提示
- **Postconditions**: 无

---

## 4. 点子提交 (US-4, F3)

### Functional Tests

#### TC-F-009: 登录用户提交点子成功
- **Requirement**: US-4 用户提交点子
- **Priority**: High
- **Preconditions**:
  - 用户已登录
- **Test Steps**:
  1. 访问提交页 `/submit`
  2. 输入标题（如「智能日程助手」）
  3. 输入描述（如「一个能自动安排日程的工具」）
  4. 选择标签（可选，如「工具」「效率」）
  5. 点击提交
- **Expected Results**:
  - 提交成功
  - 显示成功反馈提示
  - 点子状态默认为「待审核」
- **Postconditions**: 点子已创建，状态为待审核

#### TC-F-010: 提交点子 - 仅必填项
- **Requirement**: US-4 标签可选
- **Priority**: Medium
- **Preconditions**:
  - 用户已登录
- **Test Steps**:
  1. 访问提交页
  2. 输入标题
  3. 输入描述
  4. 不选择任何标签
  5. 提交
- **Expected Results**:
  - 提交成功
  - 点子创建时标签为空
- **Postconditions**: 无

### Edge Case Tests

#### TC-E-006: 提交点子 - 标题最大长度（50字符）
- **Requirement**: US-4 标题最大50字符
- **Priority**: Medium
- **Preconditions**:
  - 用户已登录
- **Test Steps**:
  1. 访问提交页
  2. 输入正好50个字符的标题
  3. 输入有效描述
  4. 提交
- **Expected Results**:
  - 提交成功
- **Postconditions**: 无

#### TC-E-007: 提交点子 - 描述最大长度（1000字符）
- **Requirement**: US-4 描述最大1000字符
- **Priority**: Medium
- **Preconditions**:
  - 用户已登录
- **Test Steps**:
  1. 访问提交页
  2. 输入有效标题
  3. 输入正好1000个字符的描述
  4. 提交
- **Expected Results**:
  - 提交成功
- **Postconditions**: 无

#### TC-E-008: 提交点子 - 多选标签
- **Requirement**: US-4 分类标签可选多选
- **Priority**: Low
- **Preconditions**:
  - 用户已登录
- **Test Steps**:
  1. 访问提交页
  2. 输入有效标题和描述
  3. 选择多个标签（如「工具」+「效率」+「学习」）
  4. 提交
- **Expected Results**:
  - 提交成功
  - 点子关联所有选中的标签
- **Postconditions**: 无

### Error Handling Tests

#### TC-ERR-009: 提交点子 - 标题为空
- **Requirement**: US-4 标题必填
- **Priority**: High
- **Preconditions**:
  - 用户已登录
- **Test Steps**:
  1. 访问提交页
  2. 不输入标题
  3. 输入有效描述
  4. 尝试提交
- **Expected Results**:
  - 显示标题必填错误提示
  - 阻止表单提交
- **Postconditions**: 无

#### TC-ERR-010: 提交点子 - 描述为空
- **Requirement**: US-4 描述必填
- **Priority**: High
- **Preconditions**:
  - 用户已登录
- **Test Steps**:
  1. 访问提交页
  2. 输入有效标题
  3. 不输入描述
  4. 尝试提交
- **Expected Results**:
  - 显示描述必填错误提示
  - 阻止表单提交
- **Postconditions**: 无

#### TC-ERR-011: 提交点子 - 标题超过50字符
- **Requirement**: US-4 标题最大50字符
- **Priority**: Medium
- **Preconditions**:
  - 用户已登录
- **Test Steps**:
  1. 访问提交页
  2. 输入51个字符的标题
  3. 输入有效描述
  4. 尝试提交
- **Expected Results**:
  - 显示标题超长错误提示
  - 或自动截断至50字符
- **Postconditions**: 无

#### TC-ERR-012: 提交点子 - 描述超过1000字符
- **Requirement**: US-4 描述最大1000字符
- **Priority**: Medium
- **Preconditions**:
  - 用户已登录
- **Test Steps**:
  1. 访问提交页
  2. 输入有效标题
  3. 输入1001个字符的描述
  4. 尝试提交
- **Expected Results**:
  - 显示描述超长错误提示
  - 或自动截断至1000字符
- **Postconditions**: 无

#### TC-ERR-013: 未登录用户访问提交页
- **Requirement**: US-4 未登录用户点击提交引导至登录
- **Priority**: High
- **Preconditions**:
  - 用户未登录
- **Test Steps**:
  1. 访问提交页 `/submit`
- **Expected Results**:
  - 重定向至登录页
  - 或显示登录引导提示
  - 登录后返回提交页
- **Postconditions**: 无

---

## 5. 管理后台 (US-5, F5)

### Functional Tests

#### TC-F-011: 查看点子列表
- **Requirement**: US-5 查看所有点子
- **Priority**: High
- **Preconditions**:
  - 管理员已登录
  - 数据库中存在点子
- **Test Steps**:
  1. 访问 `/admin/ideas`
  2. 查看点子列表
- **Expected Results**:
  - 显示所有点子列表
  - 每个点子显示标题、状态、提交者、时间
- **Postconditions**: 无

#### TC-F-012: 按状态筛选点子
- **Requirement**: US-5 按状态筛选
- **Priority**: High
- **Preconditions**:
  - 管理员已登录
  - 数据库中存在各状态的点子
- **Test Steps**:
  1. 访问点子管理页
  2. 选择筛选「待审核」
  3. 选择筛选「已采纳」
  4. 选择筛选「开发中」
  5. 选择筛选「已完成」
  6. 选择筛选「全部」
- **Expected Results**:
  - 每次筛选只显示对应状态的点子
  - 「全部」显示所有状态的点子
- **Postconditions**: 无

#### TC-F-013: 更改点子状态
- **Requirement**: US-5 可更改点子状态
- **Priority**: High
- **Preconditions**:
  - 管理员已登录
  - 存在「待审核」状态的点子
- **Test Steps**:
  1. 访问点子管理页
  2. 找到一个待审核点子
  3. 将状态改为「已采纳」
  4. 再改为「开发中」
  5. 再改为「已完成」
- **Expected Results**:
  - 每次状态变更成功
  - 列表中显示更新后的状态
- **Postconditions**: 点子状态已更新

#### TC-F-014: 将点子移至垃圾箱
- **Requirement**: US-5 可将点子移至垃圾箱
- **Priority**: High
- **Preconditions**:
  - 管理员已登录
  - 存在点子
- **Test Steps**:
  1. 访问点子管理页
  2. 选择一个点子
  3. 点击「移至垃圾箱」
  4. 确认操作
- **Expected Results**:
  - 点子从列表中消失
  - 点子出现在垃圾箱中
  - 点子标记为软删除（isDeleted = true）
- **Postconditions**: 点子已软删除

#### TC-F-015: 垃圾箱恢复点子
- **Requirement**: US-5 垃圾箱可恢复
- **Priority**: High
- **Preconditions**:
  - 管理员已登录
  - 垃圾箱中存在点子
- **Test Steps**:
  1. 访问 `/admin/trash`
  2. 找到要恢复的点子
  3. 点击「恢复」
- **Expected Results**:
  - 点子从垃圾箱消失
  - 点子重新出现在点子管理列表
  - 点子 isDeleted 恢复为 false
- **Postconditions**: 点子已恢复

#### TC-F-016: 垃圾箱永久删除点子
- **Requirement**: US-5 垃圾箱可永久删除
- **Priority**: High
- **Preconditions**:
  - 管理员已登录
  - 垃圾箱中存在点子
- **Test Steps**:
  1. 访问 `/admin/trash`
  2. 找到要删除的点子
  3. 点击「永久删除」
  4. 确认操作
- **Expected Results**:
  - 点子从垃圾箱消失
  - 点子从数据库中永久删除
  - 无法恢复
- **Postconditions**: 点子已永久删除

#### TC-F-017: 统计看板展示
- **Requirement**: US-5 提供统计看板
- **Priority**: Medium
- **Preconditions**:
  - 管理员已登录
  - 数据库中存在各状态的点子
- **Test Steps**:
  1. 访问管理后台仪表板 `/admin`
  2. 查看统计数据
- **Expected Results**:
  - 显示各状态点子数量（待审核、已采纳、开发中、已完成）
  - 数据与实际数据库一致
- **Postconditions**: 无

#### TC-F-018: 用户管理 - 查看用户列表
- **Requirement**: US-5 提供用户管理
- **Priority**: Medium
- **Preconditions**:
  - 管理员已登录
  - 数据库中存在用户
- **Test Steps**:
  1. 访问 `/admin/users`
  2. 查看用户列表
- **Expected Results**:
  - 显示所有用户列表
  - 显示用户邮箱、角色、注册时间等信息
- **Postconditions**: 无

### Edge Case Tests

#### TC-E-009: 点子列表为空
- **Requirement**: US-5 点子管理
- **Priority**: Low
- **Preconditions**:
  - 管理员已登录
  - 数据库中无点子
- **Test Steps**:
  1. 访问点子管理页
- **Expected Results**:
  - 显示空状态提示
  - 不显示错误
- **Postconditions**: 无

#### TC-E-010: 垃圾箱为空
- **Requirement**: US-5 垃圾箱管理
- **Priority**: Low
- **Preconditions**:
  - 管理员已登录
  - 垃圾箱中无点子
- **Test Steps**:
  1. 访问垃圾箱页面
- **Expected Results**:
  - 显示空状态提示
- **Postconditions**: 无

---

## 6. 用户中心 (US-7, F4)

### Functional Tests

#### TC-F-019: 查看我的点子列表
- **Requirement**: US-7 用户查看点子进度
- **Priority**: High
- **Preconditions**:
  - 用户已登录
  - 用户已提交过点子
- **Test Steps**:
  1. 访问用户中心 `/dashboard`
  2. 查看「我的点子」列表
- **Expected Results**:
  - 显示当前用户提交的所有点子
  - 每个点子显示标题和当前状态
  - 按提交时间倒序排列
- **Postconditions**: 无

#### TC-F-020: 点子状态颜色区分
- **Requirement**: US-7 状态使用不同颜色区分
- **Priority**: Medium
- **Preconditions**:
  - 用户已登录
  - 用户有各状态的点子
- **Test Steps**:
  1. 访问用户中心
  2. 查看不同状态的点子
- **Expected Results**:
  - 「待审核」使用特定颜色（如灰色/黄色）
  - 「已采纳」使用特定颜色（如蓝色）
  - 「开发中」使用特定颜色（如橙色）
  - 「已完成」使用特定颜色（如绿色）
  - 颜色可明显区分
- **Postconditions**: 无

#### TC-F-021: 用户退出登录
- **Requirement**: F4 用户中心 - 退出登录
- **Priority**: High
- **Preconditions**:
  - 用户已登录
- **Test Steps**:
  1. 访问用户中心
  2. 点击「退出登录」按钮
- **Expected Results**:
  - 成功退出登录
  - 跳转至首页或登录页
  - 会话清除
- **Postconditions**: 用户已退出

### Edge Case Tests

#### TC-E-011: 用户无点子时的用户中心
- **Requirement**: US-7 我的点子列表
- **Priority**: Medium
- **Preconditions**:
  - 用户已登录
  - 用户未提交过任何点子
- **Test Steps**:
  1. 访问用户中心
- **Expected Results**:
  - 显示空状态提示（如「你还没有提交过点子」）
  - 提供提交点子的引导链接
- **Postconditions**: 无

---

## 7. 状态流转 (State Transitions)

### State Transition Tests

#### TC-ST-001: 完整状态流转：待审核 → 已采纳 → 开发中 → 已完成
- **Requirement**: US-5 状态流转
- **Priority**: High
- **Preconditions**:
  - 管理员已登录
  - 存在「待审核」状态的点子
- **Test Steps**:
  1. 选择一个待审核点子
  2. 将状态改为「已采纳」
  3. 验证状态更新
  4. 将状态改为「开发中」
  5. 验证状态更新
  6. 将状态改为「已完成」
  7. 验证状态更新
  8. 刷新首页，确认点子出现
- **Expected Results**:
  - 每步状态变更成功
  - 最终点子出现在首页
  - 用户中心显示「已完成」状态
- **Postconditions**: 点子状态为已完成

#### TC-ST-002: 状态回退：已完成 → 开发中
- **Requirement**: US-5, US-6 状态变更后首页更新
- **Priority**: Medium
- **Preconditions**:
  - 管理员已登录
  - 存在「已完成」状态的点子
  - 该点子显示在首页
- **Test Steps**:
  1. 将点子状态改为「开发中」
  2. 刷新首页
- **Expected Results**:
  - 状态变更成功
  - 点子从首页移除
- **Postconditions**: 点子不再显示在首页

#### TC-ST-003: 软删除与恢复流程
- **Requirement**: US-5 垃圾箱管理
- **Priority**: Medium
- **Preconditions**:
  - 管理员已登录
  - 存在正常状态的点子
- **Test Steps**:
  1. 将点子移至垃圾箱
  2. 验证点子从列表消失
  3. 验证点子出现在垃圾箱
  4. 恢复点子
  5. 验证点子重新出现在列表
  6. 验证点子状态保持不变
- **Expected Results**:
  - 软删除和恢复正常工作
  - 恢复后状态保持原状
- **Postconditions**: 无

---

## 8. 安全与性能

### Security Tests

#### TC-SEC-001: API 路由鉴权 - 未登录访问受保护接口
- **Requirement**: 技术约束 - API 路由鉴权
- **Priority**: High
- **Preconditions**:
  - 用户未登录
- **Test Steps**:
  1. 直接调用提交点子 API（无 token）
  2. 直接调用管理后台 API（无 token）
- **Expected Results**:
  - 返回 401 Unauthorized
  - 不执行任何操作
- **Postconditions**: 无

#### TC-SEC-002: 普通用户调用管理员 API
- **Requirement**: 技术约束 - 管理后台访问控制
- **Priority**: High
- **Preconditions**:
  - 普通用户已登录
- **Test Steps**:
  1. 以普通用户 token 调用更改点子状态 API
  2. 以普通用户 token 调用删除点子 API
  3. 以普通用户 token 调用获取所有用户 API
- **Expected Results**:
  - 返回 403 Forbidden
  - 不执行任何操作
- **Postconditions**: 无

#### TC-SEC-003: XSS 防护
- **Requirement**: 技术约束 - XSS 防护
- **Priority**: High
- **Preconditions**:
  - 用户已登录
- **Test Steps**:
  1. 提交点子时标题输入 `<script>alert('xss')</script>`
  2. 描述输入 `<img src=x onerror=alert('xss')>`
  3. 查看点子展示
- **Expected Results**:
  - 脚本标签被转义或过滤
  - 不执行任何 JavaScript
  - 内容以纯文本显示
- **Postconditions**: 无

### Performance Tests

#### TC-PERF-001: 首页加载时间
- **Requirement**: 技术约束 - 首页首次加载 < 3秒
- **Priority**: Medium
- **Preconditions**:
  - 正常网络环境
- **Test Steps**:
  1. 清除浏览器缓存
  2. 访问首页
  3. 记录加载完成时间
- **Expected Results**:
  - 首次加载时间 < 3秒
- **Postconditions**: 无

#### TC-PERF-002: API 响应时间
- **Requirement**: 技术约束 - API 响应 < 500ms
- **Priority**: Medium
- **Preconditions**:
  - 正常网络环境
- **Test Steps**:
  1. 测试获取首页点子列表 API
  2. 测试提交点子 API
  3. 测试获取用户点子列表 API
- **Expected Results**:
  - 所有 API 响应时间 < 500ms
- **Postconditions**: 无

---

## Test Coverage Matrix

| Requirement | Test Cases | Coverage |
|------------|------------|----------|
| US-1 首页展示 | TC-F-001, TC-F-002, TC-F-003, TC-F-004, TC-E-001, TC-E-002, TC-E-003 | ✓ Complete |
| US-2 用户注册登录 | TC-F-005, TC-F-006, TC-F-007, TC-E-005, TC-ERR-001~006 | ✓ Complete |
| US-3 管理员登录 | TC-F-008, TC-ERR-007, TC-ERR-008 | ✓ Complete |
| US-4 点子提交 | TC-F-009, TC-F-010, TC-E-006~008, TC-ERR-009~013 | ✓ Complete |
| US-5 管理后台 | TC-F-011~018, TC-E-009, TC-E-010 | ✓ Complete |
| US-6 首页展示已完成 | TC-E-004, TC-ST-001, TC-ST-002 | ✓ Complete |
| US-7 用户查看进度 | TC-F-019, TC-F-020, TC-F-021, TC-E-011 | ✓ Complete |
| 安全要求 | TC-SEC-001~003 | ✓ Complete |
| 性能要求 | TC-PERF-001, TC-PERF-002 | ✓ Complete |

---

## Notes

1. **预设标签**：测试时使用 PRD 定义的标签（工具、效率、娱乐、学习、其他）
2. **管理员账号**：需通过种子数据预设，测试前确认账号存在
3. **响应式测试**：使用浏览器开发者工具模拟不同设备尺寸
4. **玻璃态设计**：视觉测试需验证毛玻璃效果和渐变背景
5. **状态流转**：测试时注意验证用户中心和首页的同步更新
