## 双序列问题

### atcoder dp_f

最长公共子序列，longest common subsequence，简称 lcs。

!!! 题意

    给定两个字符串 $s, t$，求出它们的最长公共子序列 $x$，即 $x$ 既是 $s$ 的子序列又是 $t$ 的子序列。$1 \le |s|, |t| \le 3000$。

可以考虑如何构造公共的子序列。

??? 一些可供参考的暴搜

    === "DFS1"

        ```cpp
        // 求出 s 和 t 的子序列，再判公共
        #include <bits/stdc++.h>

        using namespace std;

        string s, t;
        int n, m;
        set<string> res_s, res_t;

        void dfs(const string &s, set<string> &S, int last, string ans) {
          S.insert(ans);
          for (int i = last + 1; i < s.size(); i++) {
            dfs(s, S, i, ans + s[i]);
          }
        }

        int main() {
          cin >> s >> t;
          dfs(s, res_s, -1, "");
          dfs(t, res_t, -1, "");
          for (auto s : res_s) {
            if (res_t.count(s)) {  // 找到公共子序列
              cout << s << '\n';
            }
          }
          return 0;
        }
        ```
    
    === "DFS2"

        ```cpp
        // 先求出 s 的子序列，再判该子序列是否为 t 的子序列
        #include <bits/stdc++.h>

        using namespace std;

        set<string> res_s;
        string s, t;

        // 判断 a 是 b 的子序列
        bool Check(const string &a, const string &b) {
          int n = a.size(), m = b.size(), i, j;
          for (i = 0, j = 0; i < n && j < m; j++) {
            i += a[i] == b[j];
          }
          return i == n;
        }

        void dfs(const string &s, set<string> &S, int last, string ans) {
          S.insert(ans);
          for (int i = last + 1; i < s.size(); i++) {
            string str = ans + s[i];
            if (Check(str, t)) {
              dfs(s, S, i, ans + s[i]);
            }
          }
        }

        int main() {
          cin >> s >> t;
          dfs(s, res_s, -1, "");
          for (auto s : res_s) {
            if (Check(s, t)) {
            }
          }
          return 0;
        }
        ```

    === "DFS3"

        ```cpp
        #include <bits/stdc++.h>

        using namespace std;

        set<string> res, _res;
        string s, t;

        // 以 s[last_s] 和 t[last_t] 结尾的公共子序列为 ans
        void dfs(int last_s, int last_t, string ans) {
          res.insert(ans);
          for (int i = last_s + 1; i < s.size(); i++) {
            for (int j = last_t + 1; j < t.size(); j++) {
              if (s[i] == t[j]) {
                dfs(i, j, ans + s[i]);
                break;
              }
            }
          }
        }

        // s[1] ~ s[i] 和 t[1] ~ t[j] 的公共子序列为 ans
        void DFS(int i, int j, string ans) {
          _res.insert(ans);
          if (i == s.size() || j == t.size()) {
            return;
          }
          if (s[i] == t[j]) {
            DFS(i + 1, j + 1, ans + s[i]);
          }
          DFS(i + 1, j, ans), DFS(i, j + 1, ans);
        }

        int main() {
          freopen("1.out", "w", stdout);
          cin >> s >> t;
          dfs(-1, -1, "");
          for (auto str : res) {
            cout << str << '\n';
          }
          cout << '\n';
          DFS(0, 0, "");
          for (auto str : _res) {
            cout << str << '\n';
          }
          return 0;
        }
        ```

??? 构造过程

    我们定义两个指针 $i, j$，一开始它们为 $1$，用于指向 $s$ 和 $t$ 的字符。然后我们可以按照如下三条规则构造公共子序列：

    1. $s_i$ 不在公共子序列中，此时 $i$ 加 $1$（$i \le |s|$）。
    2. $t_j$ 不在公共子序列中，此时 $j$ 加 $1$（$j \le |t|$）。
    3. $s_i = t_j$ 时，可以将 $s_i$（或 $t_j$）加入到结果的公共子序列中（$i \le |s|, j \le |t|$）。

    尝试用搜索实现该构造过程。

??? 状态和转移

    定义 $dp_{i, j}$ 表示 $s_1 s_2 \dots s_i$ 和 $t_1 t_2 \dots t_j$ 的公共子序列的最长长度。

    根据上述构造过程，显然有 $dp_{i, j} = \max(dp_{i - 1, j}, dp_{i, j - 1}, dp_{i - 1, j - 1} + [s_i == t_j])$。

    空间复杂度 $O(|s||t|)$，时间复杂度 $O(|s||t|)$。

??? 方案输出

    从目标状态 $dp_{|s|, |t|}$ 开始，倒推寻找在最优的转移路径上的状态，然后构造字符串。

??? 代码

    ```cpp
    #include <bits/stdc++.h>

    using namespace std;

    const int MAXN = 3e3 + 1;

    string s, t;
    int dp[MAXN][MAXN];

    int main() {
      cin >> s >> t;
      int n = s.size(), m = t.size();
      s = '#' + s, t = '#' + t;
      for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
          dp[i][j] = max({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1] + (s[i] == t[j])});
        }
      }
      string ans;
      for (int i = n, j = m; i >= 1 && j >= 1;) {
        if (dp[i][j] == dp[i - 1][j]) {
          i--;
        } else if (dp[i][j] == dp[i][j - 1]) {
          j--;
        } else {
          ans += s[i];
          i--, j--;
        }
      }
      reverse(ans.begin(), ans.end());
      cout << ans << '\n';
      return 0;
    }
    ```

### CSES 1639

编辑距离。

!!! 题意

    给定字符串 $s$ 和 $t$，你可以在字符串 $s$ 中插入、删除、修改字符，求出使得 $s$ 变为 $t$ 的最少操作次数。$1 \le |s|, |t| \le 5000$。

同样地，考虑如何构造修改方案。正着构造方案有点困难，我们不妨利用分治的思想将大问题分解成小问题进行求解。

令 $F(i, j)$ 表示将 $s_1 s_2 \dots, s_i$ 变为 $t_1 t_2 \dots t_j$ 的最少修改次数，则原问题为 $F(|s|, |t|)$。

??? 分治过程

    对于问题 $F(i, j)$，我们可以将其做如下分解：

    1. 可以考虑在字符 $s_i$ 之后插入一个字符 $t_j$，将问题分解为 $F(i, j - 1)$。
    2. 可以考虑直接将字符 $s_i$ 直接删掉，将问题分解为 $F(i - 1, j)$。
    3. 可以考虑将字符 $s_i$ 修改为 $t_j$，将问题分解为 $F(i - 1, j - 1)$。

    $F(i, j) = \min(F(i, j - 1) + 1, F(i - 1, j) + 1, F(i - 1, j - 1) + [s_i \ne t_j])$

将上述过程转换成 dp 即可，需要注意的是一些边界问题（自行思考和调试）。


??? 代码

    ```cpp
    #include <bits/stdc++.h>

    using namespace std;

    const int MAXN = 5e3 + 1;

    string s, t;
    int n, m, dp[MAXN][MAXN];

    int main() {
      ios::sync_with_stdio(0), cin.tie(0);
      cin >> s >> t;
      n = s.size(), m = t.size();
      s = '#' + s, t = '#' + t;
      for (int i = 1; i <= n; i++) {
        dp[i][0] = i;
      }
      for (int i = 1; i <= m; i++) {
        dp[0][i] = i;
      }
      for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= m; j++) {
          /*
          dp[i][j] = min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]}) + 1;
          if (s[i] == t[j]) {
            dp[i][j] = min(dp[i][j], dp[i - 1][j - 1]);
          }
          */
          if (s[i] == t[j]) {
            dp[i][j] = dp[i - 1][j - 1];
          } else {
            dp[i][j] = min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]}) + 1;
          }
        }
      }
      cout << dp[n][m];
      return 0;
    }
    ```