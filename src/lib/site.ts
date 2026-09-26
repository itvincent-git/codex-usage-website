import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from 'astro:i18n';

export const site = 'https://codex-usage.itvincent.net';
export const repo = 'https://github.com/itvincent-git/codex-usage-desktop';
export const releases = `${repo}/releases/latest`;
export const downloads = {
  windows: `${releases}/download/codex-usage-desktop-windows-x64-setup.exe`,
  arm: `${releases}/download/codex-usage-desktop-macos-arm64.dmg`,
  intel: `${releases}/download/codex-usage-desktop-macos-x64.dmg`,
};

export const languages = ['en', 'zh', 'ja'] as const;
export type Lang = (typeof languages)[number];
export const featureSlugs = ['usage-tracking', 'quota-monitoring', 'cost-analysis', 'session-analysis'] as const;
export type FeatureSlug = (typeof featureSlugs)[number];
export const docSlugs = ['getting-started', 'dashboard', 'quota', 'projects-and-models', 'sessions', 'resets', 'export', 'privacy', 'windows-wsl', 'advanced-settings', 'troubleshooting'] as const;
export type DocSlug = (typeof docSlugs)[number];

export const pathFor = (lang: Lang, section = '') => getRelativeLocaleUrl(lang, section);
export const equivalents = (section = '') => languages.map((lang) => ({ lang, href: getAbsoluteLocaleUrl(lang, section) }));

type FeatureCopy = {
  name: string; eyebrow: string; title: string; description: string; points: string[]; imageAlt: string;
};
type Copy = {
  locale: string; name: string; nav: { features: string; download: string; docs: string; github: string; menu: string; language: string };
  home: { eyebrow: string; title: string; lead: string; cta: string; secondary: string; proof: string[]; sectionTitle: string; sectionLead: string; visualNote: string; workflowEyebrow: string; workflowTitle: string; workflowLead: string; workflow: { title: string; body: string }[]; privacyTitle: string; privacyBody: string; privacyLink: string; closing: string };
  download: { title: string; lead: string; windows: string; windowsNote: string; mac: string; macNote: string; arm: string; intel: string; requirements: string; requireBody: string; firstLaunch: string; firstLaunchBody: string; releases: string; auto: string };
  features: Record<FeatureSlug, FeatureCopy>;
  docs: { title: string; lead: string; open: string; all: string; edit: string; names: Record<DocSlug, string> };
  common: { learn: string; get: string; built: string; copyright: string; home: string };
};

export const copy: Record<Lang, Copy> = {
  en: {
    locale: 'en', name: 'English', nav: { features: 'Features', download: 'Download', docs: 'Docs', github: 'GitHub', menu: 'Open menu', language: 'Language' },
    home: {
      eyebrow: 'A clearer view of your Codex work',
      title: 'Know where your Codex tokens go.',
      lead: 'Track usage, watch your limits, and understand every session from one private desktop app. Your Codex data stays on your computer.',
      cta: 'Download free', secondary: 'Explore the dashboard',
      proof: ['Local-first by design', 'No API key required', 'macOS and Windows'],
      sectionTitle: 'The whole picture, at a glance.', sectionLead: 'From a quick quota check to the details behind a long session, get answers without digging through logs.',
      visualNote: 'Illustrative usage data. Product screenshots show public settings and pricing only.', workflowEyebrow: 'A simple flow', workflowTitle: 'From a quick check to a clear answer.', workflowLead: 'Open the app when you need context, or keep your limits visible while you work.', workflow: [{ title: 'Check your headroom', body: 'See remaining limits and reset times in the dashboard or menu bar.' }, { title: 'Find the source', body: 'Compare trends, projects and models to spot what changed.' }, { title: 'Review or export', body: 'Follow a session timeline or export the selected range.' }],
      privacyTitle: 'Your sessions stay yours.', privacyBody: 'Codex Usage Desktop reads session logs locally and stores aggregated usage in a local SQLite cache. It never uploads your session logs. Live limits and public updates use specific network requests.', privacyLink: 'How privacy works',
      closing: 'Spend less time guessing. Get back to building.',
    },
    download: { title: 'Download Codex Usage Desktop', lead: 'Free and open source. Choose the installer for your computer, then open the app to index your existing Codex sessions.', windows: 'Windows 10/11 x64', windowsNote: 'Current-user installer. The installer is not yet Authenticode-signed, so SmartScreen may ask you to confirm the GitHub release source.', mac: 'macOS', macNote: 'Open the DMG and move the app to Applications.', arm: 'Apple Silicon', intel: 'Intel Mac', requirements: 'Before you begin', requireBody: 'Use Codex CLI first so local session logs exist. Live limits require a signed-in local Codex CLI session.', firstLaunch: 'First launch on macOS', firstLaunchBody: 'If Gatekeeper blocks the app, open System Settings → Privacy & Security and allow it there. The app does not bypass Gatekeeper.', releases: 'Release notes and all assets', auto: 'Choose a download' },
    features: {
      'usage-tracking': { name: 'Usage tracking', eyebrow: 'Usage tracking', title: 'See every token in context.', description: 'Turn local Codex session logs into a clear view of input, output, and cached tokens. Compare daily and monthly trends, cache hit rate, and custom date ranges.', points: ['Daily and monthly usage trends', 'Input, output, and cached token breakdowns', 'Project, model, and session drilldowns'], imageAlt: 'Illustrative Codex Usage Desktop dashboard with sample usage data' },
      'quota-monitoring': { name: 'Quota monitoring', eyebrow: 'Quota monitoring', title: 'Know your limits before you hit them.', description: 'See your live 5-hour and weekly or monthly limits, remaining quota, and reset countdowns using your existing local Codex login.', points: ['Remaining quota and reset times', 'Menu bar and system tray visibility', 'Reset credits and forecasts when available'], imageAlt: 'Codex Usage Desktop menu bar and system tray settings' },
      'cost-analysis': { name: 'Cost analysis', eyebrow: 'Cost analysis', title: 'Understand what drives your estimated cost.', description: 'See estimated costs beside token usage, then break them down by project, model, day, month, or session. Estimates use available model pricing.', points: ['Project and model cost breakdowns', 'Token composition beside estimates', 'Export the selected range to Excel or Markdown'], imageAlt: 'Codex Usage Desktop public model pricing catalog' },
      'session-analysis': { name: 'Session analysis', eyebrow: 'Session analysis', title: 'Follow the work behind the numbers.', description: 'Search your local Codex sessions and inspect a timeline of recorded commands, tools, patches, web searches, and usage.', points: ['Search by title, project, and model', 'Session timeline and subagent hierarchy', 'Usage and quota changes in context'], imageAlt: 'Illustrative Codex session timeline with sample events' },
    },
    docs: { title: 'Guides for everyday use', lead: 'Get set up, understand your numbers, and resolve common issues.', open: 'Read guide', all: 'All guides', edit: 'Improve this guide on GitHub', names: { 'getting-started': 'Install & get started', dashboard: 'Dashboard', quota: 'Quota & limits', 'projects-and-models': 'Projects & models', sessions: 'Sessions', resets: 'Quota resets', export: 'Export data', privacy: 'Privacy & network access', 'windows-wsl': 'Windows & WSL', 'advanced-settings': 'Advanced settings', troubleshooting: 'Troubleshooting' } },
    common: { learn: 'Learn more', get: 'Get the app', built: 'Free and open source', copyright: 'Codex Usage Desktop', home: 'Home' },
  },
  zh: {
    locale: 'zh-CN', name: '简体中文', nav: { features: '功能', download: '下载', docs: '文档', github: 'GitHub', menu: '打开菜单', language: '语言' },
    home: { eyebrow: '更清楚地了解 Codex 使用情况', title: '每一个 Token，都心中有数。', lead: '在一款注重隐私的桌面应用中查看用量、监控额度并理解每段会话。Codex 数据留在你的电脑上。', cta: '免费下载', secondary: '探索看板', proof: ['本地优先', '无需 API Key', '支持 macOS 和 Windows'], sectionTitle: '从概览到细节，一目了然。', sectionLead: '快速查看剩余额度，也能深入长会话的细节，无需翻查日志。', visualNote: '用量与会话画面为示意数据；现场截图仅展示公开设置和价格目录。', workflowEyebrow: '使用路径', workflowTitle: '从快速查看，到找到答案。', workflowLead: '工作时让额度常驻菜单栏，需要细节时再打开应用。', workflow: [{ title: '先看剩余额度', body: '在看板或菜单栏查看额度余额和重置时间。' }, { title: '找出用量来源', body: '对比趋势、项目和模型，定位变化。' }, { title: '回看或导出', body: '沿会话时间线复盘，或导出选定区间。' }], privacyTitle: '会话数据由你掌控。', privacyBody: '应用在本地读取会话日志，并把汇总数据存入本地 SQLite 缓存，不会上传会话日志。实时额度与公开信息更新会使用特定网络请求。', privacyLink: '了解隐私机制', closing: '少一点猜测，多一点专注。' },
    download: { title: '下载 Codex Usage Desktop', lead: '免费开源。选择适合电脑的安装包，打开应用即可索引已有的 Codex 会话。', windows: 'Windows 10/11 x64', windowsNote: '按当前用户安装。安装包尚未进行 Authenticode 签名，SmartScreen 可能提示你确认文件来自 GitHub Release。', mac: 'macOS', macNote: '打开 DMG，将应用拖入“应用程序”。', arm: 'Apple 芯片', intel: 'Intel Mac', requirements: '使用前准备', requireBody: '先使用 Codex CLI，确保本地已有会话日志。实时额度需要本机 Codex CLI 已登录。', firstLaunch: 'macOS 首次启动', firstLaunchBody: '如果 Gatekeeper 阻止启动，可在“系统设置 → 隐私与安全性”中允许。应用不会绕过 Gatekeeper。', releases: '发行说明与全部资产', auto: '选择下载版本' },
    features: {
      'usage-tracking': { name: '用量追踪', eyebrow: '用量追踪', title: '看清每个 Token 的去向。', description: '把本地 Codex 会话日志变成清晰的输入、输出和缓存 Token 统计，并对比每日、每月趋势与缓存命中率。', points: ['每日与每月用量趋势', '输入、输出和缓存 Token 明细', '按项目、模型和会话深入查看'], imageAlt: '采用示意数据的 Codex Usage Desktop 看板' },
      'quota-monitoring': { name: '额度监控', eyebrow: '额度监控', title: '在触及限制前掌握余额。', description: '使用本机已有的 Codex 登录状态，查看实时 5 小时和每周或每月额度、剩余量及重置倒计时。', points: ['剩余额度与重置时间', '菜单栏和系统托盘常驻显示', '可用时展示重置额度和预测'], imageAlt: 'Codex Usage Desktop 菜单栏与系统托盘设置' },
      'cost-analysis': { name: '成本分析', eyebrow: '成本分析', title: '理解预估成本来自哪里。', description: '将预估成本与 Token 用量放在一起，按项目、模型、日期和会话拆解。估算依据可用的模型价格。', points: ['项目和模型成本拆解', '预估成本与 Token 构成', '将选定日期范围导出为 Excel 或 Markdown'], imageAlt: 'Codex Usage Desktop 公开模型价格目录' },
      'session-analysis': { name: '会话分析', eyebrow: '会话分析', title: '沿时间线回看具体工作。', description: '搜索本地 Codex 会话，查看日志记录的命令、工具、补丁、网页搜索和用量变化。', points: ['按标题、项目和模型搜索', '会话时间线与子代理层级', '结合上下文查看用量和额度变化'], imageAlt: '采用示意事件的 Codex 会话时间线' },
    },
    docs: { title: '日常使用指南', lead: '完成安装、读懂数据并解决常见问题。', open: '阅读指南', all: '全部指南', edit: '在 GitHub 改进此指南', names: { 'getting-started': '安装与入门', dashboard: '看板', quota: '额度与限制', 'projects-and-models': '项目与模型', sessions: '会话', resets: '额度重置', export: '导出数据', privacy: '隐私与网络访问', 'windows-wsl': 'Windows 与 WSL', 'advanced-settings': '进阶设置', troubleshooting: '故障排查' } },
    common: { learn: '了解更多', get: '获取应用', built: '免费开源', copyright: 'Codex Usage Desktop', home: '首页' },
  },
  ja: {
    locale: 'ja', name: '日本語', nav: { features: '機能', download: 'ダウンロード', docs: 'ガイド', github: 'GitHub', menu: 'メニューを開く', language: '言語' },
    home: { eyebrow: 'Codex の利用状況を、もっと明確に', title: 'Codex のトークンを見える化。', lead: '使用量、上限、セッションの詳細を、プライバシーを重視したデスクトップアプリで確認。Codex データは端末内に残ります。', cta: '無料でダウンロード', secondary: 'ダッシュボードを見る', proof: ['ローカル優先', 'API キー不要', 'macOS・Windows 対応'], sectionTitle: '全体像から細部まで、ひと目で。', sectionLead: '残りの利用枠をすぐに確認。長いセッションもログを読み解かずに振り返れます。', visualNote: '使用量とセッションはサンプルデータです。実際の画面写真は公開設定と料金表のみを掲載しています。', workflowEyebrow: '使い方', workflowTitle: '残りを確認し、理由を見つける。', workflowLead: '作業中はメニューバーで確認。詳しく調べたいときはアプリを開けます。', workflow: [{ title: '残りの枠を確認', body: 'ダッシュボードやメニューバーで残量とリセット時刻を見る。' }, { title: '使用量の元を探す', body: '推移、プロジェクト、モデルを比較して変化を見つける。' }, { title: '振り返り・書き出し', body: 'セッションの時系列を確認し、期間を選んで出力する。' }], privacyTitle: 'セッションデータはあなたのもの。', privacyBody: 'セッションログをローカルで読み取り、集計結果を端末内の SQLite キャッシュに保存します。ログはアップロードされません。利用枠や公開情報の更新には限定的な通信を使います。', privacyLink: 'プライバシーについて', closing: '推測する時間を減らして、制作に集中。' },
    download: { title: 'Codex Usage Desktop をダウンロード', lead: '無料のオープンソースアプリです。端末に合うインストーラーを選び、起動すると既存の Codex セッションを読み込みます。', windows: 'Windows 10/11 x64', windowsNote: '現在のユーザー向けにインストールします。Authenticode 署名はまだなく、SmartScreen が GitHub Release からのファイルか確認を求める場合があります。', mac: 'macOS', macNote: 'DMG を開き、アプリを Applications に移動してください。', arm: 'Apple Silicon', intel: 'Intel Mac', requirements: '始める前に', requireBody: '先に Codex CLI を使い、ローカルにセッションログを作成してください。利用枠の取得には Codex CLI へのログインが必要です。', firstLaunch: 'macOS で初めて起動するとき', firstLaunchBody: 'Gatekeeper にブロックされた場合は「システム設定 → プライバシーとセキュリティ」から許可してください。アプリが Gatekeeper を回避することはありません。', releases: 'リリースノートと全ファイル', auto: 'ダウンロードを選択' },
    features: {
      'usage-tracking': { name: '使用量の追跡', eyebrow: '使用量の追跡', title: 'トークンの使い道を把握。', description: 'ローカルの Codex セッションログから、入力・出力・キャッシュトークンを可視化。日次・月次の推移やキャッシュヒット率を確認できます。', points: ['日次・月次の使用量推移', '入力・出力・キャッシュの内訳', 'プロジェクト・モデル・セッション別の詳細'], imageAlt: 'サンプルデータを使った Codex Usage Desktop ダッシュボード' },
      'quota-monitoring': { name: '利用枠の確認', eyebrow: '利用枠の確認', title: '上限に達する前に、残りを確認。', description: '端末にある Codex のログイン情報を使い、5 時間枠と週次・月次枠の残量、リセットまでの時間を表示します。', points: ['残りの利用枠とリセット時刻', 'メニューバーとシステムトレイに表示', '利用可能な場合はリセットクレジットと予測も表示'], imageAlt: 'Codex Usage Desktop のメニューバーとトレイ設定' },
      'cost-analysis': { name: 'コスト分析', eyebrow: 'コスト分析', title: '推定コストの内訳を理解。', description: '推定コストをトークン使用量とともに表示し、プロジェクト、モデル、日付、セッション別に確認。利用可能なモデル価格を使った推定値です。', points: ['プロジェクト・モデル別の推定コスト', 'トークン内訳との比較', '選択した期間を Excel または Markdown に出力'], imageAlt: 'Codex Usage Desktop の公開モデル料金表' },
      'session-analysis': { name: 'セッション分析', eyebrow: 'セッション分析', title: '数字の裏にある作業をたどる。', description: 'ローカルの Codex セッションを検索し、記録されたコマンド、ツール、パッチ、Web 検索、使用量を時系列で確認します。', points: ['タイトル・プロジェクト・モデルで検索', 'タイムラインとサブエージェントの階層', '使用量と利用枠の変化を文脈とともに表示'], imageAlt: 'サンプルイベントを使った Codex セッションの時系列' },
    },
    docs: { title: '日々の利用ガイド', lead: 'セットアップ、数値の見方、よくある問題の解決方法をまとめました。', open: 'ガイドを読む', all: 'すべてのガイド', edit: 'GitHub でこのガイドを改善', names: { 'getting-started': 'インストールと開始', dashboard: 'ダッシュボード', quota: '利用枠と上限', 'projects-and-models': 'プロジェクトとモデル', sessions: 'セッション', resets: '利用枠のリセット', export: 'データのエクスポート', privacy: 'プライバシーと通信', 'windows-wsl': 'Windows と WSL', 'advanced-settings': '詳細設定', troubleshooting: 'トラブルシューティング' } },
    common: { learn: '詳しく見る', get: 'アプリを入手', built: '無料・オープンソース', copyright: 'Codex Usage Desktop', home: 'ホーム' },
  },
};
