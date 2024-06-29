# vector

参见 [oi-wiki vector](https://oi-wiki.org/lang/csl/sequence-container/)

`vector` 是 C++ STL 提供的内存连续、可变长度的数组容器。

```cpp
#include <vector>  // 引入头文件 vector

vector<Type> v;  // 定义了一个存储 Type 类型的 vector 容器
v.push_back(x);  // 向 vector 容器中添加元素 x
v.pop_back();    // 弹出 vector 容器中最后一个元素
v.size();        // 返回 vector 容器中元素的个数
v.empty();       // 判断 vector 容器是否为空
v.begin();       // 返回 vector 容器中第一个元素的迭代器
v.end();         // 返回 vector 容器中最后一个元素的迭代器（这里的最后一个元素指，v[v.size() - 1] 后的一个空元素）
v.front();       // 返回 vector 容器中第一个元素的引用
// v.front() = 10; 
v.back();        // 返回 vector 容器中最后一个元素的引用
// v.back() = 10;
v[0] = 10;       // 支持下标访问，vector 容器中的元素从下标 0 开始，v[i] 返回下标为 i 的元素的引用
// 上述操作时间复杂度均为 O(1)
v.clear();       // 清空 vector 容器，时间复杂度 O(n)


vector<int> v1, v2;
v1.swap(v2);     // 交换两个 vector 容器的内容，时间复杂度 O(1)
swap(v1, v2);    // 交换两个 vector 容器的内容，时间复杂度 O(1)
v1 == v2;        // 判断两个 vector 容器是否相等，时间复杂度 O(n)，同理，支持 ==, !=
v1 > v2;         // 对 v1 和 v2 进行字典序比较，时间复杂度 O(n)，同理，支持 >, >=, <, <=

sort(v.begin(), v.end());  // 对 vector 容器中的元素进行排序，时间复杂度 O(nlogn)
reverse(v.begin(), v.end());  // 对 vector 容器中的元素进行反转，时间复杂度 O(n)

// 遍历
for (int i = 0; i < v.size(); i++) {
  cout << v[i] << " ";
}

// c++ 11 新特性 基于范围的循环
for (auto &x : v) {  // auto 自动推导类型，这行代码的意思是遍历 vector 容器中的元素 x，遍历顺序为从头到尾
  cout << x << " ";
}
for (int x : v) {
  cout << x << " ";
}

struct Node {
  int x, y;
};

vector<Node> arr;
bool cmp(const Node &i, const Node &j) {
  return i.x < j.x;
}
sort(arr.begin(), arr.end(), cmp);
reverse(arr.begin(), arr.end());

int x, y;
cin >> x >> y;
arr.push({10, 20});  // {} 初始化列表

vector<int> num[100];  // 创建 100 个 vector 容器，每个 vector 容器中存储 int 类型的元素
```

## abc271_b

空间复杂度为 $O(N + \sum \limits_{i = 1}^N L_i)$，定义了 $N$ 个 `vector`，一共存储 $\sum \limits_{i = 1}^N L_i$ 个元素。