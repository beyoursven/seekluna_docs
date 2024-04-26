# 记忆化

记忆化搜索是一种通过记录已经遍历过的状态的信息，从而避免对同一状态重复遍历的搜索实现方式。

因为记忆化搜索确保了每个状态只访问一次，它也是一种常见的动态规划实现方式。

## 洛谷 P1434 滑雪

??? 形式化题意

    给定 $N \times M$ 大小的数字矩阵，你可以选定一个格子出发，每次走到一个上下左右相邻的数字比当前格子小的格子上。请求出行走的最长的路径。

### 朴素 DFS

写搜索，不丢人。

在搜索时记录以下几个状态：当前格子坐标，行走的长度，数字矩阵。

??? DFS 代码

    ```cpp
    #include <iostream>

    using namespace std;

    const int N = 110;
    const int dx[5] = {0, 0, 1, -1};
    const int dy[5] = {1, -1, 0, 0};

    int r, c, ans, a[N][N];

    void S(int x, int y, int s){
      if (x < 1 || x > r || y < 1 || y > c){
        return ;
      }
      ans = max(ans, s);
      for (int i = 0; i < 4; i++){
        if (a[x + dx[i]][y + dy[i]] < a[x][y]){
          S(x + dx[i], y + dy[i], s + 1);
        }
      }
    }

    int main(){
      cin >> r >> c;
      for (int i = 1; i <= r; i++){
        for (int j = 1; j <= c; j++){
          cin >> a[i][j];
        }
      }
      for (int i = 1; i <= r; i++){
        for (int j = 1; j <= c; j++){
          S(i, j, 1);
        }
      }
      cout << ans;
      return 0;
    }
    ```

时间复杂度为指数级别，显然不能通过。

### 记忆化

我们发现在搜索过程中，某些状态（格子）会重复经过多次，从而做了许多无用的搜索。不妨尝试加入记忆化数组，发现 AC。

??? 记忆化代码

    ```cpp
    #include <iostream>
    #include <algorithm>

    using namespace std;

    const int MAXN = 1010;
    const int dx[4] = {0, 0, 1, -1};
    const int dy[4] = {1, -1, 0, 0};

    int n, m, a[MAXN][MAXN], dp[MAXN][MAXN], ans;

    int S(int x, int y) {
      if (dp[x][y] != -1) {
        return dp[x][y];
      }
      dp[x][y] = 1;
      for (int i = 0; i < 4; i++) {
        int nx = x + dx[i], ny = y + dy[i];
        if (nx >= 1 && nx <= n && ny >= 1 && ny <= m && a[nx][ny] > a[x][y]) {
          dp[x][y] = max(dp[x][y], S(nx, ny) + 1);
        }
      }
      return dp[x][y];
    }

    int main() {
      cin >> n >> m;
      for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
          cin >> a[i][j];
          dp[i][j] = -1;
        }
      }
      for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
          ans = max(ans, S(i, j));
        }
      }
      cout << ans;
      return 0;
    }
    ```

??? 可以使用记忆化的原因

    此题的状态转移是存在拓扑序的：经过的格子的数字从大到小。

你当然也可以实现用循环的方式写 dp，就是比较麻烦，需要处理好拓扑序和一些边界问题。

??? DP 代码

    ```cpp
    /*
      状态表示
        (x, y, l) 表示以 (x, y) 结尾的滑坡长度为 l
        (x, y) 相同时，最大化 l，dp[x][y] 表示以 (x, y) 结尾的最长滑坡长度
      状态转移
        dp[x][y] = max(dp[x'][y'] + 1)，其中 (x', y') 与 (x, y) 相邻，并且 a[x'][y'] > a[x][y]
      初始状态
        dp[x][y] = 1
      拓扑序
        拓扑序不明显，用记忆化搜索

      状态表示
        由于滑坡是下降序列，重新给格子标号，并记录每个格子的坐标、数值，并按数值从大到小排序
        (i, l) 表示以第 i 个格子结尾的滑坡长度为 l
        dp[i] 表示以第 i 个格子结尾的最长滑坡长度
      状态转移
        dp[i] = max(dp[j]) + 1，其中 j < i（保证了高度下降）并且 j 和 i 的坐标相邻
      初始状态
        dp[i] = 1;
      拓扑序
        由于已经排序，随着 i 的增大高度必然下降，按 i 递增的方向转移
    */
    #include <iostream>
    #include <algorithm>

    using namespace std;

    const int N = 1001;
    const int dx[] = {0, 0, 1, -1};
    const int dy[] = {1, -1, 0, 0};

    struct Node{
      int x, y, v;  // 坐标和数值
    };

    bool cmp(const Node &i, const Node &j){  // 按照数值从大到小排序
      return i.v > j.v;
    }

    int n, m, c;
    Node a[N * N];
    int dp[N * N];

    bool Check(const Node &a, const Node &b){
      for (int i = 0; i < 4; i++){
        if (a.x + dx[i] == b.x && a.y + dy[i] == b.y){
          return 1;
        }
      }
      return 0;
    }

    int main(){
      cin >> n >> m;
      for (int i = 1; i <= n; i++){
        for (int j = 1; j <= m; j++){
          int x;
          cin >> x;
          a[++c] = {i, j, x};
        }
      }
      sort(a + 1, a + c + 1, cmp);
      int ans = 0;
      for (int i = 1; i <= c; i++){  // 按数值从大到小枚举
        dp[i] = 1;
        for (int j = 1; j < i && a[j].v > a[i].v; j++){  // 枚举数值大的点
          if (Check(a[i], a[j])){  // 如果两个点相邻
            dp[i] = max(dp[i], dp[j] + 1);
          }
        }
        ans = max(ans, dp[i]);
      }
      cout << ans << endl;
      return 0;
    }
    ```

## 与使用循环的递推的区别

可以发现转移形式上，记忆化搜索和收集型递推是很相似的。因为记忆化搜索和收集型递推本质上只是 dp 的一种实现方法。

循环 dp 需要先指明拓扑序保证每个状态只求解一次，而记忆化搜索不需要拓扑序（只要题目的限制条件保证有拓扑序），通过给状态打标记的方式实现每个状态求解一次。

## 技巧

当你发现一道动态规划题目的拓扑序有点难找到，或者说题目的转移过程比较复杂，导致你用搜索或者分治来编写代码时，记忆化是一个好的优化策略。

!!! warning

    平时写动规题时还是尽量写循环的 dp，去分析状态转移拓扑序，在应试中实在写不出循环 dp 才考虑记忆化。

一般写记忆化的流程为：

1. 写出暴搜 dfs
2. 将 dfs 改成没有【外部变量】对搜索过程造成【全局影响】的代码
3. 添加记忆化数组

一般来说，记忆化搜索有以下几个特点：

1. 由于递归的实现形式，常数时间开销比较大，并且难以使用其他优化。
2. 对于一些比较复杂的 DP 题目，比循环 DP 能更好的处理边界情况。
3. 循环 DP 可能需要遍历拓扑序中的每一个状态，而记忆化搜索不会对一些无效、非法状态进行搜索。（在一些题目中很有价值，例如 [[NOIP2018 普及组] 摆渡车](https://www.luogu.com.cn/problem/P5017)）

## 一些习题

[DAG 上最长路](https://atcoder.jp/contests/dp/tasks/dp_g)

[[NOIP2018 普及组] 摆渡车](https://www.luogu.com.cn/problem/P5017)