# multiset

多重集合，头文件、定义、初始化、绝大部分操作和成员与 `set` 一致，有几个特殊点需要记住。

令 $N$ 为多重集容器大小，$x$ 为容器中的一个元素，`multiset<int> s`，令 $M$ 为 $x$ 在多重集中出现的次数。

- `s.count(x)`，返回 $x$ 在多重集中的出现次数，$O(\log N + M)$
- `s.erase(x)`，删除多重集容器内**所有**值为 $x$ 的元素，$O(\log N + M)$
- 如果只想查找是否存在元素 $x$、删除一个值为 $x$ 的元素，使用 `s.find(x) != s.end()` 和 `auto it = s.find(x); if (it != s.end()) s.erase(it)`。直接删除尾迭代器报错。

```cpp
// multiset 的 erase 操作
multiset<int> ms;
ms.insert(1); // [1]
ms.insert(14); // [1, 14]
ms.insert(9); // [1, 9, 14]
ms.insert(2); // [1, 2, 9, 14]
ms.insert(9); // [1, 2, 9, 9, 14]
ms.insert(9); // [1, 2, 9, 9, 9, 14]
cout << ms.count(4) << '\n'; // 0
cout << ms.count(9) << '\n'; // 3
cout << ms.count(14) << '\n'; // 1
ms.erase(ms.find(9));
cout << ms.count(9) << '\n'; // 2
ms.erase(9);
cout << ms.count(9) << '\n'; // 0
```