# 数论

关于数论部分的概念，可参考如下链接：

[OI-Wiki 数论基础](https://oi-wiki.org/math/number-theory/basic/)

## 约数和倍数

约数总是成对出现的：

* 如果 $a$ 是 $n$ 的约数，那么 $\frac{n}{a}$ 也是 $n$ 的约数。
* 这一对约数 $a$ 和 $\frac{n}{a}$，一个小于等于 $\sqrt{n}$，另一个大于等于 $\sqrt{n}$。
  * 令 $n$ 有一对约数 $pq = n$，不妨设 $p \le q$，$n = pq \ge p^2$，$p \le \sqrt n$。

* 如果 $a$ 等于 $\frac{n}{a}$，那么 $n$ 是一个完全平方数。

推论：$n$ 的约数数量为奇数，等价于 $n$ 为完全平方数。

### 枚举约数（约数法）

给定 $n$，求 $n$ 的每个约数，$n \le 10^9$。

```cpp
int divisor[], m;  // 记录约数，divisor 约数

for (int i = 1; i * i <= n; i++) {  // 枚举约数
  if (n % i == 0) {
    divisor[++m] = i;
    if (i * i != n) {  // 注意完全平方数的判断
      divisor[++m] = n / i;
    }
  }
}

// 似乎空间复杂度为 O(sqrt(n))
```

时间复杂度 $O(\sqrt n)$，空间复杂度 $\max(d(n))$，其中 $d(n)$ 表示 $n$ 的约数数量，大约为 $O(n^{\frac{1}{3}})$。适用于求解少量较大数的约数。

![](https://cdn.luogu.com.cn/upload/image_hosting/3ok46vsq.png)

### 枚举倍数（倍数法）

给定 $n$，求 $1 \sim n$ 的每个数的约数，$n \le 10^5$。

```cpp
const int MAXN = 1e5 + 1;

// 每个数的约数数量不等，vector 存储约数
vector<int> divisor[MAXN];  // divisor[i] 记录了 i 的所有约数

for (int i = 1; i < MAXN; i++) {
  for (int j = i; j < MAXN; j += i) {  // 枚举 i 的倍数 j
    divisor[j].push_back(i);  // j 有约数 i
  }
  /* 或者以下代码
  for (int j = 1; j * i <= n; j++) {
  	divisor[j * i].push_back(i);
  }
  */
}
```

时间复杂度 $\frac{n}{1} + \frac{n}{2} + \dots + \frac{n}{n} = O(n \log n)$，调和级数复杂度。

空间复杂度 $O(n \log n)$。实际上说明了 $1 \sim n$ 的约数数量为 $O(n \log n)$ 级别。

## 质数与合数

对于正整数 $p \ne 0, 1$，如果 $p$ 除了 $1$ 和 $p$ 以外没有其他约数，则 $p$ 为质数。

对于正整数 $p \ne 0, 1$，如果 $p$ 不是质数，则 $p$ 为合数。

### 质数判定

若 $n$ 为合数，则 $n$ 可以表示为 $n = pq$，其中 $p, q \gt 1$。

- 令 $p \le q$，则可以发现 $n = pq \ge p^2$，则 $p \le \sqrt n$。
- 因此可以试除法，枚举 $2 \sim \lbrack \sqrt{n} \rbrack$ 内的数，然后判断是否有 $n$ 的约数。

时间复杂度 $O(\sqrt n)$。

```cpp
bool P(int n) {
  for (int i = 2; i * i <= n; i++) {  // 试除法，枚举 2 ~ sqrt(n) 中的其他约数
    if (n % i == 0) {  // 找到其他约数，不是质数
      return 0;
    }
  }
  return n != 1;  // 特判 1，其他数为质数
}
```

### 质数筛

使用质数判断筛出 $1 \sim n$ 以内的质数，效率 $O(n \sqrt n)$ 很低，需要使用质数筛。

质数筛的思想为筛除所有合数，剩下没被筛除的数为质数。每个合数都至少有一个质因数，利用质因数将合数筛除。

#### 埃氏筛

思想：每找到一个质数，就将它的所有倍数筛去。

算法思路：

- 从 $2$ 开始从小到大枚举每个整数 $i$
  - 如果 $i$ 未被筛去
    - 记录质数
    - 将 $i$ 的所有倍数筛去

```cpp
int v[MAXN], prime[MAXN], tot;

for (int i = 2; i <= n; i++) {
  if (!v[i]) {  // 是质数
    prime[++tot] = i;
    // v[i] = i;  // 可以记录最小质因数
    for (int j = i * 2; j <= n; j += i) {  // 将所有质数的倍数筛除
      v[j] = 1;
      // if (!v[j]) v[j] = i;  // 可以记录首次筛除时的最小质因数
    }
  }
}
```

时间复杂度：$\frac{n}{2}+\frac{n}{3}+\frac{n}{5}+\frac{n}{7}+\frac{n}{11}+\dots = O(n \log (\log n))$。 

#### 欧拉筛（线性筛）

埃氏筛时间复杂度不是线性，因为一个合数会被它的多个质因子筛去。

- 如果每个合数只会被筛一次，那么时间复杂度是线性 $O(n)$ 的。
- 每个合数都有一个最小质因数，尝试利用最小质因数将合数筛除。

欧拉筛：使用**最小质因数**作为倍数，将每个合数筛去。每个合数只会被其最小质因数筛去。

算法思路：

- 从 $2$ 开始从小到大枚举每个整数 $i$
  - 如果 $i$ 未被筛去
    - 记录质数
  - 从小到大枚举质数表中的每个质数 $prime[j]$
    - 筛去合数 $i * prime[j]$，此时 $i * prime[j]$ 的最小质因子为 $prime[j]$
    - 如果 $i \ \% \ prime[j] == 0$，跳出 $j$ 循环，因为更大的 $prime[j]$ 不再是 $i * prime[j]$ 的最小质因子

```cpp
int v[MAXN], prime[MAXN], tot;

// 线性筛（欧拉筛），筛出 1 ~ n 内的所有质数
// 线性筛：每个合数只被其最小质因数筛掉
// 时间复杂度：O(n)
void Sieve(int n) {
  for (int i = 2; i <= n; i++) {  // 枚举每个数
    if (!v[i]) {                  // 数字没被筛掉
      // v[i] = i;                // 可以最小质因数
      prime[++tot] = i;           // 记录质数
    }
    for (int j = 1; j <= tot && i * prime[j] <= n; j++) {  // 枚举质数表的每个质数作为最小质因数，保证不越界
      v[i * prime[j]] = 1;                                 // 筛掉合数 i * prime[j]
      //v[i * prime[j]] = prime[j];                        // 或者记录最小质因数
      if (i % prime[j] == 0) {                             // 保证了 i * prime[j] 的最小质因数为 prime[j]
        break;
      }
      // 当 i % prime[j] = 0 时，i 的质因数分解形式包含了 prime[j]
      // 即 i 的最小质因数就是 prime[j]
      // 如果继续往后枚举质数，prime[j] 比 i 的最小质因数要大
      // i * prime[j] 的最小质因数不是 prime[j]，因此 i * prime[j] 不能被 prime[j] 筛除
      // 因此 i % prime[j] = 0，不需要再枚举更大的 prime[j] 了
    }
  }
}
```

时间复杂度 $O(n)$，空间复杂度 $O(n)$。

## 最大公约数和最小公倍数

记 $a_1, a_2, \dots, a_n$ 的最大公约数（greatest common divisor, gcd）和最小公倍数（least common multiple, lcm）为 

$gcd(a_1, a_2, \dots, a_n) = (a_1, a_2, \dots, a_n)$ 和 $lcm(a_1, a_2, \dots, a_n) = [a_1, a_2, \dots, a_n]$。

注意，对于任意整数 $a \ne 0$，$(a, 0) = a$。

互质：$a$ 和 $b$ 最大公约数为 $1$，那么 $a$ 和 $b$ 互质。

### 性质

- 结合律和交换律，可以按任意顺序计算 gcd 和 lcm，例如 $(a_1, a_2, a_3) = ((a_1, a_2), a_3) = (a_1, (a_2, a_3)) = (a_2, (a_1, a_3))$，lcm 同理。
- $(ka_1, ka_2, \dots, ka_n) = k \times (a_1, a_2, \dots a_n)$。lcm 同理。
- 两数的 gcd 和 lcm 的乘积等于两数乘积，即 $(a_1, a_2) \times[a_1, a_2] = a_1 \times a_2$。

### 欧几里得算法

欧几里得算法求解两数 $a, b$ 最大公约数的时间复杂度为 $O(\log (\max(a, b)))$。不要求时间复杂度的证明。

$(a, b) = (b, a \bmod b)$。注意，对于任意整数 $a \ne 0$，$(a, 0) = a$。

```cpp
int gcd(int a, int b) {  // 最大公约数
  return !b ? a : gcd(b, a % b);
}

int lcm(int a, int b) {      // 最小公倍数
  return a / gcd(a, b) * b;  // 注意先除后乘，尽可能避免溢出
}
```

## 算数基本定理（唯一分解定理）

就是质因数分解。

可以将任意大于等于 $2$ 的自然数 $N$ 分解为有限个质数的乘积，即 $N = p_1^{a_1}p_2^{a_2}p_3^{a_3}\cdots p_k^{a_k}= \prod \limits_{i = 1} ^ k p_i^{a_i}$，其中 $p_i$ 是互不相同的质因数（$2 \le p_1 \lt p_2 \lt \dots \lt p_k$），$a_i$ 是对应的质因数的幂次（$a_i \ge 1$），$k$ 为 $N$ 分解出的不同质因数个数。

### 质因数分解

#### 试除法分解质因数

从 $2$ 开始枚举，找到一个 $n$ 的约数，就不断地将它分解。由于是从小到大枚举的约数，因此找到的因数也必然为质数。由于 $n$ 最多只有一个大于 $\sqrt{n}$ 的质因数，因此只用枚举 $2 \sim \sqrt{n}$ 中的质因数并作分解，最后特判大于 $\sqrt{n}$ 的质因数即可。

**由于每次分解，至少将原数减半，因此分解过程时间复杂度为 $O(\log n)$，并且 $n$ 的质因数个数不超过 $O(\log n)$。**

总时间复杂度为 $O(\sqrt n)$，记录质因子空间复杂度 $O(\log n)$。适用于对较少数量的较大数做质因数分解，$n \le 10^{14}$。

```cpp
int cnt, a[];  // 记录质因子分解形式，数组空间开 O(logn) 这么大

void D(int n) {
  for (int i = 2; i * i <= n; i++) {  // 只有枚举 2 ~ sqrt(n) 的质因子 O(sqrt(n))
    for (; n % i == 0; n /= i) {  // 质因数分解 O(logn)
      a[++cnt] = i;
    }
  }
  if (n > 1) {  // 特判大于 sqrt(n) 的质因数
    a[++cnt] = n;
  }
}

```

#### 最小质因数分解质因数

在埃氏筛中，可以记录每个合数首次被筛除的最小质因数。

```cpp
int v[MAXN], prime[MAXN], tot;

for (int i = 2; i <= n; i++) {
  if (!v[i]) {  // 是质数
    prime[++tot] = i;
    v[i] = i;  // 可以记录最小质因数
    for (int j = i * 2; j <= n; j += i) {  // 将所有质数的倍数筛除
      v[j] = 1;
      // if (!v[j]) v[j] = i;  // 可以记录首次筛除时的最小质因数
    }
  }
}
```

在欧拉筛中，每个合数都只被最小质因数作为倍数而筛除，筛除时记录最小质因数。

```cpp
int v[MAXN], prime[MAXN], tot;

// 线性筛（欧拉筛），筛出 1 ~ n 内的所有质数
// 线性筛：每个合数只被其最小质因数筛掉
// 时间复杂度：O(n)
void Sieve(int n) {
  for (int i = 2; i <= n; i++) {  // 枚举每个数
    if (!v[i]) {                  // 数字没被筛掉
      v[i] = i;                   // 记录最小质因数
      prime[++tot] = i;           // 记录质数
    }
    for (int j = 1; j <= tot && i * prime[j] <= n; j++) {  // 枚举质数表的每个质数作为最小质因数
      v[i * prime[j]] = prime[j];                          // 或者记录最小质因数
      if (i % prime[j] == 0) {                             // 保证了 i * prime[j] 的最小质因数为 prime[j]
        break;
      }
    }
  }
}
```

利用最小质因数进行质因数分解：

```cpp
int cnt, a[];  // 记录质因子分解形式，空间 O(log n)

void D(int n) {
  for (; n > 1; n /= v[n]) {  // 分解最小质因数
    a[++cnt] = v[n];          // 记录
  }
}
```

预处理最小质因子时间 $O(n \log \log n)$ 或 $O(n)$，对单个数分解质因数 $O(\log n)$。适用于对多个数值较小的数作质因数分解。例如，对 $10^5$ 个数值大小 $\le 10^7$ 的数做质因数分解。

### 质因数分解与约数

如果 $x = \prod \limits_{i=1}^kp_i^{a_i}$，其中 $p_i$ 互不相同，$a_i \ge 0$，有：

- $x$ 的约数 $d = \prod \limits_{i = 1}^k p_i^{c_i}$，其中 $0 \le c_i \le a_i$。
  - $d$ 中出现的质因数，必然出现在 $x$ 的质因数中。$d$ 中每个质因子 $p_i$ 的出现次数 $c_i$ 必然不超过 $x$ 对应质因子的出现次数 $a_i$。 
  - 因此可以利用质因数分解判断整除、约数、倍数。
- 记约数数量函数 $d(x)$ 表示 $x$ 的正约数数量，由乘法原理可得 $d(x) = (1+a_1) \times (1 + a_2) \times \dots \times(1 + a_k) = \prod \limits_{i = 1}^k (1 + a_i)$。
  - 进一步发现 $d(x) = d(p_1^{c_1}) \times d(p_2^{c_2}) \times \dots \times d(p_k^{c_k})$。似乎可以对函数进行分解（积性函数）。
  - 对 $x$ 的每个质因子 $p_i$ 单独考虑，其约数 $d$ 对应的质因子 $0 \le c_i \le a_i$，也就是 $c_i$ 有 $(a_i + 1)$ 种选择。
  - 在质因数分解形式中，每种质因子之间是相互独立的，才可能使用乘法原理。
  - 逐月 P1324，欧拉筛预处理最小质因数，最小质因数分解法
- 即约数和函数 $\sigma(n)$ 表示 $n$ 的所有正约数之和。
  - 不要求掌握。

每个质因数相互独立。

### 质因数分解与公约数公倍数

如果 $x = \prod \limits_{i=1}^kp_i^{a_i}$，$y = \prod \limits_{i=1}^k p_i^{b_i}$（其中 $a_1, \dots, a_k$ 和  $b_1, \dots, b_k$ 中可能有指数 $0$），有：

- 最大公约数 $(x, y) = \prod \limits_{i=1}^k p_i^{\min(a_i, b_i)}$。
- 最小公倍数 $[x,y] = \prod \limits_{i=1}^k p_i^{\max(a_i, b_i)}$。
- 对每个质因数单独考虑。

两数的 gcd 和 lcm 的乘积等于两数乘积，即 $(x, y) \times [x, y] = x \times y$，写成质因数分解的形式为：

- $\prod \limits_{i=1}^k p_i^{\min(a_i, b_i)} \times \prod \limits_{i=1}^k p_i^{\max(a_i, b_i)} = \prod \limits_{i=1}^k p_i^{a_i + b_i}$。
- 也就是 $\min(a, b) + \max(a, b) = a + b$ 的体现。