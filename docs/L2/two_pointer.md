# 双指针

## 介绍

双指针（two pointer），在国内又称为尺取法。一般来说，会定义两个或更多的指针在序列上进行扫描。根据指针的扫描模式，我们可以分为两种：同向扫描和反向扫描。

反向扫描：设定两个指针 $i, j$，$i$ 从头到尾扫描，$j$ 从尾到头扫描，一般在 $i, j$ 相遇时停止。

同向扫描：设定两个指针 $i, j$，$i, j$ 都是从头到尾扫描，一般在两个指针都（或其中之一）越界时停止。

## 从模拟的角度看双指针

代码的通常格式如下：

!!! 模板

    === "同向扫描"

        ```cpp
        int i = 1, j = 1;
        while (i <= n && j <= n) {
          if () {
            // ...... 干一些事情
            i++;  // 调整 i
          } else {
            // ...... 干一些事情
            j++;  // 调整 j
          }
        }
        ```

    === "反向扫描"

        ```cpp
        int i = 1, j = n;
        while (i < j) {
          if () {
            // ...... 干一些事情
            i++;  // 调整 i
          } else {
            // ...... 干一些事情
            j--;  // 调整 j
          }
        }
        ```

### 逐月 P1589 连续自然数之和

!!! 题意

    给定正整数 $M$，找出所有的连续的正整数段之和为 $M$ 的段（至少包含两个整数），并且按字典序的顺序输出符合要求的整数段。

同向扫描双指针。

把自然数 $1, 2, \dots$ 看做成是一个升序序列。用指针 $i, j$ 分别表示所选择的自然数的左端（最小值）和右端（最大值），并且用 $sum$ 维护这段数的和：

- 初始时 `i = 1, j = 0, sum = 0`
- 不断做如下操作，直到枚举范围超过 $M$
  - 如果 $sum \lt M$，说明还可以容纳更多的自然数，此时 `j++, sum += j`
  - 否则，说明不能容纳更多的自然数，需要找下一个连续的自然数段，此时 `sum -= i, i++`。

注意 `sum == M` 的情况下输出答案、初始化、调整指针和维护数字和的顺序问题。

??? 代码

    ```cpp
    #include <bits/stdc++.h>

    using namespace std;

    int m;

    int main() {
      cin >> m;
      int left = 1, right = 0;  // left 和 right 表示选出的连续自然数段，也就是选出的数字是左闭右开区间 [left, right)
      int sum = 0;              // sum 表示自然数之和
      while (right < m) {
        if (sum < m) {            // 和少于 m
          right++, sum += right;  // 进一步选数
        } else {                  // 和不少于 m
          if (sum == m) {
            cout << left << ' ' << right << '\n';
          }
          sum -= left, left++;  // 少选一个数字
        }
      }
      return 0;
    }
    ```
    
### 逐月 P1590 取数游戏 I

!!! 题意

    给定一个 $1 \sim n$ 的全排列 $a$，不断取出并删除排列中头尾元素的较大值，输出每次取出的元素。

使用同向扫描双指针进行模拟。

用 $i, j$ 分别指向数组的头尾元素，然后按照题意模拟：

- 初始时 `i = 1, j = n`
- 不断做如下操作，直到数列为空
  - 如果 $a_i \gt a_j$，取出元素 $a_i$，然后 `i++`
  - 否则，取出元素 $a_j$，然后 `j--`

注意到，题目给出的是一个 $1 \sim n$ 的全排列，所有元素均不相同，因此取出元素的方法是唯一的。

??? 代码

    ```cpp
    #include <bits/stdc++.h>

    using namespace std;

    const int MAXN = 1e5 + 1;

    int n, a[MAXN], b[MAXN];

    int main() {
      cin >> n;
      for (int i = 1; i <= n; i++) {
        cin >> a[i];
      }
      int left = 1, right = n;        // left 和 right分别指向数组的头尾元素
      for (int i = 1; i <= n; i++) {  // 记录 B 序列
        if (a[left] > a[right]) {     // 头元素比尾元素大
          b[i] = a[left++];           // 取头元素
        } else {                      // 头元素比尾元素小
          b[i] = a[right--];          // 取尾元素
        }
      }
      for (int i = 1; i <= n; i++) {
        cout << b[i] << ' ';
      }
      return 0;
    }

    // 由于 A 是一个全排列，因此序列 B 是唯一的
    ```

## 从优化枚举的视角看双指针

枚举是有顺序的。当序列中具有某种单调性时，可以使用双指针来优化枚举范围，降低枚举的时间复杂度。

代码的格式通常如下。

!!! 模板

    === "同向扫描"

        ```cpp
        for (int i = 1, j = 1; i <= n; i++) {  // 从小到大枚举 i
          for (; 满足一些条件; j++) {            // 从小到大调整 j
            // ...... 干一些事情
          }
          // ...... 干一些事情
        }
        ```

    === "反向扫描"

        ```cpp
        for (int i = 1, j = n; i < j; i++) {  // 从小到大枚举 i
          for (; 满足一些条件; j--) {           // 从大到小调整 j
            // ...... 干一些事情
          }
          // ...... 干一些事情
        }
        ```

关于双指针是如何用于优化枚举的，请学习以下例题。

### 逐月 P1595 找区间右端点

!!! 题意

    给定 $n$ 个**正整数** $a_i$，对于每个下标 $i$，求出以其为区间左端点时的最小右端点 $j$，使得区间内的元素之和 $a_i + \dots + a_j$ 大于 $k$。

使用同向扫描的双指针来解决这个问题。

如果从暴力枚举的视角来看，我们可以先枚举左端点 $i$，然后在不断枚举右端点 $j$ 的过程中维护区间和 $sum$。

由于题目给出的元素均为**正整数**，我们可以发现序列上这样的单调性：

- 当左端点 $i$ 固定时，右端点 $j$ 越大，$sum$ 越大。即，当 $i$ 固定时，$sum$ 随着 $j$ 的增大而增大。

因此我们首先枚举 $i$，然后从小到大枚举 $j$，找到第一个符合要求的子段时就可以 `break`。这样的时间复杂度仍然是 $O(N^2)$ 的，如果数据是随机而非特殊构造，该算法可以比较快的通过。

```cpp
for (int i = 1; i <= n; i++) {
  int sum = 0;
  for (int j = i; j <= n; j++) {
    sum += a[j];
    if (sum > k) {
      ans[i] = j;
      break;  // 你可以理解为这是一个针对随机数据的常数优化
    }
  }
}
for (int i = 1; i <= n; i++) {
  cout << (ans[i] > 0 ? ans[i] : -1) << ' ';
}
```

我们还可以发现在序列上还存在如下单调性：

- 当左端点 $i$ 变大时，符合题意的最小右端点 $j$ 不会变少。
- 从模拟的视角来看，当 $i$ 从小到大扫描时，$j$ 只会从上一次停止的地方往右移动，也有可能不会移动，但一定不可能往左移动。

因此我们可以写出如下版本的双指针：$j$ 每次从上一次结束的位置开始往右移动。

??? 代码

    === "优化枚举视角"

        ```cpp
        #include <bits/stdc++.h>

        using namespace std;

        const int MAXN = 2e5 + 1;

        int n, k, a[MAXN], r[MAXN];

        int main() {
          ios::sync_with_stdio(0), cin.tie(0);
          cin >> n >> k;
          for (int i = 1; i <= n; i++) {
            cin >> a[i];
          }
          int sum = 0;  // 记录区间和
          // 初始时，i 和 j 都指向数组的头元素
          for (int i = 1, j = 1; i <= n; i++) {  // 从小到大枚举区间左端点 i
            for (; j <= n && sum <= k; j++) {    // 从小到大调整区间右端点 j
              sum += a[j];                       // 更新区间和
            }
            r[i] = sum > k ? j - 1 : -1;  // 记录答案
            sum -= a[i];                  // 更新区间和
          }
          for (int i = 1; i <= n; i++) {
            cout << r[i] << ' ';
          }
          return 0;
        }
        ```
    === "模拟视角"

        ```cpp
        #include <bits/stdc++.h>
        #define ll long long
        using namespace std;
        const int N = 2e5 + 5;
        ll n, k, a[N];
        int main() {
          cin >> n >> k;
          for (int i = 1; i <= n; ++i) {
            cin >> a[i];
          }
          for (ll i = 1, j = 0, sum = 0; i <= n; ++i) {
            while (j + 1 <= n && sum <= k) {
              sum += a[++j];
            }
            if (sum > k) {
              cout << j << ' ';
            } else {
              cout << -1 << ' ';
            }
            sum -= a[i];
          }
          return 0;
        }
        ```

由于每个元素最多会被 $i, j$ 指针各扫描一次，因此总时间复杂度为 $O(n)$。

恭喜你，你已经学会了第一个双重循环但是时间复杂度为 $O(n)$ 的算法。这也提醒，时间复杂度并不是由循环层数决定的，而是由程序中每行代码的执行次数决定的。

### 逐月 P1594 两数之和

!!! 题意

    给定 $n$ 个**升序排列的**整数 $a_i$ 和一个整数 $x$。请你求出两个不同下标 $i, j$ 使得 $a_i + a_j = x$。

    由于出题人不想写 spj，你需要输出第一关键字 $i$ 最小、第二关键字 $j$ 最大的一组下标。此外，这样的输出方法也能帮助你更好地理解双指针 :)。

使用反向扫描的双指针解决这个问题。

我们考虑这样一个暴力枚举：首先从小到大枚举 $a_i$，然后从大到小枚举 $a_j$，找到一个符合条件的就输出。

由于数组一开始就是**有序的**，我们在从大到小枚举 $a_j$ 时，如果发现两数之和 $a_i + a_j$ 已经小于 $x$ 就可以 `break`，因为再枚举 $j$ 也不会让两数之和为 $x$。

```cpp
for (int i = 1; i <= n; i++) {
  for (int j = n; j >= 1; j--) {
    if (a[i] + a[j] == x) {
      cout << i << ' ' << j;
      return 0;
    } else if (a[i] + a[j] < x) {
      break;  // 针对随机数据的常数优化
    }
  }
}
cout << "IMPOSSIBLE";
```

同样地，我们可以构造一些数据将该做做法卡到 $O(n^2)$，但在随机数据的情况下运行时间比较少。

我们还可以发现另一种单调性：

- 随着 $i$ 的增大，满足 $a_i + a_j \ge x$ 的最小的 $j$ 不会增大。
- 从模拟的视角看，随着 $i$ 从小到大枚举，每次跳出 $j$ 循环的位置不可能变大。

因此我们可以写出如下版本的双指针：$j$ 每次从上一次结束的位置开始往左移动。

??? 代码

    === "优化枚举视角"

        ```cpp
        #include <bits/stdc++.h>

        using namespace std;

        const int MAXN = 2e5 + 1;

        int n, x, a[MAXN];

        int main() {
          ios::sync_with_stdio(0), cin.tie(0);
          cin >> n >> x;
          for (int i = 1; i <= n; i++) {
            cin >> a[i];
          }
          // 初始时，i 和 j 分别指向数组的头尾元素
          for (int i = 1, j = n; i < j; i++) {       // 从小到大枚举 i
            for (; j > i && a[i] + a[j] > x; j--) {  // 从大到小调整 j
            }
            if (i < j && a[i] + a[j] == x) {
              cout << i << ' ' << j;
              return 0;
            }
          }
          cout << "IMPOSSIBLE";
          return 0;
        }

        /*
        写这样的双指针一定要注意下标范围。

        一些边界数据（corner case），边界数据可能不够

        case 1: 针对 16, 17, 19 行的 i < j（16 行写成 i <= n 或 i <= j，17 和 19 行的不写）
        5 6
        1 2 3 10 11
        IMPOSSIBLE

        case 2: 针对 17 行的 j > i 不写，下标越界
        5 5
        6 7 8 9 10
        IMPOSSIBLE

        case 3: 针对重复元素
        7 6
        1 2 2 3 3 10 11
        4 5
        */
        ```

    === "模拟视角"

        ```cpp
        #include <bits/stdc++.h>
        #define ll long long
        using namespace std;
        const int N = 2e5 + 5;
        int n, x, a[N];
        int main() {
          cin >> n >> x;
          for (int i = 1; i <= n; ++i) {
            cin >> a[i];
          }
          for (int i = 1, j = n; i < j;) {
            if (a[i] + a[j] > x) {
              j--;
            } else if (a[i] + a[j] < x) {
              i++;
            } else {
              cout << i << ' ' << j;
              return 0;
            }
          }
          cout << "IMPOSSIBLE";
          return 0;
        }
        ```

同样地，由于每个元素最多被 $i, j$ 指针各扫描一次，因此总时间复杂度为 $O(N)$。

## 总结

按扫描类型分类，双指针可以分为：同向扫描，反向扫描。

从对双指针的认知角度和代码编写来看，既可以将双指针作为一种模拟算法来看待，也可以从优化枚举的角度来看。

因此双指针就有 $2 \times 2$ 种写法，在平时的学习过程中应灵活运用（从应试的角度说，把其看做为模拟有助于理解双指针）。

在双指针的实现过程中（无论是模拟视角还是优化枚举视角），一定要注意下标范围的问题！！！

## 习题

### 逐月 P1447 子段和

!!! 题意

    给定一个长度为 $n$ 的正整数序列和一个正整数 $x$。求出有多少子段满足子段和为 $x$。

由于题目给定的元素均为正整数，我们可以考虑使用同向扫描的双指针解决这个问题。

定义两个指针 $i, j$ 用于指明子段的头尾元素，$sum$ 记录子段和。

- 初始时，`i = 1, j = 0, sum = 0`
- 不断做如下操作，直到超出枚举范围
  - 如果 $sum \lt x$，`j++, sum += a[j]`
  - 否则 $sum \ge x$，`sum -= a[i], i++`

在指针移动的过程中统计答案即可。时间复杂度 $O(n)$。

### 逐月 P1185 判断回文数组

!!! 题意

    给定一个整数数组，判断其是否回文。

使用反向扫描的双指针模拟题意即可。时间复杂度 $O(n)$。

### 逐月 P1446 二元函数

!!! 题意

    给定正整数 $N$，请求出不少于 $N$ 的最小正整数 $X$，使得 $X$ 能被表示为 $f(a, b) = a^3 + a^2b + ab^2 + b^3$，其中 $a, b$ 均为非负整数。$0 \le N \le 10^{18}$。

构造法枚举技巧：通过枚举 $a, b$ 的值来构造出不少于 $N$ 的 $X$，进而对这些 $X$ 求出最小值。

技巧：看到式子中有三次项，以及 $N \le 10^{18}$，可以推测出 $a, b \le 10^6$。当 $a = 10^6, b = 0$ 时，该式子的值为 $10^{18}$，由于 $N \le 10^{18}$，因此答案不可能比 $10^{18}$ 大。

如果暴力枚举 $a, b$ 进行求解，显然超时。如果首先枚举 $a$，可以发现如下单调性：

- 当 $a$ 固定时，随着 $b$ 的增大，$f(a, b)$ 严格增大。
- 随着 $a$ 的增大，符合条件 $f(a, b) \ge N$ 的最小的 $b$ 越来越小。

因此可以考虑使用反向扫描的双指针进行求解。

- 初始时，$a = 0, b = 10^6$
- 从小到大枚举 $a$
  - 从大到小调整 $b$，直到 $f(a, b) \lt N$。

可以在调整的过程中维护最小的 $X$，也可以在调整 $b$ 结束之后维护。时间复杂度 $O(V)$，其中 $V = 10^6$。

??? 代码

    === "优化枚举视角"

        ```cpp
        #include <bits/stdc++.h>

        using namespace std;
        using ll = long long;

        ll n, ans = LLONG_MAX;

        ll F(ll a, ll b) {
          return a * a * a + a * a * b + a * b * b + b * b * b;
        }

        int main() {
          cin >> n;
          // 初始时，将 i 和 j 分别置为极小值、极大值
          for (ll i = 0, j = 1e6; i <= 1e6; i++) {  // 从小到大枚举 i
            for (; j >= 0 && F(i, j) >= n; j--) {   // 从大到小调整 j
              ans = min(ans, F(i, j));
            }
          }
          cout << ans;
          return 0;
        }
        ```

    === "模拟视角"

        ```cpp
        #include <bits/stdc++.h>
        #define ll long long
        using namespace std;
        const int N = 2e5 + 5;
        const ll inf = 1e18;
        ll n, x, ans = inf;
        ll f(ll a, ll b) {
          return a * a * a + a * a * b + a * b * b + b * b * b;
        }
        int main() {
          cin >> x;
          for (int i = 0, j = 1e6; i <= 1e6;) {
            if (j >= 0 && f(i, j) >= x) {
              ans = min(ans, f(i, j));
              j--;
            } else {
              i++;
            }
          }
          cout << ans;
          return 0;
        }
        ```

### 逐月 P1596 两数之差

!!! 题意

    给定一个整数数组 $A$ 和一个整数 $X$，判断是否存在一对不同的 $i, j$ 使得 $A_i - A_j = X$。

技巧：对式子做变形为 $A_i = A_j + X$。

单调性：随着 $A_i$ 的增大，符合要求的 $A_j$ 肯定增大。

我们可以将数组先排序，然后使用同向扫描的双指针。

- 初始时，`i = j = 1`
- 从小到大枚举 $A_i$
  - 从小到大调整 $A_j$，直到 $A_j + X \ge A_i$
  - 判断停下来的 $j$ 是否满足 $A_i = A_j + X$
  
时间复杂度 $O(N)$。

??? 代码

    === "优化枚举视角 1"

        ```cpp
        #include <bits/stdc++.h>

        using namespace std;

        const int MAXN = 2e5 + 1;

        int n, x, a[MAXN];

        int main() {
          ios::sync_with_stdio(0), cin.tie(0);
          cin >> n >> x;
          for (int i = 1; i <= n; i++) {
            cin >> a[i];
          }
          sort(a + 1, a + n + 1);  // 先让序列有序
          // 初始时，i 和 j 都指向头元素
          for (int i = 1, j = 1; i <= n; i++) {       // 从小到大枚举 i
            for (; j <= n && a[j] + x < a[i]; j++) {  // 从小到大调整 j
            }
            if (j <= n && a[j] + x == a[i]) {
              cout << "Yes";
              return 0;
            }
          }
          cout << "No";
          return 0;
        }

        /*
        atcoder 数据为随机，实际上存在一种针对 20 行 j <= n 的数据
        5 -1
        -1 -1 -1 -1 -1
        NO
        */
        ```
    === "优化枚举视角 2"

        ```cpp
        #include <bits/stdc++.h>
        #define ll long long
        using namespace std;
        const int N = 2e5 + 5;
        int n, x, a[N];
        int main() {
          cin >> n >> x;
          for (int i = 1; i <= n; ++i) {
            cin >> a[i];
          }
          sort(a + 1, a + 1 + n);
          for (int i = 1, j = 1; i <= n; ++i) {
            while (j <= n && a[j] - a[i] < x) {
              ++j;
            }
            if (j <= n && a[j] - a[i] == x) {
              cout << "Yes";
              return 0;
            }
          }
          cout << "No";
          return 0;
        }
        ```