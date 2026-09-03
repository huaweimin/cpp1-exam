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

// 编程专项模拟卷列表
export const progMockExams: Exam[] = [progMock1, progMock2];
