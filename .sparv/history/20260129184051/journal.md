# SPARV Journal
Session: 20260129184051
Feature: iOS-style sunrise/sunset theme switching
Created: 2026-01-29 18:40

## Specification (Score: 9/10)
- **价值**: 更贴合用户真实昼夜节律
- **范围**: 用日出日落替换固定时间（18:00/6:00）
- **验收**: 主题在真实日出日落时切换
- **边界**: 处理定位权限拒绝，降级到固定时间
- **风险**: 需选择太阳计算库（suncalc 或 API）

**Completion Promise**: 主题将在用户所在地的真实日出日落时间自动切换，定位失败时降级到固定时间（6:00/18:00）

## Plan

### 任务分解（原子化，2-5 分钟粒度）

1. **选择太阳计算库**
   - 评估 suncalc vs API 方案
   - 决策：使用 suncalc（轻量、离线、无 API 限制）
   - 验证点：npm 包存在且维护活跃

2. **安装依赖**
   - `npm install suncalc`
   - `npm install -D @types/suncalc`
   - 验证点：package.json 更新成功

3. **创建太阳时间计算工具函数**
   - 新建 `lib/sun-times.ts`
   - 实现 `getSunTimes(lat, lon)` 返回 sunrise/sunset
   - 实现 `isDarkTime()` 判断当前是否暗色时段
   - 验证点：函数签名正确，包含错误处理

4. **集成地理位置 API**
   - 在 `isDarkTime()` 中调用 `navigator.geolocation`
   - 缓存位置到 localStorage（24 小时有效）
   - 失败时降级到固定时间（6:00/18:00）
   - 验证点：浏览器 API 调用正确，有超时处理

5. **更新 ThemeToggle.tsx**
   - 替换 `getTimeBasedDark()` 调用 `isDarkTime()`
   - 保持现有 auto/light/dark 逻辑不变
   - 验证点：组件编译通过，类型正确

6. **更新 layout.tsx 初始化脚本**
   - 将 `themeInitScript` 中的固定时间逻辑替换为太阳计算
   - 内联 suncalc 核心算法（避免外部依赖）
   - 验证点：脚本无语法错误，SSR 兼容

7. **测试验证**
   - 手动测试：模拟不同地理位置
   - 测试降级逻辑：拒绝定位权限
   - 测试缓存：检查 localStorage
   - 验证点：所有场景正常工作

### 成功标准
- ✅ 主题在真实日出日落时切换
- ✅ 定位失败时降级到固定时间
- ✅ 位置缓存 24 小时
- ✅ 无编译错误，类型安全

## Progress
<!-- Auto-updated every 2 actions -->

## Findings
<!-- Learnings, patterns, discoveries -->

## 18:45 - Action #2
- Tool: 完成 Plan 阶段，制定 7 步原子化任务
- Result: no result

## 18:53 - Action #4
- Tool: 更新 layout.tsx themeInitScript
- Result: no result
