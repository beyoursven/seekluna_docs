# 拓扑排序

（topological sort）

定义：在有向无环图（directed acyclic grpah, DAG）（不一定是弱连通的）上，对于任意一条有向边 $u \to v$，$u$ 在拓扑序中的位置在 $v$ 的前面。

得到拓扑序的算法叫做拓扑排序算法。

令 $n$ 和 $m$ 分别表示点数和边数。除非特殊说明，下面的图的描述默认均为 DAG。

`in degree`，`out degree`，`degree`

## 求解拓扑序

### Kahn 算法

思想：每次找到一个入度为 $0$ 的点，就可以把它加入到拓扑序中，并且删掉这个点和它的出边。

上面 DFS 的实现也可以理解为每次找到一个出度为 $0$ 的点。

算法步骤如下：

- 一开始存储所有入度为 $0$ 的结点到容器 $q$ 中。
- 重复以下操作直到容器 $q$ 为空：
    - 从 $q$ 中取出一个结点 $u$，加入到拓扑序中。
    - 删除结点 $u$ 及其出边 $u \rightarrow v$：
        - $v$ 的入度减一。
        - 如果 $v$ 的入度为 $0$，将其加入 $q$ 中。

我们可以使用任何一个容器来模拟算法。每个点取出一次，每条边删除一次，时间复杂度 $O(n + m)$。

??? 代码

    ```cpp
    int n, m;
    bool flag;  // 有向图是否有环
    vector<int> ans, g[MAXN];
    int ind[MAXN];  // 入度
    queue<int> que;

    void topo_sort() {
      for (int i = 1; i <= n; i++) {
        if (!ind[i]) {
          que.push(i);
        }
      }
      while (!que.empty()) {
        int u = que.front();
        que.pop();
        ans.push_back(u);
        for (int v : g[u]) {
          ind[v]--;
          if (!ind[v]) {
            que.push(v);
          }
        }
      }
      for (int x : ans) {
        cout << x << ' ';
      }
    }
    ```

### DFS

利用 dfs 序（出栈序，出栈时间戳）可以求出拓扑序，保证每个点只遍历一次。

```cpp
vector<int> ord;  // order
void dfs(int u) {
  if (vis[u]) {
    return ;
  }
  vis[u] = 1;
  for (int v : g[u]) {
    dfs(v);
  }
  ord.push_back(u);  // u 的所有后继都在 u 之前加入
}

for (int i = 1; i <= n; i++) {
  dfs(i);  // i 不一定是入度为 0 的点
}

// 如果不翻转，求了一个当前 DAG 的反图的拓扑序
// 如果是反图，按照上述做法，可以不用翻转
reverse(ord.begin(), ord.end());  // 得到拓扑序
```

请和记忆化搜索联系起来理解。

## 拓扑序的一些构造

### 存在性与环

只有在 DAG 上才存在拓扑序，换言之如果如果有向图上存在环，那么拓扑序是不存在的。

我们可以在求解拓扑序的过程中判断环：

- kahn 算法：如果最终在拓扑序中的点数少于 $n$ 个，意味着有向图上存在环。
- dfs：如果在 dfs 过程中遇到了一个在搜索路径上的点，意味着有向图上存在环。

kahn 算法的实现较为简单。我们将给出 dfs 找一个环的方法。

??? dfs 找环

    ```cpp
    vector<int> path;
    vector<int> cycle;
    bool dfs(int u) {
      if (vis[u]) {
        if (vis[u] == 1) {  // u 不在拓扑序中（u 在搜索路径上）
          cycle.push_back(u);
          for (int i = path.size() - 1; i >= 0; i--) {
            cycle.push_back(path[i]);
            if (path[i] == u) {
              break;
            }
          }
        }
        return 1;
      }
      path.push_back(u);
      vis[u] = 1;  // 标记结点已搜索但未在拓扑序中（标记结点在搜索路径上）
      for (int v : g[u]) {
        if (dfs(v)) {
          return 1;
        }
      }
      ord.push_back(u);  // u 的所有后继都在 u 之前加入
      vis[u] = -1;  // 结点 u 及其之后的部分都在拓扑序中（标记结点不在搜索路径上）
      path.pop_back();
      return 0;
    }
    ```

    ```cpp
    void dfs(int u) {
      if (vis[u]) {
        if (vis[u] == 1) {  // 找到了环
          return ;
        }
      }
      vis[u] = 1;  // 标记点已搜过，且在搜索路径上
      for (int v : g[u]) {
        dfs(v);
      }
      vis[u] = -1;  // 标记点不在搜索路径上但已搜过
    }
    ```

### 唯一性

1. 在 kahn 算法执行过程中，容器中的点数始终为 $1$ 等价于拓扑序唯一。
2. DAG 中所有路径长度的最大值为 $n - 1$ 等价于拓扑序唯一。

给出方法 2 的两种代码。

??? 代码

    === "kahn"

        ```cpp
        int dp[MAXN], ind[MAXN];
        bool kahn() {
          queue<int> que;
          for (int i = 1; i <= n; i++) {
            if (!ind[i]) {
              que.push(i);
            }
          }
          while (que.size()) {
            int u = que.front();
            que.pop();
            ans = max(ans, dp[u]);
            for (int v : g[u]) {
              dp[v] = max(dp[v], dp[u] + 1);
              --ind[v];
              if (!ind[v]) {
                que.push(v);
              }
            }
          }
          return ans == n - 1;
        }
        ```
    === "dfs"

        ```cpp
        int dfs(int u) {
          if (dp[u] != -1) {
            return dp[u];
          }
          dp[u] = 0;
          for (int v : g[u]) {
            dp[u] = max(dp[u], dfs(v) + 1);
          }
          return dp[u];
        }

        for (int i = 1; i <= n; i++) {
          dp[i] = -1;
        }
        int ans = 0;
        for (int i = 1; i <= n; i++) {
          ans = max(ans, dfs(i));
        }
        cout << (ans == n - 1);
        ```

### 字典序最小的拓扑序

在 kahn 算法中只要每次取出的是入度为 $0$ 的结点，容器是可以任意的，因此使用小根堆优先队列代替队列容器即可。

### 求出所有可能的拓扑序

有 $n$ 个孤立的点的图，拓扑序种数为 $N!$。

使用排列搜索，每次选择一个入度为 $0$ 且不在拓扑序中的点，在搜下个数字前维护每个点的入度。

```cpp
vector<int> ord, g[MAXN];
int ind[MAXN], vis[MAXN];
void dfs(int x) {
  if (x == n + 1) {
    print();
    return ;
  }
  for (int i = 1; i <= n; i++) {
    if (!ind[i] && !vis[i]) {
      ord.push_back(i);
      for (int j : g[i]) {
        ind[j]--;
      }
      vis[i] = 1;
      dfs(x + 1);
      ord.pop_back();
      for (int j : g[i]) {
        ind[j]++;
      }
      vis[i] = 0;
    }
  }
}

dfs(1);
```

## 递推和 DP

递推和 DP 的大前提是无后效性，即状态转移图是 DAG，状态转移的先后顺序就是拓扑序。

### 循环

我们实现 kahn 算法时，既可以先求出拓扑序，然后再做 DP，也可以边求拓扑序边 DP。下面给出 CSES 1681 的两种实现代码。

??? 源代码

    === "先求拓扑序再 DP"

        ```cpp
        #include <bits/stdc++.h>

        using namespace std;
        using ll = long long;

        const int MAXN = 1e5 + 1, MOD = 1e9 + 7;

        int n, m, ind[MAXN], dp[MAXN];
        vector<int> g[MAXN], ord;

        void kahn() {
          queue<int> que;
          for (int i = 1; i <= n; i++) {
            if (!ind[i]) {
              que.push(i);
            }
          }
          while (que.size()) {
            int u = que.front();
            que.pop();
            ord.push_back(u);
            for (int v : g[u]) {
              if (!--ind[v]) {
                que.push(v);
              }
            }
          }
        }

        int main() {
          ios::sync_with_stdio(0), cin.tie(0);
          cin >> n >> m;
          for (int i = 1; i <= m; i++) {
            int u, v;
            cin >> u >> v;
            g[u].push_back(v), ind[v]++;
          }
          kahn();
          dp[1] = 1;
          for (int i : ord) {  // 按顺序处理拓扑序中的点
            for (int j : g[i]) {
              (dp[j] += dp[i]) %= MOD;
            }
          }
          cout << dp[n];
          return 0;
        }
        ```

    === "边求拓扑序边 DP"

        ```cpp
        #include <bits/stdc++.h>

        using namespace std;
        using ll = long long;

        const int MAXN = 1e5 + 1, MOD = 1e9 + 7;

        int n, m, ind[MAXN], dp[MAXN];
        vector<int> g[MAXN];

        void kahn() {
          queue<int> que;
          for (int i = 1; i <= n; i++) {
            if (!ind[i]) {
              que.push(i);
            }
          }
          dp[1] = 1;
          while (que.size()) {
            int u = que.front();
            que.pop();
            for (int v : g[u]) {
              (dp[v] += dp[u]) %= MOD;
              if (!--ind[v]) {
                que.push(v);
              }
            }
          }
        }

        int main() {
          ios::sync_with_stdio(0), cin.tie(0);
          cin >> n >> m;
          for (int i = 1; i <= m; i++) {
            int u, v;
            cin >> u >> v;
            g[u].push_back(v), ind[v]++;
          }
          kahn();
          cout << dp[n];
          return 0;
        }
        ```

### 记忆化搜索

使用 DFS 求解拓扑序，我们是先将 $u$ 的所有后续结点先放入拓扑序中，再将 $u$ 放入拓扑序中。

记忆化搜索、分治实际上是逆着拓扑序分解问题、然后再正着拓扑序求解每个问题。

以 01 背包为例。

??? 代码

    === "暴搜"

        ```cpp
        // 纯搜索，纯暴搜
        void dfs(int x, int sumw, int sumv) {
          if (x == n + 1) {
            if (sumw <= m) {
              ans = max(ans, sumv);
            }
            return ;
          }
          dfs(x + 1, sumw + w[x], sumv + v[x]);
          dfs(x + 1, sumw, sumv);
        }
        ```

    === "记忆化搜索"

        ```cpp
        // 记忆化搜索
        int dfs(int x, int sumw) {
          if (x == n + 1) {
            return sumw <= m ? 0 : -INF;
          }
          if (dp[x][sumw] != -1) {
            return dp[x][sumw];
          }
          return dp[x][sumw] = max(dfs(x + 1, sumw), dfs(x + 1, sumw + w[x]) + v[x]);
        }
        ```

### 例题：洛谷 P1807

有三种实现方法：记忆化、kahn、直接枚举拓扑序。