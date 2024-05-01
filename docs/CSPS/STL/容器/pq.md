# priority_queue

优先队列，C++ 已经封装好的堆。比赛中常用优先队列代替堆的实现。

## 头文件

```cpp
#include <queue>
```

## 定义

```cpp
#include <vector>
#include <queue>
#include <functional>

// 定义时需要三个参数：数据类型为 TypeName，底层容器为 Container，比较器函数对象为 Compare
// 不指定 Container 和 Compare 时，默认底层容器为 vector，默认比较器规则为 less<TypeName>
priority_queue<TypeName, [Container], [Compare]> pq;

priority_queue<int> pq1;  // 默认为大根堆
priority_queue<int, vector<int>, greater<int>> pq3;  // 小根堆，需要引入头文件 <functional>
```

## 成员函数

$O(1)$ 时间复杂度：

* `top()` 访问堆顶元素（优先队列不能为空）
* `empty()` 判断容器是否为空
* `size()` 查询元素数量

$O(\log n)$ 时间复杂度：

* `push(x)` 插入元素
* `pop()` 删除堆顶元素（优先队列不能为空）

无 `clear()`，清空可以在局部定义容器，或者不断 `pop()`。

## 自定义比较器

对于结构体类型，我们需要定义其比较规则才能用优先队列维护该类型元素。

```cpp
struct Node {
  int x, id;
};
```

### 方法 1：定义比较器函数对象

```cpp
// 最一般的写法
struct cmp {
  bool operator()(const Node &i, const Node &j) const {  // 函数尾的 const 修饰符表示该函数不能对所在类的成员进行修改
    return i.x < j.x;
  }
};

priority_queue<Node, vector<Node>, cmp> pq;  // 定义了一个 x 为关键字的大根堆
```

### 方法 2：重载运算符

```cpp
bool operator<(const Node &i, const Node &j) {
  return i.x > j.x;
}

priority_queue<Node> pq;  // 定义了一个 x 为关键字的小根堆
```

```cpp
struct Node {
  int x, id;
  bool operator < (const Node &i) const {
    return x > i.x;
  }
};

priority_queue<Node> pq;  // 定义了一个 x 为关键字的小根堆
```

### 方法 3：使用 lamda 表达式（C++11）

```cpp
auto cmp = [](const Node &i, const Node &j) {
  return i.x < j.x;
};

priority_queue<Node, vector<Node>, decltype(cmp)) pq; // x 为关键字的大根堆
```

## 例子

```cpp
struct cmp{
  bool operator()(int i, int j) {
    return i > j;
  }
};

priority_queue<int> pq1;  // 默认为大根堆
priority_queue<int, vector<int>, cmp> pq2;  // 特别注意比较器的实现，跟 sort 比较器反着来

pq1.push(1);
pq1.push(2);
cout << pq1.top() << '\n';  // 2
pq1.pop();
cout << pq1.top() << '\n';  // 1

pq2.push(1);
pq2.push(2);
cout << pq2.top() << '\n';  // 1
pq2.pop();
cout << pq2.top() << '\n';  // 2
```

### 结构体

```cpp
struct Student {
  int a, b, c;  // 语数外
};

struct cmp {
  bool operator()(const Student &i, const Student &j) const {
    if (i.a != j.a) {
      return i.a < j.a;
    }
    if (i.b != j.b) {
      return i.b < j.b;
    }
    return i.c < j.c;
  }
};

priority_queue<Student, vector<Student>, cmp> pq;  // 按语数外从高到低排

int main() {
  ios::sync_with_stdio(0);
  cin.tie(0), cout.tie(0);
  pq.push({100, 100, 90});
  pq.push({100, 100, 100});
  pq.push({100, 90, 100});
  pq.push({90, 100, 100});
  while (!pq.empty()) {
    Student x = pq.top();
    pq.pop();
    cout << x.a << ' ' << x.b << ' ' << x.c << '\n';
  }
  return 0;
}
```