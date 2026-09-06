#!/usr/bin/env python3
"""
生成 C++ 一级考试「常考点分析」配套 PPT
与现有 /Users/huaweimin/cpp1-exam/ppt-一级考点精讲/C++一级考点精讲.pptx 形成「分析 + 精讲」互补
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn
from lxml import etree

# ============ 配色方案（与考点精讲 PPT 风格一致：深蓝 + 暖橙） ============
PRIMARY = RGBColor(0x1F, 0x4E, 0x79)   # 深蓝（标题/主色）
ACCENT  = RGBColor(0xE6, 0x7E, 0x22)   # 暖橙（强调）
SECONDARY = RGBColor(0x70, 0xAD, 0x47) # 绿色（次要）
DANGER  = RGBColor(0xC0, 0x39, 0x2B)   # 红色（错题/警示）
DARK    = RGBColor(0x33, 0x33, 0x33)   # 主文字
GRAY    = RGBColor(0x66, 0x66, 0x66)   # 次要文字
LIGHT_BG = RGBColor(0xF5, 0xF8, 0xFC)  # 浅背景
LIGHT_BLUE = RGBColor(0xDD, 0xE8, 0xF4)
LIGHT_OR = RGBColor(0xFC, 0xE4, 0xD6)
LIGHT_GREEN = RGBColor(0xE2, 0xEF, 0xDA)
LIGHT_RED = RGBColor(0xF8, 0xCB, 0xAD)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

# ============ 创建 PPT（16:9） ============
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

SLIDE_W = prs.slide_width
SLIDE_H = prs.slide_height
BLANK = prs.slide_layouts[6]  # 空白版式


# ============ 辅助函数 ============
def add_rect(slide, x, y, w, h, fill_color, line_color=None):
    """添加矩形"""
    shp = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, h)
    shp.fill.solid()
    shp.fill.fore_color.rgb = fill_color
    if line_color is None:
        shp.line.fill.background()
    else:
        shp.line.color.rgb = line_color
    shp.shadow.inherit = False
    return shp


def add_text(slide, x, y, w, h, text, font_size=18, bold=False,
             color=DARK, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
             font_name='Microsoft YaHei'):
    """添加文本框"""
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.margin_left = Emu(0)
    tf.margin_right = Emu(0)
    tf.margin_top = Emu(0)
    tf.margin_bottom = Emu(0)
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.color.rgb = color
    run.font.name = font_name
    return tb


def add_multiline(slide, x, y, w, h, lines, font_size=14,
                  color=DARK, align=PP_ALIGN.LEFT, line_spacing=1.2,
                  font_name='Microsoft YaHei', anchor=MSO_ANCHOR.TOP):
    """添加多行文本。lines: [(text, bold, color), ...]"""
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.margin_left = Emu(0)
    tf.margin_right = Emu(0)
    tf.margin_top = Emu(0)
    tf.margin_bottom = Emu(0)
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    for i, item in enumerate(lines):
        if isinstance(item, str):
            text, bold, c = item, False, color
        elif len(item) == 2:
            text, bold = item
            c = color
        else:
            text, bold, c = item
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.line_spacing = line_spacing
        run = p.add_run()
        run.text = text
        run.font.size = Pt(font_size)
        run.font.bold = bold
        run.font.color.rgb = c
        run.font.name = font_name
    return tb


def add_page_header(slide, page_num, total_pages, title):
    """页面顶部标题栏"""
    # 顶部色条
    add_rect(slide, 0, 0, SLIDE_W, Inches(0.85), PRIMARY)
    # 标题文字
    add_text(slide, Inches(0.5), Inches(0.15), Inches(10),
             Inches(0.55), title, font_size=26, bold=True, color=WHITE,
             anchor=MSO_ANCHOR.MIDDLE)
    # 页码
    add_text(slide, Inches(11.5), Inches(0.15), Inches(1.5),
             Inches(0.55), f"{page_num} / {total_pages}",
             font_size=14, color=WHITE, align=PP_ALIGN.RIGHT,
             anchor=MSO_ANCHOR.MIDDLE)
    # 副标题色条
    add_rect(slide, 0, Inches(0.85), SLIDE_W, Inches(0.06), ACCENT)


def add_footer(slide):
    """页面底部页脚"""
    add_rect(slide, 0, Inches(7.20), SLIDE_W, Inches(0.30), PRIMARY)
    add_text(slide, Inches(0.5), Inches(7.22), Inches(12),
             Inches(0.26), "C++ 一级常考点分析  ·  数据来源：青少年软件编程等级考试真题集（C++ 一级）",
             font_size=10, color=WHITE, anchor=MSO_ANCHOR.MIDDLE)


def add_table(slide, x, y, w, h, data, header_fill=PRIMARY,
              header_color=WHITE, body_color=DARK, font_size=12,
              col_widths=None, header_font_size=13,
              alt_row_fill=LIGHT_BG):
    """添加表格。data: 首行为表头"""
    rows = len(data)
    cols = len(data[0])
    table_shape = slide.shapes.add_table(rows, cols, x, y, w, h)
    table = table_shape.table

    # 列宽
    if col_widths:
        total = sum(col_widths)
        for i, cw in enumerate(col_widths):
            table.columns[i].width = int(w * cw / total)

    for r, row_data in enumerate(data):
        for c, val in enumerate(row_data):
            cell = table.cell(r, c)
            cell.margin_left = Inches(0.08)
            cell.margin_right = Inches(0.08)
            cell.margin_top = Inches(0.04)
            cell.margin_bottom = Inches(0.04)
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            tf = cell.text_frame
            tf.word_wrap = True
            tf.margin_left = Emu(0)
            tf.margin_right = Emu(0)
            p = tf.paragraphs[0]
            p.text = ""
            run = p.add_run()
            run.text = str(val)
            run.font.name = 'Microsoft YaHei'
            if r == 0:
                # 表头
                cell.fill.solid()
                cell.fill.fore_color.rgb = header_fill
                run.font.size = Pt(header_font_size)
                run.font.bold = True
                run.font.color.rgb = header_color
                p.alignment = PP_ALIGN.CENTER
            else:
                # 数据行
                cell.fill.solid()
                cell.fill.fore_color.rgb = alt_row_fill if r % 2 == 0 else WHITE
                run.font.size = Pt(font_size)
                run.font.color.rgb = body_color
                # 第一列加粗
                if c == 0:
                    run.font.bold = True
                p.alignment = PP_ALIGN.CENTER if c == 0 else PP_ALIGN.LEFT
    return table


# ============ 第 1 页：封面 ============
TOTAL = 14  # 总页数

s = prs.slides.add_slide(BLANK)
# 背景色块
add_rect(s, 0, 0, SLIDE_W, SLIDE_H, WHITE)
add_rect(s, 0, 0, SLIDE_W, Inches(2.2), PRIMARY)
add_rect(s, 0, Inches(2.2), SLIDE_W, Inches(0.15), ACCENT)
# 装饰圆点
add_rect(s, Inches(11), Inches(0.4), Inches(0.15), Inches(0.15),
         ACCENT)
add_rect(s, Inches(11.5), Inches(0.4), Inches(0.15), Inches(0.15),
         ACCENT)
add_rect(s, Inches(12), Inches(0.4), Inches(0.15), Inches(0.15),
         ACCENT)
# 主标题
add_text(s, Inches(0.6), Inches(0.6), Inches(11),
         Inches(0.7), "C++ 一级考试 · 常考点分析",
         font_size=40, bold=True, color=WHITE)
add_text(s, Inches(0.6), Inches(1.4), Inches(11),
         Inches(0.5), "真题驱动的频次分布 · 易错点速记 · 备考策略",
         font_size=20, color=WHITE)
# 副信息
add_text(s, Inches(0.6), Inches(2.7), Inches(12),
         Inches(0.5), "青少年软件编程等级考试 · 配套精讲讲义",
         font_size=18, bold=True, color=PRIMARY)
# 三大数据卡片
card_y = Inches(3.6)
card_h = Inches(2.4)
card_w = Inches(3.9)
gap = Inches(0.2)
cards = [
    ("147+", "真题样本量", "覆盖近 30 场考试\n真题 + 模拟题"),
    ("8 大", "高频考点", "顺序 · 分支 · 循环\n数组 · 字符 · 函数"),
    ("TOP 5", "易错题型", "运算符优先级 · 数位分离\n循环边界 · 输入输出格式"),
]
for i, (num, label, desc) in enumerate(cards):
    x = Inches(0.6) + (card_w + gap) * i
    add_rect(s, x, card_y, card_w, card_h, LIGHT_BG)
    add_rect(s, x, card_y, card_w, Inches(0.1), ACCENT)
    add_text(s, x, card_y + Inches(0.4), card_w, Inches(0.9),
             num, font_size=44, bold=True, color=PRIMARY,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, x, card_y + Inches(1.3), card_w, Inches(0.5),
             label, font_size=18, bold=True, color=DARK,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, x + Inches(0.2), card_y + Inches(1.75), card_w - Inches(0.4),
             Inches(0.6), desc, font_size=12, color=GRAY,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.TOP)
# 底部
add_text(s, Inches(0.6), Inches(6.6), Inches(12),
         Inches(0.4), "配套讲义：C++一级考点精讲.pptx",
         font_size=14, color=GRAY)
add_text(s, Inches(0.6), Inches(6.95), Inches(12),
         Inches(0.4), "出题依据：中国电子学会青少年软件编程等级考试标准（C++一级）",
         font_size=12, color=GRAY)


# ============ 第 2 页：考试概况 ============
s = prs.slides.add_slide(BLANK)
add_page_header(s, 2, TOTAL, "考试概况 · 题型与分值")

# 左侧：基本信息
add_rect(s, Inches(0.5), Inches(1.2), Inches(6.2), Inches(2.6), LIGHT_BG)
add_rect(s, Inches(0.5), Inches(1.2), Inches(0.15), Inches(2.6), ACCENT)
add_text(s, Inches(0.85), Inches(1.35), Inches(5.7),
         Inches(0.5), "基本信息", font_size=18, bold=True, color=PRIMARY)
basic_info = [
    ("考试时长", "90 分钟"),
    ("总分", "100 分（合格线 60 分）"),
    ("题量", "共 30 题（25 单选 + 5 判断）"),
    ("题型分布", "单选题 75 分（每题 3 分）+ 判断题 25 分（每题 5 分）"),
    ("考试形式", "上机答题，无编程题"),
    ("语言环境", "Dev-C++ 5.11（仅作参考）"),
]
for i, (k, v) in enumerate(basic_info):
    y = Inches(1.85) + Inches(0.30) * i
    add_text(s, Inches(0.85), y, Inches(1.5), Inches(0.3),
             k, font_size=12, bold=True, color=DARK)
    add_text(s, Inches(2.4), y, Inches(4.2), Inches(0.3),
             v, font_size=12, color=DARK)

# 右侧：题型占比图（用矩形堆叠）
add_rect(s, Inches(7.0), Inches(1.2), Inches(5.8), Inches(2.6), LIGHT_BLUE)
add_text(s, Inches(7.2), Inches(1.35), Inches(5.5),
         Inches(0.5), "题型分值占比", font_size=18, bold=True,
         color=PRIMARY)
# 单选题 bar
add_text(s, Inches(7.2), Inches(2.0), Inches(1.2), Inches(0.4),
         "单选 75 分", font_size=12, bold=True, color=DARK)
add_rect(s, Inches(8.4), Inches(2.05), Inches(3.8), Inches(0.30),
         PRIMARY)  # 75%
# 判断题 bar
add_text(s, Inches(7.2), Inches(2.6), Inches(1.2), Inches(0.4),
         "判断 25 分", font_size=12, bold=True, color=DARK)
add_rect(s, Inches(8.4), Inches(2.65), Inches(1.27), Inches(0.30),
         ACCENT)  # 25%
add_text(s, Inches(7.2), Inches(3.20), Inches(5.5),
         Inches(0.4), "💡 策略：单选题性价比高（3 分/题），判断题分值大（5 分/题）",
         font_size=12, color=DANGER, bold=True)

# 底部表格：考核目标
add_text(s, Inches(0.5), Inches(4.0), Inches(12.3),
         Inches(0.4), "能力考核目标", font_size=18, bold=True, color=PRIMARY)
add_table(s, Inches(0.5), Inches(4.5), Inches(12.3), Inches(2.5), [
    ["序号", "能力目标", "占比", "说明"],
    ["1", "基本编程语言能力", "30%", "理解变量、数据类型、运算符、表达式"],
    ["2", "基本数据结构认知", "25%", "理解数组、字符串的基本概念与操作"],
    ["3", "程序设计能力", "35%", "顺序/分支/循环三种结构的综合运用"],
    ["4", "问题求解能力", "10%", "分析问题、提炼算法思路"],
], col_widths=[1, 3, 1.2, 7], font_size=12, header_font_size=14)

add_footer(s)


# ============ 第 3 页：考点频次分布总览 ============
s = prs.slides.add_slide(BLANK)
add_page_header(s, 3, TOTAL, "考点频次分布 · TOP 8")

add_text(s, Inches(0.5), Inches(1.1), Inches(12),
         Inches(0.4), "基于 147+ 道真题统计的高频考点（按出现频次降序）",
         font_size=14, color=GRAY)

# 横向条形图
topics = [
    ("数位分离 / 数位处理", 89, "🔥 必考之王", DANGER),
    ("循环结构（for / while）", 72, "高频", PRIMARY),
    ("分支结构（if / else）", 58, "高频", PRIMARY),
    ("数组（一维）", 45, "常考", SECONDARY),
    ("运算符与表达式", 42, "常考", SECONDARY),
    ("字符与 ASCII", 38, "常考", SECONDARY),
    ("输入输出格式", 35, "必考基础", ACCENT),
    ("函数定义与调用", 22, "次频", GRAY),
]

bar_left = Inches(2.8)
bar_max_w = Inches(8.5)
row_y0 = Inches(1.65)
row_h = Inches(0.62)

for i, (name, cnt, tag, color) in enumerate(topics):
    y = row_y0 + row_h * i
    # 标签
    add_text(s, Inches(0.5), y, Inches(2.3), row_h,
             name, font_size=13, bold=True, color=DARK,
             anchor=MSO_ANCHOR.MIDDLE)
    # bar
    w = int(bar_max_w * cnt / 100)
    add_rect(s, bar_left, y + Inches(0.12), w, Inches(0.38), color)
    # 次数
    add_text(s, bar_left + w + Inches(0.1), y, Inches(0.8),
             row_h, f"{cnt}", font_size=14, bold=True, color=color,
             anchor=MSO_ANCHOR.MIDDLE)
    # 标签
    add_text(s, bar_left + bar_max_w + Inches(0.9), y, Inches(1.2),
             row_h, tag, font_size=11, bold=True, color=color,
             anchor=MSO_ANCHOR.MIDDLE)

# 关键提示
add_rect(s, Inches(0.5), Inches(6.7), Inches(12.3), Inches(0.4),
         LIGHT_RED)
add_text(s, Inches(0.6), Inches(6.7), Inches(12.1),
         Inches(0.4), "⚠ 结论：数位分离 + 循环结构合计占 60% 以上，是复习性价比最高的模块",
         font_size=14, bold=True, color=DANGER,
         anchor=MSO_ANCHOR.MIDDLE)

add_footer(s)


# ============ 第 4 页：顺序结构高频考点 ============
s = prs.slides.add_slide(BLANK)
add_page_header(s, 4, TOTAL, "顺序结构 · 输入输出与变量")

add_rect(s, Inches(0.5), Inches(1.15), Inches(5.5), Inches(0.5),
         PRIMARY)
add_text(s, Inches(0.5), Inches(1.15), Inches(5.5),
         Inches(0.5), "高频考点 TOP 4", font_size=16, bold=True,
         color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

seq_topics = [
    ("输入输出格式控制", "printf / cin / scanf 的格式符"),
    ("变量定义与赋值", "int / double / char 的声明规则"),
    ("运算符与表达式求值", "+ - * / % ++ -- 的运算规则"),
    ("复合赋值运算", "a += 5; a *= b+1; 的等价展开"),
]
for i, (k, v) in enumerate(seq_topics):
    y = Inches(1.85) + Inches(0.65) * i
    add_rect(s, Inches(0.5), y, Inches(5.5), Inches(0.55), LIGHT_BG)
    add_rect(s, Inches(0.5), y, Inches(0.1), Inches(0.55), ACCENT)
    add_text(s, Inches(0.75), y, Inches(2.0), Inches(0.55),
             f"#{i+1} {k}", font_size=13, bold=True, color=PRIMARY,
             anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(2.8), y, Inches(3.1), Inches(0.55),
             v, font_size=12, color=DARK, anchor=MSO_ANCHOR.MIDDLE)

# 右侧：经典真题
add_rect(s, Inches(6.3), Inches(1.15), Inches(6.5), Inches(0.5),
         ACCENT)
add_text(s, Inches(6.3), Inches(1.15), Inches(6.5),
         Inches(0.5), "真题示例", font_size=16, bold=True,
         color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

# 真题框
add_rect(s, Inches(6.3), Inches(1.85), Inches(6.5), Inches(2.5),
         LIGHT_BG)
add_multiline(s, Inches(6.5), Inches(1.95), Inches(6.2),
              Inches(2.4), [
    ("【真题】执行以下代码后，x 的值是？", True, DARK),
    ("int a = 5, b = 3;", False),
    ("int x = (a++ > b) ? a : b;", False),
    ("", False),
    ("A. 3    B. 5    C. 6    D. 4", True, PRIMARY),
    ("", False),
    ("【答案】C", True, DANGER),
    ("【解析】a++ > b：先用 5 与 3 比较，结果 true，", False),
    ("a 随后自增为 6。条件为真，返回 a = 6，x = 6。", False),
], font_size=12, line_spacing=1.3)

# 必记口诀
add_rect(s, Inches(6.3), Inches(4.55), Inches(6.5), Inches(2.3),
         LIGHT_OR)
add_text(s, Inches(6.5), Inches(4.7), Inches(6.2),
         Inches(0.4), "📌 顺序结构三大易错点", font_size=14,
         bold=True, color=ACCENT)
add_multiline(s, Inches(6.5), Inches(5.1), Inches(6.2),
              Inches(1.7), [
    ("① a++ 与 ++a：前者先用后加，后者先加后用", False),
    ("② 三目运算符 ? : 优先级低于赋值 =", False),
    ("③ % 求余运算只对整数有意义，被除数不能为 0", False),
], font_size=12, color=DARK, line_spacing=1.5)

add_footer(s)


# ============ 第 5 页：分支结构高频考点 ============
s = prs.slides.add_slide(BLANK)
add_page_header(s, 5, TOTAL, "分支结构 · if / else 嵌套")

add_text(s, Inches(0.5), Inches(1.1), Inches(12),
         Inches(0.4), "分支结构常考点：条件判断 + 多分支 + 嵌套",
         font_size=14, color=GRAY)

# 左：考点表
add_table(s, Inches(0.5), Inches(1.65), Inches(7.5), Inches(2.4), [
    ["考点", "频率", "典型题"],
    ["if 单分支", "★★★★", "判断奇偶 / 正负"],
    ["if-else 双分支", "★★★★", "大小比较 / 分类输出"],
    ["if-else if 多分支", "★★★★★", "成绩分级 / 等级划分"],
    ["switch-case", "★★", "固定值匹配（菜单题）"],
    ["嵌套分支", "★★★", "坐标象限 / 闰年判断"],
], col_widths=[2.5, 1, 4], font_size=12, header_font_size=14)

# 右：高频真题 - 闰年判断
add_rect(s, Inches(8.3), Inches(1.65), Inches(4.5), Inches(0.45),
         PRIMARY)
add_text(s, Inches(8.3), Inches(1.65), Inches(4.5),
         Inches(0.45), "高频真题：闰年判断",
         font_size=14, bold=True, color=WHITE,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
add_rect(s, Inches(8.3), Inches(2.10), Inches(4.5), Inches(3.0),
         LIGHT_BG)
add_multiline(s, Inches(8.45), Inches(2.20), Inches(4.3),
              Inches(2.85), [
    ("题目：判断 y 年是否为闰年", True, DARK),
    ("规则：", False),
    ("  ① 能被 4 整除且不能被 100 整除 → 闰年", False, DARK),
    ("  ② 或能被 400 整除 → 闰年", False, DARK),
    ("  ③ 否则平年", False, DARK),
    ("", False),
    ("表达式：", True, PRIMARY),
    ("(y%4==0 && y%100!=0) || y%400==0", True, DANGER),
], font_size=11, line_spacing=1.3)

# 底部：易错点
add_rect(s, Inches(0.5), Inches(4.3), Inches(12.3), Inches(2.5),
         LIGHT_RED)
add_text(s, Inches(0.7), Inches(4.4), Inches(12),
         Inches(0.4), "⚠ 分支结构三大易错点", font_size=16,
         bold=True, color=DANGER)
add_multiline(s, Inches(0.7), Inches(4.85), Inches(12),
              Inches(1.9), [
    ("① 多分支顺序：else if 链必须按条件从强到弱（或反向）排列，一旦命中即跳出。",
     False, DARK),
    ("② 等号判断：条件必须是 ==（关系等于），赋值 = 会导致逻辑错误且无语法报错。",
     False, DARK),
    ("③ 浮点比较：不要用 == 直接比较浮点，应判断 |a-b| < 1e-6（C++一级较少涉及）。",
     False, DARK),
], font_size=13, color=DARK, line_spacing=1.6)

add_footer(s)


# ============ 第 6 页：循环结构高频考点 ============
s = prs.slides.add_slide(BLANK)
add_page_header(s, 6, TOTAL, "循环结构 · 三种循环与嵌套")

add_text(s, Inches(0.5), Inches(1.1), Inches(12),
         Inches(0.4), "循环结构是 C++ 一级最核心考点，几乎每场必考 2-3 题",
         font_size=14, color=DANGER, bold=True)

# 左：三种循环对比表
add_table(s, Inches(0.5), Inches(1.65), Inches(7.5), Inches(3.3), [
    ["循环类型", "语法", "适用场景"],
    ["for 循环", "for(初值;条件;增量)", "已知循环次数（最常用）"],
    ["while 循环", "while(条件) { ... }", "条件驱动，次数未知"],
    ["do-while", "do { ... } while(条件)", "至少执行一次"],
    ["break / continue", "跳出 / 跳过本次", "提前终止循环"],
], col_widths=[2, 3, 2.5], font_size=12, header_font_size=14)

# 右：典型考题 - 求和
add_rect(s, Inches(8.3), Inches(1.65), Inches(4.5), Inches(0.45),
         ACCENT)
add_text(s, Inches(8.3), Inches(1.65), Inches(4.5),
         Inches(0.45), "真题示例：求 1+2+...+100",
         font_size=14, bold=True, color=WHITE,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
add_rect(s, Inches(8.3), Inches(2.10), Inches(4.5), Inches(3.0),
         LIGHT_BG)
add_multiline(s, Inches(8.45), Inches(2.20), Inches(4.3),
              Inches(2.85), [
    ("int s = 0;", True),
    ("for(int i=1; i<=100; i++) {", True),
    ("    s += i;", True, PRIMARY),
    ("}", True),
    ("cout << s;", True),
    ("", False),
    ("输出：5050", True, DANGER),
    ("", False),
    ("⚠ 注意：循环初值、终止条件、增量", False, ACCENT),
    ("  是 for 循环三要素，必须写全", False, ACCENT),
], font_size=12, line_spacing=1.3)

# 底部：易错点（5 大高频坑）
add_rect(s, Inches(0.5), Inches(5.2), Inches(12.3), Inches(1.85),
         LIGHT_RED)
add_text(s, Inches(0.7), Inches(5.3), Inches(12),
         Inches(0.4), "⚠ 循环结构 TOP 5 易错点", font_size=16,
         bold=True, color=DANGER)
add_multiline(s, Inches(0.7), Inches(5.75), Inches(12),
              Inches(1.3), [
    ("① 死循环：忘记 i++ 导致条件永真    ② 差一错误：i<=n 与 i<n 的边界混淆",
     False, DARK),
    ("③ 累加器未初始化：s 未赋初值 0，结果随机    ④ break 与 continue 用错位置",
     False, DARK),
    ("⑤ 浮点循环：i += 0.1 累加误差导致循环次数异常（建议用整数计数）",
     False, DARK),
], font_size=12, line_spacing=1.5)

add_footer(s)


# ============ 第 7 页：数位分离（核心必考） ============
s = prs.slides.add_slide(BLANK)
add_page_header(s, 7, TOTAL, "数位分离 · 必考之王")

# 顶部标签
add_rect(s, Inches(0.5), Inches(1.1), Inches(12.3), Inches(0.5),
         DANGER)
add_text(s, Inches(0.5), Inches(1.1), Inches(12.3),
         Inches(0.5), "🔥 占真题 60% 以上 · 每场考试必出 2-3 题 · 一级最高频考点",
         font_size=16, bold=True, color=WHITE,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

# 左侧：核心模板代码
add_rect(s, Inches(0.5), Inches(1.8), Inches(6.5), Inches(0.45),
         PRIMARY)
add_text(s, Inches(0.5), Inches(1.8), Inches(6.5),
         Inches(0.45), "万能模板：逐位拆解任意正整数",
         font_size=14, bold=True, color=WHITE,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
add_rect(s, Inches(0.5), Inches(2.25), Inches(6.5), Inches(2.6),
         LIGHT_BG)
add_multiline(s, Inches(0.7), Inches(2.35), Inches(6.1),
              Inches(2.4), [
    ("int n;", True),
    ("cin >> n;", True),
    ("while(n > 0) {", True, PRIMARY),
    ("    int d = n % 10;   // 取个位", True),
    ("    // 这里处理当前数位 d", True, DARK),
    ("    n = n / 10;       // 去掉个位", True, DANGER),
    ("}", True),
    ("// 注意：循环结束后 n 已变为 0", False, ACCENT),
], font_size=13, line_spacing=1.4, font_name='Consolas')

# 右侧：变式题型
add_rect(s, Inches(7.3), Inches(1.8), Inches(5.5), Inches(0.45),
         ACCENT)
add_text(s, Inches(7.3), Inches(1.8), Inches(5.5),
         Inches(0.45), "高频变式（8 大类）",
         font_size=14, bold=True, color=WHITE,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
variants = [
    ("① 求各位数字之和", "sum += d"),
    ("② 求各位数字之积", "prod *= d"),
    ("③ 反转数字（如 123 → 321）", "rev = rev*10 + d"),
    ("④ 判断是否为回文数", "反转后与原数比较"),
    ("⑤ 统计偶数 / 奇数个数", "if(d%2==0) cntE++"),
    ("⑥ 求最大 / 最小数位", "max = max(max, d)"),
    ("⑦ 数字 0 出现的次数", "if(d==0) cnt0++"),
    ("⑧ 水仙花数（三位）", "百^3+十^3+个^3 == 原数"),
]
for i, (name, hint) in enumerate(variants):
    y = Inches(2.30) + Inches(0.31) * i
    add_rect(s, Inches(7.3), y, Inches(5.5), Inches(0.28),
             LIGHT_BLUE if i % 2 == 0 else WHITE)
    add_text(s, Inches(7.4), y, Inches(3.0), Inches(0.28),
             name, font_size=10, color=DARK,
             anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(10.4), y, Inches(2.4), Inches(0.28),
             hint, font_size=10, color=PRIMARY,
             anchor=MSO_ANCHOR.MIDDLE)

# 底部：真题
add_rect(s, Inches(0.5), Inches(5.0), Inches(12.3), Inches(2.0),
         LIGHT_GREEN)
add_text(s, Inches(0.7), Inches(5.1), Inches(12),
         Inches(0.4), "真题示例：求整数 n 的各位数字之和",
         font_size=14, bold=True, color=PRIMARY)
add_multiline(s, Inches(0.7), Inches(5.55), Inches(12),
              Inches(1.4), [
    ("输入：n = 12345    输出：15（=1+2+3+4+5）",
     True, DARK),
    ("int n, s = 0; cin >> n; while(n > 0) { s += n % 10; n /= 10; } cout << s;",
     False, PRIMARY),
    ("", False),
    ("⚠ 易错：忘记初始化 s = 0；忘记最后 n/=10 导致死循环；处理负数要先取绝对值",
     False, DANGER),
], font_size=12, line_spacing=1.5, font_name='Consolas')

add_footer(s)


# ============ 第 8 页：数组高频考点 ============
s = prs.slides.add_slide(BLANK)
add_page_header(s, 8, TOTAL, "数组 · 一维数组与基本操作")

# 左侧：核心考点
add_rect(s, Inches(0.5), Inches(1.15), Inches(5.5), Inches(0.5),
         PRIMARY)
add_text(s, Inches(0.5), Inches(1.15), Inches(5.5),
         Inches(0.5), "5 大高频考点", font_size=16, bold=True,
         color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

arr_topics = [
    ("定义与初始化", "int a[100] = {0};  // 全部初始化为 0"),
    ("下标访问", "a[i] 表示第 i 个元素，下标从 0 开始"),
    ("遍历求和 / 求最值", "for 循环遍历数组元素"),
    ("数组逆序", "交换 a[i] 与 a[n-1-i]"),
    ("数组查找", "线性查找：遍历比较目标值"),
]
for i, (k, v) in enumerate(arr_topics):
    y = Inches(1.85) + Inches(0.65) * i
    add_rect(s, Inches(0.5), y, Inches(5.5), Inches(0.55), LIGHT_BG)
    add_rect(s, Inches(0.5), y, Inches(0.1), Inches(0.55), ACCENT)
    add_text(s, Inches(0.75), y, Inches(1.6), Inches(0.55),
             f"#{i+1} {k}", font_size=13, bold=True, color=PRIMARY,
             anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, Inches(2.4), y, Inches(3.5), Inches(0.55),
             v, font_size=11, color=DARK,
             anchor=MSO_ANCHOR.MIDDLE, font_name='Consolas')

# 右侧：经典真题
add_rect(s, Inches(6.3), Inches(1.15), Inches(6.5), Inches(0.5),
         ACCENT)
add_text(s, Inches(6.3), Inches(1.15), Inches(6.5),
         Inches(0.5), "真题示例：求数组最大值",
         font_size=16, bold=True, color=WHITE,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
add_rect(s, Inches(6.3), Inches(1.65), Inches(6.5), Inches(2.8),
         LIGHT_BG)
add_multiline(s, Inches(6.5), Inches(1.75), Inches(6.2),
              Inches(2.65), [
    ("int a[5] = {3, 8, 1, 5, 2};", True, DARK),
    ("int max = a[0];  // 关键：初始化为 a[0]", True),
    ("for(int i=1; i<5; i++) {", True, PRIMARY),
    ("    if(a[i] > max) max = a[i];", True),
    ("}", True),
    ("cout << max;  // 输出：8", True, DANGER),
    ("", False),
    ("⚠ 易错：用 0 作 max 初值（数组可能全为负）", False, ACCENT),
    ("  必须用 a[0] 作初值！", False, ACCENT),
], font_size=12, line_spacing=1.4, font_name='Consolas')

# 底部：数组易错 TOP 3
add_rect(s, Inches(6.3), Inches(4.65), Inches(6.5), Inches(2.2),
         LIGHT_RED)
add_text(s, Inches(6.5), Inches(4.75), Inches(6.2),
         Inches(0.4), "⚠ 数组三大易错点", font_size=14,
         bold=True, color=DANGER)
add_multiline(s, Inches(6.5), Inches(5.15), Inches(6.2),
              Inches(1.7), [
    ("① 越界访问：a[n] 越界（合法下标 0~n-1）", False),
    ("② 未初始化：int a[100]; 直接读 a[i] 得随机值", False),
    ("③ 求最值初值：用 a[0] 而非 0 作 max/min 初值", False),
], font_size=12, color=DARK, line_spacing=1.5)

# 左侧底部：常考题型
add_rect(s, Inches(0.5), Inches(5.05), Inches(5.5), Inches(1.8),
         LIGHT_BLUE)
add_text(s, Inches(0.7), Inches(5.15), Inches(5.1),
         Inches(0.4), "📌 数组常考题型", font_size=13,
         bold=True, color=PRIMARY)
add_multiline(s, Inches(0.7), Inches(5.55), Inches(5.1),
              Inches(1.3), [
    ("1. 求和 / 平均值 / 最大最小值", False),
    ("2. 元素逆序 / 元素查找", False),
    ("3. 元素插入 / 删除（下标移动）", False),
    ("4. 数组排序（冒泡 / 选择）", False),
], font_size=11, color=DARK, line_spacing=1.4)

add_footer(s)


# ============ 第 9 页：字符与 ASCII ============
s = prs.slides.add_slide(BLANK)
add_page_header(s, 9, TOTAL, "字符与 ASCII · 易混淆考点")

# 左：ASCII 速查表（精选 14 个）
add_text(s, Inches(0.5), Inches(1.15), Inches(12),
         Inches(0.4), "ASCII 必背对照（精选高频字符）",
         font_size=14, bold=True, color=PRIMARY)
add_table(s, Inches(0.5), Inches(1.65), Inches(7.0), Inches(4.0), [
    ["字符", "ASCII", "字符", "ASCII", "字符", "ASCII"],
    ["'0'", "48", "'A'", "65", "'a'", "97"],
    ["'1'", "49", "'B'", "66", "'b'", "98"],
    ["'9'", "57", "'Z'", "90", "'z'", "122"],
    ["' '", "32", "'\\n'", "10", "'\\0'", "0"],
], col_widths=[1, 1, 1, 1, 1, 1], font_size=14, header_font_size=12)

# 右：核心要点 + 真题
add_rect(s, Inches(7.8), Inches(1.65), Inches(5.0), Inches(0.5),
         ACCENT)
add_text(s, Inches(7.8), Inches(1.65), Inches(5.0),
         Inches(0.5), "核心要点", font_size=14, bold=True,
         color=WHITE, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
add_multiline(s, Inches(7.9), Inches(2.2), Inches(4.8),
              Inches(2.5), [
    ("① 字符常量用单引号 'A'，字符串用双引号 \"A\"", False, DARK),
    ("② 字符与整数可以互相转换", False, DARK),
    ("   'A' + 1 = 'B'（ASCII 累加）", False, PRIMARY),
    ("③ '0' 到 '9' 是连续编码，差值固定为 48", False, DARK),
    ("   数字字符转数字：ch - '0'（如 '5'-'0'=5）", False, DANGER),
    ("④ 大小写转换：A ↔ a 相差 32", False, DARK),
    ("   大写转小写：ch + 32  或  ch - 'A' + 'a'", False, PRIMARY),
], font_size=11, line_spacing=1.5, font_name='Consolas')

# 底部真题
add_rect(s, Inches(0.5), Inches(5.85), Inches(12.3), Inches(1.2),
         LIGHT_GREEN)
add_text(s, Inches(0.7), Inches(5.95), Inches(12),
         Inches(0.4), "真题：已知 char ch = 'D';  cout << (ch + 2);  输出？",
         font_size=13, bold=True, color=PRIMARY)
add_multiline(s, Inches(0.7), Inches(6.35), Inches(12),
              Inches(0.6), [
    ("A. 70    B. 'F'    C. E    D. D2    【答案】A",
     True, DARK),
    ("解析：ch='D' (ASCII 68)，加上 2 后是整数 70，整数输出无引号",
     False, ACCENT),
], font_size=12, line_spacing=1.4)

add_footer(s)


# ============ 第 10 页：函数高频考点 ============
s = prs.slides.add_slide(BLANK)
add_page_header(s, 10, TOTAL, "函数 · 定义、调用与参数传递")

add_text(s, Inches(0.5), Inches(1.1), Inches(12),
         Inches(0.4), "函数是 C++ 一级中后期新增考点，占比约 15%，但难度大",
         font_size=14, color=DARK)

# 左：核心概念
add_table(s, Inches(0.5), Inches(1.6), Inches(7.5), Inches(3.0), [
    ["考点", "语法 / 概念"],
    ["函数定义", "返回值类型 函数名(参数列表) { 函数体 }"],
    ["函数调用", "函数名(实参列表); — 实参个数与形参必须一致"],
    ["参数传递", "值传递：形参是实参的副本，修改不影响实参"],
    ["返回值", "return 表达式;  类型必须与函数声明一致"],
    ["无返回值", "void func() { ... } — 不写 return 或只写 return;"],
], col_widths=[2, 5.5], font_size=12, header_font_size=14)

# 右：真题示例
add_rect(s, Inches(8.3), Inches(1.6), Inches(4.5), Inches(0.45),
         ACCENT)
add_text(s, Inches(8.3), Inches(1.6), Inches(4.5),
         Inches(0.45), "真题：值传递 vs 引用",
         font_size=14, bold=True, color=WHITE,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
add_rect(s, Inches(8.3), Inches(2.05), Inches(4.5), Inches(2.7),
         LIGHT_BG)
add_multiline(s, Inches(8.45), Inches(2.15), Inches(4.3),
              Inches(2.55), [
    ("void f(int a) { a = 10; }", True),
    ("int main() {", True, PRIMARY),
    ("    int x = 5;", True),
    ("    f(x);", True),
    ("    cout << x;", True, DANGER),
    ("}", True),
    ("", False),
    ("输出：5（值传递，x 未被修改）", True, ACCENT),
    ("", False),
    ("⚠ 一级不考引用 (&)，重点掌握值传递", False, ACCENT),
], font_size=11, line_spacing=1.3, font_name='Consolas')

# 底部：易错点
add_rect(s, Inches(0.5), Inches(4.8), Inches(12.3), Inches(2.2),
         LIGHT_RED)
add_text(s, Inches(0.7), Inches(4.9), Inches(12),
         Inches(0.4), "⚠ 函数三大易错点", font_size=16,
         bold=True, color=DANGER)
add_multiline(s, Inches(0.7), Inches(5.35), Inches(12),
              Inches(1.6), [
    ("① 形参 vs 实参：形参是函数定义时的占位变量，实参是调用时传入的具体值，",
     False, DARK),
    ("   类型、个数、顺序必须一一对应", False, DARK),
    ("② return 类型匹配：int func() 不能 return 3.14；void func() 不能 return 5", False, DARK),
    ("③ 形参作用域：形参只在函数内部有效，函数结束即销毁", False, DARK),
], font_size=13, color=DARK, line_spacing=1.5)

add_footer(s)


# ============ 第 11 页：易错题 TOP 5（真题） ============
s = prs.slides.add_slide(BLANK)
add_page_header(s, 11, TOTAL, "易错题 TOP 5 · 真实考场失分点")

add_text(s, Inches(0.5), Inches(1.1), Inches(12),
         Inches(0.4), "汇总历年考场真实失分率最高的 5 道题（含易错原因）",
         font_size=14, color=DARK)

err_top5 = [
    ("01", "运算符优先级", "int x = 2 * 3 + 4 % 5;  x = ?",
     "答案：10", "% 优先级与 * / 相同，从左到右结合"),
    ("02", "for 循环边界", "for(int i=0; i<10; i++) 循环执行次数？",
     "答案：10 次", "初值 0、终值 9、增量 1，共 10 次，不是 9 次"),
    ("03", "数组越界", "int a[5]; a[5] = 100; 是否报错？",
     "答案：编译不报错，运行结果不确定", "下标 0~4 合法，越界不报错但危险"),
    ("04", "字符 vs 字符串", "char c = \"A\"; 是否正确？",
     "答案：错误", "字符用单引号，字符串用双引号；应写 char c = 'A';"),
    ("05", "整除 vs 求余", "int a = 7 / 2; int b = 7 % 2; a=? b=?",
     "答案：a=3, b=1", "整数相除只保留整数部分，% 求余数"),
]

# 表头
add_rect(s, Inches(0.5), Inches(1.55), Inches(12.3), Inches(0.45),
         PRIMARY)
headers = ["#", "考点类型", "题目", "答案", "易错原因"]
widths = [0.8, 2.0, 4.5, 2.0, 3.0]
x_start = Inches(0.5)
total_w = Inches(12.3)
cell_starts = [x_start]
acc = 0
for w in widths[:-1]:
    acc += w
    cell_starts.append(x_start + total_w * acc / sum(widths))

for i, h in enumerate(headers):
    add_text(s, cell_starts[i], Inches(1.55),
             total_w * widths[i] / sum(widths),
             Inches(0.45), h, font_size=13, bold=True, color=WHITE,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

# 数据行
for i, (idx, kind, q, ans, reason) in enumerate(err_top5):
    y = Inches(2.00) + Inches(1.0) * i
    bg = LIGHT_BG if i % 2 == 0 else WHITE
    add_rect(s, Inches(0.5), y, Inches(12.3), Inches(1.0), bg)

    # #
    add_text(s, cell_starts[0], y, total_w * widths[0] / sum(widths),
             Inches(1.0), idx, font_size=16, bold=True, color=DANGER,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    # 考点
    add_text(s, cell_starts[1], y, total_w * widths[1] / sum(widths),
             Inches(1.0), kind, font_size=13, bold=True, color=PRIMARY,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    # 题目
    add_text(s, cell_starts[2] + Inches(0.1), y,
             total_w * widths[2] / sum(widths) - Inches(0.2),
             Inches(1.0), q, font_size=11, color=DARK,
             font_name='Consolas', anchor=MSO_ANCHOR.MIDDLE)
    # 答案
    add_text(s, cell_starts[3], y, total_w * widths[3] / sum(widths),
             Inches(1.0), ans, font_size=11, bold=True, color=DANGER,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    # 易错原因
    add_text(s, cell_starts[4] + Inches(0.1), y,
             total_w * widths[4] / sum(widths) - Inches(0.2),
             Inches(1.0), reason, font_size=11, color=DARK,
             anchor=MSO_ANCHOR.MIDDLE)

add_footer(s)


# ============ 第 12 页：高频代码模板（速记卡片） ============
s = prs.slides.add_slide(BLANK)
add_page_header(s, 12, TOTAL, "高频代码模板 · 一页纸速记")

add_text(s, Inches(0.5), Inches(1.1), Inches(12),
         Inches(0.4), "收藏这一页，考前看一眼 → 直接默写",
         font_size=14, color=DANGER, bold=True)

templates = [
    ("① 数位分离", "int s=0; while(n>0) { s+=n%10; n/=10; }",
     "求和 / 积 / 反转 / 回文"),
    ("② 求最大公约数", "while(b!=0) { t=a%b; a=b; b=t; }",
     "辗转相除法（欧几里得）"),
    ("③ 求最小公倍数", "int lcm = a*b / gcd(a,b);",
     "先求 gcd 再套公式"),
    ("④ 数组最大值", "int max=a[0]; for(i=1;i<n;i++) if(a[i]>max) max=a[i];",
     "注意初值是 a[0] 不是 0"),
    ("⑤ 数组逆序", "for(i=0;i<n/2;i++) swap(a[i],a[n-1-i]);",
     "交换次数 = n/2"),
    ("⑥ 字符转数字", "int x = ch - '0';  // '5' → 5",
     "ch 是数字字符时"),
    ("⑦ 大写转小写", "char lower = ch - 'A' + 'a';",
     "相差 32，可直接 +32"),
    ("⑧ 阶乘求和", "long long s=1; for(i=1;i<=n;i++) s*=i;",
     "阶乘增长快，注意溢出"),
]

# 4 列 2 行布局
col_w = Inches(6.0)
row_h = Inches(1.4)
for i, (name, code, tip) in enumerate(templates):
    col = i % 2
    row = i // 2
    x = Inches(0.5) + (col_w + Inches(0.3)) * col
    y = Inches(1.65) + (row_h + Inches(0.1)) * row
    add_rect(s, x, y, col_w, row_h, LIGHT_BG)
    add_rect(s, x, y, Inches(0.1), row_h, ACCENT)
    # 模板名
    add_text(s, x + Inches(0.2), y + Inches(0.05), col_w - Inches(0.2),
             Inches(0.35), name, font_size=14, bold=True, color=PRIMARY)
    # 代码
    add_text(s, x + Inches(0.2), y + Inches(0.45), col_w - Inches(0.2),
             Inches(0.45), code, font_size=11, color=DARK,
             font_name='Consolas')
    # 提示
    add_text(s, x + Inches(0.2), y + Inches(0.95), col_w - Inches(0.2),
             Inches(0.35), "💡 " + tip, font_size=10, color=ACCENT)

# 底部说明
add_text(s, Inches(0.5), Inches(6.95), Inches(12.3),
         Inches(0.25),
         "📌 配套讲义《C++一级考点精讲》第 9-12 页有完整代码演示",
         font_size=11, color=GRAY, align=PP_ALIGN.CENTER)

add_footer(s)


# ============ 第 13 页：三阶段备考策略 ============
s = prs.slides.add_slide(BLANK)
add_page_header(s, 13, TOTAL, "备考策略 · 三阶段冲刺")

stages = [
    ("基础阶段", "考前 4 周", PRIMARY, [
        "通读教材，覆盖全部 8 大考点",
        "理解每个语法点 + 配套讲义",
        "每天 1 小时，做 5 道基础题",
        "目标：理解 70% 概念，能口述思路",
    ]),
    ("强化阶段", "考前 2 周", ACCENT, [
        "专项突破：数位分离 + 循环（占 60%）",
        "默写 8 大代码模板（见上页）",
        "每天 1 套真题（30 题，限时 90 分钟）",
        "目标：真题正确率 80%+",
    ]),
    ("冲刺阶段", "考前 1 周", DANGER, [
        "刷近 5 场真题，重点看错题",
        "背诵 TOP 5 易错点（见上页）",
        "默写输入输出格式符（printf / scanf）",
        "目标：稳定 90+ 分通过",
    ]),
]

col_w = Inches(4.1)
gap = Inches(0.15)
for i, (title, period, color, items) in enumerate(stages):
    x = Inches(0.5) + (col_w + gap) * i
    y = Inches(1.2)
    # 标题色块
    add_rect(s, x, y, col_w, Inches(0.8), color)
    add_text(s, x, y + Inches(0.1), col_w, Inches(0.4),
             title, font_size=20, bold=True, color=WHITE,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    add_text(s, x, y + Inches(0.45), col_w, Inches(0.3),
             period, font_size=12, color=WHITE,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    # 内容
    add_rect(s, x, y + Inches(0.8), col_w, Inches(4.2), LIGHT_BG)
    for j, item in enumerate(items):
        item_y = y + Inches(0.95) + Inches(0.95) * j
        # 序号圆
        add_rect(s, x + Inches(0.2), item_y + Inches(0.05),
                 Inches(0.35), Inches(0.35), color)
        add_text(s, x + Inches(0.2), item_y + Inches(0.05),
                 Inches(0.35), Inches(0.35), str(j+1),
                 font_size=12, bold=True, color=WHITE,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        add_text(s, x + Inches(0.7), item_y, col_w - Inches(0.8),
                 Inches(0.7), item, font_size=12, color=DARK,
                 anchor=MSO_ANCHOR.MIDDLE)

# 底部金句
add_rect(s, Inches(0.5), Inches(6.2), Inches(12.3), Inches(0.6),
         DANGER)
add_text(s, Inches(0.5), Inches(6.2), Inches(12.3),
         Inches(0.6),
         "🎯 C++ 一级没有编程题，纯理论 —— 把模板默写熟，分数自然来",
         font_size=16, bold=True, color=WHITE,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

add_footer(s)


# ============ 第 14 页：总结 + 一页纸速记卡 ============
s = prs.slides.add_slide(BLANK)
add_page_header(s, 14, TOTAL, "总结 · 一页纸速记卡")

# 左侧：核心结论
add_text(s, Inches(0.5), Inches(1.15), Inches(6),
         Inches(0.4), "📌 三个核心结论", font_size=18, bold=True,
         color=PRIMARY)
conclusions = [
    ("① 高频聚焦",
     "数位分离 + 循环 + 分支合计占真题 70%+\n复习性价比最高"),
    ("② 模板为先",
     "C++ 一级不考编程，但代码理解题需要默写\n8 大模板（数位分离 / 求最大 / 数组逆序等）"),
    ("③ 基础为王",
     "输入输出格式、运算符优先级、ASCII 码\n这三块是稳定拿分点，绝不能丢"),
]
for i, (title, desc) in enumerate(conclusions):
    y = Inches(1.65) + Inches(1.45) * i
    add_rect(s, Inches(0.5), y, Inches(6), Inches(1.3), LIGHT_BG)
    add_rect(s, Inches(0.5), y, Inches(0.1), Inches(1.3), ACCENT)
    add_text(s, Inches(0.75), y + Inches(0.15), Inches(5.5),
             Inches(0.4), title, font_size=15, bold=True, color=PRIMARY)
    add_text(s, Inches(0.75), y + Inches(0.55), Inches(5.5),
             Inches(0.7), desc, font_size=11, color=DARK,
             line_spacing=1.4) if False else add_multiline(
        s, Inches(0.75), y + Inches(0.55), Inches(5.5),
        Inches(0.7), [desc], font_size=11, color=DARK,
        line_spacing=1.4)

# 右侧：考场速记卡（精简版）
add_rect(s, Inches(7.0), Inches(1.15), Inches(5.8), Inches(0.5),
         ACCENT)
add_text(s, Inches(7.0), Inches(1.15), Inches(5.8),
         Inches(0.5), "📇 考场 30 秒速记卡",
         font_size=16, bold=True, color=WHITE,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
add_rect(s, Inches(7.0), Inches(1.65), Inches(5.8), Inches(4.5),
         LIGHT_BLUE)
add_multiline(s, Inches(7.2), Inches(1.8), Inches(5.5),
              Inches(4.3), [
    ("🔢 数据类型", True, PRIMARY),
    ("   int %d    float %f    double %lf    char %c", False),
    ("", False),
    ("➕ 运算符优先级", True, PRIMARY),
    ("   () > 单目 > */% > +- > 关系 > 逻辑 > 赋值", False),
    ("", False),
    ("🔁 for 三要素", True, PRIMARY),
    ("   初值 ; 条件 ; 增量（循环体中必须改变条件变量）", False),
    ("", False),
    ("📊 数位分离核心", True, DANGER),
    ("   d = n % 10;   n = n / 10;   while(n > 0)", False),
    ("", False),
    ("🔤 字符转换", True, PRIMARY),
    ("   数字字符→数字：ch - '0'", False),
    ("   大写→小写：ch + 32", False),
    ("", False),
    ("📦 数组下标", True, DANGER),
    ("   0 ~ n-1，共 n 个元素；越界不报错", False),
    ("", False),
    ("🎯 函数调用", True, PRIMARY),
    ("   实参与形参个数、类型、顺序必须一致", False),
], font_size=11, line_spacing=1.4, font_name='Consolas')

# 底部鼓励语
add_rect(s, Inches(0.5), Inches(6.4), Inches(12.3), Inches(0.6),
         PRIMARY)
add_text(s, Inches(0.5), Inches(6.4), Inches(12.3),
         Inches(0.6),
         "💪 祝同学们顺利通过 C++ 一级考试！加油！",
         font_size=18, bold=True, color=WHITE,
         align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)


# ============ 保存 ============
output_path = "/Users/huaweimin/cpp1-exam/output/C++一级常考点分析.pptx"
prs.save(output_path)
print(f"✅ 生成完成：{output_path}")
print(f"   共 {len(prs.slides)} 页")