# 树状数组

## 前置知识点

还有其他前置知识点：前缀和。

### lowbit(x)

`lowbit(x)`：返回 $x$ 的二进制中最低位 $1$ 的位权，例如 $lowbit(20) = 4$。

`lowbit(x)` 有一种简单的实现方法：

```cpp
int lowbit(int x) {
  return x & -x;  // x 和 -x 做位与运算
}
```

在计算机底层实现中，运算是以补码形式进行的，`x & -x` 实际上是将 $x$ 和 $-x$ 的补码做与运算，得到结果后转成数值。

```
x  的原码表示：0101......1000......0
-x 的原码表示：1101......1000......0
-x 的补码表示：1010......1000......0
```

[OI-Wiki 参考连接](https://oi-wiki.org/ds/fenwick/)

因此 `x & -x` 的值就是 `lowbit(x)`。

另外，取出 $x$ 中二进制每一位 $1$ 的位权，可以有如下代码：

```cpp
for (int i = x; i; i -= lowbit(i)) {
  cout << lowbit(i) << ' ';
}
```

### 离散化（坐标压缩，coordinate compression）

离散化：将大的值域范围内的少量数值，映射到小的值域范围内。例如，有 $N$ 个元素，他们的值在 $[1, 10^9]$ 之间，我们可以用一些方法将其映射到 $[1, N]$ 的范围内。

一种常用的方法是，将数值映射为其在序列中的排名，这样的映射方法既将数值缩小，又不改变数值之间的相对大小关系。

有两种实现方法，去重离散化和非去重离散化。具体使用哪种情况需要具体分析。以下为使用二分的实现方法。

??? 实现

    === "非去重离散化"

        ```cpp
        int n, a[MAXN], b[MAXN], rk[MAXN];
        for (int i = 1; i <= n; i++) {
          cin >> a[i];
          b[i] = a[i];
        }
        sort(b + 1, b + n + 1);
        for (int i = 1; i <= n; i++) {
          rk[i] = lower_bound(b + 1, b + n + 1, a[i]) - b;
        }
        ```

    === "去重离散化"

        ```cpp
        int n, m, a[MAXN], b[MAXN], rk[MAXN];
        for (int i = 1; i <= n; i++) {
          cin >> a[i];
          b[i] = a[i];
        }
        sort(b + 1, b + n + 1);
        m = unique(b + 1, b + n + 1) - b;  // unique 函数去除相邻重复元素，返回去重部分尾元素的后一个位置的地址（迭代器）
        // unique 函数要求范围内的元素为已排序
        /*
        m = 0;
        for (int i = 1; i <= n; i++) {
          if (!m || b[i] != b[m]) {
            b[++m] = b[i];
          }
        }
        */
        for (int i = 1; i <= n; i++) {
          rk[i] = lower_bound(b + 1, b + m + 1, a[i]) - b;
        }
        ```

实际上，`sort` 排序就能实现离散化，[参考链接](https://www.luogu.com.cn/article/yh9h2r6g)。

## 树状数组

树状数组，学术名为 `Fenwick Tree`。

!!! 例题

    给定一个长度为 $N$ 的全 $0$ 数列 $A_i$，有 $Q$ 次操作，需要支持以下两种操作：

    1. 将某一个数加上 $x$。
    2. 求出一个指定区间的数字之和。

    $N, Q \le 10^5$

### 概念

先说概念，树状数组是一种用于在具有单点修改操作情况下快速维护前缀信息的数据结构。其与数组、前缀和的对比如下。

| 项目       | 数组   | 前缀和 | 树状数组    |
| ---------- | ------ | ------ | ----------- |
| 单点修改   | $O(1)$ | $O(n)$ | $O(\log n)$ |
| 区间和查询 | $O(n)$ | $O(1)$ | $O(\log n)$ |

通常树状数组常用于带【单点修改】的【区间查询】的数据结构题目中，并且代码量小。

### 定义

在前缀和中，$sum_i = \sum \limits_{k = 1}^i A_k$ 表示数列前 $K$ 项之和。

在树状数组中，令 $c_{i} = \sum \limits_{k = i - lowbit(i) + 1}^i A_k$。可以理解为，$c_i$ 记录了以 $i$ 为右端点长度为 $lowbit(i)$ 的区间数字之和。

- 注意到，$lowbit(x)$ 为 $2$ 的幂次。

### 前缀查询和区间查询

先不说如何得到 $c$ 数组。我们考虑如何用 $c$ 数组求出前 $i$ 项之和。类似于 ST 表倍增，我们可以用若干个长度为 $2^{x_i}$ 且 $x_i$ 互不相同的区间拼凑出前缀信息。

由于 $c$ 数组的独特定义方法，此时我们不需要枚举每一位，而是用 `lowbit(x)` 直接告诉我们区间长度信息，相当于直接枚举 $x$ 的二进制中每一位 $1$。

以区间求和为例，有如下代码：

```cpp
int get(int x) {
  int ans = 0;
  for (; x ; x -= x & -x) {
    ans += c[x];
  }
  return ans;
}
```

单次查询前缀信息的时间复杂度为 $O(\log N)$。

区间查询 $[l, r]$ 之和则需要用两个前缀抵消得到，即 `get(r) - get(l - 1)`，此时要求树状数组支持的查询运算具有结合律和逆运算。

### 树状数组及其树形态和性质

[OI-Wiki 参考链接](https://oi-wiki.org/ds/fenwick/#%E6%A0%91%E7%8A%B6%E6%95%B0%E7%BB%84%E4%B8%8E%E5%85%B6%E6%A0%91%E5%BD%A2%E6%80%81%E7%9A%84%E6%80%A7%E8%B4%A8)

简单来说，在树状数组的树形态中，$x$ 的父亲为 $x + lowbit(x)$，并且只有 $x$ 的祖先（包括 $x$）$y$ 包含 $A_x$ 的信息。

注意到，当 $N$ 为 $2$ 的幂次时，形态是一棵完整的数；否则是森林。

### 单点修改

接下来我们需要考虑如何使用树状数组维护修改操作（如果没有修改操作，为什么不用前缀和呢？）

因此，如果我们需要修改 $A_x$，则：

- 修改 $c_x$。
- 令 $x \gets x + lowbit(x)$。如果 $x \gt N$，结束，否则执行上一步操作。

以单点加法操作为例，有如下代码：

```cpp
void add(int x, int v) {
  for (; x <= n; x += x & -x) {
    c[x] += v;
  }
}
```

单次单点修改，维护 $c$ 数组，时间复杂度为 $O(\log N)$。

### 其他修改查询操作

以上给出的代码仅是【单点加，区间和】的树状数组的写法，对于其他的单点修改、区间查询运算需要具体修改代码。

暂时不过多介绍，例如可以用树状数组维护支持单点修改的子段哈希值查询。

### 更多

以上代码，相当于是用树状数组维护了在原数组上的单点加和区间和运算。

## 洛谷 P3374 树状数组模板 1

!!! 题意

    单点加，区间和。

一开始初始化一个 $c_i$ 全为 $0$ 的树状数组，然后按上述代码进行模拟即可。时间复杂度为 $O(m \log n)$。

也可以是，将一开始的元素 $a_i$ 做 $n$ 次单点修改操作，然后模拟询问。时间复杂度为 $O((n + m) \log n)$。

??? 代码

    ```cpp
    #include <bits/stdc++.h>

    using namespace std;
    using ll = long long;

    const int MAXN = 5e5 + 1;

    struct Node {
      int n, a[MAXN];
      void init(int n) {
        this->n = n;
        for (int i = 1; i <= n; i++) {
          a[i] = 0;
        }
      }
      void add(int x, int v) {
        for (; x <= n; x += x & -x) {
          a[x] += v;
        }
      }
      int sum(int x) {
        int ans = 0;
        for (; x; x -= x & -x) {
          ans += a[x];
        }
        return ans;
      }
    } T;

    int n, m, a[MAXN];

    int main() {
      ios::sync_with_stdio(0), cin.tie(0);
      cin >> n >> m;
      T.init(n);
      for (int i = 1; i <= n; i++) {
        cin >> a[i];
        T.add(i, a[i]);
      }
      for (int i = 1, op, x, v, l, r; i <= m; i++) {
        cin >> op;
        if (op == 1) {
          cin >> x >> v;
          T.add(x, v);
        } else {
          cin >> l >> r;
          cout << T.sum(r) - T.sum(l - 1) << '\n';
        }
      }
      return 0;
    }
    ```

## 洛谷 P3368 树状数组模板 2

!!! 题意

    区间加，单点查。

注意到，在原数组上的区间加法操作，可以转化为原数组的差分数组上的两个差分点的修改操作，通过对差分数组求前缀和还原出原数组的数列。

因此我们使用树状数组维护差分数组，将原数组上的【区间加，单点查】的操作更改为【单点修改，前缀和】操作。

??? 代码

    ```cpp
    #include <bits/stdc++.h>

    using namespace std;
    using ll = long long;

    const int MAXN = 5e5 + 10;

    int n, m, a[MAXN];

    struct Fenwick {
      int n, a[MAXN];

      void init(int n) {
        this->n = n;
        for (int i = 1; i <= n; i++) {
          a[i] = 0;
        }
      }

      void add(int x, int v) {
        for (; x <= n; x += x & -x) {
          a[x] += v;
        }
      }

      int sum(int x) {
        int ans = 0;
        for (; x; x -= x & -x) {
          ans += a[x];
        }
        return ans;
      }
    } T;

    int main() {
      ios::sync_with_stdio(0), cin.tie(0);
      cin >> n >> m;
      for (int i = 1; i <= n; i++) {
        cin >> a[i];
      }
      T.init(n);
      for (int i = 1, op, l, r, v, x; i <= m; i++) {
        cin >> op;
        if (op == 1) {
          cin >> l >> r >> v;
          T.add(l, v), T.add(r + 1, -v);
        } else {
          cin >> x;
          cout << a[x] + T.sum(x) << '\n';
        }
      }
      return 0;
    }
    ```

## 未知来源题目

!!! 题意

    区间加，区间和。

## 洛谷 P1908 逆序对

!!! 题意

    给定一个长度为 $n$ 的正整数数组 $a$，求出其逆序对数量。

使用权值作为树状数组的下标来维护更多的信息。

逆序对的定义：对于一个数组 $a$，满足 $1 \le i \lt j \le n$ 且 $a_i \gt a_j$ 的数对 $(i, j)$ 被称为逆序对。

考虑朴素暴力做法，求出每个 $j$ 贡献的逆序对数量。

- 枚举 $j$，然后暴力求出 $1 \le i \lt j$ 时 $a_i \gt a_j$ 的 $i$ 的数量。

尝试定义一个桶数组 $cnt_x$，表示 $1 \le i \lt j$ 时 $a_i = x$ 的 $i$ 的数量。换言之，该桶数组描述了一个信息：$cnt_x$ 表示前 $j - 1$ 个元素中元素值为 $x$ 的元素数量。

- 该信息实际上可以看作为一个前缀信息，不过此题不需要着重用到这个点。

我们可以从小到大枚举 $j$，然后求出 $\sum \limits_{a_j \lt x \le \text{inf}} cnt_x$，在 $j$ 变为 $j + 1$ 之前，将 $cnt_{a_j}$ 加 $1$ 即可。这里的 $\text{inf}$ 表示 $a$ 数组中最大值。

令 $V$ 为值域范围。如果暴力维护桶数组，单次修改为 $O(1)$，而求和是 $O(V)$ 的。对于 $cnt$ 的部分来说，这是一个单点加、区间和（后缀和）模型，因此可以用树状数组维护 $cnt$ 桶数组。此时单点修改和前缀查询操作都降低为了 $O(\log V)$。

但是，空间复杂度为 $O(V)$，题目中的 $V = 10^9$，而题目中最多只有 $n = 5 \times 10^5$ 个元素，因此我们将原数组的元素离散化之后就能求解了。

最多只有 $n$ 种不同的值。此时，单次修改和前缀查询时间复杂度为 $O(\log n)$，而空间复杂度为 $O(n)$，可以接受。

??? 代码

    ```cpp
    #include <bits/stdc++.h>

    using namespace std;
    using ll = long long;

    const int MAXN = 5e5 + 1;

    int n, a[MAXN], b[MAXN];
    ll ans;

    struct Fenwick {
      int n, a[MAXN];

      void init(int n) {
        this->n = n;
        for (int i = 1; i <= n; i++) {
          a[i] = 0;
        }
      }

      void add(int x, int v) {
        for (; x <= n; x += x & -x) {
          a[x] += v;
        }
      }

      int sum(int x) {
        int ans = 0;
        for (; x; x -= x & -x) {
          ans += a[x];
        }
        return ans;
      }
    } T;

    int main() {
      ios::sync_with_stdio(0), cin.tie(0);
      cin >> n;
      T.init(n);
      ll ans = 0;
      for (int i = 1; i <= n; i++) {
        cin >> a[i];
        b[i] = a[i];
      }
      sort(b + 1, b + n + 1);
      for (int i = 1; i <= n; i++) {
        a[i] = lower_bound(b + 1, b + n + 1, a[i]) - b;
        ans += T.sum(n) - T.sum(a[i]);
        T.add(a[i], 1);
      }
      cout << ans;
      return 0;
    }
    ```

分析了这么多，简单来说就是一个权值当下标、用树状数组维护桶数组的模型技巧。

换句话说，本模型用于求解序列中有多少个元素的值小于等于当前元素 $x$。

## CSES 1145 LIS

使用树状数组优化 LIS 问题的转移。

令 $dp_i$ 表示末尾元素下标为 $i$ 的上升子序列的长度最大值。

显然有 $dp_i = \max \limits_{1 \le j \lt i, A_j \lt A_i} \{ dp_j \} + 1$。

观察到转移的限制条件 $1 \le j \lt i, A_j \lt A_i$，类似于逆序对问题的求解方法，权值当下标。

令 $len_x$ 表示前 $i - 1$ 个元素中末尾元素值为 $x$ 的上升子序列的长度最大值。则 $dp_i = \max \limits_{1 \le x \lt A_i} \{ len_x \} + 1$。

使用树状数组维护 $len_x$ 的单点修改和前缀最大值查询。