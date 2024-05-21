# STL 容器

## C++ STL 中的队列

### queue

注意没有 `.clear()`，不支持下标访问。

```cpp
#include <queue>

queue<类型> que;
que.front();  // 返回队头元素
que.back();  // 返回队尾元素
que.empty();  // 返回队列是否为空
que.size();  // 返回队列大小
que.push(x);  // 压入元素 x
que.pop();  // 弹出队头
```

### deque

双端队列，可以在队头和队尾都进行插入删除，比较特殊的一点是支持下标访问。使用方法类似于 `vector`。缺点是常数比较大。

```cpp
#include <deque>

deque<类型> a, b;
deque<int> g

// O(1)
cout << a[5];  // 支持下标访问，元素下标从 0 开始
a.front(), a.back();  // 返回首元素，尾元素，队首元素为 a[0]
a.empty();  // 返回是否为空
a.size();  // 返回大小
a.push_back(x);  // 在尾部加入元素 x
a.pop_back();  // 删除尾部元素
a.push_front(x);  // 在头部加入元素 x
a.pop_front();  // 删除头部元素

// O(n)
a.resize(SIZE);
a.clear();  // 清空 deque
a = b;
```

## C++ STL 中的栈

注意没有 `.clear()`，不支持下标访问。

```cpp
#include <stack>

stack<类型> st;
st.push(x);  // 压入元素 x
st.pop();  // 弹出栈顶
st.top();  // 返回栈顶元素
st.size();  // 返回栈的大小
st.empty();  // 返回栈是否为空

// 上述成员函数时间复杂度均为 $O(1)$
```

实际上你也可以使用 `vector` 替代 `stack`。

[参考链接](https://oi-wiki.org/ds/stack/)

## 栈和队列相关题目

使用 STL 容器全部完成

- 逐月 P1336 栈练习
- 逐月 P1337 括号配对
- 洛谷 P1449 后缀表达式
- 洛谷 P1241 括号序列
- 洛谷 P4387 验证栈序列
- 洛谷 P1981 表达式求值
- 逐月 P1340 队列练习
- 逐月 P1341 循环队列
- 洛谷 P1996 约瑟夫问题
- 洛谷 P1540 机器翻译
- 洛谷 P2058 海港