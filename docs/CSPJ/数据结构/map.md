# map

本处只介绍 C++ STL 中的映射容器 `map` 的简单使用。

`map` 存储了键（key）到值（value）的映射，每个 key 都是为唯一的，但是 value 可以重复。

`map` 最主要支持三种操作：

1. 加入一个映射。
2. 删除一个映射。
3. 查找一个给定 key 映射到的值。

对于一个容器名为 `m` 的 `map` 容器：

- `m[key]`：返回 key 映射到的 value 的引用。
    - 如果 `key` 不存在，则调用 `value` 的默认构造函数插入一个 `key` 到 `value` 默认映射，并返回 `value` 的引用。
        - 例如，如果 `value` 是 `int` 类型，则默认值为 $0$。
        - 例如，如果 `value` 是 `string` 类型，则默认值为空字符串。
    - 如果 `key` 存在，则返回 `key` 映射到的 `value` 的引用。
- `m.erase(key)`：删除 `key` 映射到 `value` 的映射。
- `m.count(key)`：返回 `key` 映射到的 `value` 的个数，可以用于判断是否存在 `key` 映射。
- `m.clear()`：清空容器。
- `m.find(key)`：返回 `key` 映射到的 `value` 的迭代器。
    - 可以使用 `m.find(key) != m.end()` 来判断是否存在一个 `key` 映射。
- `m.begin()`：返回第一个映射的迭代器。
- `m.end()`：返回最后一个映射的迭代器。
- `m.size()`：返回容器中映射的个数。
- `m.empty()`：判断容器是否为空。
- `m.clear()` 时间复杂度为 $O(n)$，`m.size()` 和 `m.empty()` 时间复杂度为 $O(1)$，其他插入、删除、查找操作的时间复杂度为 $O(\log n)$。

```cpp
map<type1, type2> h;  // 创建一个 type1 类型元素到 type2 类型元素的映射容器 h

map<int, int> m;
m[1] = 5;                    // [(1, 5)]
m[3] = 14;                   // [(1, 5); (3, 14)]
m[2] = 7;                    // [(1, 5); (2, 7); (3, 14)]
m[0] = -1;                   // [(0, -1); (1, 5); (2, 7); (3, 14)]
m.erase(2);                  // [(0, -1); (1, 5); (3, 14)]
cout << m[1] << endl;        // 5
cout << m.count(7) << endl;  // 0
cout << m.count(1) << endl;  // 1
cout << m[2] << endl;        // 0
cout << (m.find(11) == m.end()) << endl;  // 1
```

## 遍历

`map` 中存储的映射是用 `pair<type1, type2>` 进行存储的。

```cpp
map<int, int> m;
// 基于范围的循环
for (auto x : m) {  // 此处 auto 为 pair<int, int>，x 为 m 中的映射
  cout << x.first << " " << x.second << endl;  // x.first 是 key，x.second 是 value
}

map<int, string> h;
for (auto &x : m) {  // x 为 m 中的映射的引用
  x.second = "abc666";  // 将所有 key 映射到的 value 都改成 "abc666"
}
```

请注意，不要在遍历时对 `map` 进行插入或删除操作，否则会出错。

```cpp
map<int, int> m;

for (int i = 0; i < 10; ++i) m[i] = i;

for (auto &it : m) {
	cout << "Current Key: " << it.first << endl;

	m.erase(it.first);
}
```

上述代码会报 `Rumetime Error` 或者 `Segmentation Fault` 错误。