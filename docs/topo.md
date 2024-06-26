# 拓扑排序

定义：在有向无环图（不一定是弱连通的）上，对于任意一条有向边 $u \to v$，$u$ 在拓扑序中的位置在 $v$ 的前面。

得到拓扑序的算法叫做拓扑排序算法。

## DFS

利用 dfs 序（出栈序）可以求出拓扑序，保证每个点只遍历一次。

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

### 记忆化搜索

以 01 背包为例。

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

## Kahn 算法

topological
