# ST 表和倍增思想

静态查询区间信息。使用了倍增思想。

## 概念

!!! 题目

    给定 $N$ 个元素 $A_i$，有 $Q$ 个询问，每次询问给出区间 $[l_i, r_i]$，请你求出区间最大值。$N, Q \le 10^5$。

如果使用暴力枚举，时间复杂度 $O(NQ)$ 必然超时。

我们可以使用倍增思想：预处理出所有长度为 $2^x$ 的区间的信息。

- 一般我们使用左端点 $l$ 和区间长度参数 $x$ 表示一个 $[l, l + 2^x - 1]$ 区间。
- 一个长度为 $2^x$ 的区间的最大值，显然可以由两个长度为 $2^{x - 1}$ 的区间的最大值合并得到。
- $x = 0$ 时是单位区间，手动初始化。

定义 $f_{j, i}$ 表示区间 $[i, i + 2 ^ j - 1]$ 的最大值：

- 初始化：$f_{0, i} = A_{i}$
- 递推：$f_{j, i} = \max \{ f_{j - 1, i}, f_{j - 1, i + 2 ^ {j - 1}} \}$

!!! 代码

    ```cpp
    #include <bits/stdc++.h>

    using namespace std;
    using ll = long long;

    const int MAXN = 1e5 + 1, MAXL = 17;

    int n, m, a[MAXN], f[MAXL][MAXN];
    int log_2[MAXN];

    void ST_init() {
      for (int i = 1; i <= n; i++) {
        f[0][i] = a[i];
      }
      for (int x = 1; x < MAXL; x++) {
        for (int i = 1; i + (1 << x) - 1 <= n; i++) {
          f[x][i] = max(f[x - 1][i], f[x - 1][i + (1 << x - 1)]);
        }
      }
      for (int i = 2; i <= n; i++) {
        log_2[i] = log_2[i >> 1] + 1;
      }
    }

    int query1(int l, int r) {  // 法1：倍增拼凑（要求运算满足结合律）
      int ans = 0;
      for (int i = MAXL - 1, d = r - l + 1; i >= 0; i--) {
        if (d >> i & 1) {
          ans = max(ans, f[i][l]);
          l += 1 << i;
        }
      }
      return ans;
    }

    int query2(int l, int r) {  // 法2：找出长度极大的 2^k 的前后缀区间进行拼凑（要求运算满足结合律和幂等律）
      int k = log2(r - l + 1);
      return max(f[k][l], f[k][r - (1 << k) + 1]);
    }

    int query3(int l, int r) {  // 法3：在法2的基础上优化常数
      int k = log_2[r - l + 1];
      return max(f[k][l], f[k][r - (1 << k) + 1]);
    }

    int main() {
      ios::sync_with_stdio(0), cin.tie(0);
      cin >> n >> m;
      for (int i = 1; i <= n; i++) {
        cin >> a[i];
      }
      ST_init();
      for (int i = 1, l, r; i <= m; i++) {
        cin >> l >> r;
        cout << query3(l, r) << '\n';
      }
      return 0;
    }
    ```

时间复杂度：预处理倍增数组（ST 表）$O(N \log N)$，单次询问时间复杂度 $O(1) - O(\log N)$。

空间复杂度：倍增数组 $O(N \log N)$。

## 思想

[OI-Wiki ST 表](https://oi-wiki.org/ds/sparse-table/)

### 前缀和与 ST 表

- 前缀和能优化区间查询，是基于【用两个前缀区间抵消重合部分得到区间信息】，因此要求运算满足结合律、交换律且有逆运算。而 $O(\log N)$ 倍增拼凑答案仅要求结合律，$O(1)$ 拼凑答案进一步要求幂等律。
- ST 表满足的常见的运算规则有：区间与，区间或，区间 GCD（区间异或）。
- 前缀和使用 $O(N)$ 时间预处理然后 $O(1)$ 时间回答询问，而 ST 表使用 $O(N \log N)$ 时间预处理做到 $O(\log N) - O(1)$ 时间回答询问。

### ST 表与倍增

ST 表是一种利用倍增思想对区间信息做预处理的数据结构，相对来说有先预处理再回答询问的步骤。

而倍增是一种思想，除了倍增预处理，还有倍增拼凑答案、按位枚举替代二分等思路。

### ST 表与线段树

- 代码实现上，ST 表更简单。
- 功能上，ST 表只支持不带修改的静态区间信息查询，而带插入、删除等增删改操作的区间查询更适合用线段树来实现。
- ST 表支持的运算有限，而支持单点修改的线段树只需要求运算满足结合律。

## CSES 1687 树上 K 级祖先

我们可以利用倍增思想尝试优化。找某个结点的 $k = 13$ 级父亲，依次找 $8, 4, 1$ 级父亲即可。

预处理出每个结点 $i$ 往上的 $2^j$ 级祖先 $f_{j, i}$：

- 初始化：$f_{0, i} = p_i$，其中 $p_i$ 表示 $i$ 的父亲。
- 递推：$f[j][i] = f[j - 1][f[j - 1][i]]$
- 用 $0$ 来表示根节点的父亲，用于处理越界。
- 回答询问时，需要倍增往上跳。
    - 每个结点的父亲唯一，但儿子不唯一。
 
预处理时间复杂度 $O(N \log N)$，单次回答询问时间 $O(\log N)$。空间复杂度 $O(N \log N)$。