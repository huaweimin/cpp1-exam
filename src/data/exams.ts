import type { Exam } from '../types/exam';

// 2026年6月电子学会 C/C++ 一级真题
export const exam2026_06: Exam = {
  id: 'exam-2026-06-cpp1',
  name: '2026年6月电子学会青少年软件编程（C/C++一级）真题',
  examDate: '2026-06',
  totalScore: 100,
  passingScore: 60,
  duration: 60, // 60分钟
  singleChoice: [
    {
      id: 1,
      type: 'singleChoice',
      stem: '一个完整的C++程序，必须包含以下哪个函数作为程序执行的入口？',
      options: { A: 'main()', B: '开始()', C: 'begin()', D: 'init()' },
      answer: 'A',
      score: 4,
      tags: ['main函数', '程序结构'],
      explanation: 'C++ 程序的入口函数固定为 main()，操作系统调用 main 开始执行。其他选项都不是 C++ 标准函数。',
    },
    {
      id: 2,
      type: 'singleChoice',
      stem: '以下C++代码执行后，输出结果是？',
      code: 'int x = 7, y = 12;\nif(x < 5 || y > 10)\n    cout << "通过";\nelse\n    cout << "不通过";',
      options: { A: '通过', B: '不通过', C: '1', D: '0' },
      answer: 'A',
      score: 4,
      tags: ['逻辑运算', '分支结构'],
      explanation: 'x=7，x<5 为 false；y=12，y>10 为 true。false || true = true，执行 if 分支输出"通过"。',
    },
    {
      id: 3,
      type: 'singleChoice',
      stem: '执行以下代码，输入 20 后，输出结果是？',
      code: 'int a;\ncin >> a;\ncout << a * 3 + 5;',
      options: { A: '60', B: '65', C: '20*3+5=65', D: 'a * 3 + 5' },
      answer: 'B',
      score: 4,
      tags: ['输入输出', '运算'],
      explanation: 'cout 会先计算表达式 a*3+5 的值再输出。a=20，20×3+5=65，输出数字 65。',
    },
    {
      id: 4,
      type: 'singleChoice',
      stem: '以下哪个C++函数可以用于计算一个数的绝对值？',
      options: { A: 'pow()', B: 'sqrt()', C: 'abs()', D: 'max()' },
      answer: 'C',
      score: 4,
      tags: ['数学函数', 'abs'],
      explanation: 'abs() 返回绝对值；pow() 是幂运算；sqrt() 是平方根；max() 求最大值。',
    },
    {
      id: 5,
      type: 'singleChoice',
      stem: 'C++源代码经过以下哪个步骤后，会生成可直接运行的.exe文件？',
      options: { A: '仅编写代码', B: '仅编译', C: '编译+链接', D: '仅调试' },
      answer: 'C',
      score: 4,
      tags: ['编译', '链接'],
      explanation: '源代码(.cpp) → 编译 → 目标文件(.o/.obj) → 链接 → 可执行文件(.exe)。编译只生成目标文件，还需链接库函数才能生成 .exe。',
    },
    {
      id: 6,
      type: 'singleChoice',
      stem: 'C++表达式 15 - 6 / 2 * 3 的计算结果是？',
      options: { A: '6', B: '9', C: '14', D: '0' },
      answer: 'A',
      score: 4,
      tags: ['运算符优先级'],
      explanation: '运算优先级：/ 和 * 同级，从左到右。先算 6/2=3，再算 3*3=9，最后 15-9=6。',
    },
    {
      id: 7,
      type: 'singleChoice',
      stem: '以下关于C++变量定义的写法，正确的是？',
      options: { A: '整数123数 = 10;', B: '浮点数my_score = 95.5;', C: '双重组 = 3.14;', D: '布尔 a-b = 真;' },
      answer: 'B',
      score: 4,
      tags: ['变量定义', '标识符'],
      explanation: 'B 中 my_score 是合法标识符（字母开头，含下划线）。A 以数字开头（非法）；C 不规范；D 含减号（非法）。',
    },
    {
      id: 8,
      type: 'singleChoice',
      stem: '以下代码执行后，输出结果是？',
      code: 'int res = 1;\nfor(int i=1;i<=4;i++)\n    res *= i;\ncout << res;',
      options: { A: '4', B: '10', C: '24', D: '120' },
      answer: 'C',
      score: 4,
      tags: ['循环', 'for', '累乘'],
      explanation: '这是求 4 的阶乘：res = 1×1×2×3×4 = 24。i=1→res=1, i=2→res=2, i=3→res=6, i=4→res=24。',
    },
    {
      id: 9,
      type: 'singleChoice',
      stem: '以下代码执行后，变量c的最终值是？',
      code: 'int a = 8, b = 5, c;\na = a * 2;\nb = b - 3;\nc = a / b;',
      options: { A: '4', B: '5', C: '8', D: '16' },
      answer: 'C',
      score: 4,
      tags: ['整数除法', '运算'],
      explanation: 'a = 8×2 = 16；b = 5-3 = 2；c = 16/2 = 8。注意整数除法：16/2=8 整除无余数。',
    },
    {
      id: 10,
      type: 'singleChoice',
      stem: '以下代码的循环体一共会执行多少次？',
      code: 'int i = 1;\nwhile(i <= 20) {\n    cout << i << " ";\n    i += 4;\n}',
      options: { A: '4', B: '5', C: '6', D: '无限次' },
      answer: 'B',
      score: 4,
      tags: ['循环', 'while'],
      explanation: 'i 依次取值 1→5→9→13→17→21。i ≤ 20 时执行循环体，共 5 次（1,5,9,13,17）。',
    },
  ],
  trueFalse: [
    {
      id: 11,
      type: 'trueFalse',
      stem: 'for(int i=0;;i++) 是一个无限循环。',
      answer: 'A',
      score: 2,
      tags: ['循环', '无限循环'],
      explanation: 'for 语句中间的条件表达式为空，表示条件永远为真，构成无限循环（死循环）。',
    },
    {
      id: 12,
      type: 'trueFalse',
      stem: '在Dev-C++中，代码编译报错时，依然可以成功运行程序。',
      answer: 'B',
      score: 2,
      tags: ['编译', '错误处理'],
      explanation: '编译报错意味着源代码有语法错误，无法生成可执行文件，自然无法运行。只有警告(warning)不影响运行。',
    },
    {
      id: 13,
      type: 'trueFalse',
      stem: 'scanf 和 printf 是C语言标准输入输出函数。',
      answer: 'A',
      score: 2,
      tags: ['输入输出', 'scanf', 'printf'],
      explanation: 'scanf/printf 来自 C 标准库 <stdio.h>（C++中为 <cstdio>），是 C 语言的标准 I/O 函数。',
    },
    {
      id: 14,
      type: 'trueFalse',
      stem: 'do-while 循环的循环体至少会执行一次，无论循环条件是否成立。',
      answer: 'A',
      score: 2,
      tags: ['循环', 'do-while'],
      explanation: 'do-while 是"先执行后判断"：先执行循环体，再检查条件。即使条件一开始就为 false，循环体也已执行过一次。',
    },
    {
      id: 15,
      type: 'trueFalse',
      stem: 'C++中，5 > 3 && 2 > 7 的逻辑运算结果为 true。',
      answer: 'B',
      score: 2,
      tags: ['逻辑运算', '&&'],
      explanation: '5>3 为 true，2>7 为 false。true && false = false。&&（逻辑与）要求两边都为 true 结果才为 true。',
    },
    {
      id: 16,
      type: 'trueFalse',
      stem: 'C++中，7 % 3 的计算结果是1，代表7除以3的余数。',
      answer: 'A',
      score: 2,
      tags: ['取模运算', '%'],
      explanation: '% 是取模（求余）运算符。7 ÷ 3 = 2 余 1，所以 7 % 3 = 1。',
    },
    {
      id: 17,
      type: 'trueFalse',
      stem: '顺序结构是一种程序的结构，逆序结构也是一种程序的结构。',
      answer: 'B',
      score: 2,
      tags: ['程序结构'],
      explanation: '程序的三种基本结构是：顺序结构、分支结构（选择结构）、循环结构。不存在"逆序结构"。',
    },
    {
      id: 18,
      type: 'trueFalse',
      stem: 'pow(3, 2) 的计算结果是6，代表3乘以2。',
      answer: 'B',
      score: 2,
      tags: ['数学函数', 'pow'],
      explanation: 'pow(x, y) 计算 x 的 y 次方（幂运算）。pow(3, 2) = 3² = 9，不是 3×2=6。',
    },
    {
      id: 19,
      type: 'trueFalse',
      stem: '在C++中，整型变量可以存储小数，不会丢失精度。',
      answer: 'B',
      score: 2,
      tags: ['数据类型', '整型'],
      explanation: 'int 类型只能存储整数。将小数赋给 int 变量会截断小数部分，如 int a = 3.14; 则 a = 3，丢失精度。',
    },
    {
      id: 20,
      type: 'trueFalse',
      stem: 'sqrt() 函数是计算平方根的函数。',
      answer: 'A',
      score: 2,
      tags: ['数学函数', 'sqrt'],
      explanation: 'sqrt(x) 返回 x 的算术平方根。如 sqrt(9) = 3, sqrt(2) ≈ 1.414。需要包含 <cmath> 头文件。',
    },
  ],
  programming: [
    {
      id: 21,
      type: 'programming',
      stem: '【温度转换】输入一个摄氏温度 C，将其转换为华氏温度 F。转换公式：F = C × 9/5 + 32。输出保留两位小数。',
      inputFormat: '一个整数或小数 C',
      outputFormat: '华氏温度 F，保留两位小数',
      sampleInput: '37',
      sampleOutput: '98.60',
      referenceCode: `#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double c, f;
    cin >> c;
    f = c * 9.0 / 5 + 32;
    cout << fixed << setprecision(2) << f << endl;
    return 0;
}`,
      score: 20,
      tags: ['输入输出', '运算', '顺序结构'],
      explanation: '考点：变量的定义与赋值、基本运算、输入输出。易错点：① 9/5 整数除法结果为 1，必须写 9.0/5；② 保留两位小数需要 fixed << setprecision(2)，需包含 <iomanip>。',
    },
    {
      id: 22,
      type: 'programming',
      stem: '【体温记录】某人连续 N 天记录体温（以"温度×100"的整数表示）。第 1 天体温为 W，之后每天给出与前一天的体温变化量 A_i（正数表示升高，负数表示降低）。已知正常体温范围为 [3600, 3700]（即 36.00°C ~ 37.00°C），求这 N 天中体温正常的天数。',
      inputFormat: '第一行：N W（N 为天数，W 为第 1 天体温×100）\n第二行：N-1 个整数 A₂, A₃, ..., Aₙ（每天的体温变化量）',
      outputFormat: '一个整数，表示体温正常的天数',
      sampleInput: '5 3650\n-50 100 -30 20',
      sampleOutput: '3',
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n, w;
    cin >> n >> w;
    int temp = w;
    int count = 0;
    // 第1天
    if(temp >= 3600 && temp <= 3700) count++;
    // 第2~N天
    for(int i = 2; i <= n; i++) {
        int a;
        cin >> a;
        temp += a;
        if(temp >= 3600 && temp <= 3700) count++;
    }
    cout << count << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环', '分支', '累加', '逻辑运算'],
      explanation: '考点：循环结构（for）、分支结构（if）、累加思想、逻辑运算（&&）。易错点：① 第 1 天也要判断是否正常（容易漏掉）；② 变化量是累加到 temp 上的，不是替换；③ 范围判断用 >= 和 <=，包含边界值。',
    },
  ],
};

// 所有考试列表
export const allExams: Exam[] = [exam2026_06];
