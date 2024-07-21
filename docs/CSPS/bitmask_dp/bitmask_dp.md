# 状压 DP

位运算——压缩表示——状压枚举——搜索——状压 DP

## 前置

[前置知识——位运算](../../CSPJ/数学/位运算.md)

[前置知识——压缩表示和状压枚举](../../CSPJ/搜索/深度优先搜索.md)

### 题目

洛谷 P1157 洛谷 P1706：状压枚举

abc358_c, abc356_c, 洛谷 B3618：各种位运算 + 状压枚举

### 一些位运算小技巧

`lowbit(x) = x & -x`：取出 `x` 的二进制表示中最低位 `1` 对应的位权。

`__builtin_popcount(x), __builtin_popcountll(x)`：统计 `x` 的二进制表示中 `1` 的个数。

`__builtin_ctz(x), __builtin_ctzll(x)`：统计 `x` 的二进制表示中后缀 `0` 的个数，可以用于获取最低位 `1` 的位号。

`__builtin_clz(x), __builtin_clzll(x)`：统计 `x` 的二进制表示中前缀 `1` 的个数。

上述函数时间复杂度 $O(1)$，可以在 NOI 系列赛事中使用。

## 状压 DP

1. 状态压缩是正解，但是很难，考场上策略是先写搜索，加入剪枝，尝试记忆化搜索
2. 正解是其他算法，而状态压缩是部分分，考察的就是写状压 DP、搜索、状压枚举的熟练度
3. 记忆化搜索可以避免无效的状态转移

### 全排列搜索

全排列搜索其实可以不用标记数组，我们可以用一个 $n$ 位二进制数表示每个数字是选还是没选，利用位运算实现标记数组已选以及查找未选数字。

```cpp
#include <bits/stdc++.h>

using namespace std;

int n, ans;
int a[15];  // 状态

// 生成全排列中的第 t 个数字
// 状态：全排列序列，state 为当前选了哪些数字的压缩表示
void S(int t, int state) {
  if (t == n + 1) {  // 生成了全排列
    for (int i = 1; i <= n; i++) {
      cout << setw(5) << a[i];  // 5 个场宽
    }
    cout << '\n';
    return;
  }
  for (int i = 1; i <= n; i++) {  // 转移：往序列添加一个没有出现过的数字
    if (!(state >> (i - 1) & 1)) {
      a[t] = i;                        // 记录序列
      S(t + 1, state | 1 << (i - 1));  // 确定下一位数字
    }
  }
}

int main() {
  cin >> n;
  S(1, 0);
  return 0;
}
```

### 洛谷 P1433 吃奶酪

状态：$(S, i, sum)$ 已吃过的奶酪的集合为 $S$，最后一次吃的是奶酪 $i$，已走过的总距离为 $sum$，其中 $i \in S$。

转移：$(S, i, sum) \to (S \bigcup \{ j \}, j, sum + dist(i, j))$，其中 $j \not \in S$。

最优化属性：$sum$。

最优子结构性质：显然当 $S, i$ 一定时，$sum$ 越小越好。

分组拓扑序：集合的大小从小到大；将集合表示为状压表示后，$S$ 的状压表示从小到大。

- 后续能走的路径方法，与之前的吃奶酪的顺序无关。

空间复杂度：状态数 $O(2^N \times N)$。

时间复杂度：每个状态最多 $N$ 次转移，总时间为 $O(2^N \times N^2)$。

当你看到 $N <= 20$ 以内的数据，就可以考虑使用状压了。

??? 代码

    === "暴搜剪枝"

        ```cpp
        #include <bits/stdc++.h>

        using namespace std;

        int n;
        double x[20], y[20];
        double ans = 1e9;

        double sqr(double x) {
          return x * x;
        }

        double dist(double x1, double y1, double x2, double y2) {
          return sqrt(sqr(x1 - x2) + sqr(y1 - y2));
        }

        void dfs(int state, int last, double sum) {
          if (sum >= ans) {
            return;
          }
          if (state == (1 << n + 1) - 1) {
            ans = min(ans, sum);
            return;
          }
          for (int i = 1; i <= n; i++) {
            if (!(state >> i & 1)) {
              dfs(state | 1 << i, i, sum + dist(x[last], y[last], x[i], y[i]));
            }
          }
        }

        int main() {
          cin >> n;
          for (int i = 1; i <= n; i++) {
            cin >> x[i] >> y[i];
          }
          dfs(1, 0, 0);
          cout << fixed << setprecision(2);
          cout << ans;
          return 0;
        }
        ```
    === "记忆化"

        ```cpp
        #include <bits/stdc++.h>

        using namespace std;

        const int MAXN = 20;
        const double INF = 1e9;

        int n;
        double dp[1 << MAXN][MAXN];
        double x[MAXN], y[MAXN];
        double ans = INF;

        double sqr(double x) {
          return x * x;
        }

        double dist(double x1, double y1, double x2, double y2) {
          return sqrt(sqr(x1 - x2) + sqr(y1 - y2));
        }

        double dfs(int state, int last) {
          if (state == (1 << n + 1) - 1) {
            return 0;
          }
          if (dp[state][last] != INF) {
            return dp[state][last];
          }
          for (int i = 1; i <= n; i++) {
            if (!(state >> i & 1)) {
              dp[state][last] = min(dp[state][last], dfs(state | 1 << i, i) + dist(x[last], y[last], x[i], y[i]));
            }
          }
          return dp[state][last];
        }

        int main() {
          cin >> n;
          for (int i = 1; i <= n; i++) {
            cin >> x[i] >> y[i];
          }
          for (int i = 0; i < (1 << n + 1); i++) {
            for (int j = 0; j <= n; j++) {
              dp[i][j] = INF;
            }
          }
          cout << fixed << setprecision(2);
          cout << dfs(1, 0);
          return 0;
        }
        ```

    === "状压 DP"

        ```cpp
        #include <bits/stdc++.h>

        using namespace std;

        const int MAXN = 15;
        const double INF = 1e9;

        int n;
        double dp[1 << MAXN][MAXN];
        double x[MAXN], y[MAXN];
        double ans = INF;

        double sqr(double x) {
          return x * x;
        }

        double dist(double x1, double y1, double x2, double y2) {
          return sqrt(sqr(x1 - x2) + sqr(y1 - y2));
        }

        int main() {
          cin >> n;
          for (int i = 0; i < n; i++) {
            cin >> x[i] >> y[i];
          }
          for (int i = 0; i < (1 << n); i++) {
            for (int j = 0; j < n; j++) {
              dp[i][j] = INF;
            }
          }
          for (int i = 0; i < n; i++) {
            dp[1 << i][i] = dist(0, 0, x[i], y[i]);
          }
          for (int state = 1; state < (1 << n); state++) {  // 枚举拓扑序
            for (int i = 0; i < n; i++) {                   // 枚举状态
              if (state >> i & 1) {
                for (int j = 0; j < n; j++) {  // 枚举转移
                  if (!(state >> j & 1)) {
                    dp[state | 1 << j][j] = min(dp[state | 1 << j][j], dp[state][i] + dist(x[i], y[i], x[j], y[j]));
                  }
                }
              }
            }
          }
          double ans = INF;
          for (int i = 0; i < n; i++) {
            ans = min(ans, dp[(1 << n) - 1][i]);
          }
          cout << fixed << setprecision(2);
          cout << ans;
          return 0;
        }
        ```


