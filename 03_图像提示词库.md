# 图像提示词库

版本：草案 0.5｜2026-10-19

> **复用说明**：下方 01 是旧版生成记录。用户后来确认夜路碎花裙图为最高优先级主视觉，并否定旧稿裤装和尾巴。旧提示词仅用于追溯，不得直接复用其中的裤装、尾巴或数值年龄；后续以本文件新增的锚点模板为准。这是早期生成记录；当前B01/B03已完成初稿，实际状态见14号记录。

## 当前正式提示词包

[32套完整提示词](10_完整生图提示词包.md)：6基础＋26主题，每条均可独立复制；网站32套提示词页可筛选、查看参考、复制全文和下载TXT。数据正本为prompts/catalog.json，B01与B03已有初稿待审，其余30条未生成。后文保留早期历史记录；执行优先采用32套包中按时期和形态分开的完整prompt。

## 通用角色锁定词

> Xiaobailong Tongzhi, a fictional adult white dragon woman, silver-white naturally fluffy layered short bob ending around the jaw and nape, light violet eyes, softly oval adult face, lively thoughtful expression, exactly one small smooth unbranched pure-white dragon horn on each side of her crown, stable recognizable identity and facial features across images. Refined authored Japanese 2D anime illustration, natural anatomy, silver-white / mist lavender / muted grey-blue palette with a restrained osmanthus-gold accent. Never lengthen her hair or add horns, antlers, branches, wings, or extra fingers.

## 01 标准人设页：旧版生成记录（不直接复用）

**状态：** 已生成一张概念图；图像未获用户确认，不能当成最终角色标准。使用项目内「家里的短发小白龙」作为脸部与画风参考，明确不照搬原图的大角、发长和服装。

```text
Use case: stylized-concept
Asset type: foundational character design sheet for a long-running anime character bible
Input images: Image 1 is a character identity and face-style reference only; do not copy its oversized horns, long hair, outfit, or composition.
Primary request: Create a polished, highly consistent design sheet for Xiaobailong Tongzhi, a fictional adult white dragon woman. Show the same recognizable person in three full-body turnaround views (front, side, back) and four head-and-shoulders expressions (calm, sly amused, sleepy, mildly irritated). Keep the face, haircut, eye color, horn shape, and body proportions identical across every panel.
Subject: Distinctive adult anime woman with softly oval face, subtly defined jaw, small nose, expressive brows, light violet eyes with clear iris detail, silver-white naturally fluffy layered short bob ending around the jaw and nape, airy separated bangs and feathered ends. Exactly two small smooth pure-white dragon horns, one on each side of the crown, gently swept slightly backward, simple unbranched taper, short and symmetrical. Adult proportions around 7.25 heads tall, natural shoulders and hands, slender but not childlike. Optional slim white dragon tail appears only in side/back view, understated and anatomically attached.
Scene/backdrop: clean warm-white studio sheet with pale grey-lavender grounding shadows and ample separation between panels.
Style/medium: refined Japanese 2D anime illustration with distinctive authored linework, controlled cel shading and soft painterly accents; clearly illustrated, not photorealistic and not generic AI beauty styling.
Composition/framing: landscape character sheet; large front, side, and back full-body views aligned at equal scale on the left and center, four consistent expression portraits arranged neatly on the right, a few small color chips along the bottom. No text or labels.
Wardrobe: relaxed ivory knit sweater over a simple mist-lavender shirt, dark slate-blue straight trousers, understated off-white walking sneakers, tiny silver ear cuff or simple silver hairpin. Practical, comfortable, quietly bookish.
Lighting/mood: soft neutral daylight, calm and curious with a hint of mischief.
Color palette: silver-white, mist lavender, low-saturation grey-blue, ivory, charcoal slate; a tiny osmanthus-gold accent only in a color chip.
Materials/textures: visible knit ribbing, soft airy hair strands, matte fabric.
Constraints: precisely one matching pair of small unbranched white dragon horns; same face and hair in all views; adult woman; preserve short hair; readable side and back silhouettes; exactly five fingers on each visible hand.
Avoid: long hair, antlers, deer or goat horns, branched or crab-claw horns, extra horns, wings, extra fingers, child or teen appearance, chibi proportions, sexualized styling, photoreal face, duplicate characters, inconsistent clothes, dramatic props, lettering, watermark.
```

**本次复盘**：脸部得到用户肯定；米白大针织衫加松垮深色直筒裤被用户明确评价为显老；尾巴连接和轮廓不理想。以上两项不可当成角色标准。

## 02 后续统一锚点模板（仅存档，尚未生图）

先附用户确认的 `images/00_夜路主视觉参考_用户确认.webp`，并写明它优先锁定脸部、短发、眼睛与日常造型气质。标准人设图中的二次元人物保持作者化线条；生活图可用真实环境，但人物不能转成普通写实 AI 美女。明确成年女性，不写数字年龄。日常态隐藏龙角和尾巴。每次只换场景、动作和本批服装，不重新设计脸。

建议负面词：长发、幼态比例、模板网红脸、额外或分叉龙角、鹿角/羊角、日常场景露角露尾、从裤腰冒出的尾巴、老干部宽松直筒裤、过度摆拍、额外手指、文字水印。

## 03 居家生活：待用户确认后使用

画面提案：成年小白龙在自己的书桌旁读书到困倦，暖灯只照亮桌面；一只手压着笔记，另一只手托脸，旁边有杯茶和小小的渡鸦饰物。穿柔软但轮廓轻快的家居上衣，不默认长针织衫加宽裤。真实室内光线、二次元人物，不摆拍，不添恋人或身体亲密情节。

## 04 外出日常：锚点复用模板（尚未生图）

画面提案：以用户最喜欢的夜路图为主要参考，保留银白短发、浅紫眼、浅紫碎花连衣裙、浅色柔软针织外套、轻巧小包、树影路灯与温暖夜色。成年小白龙隐藏龙角和尾巴，在真实街道自然慢走或回头看一眼。人物清晰为二次元插画，环境有真实摄影质感；构图像同行者随手拍到，不虚构成精确实景复刻。服装只做轻微变化，不换成裤装标准款。

## 05 标准造型提案：短外套与高腰百褶裙（文字方案，未生图）

**身份图像锚点**：只用 `images/00_夜路主视觉参考_用户确认.webp` 锁定小白龙的脸、银白短发、淡紫眼与整体身份。身份不重设计；日常态隐藏龙角与尾巴。

脸部动态可辅以 `images/02_脸部表情与短发参考_用户认可.webp`：参考脸部神态变化、眼眉关系、短发层次和翘起的轻发束；不沿用其中较大纹理角、尖耳、白衬衫/大针织衫、长尾或深色裤装。

**造型参数**：短款炭灰轻外套，衣摆停在腰线附近；雾紫色合身针织上衣，贴合但留自然松量；高腰炭灰A字百褶短裙，活动褶清楚，可加入一片低对比灰紫格纹；哑光深色薄袜；低帮玛丽珍或德比鞋，鞋底简洁有分量；一件小型银色饰品与紧凑斜挎包。无领带、校徽、白衬衫领或过量腿套。

**人体与画面参数**：成年人自然比例，骨架与关节结构清楚；重心落在承重腿，另一侧肩胯轻微错位，站姿松弛而有方向。裙褶和外套下摆跟随动作与重力，不刻意夸大曲线。标准人设页用精致日系二维动画插画表现，线条清楚，人物面部与夜路参考保持同一人；此处仅保存方向，不立即调用图像生成。

**负面约束**：不改变已确认脸部与短发；不生成成熟写实AI美女；不幼态化；不改成长发；不增加分叉角、额外角、手指或尾巴；不做校服、老干部通勤风、盖胯长针织叠宽直筒裤、过重厚底鞋、过度暴露或夸张人体比例；不模仿任何特定作者的具体笔触、角色或画面。

## 06 学生时代：高马尾阶段锚点（未生图）

学生时代单独使用银白高马尾，表现轻快、行动方便的时期感；它不改变成年日常的银白短发锚点。脸部身份延续同一角色，年龄表现按该阶段自然处理。衣服、发饰、具体年龄与场景暂不锁定；若描绘未成年学生，保持健康、非成人化，不使用强调身体的镜头或服装。先完成文字造型卡，再决定是否画图。
