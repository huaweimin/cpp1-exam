import type { Exam } from '../types/exam';

// ============================================================
// C/C++ 一级 · 编程专项模拟卷（每卷 5 道编程题）
// 题目来源：Liuser's OJ「青少年软件编程（C语言）等级一级考试试题」题单
//          https://tctm.cpolar.cn/training/18
// 组卷原则：每卷 5 题，按难度从易到难递进排列
//          卷一 = 基础过关（顺序结构 → 格式化输出 → 分支入门）
//          卷二 = 能力提升（多分支 → 单层循环 → 循环嵌套分支 → 多重循环）
// 每题 20 分，满分 100 分，及格 60 分；按测试点通过比例给分
// ============================================================

// ============================================================
// 编程专项模拟卷（一）· 基础过关
// 难度梯度：★ → ★★ → ★★ → ★★★ → ★★★
// 覆盖考点：程序框架 / cin 输入 / 顺序结构 / double 与格式化输出 / if-else 分支
// ============================================================
export const progMock1: Exam = {
  id: 'exam-prog-mock-01-cpp1',
  name: 'C/C++一级·编程专项模拟卷一（基础过关）',
  category: 'mock',
  examDate: '2026-09',
  totalScore: 100,
  passingScore: 60,
  duration: 90, // 5 道编程题，建议 90 分钟
  singleChoice: [],
  trueFalse: [],
  programming: [
    {
      id: 9001,
      type: 'programming',
      stem: '参加考试的宝宝们都是小程序员啦！请你编写一个程序，直接在屏幕上输出“我是小小程序员”这句话的汉语拼音。',
      inputFormat: '本题没有输入。',
      outputFormat: '在一行中输出 wo shi xiao xiao cheng xu yuan',
      sampleInput: '（无输入）',
      sampleOutput: 'wo shi xiao xiao cheng xu yuan',
      testCases: [
        { input: '', output: 'wo shi xiao xiao cheng xu yuan' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    cout << "wo shi xiao xiao cheng xu yuan" << endl;
    return 0;
}`,
      score: 20,
      tags: ['顺序结构', 'cout输出', '程序入口'],
      explanation: '考点：C++ 程序的基本框架和 cout 输出。这是最基础的题，只需要一个 main 函数 + 一条 cout 语句。注意拼音之间用空格隔开，全部小写，最后不要多输出内容。',
    },
    {
      id: 9002,
      type: 'programming',
      stem: '输入一个整数 x，输出这个整数加 1 后的值，即 x + 1 的值。',
      inputFormat: '一个整数 x（0 ≤ x ≤ 1000）。',
      outputFormat: '一个整数，即 x + 1 的结果。',
      sampleInput: '9',
      sampleOutput: '10',
      testCases: [
        { input: '9', output: '10' },
        { input: '0', output: '1' },
        { input: '1000', output: '1001' },
        { input: '99', output: '100' },
        { input: '1', output: '2' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int x;
    cin >> x;
    cout << x + 1 << endl;
    return 0;
}`,
      score: 20,
      tags: ['顺序结构', 'cin输入', '算术运算'],
      explanation: '考点：cin 读入一个整数、做加法、cout 输出结果。这是"输入—处理—输出"三步走的最基础模型，务必记牢这个套路。',
    },
    {
      id: 9003,
      type: 'programming',
      stem: '给出一个长方形的长和宽，求该长方形的面积。假设长为 a，宽为 b，则面积 S = a × b。',
      inputFormat: '一行，两个正整数 a 和 b，以空格分隔，分别表示长方形的长和宽。长和宽都不大于 1000。',
      outputFormat: '一个整数，即长方形的面积。',
      sampleInput: '4 3',
      sampleOutput: '12',
      testCases: [
        { input: '4 3', output: '12' },
        { input: '1 1', output: '1' },
        { input: '10 5', output: '50' },
        { input: '100 100', output: '10000' },
        { input: '7 8', output: '56' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a * b << endl;
    return 0;
}`,
      score: 20,
      tags: ['顺序结构', '多变量输入', '乘法'],
      explanation: '考点：一次读入多个数据（cin >> a >> b 可以连续读）。注意结果是整数，直接用 int 计算即可；a 和 b 最大 1000，乘积最大 1000000，int 完全装得下。',
    },
    {
      id: 9004,
      type: 'programming',
      stem: '输入一个摄氏温度值 C，将其转换为华氏温度 F 并输出，转换公式为：F = C × 9 ÷ 5 + 32。',
      inputFormat: '一行，一个小数，表示摄氏温度 C。',
      outputFormat: '一行，输出转换后的华氏温度，保留两位小数。',
      sampleInput: '0.00',
      sampleOutput: '32.00',
      testCases: [
        { input: '0.00', output: '32.00' },
        { input: '100.00', output: '212.00' },
        { input: '37.00', output: '98.60' },
        { input: '-40.00', output: '-40.00' },
        { input: '36.50', output: '97.70' },
        { input: '25.50', output: '77.90' },
      ],
      referenceCode: `#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double c;
    cin >> c;
    double f = c * 9 / 5 + 32;
    cout << fixed << setprecision(2) << f << endl;
    return 0;
}`,
      score: 20,
      tags: ['浮点数', '格式化输出', 'setprecision'],
      explanation: '考点：double 类型 + 保留两位小数。三个易错点：① 温度可能是小数，必须用 double 存，不能用 int；② 公式里 9 / 5 如果两边都写成整数会变成整除得 1，要写成 9.0 / 5 或者 c * 9 / 5（c 是 double 时会自动转成浮点运算）；③ 保留两位小数要写 fixed << setprecision(2)，并且加头文件 #include <iomanip>。',
    },
    {
      id: 9005,
      type: 'programming',
      stem: '给定一门课的考试分数，如果分数大于等于 60，则该门课成绩合格，记为 "P"，否则成绩不合格，记为 "F"。',
      inputFormat: '一个整数 s，表示这门课的分数（0 ≤ s ≤ 100）。',
      outputFormat: '如果成绩合格，输出字母 P，否则输出字母 F。',
      sampleInput: '59',
      sampleOutput: 'F',
      testCases: [
        { input: '59', output: 'F' },
        { input: '60', output: 'P' },
        { input: '100', output: 'P' },
        { input: '0', output: 'F' },
        { input: '85', output: 'P' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int s;
    cin >> s;
    if (s >= 60) {
        cout << "P" << endl;
    } else {
        cout << "F" << endl;
    }
    return 0;
}`,
      score: 20,
      tags: ['分支结构', 'if-else', '关系运算'],
      explanation: '考点：if-else 双分支。注意临界值：题目说"大于等于 60"合格，所以 60 分要输出 P，判断条件写 s >= 60，不能漏掉等号。这是考试最常见的扣分点。',
    },
  ],
};

// ============================================================
// 编程专项模拟卷（二）· 能力提升
// 难度梯度：★★★ → ★★★ → ★★★★ → ★★★★ → ★★★★★
// 覆盖考点：else-if 多分支链 / for 循环累加 / 循环嵌套分支计数 / 数位分离 / 多重循环模拟
// ============================================================
export const progMock2: Exam = {
  id: 'exam-prog-mock-02-cpp1',
  name: 'C/C++一级·编程专项模拟卷二（能力提升）',
  category: 'mock',
  examDate: '2026-09',
  totalScore: 100,
  passingScore: 60,
  duration: 90, // 5 道编程题，建议 90 分钟
  singleChoice: [],
  trueFalse: [],
  programming: [
    {
      id: 9011,
      type: 'programming',
      stem: '小明想将自己的百分制成绩转换为等级制，请你帮他完成这样的转换。转换规则为：\n\nA：90 ~ 100\nB：77 ~ 89\nC：67 ~ 76\nD：60 ~ 66\nE：0 ~ 59',
      inputFormat: '一个 0 ~ 100 的整数。',
      outputFormat: '输出转换后的等级，一个 A ~ E 的大写字母。',
      sampleInput: '85',
      sampleOutput: 'B',
      testCases: [
        { input: '85', output: 'B' },
        { input: '62', output: 'D' },
        { input: '100', output: 'A' },
        { input: '90', output: 'A' },
        { input: '89', output: 'B' },
        { input: '77', output: 'B' },
        { input: '76', output: 'C' },
        { input: '67', output: 'C' },
        { input: '66', output: 'D' },
        { input: '60', output: 'D' },
        { input: '59', output: 'E' },
        { input: '0', output: 'E' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int s;
    cin >> s;
    if (s >= 90) {
        cout << "A" << endl;
    } else if (s >= 77) {
        cout << "B" << endl;
    } else if (s >= 67) {
        cout << "C" << endl;
    } else if (s >= 60) {
        cout << "D" << endl;
    } else {
        cout << "E" << endl;
    }
    return 0;
}`,
      score: 20,
      tags: ['分支结构', '多分支', 'else-if链'],
      explanation: '考点：else-if 多分支链。技巧是从高分往低分依次判断，这样每个分支只需要写一个下界条件（比如 s >= 77 就已经隐含了 s < 90，因为 90 以上的在前面被拦下了）。边界要反复检查：89 是 B、76 是 C、66 是 D、59 是 E。',
    },
    {
      id: 9012,
      type: 'programming',
      stem: '给定一个正整数 k，求 1 到 k 的立方和 m，即 m = 1³ + 2³ + 3³ + … + k³。',
      inputFormat: '一行，包含 1 个整数 k。',
      outputFormat: '一行，即 1 到 k 的立方和。',
      sampleInput: '5',
      sampleOutput: '225',
      testCases: [
        { input: '5', output: '225' },
        { input: '1', output: '1' },
        { input: '10', output: '3025' },
        { input: '3', output: '36' },
        { input: '100', output: '25502500' },
        { input: '2', output: '9' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int k;
    cin >> k;
    long long sum = 0;
    for (int i = 1; i <= k; i++) {
        sum += (long long)i * i * i;
    }
    cout << sum << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环结构', 'for循环', '累加器'],
      explanation: '考点：for 循环 + 累加器。三步：① 定义累加变量 sum 并初始化为 0（这一步最容易忘，不初始化结果会是乱码）；② 循环变量 i 从 1 走到 k；③ 每次把 i*i*i 加到 sum 上。注意 i*i*i 要用 1LL * i * i * i 或先转 long long，避免数据大时溢出。',
    },
    {
      id: 9013,
      type: 'programming',
      stem: '给定 N 个正整数，请统计其中奇数和偶数各有多少个？',
      inputFormat: '第一行：一个正整数 N（N ≤ 1000）；\n第二行：N 个非负整数，以空格分隔。',
      outputFormat: '一行，先后输出奇数的个数、偶数的个数，中间以 1 个空格分隔。',
      sampleInput: '9\n88 74 101 26 15 0 34 22 77',
      sampleOutput: '3 6',
      testCases: [
        { input: '9\n88 74 101 26 15 0 34 22 77', output: '3 6' },
        { input: '1\n0', output: '0 1' },
        { input: '1\n7', output: '1 0' },
        { input: '5\n1 2 3 4 5', output: '3 2' },
        { input: '3\n0 0 0', output: '0 3' },
        { input: '4\n2 4 6 8', output: '0 4' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int odd = 0, even = 0;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        if (x % 2 == 1) {
            odd++;
        } else {
            even++;
        }
    }
    cout << odd << " " << even << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环结构', '分支嵌套', '计数器', '取模'],
      explanation: '考点：循环里嵌套 if 判断，用两个计数器分别统计。要点：① 要先读 N，再用 for 循环读 N 个数，这是固定套路；② 判断奇偶用 x % 2 == 1 是奇数，x % 2 == 0 是偶数；③ 注意 0 是偶数（0 % 2 == 0）；④ 输出顺序是"奇数个数 偶数个数"，不要写反。',
    },
    {
      id: 9014,
      type: 'programming',
      stem: '对一个整数 n，如果它各个数位上的数字相加得到的数 m 能整除 n，则称 n 为自整除数。例如 21，2 + 1 = 3，21 ÷ 3 = 6 没有余数，所以 21 是自整除数。现请你求出从 10 到 n 之间的所有自整除数。',
      inputFormat: '一行，一个整数 n（10 ≤ n < 100）。',
      outputFormat: '多行，按从小到大的顺序输出所有大于等于 10、小于等于 n 的自整除数，每行一个。',
      sampleInput: '47',
      sampleOutput: '10\n12\n18\n20\n21\n24\n27\n30\n36\n40\n42\n45',
      testCases: [
        { input: '47', output: '10\n12\n18\n20\n21\n24\n27\n30\n36\n40\n42\n45' },
        { input: '99', output: '10\n12\n18\n20\n21\n24\n27\n30\n36\n40\n42\n45\n48\n50\n54\n60\n63\n70\n72\n80\n81\n84\n90' },
        { input: '20', output: '10\n12\n18\n20' },
        { input: '11', output: '10' },
        { input: '55', output: '10\n12\n18\n20\n21\n24\n27\n30\n36\n40\n42\n45\n48\n50\n54' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 10; i <= n; i++) {
        int m = i / 10 + i % 10;
        if (i % m == 0) {
            cout << i << endl;
        }
    }
    return 0;
}`,
      score: 20,
      tags: ['循环结构', '数位分离', '取模', '整除判断'],
      explanation: '考点：两位数拆位 + 整除判断。因为 n < 100，所有数都是两位数，拆位非常简单：十位 = i / 10，个位 = i % 10，两者相加得 m，再用 i % m == 0 判断能否整除。注意 m 一定大于 0（最小是 1，如 10 → 1+0=1），不会出现除以 0 的情况。',
    },
    {
      id: 9015,
      type: 'programming',
      stem: '国王将金币作为工资发放给忠诚的骑士，发放规律如下：\n\n第 1 天，骑士收到 1 枚金币；\n之后 2 天（第 2、3 天），每天收到 2 枚金币；\n之后 3 天（第 4、5、6 天），每天收到 3 枚金币；\n之后 4 天（第 7、8、9、10 天），每天收到 4 枚金币；\n……\n\n这种发放模式一直延续下去：当连续 N 天每天收到 N 枚金币后，骑士会在之后的连续 N + 1 天里，每天收到 N + 1 枚金币。请计算在前 k 天里，骑士一共获得了多少金币。',
      inputFormat: '一个正整数 k，表示发放金币的天数。',
      outputFormat: '一个正整数，即前 k 天骑士收到的金币总数。',
      sampleInput: '6',
      sampleOutput: '14',
      testCases: [
        { input: '6', output: '14' },
        { input: '1000', output: '29820' },
        { input: '1', output: '1' },
        { input: '10', output: '30' },
        { input: '2', output: '3' },
        { input: '15', output: '55' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int k;
    cin >> k;
    int sum = 0;   // 金币总数
    int day = 0;   // 已经发了多少天
    int coin = 1;  // 当前每天发几枚
    while (day < k) {
        for (int i = 1; i <= coin && day < k; i++) {
            sum += coin;
            day++;
        }
        coin++;
    }
    cout << sum << endl;
    return 0;
}`,
      score: 20,
      tags: ['多重循环', '规律模拟', '累加器'],
      explanation: '考点：双重循环模拟规律（多层循环）。思路：外层循环控制"每天发几枚"coin（1、2、3……），内层循环重复 coin 天，每天把 coin 加到总数上；同时用一个 day 计数器记录已经发了多少天，一旦 day 达到 k 就立刻停止。关键细节：内层循环要加 day < k 的判断，否则最后一组会多发几天。',
    },
  ],
};

// ============================================================
// 编程专项模拟卷（三）· 必考专题
// 难度梯度：★ → ★★ → ★★★ → ★★★ → ★★★★
// 覆盖考点：char 字符类型 / 分支求最值 / 数位分离逆序 / 闰年多分支逻辑 / while 循环拆位累加
// 组卷说明：对标真题编程题难度（温度转换·体温记录·重复数列），补齐一级考纲中
//           尚未被前两卷覆盖的 char、while 循环、闰年逻辑等必考专题
// ============================================================
export const progMock3: Exam = {
  id: 'exam-prog-mock-03-cpp1',
  name: 'C/C++一级·编程专项模拟卷三（必考专题）',
  category: 'mock',
  examDate: '2026-09',
  totalScore: 100,
  passingScore: 60,
  duration: 90, // 5 道编程题，建议 90 分钟
  singleChoice: [],
  trueFalse: [],
  programming: [
    {
      id: 9021,
      type: 'programming',
      stem: '输入一个大写英文字母（A ~ Z），输出它对应的小写字母。',
      inputFormat: '一个大写英文字母（A ~ Z）。',
      outputFormat: '对应的小写字母。',
      sampleInput: 'A',
      sampleOutput: 'a',
      testCases: [
        { input: 'A', output: 'a' },
        { input: 'Z', output: 'z' },
        { input: 'M', output: 'm' },
        { input: 'C', output: 'c' },
        { input: 'K', output: 'k' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    char ch;
    cin >> ch;
    // 大写字母与小写字母的 ASCII 码相差固定的偏移量
    ch = ch - 'A' + 'a';
    cout << ch << endl;
    return 0;
}`,
      score: 20,
      tags: ['char类型', 'ASCII码', '顺序结构'],
      explanation: '考点：char 字符类型 + ASCII 码运算。小写字母的 ASCII 码比对应大写字母大 32，用 ch - \'A\' + \'a\' 把大写字母换算成小写。也可以用 ch + 32 实现，二者等价。注意：变量要用 char 声明，不能用 int。',
    },
    {
      id: 9022,
      type: 'programming',
      stem: '输入三个整数，请输出其中最大的那个数。',
      inputFormat: '一行，三个整数，以空格分隔。',
      outputFormat: '一个整数，即三个数中的最大值。',
      sampleInput: '3 5 2',
      sampleOutput: '5',
      testCases: [
        { input: '3 5 2', output: '5' },
        { input: '10 10 1', output: '10' },
        { input: '-3 -1 -2', output: '-1' },
        { input: '0 0 0', output: '0' },
        { input: '7 3 8', output: '8' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    int maxv = a;
    if (b > maxv) maxv = b;
    if (c > maxv) maxv = c;
    cout << maxv << endl;
    return 0;
}`,
      score: 20,
      tags: ['分支结构', 'if判断', '求最值'],
      explanation: '考点：用分支结构求最值。思路：先假设第一个数 a 是最大值，存入变量 maxv，然后依次用 b、c 和 maxv 比较，谁更大就把谁更新为 maxv。注意两点：① 两个数相等时条件 b > maxv 不成立，maxv 保持不变，结果仍正确；② 要能正确处理负数。',
    },
    {
      id: 9023,
      type: 'programming',
      stem: '输入一个三位正整数，将其各位数字倒过来重新组成一个数并输出。例如输入 123，输出 321。',
      inputFormat: '一个三位正整数（100 ~ 999）。',
      outputFormat: '一个整数，表示倒序后得到的新数。',
      sampleInput: '123',
      sampleOutput: '321',
      testCases: [
        { input: '123', output: '321' },
        { input: '100', output: '1' },
        { input: '700', output: '7' },
        { input: '520', output: '25' },
        { input: '305', output: '503' },
        { input: '999', output: '999' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int ge = n % 10;        // 个位
    int shi = n / 10 % 10;  // 十位
    int bai = n / 100;      // 百位
    cout << ge * 100 + shi * 10 + bai << endl;
    return 0;
}`,
      score: 20,
      tags: ['数位分离', '取模', '整除'],
      explanation: '考点：数位分离。个位 = n % 10，十位 = n / 10 % 10，百位 = n / 100。倒序后的新数 = 个位×100 + 十位×10 + 百位。易错点：像 100、520 这样的数，倒序后前导零会自然消失，直接按整数输出 1、25 即可，不要尝试补零。',
    },
    {
      id: 9024,
      type: 'programming',
      stem: '输入一个年份，判断它是不是闰年，是闰年输出 YES，否则输出 NO。\n\n闰年判断规则：能被 4 整除但不能被 100 整除的年份是闰年；或者能被 400 整除的年份也是闰年。',
      inputFormat: '一个整数，表示年份。',
      outputFormat: '如果该年是闰年输出 YES，否则输出 NO。',
      sampleInput: '2020',
      sampleOutput: 'YES',
      testCases: [
        { input: '2020', output: 'YES' },
        { input: '2000', output: 'YES' },
        { input: '1900', output: 'NO' },
        { input: '2100', output: 'NO' },
        { input: '2024', output: 'YES' },
        { input: '2021', output: 'NO' },
        { input: '1600', output: 'YES' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int y;
    cin >> y;
    if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
        cout << "YES" << endl;
    } else {
        cout << "NO" << endl;
    }
    return 0;
}`,
      score: 20,
      tags: ['分支结构', '逻辑运算', '取模'],
      explanation: '考点：逻辑运算 &&（与）、||（或）和取模 %。闰年条件要写成 (y % 4 == 0 && y % 100 != 0) || y % 400 == 0，两层判断缺一不可。易错点：整百年（如 1900、2100）能被 100 整除但不能被 400 整除，是平年，必须用 && 排除掉，很多同学会漏掉这层。',
    },
    {
      id: 9025,
      type: 'programming',
      stem: '输入一个非负整数 n，输出它的各位数字之和。例如输入 123，输出 6（即 1 + 2 + 3）。',
      inputFormat: '一个非负整数 n。',
      outputFormat: '一个整数，表示 n 的各位数字之和。',
      sampleInput: '123',
      sampleOutput: '6',
      testCases: [
        { input: '123', output: '6' },
        { input: '0', output: '0' },
        { input: '1000', output: '1' },
        { input: '123456', output: '21' },
        { input: '999999', output: '54' },
        { input: '7', output: '7' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int sum = 0;
    while (n > 0) {
        sum += n % 10;  // 取出个位并累加
        n /= 10;        // 去掉个位
    }
    cout << sum << endl;
    return 0;
}`,
      score: 20,
      tags: ['while循环', '数位分离', '累加器'],
      explanation: '考点：while 循环 + 循环中的数位分离。循环体每次：① 用 n % 10 取出当前个位，累加到 sum；② 用 n /= 10 去掉个位；直到 n 变成 0 循环结束。易错点：① sum 必须初始化为 0，否则结果是乱码；② 输入 0 时循环体一次都不执行，sum 保持 0，结果正好正确。',
    },
  ],
};

// ============================================================
// 编程专项模拟卷（四）· 基础巩固
// 难度梯度：★ → ★★ → ★★ → ★★ → ★★★
// 覆盖考点：变量交换 / 算术表达式 / 整数除法与浮点 / abs 数学函数 / 逻辑或分支
// 组卷说明：对标真题最基础题型（交换a和b / 计算(a+b)*c / A除以B / 输出绝对值 /
//           有一门课不及格），全部不含循环，专攻「输入→处理→输出」三步走
// ============================================================
export const progMock4: Exam = {
  id: 'exam-prog-mock-04-cpp1',
  name: 'C/C++一级·编程专项模拟卷四（基础巩固）',
  category: 'mock',
  examDate: '2026-09',
  totalScore: 100,
  passingScore: 60,
  duration: 90, // 5 道编程题，建议 90 分钟
  singleChoice: [],
  trueFalse: [],
  programming: [
    {
      id: 9031,
      type: 'programming',
      stem: '输入两个整数 a 和 b，交换它们的值后，先输出 a 再输出 b，中间用一个空格分隔。',
      inputFormat: '一行，两个整数 a 和 b，以空格分隔。',
      outputFormat: '一行，交换后依次输出 a 和 b，中间用 1 个空格分隔。',
      sampleInput: '3 5',
      sampleOutput: '5 3',
      testCases: [
        { input: '3 5', output: '5 3' },
        { input: '1 2', output: '2 1' },
        { input: '-1 4', output: '4 -1' },
        { input: '0 0', output: '0 0' },
        { input: '7 7', output: '7 7' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int t = a;
    a = b;
    b = t;
    cout << a << " " << b << endl;
    return 0;
}`,
      score: 20,
      tags: ['顺序结构', '变量交换', '三变量法'],
      explanation: '考点：用第三个变量 t 交换两个变量的值，三步：t = a; a = b; b = t。易错点：不能直接写 a = b; b = a;，那样 a 原来的值会先被覆盖丢失，最终两个都变成 b。两个数相等时结果不变，依然正确。',
    },
    {
      id: 9032,
      type: 'programming',
      stem: '输入三个整数 a、b、c，计算 (a + b) × c 的值并输出。',
      inputFormat: '一行，三个整数 a、b、c，以空格分隔。',
      outputFormat: '一个整数，即 (a + b) × c 的结果。',
      sampleInput: '2 3 5',
      sampleOutput: '25',
      testCases: [
        { input: '2 3 5', output: '25' },
        { input: '1 1 1', output: '2' },
        { input: '0 0 0', output: '0' },
        { input: '10 20 3', output: '90' },
        { input: '-2 3 4', output: '4' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << (a + b) * c << endl;
    return 0;
}`,
      score: 20,
      tags: ['算术运算', '多变量输入', '运算符优先级'],
      explanation: '考点：一次读入三个变量 + 含括号的表达式求值。易错点：表达式必须写 (a + b) * c，括号不能省略——若写成 a + b * c 会先算 b * c 再加 a，结果完全不同。负数和 0 都要能正确计算。',
    },
    {
      id: 9033,
      type: 'programming',
      stem: '输入两个整数 A 和 B（B ≠ 0），计算 A ÷ B 的值并输出，结果保留两位小数。',
      inputFormat: '一行，两个整数 A 和 B（B ≠ 0），以空格分隔。',
      outputFormat: '一个浮点数，表示 A ÷ B 的结果，保留两位小数。',
      sampleInput: '5 2',
      sampleOutput: '2.50',
      testCases: [
        { input: '5 2', output: '2.50' },
        { input: '1 3', output: '0.33' },
        { input: '10 4', output: '2.50' },
        { input: '7 2', output: '3.50' },
        { input: '0 5', output: '0.00' },
        { input: '2 1', output: '2.00' },
        { input: '100 3', output: '33.33' },
      ],
      referenceCode: `#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    double ans = (double)a / b;
    cout << fixed << setprecision(2) << ans << endl;
    return 0;
}`,
      score: 20,
      tags: ['浮点数', '整数除法', '类型转换', 'setprecision'],
      explanation: '考点：整数相除得到的是整数（会舍去小数），要得到小数必须先把其中一个转成 double：写 (double)a / b。再用 fixed << setprecision(2) 保留两位小数。易错点：① 直接写 a / b 时 5 / 2 得到 2 而不是 2.5；② 忘记加头文件 #include <iomanip>。',
    },
    {
      id: 9034,
      type: 'programming',
      stem: '输入一个整数 n，输出它的绝对值。',
      inputFormat: '一个整数 n。',
      outputFormat: '一个非负整数，即 n 的绝对值。',
      sampleInput: '-5',
      sampleOutput: '5',
      testCases: [
        { input: '-5', output: '5' },
        { input: '5', output: '5' },
        { input: '0', output: '0' },
        { input: '-100', output: '100' },
        { input: '-1', output: '1' },
      ],
      referenceCode: `#include <iostream>
#include <cmath>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << abs(n) << endl;
    return 0;
}`,
      score: 20,
      tags: ['数学函数', 'abs', '顺序结构'],
      explanation: '考点：数学函数 abs() 求绝对值，需要 #include <cmath>。也可以用 if 判断实现：if (n < 0) n = -n。易错点：① 忘记包含 <cmath> 头文件；② 用 if 判断时把条件 n < 0 误写成 n > 0。注意 0 的绝对值还是 0。',
    },
    {
      id: 9035,
      type: 'programming',
      stem: '输入小明语文和数学两门课的成绩，判断是否至少有一门课不及格（低于 60 分）。如果至少有一门不及格，输出 YES，否则输出 NO。',
      inputFormat: '一行，两个整数，分别表示语文和数学成绩（0 ≤ 成绩 ≤ 100）。',
      outputFormat: '如果至少有一门不及格输出 YES，否则输出 NO。',
      sampleInput: '55 80',
      sampleOutput: 'YES',
      testCases: [
        { input: '55 80', output: 'YES' },
        { input: '60 60', output: 'NO' },
        { input: '90 95', output: 'NO' },
        { input: '59 100', output: 'YES' },
        { input: '100 0', output: 'YES' },
        { input: '0 0', output: 'YES' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    if (a < 60 || b < 60) {
        cout << "YES" << endl;
    } else {
        cout << "NO" << endl;
    }
    return 0;
}`,
      score: 20,
      tags: ['分支结构', '逻辑运算', 'if-else'],
      explanation: '考点：逻辑或 || 表示「至少一个成立」。条件写 a < 60 || b < 60，意思是语文不及格 或 数学不及格。易错点：① 60 分是及格，条件用 < 60 不能写成 <= 60；② 把 ||（或）误写成 &&（与），那样会变成「两门都不及格」才输出 YES。',
    },
  ],
};

// ============================================================
// 编程专项模拟卷（五）· 循环与分支
// 难度梯度：★★ → ★★★ → ★★★ → ★★ → ★★★★
// 覆盖考点：for 循环累加 / 循环拆位计数 / while 模拟 / 字符判断 / 双重循环打印图形
// 组卷说明：对标真题进阶题型（奇数求和 / 数1的个数 / 3n+1猜想 / 大写字母判断 /
//           字符三角形），引入循环、数位筛选与图形打印
// ============================================================
export const progMock5: Exam = {
  id: 'exam-prog-mock-05-cpp1',
  name: 'C/C++一级·编程专项模拟卷五（循环与分支）',
  category: 'mock',
  examDate: '2026-09',
  totalScore: 100,
  passingScore: 60,
  duration: 90, // 5 道编程题，建议 90 分钟
  singleChoice: [],
  trueFalse: [],
  programming: [
    {
      id: 9041,
      type: 'programming',
      stem: '输入一个正整数 n，求 1 到 n 之间所有奇数的和。',
      inputFormat: '一个正整数 n。',
      outputFormat: '一个整数，即 1 到 n 之间所有奇数之和。',
      sampleInput: '10',
      sampleOutput: '25',
      testCases: [
        { input: '10', output: '25' },
        { input: '1', output: '1' },
        { input: '2', output: '1' },
        { input: '5', output: '9' },
        { input: '7', output: '16' },
        { input: '100', output: '2500' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        if (i % 2 == 1) {
            sum += i;
        }
    }
    cout << sum << endl;
    return 0;
}`,
      score: 20,
      tags: ['for循环', '取模', '累加器', '奇偶判断'],
      explanation: '考点：for 循环 + 取模判断奇偶 + 累加器。三步：① 累加变量 sum 初始化为 0；② 循环 i 从 1 到 n；③ 若 i % 2 == 1（奇数）则累加到 sum。易错点：① sum 不初始化结果会乱；② 判断奇数用 i % 2 == 1，1、3、5 是奇数，2、4 是偶数。',
    },
    {
      id: 9042,
      type: 'programming',
      stem: '输入一个正整数 n，统计从 1 到 n（包含 1 和 n）所有整数中，数字「1」一共出现了多少次。例如 n = 12 时，出现的数字 1 有：1、10、11（包含两个 1）、12，共 5 次。',
      inputFormat: '一个正整数 n（n ≤ 10000）。',
      outputFormat: '一个整数，表示数字 1 出现的总次数。',
      sampleInput: '12',
      sampleOutput: '5',
      testCases: [
        { input: '12', output: '5' },
        { input: '1', output: '1' },
        { input: '10', output: '2' },
        { input: '20', output: '12' },
        { input: '100', output: '21' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int count = 0;
    for (int i = 1; i <= n; i++) {
        int x = i;
        while (x > 0) {
            if (x % 10 == 1) {
                count++;
            }
            x /= 10;
        }
    }
    cout << count << endl;
    return 0;
}`,
      score: 20,
      tags: ['循环嵌套', '数位分离', '计数器', 'while循环'],
      explanation: '考点：外层 for 遍历 1 到 n，内层 while 拆出每个数的每一位，判断是否为 1 并计数。易错点：① 内层循环要用临时变量 x 拆位，不能直接用 i，否则会破坏外层循环；② 数字 11 含有两个 1，要一位一位数清楚；③ 计数器 count 必须初始化为 0。',
    },
    {
      id: 9043,
      type: 'programming',
      stem: '角谷猜想：对于任意一个大于 1 的正整数 n，如果 n 是偶数就把它除以 2；如果 n 是奇数就把它变成 3n + 1。如此反复，n 最终会变成 1。请你输入一个大于 1 的正整数 n，输出 n 变成 1 的过程中一共经过了多少步。',
      inputFormat: '一个大于 1 的正整数 n。',
      outputFormat: '一个整数，表示 n 变为 1 所需的步数。',
      sampleInput: '6',
      sampleOutput: '8',
      testCases: [
        { input: '6', output: '8' },
        { input: '2', output: '1' },
        { input: '5', output: '5' },
        { input: '3', output: '7' },
        { input: '10', output: '6' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int step = 0;
    while (n != 1) {
        if (n % 2 == 0) {
            n = n / 2;
        } else {
            n = 3 * n + 1;
        }
        step++;
    }
    cout << step << endl;
    return 0;
}`,
      score: 20,
      tags: ['while循环', '循环模拟', '变量更新', '奇偶判断'],
      explanation: '考点：while 循环 + 变量更新模拟。循环条件用 n != 1，每轮判断 n 的奇偶：偶数 n = n / 2，奇数 n = 3 * n + 1，然后步数 step 加 1。易错点：① step 必须在每次变换后加 1，不要放在循环外；② 3 * n + 1 里乘法优先，本身就会先乘后加，不会算错。',
    },
    {
      id: 9044,
      type: 'programming',
      stem: '输入一个字符，判断它是否为大写英文字母（A ~ Z）。如果是大写字母，输出 YES，否则输出 NO。',
      inputFormat: '一个字符。',
      outputFormat: '如果该字符是大写字母输出 YES，否则输出 NO。',
      sampleInput: 'A',
      sampleOutput: 'YES',
      testCases: [
        { input: 'A', output: 'YES' },
        { input: 'Z', output: 'YES' },
        { input: 'a', output: 'NO' },
        { input: '5', output: 'NO' },
        { input: 'M', output: 'YES' },
        { input: '*', output: 'NO' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    char ch;
    cin >> ch;
    if (ch >= 'A' && ch <= 'Z') {
        cout << "YES" << endl;
    } else {
        cout << "NO" << endl;
    }
    return 0;
}`,
      score: 20,
      tags: ['char类型', '分支结构', '逻辑运算', '字符判断'],
      explanation: '考点：字符比较 + 逻辑与 &&。判断大写字母的条件是 ch >= \'A\' && ch <= \'Z\'。易错点：① 字符要用单引号 \'A\'，不能写成双引号 "A"；② 两个条件要用 && 连接，不能只写一个；③ 小写字母、数字、符号都不是大写字母，应输出 NO。',
    },
    {
      id: 9045,
      type: 'programming',
      stem: '输入一个正整数 n，输出一个 n 行、由字符 * 组成的直角三角形：第一行 1 个 *，第二行 2 个 *，……，第 n 行 n 个 *。',
      inputFormat: '一个正整数 n。',
      outputFormat: 'n 行字符，第 i 行输出 i 个 *。',
      sampleInput: '3',
      sampleOutput: '*\n**\n***',
      testCases: [
        { input: '3', output: '*\n**\n***' },
        { input: '1', output: '*' },
        { input: '2', output: '*\n**' },
        { input: '5', output: '*\n**\n***\n****\n*****' },
      ],
      referenceCode: `#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            cout << "*";
        }
        cout << endl;
    }
    return 0;
}`,
      score: 20,
      tags: ['双重循环', '嵌套循环', '图形打印'],
      explanation: '考点：双重循环打印图形。外层循环控制行数 i（1 到 n），内层循环控制每行字符个数 j（1 到 i），每行输出完后用 endl 换行。易错点：① 内外两层循环缺一不可，内层条件 j <= i 让每行比上一行多一个星号；② 每行结束必须换行，否则会全部挤在一行；③ n = 1 时只输出一行一个星号。',
    },
  ],
};

// 编程专项模拟卷列表
export const progMockExams: Exam[] = [progMock1, progMock2, progMock3, progMock4, progMock5];
