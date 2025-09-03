// Resource 管理器(大小寫必須同 Python Flask Admin 中 API 的 route 名稱一致)
export class ResourceMgr {
  // 成員變數會被 App.jsx 與 * List.jsx 引用

  /** posts - 文章列表 */
  static posts = "posts";
  /** settingVersion - 版本號碼 */
  static settingVersion = "settingVersion";
  /** sportItem - 運動類型 */
  static sportItem = "sportItem";
  /** sportCategory - 運動項目 */
  static sportCategory = "sportCategory";
  /** categoryGroup - 分類維度 */
  static categoryGroup = "categoryGroup";
  /** categoryOption - 分類項目 */
  static categoryOption = "categoryOption";
  /** i18nText - 多國語系 */
  static i18nText = "i18nText";
}