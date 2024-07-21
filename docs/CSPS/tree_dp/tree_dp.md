# 树形 DP

树形 DP，就是在树这个结构上做 DP。

在有根树上做 DP，拓扑序一般有两种情况：

- 从叶子到根的方向：此时可以把有根树看成一个经典的分治模型，我们需要求解每个子树的答案。对于当前结点的子树，可以分解并独立地求解出它的每个儿子子树的答案，然后再将答案汇总。也就是说，结点的信息由儿子的信息收集合并而成。
- 从根到叶子的方向：将序列上的 DP 特化到了树上，我们需要求解的是当前根到当前节点的信息。也就是说，结点的信息扩散给儿子。
    - 特化的理解：每个结点的父亲唯一，相当于我们要求每个结点到根结点的一条链上的 DP。

## 经典模型

### 洛谷 P1352 没有上司的舞会

!!! 题意

    给定 $N$ 个结点的一棵树，每个结点有一个权值。现在你可以选出一些点，并且需要满每条边的两个点最多只能选一个的限制。求出选出的点的最大权值和。$N \le 10^5$。

首先我们将 $1$ 设置为根，将其变为有根树模型，此时我们知道每个具体子树长什么样。

令 $dp_{i, 0}, dp_{i, 1}$ 分别表示选取或不选取结点 $i$ 时的以 $i$ 为根的子树的答案。

- 如果我们选择结点 $u$，那么 $u$ 的每个儿子结点都不能选，因此 $dp_{u, 1} = \sum \limits_{v \in son_u} dp_{v, 0}$。其中 $son_u$ 表示 $u$ 的儿子集合。
- 如果我们不选择结点 $u$，那么 $u$ 的每个儿子都可以是选或者不选，因此 $dp_{u, 0} = \sum \limits_{v \in son_u} \max \{ dp_{v, 0}, dp_{v, 1} \}$。

最终答案是 $\max\{ dp_{1, 0}, dp_{1, 1} \}$。我们可以对有根树遍历的同时进行求解，时空复杂度均为 $O(N)$。

### abc309_e

!!! 题意

    有一棵 $N$ 个结点的根为 $1$ 的有根树，有 $M$ 条信息：某结点有一个权值 $a_i$ 表示该结点可以“覆盖”它的 $a_i$ 代后代（子树中到当前结点距离不超过 $a_i$ 的点）。请你求出有多少结点被某个结点覆盖。

直接思考每个结点可以覆盖哪些后代求解起来比较困难。我们可以观察每个结点 $u$ 可以被哪些结点 $v$ 覆盖，发现 $v$ 一定是在 $u$ 到根的路径上。并且我们只需要找到 $a_v - dist(u, v)$ 最大的 $v$ 来覆盖 $u$，换言之 $a_v - dist(u, v)$ 是一种“势”，每往儿子走一步“势”就少 $1$。

令 $dp_u$ 表示 $u$ 的祖先（包含当前结点）$v$ 到当前结点的最大“势”（在定义上可以看成，$dp_u = \max \limits_{v \in anc_u} \{ a_v - dist_v \}$）。 

然后我们从上到下递推，令 $u$ 是当前结点，$fa_u$ 是当前结点的父亲，则 $dp_u = \max \{ dp_{fa_u} - 1, a_u\}$。

在树的遍历的过程中，从上往下做转移。时空复杂度均为 $O(N)$。

注意到在本题中，$fa_i \lt i$，所以从根到叶子的拓扑序就是 $1 \sim n$，我们可以直接使用循环的方式做 DP。

## 树背包

### 前置：洛谷 P1757 分组背包

!!! 题意

    经典的 01 背包问题，有 $n$ 个物品，每个物品有重量 $w_i$ 和价值 $v_i$，背包容量为 $m$，多加上一条限制：每个物品属于某组 $c_i$，有 $k$ 组物品，每组物品中至多选一个。$1 \le c_i \le 100$。

状态设计：$dp_{i, j}$ 表示前 $i$ 组物品选择重量为 $j$ 的物品的最大价值。

转移：枚举第 $i$ 组物品选择物品 $x$，$dp_{i, j} = \max \{ dp_{i - 1, j - w_x} + v_x \}$。

空间复杂度：有 $n$ 个物品组，每个物品组都需要记录容量为 $m$ 的背包信息，状态数 $O(km)$。

时间复杂度：枚举每组的背包容量，时间 $O(km)；$对于每个背包容量都转移 $n$ 次，时间 $O(nm)$；总时间 $O((n + k)m)$。

在实现时可以把组数这一维在数组中的表示去掉，此时注意状态的枚举顺序。

### 洛谷 P2014 选课

!!! 题意

    有 $N$ 门课程，已知一门课程的学分 $s_i$ 和最多一门先修课程。获得该门课程学分必须先获得先修课程学分。选择 $M$ 课程使得获得分数最大。$N, M \le 10^3$。

对先修课程和课程之间建图，可以发现整张图是一个根节点为 $0$ 的树+若干个环。环是不需要处理的，相当于我们想求得一个包含根节点的大小最多为 $M + 1$ 的连通块，使得连通块内点权和最大。

我们发现每个子树选择的课程门数对于当前树是有影响的，因此将状态设计为 $dp_{u, x}$ 表示以 $u$ 为根的、子树大小至多为 $x$ 的、必须包含 $u$ 的连通块的最大点权和，可以发现：

1. 包含 $u$ 的连通块可以由若干个包含 $u$ 的儿子 $v_i$ 的连通块加上当前点构成。
2. $u$ 的每个儿子子树之间是相互独立的，可以独立的求解 $dp_{v_i, x}$ 并且转移给根。
3. 对于儿子 $v$ 到 $u$ 的转移，我们可以枚举包含 $u$ 的连通块大小作为状态，枚举包含 $v$ 的连通块大小作为转移，即 $dp_{u, x} = \max \{ dp_{u, x}, dp_{u, x - y} + dp_{v, y} \}$。
4. $dp_{u, x}$（$x \ge 1$）对应的连通块必须包含 $u$，因此 $dp_{u, x}$ 初始化为 $s_u$。

```cpp
#include <bits/stdc++.h>

using namespace std;
using ll = long long;

const int MAXN = 3e2 + 10;

int n, m, a[MAXN], dp[MAXN][MAXN];
vector<int> g[MAXN];

void DP(int u, int v) {
  for (int x = m; x >= 1; x--) {        // 枚举状态，注意这里是倒序枚举，因为我们实际上消掉了“第几个儿子”这样的维度
    for (int y = 0; y <= x - 1; y++) {  // 枚举转移
      dp[u][x] = max(dp[u][x], dp[u][x - y] + dp[v][y]);
    }
  }
}

void dfs(int u, int f) {
  for (int i = 1; i <= m; i++) {
    dp[u][i] = a[u];
  }
  for (int v : g[u]) {
    if (v != f) {
      dfs(v, u);
      DP(u, v);
    }
  }
}

int main() {
  ios::sync_with_stdio(0), cin.tie(0);
  cin >> n >> m;
  m++;
  for (int i = 1, p; i <= n; i++) {
    cin >> p >> a[i];
    g[p].push_back(i);
  }
  dfs(0, -1);
  cout << dp[0][m];
  return 0;
}
```

空间复杂度：状态数 $O(NM)$。

时间复杂度：每条边对应一次转移，$O(NM^2)$。

### 洛谷 P1273 有线电视网

（选学，上下界优化）

对于上一题，DP 状态和转移的枚举其实是可以优化的。

1. $x$ 的上界为之前已考虑的子树的大小 $cnt$ 与当前子树大小 $sz_v$ 的和。 
2. $y$ 的上界为 $sz_v$。
3. $y$ 的下界为 $x - cnt$。

该优化仅限于状态是关于点数而不是点权和的。

```cpp
void DP(int u, int v) {
  for (int x = min(sz[u] + sz[v], m + 1); x >= 1; x--) {            // 优化 1
    for (int y = max(x - sz[u], 0); y <= min(sz[v], x - 1); y++) {  // 优化 2 和 3
      dp[u][x] = max(dp[u][x], dp[u][x - y] + dp[v][y]);
    }
  }
  sz[u] += sz[v];
}

void dfs(int u, int f) {
  for (int i = 1; i <= m; i++) {
    dp[u][i] = a[u];
  }
  sz[u] = 1;
  for (int v : g[u]) {
    if (v != f) {
      dfs(v, u);
      DP(u, v);
    }
  }
}
```

可以使用一些数学工具证明，上述时间复杂度为 $O(NM)$ 或 $O(N^2)$。

## 换根

### 前置：洛谷 P1364 医院设置

!!! 题意

    给定一棵大小为 $n$ 的**无根树**，每个结点有一个权值 $a_i$。请你确定一个树根，使得在有根树形态下 $\sum a_i \times dep_i$ 最小，其中 $dep_i$ 表示点 $i$ 的深度。$N \le 100$。

显然，我们可以枚举一个根，转化为有根树后

1. 做树的遍历，求出每个结点深度，进行求解。
2. 也可以做树 dp，令 $dp_i$ 表示以 $i$ 为根的子树中所有结点 $x$ 的 $\sum a_x \times dep_x$（注意这里的 $dep_x$ 是相对于子树根 $x$ 而不是树的根）。对于当前结点 $u$ 和每个儿子 $v$，有 $dp_u = \sum dp_v + sum_v$，其中 $sum_i$ 为 $i$ 的子树中的 $a_i$ 之和。

时间复杂度 $O(N^2)$。

### CSES 1133 距离和

!!! 题意

    给出一棵大小为 $n$ 的树，求出每个结点到其他结点的距离和。$n \le 10^5$。

如果每次枚举根再做树 dp，时间复杂度 $O(n^2)$ 显然超时。

对于本题定义一个新概念：父亲子树（画图解释，与儿子子树区别）。令 $ans_i$ 表示 $i$ 对应的答案。

我们先以任意一个点 $u$ 为根，求解出 $u$ 到其他点的距离和。

- 令 $dp_i$ 表示 $i$ 到子树中其他节点的距离和。
- 对于 $u$ 和他的若干个儿子 $v$，$dp_u = \sum dp_v + sz_v$，其中 $sz_i$ 表示 $i$ 子树的大小。
- $ans_u$ 就是 $dp_u$

我们发现，当树的根从 $u$ 变为他的一个儿子 $v$ 时，$ans_u$ 和 $ans_v$ 之间会有以下关系：

- $ans_v$ 在 $ans_u$ 的基础之上，少了一个 $sz_v$，多了一个 $v$ 的父亲子树到 $v$ 的距离 $n - sz_v$。

我们先以 $1$ 为根，做一次树 DP（从下至上）求出 $ans_1 = dp_1$。然后再做一次树 DP（从上至下），对于点 $u$ 和他的儿子 $v$，将 $ans_u$ 的答案进行修改后给到 $ans_v$。

- 其实可以不用 $ans$ 数组，只要每次将 $v$ 的父亲子树的信息记录并转移给 $dp_v$ 即可。

!!! 代码

    === "代码 1"

        ```cpp
        #include <bits/stdc++.h>

        using namespace std;

        const int MAXN = 2e5 + 1;
        using ll = long long;

        struct Node {
          int v, w;
        };

        int n, c[MAXN];
        ll dp[MAXN], sz[MAXN], ans[MAXN];
        vector<Node> g[MAXN];

        void dfs1(int u, int f) {
          sz[u] = 1;
          for (auto e : g[u]) {
            if (e.v != f) {
              dfs1(e.v, u);
              sz[u] += sz[e.v];
              dp[u] += dp[e.v] + sz[e.v];
            }
          }
        }

        void dfs2(int u, int f) {
          for (auto e : g[u]) {
            if (e.v != f) {
              ans[e.v] = ans[u] + n - 2 * sz[e.v];
              dfs2(e.v, u);
            }
          }
        }

        int main() {
          ios::sync_with_stdio(0), cin.tie(0);
          cin >> n;
          for (int i = 1, u, v, w = 1; i < n; i++) {
            cin >> u >> v;
            g[u].push_back({v, w}), g[v].push_back({u, w});
          }
          dfs1(1, 0);
          ans[1] = dp[1];
          dfs2(1, 0);
          for (int i = 1; i <= n; i++) {
            cout << ans[i] << ' ';
          }
          return 0;
        }
        ```

    === "代码 2"

        ```cpp
        #include <bits/stdc++.h>

        using namespace std;

        const int MAXN = 2e5 + 1;
        using ll = long long;

        struct Node {
          int v, w;
        };

        int n, c[MAXN];
        ll dp[MAXN], sz[MAXN], ans[MAXN];
        vector<Node> g[MAXN];

        void dfs1(int u, int f) {
          sz[u] = 1;
          for (auto e : g[u]) {
            if (e.v != f) {
              dfs1(e.v, u);
              sz[u] += sz[e.v];
              dp[u] += dp[e.v] + sz[e.v];
            }
          }
        }

        void dfs2(int u, int f, ll s) {  // s 是父亲子树（父亲是 f）到 u 的答案
          ans[u] = dp[u] + s;
          // dp[u] += s;
          for (auto e : g[u]) {
            if (e.v != f) {
              dfs2(e.v, u, ans[u] - dp[e.v] + n - 2 * sz[e.v]);
              // dfs2(e.v, u, dp[u] - dp[e.v] + n - 2 * sz[e.v]);
            }
          }
        }

        int main() {
          ios::sync_with_stdio(0), cin.tie(0);
          cin >> n;
          for (int i = 1, u, v, w = 1; i < n; i++) {
            cin >> u >> v;
            g[u].push_back({v, w}), g[v].push_back({u, w});
          }
          dfs1(1, 0);
          dfs2(1, 0, 0);
          for (int i = 1; i <= n; i++) {
            cout << dp[i] << ' ';
          }
          return 0;
        }
        ```