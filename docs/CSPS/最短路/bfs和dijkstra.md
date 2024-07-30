# bfs 和 dijkstra

学习这两种算法，需要先从状态转移视角打好基础，然后学习图论建图技巧，然后通过最短路树等学习到构造、证明、最短路树上 DP。

## BFS

当最优化属性值变劣的程度一致时（例如最短路，最小化属性下，每次转移最小化属性 $+1$），那么就可以考虑使用广搜。由于每次变劣的程度一致，可以使用队列来优化查找最短路最小的点。

使用广搜后，状态优化为 $(a, b, c, d, e)$，$f$ 是优化后的状态的最优化属性，用 $dist[a][b][c][d][e]$ 来表示 $f$。

```cpp
void Record(新状态，新状态的层数) {  // 尝试记录新状态
  if (x 非法，或 x 已被记录) {
    return;
  }
  记录新状态及其所在层数;
  将新状态压入状态队列的队尾;
}

Record(初始状态, 0);
while (状态队列不为空){
  取出队头，即当前状态 x;
  for (x 转移出的每个新状态 y){
    Record(新状态 y, x 所在层数 + 1);
  }
}
```

### 代码

```cpp
#include<bits/stdc++.h>

using namespace std;

const int N = 1e5 + 5;

int n, m;
int ans[N], pre[N];  // pre 记录当前点是由哪个点转移而来的，换言之记录了 bfs 树中每个结点的父亲
vector<int> G[N];

struct Node{
  int x;
  int step;
};
queue<Node> q;

void Record(int v, int step, int u){
  if(ans[v] != -1){
    return;
  }
  ans[v] = step, pre[v] = u;
  q.push({v, step});
}

void bfs(int x){
  Record(x, 0, 0);
  while(!q.empty()){
    Node u = q.front();
    q.pop();
    for(int v : G[u.x]){
      Record(v, u.step + 1, u.x);
    }
  }
}

void print(int u){
  if(!u){
    return;
  }
  print(pre[u]);
  cout << u << " ";
}

int main(){
  cin >> n >> m;
  for(int i = 1, u, v; i <= m; i++){
    cin >> u >> v;
    G[u].push_back(v);
    G[v].push_back(u);
  }
  fill(ans + 1, ans + 1 + n, -1);
  bfs(1);
  if(ans[n] == -1){
    cout << "IMPOSSIBLE";
    return 0;
  }
  cout << ans[n] + 1 << "\n";
  print(n);
  return 0;
}
```

### 特征

* 本质是对状态转移图按层（分层）遍历。
* 第一次遍历到某个状态时，就得到了它的最优化属性值。
* 队列中所有状态的最优化属性值具有单调性和两段性。
* 从 bfs 树的角度考虑，原图上的边只会在同层点或相邻两层点之间。

### 时间复杂度

每个状态求解一次，每个转移进行一次，总时间 $O(N + M)$，其中 $N, M$ 分别为状态数、转移数。

## dijkstra

dijkstra 算法适用于边权都是非负数的图，步骤如下：

1. 对于源点 $S$，$D(S) = 0$。对于其他点 $u$，$D(u) = +\infty$​​。
2. 不断重复以下操作 $n$ 次（$n - 1$ 次），直到所有点都被标记过。
3. 找出一个点 $u$，$u$ 是在所有未被标记过的点中 $D(u)$ 最小的，然后标记点 $u$ 为已求解过最短路径的结点。即距离所有未标记的点中距离源点最近的点。
4. 对于起点为 $u$ 的所有边 $u \to v$​，如果该边不满足三角不等式，则执行松弛操作。

dijkstra 算法基于贪心思想：

- 每次确定离源点距离最近的点。由于边权都是非负数，每次被确定过的点的距离不可能在后续中被其他点更新。
- 源点只能通过已确定的点来到达其他点。
- 确定了新的点 $u$，就要用它来更新到 $u$ 的邻点 $v$ 的最短路长度。

尝试举出负边权情况下 dijkstra 失效的例子。

```
void dijkstra() {
  对于源点 s, d[s] = 0，否则 d[s] = +infinity
	执行以下步骤 n 次
  	找到一个未被标记过的点中最短路长度最小的点 u
  	标记 u
  	对于起点为 u 的每条边 u->v
  		尝试进行松弛
}
```

### 实现 1

暴力枚举寻找 $u$，时间复杂度为 $O(N^2)$，适用于稠密图。

```cpp
int Find() {
  int p = 0;
  for (int i = 1; i <= n; i++) {
    if (!vis[i] && dis[i] < dis[p]) {
      p = i;
    }
  }
  return p;
}

void dij() {
  fill(dis, dis + n + 1, INT_MAX);
  dis[s] = 0;
  for (int i = 1; i < n; i++) {
    int u = Find();
    vis[u] = 1;
    for (const auto &e : g[u]) {
      dis[e.v] = min(dis[e.v], dis[u] + e.w);  // 不需要判断邻点是否为已确定过最短路的点
    }
  }
}
```

### 实现 2：堆优化

洛谷 P4779。

使用二叉堆快速寻找 $u$。

- 二叉堆中元素记录每个点及源点到该点的距离，即状态 $(i, l)$。
- 每次寻找 $u$ 就是弹出堆顶。
- 执行松弛操作时修改二叉堆中对应的元素。

时间复杂度 $O((N + M) \log N)$。

实现中常用优先队列代替二叉堆，此时无法直接修改二叉堆中元素，因此时间复杂度为 $O(M \log M)$。

也可以把 `set` 视为二叉堆，时间复杂度 $O((N + M) \log N)$，但常数大。

该优化适用于稀疏图。以下代码为优先队列版本的两种代码，一种更接近历史上 dijkstra 算法（具有松弛思想），另一种则是用状态转移的角度来理解的代码。

!!! 代码

    === "常数较小的代码（更接近历史上 dijkstra 算法）"

        ```cpp
        struct Node {
          int u, w;  // 点，源点到该点的距离值
          bool operator < (const Node &i) const {
            return w > i.w;
          }
        };

        struct Edge {
          int v, w;  // 一条边的终点，边权
        };

        int dis[MAXN];  // 记录最短路的长度
        int vis[MAXN];  // 标记是否已确定最短路

        priority_queue<Node> pq;  // 按 w 排序

        void dij(int s) {
          fill(dis + 1, dis + n + 1, INT_MAX);  // distance
          dis[s] = 0, pq.push({s, 0});
          while (!pq.empty()) {
            Node now = pq.top();  // 取出优先队列中距离值最小的点
            pq.pop();
            if (vis[now.u]) {
              continue;
            }
            vis[now.u] = 1;
            for (Edge e : g[now.u]) {
              if (dis[e.v] > now.w + e.w) {  // 松弛操作
                dis[e.v] = now.w + e.w, pq.push({e.v, now.w + e.w});
              }
            }
          }
        }
        ```

    === "简单好写的代码——偏向状态转移思想"

        ```cpp
        struct Node {
          int u, w;  // 点，源点到该点的距离值
          bool operator < (const Node &i) const {
            return w > i.w;
          }
        };

        struct Edge {
          int v, w;  // 一条边的终点，边权
        };

        int dis[MAXN];

        priority_queue<Node> pq;  // 按 w 排序

        void dij(int s) {
          fill(dis + 1, dis + n + 1, INT_MAX);  // distance
          pq.push({s, 0});
          while (!pq.empty()) {
            Node now = pq.top();  // 取出优先队列中距离值最小的点
            pq.pop();
            if (dis[now.u] != INT_MAX) {
              continue;
            }
            dis[now.u] = now.w;  // 第一次取出某结点时是最短的
            for (Edge e : g[now.u]) {
              pq.push({e.v, now.w + e.w});
            }
          }
        }
        ```

与 BFS 进行对比：

- BFS 能保证第一次转移到的状态就是最优状态，DIJ 不能
- DIJ 保证第一次取出的状态是最优的状态

### 常见错误

以下代码是超时的。

```cpp
struct Node {
  int u, w;  // 点，源点到该点的距离值
  bool operator<(const Node &i) const {
    return w > i.w;
  }
};

struct Edge {
  int v, w;  // 一条边的终点，边权
};

int dis[MAXN];  // 记录最短路的长度
int vis[MAXN];  // 标记是否已确定最短路

priority_queue<Node> pq;  // 按 w 排序

void dij(int s) {
  fill(dis + 1, dis + n + 1, INT_MAX);  // distance
  dis[s] = 0, pq.push({s, 0});
  while (!pq.empty()) {
    Node now = pq.top();  // 取出优先队列中距离值最小的点
    pq.pop();
    if (now.w > dis[now.u]) {  // 写 > 会超时，写 >= 也是错误的
      continue;
    }
    for (Edge e : g[now.u]) {
      if (dis[e.v] > now.w + e.w) {  // 松弛操作
        dis[e.v] = now.w + e.w, pq.push({e.v, now.w + e.w});
      }
    }
  }
}
```

