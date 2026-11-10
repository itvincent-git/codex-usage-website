# ui-ux-pro-max 安全审查

审查日期：2026-11-10。对象：审查时安装在本仓库 `.agents/skills/ui-ux-pro-max/` 的内容。

迁移记录：同日将已审查的全部 82 个文件移至 Codex 全局目录 `$CODEX_HOME/skills/ui-ux-pro-max/`（默认 `~/.codex/skills/ui-ux-pro-max/`），移动时逐文件 SHA-256 一致。迁移后仅调整 `SKILL.md` 和 `UPSTREAM.md` 的安装路径说明及检查命令。下文审查证据链接指向固定上游提交，原审查结果保持为历史记录。

迁移验证：从项目目录之外运行数据校验、Astro 检索及设计系统生成均成功；可独立运行的 153 个测试项中，152 个通过、1 个跳过。原先依赖完整上游布局的 4 个模块仍不纳入该测试集。

## 结论

当前版本未发现恶意指令、后门、密钥窃取、自动上传、远程代码下载执行或系统配置修改。作为可信项目中的本地设计检索工具，可以继续使用。下面列出的是已验证的使用风险和加固项，不代表已经发生入侵。

最值得处理的是：官网采用示例时引入的第三方资源，以及持久化时保留输入原文。另有一个依赖预先存在的目录符号链接的写入边界问题。此次只形成审查报告，未修改 skill 或网站功能。

## 范围与方法

- 全量枚举 82 个文件，共 3,806,916 字节：78 个 Git 跟踪文件，以及 4 个被忽略的 Python 缓存文件；当前目录没有符号链接。
- 78 个文本文件包括：20 个 Python 文件（5 个工具模块、15 个测试模块）、37 个 CSV、15 个 JSON、4 个 Markdown、许可证及忽略配置。CSV 包括全部 22 个技术栈及测试夹具。
- 对所有文本进行危险调用、敏感凭据、可疑外链、提示覆盖语句及隐藏控制字符扫描；解析全部 Python AST、CSV 和 JSON；人工复核入口、导入、文件写入、规则解析、测试进程执行及命中项。数据文件采用全量机器扫描和命中项复核，不声称逐条核实每项设计建议。
- 对 4 个 `.pyc` 的代码对象与本机重新编译的对应源码比较，执行相关字节码、常量及符号一致；未执行独立的未知缓存载荷。
- 通过 GitHub API 对比固定上游提交的 Git blob；运行数据校验、可独立运行的测试，以及临时目录中的安全行为探针。
- 安全探针对正常检索与生成调用安装 Python audit hook，遇到 socket 创建或网络操作、系统命令、子进程创建即失败，并记录文件写入。测试覆盖行为不能代表所有未来输入或更新版本。

## 上游来源核对

安装声明的来源：[nextlevelbuilder/ui-ux-pro-max-skill，固定提交 9b675f0](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/9b675f0b13c9c28dec445e8ce4633c18c39b6467/.claude/skills/ui-ux-pro-max)。

上游 skill 目录的 75 个文件在本地均存在：

| 类别 | 结果 |
| --- | --- |
| 73 个文件 | Git blob 完全一致 |
| `SKILL.md` | 仅安装路径说明及示例命令替换为本项目路径 |
| `scripts/design_system.py` | 仅空白行归一化，去除该差异后内容一致 |
| 本地额外文件 | `.gitignore`、`LICENSE`、`UPSTREAM.md`，与安装说明一致 |

没有发现未声明的代码或数据差异。来源一致只能确认安装内容，不能替代代码安全审查；本报告结论仅适用于此版本。

## 发现与建议

### R1：直接采用示例可能引入第三方请求和脚本信任

**级别：中，条件是将相关示例用于网站。**

证据：

- [typography.csv](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/9b675f0b13c9c28dec445e8ce4633c18c39b6467/.claude/skills/ui-ux-pro-max/data/typography.csv) 的字体组合包含 `fonts.googleapis.com` CSS 导入；[design_system.py](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/9b675f0b13c9c28dec445e8ce4633c18c39b6467/.claude/skills/ui-ux-pro-max/scripts/design_system.py) 将其直接带入生成建议和持久化文件。
- [threejs.csv 第 36 行](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/9b675f0b13c9c28dec445e8ce4633c18c39b6467/.claude/skills/ui-ux-pro-max/data/stacks/threejs.csv#L36) 的正面示例直接加载 CDN 上的 GSAP，未提供 `integrity`。其他 Three.js 示例也包含外部模块 URL，虽已固定版本，仍依赖第三方分发。

检索脚本不会请求这些地址；只有网站实际采用示例后才产生相应请求。Google 官方说明，提供字体时其服务器会接收到访问者 IP，同时说明该 API 不用于广告或创建用户画像。[Google 官方说明](https://fonts.googleblog.com/2022/11/your-privacy-and-google-fonts.html)

外部脚本还引入第三方资源被替换的供应链风险；固定版本号本身不等于内容完整性验证。[MDN 对 SRI 的说明](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity)

建议官网默认采用自托管字体、项目已有依赖和本地构建产物。确需 CDN 时再逐项审查并使用适用的完整性及内容安全策略。此项未发现恶意资源，也未对这些包作漏洞版本判定。

### R2：持久化保留输入原文，缺少程序级脱敏与内容边界

**级别：低；如果输入含私密信息且产物被提交或公开，影响可升为中。**

证据：[design_system.py 第 547 行](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/9b675f0b13c9c28dec445e8ce4633c18c39b6467/.claude/skills/ui-ux-pro-max/scripts/design_system.py#L547) 在省略项目名时使用 `query.upper()`；[第 1127 行](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/9b675f0b13c9c28dec445e8ce4633c18c39b6467/.claude/skills/ui-ux-pro-max/scripts/design_system.py#L1127) 将项目名直接插入 Markdown；页面标题和项目名也进入页面覆盖文件。

临时目录中验证：

- 未设置 `-p` 时，查询中的测试标记进入 `MASTER.md` 的项目字段。
- 多行项目名中的换行及 Markdown 标记保留在文件中。

因此，查询中的客户信息、内部名称等可能随文件留在仓库。若未来将不可信外部文本用作项目名或页面名，生成文件还可能携带额外 Markdown 指令，影响后续读取它的代理；这是潜在的二次提示注入通道，此次没有发现实际恶意载荷或已发生的代理越权。内容不会被此 Python 工具作为代码执行。

[SKILL.md 第 65 行](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/9b675f0b13c9c28dec445e8ce4633c18c39b6467/.claude/skills/ui-ux-pro-max/SKILL.md#L65) 已明确禁止私密输入，并规定结果不能覆盖用户及仓库规则；风险在于这些限制依靠调用者遵守，代码不自动脱敏。

建议持久化时始终传入简短、公开的 `-p`，将项目名和页面名限制为单行文本；不要将客户原文、密钥或不可信指令放进查询。生成文档应始终作为设计参考处理。

### R3：已有目录符号链接可使持久化写入离开指定输出目录

**级别：低，属于本地写入边界加固项。**

证据：[design_system.py 第 1038 行起](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/9b675f0b13c9c28dec445e8ce4633c18c39b6467/.claude/skills/ui-ux-pro-max/scripts/design_system.py#L1038) 拼接 `output-dir/design-system/<slug>`，再创建目录和临时文件，未检查父目录符号链接或解析后的路径归属。

复现仅使用临时目录：在模拟项目里预设 `design-system` 指向另一个临时目录后，`--persist` 将 `MASTER.md` 写入符号链接目标。

触发前提是调用者启用持久化，且目录链上预先存在这样的符号链接或遭本地替换。当前安装目录没有符号链接；此结果不是通过查询文本实现的任意路径写入，也不会让攻击者自行选择任意文件名。

建议写入前验证解析后的路径仍在允许的根目录内，按项目策略拒绝输出目录链中的符号链接；若要防御并发本地攻击，还需使用目录文件描述符及不跟随链接的写入方式，不能只依赖一次 `resolve()` 检查。

### R4：上游测试执行需要可信源码，且部分不能在此安装布局直接运行

**级别：提示 / 维护风险。**

- [test_ime_composition.py 第 64 行](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/9b675f0b13c9c28dec445e8ce4633c18c39b6467/.claude/skills/ui-ux-pro-max/scripts/tests/test_ime_composition.py#L64) 使用 Node `vm.runInNewContext` 执行 CSV 中的 JavaScript 示例。当前示例是正常的 IME 键盘处理，未发现恶意操作。Node 官方明确指出 `vm` 不是安全隔离机制，因此更新后仍须先审查源码及样例，再运行测试。[Node 官方文档](https://nodejs.org/api/vm.html)
- 4 个测试模块向父目录查找完整上游仓库中的脚本或模板。当前项目不包含这些文件，完整测试发现会在模块加载时抛出 `StopIteration`。这是安装布局不兼容，不能据此认定恶意行为，也不能声称完整测试全部通过。
- `react-performance.csv` 的 `Hydration No Flicker` 示例使用固定字符串的 `dangerouslySetInnerHTML`，未发现直接拼接用户输入的 XSS；但它只是片段，不能直接视作经过 CSP、SSR 和实际主题逻辑验证的完整实现。其他反面示例中的危险调用也不能当作正面建议使用。

建议本地明确选择可独立运行的测试；需要运行其余模块时，在已审查的固定上游 checkout 中完成。

## 已确认的安全边界

- 5 个工具模块仅使用 Python 标准库及同目录模块；未发现 HTTP 请求、shell 执行、安装包、后台进程或修改系统设置的路径。
- 正常检索只读取固定本地数据文件。审查时对 12 个域、22 个技术栈和一次设计系统生成的调用，均未触发网络、子进程或文件写入。
- 读取的环境变量是终端显示相关的 `COLORTERM`；没有发现工具读取 `.env`、SSH、云凭据或 API key。测试中的 `GOOGLE_FONTS_API_KEY` 引用用于检查缺失密钥的错误路径，当前安装不包含对应刷新脚本。
- 规则由 JSON 加封闭条件/动作语法解析，未使用 `eval`、`exec`、pickle 或动态执行 CSV。
- 项目名及页面名经过 `safe_slug`，`../../` 等路径字符不会成为路径层级。临时目录探针验证通过。
- 默认持久化使用排他发布，已有 master 和页面文件不会被覆盖；探针验证已有内容保持不变。显式 `force=True` 会替换文件，skill 说明要求对此取得明确授权。
- 全量扫描未发现凭据值、隐藏方向控制字符、零宽注入字符、要求隐瞒操作或忽略上级指令的载荷。测试中的 `evil.example` 是拒绝非官方来源的反面夹具。
- MIT 许可证存在；字体和图标附有来源/许可元数据。元数据不代替未来实际分发素材时对许可文件的核查。

## 验证结果

| 检查 | 结果 |
| --- | --- |
| 全部 20 个 Python 文件 AST 解析 | 通过 |
| 全部 37 个 CSV 结构解析 | 通过，未发现缺列或多列记录 |
| 全部 15 个 JSON 解析 | 通过 |
| 4 个现存 Python 缓存与源码执行内容比较 | 一致 |
| `python3 scripts/validate_data.py`（路径相对 skill） | 通过：12 个域、22 个技术栈及 reasoning 数据 |
| 全部测试模块的 `unittest discover` | 未通过：157 个测试项中有 4 个模块加载错误、1 个跳过 |
| 排除上述 4 个仅适用于上游布局的模块后 | 153 个测试项，152 个通过、1 个跳过，无失败或错误 |
| 安全行为探针 | 通过预期断言，并确认 R2、R3 描述的行为 |

跳过项为缺少上游 `docs/ime-composition.md` 时的文档同步检查。未加载的 4 个模块为 `test_catalog_refresh`、`test_catalog_summary_line_endings`、`test_relevance_evaluator`、`test_skill_script_paths`。

安全探针的持久化、覆盖与符号链接实验均在临时目录进行，没有生成项目设计文件。来源核对和官方文档检索只访问公开资源，没有上传项目源码或私密输入。本次审查没有评估未来上游变更、所有第三方包漏洞或网站本身的完整安全性。
