# 高精度

在 C++ 当中，专门存储整数的类型有 `int`、`long long` 等，但是这些数据类型都有位数限制（其中较大的long long可以存至19位整数，$\pm 2^{63}$），如果我们要存下大小更大、位数更长的数，就需要使用其他方法。高精度算法（又称大数计算），用于通过数组或字符串按位存储大数，并且通过模拟竖式计算，避免了位数限制。

高精度，就是高于基本类型支持的精度。数字很大时，我们需要高精度来模拟加减乘除。我们将以函数模块化的代码风格介绍高精度算法。

## 输入

用字符串输入高精度数，需要倒序转换成数字串。（根据进制相关的知识，数字的最低位为第 $0$ 位，位号为 $0$）。

```cpp
const int MAXL = 1000; // 高精度运算支持的位数
int a[MAXL], la;       // 存储高精度数及其位数
int b[MAXL], lb;

// 输入并存储一个高精度数字
void Input(int a[], int &la){
  string s;
  cin >> s;  // 读入一个数字字符串
  la = s.size();
  for (int i = 0; i < la; i++){
    a[i] = s[la - i - 1] - '0';  // 翻转并转换成数字
  }
}
Input(a, la);
Input(b, lb);
```

时间复杂度 $O(n)$，其中 $n$ 为数字位数。

形式参数 `&la` 与 `la` 的区别：在函数中改变形参 `la` 的值，对于前者传入参数会改变，而后者不会。

形式参数 `int a[]`：传入数组时，只有第一维可以忽略，后面几维都必须指明，例如 `int a[][100][200]`。在函数中改变形参 `a[]` 的值，传入数组的值也会改变。

## 输出

数字在进行运算时，可能会产生前导 $0$，需要去除。

```cpp
// 忽略前导 0，注意当数字为 0 时的输出问题
void Work(int a[], int &la) {
  for (; la - 1 > 0 && !a[la - 1]; la--){
  }
}
```

输出数字，从高位往低位输出。

```cpp
// 输出高精度数字
void Output(int a[], int &la){
  // 从高位往低位输出
  for (int i = la - 1; i >= 0; i--){
    cout << a[i];
  }
}
```

时间复杂度 $O(n)$，其中 $n$ 为数字位数。

## 加法

从低位到高位，逐位相加，逐位进位。

```cpp
// 高精度加法 a + b，结果保存在 c 当中
void Add(int a[], int la, int b[], int lb, int c[], int &lc){
  for (int i = 0; i < lc; i++){
    c[i] += a[i] + b[i];	// 逐位相加，注意保留之前的进位
    c[i + 1] = c[i] / 10; // 给下一位进位
    c[i] %= 10;
  }
  lc += c[lc] == 1;  // 如果最高位有进位，则位数 + 1。加法运算最多只会在最高位进 1 位。
}
Add(a, la, b, lb, c, lc);
Print(c, lc);
```

时间复杂度 $O(n)$。

## 减法

对于减法，首先需要结果的符号，如果大数减去小数，则符号为正，反之为负。

输出符号后，拿大数减去小数，从低位到高位，逐位相减，逐位借位。

```cpp
// 比较 a 和 b 的大小，判断是否 a > b
bool Compare(int a[], int la, int b[], int lb){
  int l = max(la, lb);
  for (int i = l - 1; i >= 0; i--){ // 从最高位开始比较
    if (a[i] != b[i]){              // 第一位不相同的数字
      return a[i] > b[i];
    }
  }
  return 0; // 相等
}
// 高精度减法 a - b（a > b），结果保存在 c 中
void Minus(int a[], int la, int b[], int lb, int c[], int &lc){
  lc = max(la, lb);  // 确定结果的位数，最高位可能不会退位
  for (int i = 0; i < lc; i++){
    c[i] += a[i] - b[i]; // 逐位相减
    if (c[i] < 0){       // 逐位借位
      c[i + 1]--;
      c[i] += 10;
    }
  }
  Work(c, lc);  // 去除前导 0，例如 9999 - 9990 = 0009 = 9
}

if (!Compare(a, la, b, lb)) {
  swap(a, b);    // 符号为负，则交换两个数。对数组进行 swap，时间复杂度为 O(n)
  swap(la, lb);  // 交换长度
  flag = 1;      // 符号为负
}
Minus(a, la, b, lb, c, lc);
if (flag) {
  cout << "-";
}
Print(c, lc);
```

##  乘法

两个位数为 $n, m$ 的数字相乘的结果位数最多为 $n + m$。

### 高精度乘以低精度

从低位到高位，逐位相乘，逐位进位。

```cpp
// 高精度乘以低精度 a * x，结果保存到 b 中
void Multiply(int a[], int la, int x, int b[], int &lb){
  lb = la + f(x);  // f(x) 表示 x 的位数
  for (int i = 0; i < lb; i++){
    b[i] += a[i] * x;      // 逐位相乘
    b[i + 1] += b[i] / 10; // 逐位进位
    b[i] %= 10;
  }
  Work(b, lb);  // 去除前导 0，最极端例子为 9999 * 0 = 0000 = 0
}
Multiply(a, la, x, b, lb);
Print(b, lb);
```

时间复杂度 $O(n)$，其中 $n$ 为数字位数。

### 高精度乘以高精度

位位相乘，累加结果，从低位到高位，逐位进位。

```cpp
// 高精度乘以高精度 a * b，结果保存到 c 中
void Multiply(int a[], int la, int b[], int lb, int c[], int &lc){
  lc = la + lb;  // 确定结果的位数
  for (int i = 0; i < la; i++){
    for (int j = 0; j < lb; j++){
      c[i + j] += a[i] * b[j];  // 累加结果，这里的本质是 (a * 10 ^ i) * (b * 10 ^ j) = (a * b) * 10 ^ (i + j)
    }
  }
  for (int i = 0; i < lc; i++){
    c[i + 1] += c[i] / 10;   // 逐位进位
    c[i] %= 10;
  }
  Work(c, lc);  // 去除前导 0
}
Multiply(a, la, b, lb, c, lc);
Print(c, lc);
```

时间复杂度 $O(nm)$，其中 $n, m$ 为两个数字的位数。

## 除法

这里只介绍高精度除以低精度。

从高位往低位，求商和余数。注意模拟竖式除法

```cpp
// 高精度除以低精度 a / x，商和余数分别保存在 b 和 r
int Divide(int a[], int la, int x, int b[], int &lb){
  int r = 0;
  lb = la;                            // 确定结果的位数
  for (int i = la - 1; i >= 0; i--){  // 从高位进行除法
    r = r * 10 + a[i];                // 余数后面加上当前这一位
    b[i] = r / x;                     // 求商
    r %= x;                           // 求余数
  }
  Work(b, lb);  // 去除前导 0
  return r;     // 返回余数
}

int r = Divide(a, la, x, b, lb);
Print(b, lb);
cout << '\n' << r;
```

时间复杂度 $O(n)$，其中 $n$ 为高精度数字位数。

## 题单

[vjudge](https://vjudge.net/contest/636586)