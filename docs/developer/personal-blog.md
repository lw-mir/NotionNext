# 个人博客与 Markdown 工作流

站点采用白底、深灰正文、深绿点缀的 Nobelium 定制布局。保留文章、专题、关于和搜索，复用 NotionPage 渲染代码、表格、图片和公式。文章链接维持原 slug。

## 内容与发布边界

`lib/site/personal-blog.js` 是个人站点展示配置，覆盖模板配置中心中的主题、品牌和挂件设置。明确模板通过页面 ID 在服务端数据入口排除，同名新文章不受影响。原文保留在 Notion，可恢复；仓库开发文档和配置中心不删除。分类和标签根据真实已发布文章计数，空分类不显示。

公开页面必须属于当前博客数据库、类型为 Post 或 Page、状态为 Published。UUID 路由不再兜底读取库外页面，避免草稿绕过发布状态。Notion 读取失败抛出异常，让 ISR 保留上一次成功页面，避免空数据覆盖缓存。个人站点缓存增加命名空间，以隔离改版前缓存。

## 从 Markdown 开始

参考 `scripts/blog/example.md`，文档开头提供 title、slug、summary、category；tags 是可选字符串数组，date 是可选 YYYY-MM-DD 字符串。slug 不包含 article/ 前缀，更新时应保持不变。

```sh
yarn blog:preview scripts/blog/example.md
yarn blog:test
```

预览生成在 `.tmp/blog-preview/<slug>/index.html`，发布准备数据保存在同目录 `article.json`。这两个文件只在本机，不提交到仓库。预览支持标题、列表、代码、表格、引用和 HTTPS 图片；原始 HTML 转义，危险链接禁用，相对图片路径明确标注待上传，避免静默丢失内容。

目前按用户要求暂不配置官方 Notion 写入权限，预览命令不读取密钥、不请求写入接口，不会发布文章。之后提供 Markdown，可先完成排版、摘要、分类与标签预览；接入官方 Notion 集成并授权数据库后，再完成幂等创建、更新备份和发布后回读验收。网站读取用的 v3 接口配置不能替代官方写入 token。

## 验证

构建：`API_BASE_URL=https://languid-handball-376.notion.site/api/v3 yarn build`。生产环境继续使用 Vercel 中已有 API_BASE_URL，不将凭据写入仓库。核对首页、原 SSO 文章、专题/标签、搜索、关于、RSS，以及模板/草稿路径返回 404；桌面和手机均需检查正文布局。
