# 队列

队列是 OI 中常见的一种线性数据结构，队列中元素的插入和删除是按照【先进先出】的原则进行的，因此队列也被称为先进先出（first in first out）的线性表，简称 FIFO 表。

## 结构

（示意图，队尾，队头）

（在队尾插入，在队头删除，类似于排队）

## 数组模拟队列

### 定义

```cpp
int q[100];  // queue
int head = 1, tail = 0; // 队头队尾指针，队尾指向的是队列中的最后一个元素
```

### 遍历

```cpp
// 从队头到队尾输出每个元素
for (int i = head; i <= tail; i++){
  cout << q[i] << ' ';
}
```

### 压入

```cpp
// 将元素压入队尾
void push(int x){
  q[++tail] = x;
}
```

### 弹出

```cpp
// 弹出队头元素
void pop(){
  head++;
}
// 访问队头元素
int front(){
  return q[head];
}
```

### 大小

```cpp
int size() {
  return tail - head + 1;
}

int empty() {
  return head == tail + 1;
} 
```

## 题目

- 逐月 P1340 队列练习
- 逐月 P1341 循环队列
- 洛谷 P1996 约瑟夫问题
- 洛谷 P1540 机器翻译
- 洛谷 P2058 海港

## 双栈模拟队列

冷门方法，初赛中有涉及。

[参考链接](https://oi-wiki.org/ds/queue/)