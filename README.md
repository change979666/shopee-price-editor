# 虾皮价格批量修改器 🛒

一个用于批量修改虾皮商品折扣价格的Chrome浏览器插件。

## 功能特点 ✨

- 🔄 批量修改当前页面所有折扣价格
- ➕ 支持增加或减少价格
- 💰 自定义调整金额
- 📊 实时显示修改统计
- 🎨 美观的用户界面
- ⚡ 快速高效的批量处理

## 安装步骤 📦

### 方法一：开发者模式加载（推荐）

1. 打开Chrome浏览器
2. 在地址栏输入 `chrome://extensions/` 并回车
3. 打开右上角的 **"开发者模式"** 开关
4. 点击 **"加载已解压的扩展程序"** 按钮
5. 选择插件所在的文件夹 `改价浏览器插件`
6. 安装完成！插件图标会出现在浏览器工具栏

### 方法二：创建图标文件（可选）

如果想要更好的视觉效果，可以添加图标文件：

1. 准备三个尺寸的PNG图标文件：
   - `icon16.png` (16x16像素)
   - `icon48.png` (48x48像素)
   - `icon128.png` (128x128像素)
2. 将它们放在插件文件夹根目录

## 使用方法 📝

1. **打开虾皮页面**
   - 进入需要修改价格的虾皮商品管理页面
   - 确保页面已完全加载

2. **点击插件图标**
   - 在浏览器工具栏找到插件图标并点击
   - 插件弹窗会显示操作界面

3. **设置调整参数**
   - 选择操作类型：**减少价格** 或 **增加价格**
   - 输入调整金额（例如：10 表示增加或减少10元）

4. **执行批量修改**
   - 点击 **"批量修改价格"** 按钮
   - 插件会自动找到页面上所有价格输入框
   - 根据设置批量修改价格

5. **查看结果**
   - 插件会显示找到和修改的价格数量
   - 修改成功的输入框会短暂高亮显示

## 工作原理 🔧

插件通过以下方式工作：

1. 查找页面中所有符合条件的价格输入框（`input.eds-input__input[type="text"]`）
2. 读取每个输入框的当前价格
3. 根据用户选择的操作（增加/减少）和金额计算新价格
4. 更新输入框的值并触发必要的事件
5. 提供视觉反馈和统计信息

## 技术细节 💻

- **Manifest V3**: 使用最新的Chrome扩展API
- **内容脚本**: 直接操作页面DOM元素
- **消息传递**: popup和content script之间的通信
- **事件触发**: 确保页面能检测到价格变化

## 文件结构 📂

```
改价浏览器插件/
├── manifest.json      # 插件配置文件
├── popup.html         # 弹窗界面
├── popup.css          # 弹窗样式
├── popup.js           # 弹窗逻辑
├── content.js         # 内容脚本（核心功能）
├── icon16.png         # 16x16图标（可选）
├── icon48.png         # 48x48图标（可选）
├── icon128.png        # 128x128图标（可选）
└── README.md          # 说明文档
```

## 注意事项 ⚠️

1. **价格保护**: 减少价格时，新价格不会低于0
2. **小数精度**: 所有价格保留两位小数
3. **页面刷新**: 修改后如需保存，请按页面的保存按钮
4. **兼容性**: 仅适用于特定的虾皮页面结构
5. **重复执行**: 每次点击都会重新计算和修改

## 快捷键 ⌨️

- `Enter`: 在金额输入框中按回车键可快速执行修改

## 故障排除 🔍

### 问题：点击按钮后没有反应
**解决方案**：
- 刷新页面后重试
- 确保页面已完全加载
- 检查浏览器控制台是否有错误信息

### 问题：找不到价格输入框
**解决方案**：
- 确认当前页面是虾皮的商品管理页面
- 页面结构可能已更新，需要调整选择器

### 问题：修改后价格没有保存
**解决方案**：
- 插件只修改输入框的值，不自动保存
- 需要手动点击页面上的保存按钮

## 更新日志 📋

### v1.0.0 (2025-12-07)
- ✅ 初始版本发布
- ✅ 实现批量价格修改功能
- ✅ 支持增加/减少价格
- ✅ 添加统计和反馈功能

## License & Attribution / 许可与来源

Original project code authored for this repository is released under the MIT License; see [LICENSE](./LICENSE).

When reusing or redistributing a substantial portion, retain the LICENSE and its copyright notice. The copyright notice includes this original source URL: https://github.com/change979666/shopee-price-editor. Please keep the source link visible in your redistributed source or project documentation.

This license applies only to original material that the repository maintainer has the right to license. Third-party libraries, vendor code, platform SDKs, trademarks, screenshots, icons, fonts, and other external assets remain subject to their respective licenses and terms. Review those terms before reuse.

**Project status:** personal/archived project, shared as-is. Maintenance, compatibility, and production readiness are not guaranteed.
## 支持 💬

如有问题或建议，请通过以下方式联系：
- 检查README文档
- 查看浏览器控制台的错误信息
- 确保使用最新版本的Chrome浏览器

---

**温馨提示**: 使用本插件修改价格前，请备份重要数据。建议先在测试环境中验证功能。
