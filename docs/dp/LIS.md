# 最长上升子序列

通过最长上升子序列（Longest Increasing Subsequence）问题，找出搜索、状态图遍历、递推、动态规划、分治和记忆化之间的联系。

## 问题 1：求最长上升子序列的长度

!!! 题意

    给定长度为 $n$ 的整数序列 $a_1, a_2, \dots, a_n$，请你求出 $a$ 的上升子序列的最长长度。上升子序列 $b$ 定义如下：

    - 令 $b$ 的长度为 $m$（$0 \le m \le n$），$b$ 中的元素为 $b_1, b_2, \dots, b_m$。
    - $1 \le b_1 \lt b_2 \lt \dots \lt b_m \le n$，且 $a_{b_1} \lt a_{b_2} \lt \dots \lt a_{b_m}$。

### 方法 1：搜索

通过搜索找出所有子序列，并对每个子序列逐个进行判定。

```cpp
const int MAXN = 1e3 + 1;

int n, a[MAXN];
int b[MAXN], ans;

bool is_LIS(int b[], int m) {
  for (int i = 2; i <= m; i++) {
    if (a[b[i]] <= a[b[i - 1]]) {
      return 0;
    }
  }
  return 1;
}

void dfs(int len) {
  if (is_LIS(b, len)) {
    ans = max(ans, len);  // 更新答案
  }
  for (int i = 1; i <= n; i++) {  // 枚举转移
    if (i > b[len]) {
      b[len + 1] = i;
      dfs(len + 1);
    }
  }
}

dfs(0);
cout << ans;
```

（可以采取的提问：为什么没有显著的递归退出）

（本方法还可以被状压枚举替代）

可以观察到状态是子序列本身，转移是在子序列末尾添加一个下标更大的元素。

空间复杂度：递归深度 $O(n)$。

时间复杂度：一共有 $O(2^n)$ 个子序列，每个子序列的判定 $O(n)$，总时间 $O(n \times 2^n)$。

### 方法 2：搜索

我们可以对方法 1 的状态进行优化。

可以观察到，上升子序列的构造过程（转移）仅与**子序列末尾元素的下标**相关。对于所有末尾元素下标相同的子序列，它们能够做的转移都是相同的。并且本题是求解最长上升子序列的长度，并不关心子序列具体长什么样子。

若只关心末尾元素下标，则丢失了子序列的长度信息。我们需要将所有的上升子序列按照**末尾元素下标和长度**进行分组。

因此将状态重新设计为 $(i, len)$，表示子序列末尾元素下标为 $i$、长度为 $len$ 的子序列。

- 这样的状态设计实际上是将所有末尾元素下标为 $i$、长度为 $len$ 的子序列进行合并处理的结果。

转移则是往末尾添加一个下标更大且元素值更大的元素，即 $(i, len) \to (j, len + 1)$，其中 $i \lt j \le n$ 且 $a_i \lt a_j$。

```cpp
const int MAXN = 1e3 + 1;

int n, a[MAXN];
int ans;

void dfs(int i, int len) {
  ans = max(ans, len);                // 更新答案
  for (int j = i + 1; i <= n; i++) {  // 枚举转移
    if (a[i] < a[j]) {
      dfs(j, len + 1);
    }
  }
}

a[0] = INT_MIN;                 // 可以把空序列看做为一个拥有极小值的序列
dfs(0, 0);                      // 初始状态为空序列
cout << ans;

for (int i = 1; i <= n; i++) {  // 也可以将单个元素构成的序列作为初始状态
  dfs(i, 1);
}
```

时间复杂度：上述搜索可以构造出所有的上升子序列，最坏情况有 $O(2^n)$ 个上升子序列，因此总时间 $O(2^n)$。

### 方法 3：状态图遍历

重新将状态和转移形式化的描述一下。

状态：$(i, len)$，表示子序列末尾元素下标为 $i$、长度为 $len$ 的上升子序列。

转移：$(i, len) \to (j, len + 1)$，其中 $i \lt j \le n$ 且 $a_i \lt a_j$，表示往末尾添加一个下标更大且元素值更大的元素。

在方法 2 中已经提到，针对于这个问题，我们不关心具体的上升子序列长什么样，而只想知道长度为 $len$ 的上升子序列是否存在。换言之，对于每个状态 $(i, len)$ 来说，我只想知道知道是否能够构造出一个末尾下标为 $i$、长度为 $len$ 的上升子序列。

既然这样的状态设计已经包含了解决该问题所需的信息，可以直接做状态图遍历，保证每个状态只被遍历（计算）一次。

（我们将原先的最优化问题，转化为了一种可行性（判定性）问题）

```cpp
const int MAXN = 1e3 + 1;

int n, a[MAXN], vis[MAXN][MAXN];
int ans;

void dfs(int i, int len) {
  if (vis[i][len]) {
    return ;
  }
  vis[i][len] = 1;                    // 标记状态
  ans = max(ans, len);                // 更新答案
  for (int j = i + 1; i <= n; i++) {  // 枚举转移
    if (a[i] < a[j]) {
      dfs(j, len + 1);
    }
  }
}

a[0] = INT_MIN;                 // 可以把空序列看做为一个拥有极小值的序列
dfs(0, 0);                      // 初始状态为空序列
cout << ans;

for (int i = 1; i <= n; i++) {  // 也可以将单个元素构成的序列作为初始状态
  dfs(i, 1);
}
```

时间复杂度：一共有 $O(n^2)$ 个状态，每个状态转移数量 $O(n)$，总时间 $O(n^3)$。

### 方法 4：递推

重新将状态和转移形式化的描述一下。

状态：$(i, len)$，表示子序列末尾元素下标为 $i$、长度为 $len$ 的子序列。

转移：$(i, len) \to (j, len + 1)$，其中 $i \lt j \le n$ 且 $a_i \lt a_j$，表示往末尾添加一个下标更大且元素值更大的元素。

可以观察到在该状态转移的过程中，拓扑序可以是 $i$ 从小到大，或者 $len$ 从小到大，因此我们可以用递推的方式进行求解。如下代码给出收集型递推实现，并且将初始状态看为单个元素构成的序列。

!!! 代码

    === "拓扑序：$i$ 从 $1$ 到 $n$"

        ```cpp
        const int MAXN = 1e3 + 1;

        int n, a[MAXN];
        int ans, f[MAXN][MAXN];

        for (int i = 1; i <= n; i++) {          // 枚举拓扑序（枚举阶段）
          f[i][1] = 1;                          // 初始状态初始化
          for (int len = 2; len <= n; len++) {  // 枚举状态
            for (int j = 1; j < i; j++) {       // 枚举转移
              if (a[j] < a[i]) {                // 限制条件
                f[i][len] |= f[j][len - 1];     // 收集型转移
              }
            }
            if (f[i][len]) {        // 状态存在
              ans = max(ans, len);  // 更新答案
            }
          }
        }
        cout << ans;
        ```

    === "拓扑序：$len$ 从 $1$ 到 $n$"

        ```cpp
        const int MAXN = 1e3 + 1;

        int n, a[MAXN];
        int ans, f[MAXN][MAXN];

        for (int i = 1; i <= n; i++) {  // 初始状态初始化
          f[len][i] = 1;
        }
        for (int len = 2; len <= n; len++) {  // 枚举拓扑序（枚举阶段）
          for (int i = len; i <= n; i++) {    // 枚举状态
            for (int j = 1; j < i; j++) {     // 枚举转移
              if (a[j] < a[i]) {              // 限制条件
                f[len][i] |= f[len - 1][j];   // 收集型转移
              }
            }
            if (f[len][i]) {        // 状态存在
              ans = max(ans, len);  // 更新答案
            }
          }
        }
        cout << ans;
        ```

在时间复杂度上，与方法 $3$ 一样，都是 $O(n^3)$。

### 方法 5：动态规划

重新将状态和转移形式化的描述一下。

状态：$(i, len)$，表示子序列末尾元素下标为 $i$、长度为 $len$ 的子序列。

转移：$(i, len) \to (j, len + 1)$，其中 $i \lt j \le n$ 且 $a_i \lt a_j$，表示往末尾添加一个下标更大且元素值更大的元素。

首先观察到最优化属性显然是 $len$，对所有状态按末尾元素下标 $i$ 进行分组。可以观察到如下许多性质：

- $len$ 是最优化属性，对于同一分组 $(i)$ 来说，只需要保留最大的 $len$，作为最优状态。
- 上升子序列的构造只与末尾元素相关，与长度无关。
- 无后效性：分组存在拓扑序，即 $i$ 从 $1$ 到 $n$。
- 最优子结构：每个分组中的最优状态一定由拓扑序中靠前的分组的最优状态转移而来。
  - 换句话说，末尾下标为 $i$ 的 LIS 的最长长度显然可以由末尾下标更小的 LIS 的最长长度转移而来。
  - 通俗来说，当前最优由之前最优转移而来。

使用动态规划进行求解。

!!! 代码

    === "新代码"

        ```cpp
        const int MAXN = 1e3 + 1;

        int n, a[MAXN];
        int ans;
        int dp[MAXN];  // 对于每个分组 i，只记录最大的 len

        for (int i = 1; i <= n; i++)  {       // 枚举分组拓扑序（枚举阶段）
          dp[i] = 1;                          // 初始状态初始化
          for (int j = 1; j < i; j++) {       // 枚举转移
            if (a[j] < a[i]) {                // 限制条件
              dp[i] = max(dp[i], dp[j] + 1);  // 收集型转移
            }
          }
          ans = max(ans, dp[i]);  // 更新答案
        }
        cout << ans;
        ```

    === "收集型"

        ```cpp
        for (int i = 1; i <= n; i++) {        // 阶段的拓扑序
          dp[i] = 1;                          // 初始化一个元素的序列
          for (int j = 1; j < i; j++) {       // 转移
            if (a[j] < a[i]) {                // 限制条件
              dp[i] = max(dp[i], dp[j] + 1);  // 收集型转移
            }
          }
          ans = max(ans, dp[i]);  // 维护答案
        }
        cout << ans;
        ```

    === "扩散型"

        ```cpp
        for (int i = 1; i <= n; i++) {
          dp[i] = 1;
        }
        for (int i = 1; i <= n; i++) {
          ans = max(ans, dp[i]);
          for (int j = i + 1; j <= n; j++) {
            if (a[i] < a[j]) {
              dp[j] = max(dp[j], dp[i] + 1);
            }
          }
        }
        cout << ans;
        ```

空间复杂度：$n$ 个状态（分组，在 DP 问题中简述为状态），$O(n)$。

时间复杂度：每个状态转移数 $O(n)$，总时间复杂度 $O(n^2)$。

#### 状态转移方程

将上述流程进行整理，可以得到老式教学中的状态转移方程。

状态：令 $dp_i$ 表示以下标 $i$ 结尾的上升子序列的最长长度。

转移方程：$dp_i = \max \limits_{j \lt i, A_j \lt A_i} \{ dp_j \} + 1$。

分组拓扑序（阶段）：$i$ 从 $1$ 到 $n$。

目标：求解 $\max \limits_{i = 1}^n \{ dp_i \}$。

### 方法 6：记忆化搜索和分治

在记忆化搜索中，$dp$ 数组可以理解为记录答案的数组。

!!! 代码

    === "记忆化搜索"

        ```cpp
        int dfs(int i) {
          if (dp[i] != -1) {  // 状态已求解过
            return dp[i];
          }
          dp[i] = 1;                          // 初始化
          for (int j = i + 1; j <= n; j++) {  // 转移
            if (a[i] < a[j]) {
              dp[i] = max(dp[i], dfs(j) + 1);
            }
          }
          return dp[i];
        }

        for (int i = 1; i <= n; i++) {  // 标记未求解状态
          dp[i] = -1;
        }

        for (int i = 1; i <= n; i++) {
          ans = max(ans, dfs(i));
        }
        ```

记忆化搜索的本质是分治，是一种实现动态规划的代码方式。

- 分治将大问题分解为同类小问题的求解思想。
- 用记忆化搜索处理 DP，拓扑序实际上是小问题合并到大问题的这一方向。换言之，记忆化搜索是对拓扑序中靠后的状态进行分治。
  - 所谓的 $dp_i$ 记录的是以 $i$ 开头的 LIS 的长度。
- 你只需要知道存在拓扑序，并不需要知道拓扑序具体是什么。

当你推不出拓扑序时，但直觉上认定是递推、DP 题目时，可以考虑使用记忆化搜索。实际上，基于搜索的特性，记忆化搜索还能避免许多无效状态、无效转移的枚举。

### 方法 6

[$O(n \log n)$ 求解 LIS](sequence_dp.md)

### 总结

在方法 1 和方法 2 中，我们尝试用搜索解决这个最优化问题。

在方法 3 中，我们重新设计状态，缩小状态空间，将最优化问题转为了可行性（判定性）问题，使用状态图遍历进行求解。

在方法 4 中，找到状态转移的拓扑序，使用递推求解可行性问题。

在方法 5 中，进一步分析状态的最优化属性、分组拓扑序、最优子结构，再次将可行性问题转为了最优化问题，使用动态规划进行求解。并且还可以从分治角度理解动态规划。

在方法 6 中，挖掘更多的子结构性质，尝试进行优化（这样的优化没有套路，是 ad-hoc 的）。

早期的 DP 训练和总结中，需要明确以下几点（这也是总结的格式）：

- 状态
- 转移
- 拓扑序
- 最优化属性
- 分组拓扑序
- 最优子结构
- 初始状态，目标状态

当常规的 DP 题熟练之后，可以直接写“状态转移方程”。

### 备注

方法 3 和方法 4 的时间复杂度一致，但在随机数据的情况下，方法 3 表现更优秀。

- 方法 3 使用图的遍历思想来求解，在随机数据下，许多状态是遍历不到的，相当于跳过了许多无效状态、非法状态及其对应的转移。
- 方法 4 中，状态空间中的所有状态都被枚举了一遍，因此表现更差。实际上，可以将方法 4 改为扩散型实现，然后跳过无效状态和无效转移，同样地能够加速递推。
- 无论如何，都可以构造数据将方法 3 和方法 4 卡超时（例如，原序列中的元素是单调递增的）。

## 问题 2：求最长上升子序列的一个方案

!!! 题意

    给定长度为 $n$ 的整数序列 $a_1, a_2, \dots, a_n$，请你求出 $a$ 的一个 LIS。

### 方法 1：暴力记录方案

在 DP 的转移过程中直接记录对应的一个 LIS 即可。

时间复杂度 $O(n^3)$，空间复杂度达到 $O(n^2)$。

```cpp
const int N = 2e2 + 5;

int n, a[N];

vector<int>dp[N];

int main(){
  cin >> n;
  for(int i = 1; i <= n; ++i){
    cin >> a[i];
    dp[i].push_back(a[i]);
  }
  for(int i = 1; i <= n; ++i){
    for(int j = 1; j < i; ++j){
      if(a[j] < a[i] && dp[j].size() + 1 > dp[i].size()){
        dp[i] = dp[j];
        dp[i].push_back(a[i]);
      }
    }
  }
  vector<int>ans;
  for(int i = 1; i <= n; ++i){
    if(dp[i].size() > ans.size()){
      ans = dp[i];
    }
  }
  cout << "max=" << ans.size() << endl;
  for(int i : ans){
    cout << i << " ";
  }
  return 0;
}
```

### 方法 2：状态关联

我们用 DP 求解 LIS 的长度，该如何求解方案呢？需要回到状态理论的理解。[理论](./theory/theory.md)

!!! 代码

    === "代码 1"

        ```cpp
        // 输出以 A[i] 结尾的最长上升子序列（任意一种即可）
        void Print(int i) {
          if (!i) {  // 边界，空序列
            return;
          }
          for (int j = 0; j < i; j++) {                // 枚举状态
            if (a[j] <= a[i] && dp[j] + 1 == dp[i]) {  // 状态关联，判断两个状态间是否存在最优转移
              Print(j);
              break;
            }
          }
          cout << a[i] << ' ';
        }

        a[0] = 0;                             // 初始化
        for (int i = 1; i <= n; i++) {        // 阶段的拓扑序
          for (int j = 0; j < i; j++) {       // 枚举状态转移（状态关联）
            if (a[j] <= a[i]) {               // 限制条件
              dp[i] = max(dp[i], dp[j] + 1);  // 收集型转移
            }
          }
          if (dp[i] > ans) {  // 维护答案
            ans = dp[i];
            pos = i;
          }
        }

        Print(pos);  // 从目标状态反向转移，还原方案
        ```

    === "代码 2"
    
        ```cpp
        for (int i = pos, j; i; i = j) {               // 从目标状态反向转移，还原方案
          res[++m] = a[i];                             // 记录方案
          for (j = i; j >= 1; j--) {                   // 枚举状态
            if (a[j] <= a[i] && dp[j] + 1 == dp[i]) {  // 状态关联，判断两个状态间是否存在最优转移
              break;
            }
          }
        }
        for (int i = m; i >= 1; i--) {
          cout << res[i] << ' ';
        }
        ```

    === "代码 3"

        ```cpp
        const int N = 2e2 + 5;

        int n, a[N], ans, dp[N];
        vector<int> b;

        void DP(){
          for(int i = 1; i <= n; i++){
            dp[i] = 1;
            for(int j = 1; j < i; j++){
              dp[i] = max(dp[i], (dp[j] + 1) * (a[i] >= a[j]));
            }
            if(dp[i] > dp[ans]){
              ans = i;
            }
          }
        }

        int main(){
          cin >> n;
          for(int i = 1; i <= n; i++){
            cin >> a[i];
          }
          DP();
          cout << "max=" << dp[ans] << "\n";
          b.push_back(a[ans]);
          for(int i = ans - 1, last = ans; i >= 1; i--){
            if (a[i] <= a[last] && dp[i] + 1 == dp[last]) {
              b.push_back(a[i]);
              last = i;
            }
          }
          reverse(b.begin(), b.end());
          for(int x : b){
            cout << x << " ";
          }
          return 0;
        }
        ```

输出方案的时间复杂度 $O(N)$。

### 方法 3：记录最优转移

题目只要求输出一个 LIS 方案，直接记录每个状态由哪个状态转移而来就行了。

```cpp
void Print(int i) {
  if (!i) {
    return;
  }
  Print(pre[i]);
  cout << a[i] << ' ';
}

a[0] = 0;                                     // 初始化
for (int i = 1; i <= n; i++) {                // 阶段的拓扑序
  for (int j = 0; j < i; j++) {               // 枚举状态转移（状态关联）
    if (a[j] <= a[i] && dp[j] + 1 > dp[i]) {  // 限制条件
      dp[i] = dp[j] + 1;                      // 收集型转移
      pre[i] = j;                             // 记录最优转移
    }
  }
  if (dp[i] > ans) {       // 维护答案
    ans = dp[i], pos = i;  // 记录最优状态
  }
}
cout << "max=" << ans << '\n';
Print(pos);
```

输出方案的时间复杂度 $O(N)$，开辟了额外的记录最优转移的数组 $O(N)$。

($pre$ 数组实际上形成了一个用单链表构成的树状（森林状）结构)

## 问题 3：求最长上升子序列的方案数

!!! 题意

    给定长度为 $n$ 的整数序列 $a_1, a_2, \dots, a_n$，请你求出 $a$ 的 LIS 的方案数。

最优化问题也可以附带方案数问题。对于 DP 来说，最优状态也是将原始状态合并后的状态，因此可以拥有方案数。实际上状态进行了两次合并：

- 首先合并等价状态得到方案数。即，状态从一开始的子序列本身优化为了 $(i, len)$。
- 对于状态 $(i, len)$，$len$ 是最优化属性，按 $i$ 分组，然后每个分组 $(i)$ 只保留最优的状态及其对应方案数。

### 方法 1：递推

第一次合并状态之后可以使用递推求解。

注意到，初始状态视作为方案是为 $1$，无效状态方案数为 $0$。但是由于题目要对方案数取模，方案数为 $0$ 并不意味着状态是无效的，因此在递推过程中需要同时记录状态的可行性和方案数。

```cpp
#include<bits/stdc++.h>

using namespace std;

const int N = 2e3 + 5, mod = 1e9 + 7;

int n, a[N], dp1[N][N], dp2[N][N], ans, Max;

int main(){
  cin >> n;
  for(int i = 1; i <= n; i++){
    cin >> a[i];
    dp1[1][i] = 1;
    dp2[1][i] = 1;
  }
  for(int len = 2; len <= n; len++){
    for(int i = 1; i <= n; i++){
      if(!dp1[len - 1][i]){
        continue;
      }
      for(int j = i + 1; j <= n; j++){
        if(a[i] < a[j]){
          dp2[len][j] += dp2[len - 1][i];
          dp2[len][j] %= mod;
          dp1[len][j] |= dp1[len - 1][i];
          Max = max(Max, len);
        }
      }
    }
  }
  for(int i = 1; i <= n; i++){
    ans = (ans + dp2[Max][i]) % mod;
  }
  cout << Max << " " << ans;
  return 0;
}
```

空间复杂度 $O(n^2)$，时间复杂度 $O(n^3)$。

### 方法 2：DP

在第二次合并状态之后，可以在 DP 的过程中同时求解方案数。根据是否为最优转移来决定方案数的合并：

- 如果存在更优的状态，之前方案作废，将更优转移的方案全部覆盖。
- 如果转移同时最优，方案数累加。

!!! 代码

    === "代码 1"

        ```cpp
        cnt[0] = 1;                                // 初始化空序列
        for (int i = 1; i <= n; i++) {             // 阶段的拓扑序
          for (int j = 0; j < i; j++) {            // 转移
            if (a[j] < a[i]) {                     // 限制条件
              if (dp[j] + 1 > dp[i]) {             // 存在更长的 LIS
                dp[i] = dp[j] + 1;                 // 收集型转移
                cnt[i] = cnt[j];                   // 所有以 i 结尾的 LIS 由所有以 j 结尾的 LIS 转移而来
              } else if (dp[j] + 1 == dp[i]) {     // 同样长度的 LIS
                cnt[i] = (cnt[i] + cnt[j]) % MOD;  // 累加方案数
              }
            }
          }
          if (dp[i] > ans) {  // 维护答案
            ans = dp[i], res = cnt[i];
          } else if (dp[i] == ans) {
            res = (res + cnt[i]) % MOD;
          }
        }
        cout << ans << ' ' << res;
        ```

    === "代码 2"

        ```cpp
        #include <iostream>
        #include <algorithm>

        using namespace std;

        const int MAXN = 2e5 + 2, MOD = 1e9 + 7;

        // 最长上升子序列 Longest Increasing Subsequence

        struct Node {
          int len, cnt;  // 最长上升子序列长度和方案数
        } dp[MAXN], ans;

        int n, a[MAXN];

        void Update(Node &ans, Node now) {
          if (ans.len < now.len) {                // 存在更长的 LIS
            ans = now;                            // 所有以 i 结尾的 LIS 由所有以 j 结尾的 LIS 转移而来
          } else if (ans.len == now.len) {        // 同样长度的 LIS
            ans.cnt = (ans.cnt + now.cnt) % MOD;  // 累加方案数
          }
        }

        int main() {
          cin >> n;
          for (int i = 1; i <= n; i++) {
            cin >> a[i];
          }
          dp[0] = {0, 1};                                   // 初始化空序列
          for (int i = 1; i <= n; i++) {                    // 阶段的拓扑序
            for (int j = 0; j < i; j++) {                   // 转移
              if (a[j] < a[i]) {                            // 限制条件
                Update(dp[i], {dp[j].len + 1, dp[j].cnt});  // 收集型转移
              }
            }
            Update(ans, dp[i]);  // 维护答案
          }
          cout << ans.len << ' ' << ans.cnt;
          return 0;
        }
        ```

## 问题 4：求最长上升子序列的所有方案

!!! 题意

    给定长度为 $n$ 的整数序列 $a_1, a_2, \dots, a_n$，请你求出 $a$ 的所有 LIS。保证输出不超时。

问题 3 中的方案数是合并后的结果，所以可以在 DP 的过程中同时求解。本题要求解 LIS 的所有方案。

首先只求解问题 1，得到一个状态转移图，图上的每个转移都对应了 DP 过程中的最优转移。

然后基于该状态转移图，搜索出所有的方案。

```cpp
```

## 问题 5：求字典序最小的最长上升子序列的方案

!!! 题意

    给定长度为 $n$ 的整数序列 $a_1, a_2, \dots, a_n$，请你求出 $a$ 的下标字典序最小的 LIS。

参考问题 $4$，得到 DP 过程的状态转移图后，找该图上的一个字典序最小的 LIS 方案。

## 问题 6：求最长上升子序列的关键点

!!! 题意

    给定长度为 $n$ 的整数序列 $a_1, a_2, \dots, a_n$，请你求出 LIS 中的一些关键点。关键点有如下两种定义：

    1. 如果一个元素可以在 LIS 中，则称其为关键点。
    2. 如果一个元素必须在 LIS 中，则称其为关键点。

对于定义 1，非常好求解：

- 如果以 $i$ 结尾的最长上升子序列和以 $i$ 开头的最长上升子序列能够拼接得到整个序列的 LIS，那么 $i$ 就是关键点。
- 以 $i$ 开头的最长上升子序列，可以把序列倒过来，求最长下降子序列。

对于定义 2，需要发散思维：

- 一个元素若可以出现在 LIS 中，那么它在所有 LIS 中的位置是相同的，这个位置就是求解 LIS 长度过程中的 $dp_i$。
- $i$ 是关键点等价于 $dp_i \ne dp_j(i \ne j)$。即在所有 LIS 方案中，某位置上只出现一个下标，那么它是关键点，反之亦然。

## 问题 7：求本质不同的最长上升子序列的方案数

!!! 题意

    给定长度为 $n$ 的整数序列 $a_1, a_2, \dots, a_n$，请你求出 $a$ 的本质不同的最长上升子序列的方案数。如果两个下标序列不同，但是其对应的元素值序列相同，则这两个序列被定义为本质相同的子序列。

    形式化来说，如果存在两个下标序列 $(i_1, i_2, \dots, i_m)$ 和 $(j_1, j_2, \dots, j_m)$ 满足以下条件：

    1. $1 \le m \le n$，$1 \le i_1 \lt i_2 \lt \dots \lt i_m \le n$，$1 \le j_1 \lt j_2 \lt \dots \lt \j_m \le n$。
    2. 存在一个 $1 \le k \le m$ 的 $k$，使得 $i_k \ne j_k$
    3. 对于所有的 $1 \le k \le m$ 的 $k$，$a_{i_k} = a_{j_k}$

    那么称这两个下标序列对应的子序列 $a_{i_1}, a_{i_2}, \dots, a_{i_m}$ 和 $a_{j_1}, a_{j_2}, \dots, a_{j_m}$ 是本质相同的子序列。