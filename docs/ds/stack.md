# 栈

栈是 OI 中常见的一种线性数据结构，栈中元素的插入和删除是按照【先进后出】的原则进行的，因此栈也被称为后进先出（last in first out,）的线性表，简称 LIFO 表。

## 结构

（示意图，栈底，栈顶）

（插入和删除元素操作只能在栈顶进行）

## 数组模拟实现

### 定义

```cpp
int stk[100]; // 数组模拟栈，stack
int top = 0; // 栈顶指针，栈底从 1 开始编号，栈顶指向栈的最上面的元素
```

### 遍历

时间复杂度 $O(n)$，其中 $n$ 为栈中元素数量。

```cpp
// 从栈底到栈顶输出元素
void print(){
  for (int i = 1; i <= top; i++){
    cout << stk[i] << ' ';
  }
}
```

### 压入

时间复杂度 $O(1)$。

```cpp
// 压入元素到栈顶
void push(int x){
  stk[++top] = x;
}
```

### 弹出

时间复杂度 $O(1)$。

```cpp
// 弹出栈顶元素
void pop(){
  top--;
}
// 访问栈顶元素
int Top(){
  return stk[top];
}
```

弹出元素、访问栈顶元素时，栈不能为空。

```cpp
if (top > 0 && stk[top] == x) {
  // do something
}
```

## 应用

### 括号序列

这里首先给出合法括号序列的定义：

!!! 括号序列定义

    定义一个合法括号序列为仅由 `(` 和 `)` 构成的字符串 `S`，且满足以下所有条件：
    
    - 如果 `S` 是空串，`S` 是合法括号序列
    - 如果 `S` 是合法括号序列，那么在 `S` 之外嵌套一对括号得到的字符串 `(S)` 是合法括号序列（嵌套）
    - 如果 `S` 和 `T` 是合法括号序列，那么将 `S` 和 `T` 拼接在一起得到的字符串 `ST` 是合法括号序列（拼接） 

我们有两种判定括号序列是否合法的方法。

#### 方法 1：栈

对于给定的括号序列 $s$，我们按如下步骤维护一个栈：

- 对于 $i = 1, 2, \dots, |s|$（也就是从前往后处理字符串）：
  - 如果 $s_i$ 是 `(`，将当前括号的位置 $i$ 压入栈中
  - 否则，$s_i$ 是 `)`，并且栈不为空，弹出栈顶元素 $x$，并且 $s_x$ 和 $s_i$ 是一对配对的括号
  - 否则，$s_i$ 是 `)` 但栈为空，当前右括号无法配对，因此 $s$ 不是合法括号序列
- 处理结束后，如果栈不为空，说明有左括号无法配对，因此 $s$ 不是合法括号序列
  
时间复杂度 $O(n)$

#### 方法 2：计数

在方法 1 中，我们用一个栈既判定了 $s$ 是否为合法括号序列，同时求出了每对配对的括号的位置。观察到栈中存储的都是左括号位置，如果 $s_i$ 是 `(` 栈中元素数量 $+1$，如果 $s_i$ 是 `)` 且栈非空则栈中元素数量 $-1$。

因此我们可以得到如下的更简洁的判定括号序列的方法：

- 将左括号视作为 $1$，右括号视作为 $-1$，得到新的序列 $a$。
- 求出 $a$ 的前缀和数组 $sum$。
- 如果任意一个位置的前缀和都非负（即 $sum_1, sum_2, \dots, sum_n \ge 0$），并且 $sum_n = 0$，那么括号序列合法。

时间复杂度 $O(n)$。

### 后缀表达式计算

待编写。

## 题目

- 逐月 P1336 栈练习
- 逐月 P1337 括号配对
- 洛谷 P1449 后缀表达式
- 洛谷 P1241 括号序列
- 洛谷 P4387 验证栈序列
- 洛谷 P1981 表达式求值