import type { Exam } from '../types/exam';

// ============================================================
// C/C++ 一级 · 综合模拟卷（一）
// 侧重：基础巩固全覆盖（程序结构 / 编译 / 注释 / 变量类型 /
//       输入输出 / 算术运算 / 分支 / 循环 / 数学函数 / 简单算法）
// ============================================================
export const examMock1: Exam = {
  id: 'exam-mock-01-cpp1',
  name: 'C/C++一级·综合模拟卷一',
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

// 所有模拟卷列表
export const mockExams: Exam[] = [examMock1, examMock2];
