# 队列

![](https://oi-wiki.org/ds/images/queue.svg)

队列是一种先进先出（first in first out，FIFO）的线性结构。

队列的两端被称为被称为队头和队尾，只能在队头删除元素，只能在队尾加入元素。

可以用单链表实现队列，队头就是链表头，队尾就是链表尾。

双端队列是一种特殊的队列，可以在队头队尾两头进行添加和删除操作。

## STL queue

C++ STL 提供了一个队列容器 `queue` 和双端队列容器 `deque`。

```cpp
// 以下为队列 queue

#include <queue>  // 引入头文件

queue<Type> q;  // Type 为数据类型，定义了一个存储 Type 元素的队列

q.push(item);  // 把元素 item 压入队尾
q.pop();       // 弹出队头
q.front();     // 返回队头元素
q.back();      // 返回队尾元素
q.size();      // 返回队列中元素数量
q.empty();     // 返回队列是否为空
// 上述成员函数时间复杂度 O(1)

// 以下为双端队列 deque

#include <deque>  // 引入头文件

deque<Type> dq;  // Type 为数据类型，定义了一个存储 Type 元素的双端队列

dq.push_front(item);  // 把元素 item 压入队头
dq.push_back(item);   // 把元素 item 压入队尾
dq.pop_front();       // 弹出队头
dq.pop_back();        // 弹出队尾
dq.front();           // 返回队头元素
dq.back();            // 返回队尾元素
dq.size();            // 返回队列中元素数量
dq.empty();           // 返回队列是否为空
dq[i];                // 双端队列支持下标随机访问，dq[0] 是当前队头
// 上述成员函数时间复杂度 O(1)
dq.clear();           // 清空双端队列，该操作 queue 和 stack 不支持，时间复杂度 O(n)
```

在进行 `.pop()`、`.top()` 等操作时，注意容器不能为空。

注意，`queue` 没有 `.clear()` 成员函数。`deque` 在实际使用中常数很大。

题目：洛谷 B3616

### 数组模拟队列和双端队列。

以下为数组模拟队列。

```cpp
int que[100];  // 数组模拟队列
int h = 1, t;  // 队头和队尾指针，都从 1 开始编号，h 指向队头元素，t 指向队尾元素，队列中的元素为 que[h], que[h + 1], ..., que[t]
bool empty() {  // 判断队列是否为空
  return h > t;
}
int size() {  // 返回队列大小
  return t - h + 1;
}
void push(int x) {  // 压入元素
  que[++t] = x;
}
void pop() {       // 弹出元素
  if (!empty()) {  // 注意，弹出队头元素时队列不能为空
    h++;
  }
}
int front() {      
  if (!empty()) {  // 注意，取出队头元素时队列不能为空
    return que[h];
  }
}
int back() {       // 返回队尾元素
  if (!empty()) {  // 注意，取出队尾元素时队列不能为空
    return que[t];
  }
}
void clear() {  // 清空队列
  h = 1, t = 0;
}
void print() {  // 遍历队列
  for (int i = h; i <= t; i++) {
    cout << que[i] << " ";
  }
}
```

以下为数组模拟双端队列。

```cpp
// 以下为双端队列操作
int que[2 * MAXN];
int h = MAXN, t = MAXN - 1;  // 数组模拟双端队列时注意下标越界的问题
void push_front(int x) {  // 压入队头元素
  que[--h] = x;
}
void push_back(int x) {  // 压入队尾元素
  que[++t] = x;
}
// 其他操作与队列一致
```

数组模拟队列相比 STL `queue` 支持下标访问，可以实现的操作更多。

在实际使用中，如果需要使用到双端队列，一般会用数组或者链表模拟实现，因为 STL `deque` 常数过大。

## 应用

队列的特殊应用偏少，主要是作为一种数据结构用于模拟、维护题目所要求的的各种信息。

### 一般模拟题目

洛谷 P1996 约瑟夫问题

洛谷 P1540 机器翻译

洛谷 P2058 海港

### 单调队列

逐月 P1342 单调队列