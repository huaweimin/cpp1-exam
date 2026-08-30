import type { Exam } from '../types/exam';

// ============================================================
// C/C++ 一级 · 综合模拟卷（一）
// 侧重：基础巩固全覆盖（程序结构 / 编译 / 注释 / 变量类型 /
//       输入输出 / 算术运算 / 分支 / 循环 / 数学函数 / 简单算法）
// ============================================================
export const examMock1: Exam = {
  id: 'exam-mock-01-cpp1',
  name: 'C/C++一级·综合模拟卷一',
  category: 'mock',
  examDate: '2026-08',
  totalScore: 100,
  passingScore: 60,
  duration: 60, // 60分钟
  singleChoice: [
    {
      id: 1,
      type: 'singleChoice',
      stem: 'C++ 程序被操作系统执行时，程序运行的起点是？',
      options: { A: 'main() 函数', B: '文件中的第一条 #include 语句', C: '文件中最后一个函数', D: '第一条注释' },
      answer: 'A',
      score: 4,
      tags: ['main函数', '程序结构'],
      explanation: '操作系统调用 main() 函数作为程序的入口。main 之前的 #include 只是把头文件内容复制进来，注释不参与执行。',
    },
    {
      id: 2,
      type: 'singleChoice',
      stem: '要存储 3.14、95.5 这类带小数的数据，应该使用哪个数据类型？',
      options: { A: 'int', B: 'double', C: 'bool', D: 'char' },
      answer: 'B',
      score: 4,
      tags: ['数据类型', 'double'],
      explanation: 'double 是双精度浮点型，可以存储小数。int 只能存整数；bool 只存 true/false；char 存单个字符。',
    },
    {
      id: 3,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int a = 17, b = 5;\ncout << a / b << " " << a % b;',
      options: { A: '3 2', B: '3 3', C: '2 3', D: '3.4 2' },
      answer: 'A',
      score: 4,
      tags: ['整数除法', '取模运算'],
      explanation: '/ 对两个 int 做除法结果是整数：17/5=3。% 求余数：17÷5=2 余 3，所以 17%5=2。输出 "3 2"。',
    },
    {
      id: 4,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int i = 5;\ncout << i++ << " ";\ncout << ++i;',
      options: { A: '5 6', B: '5 7', C: '6 6', D: '6 7' },
      answer: 'B',
      score: 4,
      tags: ['自增运算', 'i++', '++i'],
      explanation: 'i++ 是"先使用后自增"：先输出 5，i 变为 6；++i 是"先自增后使用"：i 先变为 7 再输出。结果 "5 7"。',
    },
    {
      id: 5,
      type: 'singleChoice',
      stem: 'C++ 表达式 20 - 8 / 2 + 3 * 2 的计算结果是？',
      options: { A: '22', B: '9', C: '12', D: '18' },
      answer: 'A',
      score: 4,
      tags: ['运算符优先级'],
      explanation: '先算乘除：8/2=4，3*2=6；再从左到右算加减：20-4+6=22。',
    },
    {
      id: 6,
      type: 'singleChoice',
      stem: '以下代码执行后，输出结果是？',
      code: 'int x = 3, y = 8;\nif(!(x > y))\n    cout << "成立";\nelse\n    cout << "不成立";',
      options: { A: '成立', B: '不成立', C: '1', D: '0' },
      answer: 'A',
      score: 4,
      tags: ['逻辑运算', '逻辑非'],
      explanation: 'x>y 为 false；!(false)=true，条件成立，输出"成立"。! 表示"取反"。',
    },
    {
      id: 7,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int a = 10, b = 20;\nif(a < b)\n    cout << a;\nelse\n    cout << b;',
      options: { A: '10', B: '20', C: 'ab', D: '1020' },
      answer: 'A',
      score: 4,
      tags: ['分支结构', 'if-else'],
      explanation: 'a<b 即 10<20 为 true，执行 if 分支输出 a=10。else 分支不会执行。',
    },
    {
      id: 8,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int s = 0;\nfor(int i = 1; i <= 100; i += 10)\n    s += i;\ncout << s;',
      options: { A: '460', B: '550', C: '5050', D: '100' },
      answer: 'A',
      score: 4,
      tags: ['循环', 'for', '累加'],
      explanation: 'i 依次取 1,11,21,...,91 共 10 次，s 累加这些数。等差求和：(1+91)×10÷2=460。',
    },
    {
      id: 9,
      type: 'singleChoice',
      stem: '执行以下代码，循环体一共执行了多少次？',
      code: 'int i = 2, c = 0;\nwhile(i < 50) {\n    i *= 2;\n    c++;\n}',
      options: { A: '4', B: '5', C: '6', D: '7' },
      answer: 'B',
      score: 4,
      tags: ['循环', 'while', '循环次数'],
      explanation: 'i 依次变为 2→4→8→16→32→64。前 5 次 i<50 成立，第 6 次时 i=64 停止。循环体共执行 5 次。',
    },
    {
      id: 10,
      type: 'singleChoice',
      stem: '以下代码执行后，输出结果是？',
      code: 'cout << max(7, max(3, 9));',
      options: { A: '7', B: '3', C: '9', D: '7 3 9' },
      answer: 'C',
      score: 4,
      tags: ['数学函数', 'max'],
      explanation: '先算内层 max(3,9)=9，再算 max(7,9)=9。max(a,b) 返回两者中的较大值。',
    },
  ],
  trueFalse: [
    {
      id: 11,
      type: 'trueFalse',
      stem: 'C++ 程序中的注释（// 或 /* */）不会被计算机执行。',
      answer: 'A',
      score: 2,
      tags: ['注释'],
      explanation: '注释是给人看的说明文字，编译时会被忽略，不参与执行。',
    },
    {
      id: 12,
      type: 'trueFalse',
      stem: '只要程序能编译成功，运行时就不会再出任何错误。',
      answer: 'B',
      score: 2,
      tags: ['编译', '运行错误'],
      explanation: '编译成功只说明没有语法错误。逻辑错误（如除零、数组越界、算法算错）在运行时仍可能出错。',
    },
    {
      id: 13,
      type: 'trueFalse',
      stem: 'cin >> 和 cout << 是 C++ 中标准的输入输出方式。',
      answer: 'A',
      score: 2,
      tags: ['输入输出', 'cin', 'cout'],
      explanation: 'cin 配合 >> 用于输入，cout 配合 << 用于输出，是 C++ 标准输入输出流，需要包含 <iostream>。',
    },
    {
      id: 14,
      type: 'trueFalse',
      stem: '当循环条件一开始就为 false 时，while 和 do-while 循环的循环体都不会执行。',
      answer: 'B',
      score: 2,
      tags: ['循环', 'do-while'],
      explanation: 'while 是"先判断后执行"，条件为 false 时一次都不执行；但 do-while 是"先执行后判断"，即使条件一开始为 false，循环体也已经执行了一次。',
    },
    {
      id: 15,
      type: 'trueFalse',
      stem: '表达式 (3 < 5) || (8 < 3) 的值为 true。',
      answer: 'A',
      score: 2,
      tags: ['逻辑运算', '||'],
      explanation: '3<5 为 true，8<3 为 false。true || false = true。||（逻辑或）只要一边为 true 结果就是 true。',
    },
    {
      id: 16,
      type: 'trueFalse',
      stem: 'C++ 中，15 % 6 的计算结果是 3。',
      answer: 'A',
      score: 2,
      tags: ['取模运算', '%'],
      explanation: '15 ÷ 6 = 2 余 3，% 取余数，所以 15 % 6 = 3。',
    },
    {
      id: 17,
      type: 'trueFalse',
      stem: '程序的三种基本结构是：顺序结构、分支结构、循环结构。',
      answer: 'A',
      score: 2,
      tags: ['程序结构'],
      explanation: '任何程序都可以由顺序、分支（选择）、循环这三种基本结构组合而成。',
    },
    {
      id: 18,
      type: 'trueFalse',
      stem: 'pow(2, 3) 的计算结果是 8。',
      answer: 'A',
      score: 2,
      tags: ['数学函数', 'pow'],
      explanation: 'pow(x, y) 计算 x 的 y 次方。pow(2,3)=2³=8。需包含 <cmath> 头文件。',
    },
    {
      id: 19,
      type: 'trueFalse',
      stem: '把 double 类型变量的值赋给 int 类型变量时，小数部分会被丢弃。',
      answer: 'A',
      score: 2,
      tags: ['类型转换', '整型截断'],
      explanation: 'double→int 属于隐式类型转换，小数部分直接截断。如 double d=3.99; int a=d; 则 a=3（不是四舍五入）。',
    },
    {
      id: 20,
      type: 'trueFalse',
      stem: 'char 类型的变量只能存储单个字符，例如 \'A\'。',
      answer: 'A',
      score: 2,
      tags: ['数据类型', 'char'],
      explanation: 'char 是字符类型，用单引号包裹，只能存一个字符。多个字符要用 string 类型（双引号）。',
    },
  ],
  programming: [
    {
      id: 21,
      type: 'programming',
      stem: '【矩形计算】输入一个矩形的长 a 和宽 b，计算并输出它的面积和周长，结果保留两位小数。面积 = a × b，周长 = 2 × (a + b)。',
      inputFormat: '两个数 a 和 b（用空格隔开）',
      outputFormat: '面积和周长，保留两位小数，用空格隔开',
      sampleInput: '3 4',
      sampleOutput: '12.00 14.00',
      testCases: [
        { input: '3 4', output: '12.00 14.00' },
        { input: '5 5', output: '25.00 20.00' },
        { input: '2.5 4', output: '10.00 13.00' },
        { input: '1 1', output: '1.00 4.00' },
      ],
      referenceCode: `#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double a, b;
    cin >> a >> b;
    cout << fixed << setprecision(2) << a * b << " " << 2 * (a + b) << endl;
    return 0;
}`,
      score: 20,
      tags: ['顺序结构', '输入输出', '运算', '格式化输出'],
      explanation: '考点：顺序结构、变量定义、算术运算、cin/cout、保留两位小数。易错点：① 长宽可能是小数，要用 double 存；② 保留两位小数需要 fixed << setprecision(2)，需包含 <iomanip>。',
    },
    {
      id: 22,
      type: 'programming',
      stem: '【偶数统计】输入 N 个整数，统计其中偶数的个数，并求出所有偶数的和。',
      inputFormat: '第一行：一个整数 N\n第二行：N 个整数（用空格隔开）',
      outputFormat: '两个整数：偶数的个数和偶数的和，用空格隔开',
      sampleInput: '5\n1 2 3 4 5',
      sampleOutput: '2 6',
      testCases: [
        { input: '5\n1 2 3 4 5', output: '2 6' },
        { input: '1\n7', output: '0 0' },
        { input: '3\n-2 4 -6', output: '3 -4' },
        { input: '6\n2 4 6 8 10 12', output: '6 42' },
        { input: '4\n-1 -3 -5 0', output: '1 0' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n, cnt = 0, sum = 0;
    cin >> n;
    for(int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        if(x % 2 == 0) {
            cnt++;
            sum += x;
        }
    }
    cout << cnt << " " << sum << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环', '分支', '取模', '计数', '累加'],
      explanation: '考点：for 循环、if 分支、取模判断奇偶、计数与累加。易错点：① 判断偶数用 x%2==0；② 计数变量 cnt 和累加变量 sum 都要先初始化为 0。',
    },
  ],
};

// ============================================================
// C/C++ 一级 · 综合模拟卷（二）
// 侧重：运算与分支（标识符命名 / 整数除法陷阱 / 复合赋值 /
//       类型转换 / if 作用域 / 多分支 / 逻辑运算 / 数学函数 /
//       变量交换 / bool 输出）
// 依据 2026 年 3 月新版一级考纲，不涉及进制转换、数组、函数
// ============================================================
export const examMock2: Exam = {
  id: 'exam-mock-02-cpp1',
  name: 'C/C++一级·综合模拟卷二',
  category: 'mock',
  examDate: '2026-08',
  totalScore: 100,
  passingScore: 60,
  duration: 60,
  singleChoice: [
    {
      id: 1,
      type: 'singleChoice',
      stem: '下列变量名中，符合 C++ 标识符命名规则的是？',
      options: { A: '2num', B: 'my_score', C: 'int', D: 'a-b' },
      answer: 'B',
      score: 4,
      tags: ['标识符', '命名规则'],
      explanation: '标识符只能由字母、数字、下划线组成，且不能以数字开头，也不能是关键字。2num 以数字开头；int 是关键字；a-b 含有减号。只有 my_score 合法。',
    },
    {
      id: 2,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'double d = 7 / 2;\ncout << d;',
      options: { A: '3', B: '3.5', C: '4', D: '3.50' },
      answer: 'A',
      score: 4,
      tags: ['整数除法', '类型转换', 'double'],
      explanation: '7 和 2 都是 int，7/2 先做整数除法得 3，再赋给 double 变成 3.0，cout 输出为 3。想得 3.5 要写成 7.0 / 2 或 7 / 2.0。',
    },
    {
      id: 3,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int x = 5;\nx += 3;\nx *= 2;\ncout << x;',
      options: { A: '16', B: '13', C: '10', D: '8' },
      answer: 'A',
      score: 4,
      tags: ['复合赋值', '算术运算'],
      explanation: 'x += 3 等价于 x = x + 3 = 8；x *= 2 等价于 x = x * 2 = 16。复合赋值是"先算右边，再赋回左边"。',
    },
    {
      id: 4,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int a = 10;\nif (a > 5)\n    cout << "大";\n    cout << "了";',
      options: { A: '大', B: '大了', C: '了', D: '没有输出' },
      answer: 'B',
      score: 4,
      tags: ['if', '分支结构', '代码块'],
      explanation: 'if 后面没有花括号时，只控制紧随其后的第一条语句。第二句 cout << "了" 的缩进只是好看，并不属于 if，无论条件是否成立都会执行，所以输出"大了"。',
    },
    {
      id: 5,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int s = 75;\nif (s >= 90) cout << "优";\nelse if (s >= 60) cout << "及格";\nelse cout << "不及格";',
      options: { A: '优', B: '及格', C: '及格不及格', D: '不及格' },
      answer: 'B',
      score: 4,
      tags: ['多分支', 'if-else if'],
      explanation: '多分支 if-else if 从上往下判断，只执行第一个条件成立的分支。75>=90 不成立，75>=60 成立，输出"及格"，后面的 else 不再判断。',
    },
    {
      id: 6,
      type: 'singleChoice',
      stem: '表达式 !(5 > 3) && (2 < 4) 的值是？',
      options: { A: 'true', B: 'false', C: '1', D: '2' },
      answer: 'B',
      score: 4,
      tags: ['逻辑运算', '!', '&&'],
      explanation: '5>3 为 true，取反后 !(true)=false。&& 要求两边都为 true 结果才是 true，false && true = false。',
    },
    {
      id: 7,
      type: 'singleChoice',
      stem: '在 C++ 中，要判断整数 n 能否被 5 整除，正确的条件写法是？',
      options: { A: 'n / 5 == 0', B: 'n % 5 == 0', C: 'n % 5 = 0', D: 'n \\ 5 == 0' },
      answer: 'B',
      score: 4,
      tags: ['取模', '判断整除', '=='],
      explanation: '% 取余数，余数为 0 说明能整除。判断相等必须用 ==（双等号），单个 = 是赋值，写在条件里是常见错误。',
    },
    {
      id: 8,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'cout << abs(-7) + sqrt(16);',
      options: { A: '11', B: '-3', C: '3', D: '23' },
      answer: 'A',
      score: 4,
      tags: ['数学函数', 'abs', 'sqrt'],
      explanation: 'abs(-7) 求绝对值 = 7，sqrt(16) 开平方 = 4，7 + 4 = 11。使用这两个函数需要包含 <cmath> 头文件。',
    },
    {
      id: 9,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int a = 2, b = 3, c;\nc = a;\na = b;\nb = c;\ncout << a << " " << b;',
      options: { A: '2 3', B: '3 2', C: '2 2', D: '3 3' },
      answer: 'B',
      score: 4,
      tags: ['顺序结构', '变量交换'],
      explanation: '这是经典的"两数交换"，必须借助第三个变量暂存：c=a=2 先把 a 存起来；a=b=3；b=c=2 把原来的 a 赋给 b。最终 a=3、b=2。',
    },
    {
      id: 10,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'bool flag = 5 > 3;\ncout << flag;',
      options: { A: 'true', B: '1', C: '5>3', D: '0' },
      answer: 'B',
      score: 4,
      tags: ['bool', '数据类型', '输出'],
      explanation: 'bool 类型只有 true 和 false 两个值，但用 cout 直接输出时，true 显示为 1，false 显示为 0。5>3 为 true，所以输出 1。',
    },
  ],
  trueFalse: [
    {
      id: 11,
      type: 'trueFalse',
      stem: 'C++ 中，变量名 num 和 Num 表示同一个变量。',
      answer: 'B',
      score: 2,
      tags: ['标识符', '大小写'],
      explanation: 'C++ 严格区分大小写，num 和 Num 是两个完全不同的变量。',
    },
    {
      id: 12,
      type: 'trueFalse',
      stem: '表达式 7 / 2 的计算结果是 3.5。',
      answer: 'B',
      score: 2,
      tags: ['整数除法'],
      explanation: '两个整数相除，结果仍是整数，7/2 = 3（小数部分直接舍去）。要得到 3.5 需写成 7.0/2。',
    },
    {
      id: 13,
      type: 'trueFalse',
      stem: '在 C++ 中，判断两个数是否相等应该使用 ==，而不是 =。',
      answer: 'A',
      score: 2,
      tags: ['运算符', '=='],
      explanation: '== 是关系运算符（判断是否相等），= 是赋值运算符。把 if(a = 5) 写在条件里是典型的低级错误。',
    },
    {
      id: 14,
      type: 'trueFalse',
      stem: 'if 语句后面如果没有写花括号，则只有紧随其后的一条语句受它控制。',
      answer: 'A',
      score: 2,
      tags: ['if', '代码块'],
      explanation: '没有花括号时 if 只管一条语句。想让它管多条语句，必须加花括号 {} 把它们括起来。',
    },
    {
      id: 15,
      type: 'trueFalse',
      stem: '表达式 10 % 3 的结果是 1。',
      answer: 'A',
      score: 2,
      tags: ['取模', '%'],
      explanation: '10 ÷ 3 = 3 余 1，% 取余数，所以 10 % 3 = 1。',
    },
    {
      id: 16,
      type: 'trueFalse',
      stem: '一个完整的 C++ 程序中可以包含多个 main 函数。',
      answer: 'B',
      score: 2,
      tags: ['main函数', '程序结构'],
      explanation: 'main 是程序唯一的入口，一个程序只能有一个 main 函数。写多个会导致编译错误。',
    },
    {
      id: 17,
      type: 'trueFalse',
      stem: '在算术运算符中，*、/、% 的优先级高于 +、-。',
      answer: 'A',
      score: 2,
      tags: ['运算符优先级'],
      explanation: '和数学一样，先乘除取模、后加减。例如 2 + 3 * 4 = 14 而不是 20。',
    },
    {
      id: 18,
      type: 'trueFalse',
      stem: 'C++ 中的变量必须先定义，然后才能使用。',
      answer: 'A',
      score: 2,
      tags: ['变量', '定义'],
      explanation: '变量必须先定义（声明类型）再使用，否则编译器不知道它是什么类型、占多大空间，会报错。',
    },
    {
      id: 19,
      type: 'trueFalse',
      stem: '表达式 3.5 + 2 的结果是整数 5。',
      answer: 'B',
      score: 2,
      tags: ['类型转换', '混合运算'],
      explanation: 'double 和 int 混合运算时，int 会自动转成 double，结果是 5.5（double 类型），不是整数 5。',
    },
    {
      id: 20,
      type: 'trueFalse',
      stem: 'sqrt(25) 的计算结果是 5，使用该函数需要包含 <cmath> 头文件。',
      answer: 'A',
      score: 2,
      tags: ['数学函数', 'sqrt'],
      explanation: 'sqrt 是开平方函数，sqrt(25)=5。所有数学函数（sqrt/abs/pow/max/min）都需要 #include <cmath>。',
    },
  ],
  programming: [
    {
      id: 21,
      type: 'programming',
      stem: '【温度转换】输入一个摄氏温度 c（可能为小数），按公式 f = c × 9 / 5 + 32 计算对应的华氏温度，输出结果保留 1 位小数。',
      inputFormat: '一个实数 c，表示摄氏温度',
      outputFormat: '一个实数，表示华氏温度，保留 1 位小数',
      sampleInput: '100',
      sampleOutput: '212.0',
      testCases: [
        { input: '100', output: '212.0' },
        { input: '0', output: '32.0' },
        { input: '37', output: '98.6' },
        { input: '25', output: '77.0' },
        { input: '-40', output: '-40.0' },
      ],
      referenceCode: `#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double c, f;
    cin >> c;
    f = c * 9 / 5 + 32;
    cout << fixed << setprecision(1) << f << endl;
    return 0;
}`,
      score: 20,
      tags: ['顺序结构', '浮点运算', '格式化输出'],
      explanation: '考点：顺序结构、double 类型、算术运算、保留小数。易错点：① 温度可能是小数，要用 double 存；② 保留 1 位小数用 fixed << setprecision(1)，需包含 <iomanip>；③ 写 c * 9 / 5 而不是 c * (9 / 5)，因为 9/5 是整数除法会变成 1。',
    },
    {
      id: 22,
      type: 'programming',
      stem: '【成绩等级】输入一个整数成绩 score（0~100），按以下规则输出对应的等级字母：90 分及以上输出 A；80~89 分输出 B；60~79 分输出 C；60 分以下输出 D。',
      inputFormat: '一个整数 score，表示成绩',
      outputFormat: '一个大写字母 A、B、C 或 D',
      sampleInput: '85',
      sampleOutput: 'B',
      testCases: [
        { input: '95', output: 'A' },
        { input: '85', output: 'B' },
        { input: '60', output: 'C' },
        { input: '59', output: 'D' },
        { input: '100', output: 'A' },
        { input: '0', output: 'D' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int score;
    cin >> score;
    if (score >= 90) cout << "A";
    else if (score >= 80) cout << "B";
    else if (score >= 60) cout << "C";
    else cout << "D";
    return 0;
}`,
      score: 20,
      tags: ['多分支', 'if-else if', '边界条件'],
      explanation: '考点：多分支 if-else if、边界值判断。易错点：① 判断要从高分段往低分段写（先判断 >=90），反过来写会全落到第一段；② 60 分属于 C 档（>=60），59 分才是不及格；③ 分支只会执行第一个满足的条件，后面的不再判断。',
    },
  ],
};

// ============================================================
// C/C++ 一级 · 综合模拟卷（三）
// 侧重：循环与综合应用（for/while/do-while / 循环次数 /
//       break·continue / 嵌套循环 / 累加累乘 / 打擂台求最值）
// 依据 2026 年 3 月新版一级考纲，不涉及进制转换、数组、函数
// ============================================================
export const examMock3: Exam = {
  id: 'exam-mock-03-cpp1',
  name: 'C/C++一级·综合模拟卷三',
  category: 'mock',
  examDate: '2026-08',
  totalScore: 100,
  passingScore: 60,
  duration: 60,
  singleChoice: [
    {
      id: 1,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int s = 0;\nfor (int i = 2; i <= 8; i += 2)\n    s += i;\ncout << s;',
      options: { A: '20', B: '16', C: '12', D: '25' },
      answer: 'A',
      score: 4,
      tags: ['for循环', '累加', '步长'],
      explanation: 'i 依次取 2、4、6、8（步长为 2），s = 2+4+6+8 = 20。注意 i += 2 表示每次加 2，不是加 1。',
    },
    {
      id: 2,
      type: 'singleChoice',
      stem: '以下代码执行后，循环体一共执行了多少次？',
      code: 'for (int i = 10; i > 0; i -= 3)\n    cout << i << " ";',
      options: { A: '3', B: '4', C: '5', D: '10' },
      answer: 'B',
      score: 4,
      tags: ['for循环', '循环次数'],
      explanation: 'i 依次取 10、7、4、1 共 4 次；下一次 i = -2，不满足 i > 0，循环结束。',
    },
    {
      id: 3,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int i = 1;\nwhile (i < 5) {\n    cout << i;\n    i += 2;\n}',
      options: { A: '123', B: '13', C: '135', D: '24' },
      answer: 'B',
      score: 4,
      tags: ['while循环'],
      explanation: 'i=1 输出 1，i 变成 3；i=3 满足条件输出 3，i 变成 5；i=5 不满足 i<5，循环结束。连起来输出 "13"。',
    },
    {
      id: 4,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int n = 0;\ndo {\n    n++;\n} while (n > 5);\ncout << n;',
      options: { A: '0', B: '1', C: '5', D: '6' },
      answer: 'B',
      score: 4,
      tags: ['do-while', '循环'],
      explanation: 'do-while 是"先执行、后判断"：先执行一次循环体使 n 变成 1，再判断 n > 5 为 false，循环结束。输出 1。',
    },
    {
      id: 5,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'for (int i = 1; i <= 10; i++) {\n    if (i % 3 == 0) break;\n    cout << i << " ";\n}',
      options: { A: '1 2 ', B: '1 2 3 ', C: '3 6 9 ', D: '1 2 3 4 5 6 7 8 9 10 ' },
      answer: 'A',
      score: 4,
      tags: ['break', '循环控制'],
      explanation: 'i=1、2 时正常输出；i=3 时 3%3==0 成立，break 立即跳出整个循环，后面的 4~10 不再执行。输出 "1 2 "。',
    },
    {
      id: 6,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int s = 0;\nfor (int i = 1; i <= 5; i++) {\n    if (i % 2 == 1) continue;\n    s += i;\n}\ncout << s;',
      options: { A: '6', B: '9', C: '15', D: '4' },
      answer: 'A',
      score: 4,
      tags: ['continue', '循环控制'],
      explanation: 'i 为奇数（1、3、5）时 continue 跳过本次循环，不执行累加；只有 i=2、4 参与累加，s = 2 + 4 = 6。continue 只跳过本轮，不结束整个循环。',
    },
    {
      id: 7,
      type: 'singleChoice',
      stem: '执行以下代码，最内层的 cout 语句一共执行了多少次？',
      code: 'for (int i = 1; i <= 3; i++)\n    for (int j = 1; j <= 4; j++)\n        cout << "*";',
      options: { A: '7', B: '12', C: '3', D: '4' },
      answer: 'B',
      score: 4,
      tags: ['嵌套循环', '循环次数'],
      explanation: '外层循环执行 3 次，每执行一次外层，内层循环完整跑 4 次，所以总共 3 × 4 = 12 次。嵌套循环的总次数是各层次数相乘。',
    },
    {
      id: 8,
      type: 'singleChoice',
      stem: '以下代码用"打擂台法"求 10 个整数中的最大值，横线处应填入哪个条件？',
      code: 'int mx, x;\ncin >> mx;\nfor (int i = 2; i <= 10; i++) {\n    cin >> x;\n    if (______) mx = x;\n}',
      options: { A: 'x > mx', B: 'x < mx', C: 'x == mx', D: 'x != mx' },
      answer: 'A',
      score: 4,
      tags: ['打擂台', '求最值'],
      explanation: '把第一个数当作"擂主"存入 mx，之后每读入一个新数，只要它比当前擂主大（x > mx）就更新擂主。循环结束 mx 即最大值。',
    },
    {
      id: 9,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int a = 1;\nfor (int i = 1; i <= 4; i++)\n    a *= i;\ncout << a;',
      options: { A: '24', B: '10', C: '4', D: '16' },
      answer: 'A',
      score: 4,
      tags: ['累乘', '循环', '初始化'],
      explanation: 'a 依次乘上 1、2、3、4，即 a = 1×1×2×3×4 = 24（4 的阶乘）。关键：累乘的初始值必须是 1，累加才初始化为 0，用错结果就变成 0。',
    },
    {
      id: 10,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？（每行末尾都有换行）',
      code: 'for (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= i; j++)\n        cout << j;\n    cout << endl;\n}',
      options: {
        A: '第一行 1，第二行 12，第三行 123',
        B: '第一行 1，第二行 22，第三行 333',
        C: '第一行 123，第二行 123，第三行 123',
        D: '第一行 1，第二行 2，第三行 3',
      },
      answer: 'A',
      score: 4,
      tags: ['嵌套循环', '输出图案'],
      explanation: '外层 i 控制行号（共 3 行），内层 j 每次从 1 输出到 i：第 1 行输出 1，第 2 行输出 12，第 3 行输出 123。内层循环的上限跟着外层变量变化，是打印三角形图案的核心技巧。',
    },
  ],
  trueFalse: [
    {
      id: 11,
      type: 'trueFalse',
      stem: '循环体如果只有一条语句，可以省略花括号 {}。',
      answer: 'A',
      score: 2,
      tags: ['循环', '代码块'],
      explanation: '只有一条语句时花括号可以省略（和 if 一样）。但初学阶段建议都写上，避免添加语句时出错。',
    },
    {
      id: 12,
      type: 'trueFalse',
      stem: 'break 语句的作用是立即结束整个循环。',
      answer: 'A',
      score: 2,
      tags: ['break', '循环控制'],
      explanation: 'break 会立刻跳出当前所在的整个循环，循环剩下的次数不再执行。（在 switch 中 break 用于跳出 switch）',
    },
    {
      id: 13,
      type: 'trueFalse',
      stem: 'continue 语句的作用是立即结束整个循环。',
      answer: 'B',
      score: 2,
      tags: ['continue', '循环控制'],
      explanation: 'continue 只跳过"本次"循环中它后面的语句，直接进入下一轮；结束整个循环的是 break。这是最容易混淆的一对概念。',
    },
    {
      id: 14,
      type: 'trueFalse',
      stem: '死循环（无限循环）属于语法错误，程序无法通过编译。',
      answer: 'B',
      score: 2,
      tags: ['死循环', '逻辑错误'],
      explanation: '死循环是逻辑错误不是语法错误，程序能正常编译，只是运行时停不下来。常见原因：忘记写循环变量的更新语句，或循环条件永远成立。',
    },
    {
      id: 15,
      type: 'trueFalse',
      stem: 'for (int i = 1; i <= 10; i++) 的循环体一共执行 10 次。',
      answer: 'A',
      score: 2,
      tags: ['for循环', '循环次数'],
      explanation: 'i 从 1 取到 10，共 10 个数，循环体执行 10 次。一般规律：for(i=a; i<=b; i++) 执行 b-a+1 次。',
    },
    {
      id: 16,
      type: 'trueFalse',
      stem: '做累加求和时，累加变量必须先初始化为 0，否则结果可能出错。',
      answer: 'A',
      score: 2,
      tags: ['累加', '初始化'],
      explanation: '未初始化的变量值是不确定的"垃圾值"，在这个基础上累加结果必然错误。累加必须从 0 开始，累乘必须从 1 开始。',
    },
    {
      id: 17,
      type: 'trueFalse',
      stem: '循环嵌套时，外层循环每执行一次，内层循环都要完整执行一遍。',
      answer: 'A',
      score: 2,
      tags: ['嵌套循环'],
      explanation: '这正是嵌套循环的执行规则：外层走一步，内层走一圈。总执行次数 = 外层次数 × 内层次数。',
    },
    {
      id: 18,
      type: 'trueFalse',
      stem: '在循环体内修改循环变量的值，不会改变循环执行的次数。',
      answer: 'B',
      score: 2,
      tags: ['循环变量', '循环次数'],
      explanation: '在循环体里改动循环变量（比如让 i 多加一次）会直接影响循环次数，甚至造成死循环。一般不建议在循环体内手动修改循环变量。',
    },
    {
      id: 19,
      type: 'trueFalse',
      stem: '求 1 到 n 的累加和，既可以用 for 循环实现，也可以用 while 循环实现。',
      answer: 'A',
      score: 2,
      tags: ['for', 'while', '循环'],
      explanation: 'for 和 while 可以相互转换，任何 for 循环都能改写成 while 循环，反之亦然。for 更适合已知循环次数，while 更适合按条件结束。',
    },
    {
      id: 20,
      type: 'trueFalse',
      stem: 'do-while 循环的循环体至少会执行一次。',
      answer: 'A',
      score: 2,
      tags: ['do-while', '循环'],
      explanation: 'do-while 是"先执行、后判断"，即使条件一开始就不成立，循环体也已经跑过一次了。这是它和 while 最大的区别。',
    },
  ],
  programming: [
    {
      id: 21,
      type: 'programming',
      stem: '【累加求和】输入一个正整数 n，计算并输出 1 + 2 + 3 + ... + n 的和。',
      inputFormat: '一个正整数 n',
      outputFormat: '一个整数，表示 1 到 n 的累加和',
      sampleInput: '100',
      sampleOutput: '5050',
      testCases: [
        { input: '100', output: '5050' },
        { input: '10', output: '55' },
        { input: '1', output: '1' },
        { input: '5', output: '15' },
        { input: '50', output: '1275' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n, sum = 0;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        sum += i;
    }
    cout << sum << endl;
    return 0;
}`,
      score: 20,
      tags: ['for循环', '累加', '顺序'],
      explanation: '考点：for 循环、累加器。易错点：① sum 必须初始化为 0；② 循环条件写成 i <= n（包含 n 本身），写成 i < n 会少加最后一项；③ 数据范围：n=100 时结果 5050，int 完全够用。',
    },
    {
      id: 22,
      type: 'programming',
      stem: '【最大值与最小值】输入 n 个整数，找出其中的最大值和最小值并输出。',
      inputFormat: '第一行：一个整数 n，表示数字个数\n第二行：n 个整数（用空格隔开）',
      outputFormat: '两个整数：最大值和最小值，用空格隔开',
      sampleInput: '5\n3 9 1 7 5',
      sampleOutput: '9 1',
      testCases: [
        { input: '5\n3 9 1 7 5', output: '9 1' },
        { input: '1\n42', output: '42 42' },
        { input: '4\n-1 -5 -3 -2', output: '-1 -5' },
        { input: '3\n0 0 0', output: '0 0' },
        { input: '6\n10 20 5 8 15 3', output: '20 3' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n, x, mx, mn;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cin >> x;
        if (i == 1) {
            mx = x;
            mn = x;
        } else {
            if (x > mx) mx = x;
            if (x < mn) mn = x;
        }
    }
    cout << mx << " " << mn << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环', '打擂台', '求最值'],
      explanation: '考点：for 循环、打擂台求最值。易错点：① 最大值和最小值要各用一个变量保存，不能共用一个；② 用第一个数给 mx、mn 初始化（i==1 时），比猜一个"很大的数"更稳妥，也能正确处理全是负数的情况；③ n=1 时最大值和最小值相同，程序要能输出 "42 42"。',
    },
  ],
};

// ============================================================
// C/C++ 一级 · 综合模拟卷（四）
// 侧重：考纲五模块全覆盖（程序开发流程 / main·头文件·注释 /
//       标识符·const / cin·cout·endl·printf / 多变量输入输出 /
//       取模符号·整数除法对比·abs / if 条件写法 / 循环结合取模）
// ============================================================
export const examMock4: Exam = {
  id: 'exam-mock-04-cpp1',
  name: 'C/C++一级·综合模拟卷四',
  category: 'mock',
  examDate: '2026-08',
  totalScore: 100,
  passingScore: 60,
  duration: 60,
  singleChoice: [
    {
      id: 1,
      type: 'singleChoice',
      stem: '一个 C++ 程序从写完源代码到看到运行结果，正确的步骤顺序是？',
      options: {
        A: '写源代码 → 编译 → 链接 → 运行',
        B: '编译 → 写源代码 → 链接 → 运行',
        C: '写源代码 → 链接 → 编译 → 运行',
        D: '运行 → 编译 → 链接 → 写源代码',
      },
      answer: 'A',
      score: 4,
      tags: ['程序开发流程', '编译', '链接'],
      explanation: '完整流程是：编写源代码（.cpp）→ 编译（翻译成机器能懂的目标文件）→ 链接（把目标文件和用到的库组合起来）→ 运行（执行最终的可执行文件）。顺序不能乱。',
    },
    {
      id: 2,
      type: 'singleChoice',
      stem: '程序开头写的 #include <iostream>，作用是？',
      options: {
        A: '在程序中加入注释',
        B: '引入输入输出库，让 cin、cout 可以使用',
        C: '定义 main 函数',
        D: '让程序运行速度更快',
      },
      answer: 'B',
      score: 4,
      tags: ['头文件', '#include'],
      explanation: 'iostream 是输入输出流头文件，里面包含了 cin、cout 的定义。#include 的作用就是把头文件的内容"复制"进来。不写它，cin 和 cout 就无法使用。',
    },
    {
      id: 3,
      type: 'singleChoice',
      stem: '下列四组变量名中，全部合法的一组是？',
      options: {
        A: 'sum_1、_a、Int',
        B: '3abc、x、y_2',
        C: 'int、double、num',
        D: 'my-name、b2、c',
      },
      answer: 'A',
      score: 4,
      tags: ['标识符', '命名规则'],
      explanation: '标识符只能由字母、数字、下划线组成，不能以数字开头，不能用关键字。B 组 3abc 数字开头；C 组 int、double 是关键字（Int 首字母大写就不是关键字了，C++ 区分大小写）；D 组 my-name 含减号。A 组全部合法（_a 以下划线开头是允许的）。',
    },
    {
      id: 4,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int a = 3;\na = a + 4;\na = a * 2;\ncout << a;',
      options: { A: '14', B: '7', C: '6', D: '24' },
      answer: 'A',
      score: 4,
      tags: ['变量赋值', '顺序结构'],
      explanation: 'a = a + 4 是"用 a 现在的值 3 加上 4，再存回 a"，a 变成 7；接着 a = a * 2 让 a 变成 14。变量可以被反复赋值，新值会覆盖旧值，程序严格从上往下执行。',
    },
    {
      id: 5,
      type: 'singleChoice',
      stem: '执行以下代码，从键盘输入 3 和 5（用空格隔开），输出结果是？',
      code: 'int a, b;\ncin >> a >> b;\ncout << a + b << " " << a * b;',
      options: { A: '8 15', B: '35 15', C: '8 8', D: '3 5' },
      answer: 'A',
      score: 4,
      tags: ['多变量输入', 'cin', '格式匹配'],
      explanation: 'cin >> a >> b 连续读入两个数，输入时用空格隔开即可自动分配给 a 和 b。输出：3+5=8 和 3×5=15，中间用空格隔开，即 "8 15"。',
    },
    {
      id: 6,
      type: 'singleChoice',
      stem: '下列 printf 语句中，能正确输出整数 25 的是？',
      options: {
        A: 'printf("%d", 25);',
        B: 'printf("%c", 25);',
        C: 'printf("%f", 25);',
        D: 'printf("%s", 25);',
      },
      answer: 'A',
      score: 4,
      tags: ['printf', '格式符'],
      explanation: '%d 对应整数；%c 对应单个字符；%f 对应小数（25 会显示成 25.000000）；%s 对应字符串。要输出整数就用 %d。',
    },
    {
      id: 7,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'cout << 9 / 2 << " " << 9.0 / 2;',
      options: { A: '4 4.5', B: '4.5 4.5', C: '4 4', D: '4.5 4' },
      answer: 'A',
      score: 4,
      tags: ['整数除法', '浮点除法'],
      explanation: '9 和 2 都是 int，整数除法直接舍弃小数，得 4；9.0 是浮点数，9.0/2 做浮点除法，得 4.5。区分整数除法和浮点除法：只要有一个操作数是小数，就按小数除。',
    },
    {
      id: 8,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'cout << -7 % 3;',
      options: { A: '-1', B: '1', C: '2', D: '-2' },
      answer: 'A',
      score: 4,
      tags: ['取模', '符号'],
      explanation: 'C++ 中取模结果的符号跟被除数（% 左边的数）一致。-7 = 3 × (-2) + (-1)，所以 -7 % 3 = -1。记住口诀：余数符号跟着被除数走。',
    },
    {
      id: 9,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int a = -8, b = 5;\ncout << abs(a) - abs(b);',
      options: { A: '3', B: '-3', C: '13', D: '-13' },
      answer: 'A',
      score: 4,
      tags: ['数学函数', 'abs'],
      explanation: 'abs(x) 求绝对值：abs(-8)=8，abs(5)=5，8-5=3。abs 只会"去掉负号"，不会改变正数和零。',
    },
    {
      id: 10,
      type: 'singleChoice',
      stem: '关于 if 语句的条件写法，下列正确的是？',
      options: {
        A: 'if (a ≥ b)',
        B: 'if (a >= b)',
        C: 'if a >= b',
        D: 'if (a => b)',
      },
      answer: 'B',
      score: 4,
      tags: ['if', '条件表达式', '关系运算符'],
      explanation: '条件必须写在圆括号内；"大于等于"要写成两个符号 >=（键盘上没有 ≥，不能直接用）；=> 是错误顺序。合法的关系运算符只有：>、<、>=、<=、==、!=。',
    },
  ],
  trueFalse: [
    {
      id: 11,
      type: 'trueFalse',
      stem: 'main 函数是 C++ 程序的入口，程序总是从 main 函数开始执行。',
      answer: 'A',
      score: 2,
      tags: ['main函数', '程序入口'],
      explanation: 'main 是程序的唯一入口，操作系统启动程序时就是去调用 main 函数。无论 main 写在文件的什么位置，程序都从它开始执行。',
    },
    {
      id: 12,
      type: 'trueFalse',
      stem: '多行注释 /* */ 里面还可以再嵌套一层 /* */。',
      answer: 'B',
      score: 2,
      tags: ['注释', '嵌套'],
      explanation: '注释不能嵌套。编译器遇到第一个 */ 就认为注释结束了，后面多出来的 */ 会变成语法错误。例如 /* /* 注释 */ */ 是错的。',
    },
    {
      id: 13,
      type: 'trueFalse',
      stem: 'cout << endl 和 cout << "\\n" 的效果完全一样，没有任何区别。',
      answer: 'B',
      score: 2,
      tags: ['endl', '换行'],
      explanation: 'endl = 换行 + 刷新输出缓冲区（让内容立刻显示出来）；"\\n" 只负责换行。多数情况下效果相同，但它们不是"完全一样"。',
    },
    {
      id: 14,
      type: 'trueFalse',
      stem: 'const int N = 10; 之后执行 N = 20; 程序会编译报错。',
      answer: 'A',
      score: 2,
      tags: ['const', '常量'],
      explanation: 'const 修饰的常量只能在定义时赋值，之后任何修改它的尝试都会导致编译错误。这就是"常量"的含义：定义后值不能改变。',
    },
    {
      id: 15,
      type: 'trueFalse',
      stem: '变量名可以以下划线开头，例如 _sum 是合法的变量名。',
      answer: 'A',
      score: 2,
      tags: ['标识符', '命名规则'],
      explanation: '标识符不能以"数字"开头，但可以以"字母"或"下划线"开头，所以 _sum、sum_1 都合法，而 2sum 非法。',
    },
    {
      id: 16,
      type: 'trueFalse',
      stem: '在 C++ 中，% 运算符的两边可以是任意类型的数，比如 7.5 % 2 也是对的。',
      answer: 'B',
      score: 2,
      tags: ['取模', '%'],
      explanation: '% 只能用于整数（两边都必须是整数），7.5 % 2 会直接编译报错。另外记住：余数的符号跟被除数一致。',
    },
    {
      id: 17,
      type: 'trueFalse',
      stem: '一个程序如果没有分支和循环，就会从上到下依次执行每一条语句。',
      answer: 'A',
      score: 2,
      tags: ['顺序结构'],
      explanation: '顺序结构是最基本的程序结构：没有 if、没有循环时，语句严格按照书写顺序从上到下一条条执行，不会跳过也不会回头。',
    },
    {
      id: 18,
      type: 'trueFalse',
      stem: '链接（Link）这一步的作用，是把编译生成的文件和程序用到的库文件组合成最终的可执行文件。',
      answer: 'A',
      score: 2,
      tags: ['程序开发流程', '链接'],
      explanation: '编译只把源代码翻译成目标文件，程序里用到的 cout、cin 等功能的实现存放在标准库里，链接负责把它们"拼装"成能直接运行的可执行文件。',
    },
    {
      id: 19,
      type: 'trueFalse',
      stem: '执行 cout << "3+5=" << 3 + 5; 会输出 3+5=8。',
      answer: 'A',
      score: 2,
      tags: ['输出格式', '字符串原样输出'],
      explanation: '双引号里的 "3+5=" 是字符串，原样输出；后面的 3 + 5 没有引号，是算式，输出计算结果 8。合起来就是 3+5=8。',
    },
    {
      id: 20,
      type: 'trueFalse',
      stem: '执行以下代码后，变量 c 的值是 5。\ncode: int c = 0;\nfor (int i = 1; i <= 20; i++)\n    if (i % 4 == 0) c++;',
      answer: 'A',
      score: 2,
      tags: ['循环', '取模', '计数'],
      explanation: '这段代码统计 1~20 中 4 的倍数的个数：4、8、12、16、20，共 5 个，所以 c = 5。"循环 + 取模判断"是编程题最常用的套路。',
    },
  ],
  programming: [
    {
      id: 21,
      type: 'programming',
      stem: '【7 的倍数求和】输入一个正整数 n，计算并输出 1 到 n 之间（包含 n）所有 7 的倍数的和。如果没有 7 的倍数，输出 0。',
      inputFormat: '一个正整数 n',
      outputFormat: '一个整数，表示 1~n 中所有 7 的倍数的和',
      sampleInput: '30',
      sampleOutput: '70',
      testCases: [
        { input: '30', output: '70' },
        { input: '7', output: '7' },
        { input: '6', output: '0' },
        { input: '100', output: '735' },
        { input: '14', output: '21' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n, sum = 0;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        if (i % 7 == 0) {
            sum += i;
        }
    }
    cout << sum << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环', '取模', '累加', '分支'],
      explanation: '考点：for 循环遍历 1~n、取模判断 7 的倍数（i % 7 == 0）、条件累加。易错点：① sum 必须初始化为 0；② n=6 时一个 7 的倍数都没有，输出 0，程序要能正确处理这种"空"的情况；③ 循环变量要从 1 开始（从 0 开始也没错，但 0 也满足 %7==0，加 0 不影响结果）。',
    },
    {
      id: 22,
      type: 'programming',
      stem: '【平均分计算】输入 n 个学生的成绩（整数），计算并输出他们的平均分，结果保留 1 位小数。',
      inputFormat: '第一行：一个整数 n，表示学生人数\n第二行：n 个整数成绩（用空格隔开）',
      outputFormat: '一个实数，表示平均分，保留 1 位小数',
      sampleInput: '4\n80 90 85 95',
      sampleOutput: '87.5',
      testCases: [
        { input: '4\n80 90 85 95', output: '87.5' },
        { input: '3\n70 80 90', output: '80.0' },
        { input: '1\n100', output: '100.0' },
        { input: '5\n1 2 3 4 5', output: '3.0' },
        { input: '3\n1 2 4', output: '2.3' },
      ],
      referenceCode: `#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int n, x, sum = 0;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        cin >> x;
        sum += x;
    }
    cout << fixed << setprecision(1) << sum * 1.0 / n << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环', '累加', '整数除法', '格式化输出'],
      explanation: '考点：for 循环累加、整数除法 vs 浮点除法、保留小数。最大的陷阱在最后一步：sum 和 n 都是 int，直接写 sum / n 是整数除法，350/4 会得到 87 而不是 87.5！必须先把其中一个变成小数（写 sum * 1.0 / n 或把 sum 定义成 double）。保留 1 位小数用 fixed << setprecision(1)，需包含 <iomanip>。',
    },
  ],
};


export const mockExams: Exam[] = [examMock1, examMock2, examMock3, examMock4];
