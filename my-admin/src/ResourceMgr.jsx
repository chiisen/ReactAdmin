// Resource 管理器(大小寫必須同 Python Flask Admin 中 API 的 route 名稱一致)
export class ResourceMgr {
  // 成員變數會被 App.jsx 與 * List.jsx 引用

  /** posts - 文章列表 */
  static posts = "posts";
  /** settingVersion - 版本號碼 */
  static settingVersion = "settingVersion";
  /** sportItem - 運動類型 */
  static sportItem = "sportItem";
}