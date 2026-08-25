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
// 侧重：进阶应用全覆盖（进制与存储 / 赋值与类型转换 / 多分支 /
//       嵌套循环 / break·continue / 字符与ASCII / 浮点精度 /
//       闰年判断 / 打擂台求最值）
// ============================================================
export const examMock2: Exam = {
  id: 'exam-mock-02-cpp1',
  name: 'C/C++一级·综合模拟卷二',
  category: 'mock',
  examDate: '2026-08',
  totalScore: 100,
  passingScore: 60,
  duration: 60, // 60分钟
  singleChoice: [
    {
      id: 1,
      type: 'singleChoice',
      stem: '十进制数 10 转换为二进制后是？',
      options: { A: '1010', B: '1100', C: '1001', D: '1011' },
      answer: 'A',
      score: 4,
      tags: ['进制转换', '二进制'],
      explanation: '10 = 8 + 2 = 1×2³ + 0×2² + 1×2¹ + 0×2⁰，即二进制 1010。',
    },
    {
      id: 2,
      type: 'singleChoice',
      stem: '执行以下代码后，a 和 b 的值分别是？',
      code: 'int a = 5, b = 10;\na = b;\nb = a;',
      options: { A: '10 10', B: '10 5', C: '5 10', D: '5 5' },
      answer: 'A',
      score: 4,
      tags: ['变量赋值', '赋值顺序'],
      explanation: 'a=b 把 b 的值 10 赋给 a，此时 a=10、b=10；b=a 再把 a 的值 10 赋给 b，结果 a=10、b=10。',
    },
    {
      id: 3,
      type: 'singleChoice',
      stem: '执行以下代码后，变量 x 的值是？',
      code: 'int x = 6;\nx += 3;\nx *= 2;',
      options: { A: '18', B: '12', C: '36', D: '9' },
      answer: 'A',
      score: 4,
      tags: ['复合赋值', '运算'],
      explanation: 'x += 3 等价于 x = x + 3，x 变为 9；x *= 2 等价于 x = x * 2，x 变为 18。',
    },
    {
      id: 4,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int a = 7 / 2.0;\ncout << a;',
      options: { A: '3', B: '3.5', C: '4', D: '3.0' },
      answer: 'A',
      score: 4,
      tags: ['类型转换', '隐式转换'],
      explanation: '7/2.0=3.5（因为 2.0 是 double，结果自动转为 double）。赋给 int 变量 a 时小数部分截断，a=3，输出 3。',
    },
    {
      id: 5,
      type: 'singleChoice',
      stem: '执行以下代码，变量 g 的值是？',
      code: 'int s = 85;\nchar g;\nif(s >= 90)      g = \'A\';\nelse if(s >= 80) g = \'B\';\nelse if(s >= 70) g = \'C\';\nelse            g = \'D\';',
      options: { A: "'A'", B: "'B'", C: "'C'", D: "'D'" },
      answer: 'B',
      score: 4,
      tags: ['分支结构', 'if-else if', '多分支'],
      explanation: 's=85：s>=90 不成立；继续判断 s>=80 成立，执行 g=\'B\'，后面的分支不再判断。',
    },
    {
      id: 6,
      type: 'singleChoice',
      stem: '以下嵌套循环中，内层循环体一共会执行多少次？',
      code: 'for(int i = 1; i <= 3; i++)\n    for(int j = 1; j <= 2; j++)\n        cout << i * j << " ";',
      options: { A: '5', B: '6', C: '3', D: '2' },
      answer: 'B',
      score: 4,
      tags: ['循环', '嵌套循环'],
      explanation: '外层循环 3 次，内层循环每次执行 2 次，总次数 = 3 × 2 = 6 次。',
    },
    {
      id: 7,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'for(int i = 1; i <= 5; i++) {\n    if(i == 3) continue;\n    cout << i;\n}',
      options: { A: '12345', B: '1245', C: '123', D: '1345' },
      answer: 'B',
      score: 4,
      tags: ['循环', 'continue'],
      explanation: 'continue 的作用是跳过本次循环剩余语句，直接进入下一次。i=3 时被跳过，所以输出 1245。',
    },
    {
      id: 8,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int s = 0;\nfor(int i = 1; i <= 5; i++) {\n    if(i % 2 == 0) s += i;\n}\ncout << s;',
      options: { A: '6', B: '9', C: '15', D: '5' },
      answer: 'A',
      score: 4,
      tags: ['循环', '取模', '累加'],
      explanation: 'i%2==0 说明 i 是偶数，将偶数 2 和 4 累加，s = 2 + 4 = 6。',
    },
    {
      id: 9,
      type: 'singleChoice',
      stem: 'sqrt(16) + abs(-9) 的值是？',
      options: { A: '13', B: '7', C: '25', D: '-5' },
      answer: 'A',
      score: 4,
      tags: ['数学函数', 'sqrt', 'abs'],
      explanation: 'sqrt(16)=4（平方根），abs(-9)=9（绝对值），4+9=13。',
    },
    {
      id: 10,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'char ch = \'A\';\ncout << (char)(ch + 1);',
      options: { A: 'A', B: 'B', C: '66', D: '65' },
      answer: 'B',
      score: 4,
      tags: ['字符类型', 'ASCII'],
      explanation: '字符参与运算时按 ASCII 码计算：\'A\' 的 ASCII 是 65，65+1=66，即 \'B\' 的 ASCII，强转回 char 输出 \'B\'。',
    },
  ],
  trueFalse: [
    {
      id: 11,
      type: 'trueFalse',
      stem: '变量名可以以数字开头，例如 2num 是合法的变量名。',
      answer: 'B',
      score: 2,
      tags: ['标识符', '变量命名'],
      explanation: 'C++ 标识符只能以字母或下划线开头，不能以数字开头。2num 非法，num2 合法。',
    },
    {
      id: 12,
      type: 'trueFalse',
      stem: 'const int a = 10; 定义后，程序中可以执行 a = 20; 来修改 a 的值。',
      answer: 'B',
      score: 2,
      tags: ['常量', 'const'],
      explanation: 'const 修饰的变量是常量，定义后值不可修改。a = 20; 会编译报错。',
    },
    {
      id: 13,
      type: 'trueFalse',
      stem: 'C++ 中，10 / 3 的计算结果是 3.33。',
      answer: 'B',
      score: 2,
      tags: ['整数除法'],
      explanation: '两个 int 相除结果还是 int：10/3=3（小数部分直接舍去）。想得到 3.33 需写成 10.0/3。',
    },
    {
      id: 14,
      type: 'trueFalse',
      stem: 'if(x = 5) 和 if(x == 5) 的判断效果完全一样。',
      answer: 'B',
      score: 2,
      tags: ['赋值运算符', '关系运算'],
      explanation: 'x=5 是赋值（把 5 给 x，值为 5，恒为真）；x==5 是比较（判断 x 是否等于 5）。两者完全不同。',
    },
    {
      id: 15,
      type: 'trueFalse',
      stem: 'int b = 0; 时，执行 if(b != 0 && 100 / b > 1) 不会发生除零错误。',
      answer: 'A',
      score: 2,
      tags: ['逻辑运算', '短路求值'],
      explanation: '&& 具有短路特性：左边 b!=0 为 false 时，整个表达式已确定为 false，右边 100/b 不会再执行，因此不会除零。',
    },
    {
      id: 16,
      type: 'trueFalse',
      stem: 'while(1) 会构成无限循环。',
      answer: 'A',
      score: 2,
      tags: ['循环', '无限循环'],
      explanation: '循环条件 1 恒为真（非 0 即真），条件永远成立，构成死循环。除非循环体内用 break 跳出。',
    },
    {
      id: 17,
      type: 'trueFalse',
      stem: 'break 语句可以立即跳出当前所在的循环。',
      answer: 'A',
      score: 2,
      tags: ['循环', 'break'],
      explanation: 'break 用于结束当前循环（或 switch），程序继续执行循环后面的语句。',
    },
    {
      id: 18,
      type: 'trueFalse',
      stem: '1 GB 等于 1024 MB。',
      answer: 'A',
      score: 2,
      tags: ['存储单位'],
      explanation: '计算机存储单位按 1024 进位：1KB=1024B，1MB=1024KB，1GB=1024MB。',
    },
    {
      id: 19,
      type: 'trueFalse',
      stem: '浮点数 0.1 + 0.2 在计算机中可能无法精确等于 0.3。',
      answer: 'A',
      score: 2,
      tags: ['浮点精度'],
      explanation: '二进制无法精确表示所有十进制小数，浮点运算存在精度误差。比较浮点数应使用差值小于极小值（如 1e-9）的方式。',
    },
    {
      id: 20,
      type: 'trueFalse',
      stem: 'bool 类型的变量只能存储 true 或 false 两个值。',
      answer: 'A',
      score: 2,
      tags: ['数据类型', 'bool'],
      explanation: 'bool 是布尔类型，只有 true（真）和 false（假）两个取值，常用于条件判断。',
    },
  ],
  programming: [
    {
      id: 21,
      type: 'programming',
      stem: '【闰年判断】输入一个年份 y，判断它是否为闰年并输出。闰年规则：能被 4 整除但不能被 100 整除，或者能被 400 整除。是闰年输出 Yes，否则输出 No。',
      inputFormat: '一个整数 y',
      outputFormat: 'Yes 或 No',
      sampleInput: '2000',
      sampleOutput: 'Yes',
      testCases: [
        { input: '2000', output: 'Yes' },
        { input: '1900', output: 'No' },
        { input: '2024', output: 'Yes' },
        { input: '2023', output: 'No' },
        { input: '400', output: 'Yes' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int y;
    cin >> y;
    if((y % 4 == 0 && y % 100 != 0) || y % 400 == 0)
        cout << "Yes" << endl;
    else
        cout << "No" << endl;
    return 0;
}`,
      score: 20,
      tags: ['分支结构', '逻辑运算', '取模'],
      explanation: '考点：if 多条件判断、逻辑运算、取模。易错点：① 闰年条件要两个"或"分支：能被4整除且不能被100整除，或能被400整除；② 整除用 % 判断余数为 0。',
    },
    {
      id: 22,
      type: 'programming',
      stem: '【最大值与最小值】输入 N 个整数，找出其中的最大值和最小值并输出。',
      inputFormat: '第一行：一个整数 N\n第二行：N 个整数（用空格隔开）',
      outputFormat: '最大值和最小值，用空格隔开',
      sampleInput: '5\n3 9 1 7 5',
      sampleOutput: '9 1',
      testCases: [
        { input: '5\n3 9 1 7 5', output: '9 1' },
        { input: '1\n42', output: '42 42' },
        { input: '4\n-5 -2 -8 -1', output: '-1 -8' },
        { input: '3\n100 0 50', output: '100 0' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n, x, mx, mn;
    cin >> n;
    cin >> mx;   // 先读入第 1 个数作为初始值
    mn = mx;
    for(int i = 2; i <= n; i++) {
        cin >> x;
        if(x > mx) mx = x;   // 打擂台：更新最大值
        if(x < mn) mn = x;   // 打擂台：更新最小值
    }
    cout << mx << " " << mn << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环', '分支', '打擂台', '求最值'],
      explanation: '考点：循环输入、if 比较、"打擂台"思想。易错点：① 最大值/最小值要先初始化为第一个数，不能随便初始化为 0；② 每读一个数就分别和当前最大值、最小值比较更新。',
    },
  ],
};

// ============================================================
// C/C++ 一级 · 综合模拟卷（三）
// 侧重：运算符与优先级 / switch 多分支 / 自增自减 / do-while /
//       字符与ASCII / 逻辑运算 / 质数判断
// ============================================================
export const examMock3: Exam = {
  id: 'exam-mock-03-cpp1',
  name: 'C/C++一级·综合模拟卷三',
  category: 'mock',
  examDate: '2026-08',
  totalScore: 100,
  passingScore: 60,
  duration: 60, // 60分钟
  singleChoice: [
    {
      id: 1,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int a = 3;\ncout << a++ * 2;\ncout << a;',
      options: { A: '64', B: '46', C: '6 4', D: '62' },
      answer: 'A',
      score: 4,
      tags: ['自增运算', 'i++'],
      explanation: 'a++ 是"先使用后自增"：先取出 a 的值 3 参与计算 3×2=6 输出，随后 a 自增为 4，再输出 a，结果为 64。',
    },
    {
      id: 2,
      type: 'singleChoice',
      stem: 'C++ 表达式 2 + 3 * 4 % 5 的计算结果是？',
      options: { A: '2', B: '3', C: '4', D: '5' },
      answer: 'C',
      score: 4,
      tags: ['运算符优先级', '取模运算'],
      explanation: '先算乘法 3×4=12，再算取模 12%5=2，最后 2+2=4。注意 % 与 *、/ 优先级相同。',
    },
    {
      id: 3,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int x = 2;\nswitch(x) {\n    case 1: cout << "A";\n    case 2: cout << "B";\n    case 3: cout << "C";\n}',
      options: { A: 'BC', B: 'B', C: 'C', D: 'ABC' },
      answer: 'A',
      score: 4,
      tags: ['switch', '多分支', 'break'],
      explanation: 'x=2，从 case 2 开始执行，由于没有 break，会贯穿到 case 3，依次输出 B 和 C，结果为 BC。',
    },
    {
      id: 4,
      type: 'singleChoice',
      stem: '执行以下代码后，变量 x 的值是？',
      code: 'int x = 8;\nx /= 2;\nx += 4;',
      options: { A: '8', B: '4', C: '12', D: '10' },
      answer: 'A',
      score: 4,
      tags: ['复合赋值'],
      explanation: 'x /= 2 等价于 x = x / 2，x 变为 4；x += 4 等价于 x = x + 4，x 变为 8。',
    },
    {
      id: 5,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int i = 0;\ndo { i++; } while(i < 3);\ncout << i;',
      options: { A: '3', B: '2', C: '4', D: '1' },
      answer: 'A',
      score: 4,
      tags: ['循环', 'do-while'],
      explanation: 'do-while 先执行后判断：i 依次变为 1、2、3，当 i=3 时条件 i<3 为 false 退出，最终 i=3。',
    },
    {
      id: 6,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'char c = \'a\';\ncout << (char)(c - 32);',
      options: { A: 'A', B: 'a', C: '65', D: '97' },
      answer: 'A',
      score: 4,
      tags: ['字符类型', 'ASCII'],
      explanation: '小写 a 的 ASCII 是 97，97-32=65 即大写 A 的 ASCII，强转回 char 输出大写字母 A。',
    },
    {
      id: 7,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int a = 5, b = 0;\ncout << (a && b);',
      options: { A: '0', B: '1', C: '5', D: 'true' },
      answer: 'A',
      score: 4,
      tags: ['逻辑运算', '&&'],
      explanation: '&&（逻辑与）两边都为真才为真。a=5 为真，b=0 为假，真 && 假 = 假，输出 0。',
    },
    {
      id: 8,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int s = 0;\nfor(int i = 1; i <= 10; i++) {\n    if(i % 3 == 0) s += i;\n}\ncout << s;',
      options: { A: '18', B: '15', C: '33', D: '12' },
      answer: 'A',
      score: 4,
      tags: ['循环', '取模', '累加'],
      explanation: '把 1~10 中能被 3 整除的数（3、6、9）累加，s = 3 + 6 + 9 = 18。',
    },
    {
      id: 9,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int a = 5;\ndouble b = a / 2;\ncout << b;',
      options: { A: '2', B: '2.5', C: '2.0', D: '3' },
      answer: 'A',
      score: 4,
      tags: ['整数除法', '类型转换'],
      explanation: 'a/2 中两个操作数都是 int，结果是整数 2，赋给 double 后 b=2.0，输出为 2。',
    },
    {
      id: 10,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'cout << min(10, max(3, 7));',
      options: { A: '7', B: '10', C: '3', D: '4' },
      answer: 'A',
      score: 4,
      tags: ['数学函数', 'min', 'max'],
      explanation: '先算内层 max(3,7)=7，再算 min(10,7)=7。max 取较大值，min 取较小值。',
    },
  ],
  trueFalse: [
    {
      id: 11,
      type: 'trueFalse',
      stem: 'switch 语句的 case 分支可以没有 break 语句。',
      answer: 'A',
      score: 2,
      tags: ['switch', 'break'],
      explanation: 'case 分支末尾的 break 不是必需的，省略时会发生"贯穿"，继续执行下一个 case。是否省略取决于逻辑需要。',
    },
    {
      id: 12,
      type: 'trueFalse',
      stem: 'x++; 和 ++x; 单独作为一条语句时，执行效果完全一样。',
      answer: 'A',
      score: 2,
      tags: ['自增运算'],
      explanation: '单独成语句时，两者都只是让 x 加 1，区别只在"先使用还是先自增"，不参与其它计算时效果相同。',
    },
    {
      id: 13,
      type: 'trueFalse',
      stem: 'C++ 中 %（取模）运算符可以用于浮点数。',
      answer: 'B',
      score: 2,
      tags: ['取模运算'],
      explanation: '% 只能用于整数。对浮点数取模（如 5.5 % 2）是编译错误。',
    },
    {
      id: 14,
      type: 'trueFalse',
      stem: '逻辑运算符 ! 的优先级高于 &&。',
      answer: 'A',
      score: 2,
      tags: ['逻辑运算', '运算符优先级'],
      explanation: '优先级从高到低为：!（非）> &&（与）> ||（或）。',
    },
    {
      id: 15,
      type: 'trueFalse',
      stem: '字符 \'a\' 的 ASCII 码大于字符 \'A\' 的 ASCII 码。',
      answer: 'A',
      score: 2,
      tags: ['ASCII', '字符类型'],
      explanation: '小写 a 的 ASCII 是 97，大写 A 是 65，小写字母比对应大写字母大 32。',
    },
    {
      id: 16,
      type: 'trueFalse',
      stem: 'char c = 65; 和 char c = \'A\'; 的效果相同。',
      answer: 'A',
      score: 2,
      tags: ['ASCII', '字符类型'],
      explanation: '65 正好是字符 A 的 ASCII 码，把整数 65 赋给 char 变量等同于赋字符 A。',
    },
    {
      id: 17,
      type: 'trueFalse',
      stem: 'do-while 循环的循环体至少会执行一次。',
      answer: 'A',
      score: 2,
      tags: ['循环', 'do-while'],
      explanation: 'do-while 是"先执行后判断"，先执行循环体，再判断条件。即使条件一开始为 false，循环体也已执行过一次。',
    },
    {
      id: 18,
      type: 'trueFalse',
      stem: '表达式 5 / 2 的计算结果是 2.5。',
      answer: 'B',
      score: 2,
      tags: ['整数除法'],
      explanation: '两个 int 相除结果是 int，5/2=2（小数部分舍去），想得到 2.5 需写成 5.0/2。',
    },
    {
      id: 19,
      type: 'trueFalse',
      stem: '在 C++ 中，= 用于赋值，== 用于判断是否相等。',
      answer: 'A',
      score: 2,
      tags: ['赋值运算符', '关系运算'],
      explanation: '= 是赋值运算符，== 是关系（比较）运算符，两者功能完全不同，不能混用。',
    },
    {
      id: 20,
      type: 'trueFalse',
      stem: 'if 语句后面只能跟一条语句，不能跟多条语句。',
      answer: 'B',
      score: 2,
      tags: ['分支结构', 'if'],
      explanation: '用花括号 {} 把多条语句括起来组成复合语句，if 就可以控制多条语句。',
    },
  ],
  programming: [
    {
      id: 21,
      type: 'programming',
      stem: '【判断质数】输入一个正整数 n，判断它是否为质数。质数是指大于 1，且只能被 1 和它本身整除的数。如果是质数输出 Yes，否则输出 No。',
      inputFormat: '一个正整数 n',
      outputFormat: 'Yes 或 No',
      sampleInput: '7',
      sampleOutput: 'Yes',
      testCases: [
        { input: '7', output: 'Yes' },
        { input: '1', output: 'No' },
        { input: '4', output: 'No' },
        { input: '2', output: 'Yes' },
        { input: '97', output: 'Yes' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    if(n <= 1) { cout << "No" << endl; return 0; }
    for(int i = 2; i * i <= n; i++) {
        if(n % i == 0) { cout << "No" << endl; return 0; }
    }
    cout << "Yes" << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环', '分支', '取模', '质数'],
      explanation: '考点：for 循环、if 分支、取模判断整除。易错点：① 1 不是质数，要先单独判断；② 只要在 2 到 sqrt(n) 之间找到一个能整除的数，n 就不是质数，可以提前结束。',
    },
    {
      id: 22,
      type: 'programming',
      stem: '【阶乘求和】输入一个正整数 n，计算 1! + 2! + ... + n! 的值并输出。',
      inputFormat: '一个正整数 n',
      outputFormat: '一个整数，表示阶乘之和',
      sampleInput: '3',
      sampleOutput: '9',
      testCases: [
        { input: '3', output: '9' },
        { input: '1', output: '1' },
        { input: '5', output: '153' },
        { input: '0', output: '0' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long sum = 0, fac = 1;
    for(int i = 1; i <= n; i++) {
        fac *= i;   // fac 累乘得到 i!
        sum += fac; // sum 累加 i!
    }
    cout << sum << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环', '累乘', '累加'],
      explanation: '考点：循环、累乘、累加。易错点：① 用一个变量 fac 边乘边加，避免每项都重新从 1 累乘；② 阶乘增长很快，结果较大时用 long long 存储防止溢出。',
    },
  ],
};

// ============================================================
// C/C++ 一级 · 综合模拟卷（四）
// 侧重：进制转换 / 存储单位 / 嵌套循环 / break·continue /
//       数字位处理 / 水仙花数
// ============================================================
export const examMock4: Exam = {
  id: 'exam-mock-04-cpp1',
  name: 'C/C++一级·综合模拟卷四',
  category: 'mock',
  examDate: '2026-08',
  totalScore: 100,
  passingScore: 60,
  duration: 60, // 60分钟
  singleChoice: [
    {
      id: 1,
      type: 'singleChoice',
      stem: '二进制数 1101 转换为十进制后是？',
      options: { A: '13', B: '11', C: '12', D: '14' },
      answer: 'A',
      score: 4,
      tags: ['进制转换', '二进制'],
      explanation: '1101 = 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13。',
    },
    {
      id: 2,
      type: 'singleChoice',
      stem: '十进制数 8 转换为二进制后是？',
      options: { A: '1000', B: '111', C: '1010', D: '110' },
      answer: 'A',
      score: 4,
      tags: ['进制转换', '二进制'],
      explanation: '8 = 1×2³，二进制表示为 1000。',
    },
    {
      id: 3,
      type: 'singleChoice',
      stem: '1KB 等于多少字节？',
      options: { A: '1024', B: '1000', C: '512', D: '2048' },
      answer: 'A',
      score: 4,
      tags: ['存储单位'],
      explanation: '计算机存储单位按 1024 进位：1KB = 1024 字节（B）。',
    },
    {
      id: 4,
      type: 'singleChoice',
      stem: '执行以下嵌套循环，一共会输出多少个星号 *？',
      code: 'for(int i = 1; i <= 3; i++) {\n    for(int j = 1; j <= i; j++)\n        cout << "*";\n    cout << endl;\n}',
      options: { A: '6', B: '3', C: '9', D: '5' },
      answer: 'A',
      score: 4,
      tags: ['循环', '嵌套循环'],
      explanation: 'i=1 输出 1 个，i=2 输出 2 个，i=3 输出 3 个，总共 1+2+3=6 个星号。',
    },
    {
      id: 5,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'for(int i = 1; ; i++) {\n    if(i > 3) break;\n    cout << i;\n}',
      options: { A: '123', B: '1234', C: '12', D: '12345' },
      answer: 'A',
      score: 4,
      tags: ['循环', 'break'],
      explanation: 'i 从 1 开始递增，i≤3 时输出 i；i=4 时执行 break 跳出循环，所以输出 123。',
    },
    {
      id: 6,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'for(int i = 1; i <= 5; i++) {\n    if(i % 2 == 0) continue;\n    cout << i;\n}',
      options: { A: '135', B: '12345', C: '24', D: '13524' },
      answer: 'A',
      score: 4,
      tags: ['循环', 'continue'],
      explanation: 'continue 跳过偶数：i 为 1、3、5 时输出，i 为 2、4 时被跳过，结果为 135。',
    },
    {
      id: 7,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int n = 123;\ncout << n % 10;',
      options: { A: '3', B: '2', C: '1', D: '123' },
      answer: 'A',
      score: 4,
      tags: ['取模运算', '数字位'],
      explanation: '任何整数 % 10 得到的都是它的个位数，123 % 10 = 3。',
    },
    {
      id: 8,
      type: 'singleChoice',
      stem: 'C++ 表达式 1 + 2 * 3 - 4 / 2 的计算结果是？',
      options: { A: '5', B: '7', C: '3', D: '6' },
      answer: 'A',
      score: 4,
      tags: ['运算符优先级'],
      explanation: '先算乘除：2×3=6，4/2=2；再从左到右算加减：1+6-2=5。',
    },
    {
      id: 9,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'cout << (int)\'0\';',
      options: { A: '48', B: '0', C: '49', D: '32' },
      answer: 'A',
      score: 4,
      tags: ['ASCII', '类型转换'],
      explanation: '字符 0 的 ASCII 码是 48，(int) 把字符转为它的 ASCII 码值输出。',
    },
    {
      id: 10,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int x = 3;\ncout << (x > 2 && x < 5);',
      options: { A: '1', B: '0', C: 'true', D: '3' },
      answer: 'A',
      score: 4,
      tags: ['逻辑运算', '关系运算'],
      explanation: 'x=3，3>2 为真，3<5 为真，真 && 真 = 真，在 C++ 中真用 1 表示，输出 1。',
    },
  ],
  trueFalse: [
    {
      id: 11,
      type: 'trueFalse',
      stem: '二进制数中只使用 0 和 1 两个数字。',
      answer: 'A',
      score: 2,
      tags: ['二进制'],
      explanation: '二进制是逢二进一的计数系统，每一位只能是 0 或 1。',
    },
    {
      id: 12,
      type: 'trueFalse',
      stem: '1 MB 等于 1000 KB。',
      answer: 'B',
      score: 2,
      tags: ['存储单位'],
      explanation: '存储单位按 1024 进位，1MB = 1024KB，不是 1000。',
    },
    {
      id: 13,
      type: 'trueFalse',
      stem: '计算机内部的所有数据都是以二进制形式存储的。',
      answer: 'A',
      score: 2,
      tags: ['二进制'],
      explanation: '计算机只识别高低电平（0 和 1），所有数据最终都以二进制存储和处理。',
    },
    {
      id: 14,
      type: 'trueFalse',
      stem: 'break 和 continue 语句都可以用在循环中。',
      answer: 'A',
      score: 2,
      tags: ['循环', 'break', 'continue'],
      explanation: 'break 用于跳出整个循环，continue 用于跳过本次循环剩余语句，两者都常用在循环中。',
    },
    {
      id: 15,
      type: 'trueFalse',
      stem: 'C++ 允许一个 while 循环的循环体为空。',
      answer: 'A',
      score: 2,
      tags: ['循环', 'while'],
      explanation: '循环体可以为空语句。如 while(n--); 只靠判断和自减来消耗循环，语法上是合法的。',
    },
    {
      id: 16,
      type: 'trueFalse',
      stem: '十进制数 15 的二进制表示是 1110。',
      answer: 'B',
      score: 2,
      tags: ['进制转换'],
      explanation: '15 = 8+4+2+1 = 1×2³+1×2²+1×2¹+1×2⁰，二进制是 1111。1110 是十进制 14。',
    },
    {
      id: 17,
      type: 'trueFalse',
      stem: '表达式 5 % 2 的值是 1。',
      answer: 'A',
      score: 2,
      tags: ['取模运算'],
      explanation: '5 ÷ 2 = 2 余 1，% 取余数，所以 5 % 2 = 1。',
    },
    {
      id: 18,
      type: 'trueFalse',
      stem: '在嵌套循环中，内层循环执行完一遍后，外层循环才继续执行下一次。',
      answer: 'A',
      score: 2,
      tags: ['嵌套循环'],
      explanation: '嵌套循环先执行完内层循环的全部，再回到外层循环进行下一轮，外层循环体每执行一次，内层就完整执行一遍。',
    },
    {
      id: 19,
      type: 'trueFalse',
      stem: 'C++ 中 endl 和 \'\\n\' 都能实现换行。',
      answer: 'A',
      score: 2,
      tags: ['输入输出', '换行'],
      explanation: 'endl 和换行符 \\n 都能换行。区别是 endl 还会刷新输出缓冲区，\\n 不刷新。',
    },
    {
      id: 20,
      type: 'trueFalse',
      stem: '32 位系统中，int 类型通常占 4 个字节。',
      answer: 'A',
      score: 2,
      tags: ['数据类型', '存储'],
      explanation: '在大多数 32 位/64 位系统中，int 占 4 个字节（32 位），取值范围约 -21 亿 ~ 21 亿。',
    },
  ],
  programming: [
    {
      id: 21,
      type: 'programming',
      stem: '【水仙花数】输入一个三位数 n，判断它是否为水仙花数。水仙花数是指一个三位数，其各位数字的立方和等于它本身。是则输出 Yes，否则输出 No。',
      inputFormat: '一个三位整数 n',
      outputFormat: 'Yes 或 No',
      sampleInput: '153',
      sampleOutput: 'Yes',
      testCases: [
        { input: '153', output: 'Yes' },
        { input: '370', output: 'Yes' },
        { input: '100', output: 'No' },
        { input: '407', output: 'Yes' },
        { input: '123', output: 'No' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int a = n / 100;       // 百位
    int b = n / 10 % 10;   // 十位
    int c = n % 10;        // 个位
    if(a * a * a + b * b * b + c * c * c == n)
        cout << "Yes" << endl;
    else
        cout << "No" << endl;
    return 0;
}`,
      score: 20,
      tags: ['数字位', '分支结构', '循环'],
      explanation: '考点：数字各位的拆分（整除、取模）、if 分支判断。易错点：① 百位用 n/100、十位用 n/10%10、个位用 n%10；② 判断条件是各位立方和等于原数。',
    },
    {
      id: 22,
      type: 'programming',
      stem: '【数字反转】输入一个正整数 n，输出它倒过来的数字（去掉前导零）。例如 123 变成 321，120 变成 21。',
      inputFormat: '一个正整数 n',
      outputFormat: '反转后的整数',
      sampleInput: '123',
      sampleOutput: '321',
      testCases: [
        { input: '123', output: '321' },
        { input: '120', output: '21' },
        { input: '1000', output: '1' },
        { input: '5', output: '5' },
        { input: '908', output: '809' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int res = 0;
    while(n > 0) {
        res = res * 10 + n % 10; // 每次取个位拼到 res 后面
        n /= 10;                  // 去掉个位
    }
    cout << res << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环', '数字位', '取模'],
      explanation: '考点：while 循环、取模与整除拆分数字位。易错点：① 用 res = res*10 + n%10 逐位"倒着拼"，天然去掉前导零；② 循环结束条件是 n>0。',
    },
  ],
};

// ============================================================
// C/C++ 一级 · 综合模拟卷（五）
// 侧重：数据类型与转换 / 数学函数 / 计数统计 /
//       字符与ASCII / 最大公约数
// ============================================================
export const examMock5: Exam = {
  id: 'exam-mock-05-cpp1',
  name: 'C/C++一级·综合模拟卷五',
  category: 'mock',
  examDate: '2026-08',
  totalScore: 100,
  passingScore: 60,
  duration: 60, // 60分钟
  singleChoice: [
    {
      id: 1,
      type: 'singleChoice',
      stem: '执行以下代码后，变量 a 的值是？',
      code: 'int a = 3.99;',
      options: { A: '3', B: '4', C: '3.99', D: '编译报错' },
      answer: 'A',
      score: 4,
      tags: ['类型转换', '整型截断'],
      explanation: '把 3.99 赋给 int 变量时小数部分直接截断（不是四舍五入），a = 3。',
    },
    {
      id: 2,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'double d = 1 / 2;\ncout << d;',
      options: { A: '0', B: '0.5', C: '1', D: '0.0' },
      answer: 'A',
      score: 4,
      tags: ['整数除法', '类型转换'],
      explanation: '1/2 两个操作数都是 int，结果是整数 0，赋给 double 后 d=0.0，输出为 0。想得到 0.5 需写 1.0/2。',
    },
    {
      id: 3,
      type: 'singleChoice',
      stem: 'C++ 表达式 5 % 3 + 2 * 2 的计算结果是？',
      options: { A: '6', B: '7', C: '4', D: '5' },
      answer: 'A',
      score: 4,
      tags: ['运算符优先级', '取模运算'],
      explanation: '先算 5%3=2 和 2×2=4，再算 2+4=6。',
    },
    {
      id: 4,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'cout << pow(2, 4);',
      options: { A: '16', B: '8', C: '4', D: '32' },
      answer: 'A',
      score: 4,
      tags: ['数学函数', 'pow'],
      explanation: 'pow(x, y) 计算 x 的 y 次方，pow(2,4)=2⁴=16。',
    },
    {
      id: 5,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'cout << abs(-3) + sqrt(9);',
      options: { A: '6', B: '0', C: '9', D: '3' },
      answer: 'A',
      score: 4,
      tags: ['数学函数', 'abs', 'sqrt'],
      explanation: 'abs(-3)=3（绝对值），sqrt(9)=3（平方根），3+3=6。',
    },
    {
      id: 6,
      type: 'singleChoice',
      stem: '执行以下代码后，变量 ch 的值是？',
      code: 'char ch = \'A\' + 3;',
      options: { A: 'D', B: 'C', C: 'E', D: 'a' },
      answer: 'A',
      score: 4,
      tags: ['字符类型', 'ASCII'],
      explanation: 'A 的 ASCII 是 65，65+3=68 即字符 D 的 ASCII，所以 ch = \'D\'。',
    },
    {
      id: 7,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int a = 10, b = 3;\ncout << a % b;',
      options: { A: '1', B: '3', C: '0', D: '10' },
      answer: 'A',
      score: 4,
      tags: ['取模运算'],
      explanation: '10 ÷ 3 = 3 余 1，% 取余数，所以 10 % 3 = 1。',
    },
    {
      id: 8,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int c = 0;\nfor(int i = 1; i <= 10; i++)\n    if(i % 2 == 0) c++;\ncout << c;',
      options: { A: '5', B: '4', C: '6', D: '10' },
      answer: 'A',
      score: 4,
      tags: ['循环', '计数'],
      explanation: '统计 1~10 中偶数的个数：2、4、6、8、10 共 5 个，所以 c=5。',
    },
    {
      id: 9,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'bool b = (3 > 5);\ncout << b;',
      options: { A: '0', B: '1', C: 'true', D: 'false' },
      answer: 'A',
      score: 4,
      tags: ['逻辑运算', 'bool'],
      explanation: '3>5 为假，b=false，输出 bool 变量时假用 0 表示，输出 0。',
    },
    {
      id: 10,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int x = 4;\ncout << x / 2.0;',
      options: { A: '2', B: '2.0', C: '2.5', D: '0.5' },
      answer: 'A',
      score: 4,
      tags: ['类型转换', '浮点除法'],
      explanation: '2.0 是 double，x/2.0 = 2.0（浮点除法）。cout 输出 2.0 时显示为 2。',
    },
  ],
  trueFalse: [
    {
      id: 11,
      type: 'trueFalse',
      stem: 'double 类型能表示的整数范围比 int 更大。',
      answer: 'A',
      score: 2,
      tags: ['数据类型', 'double'],
      explanation: 'double 是双精度浮点型，能表示的数值范围远大于 int（约 ±1.8×10³⁰⁸）。',
    },
    {
      id: 12,
      type: 'trueFalse',
      stem: '将 char 类型变量赋值给 int 类型变量是合法的。',
      answer: 'A',
      score: 2,
      tags: ['类型转换'],
      explanation: 'char 可以隐式转换为 int，赋给 int 变量后得到的是该字符的 ASCII 码。',
    },
    {
      id: 13,
      type: 'trueFalse',
      stem: '3 / 0 在 C++ 中会导致运行错误。',
      answer: 'A',
      score: 2,
      tags: ['除零', '运行错误'],
      explanation: '除数是 0 属于未定义行为，通常导致程序异常崩溃。',
    },
    {
      id: 14,
      type: 'trueFalse',
      stem: 'sqrt(-1) 的返回值是 0。',
      answer: 'B',
      score: 2,
      tags: ['数学函数', 'sqrt'],
      explanation: '对负数开平方是域错误，sqrt(-1) 返回 NaN（非数值），而不是 0。',
    },
    {
      id: 15,
      type: 'trueFalse',
      stem: 'abs() 和 fabs() 都可以用来求绝对值。',
      answer: 'A',
      score: 2,
      tags: ['数学函数', 'abs', 'fabs'],
      explanation: 'abs 用于整数求绝对值，fabs 用于浮点数求绝对值，都能得到绝对值。',
    },
    {
      id: 16,
      type: 'trueFalse',
      stem: '在运算中，bool 类型的 true 相当于 1，false 相当于 0。',
      answer: 'A',
      score: 2,
      tags: ['数据类型', 'bool'],
      explanation: 'bool 参与数值运算时会转换为整数：true=1，false=0。',
    },
    {
      id: 17,
      type: 'trueFalse',
      stem: 'double 是单精度浮点型。',
      answer: 'B',
      score: 2,
      tags: ['数据类型'],
      explanation: 'float 才是单精度浮点型（4 字节），double 是双精度浮点型（8 字节）。',
    },
    {
      id: 18,
      type: 'trueFalse',
      stem: 'C++ 中字符常量用单引号，字符串常量用双引号。',
      answer: 'A',
      score: 2,
      tags: ['数据类型', '字符', '字符串'],
      explanation: '字符用单引号（如 \'A\'），字符串用双引号（如 "hello"）。',
    },
    {
      id: 19,
      type: 'trueFalse',
      stem: 'cout << (int)3.99; 的输出结果是 3。',
      answer: 'A',
      score: 2,
      tags: ['类型转换', '强制转换'],
      explanation: '(int) 强制类型转换会截断小数部分，3.99 转为 3。',
    },
    {
      id: 20,
      type: 'trueFalse',
      stem: '使用 pow、sqrt、abs 等数学函数需要包含 <cmath> 头文件。',
      answer: 'A',
      score: 2,
      tags: ['数学函数', '头文件'],
      explanation: '这些数学函数声明在 <cmath> 中，使用时需要 #include <cmath>。',
    },
  ],
  programming: [
    {
      id: 21,
      type: 'programming',
      stem: '【最大公约数】输入两个正整数 a 和 b，求它们的最大公约数（GCD）并输出。',
      inputFormat: '两个正整数 a 和 b（用空格隔开）',
      outputFormat: '一个整数，表示最大公约数',
      sampleInput: '12 18',
      sampleOutput: '6',
      testCases: [
        { input: '12 18', output: '6' },
        { input: '8 12', output: '4' },
        { input: '7 13', output: '1' },
        { input: '100 100', output: '100' },
        { input: '15 20', output: '5' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    while(b != 0) {
        int t = a % b; // 辗转相除：求余数
        a = b;
        b = t;
    }
    cout << a << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环', '辗转相除法', '最大公约数'],
      explanation: '考点：while 循环、取模、辗转相除法。易错点：① 辗转相除的核心是"不断用除数当被除数、余数当除数"；② 当余数为 0 时，此时的被除数就是最大公约数。',
    },
    {
      id: 22,
      type: 'programming',
      stem: '【求和与平均值】输入 n 个整数，输出它们的和与平均值（平均值保留两位小数），两者用空格隔开。',
      inputFormat: '第一行：一个整数 n\n第二行：n 个整数（用空格隔开）',
      outputFormat: '和 与 平均值，用空格隔开，平均值保留两位小数',
      sampleInput: '3\n1 2 3',
      sampleOutput: '6 2.00',
      testCases: [
        { input: '3\n1 2 3', output: '6 2.00' },
        { input: '1\n5', output: '5 5.00' },
        { input: '4\n10 20 30 40', output: '100 25.00' },
      ],
      referenceCode: `#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int n, x, sum = 0;
    cin >> n;
    for(int i = 1; i <= n; i++) {
        cin >> x;
        sum += x;
    }
    cout << sum << " " << fixed << setprecision(2) << (double)sum / n << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环', '累加', '格式化输出'],
      explanation: '考点：循环累加、求平均值、保留两位小数。易错点：① 平均值要用 (double)sum/n 转为浮点再除，否则整数相除会丢小数；② 保留两位小数需要 fixed << setprecision(2)，需包含 <iomanip>。',
    },
  ],
};

// ============================================================
// C/C++ 一级 · 综合模拟卷（六）
// 侧重：全考点综合冲刺（程序结构 / 变量交换 / 三目运算 /
//       斐波那契 / 奇偶统计）
// ============================================================
export const examMock6: Exam = {
  id: 'exam-mock-06-cpp1',
  name: 'C/C++一级·综合模拟卷六',
  category: 'mock',
  examDate: '2026-08',
  totalScore: 100,
  passingScore: 60,
  duration: 60, // 60分钟
  singleChoice: [
    {
      id: 1,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int a = 2, b = 3;\ncout << a * b + a;',
      options: { A: '8', B: '9', C: '6', D: '11' },
      answer: 'A',
      score: 4,
      tags: ['运算', '运算符优先级'],
      explanation: '先算乘法 2×3=6，再算加法 6+2=8。',
    },
    {
      id: 2,
      type: 'singleChoice',
      stem: '执行以下代码后，变量 x 的值是？',
      code: 'int x = 1, y = 2;\nint t = x;\nx = y;\ny = t;',
      options: { A: '2', B: '1', C: '0', D: '3' },
      answer: 'A',
      score: 4,
      tags: ['变量交换', '顺序结构'],
      explanation: '经典三变量交换：t 暂存 x(1)，x 被赋为 y(2)，y 被赋为 t(1)，最终 x=2。',
    },
    {
      id: 3,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'cout << 20 / 6;',
      options: { A: '3', B: '4', C: '3.33', D: '2' },
      answer: 'A',
      score: 4,
      tags: ['整数除法'],
      explanation: '两个 int 相除结果取商：20/6=3（余 2），小数部分舍去。',
    },
    {
      id: 4,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int i = 1, s = 0;\nwhile(i <= 4) {\n    s += i * i;\n    i++;\n}\ncout << s;',
      options: { A: '30', B: '10', C: '55', D: '16' },
      answer: 'A',
      score: 4,
      tags: ['循环', '累加'],
      explanation: 's 累加 1²+2²+3²+4² = 1+4+9+16 = 30。',
    },
    {
      id: 5,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int a = 7;\ncout << (a > 5 && a < 10);',
      options: { A: '1', B: '0', C: '7', D: 'true' },
      answer: 'A',
      score: 4,
      tags: ['逻辑运算', '关系运算'],
      explanation: '7>5 为真，7<10 为真，真 && 真 = 真，输出 1。',
    },
    {
      id: 6,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'cout << 100 % 7;',
      options: { A: '2', B: '3', C: '1', D: '14' },
      answer: 'A',
      score: 4,
      tags: ['取模运算'],
      explanation: '100 ÷ 7 = 14 余 2，% 取余数，所以 100 % 7 = 2。',
    },
    {
      id: 7,
      type: 'singleChoice',
      stem: '执行以下嵌套循环后，变量 c 的值是？',
      code: 'int c = 0;\nfor(int i = 1; i <= 4; i++)\n    for(int j = 1; j <= 4; j++)\n        c++;\ncout << c;',
      options: { A: '16', B: '8', C: '4', D: '32' },
      answer: 'A',
      score: 4,
      tags: ['循环', '嵌套循环'],
      explanation: '外层 4 次，内层每次 4 次，总次数 = 4 × 4 = 16。',
    },
    {
      id: 8,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'char ch = \'B\';\ncout << (int)ch;',
      options: { A: '66', B: 'B', C: '65', D: '98' },
      answer: 'A',
      score: 4,
      tags: ['ASCII', '类型转换'],
      explanation: '大写 B 的 ASCII 码是 66，(int) 把字符转为 ASCII 码值输出。',
    },
    {
      id: 9,
      type: 'singleChoice',
      stem: '执行以下代码，输出结果是？',
      code: 'int n = 3;\ncout << (n % 2 == 1 ? "奇" : "偶");',
      options: { A: '奇', B: '偶', C: '1', D: '0' },
      answer: 'A',
      score: 4,
      tags: ['三目运算', '取模'],
      explanation: '三目运算符 条件?值1:值2：3%2=1，条件成立，输出"奇"。',
    },
    {
      id: 10,
      type: 'singleChoice',
      stem: 'C++ 表达式 2 + 2 * 2 - 2 / 2 的计算结果是？',
      options: { A: '5', B: '6', C: '4', D: '7' },
      answer: 'A',
      score: 4,
      tags: ['运算符优先级'],
      explanation: '先算乘除：2×2=4，2/2=1；再从左到右算加减：2+4-1=5。',
    },
  ],
  trueFalse: [
    {
      id: 11,
      type: 'trueFalse',
      stem: '一个完整的 C++ 程序必须包含 main 函数。',
      answer: 'A',
      score: 2,
      tags: ['main函数', '程序结构'],
      explanation: 'main 是程序入口，一个可执行程序必须有且只有一个 main 函数。',
    },
    {
      id: 12,
      type: 'trueFalse',
      stem: 'C++ 中的变量可以不声明就直接使用。',
      answer: 'B',
      score: 2,
      tags: ['变量定义'],
      explanation: '变量必须先声明（定义）再使用，否则编译器报"未声明标识符"错误。',
    },
    {
      id: 13,
      type: 'trueFalse',
      stem: 'a = a + 1; 和 a++; 的效果相同。',
      answer: 'A',
      score: 2,
      tags: ['自增运算', '赋值'],
      explanation: '两者都是让 a 的值加 1，效果相同。',
    },
    {
      id: 14,
      type: 'trueFalse',
      stem: 'for(;;) 是无限循环。',
      answer: 'A',
      score: 2,
      tags: ['循环', '无限循环'],
      explanation: 'for 三个部分都省略时，循环条件视为恒真，构成死循环，除非循环体内用 break 跳出。',
    },
    {
      id: 15,
      type: 'trueFalse',
      stem: '一个源文件中可以包含多条 #include 语句。',
      answer: 'A',
      score: 2,
      tags: ['预处理', '头文件'],
      explanation: '可以根据需要包含多个头文件，如同时 #include <iostream> 和 #include <cmath>。',
    },
    {
      id: 16,
      type: 'trueFalse',
      stem: 'C++ 是区分大小写的语言。',
      answer: 'A',
      score: 2,
      tags: ['程序结构'],
      explanation: 'C++ 区分大小写，例如变量 a 和 A 是两个不同的标识符，main 写成 Main 会出错。',
    },
    {
      id: 17,
      type: 'trueFalse',
      stem: 'cout << 3 + 4 * 2; 的输出结果是 14。',
      answer: 'B',
      score: 2,
      tags: ['运算符优先级'],
      explanation: '先算乘法 4×2=8，再算 3+8=11，不是 14。',
    },
    {
      id: 18,
      type: 'trueFalse',
      stem: 'for(int i = 0; i < 5; i++){...} 循环结束后，i 仍可以在循环外继续使用。',
      answer: 'B',
      score: 2,
      tags: ['循环', '作用域'],
      explanation: '在 for 的括号里定义的 i 作用域仅在循环内，循环结束后 i 已被销毁，循环外不能使用。',
    },
    {
      id: 19,
      type: 'trueFalse',
      stem: 'C++ 中 1.5 默认是 double 类型。',
      answer: 'A',
      score: 2,
      tags: ['数据类型'],
      explanation: 'C++ 中浮点字面量默认是 double 类型；要表示 float 需写成 1.5f。',
    },
    {
      id: 20,
      type: 'trueFalse',
      stem: '程序中的注释会影响程序的运行结果。',
      answer: 'B',
      score: 2,
      tags: ['注释'],
      explanation: '注释是给人看的说明，编译时会被忽略，不影响运行结果。',
    },
  ],
  programming: [
    {
      id: 21,
      type: 'programming',
      stem: '【斐波那契数列】斐波那契数列：1, 1, 2, 3, 5, 8, ...，前两项为 1，从第三项起每项等于前两项之和。输入 n，输出第 n 项的值。',
      inputFormat: '一个正整数 n',
      outputFormat: '一个整数，表示斐波那契数列第 n 项',
      sampleInput: '10',
      sampleOutput: '55',
      testCases: [
        { input: '1', output: '1' },
        { input: '2', output: '1' },
        { input: '3', output: '2' },
        { input: '10', output: '55' },
        { input: '20', output: '6765' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    if(n == 1 || n == 2) { cout << 1 << endl; return 0; }
    int a = 1, b = 1, c;
    for(int i = 3; i <= n; i++) {
        c = a + b; // 当前项 = 前两项之和
        a = b;     // 前一项前移
        b = c;     // 当前项前移
    }
    cout << b << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环', '斐波那契', '递推'],
      explanation: '考点：循环、递推思想。易错点：① 前两项要单独处理；② 用两个变量滚动更新（a、b 分别表示前两项），避免数组。',
    },
    {
      id: 22,
      type: 'programming',
      stem: '【奇偶统计】输入 n 个整数，统计其中奇数的个数和偶数的个数，用空格隔开输出。',
      inputFormat: '第一行：一个整数 n\n第二行：n 个整数（用空格隔开）',
      outputFormat: '两个整数：奇数的个数 和 偶数的个数，用空格隔开',
      sampleInput: '5\n1 2 3 4 5',
      sampleOutput: '3 2',
      testCases: [
        { input: '5\n1 2 3 4 5', output: '3 2' },
        { input: '1\n2', output: '0 1' },
        { input: '4\n1 3 5 7', output: '4 0' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n, x;
    cin >> n;
    int odd = 0, even = 0;
    for(int i = 1; i <= n; i++) {
        cin >> x;
        if(x % 2 == 0) even++; // 偶数
        else odd++;            // 奇数
    }
    cout << odd << " " << even << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环', '分支', '取模', '计数'],
      explanation: '考点：循环输入、if 分支、取模判断奇偶、计数。易错点：① 用 x%2==0 判断偶数；② 两个计数变量要先初始化为 0。',
    },
  ],
};

// 所有模拟卷列表
export const mockExams: Exam[] = [examMock1, examMock2, examMock3, examMock4, examMock5, examMock6];
