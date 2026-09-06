# -*- coding: utf-8 -*-
"""
电子学会 C++ 一级考试 常考点分析 PPT（官方考纲对齐版 v2）
依据：中国电子学会《青少年软件编程（CC）等级考试说明》
一级五大知识块（表4）：① 编程环境与基础 ② 变量与运算 ③ 程序基本结构（顺序）
④ 选择结构 ⑤ 循环结构（单层）
题型分值：单选 10题×4分=40分，判断 10题×2分=20分，编程 2题×20分=40分
不含：数组、字符串、自定义函数、文件读写、多层循环（均为二级及以上）
"""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

# ---------- 主题色 ----------
C_PRIMARY = RGBColor(0x1B, 0x4B, 0x8F)   # 深蓝
C_ACCENT  = RGBColor(0xF5, 0x9E, 0x0B)   # 橙
C_BG      = RGBColor(0xF5, 0xF7, 0xFA)   # 浅底
C_TEXT    = RGBColor(0x1F, 0x29, 0x37)   # 正文
C_WHITE   = RGBColor(0xFF, 0xFF, 0xFF)
C_GREEN   = RGBColor(0x0E, 0x9F, 0x6E)
C_RED     = RGBColor(0xDC, 0x26, 0x26)
C_GRAY    = RGBColor(0x6B, 0x72, 0x80)

SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)
FONT = "微软雅黑"

prs = Presentation()
prs.slide_width = SLIDE_W
prs.slide_height = SLIDE_H
BLANK = prs.slide_layouts[6]


def add_rect(slide, x, y, w, h, fill, line=None):
    from pptx.enum.shapes import MSO_SHAPE
    sh = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, h)
    sh.fill.solid()
    sh.fill.fore_color.rgb = fill
    if line:
        sh.line.color.rgb = line
        sh.line.width = Pt(1)
    else:
        sh.line.fill.background()
    sh.shadow.inherit = False
    return sh


def add_text(slide, x, y, w, h, text, size=18, color=C_TEXT, bold=False,
             align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP, line_spacing=1.15):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    lines = text.split("\n")
    for i, ln in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = ln
        p.alignment = align
        p.line_spacing = line_spacing
        for r in p.runs:
            r.font.size = Pt(size)
            r.font.color.rgb = color
            r.font.bold = bold
            r.font.name = FONT
    return tb


def new_slide():
    s = prs.slides.add_slide(BLANK)
    add_rect(s, 0, 0, SLIDE_W, SLIDE_H, C_BG)
    return s


def title_bar(slide, title, sub=""):
    add_rect(slide, 0, 0, SLIDE_W, Inches(1.05), C_PRIMARY)
    add_rect(slide, Inches(0.55), Inches(0.28), Inches(0.14), Inches(0.5), C_ACCENT)
    add_text(slide, Inches(0.85), Inches(0.14), Inches(10.5), Inches(0.75),
             title, size=26, color=C_WHITE, bold=True, anchor=MSO_ANCHOR.MIDDLE)
    if sub:
        add_text(slide, Inches(9.0), Inches(0.30), Inches(3.9), Inches(0.5),
                 sub, size=13, color=RGBColor(0xCF, 0xDD, 0xF2),
                 align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.MIDDLE)


def add_table(slide, x, y, w, rows, col_widths, header_fill=C_PRIMARY,
              row_h=Inches(0.52), font_size=14):
    n_rows, n_cols = len(rows), len(rows[0])
    shape = slide.shapes.add_table(n_rows, n_cols, x, y, w, row_h * n_rows)
    tbl = shape.table
    for ci, cw in enumerate(col_widths):
        tbl.columns[ci].width = cw
    for ri, row in enumerate(rows):
        for ci, val in enumerate(row):
            cell = tbl.cell(ri, ci)
            cell.text = str(val)
            cell.margin_left = Inches(0.1)
            cell.margin_right = Inches(0.05)
            cell.margin_top = Inches(0.03)
            cell.margin_bottom = Inches(0.03)
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            if ri == 0:
                cell.fill.solid()
                cell.fill.fore_color.rgb = header_fill
            elif ri % 2 == 0:
                cell.fill.solid()
                cell.fill.fore_color.rgb = RGBColor(0xED, 0xF2, 0xF9)
            else:
                cell.fill.solid()
                cell.fill.fore_color.rgb = C_WHITE
            for p in cell.text_frame.paragraphs:
                p.alignment = PP_ALIGN.CENTER
                for r in p.runs:
                    r.font.size = Pt(font_size)
                    r.font.name = FONT
                    r.font.bold = (ri == 0)
                    r.font.color.rgb = C_WHITE if ri == 0 else C_TEXT
    return tbl


def add_card(slide, x, y, w, h, title, body, title_color=C_PRIMARY, body_size=13):
    add_rect(slide, x, y, w, h, C_WHITE, line=RGBColor(0xE2, 0xE8, 0xF0))
    add_rect(slide, x, y, Inches(0.09), h, title_color)
    add_text(slide, x + Inches(0.25), y + Inches(0.12), w - Inches(0.4), Inches(0.4),
             title, size=15, color=title_color, bold=True)
    add_text(slide, x + Inches(0.25), y + Inches(0.58), w - Inches(0.4), h - Inches(0.7),
             body, size=body_size, color=C_TEXT)


def add_code(slide, x, y, w, h, code, size=13):
    add_rect(slide, x, y, w, h, RGBColor(0x0F, 0x1E, 0x3D))
    add_text(slide, x + Inches(0.2), y + Inches(0.1), w - Inches(0.35), h - Inches(0.2),
             code, size=size, color=RGBColor(0x8B, 0xE9, 0xC6),
             line_spacing=1.15)


# ============ P1 封面 ============
s = new_slide()
add_rect(s, 0, 0, SLIDE_W, Inches(2.6), C_PRIMARY)
add_rect(s, 0, Inches(2.6), SLIDE_W, Inches(0.12), C_ACCENT)
add_text(s, Inches(0.9), Inches(0.7), Inches(11.5), Inches(1.1),
         "电子学会 C++ 一级考试 · 常考点分析", size=40, color=C_WHITE, bold=True)
add_text(s, Inches(0.9), Inches(1.8), Inches(11.5), Inches(0.6),
         "依据《青少年软件编程（CC）等级考试说明》官方考纲整理", size=17,
         color=RGBColor(0xCF, 0xDD, 0xF2))
add_text(s, Inches(0.9), Inches(3.2), Inches(11.5), Inches(0.7),
         "五大知识块 ｜ 单层循环封顶 ｜ 客观题 60% + 编程题 40%", size=22,
         color=C_PRIMARY, bold=True)
add_text(s, Inches(0.9), Inches(4.1), Inches(11.5), Inches(2.2),
         "本讲重点：\n"
         "① 官方考纲五大知识块与题数分布\n"
         "② 每个知识块的高频考点与典型考法\n"
         "③ 编程题两大热门题型与代码模板\n"
         "④ 易错点 TOP5 与备考策略",
         size=18, color=C_TEXT, line_spacing=1.5)
add_text(s, Inches(0.9), Inches(6.6), Inches(11.5), Inches(0.5),
         "少儿编程 C++ Level 1 ｜ 考点精讲配套 · 应试冲刺篇", size=14, color=C_GRAY)

# ============ P2 考试概况 ============
s = new_slide()
title_bar(s, "考试概况：题型与分值", "官方考试说明 · 表3/表4")
rows = [
    ["题型", "题量", "每题分值", "小计", "说明"],
    ["单选题", "10 题", "4 分", "40 分", "五大知识块全覆盖"],
    ["判断题", "10 题", "2 分", "20 分", "概念辨析为主"],
    ["编程题", "2 题", "20 分", "40 分", "只出自 ③顺序结构 ⑤循环结构"],
    ["合计", "22 题", "—", "100 分", "客观题 60% + 编程题 40%"],
]
add_table(s, Inches(0.7), Inches(1.45), Inches(12.0), rows,
          [Inches(1.8), Inches(1.6), Inches(1.8), Inches(1.6), Inches(5.2)],
          row_h=Inches(0.62), font_size=15)
add_card(s, Inches(0.7), Inches(4.6), Inches(5.85), Inches(2.3),
         "客观题 = 得分基本盘",
         "单选 + 判断共 60 分，覆盖全部五大知识块。\n"
         "② 变量与运算 一块就占 4 单选 + 5 判断，\n"
         "是客观题出题量最大的知识块，\n"
         "概念题拿稳，60 分基本盘就稳。", title_color=C_GREEN)
add_card(s, Inches(6.8), Inches(4.6), Inches(5.85), Inches(2.3),
         "编程题 = 过线关键",
         "2 题编程出自「顺序结构」和「循环结构」。\n"
         "典型题：数位分离、累加求和。\n"
         "编译通过 + 结果正确即给分，\n"
         "规范书写 #include 与 main 框架是第一步。",
         title_color=C_ACCENT)

# ============ P3 考纲五大知识块 ============
s = new_slide()
title_bar(s, "考纲五大知识块（表4 题数分布）", "一级考纲")
rows = [
    ["知识块", "单选", "判断", "编程", "考察侧重"],
    ["① 编程环境与基础", "2", "1", "—", "开发环境使用、程序基本框架"],
    ["② 变量与运算", "4", "5", "—", "变量/类型/运算符/输入输出/数学函数"],
    ["③ 程序基本结构（顺序）", "1", "1", "1", "语句顺序、cin/cout、数位分离"],
    ["④ 选择结构", "1", "1", "—", "if/else、关系与逻辑运算"],
    ["⑤ 循环结构（单层）", "2", "2", "1", "for/while、累加累乘、循环次数"],
]
add_table(s, Inches(0.7), Inches(1.45), Inches(12.0), rows,
          [Inches(3.6), Inches(1.2), Inches(1.2), Inches(1.2), Inches(4.8)],
          row_h=Inches(0.6), font_size=14)
add_rect(s, Inches(0.7), Inches(5.35), Inches(12.0), Inches(1.55), C_WHITE,
         line=RGBColor(0xE2, 0xE8, 0xF0))
add_rect(s, Inches(0.7), Inches(5.35), Inches(0.09), Inches(1.55), C_RED)
add_text(s, Inches(0.95), Inches(5.5), Inches(11.5), Inches(1.3),
         "⚠ 一级明确不考：数组、字符串(string)、自定义函数、文件读写、多层/嵌套循环、结构体、指针\n"
         "这些全部是二级及以上内容 —— 备考一级不要超纲刷题，把单层循环和运算吃透就够。",
         size=16, color=C_TEXT, line_spacing=1.4)

# ============ P4 知识块① 编程环境与基础 ============
s = new_slide()
title_bar(s, "知识块① 编程环境与基础（2单选 + 1判断）", "常考点 1/5")
add_card(s, Inches(0.7), Inches(1.35), Inches(5.9), Inches(2.6),
         "高频考点",
         "· 开发环境：IDE（如 Dev-C++）的 新建/保存/编译/运行 流程\n"
         "· 源程序文件扩展名 .cpp\n"
         "· 「编译」和「运行」分别做什么\n"
         "· 常见编译错误提示与定位", title_color=C_PRIMARY)
add_card(s, Inches(6.75), Inches(1.35), Inches(5.9), Inches(2.6),
         "程序基本框架（必背）",
         "#include <iostream>   // 头文件\n"
         "using namespace std;\n"
         "int main() {\n"
         "    return 0;          // 程序正常结束\n"
         "}",
         title_color=C_ACCENT, body_size=12)
add_rect(s, Inches(0.7), Inches(4.25), Inches(12.0), Inches(2.6), C_WHITE,
         line=RGBColor(0xE2, 0xE8, 0xF0))
add_rect(s, Inches(0.7), Inches(4.25), Inches(0.09), Inches(2.6), C_RED)
add_text(s, Inches(0.95), Inches(4.4), Inches(11.4), Inches(2.3),
         "常考判断题 / 单选题角度：\n"
         "· 「C++ 程序必须有且只有一个 main 函数」→ 对\n"
         "· 「return 0; 写不写都能编译通过，但规范程序要写」→ 对\n"
         "· 「.cpp 是源文件，编译后生成可执行文件」→ 对\n"
         "· 「一条语句结束要写分号 ;」→ 对（漏分号是最常见编译错误）",
         size=15, color=C_TEXT, line_spacing=1.5)

# ============ P5 知识块② 变量与运算 ============
s = new_slide()
title_bar(s, "知识块② 变量与运算（4单选 + 5判断 · 客观题最大头）", "常考点 2/5")
add_card(s, Inches(0.7), Inches(1.35), Inches(5.9), Inches(2.75),
         "高频考点清单",
         "· 变量定义与命名规则（字母/数字/下划线，数字不开头）\n"
         "· 数据类型：int / long long / float / double / char / bool\n"
         "· 赋值语句 = 的含义（先算右边，再存左边）\n"
         "· 算术运算符 + - * / % 及优先级\n"
         "· 自增自减 i++ / ++i 的取值时机", title_color=C_PRIMARY, body_size=13)
add_card(s, Inches(6.75), Inches(1.35), Inches(5.9), Inches(2.75),
         "输入输出与数学函数",
         "· cin >> a >> b; 与 cout << a << endl;\n"
         "· cin 按空格/回车分隔读入\n"
         "· 整数除法截断：5 / 2 = 2，不是 2.5\n"
         "· 取余 % 只能用于整数：5 % 2 = 1\n"
         "· 常用函数：sqrt()、fabs()、pow()（需 <cmath>）",
         title_color=C_ACCENT, body_size=13)
add_rect(s, Inches(0.7), Inches(4.35), Inches(12.0), Inches(2.5), C_WHITE,
         line=RGBColor(0xE2, 0xE8, 0xF0))
add_rect(s, Inches(0.7), Inches(4.35), Inches(0.09), Inches(2.5), C_RED)
add_text(s, Inches(0.95), Inches(4.5), Inches(11.4), Inches(2.2),
         "典型考法示例：\n"
         "· int a = 7 / 2;        → a = 3（整数除法向下截断）\n"
         "· int a = 7 % 2;        → a = 1（取余）\n"
         "· int x = 3; cout << x++; → 输出 3（先取值后加）；cout << ++x; → 输出 4\n"
         "· 变量命名判断：3abc ✗ / my_age ✓ / int ✗（关键字）",
         size=15, color=C_TEXT, line_spacing=1.5)

# ============ P6 知识块③ 顺序结构 ============
s = new_slide()
title_bar(s, "知识块③ 程序基本结构 · 顺序结构（1单选 + 1判断 + 1编程）", "常考点 3/5")
add_card(s, Inches(0.7), Inches(1.35), Inches(5.9), Inches(2.4),
         "考点要点",
         "· 程序自上而下、逐句执行，顺序不能随意调换\n"
         "· 「先输入、再计算、后输出」的经典三段式\n"
         "· 输出格式：endl / \\n 换行，多个 << 串联", title_color=C_PRIMARY, body_size=13)
add_card(s, Inches(6.75), Inches(1.35), Inches(5.9), Inches(2.4),
         "编程题热门：数位分离",
         "输入一个三位正整数，分别输出个位、十位、百位。\n"
         "核心工具：%（取余）和 /（整除）\n"
         "变式：求各位数字之和、反转三位数。",
         title_color=C_ACCENT, body_size=13)
add_code(s, Inches(0.7), Inches(4.0), Inches(12.0), Inches(2.85),
         "// 数位分离模板（顺序结构编程题高频）\n"
         "#include <iostream>\n"
         "using namespace std;\n"
         "int main() {\n"
         "    int n;\n"
         "    cin >> n;              // 输入 385\n"
         "    int g = n % 10;        // 个位 5\n"
         "    int s = n / 10 % 10;   // 十位 8\n"
         "    int b = n / 100;       // 百位 3\n"
         "    cout << b << \" \" << s << \" \" << g << endl;\n"
         "    return 0;\n"
         "}", size=13)

# ============ P7 知识块④ 选择结构 ============
s = new_slide()
title_bar(s, "知识块④ 选择结构（1单选 + 1判断）", "常考点 4/5")
add_card(s, Inches(0.7), Inches(1.35), Inches(5.9), Inches(2.6),
         "高频考点",
         "· 单分支 if / 双分支 if-else / 多分支 else-if\n"
         "· 关系运算符 > < >= <= == !=\n"
         "· 逻辑运算符 &&（与）||（或）!（非）\n"
         "· 条件嵌套与代码缩进", title_color=C_PRIMARY)
add_card(s, Inches(6.75), Inches(1.35), Inches(5.9), Inches(2.6),
         "易混易错",
         "· == 是判断，= 是赋值：if(a == 5) ✓ if(a = 5) ✗\n"
         "· 1 <= x <= 10 是数学写法，C++ 要写 x >= 1 && x <= 10\n"
         "· 逻辑短路：&& 左边为假则不算右边",
         title_color=C_ACCENT, body_size=13)
add_code(s, Inches(0.7), Inches(4.2), Inches(12.0), Inches(2.6),
         "// 成绩判断：多分支典型写法\n"
         "int score;\n"
         "cin >> score;\n"
         "if (score >= 90)      cout << \"优秀\";\n"
         "else if (score >= 60) cout << \"及格\";\n"
         "else                  cout << \"不及格\";",
         size=14)

# ============ P8 知识块⑤ 循环结构 ============
s = new_slide()
title_bar(s, "知识块⑤ 循环结构 · 单层（2单选 + 2判断 + 1编程）", "常考点 5/5")
add_card(s, Inches(0.7), Inches(1.35), Inches(5.9), Inches(2.6),
         "高频考点",
         "· for(初值; 条件; 更新) 执行流程与次数计算\n"
         "· while(条件) 与 do-while（先执行一次再判断）\n"
         "· 累加器 sum、计数器 cnt 的用法\n"
         "· 死循环成因：条件恒真 / 忘记更新循环变量", title_color=C_PRIMARY, body_size=13)
add_card(s, Inches(6.75), Inches(1.35), Inches(5.9), Inches(2.6),
         "编程题热门题型",
         "· 累加：1+2+…+n、1~n 偶数之和\n"
         "· 累乘：n!（阶乘）\n"
         "· 循环内判断：能被 3 整除的数\n"
         "· 循环读入 n 个数求和（cin >> x 连续读）",
         title_color=C_ACCENT, body_size=13)
add_code(s, Inches(0.7), Inches(4.2), Inches(12.0), Inches(2.6),
         "// 1~n 累加（循环编程题模板）          // 循环次数判断（单选题典型）\n"
         "int n, sum = 0;                       // for (int i = 0; i < 5; i++) 执行几次？\n"
         "cin >> n;                             // → 5 次\n"
         "for (int i = 1; i <= n; i++)          // for (int i = 1; i <= 5; i++) 呢？\n"
         "    sum += i;                         // → 也是 5 次（边界 <= 要看清）\n"
         "cout << sum << endl;",
         size=13)

# ============ P9 编程题两大热门题型 ============
s = new_slide()
title_bar(s, "编程题怎么考：两大热门题型", "2 题 × 20 分")
add_card(s, Inches(0.7), Inches(1.4), Inches(5.9), Inches(2.5),
         "题型一：数位分离类（顺序结构）",
         "· 拆出个位/十位/百位并输出\n"
         "· 求各位数字之和\n"
         "· 三位数反转输出\n"
         "核心：n % 10 与 n / 10 的组合运用",
         title_color=C_PRIMARY, body_size=14)
add_card(s, Inches(6.75), Inches(1.4), Inches(5.9), Inches(2.5),
         "题型二：循环累加类（循环结构）",
         "· 1+2+…+n 求和\n"
         "· 1~n 中偶数/奇数之和\n"
         "· n! 阶乘\n"
         "核心：初始化 sum=0（或 cnt=0）+ for 循环",
         title_color=C_ACCENT, body_size=14)
add_rect(s, Inches(0.7), Inches(4.15), Inches(12.0), Inches(2.75), C_WHITE,
         line=RGBColor(0xE2, 0xE8, 0xF0))
add_rect(s, Inches(0.7), Inches(4.15), Inches(0.09), Inches(2.75), C_GREEN)
add_text(s, Inches(0.95), Inches(4.3), Inches(11.4), Inches(2.5),
         "编程题拿分四步走：\n"
         "① 认真读题：明确输入是什么、输出什么（先手算一组样例）\n"
         "② 搭好框架：#include <iostream> + using namespace std; + int main() { ... return 0; }\n"
         "③ 选对工具：拆位用 % 和 /，重复计算用 for/while\n"
         "④ 检查输出格式：空格、换行、有无提示文字，务必与题目要求一致",
         size=15, color=C_TEXT, line_spacing=1.5)

# ============ P10 易错点 TOP5 ============
s = new_slide()
title_bar(s, "易错点 TOP5（真题高频失分点）", "避坑清单")
items = [
    ("1", "整数除法截断", "5 / 2 = 2 而不是 2.5；需要小数结果时写成 5.0 / 2 或 5 / 2.0"),
    ("2", "= 与 == 混用", "if (a = 5) 是赋值永远为真；判断相等必须写 if (a == 5)"),
    ("3", "取余限制", "% 只能用于整数，5.5 % 2 直接编译报错"),
    ("4", "循环边界差一", "i <= n 与 i < n 循环次数不同；数错次数是单选题最爱"),
    ("5", "变量未初始化", "sum 没有先赋 0 就累加，结果是随机数；循环变量忘记更新导致死循环"),
]
y = Inches(1.4)
for num, title, desc in items:
    add_rect(s, Inches(0.7), y, Inches(12.0), Inches(1.02), C_WHITE,
             line=RGBColor(0xE2, 0xE8, 0xF0))
    add_rect(s, Inches(0.7), y, Inches(0.75), Inches(1.02), C_RED)
    add_text(s, Inches(0.7), y, Inches(0.75), Inches(1.02), num, size=22,
             color=C_WHITE, bold=True, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(1.7), y + Inches(0.08), Inches(3.1), Inches(0.85),
             title, size=16, color=C_PRIMARY, bold=True, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(4.9), y + Inches(0.08), Inches(7.6), Inches(0.85),
             desc, size=13, color=C_TEXT, anchor=MSO_ANCHOR.MIDDLE)
    y += Inches(1.12)

# ============ P11 高频代码模板 ============
s = new_slide()
title_bar(s, "高频代码模板（一页速记）", "考场直接套")
add_text(s, Inches(0.7), Inches(1.25), Inches(5.9), Inches(0.4),
         "① 数位分离", size=16, color=C_PRIMARY, bold=True)
add_code(s, Inches(0.7), Inches(1.7), Inches(5.9), Inches(2.35),
         "int n, g, s, b;\n"
         "cin >> n;\n"
         "g = n % 10;      // 个位\n"
         "s = n / 10 % 10; // 十位\n"
         "b = n / 100;     // 百位\n"
         "cout << g + s + b; // 各位之和",
         size=12)
add_text(s, Inches(6.75), Inches(1.25), Inches(5.9), Inches(0.4),
         "② 累加求和（1~n 偶数和）", size=16, color=C_PRIMARY, bold=True)
add_code(s, Inches(6.75), Inches(1.7), Inches(5.9), Inches(2.35),
         "int n, sum = 0;\n"
         "cin >> n;\n"
         "for (int i = 2; i <= n; i += 2)\n"
         "    sum += i;\n"
         "cout << sum << endl;\n"
         "// 奇数和：i 从 1 开始，i += 2",
         size=12)
add_text(s, Inches(0.7), Inches(4.25), Inches(5.9), Inches(0.4),
         "③ 阶乘 n!", size=16, color=C_PRIMARY, bold=True)
add_code(s, Inches(0.7), Inches(4.7), Inches(5.9), Inches(2.2),
         "long long f = 1;\n"
         "int n;\n"
         "cin >> n;\n"
         "for (int i = 1; i <= n; i++)\n"
         "    f *= i;\n"
         "cout << f << endl;",
         size=12)
add_text(s, Inches(6.75), Inches(4.25), Inches(5.9), Inches(0.4),
         "④ 基本程序框架", size=16, color=C_PRIMARY, bold=True)
add_code(s, Inches(6.75), Inches(4.7), Inches(5.9), Inches(2.2),
         "#include <iostream>\n"
         "using namespace std;\n"
         "int main() {\n"
         "    // 你的代码写在这里\n"
         "    return 0;\n"
         "}",
         size=12)

# ============ P12 备考策略 ============
s = new_slide()
title_bar(s, "备考策略：三阶段冲刺", "考前三步走")
stages = [
    ("第一阶段 · 打基础", "对照五大知识块过一遍概念；\n每块整理 1 页笔记；\n把基本程序框架默写 10 遍。", C_PRIMARY),
    ("第二阶段 · 刷真题", "以顺序结构和单层循环的\n基础题为主（不超纲刷数组/嵌套）；\n客观题按知识块分类订正。", C_ACCENT),
    ("第三阶段 · 考前一周", "每天 1 套模拟：限时做完\n单选+判断+2 道编程；\n背熟高频代码模板，练手写。", C_GREEN),
]
x = Inches(0.7)
for title, body, color in stages:
    add_card(s, x, Inches(1.45), Inches(3.85), Inches(2.9), title, body,
             title_color=color, body_size=14)
    x += Inches(4.08)
add_rect(s, Inches(0.7), Inches(4.7), Inches(12.0), Inches(2.2), C_WHITE,
         line=RGBColor(0xE2, 0xE8, 0xF0))
add_rect(s, Inches(0.7), Inches(4.7), Inches(0.09), Inches(2.2), C_RED)
add_text(s, Inches(0.95), Inches(4.9), Inches(11.4), Inches(1.9),
         "给家长的提示：\n"
         "· 一级是入门级认证，重点考察「写对基础程序」而不是「会高级语法」，不要让孩子提前学数组、嵌套循环等二级内容增加负担\n"
         "· 编程题不要求算法巧妙，只要编译通过、样例正确即可拿分——让孩子养成「先手算样例再写代码」的习惯\n"
         "· 平时练习建议使用与考场一致的 IDE 环境，熟悉编译、运行、看错误提示的全流程",
         size=14, color=C_TEXT, line_spacing=1.45)

# ============ P13 一页纸速记卡 ============
s = new_slide()
title_bar(s, "一页纸速记卡（总复习 / 可打印）", "背完这页就去考试")
left = (
    "【五大知识块】\n"
    "① 环境与框架：#include + main + return 0\n"
    "② 变量运算：int/double、= 赋值、+ - * / %\n"
    "③ 顺序结构：cin → 计算 → cout\n"
    "④ 选择结构：if / else-if、== !=、&& || !\n"
    "⑤ 循环结构：for / while、sum 累加\n"
    "\n【必背公式】\n"
    "个位 = n % 10    十位 = n / 10 % 10\n"
    "百位 = n / 100   累加先 sum = 0"
)
right = (
    "【得分策略】\n"
    "· 客观题 60 分：概念题逐条对照速记卡\n"
    "· 编程题 40 分：数位分离 + 循环累加\n"
    "· 先搭框架，再填逻辑，最后对样例\n"
    "\n【不考提醒】\n"
    "数组 / 字符串 / 函数 / 文件 / 嵌套循环\n"
    "→ 都是二级内容，一级别浪费时间\n"
    "\n【临场检查】\n"
    "= 还是 == ？  分号有没有漏？\n"
    "sum 初始化了吗？ 循环边界 <= 还是 < ？"
)
add_rect(s, Inches(0.7), Inches(1.35), Inches(5.9), Inches(5.55), C_WHITE,
         line=RGBColor(0xE2, 0xE8, 0xF0))
add_text(s, Inches(0.95), Inches(1.55), Inches(5.4), Inches(5.2), left,
         size=14, color=C_TEXT, line_spacing=1.35)
add_rect(s, Inches(6.75), Inches(1.35), Inches(5.9), Inches(5.55), C_WHITE,
         line=RGBColor(0xE2, 0xE8, 0xF0))
add_text(s, Inches(7.0), Inches(1.55), Inches(5.4), Inches(5.2), right,
         size=14, color=C_TEXT, line_spacing=1.35)

OUT = "/Users/huaweimin/cpp1-exam/output/C++一级常考点分析.pptx"
prs.save(OUT)
print(f"已生成 {len(prs.slides)} 页 → {OUT}")
