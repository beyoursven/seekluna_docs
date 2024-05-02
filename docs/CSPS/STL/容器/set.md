# set

包含不同元素的有序集合容器，使用比较操作，底层是红黑树（平衡树）。

头文件：`<set>`

定义：`set<类型, 比较器> 容器名`，可以用初始化列表或另一个 set 初始化。不指定比较器时使用默认的 `<` 比较规则进行排序。

`set<int> s, t = {1, 2, ..., M}, a = t`，时间复杂度为 $O(1), O(M \log M), O(M)$。

## 基本操作

令 $N$ 为当前容器 `s` 的大小，$x$ 为元素，$it$ 为迭代器

### 修改

- `s.clear()` 清空，$O(N)$
- `s.insert()` 插入元素
  - `s.insert(x)`，$O(\log N)$
  - `s.insert({1, 2, ..., M})`，$O(M \log (M + N))$
- `s.erase()` 删除元素，容器不包含指定元素则不删除，$O(\log N)$
  - `s.erase(x)` 删除元素 $x$
  - `s.erase(it)` 删除 $it$ 指向的元素，`it` 不能为尾迭代器
- `s.swap(other), swap(s, other)`，将容器和 $other$ 交换，$O(1)$
  - `swap` 数组的时间复杂度为 $O(N)$

- `=`
  - `s = other`，用容器赋值，$O(|N| + |other|)$
  - `s = {1, 2, ..., M}`，用初始化列表赋值，$O((N + M) \log (N + M))$

### 查找

- `s.count(x)`，返回容器内 $x$ 的数量，$O(\log N)$
- `s.find(x)`，返回容器内指向值为 $x$ 的元素的迭代器，如果不存在则返回 `.end()`，$O(\log N)$
- `s.lower_bound(x)` 和 `s.upper_bound(x)`，返回容器内指向大于等于和大于 $x$ 的第一个元素的迭代器，如果不存在则返回 `s.end()`，$O(\log N)$。
  - 不是二分，需要跟 `lower_bound(), upper_bound()` 区分
  - 直接用 `set<int> s; lower_bound(s.begin(), s.end(), x)` 时间复杂度线性 $O(N)$

- `s.empty()` 和 `s.size()`
- `s.begin()` 和 `s.end()`

### 比较

`==, !=, <, <=, >, >=`，当 `lhs, rhs` 大小不同时，`lhs == rhs, lhs != rhs` 时间复杂度 $O(1)$（因为只需要判断大小），其余情况均使用字典序比较 $O(N)$。

## 比较器

语法结构同 `priority_queue`，但是不用像 `priority_queue` 反过来写比较器。可以使用比较器函数对象，可以重载运算符。

参阅[这里](https://usaco.guide/silver/custom-cpp-stl?lang=cpp)：
> 重载小于、大于运算符会自动生成函数对象 `greater<Node>, less<Node>`。

```cpp
#include <iostream>
#include <set>
#include <queue>
#include <vector>
#include <functional>

using namespace std;

struct Node {
  int a, b;
  bool operator<(const Node &i) const {
    return a > i.a;
  }
  bool operator>(const Node &i) const {
    return b > i.b;
  }
};

set<Node, greater<Node>> s;
set<Node, less<Node>> ss;

int main() {
  s = {{10, 1}, {5, 2}, {1, 100}};
  ss = {{10, 1}, {5, 2}, {1, 100}};
  for (auto x : s) {
    cout << x.a << ' ' << x.b << '\n';
  }
  cout << '\n';
  for (auto x : ss) {
    cout << x.a << ' ' << x.b << '\n';
  }
  return 0;
}

/*
output:
1 100
5 2
10 1

10 1
5 2
1 100
*/
```

令比较器 `comp(a, b)`，`set` 判断两元素 $a, b$ 相等的条件为 `!comp(a, b) && !comp(b, a)`。（比较器什么时候返回真）。此处为细节。

```cpp
struct Node {
  int a, id;  // 值，编号
};

struct cmp {
  bool operator()(const Node &i, const Node &j) const {
    return i.a < j.a;
  }
} f;

int main() {
  set<Node, cmp> s;
  s.insert({1, 3}), s.insert({1, 5}), s.insert({-1, -1});
  for (Node x : s) {
    cout << x.a << ' ' << x.id << '\n';
  }
  return 0;
}
/*
output:
-1 -1
1 3
*/
```

如果对于值相同但编号不相同的元素也需要存储，则比较器应为：

```cpp
struct Node {
  int a, id;
};

struct cmp {
  bool operator()(const Node &i, const Node &j) const {
    return i.a < j.a || i.a == j.a && i.id < j.id;
  }
};

int main() {
  set<Node, cmp> s;
  s.insert({1, 3}), s.insert({1, 5}), s.insert({-1, -1});
  for (Node x : s) {
    cout << x.a << ' ' << x.id << '\n';
  }
  return 0;
}
/*
output:
-1 -1
1 3
1 5
*/
```

## 基本使用

```cpp
#include <set>

using namespace std;

set<int> s;

s.insert(3);
s.insert(2);
s.insert(5);
cout << s.count(3) << "\n"; // 1
cout << s.count(4) << "\n"; // 0
s.erase(3);
s.insert(4);
cout << s.count(3) << "\n"; // 0
cout << s.count(4) << "\n"; // 1
```

### 比较器相关

```cpp
struct Node {
  int x, id;
  bool operator <(const Node &i) const {
    return x < i.x || x == i.x && id < i.id;
  }
};

struct cmp {
  bool operator()(const Node &i, const Node &j) {
    return i.x > j.x || i.x == j.x && i.id < j.id;
  }
}

set<Node> s1;  // 按 x 从小到大
set<Node, cmp> s2;  // 按 x 从大到小
struct Node {
  int x, id;
};

struct comp {
  bool operator ()(const Node &i, const Node &j) const {
    return i.x < j.x; // 如果 id 不同，应为 return i.x < j.x || i.x == j.x && i.id < j.id;
  }
};

set<Node, comp> s;

s.insert({1, 2});
s.insert({1, 3});  // 两元素视为相等
cout << s.size();  // 1
```

### 遍历

```cpp
set<int> s = {2,5,6,8};
cout << s.size() << "\n"; // 4
for (int x : s) {
  cout << x << "\n";
}
for (auto it = s.begin(); it != s.end(); it++) {
  cout << *it << '\n';
}
```

不要在遍历时执行 `.insert`、`.erase` 等修改容器的操作，否则 RE、WA。

### lower_bound, upper_bound 相关

一定要注意迭代器的各种边界问题。

```cpp
set<int> s;
s.insert(1); // [1]
s.insert(14); // [1, 14]
s.insert(9); // [1, 9, 14]
s.insert(2); // [1, 2, 9, 14]

auto it = s.lower_bound(3);  // 指向值 9
cout << *prev(it);  // 访问 < 3 的最大元素 2

cout << *s.upper_bound(7) << '\n'; // 9
cout << *s.upper_bound(9) << '\n'; // 14
cout << *s.lower_bound(5) << '\n'; // 9
cout << *s.lower_bound(9) << '\n'; // 9
cout << *s.begin() << '\n'; // 1
auto it = s.end();
cout << *(--it) << '\n'; // 14
s.erase(s.upper_bound(6)); // [1, 2, 14]

auto it = s.find(x);
if (it != s.end()) {  // 找到元素 x
} else {  // 没找到元素 x
}
```

思考题：如何找到集合中离 $x$ 最近的元素？

```cpp
auto it = s.lower_bound(x);
if (it == s.begin()) {
  cout << *it << "\n";
} else if (it == s.end()) {
  it--;
  cout << *it << "\n";
} else {
  int a = *it; it--;
  int b = *it;
  if (x - b < a - x) cout << b << "\n";
  else cout << a << "\n";
}

// 如果一开始插入一个极小值和一个极大值，不需要做分类讨论
s.insert({-INF, INF});
auto it = s.lower_bound(x);
int a = *it; it--;
int b = *it;
if (x - b < a - x) cout << b << "\n";
else cout << a << "\n";
```