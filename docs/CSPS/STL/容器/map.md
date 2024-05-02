# map

包含元素对 `<key, value>` 的有序映射容器，可以看做是 `key` 映射到 `value`。`map` 要求所有的映射的 `key` 是互不相同的，`value` 可以重复。底层是红黑树。所有映射按照 `key` 排序。

头文件 `<map>`。 

定义：`map<key 类型, value 类型, 比较器> 容器名`。默认比较器为 `<` 规则。

无需管 `multimap`，没用过。

比较器的细节同 `set`。

## 基本使用

插入，删除，查找都是 $O(\log N)$ 的。$N$ 为映射对数量。`map<key, value> m;`

- `m[x]`，访问 `x` 映射到的 value，如果 `m` 中不存在该映射，会新建一个 `x` 到 value 类型默认值的映射（int, string）。
- `m[x] = y`，赋值。
- `m.count(x)`，返回 `m` 中有多少个 `x`，也就是看是否存在 key 为 `x` 的映射。
- `m.erase(x)`，删除 `key` 为 `x` 的映射，没有不删除
- `m.erase(it)`，删除 `it` 迭代器指向的映射，`it` 不为尾迭代器。
- `m.find(x)`，返回 `key` 为 `x` 的映射的迭代器。查找映射以及判断映射是否存在应使用 `.find()` 而非 `[]`，加快效率。
- `m.lower_bound(x), m.upper_bound(x)`，返回第一个 `key` 大于等于和大于 `x` 的映射的迭代器。
- `.insert(), .begin(), .end(), .empty(), .size(), .clear(), .swap()`

```cpp
map<int, int> m;
m[1] = 5;                    // [(1, 5)]
m[3] = 14;                   // [(1, 5); (3, 14)]
m[2] = 7;                    // [(1, 5); (2, 7); (3, 14)]
m[0] = -1;                   // [(0, -1); (1, 5); (2, 7); (3, 14)]
m.erase(2);                  // [(0, -1); (1, 5); (3, 14)]
cout << m[1] << endl;        // 5
cout << m.count(7) << endl;  // 0
cout << m.count(1) << endl;  // 1
cout << m[2] << endl;        // 0，若不存在映射则新建一个映射
```

### pair 相关

`map` 中存储映射的方式是使用 C++ `pair`。如果你定义了一个 `map<string, int> m`，那么所有的映射都是类型 `pair<string, int>`，那么你可以使用如下方式遍历：

```cpp
for (const auto &x : m) { cout << x.first << " " << x.second << endl; }
for (auto x : m) { cout << x.first << " " << x.second << endl; }
for (pair<string, int> x : m) { cout << x.first << " " << x.second << endl; }

// .first 是第一个元素 string 类型，.second 是第二个元素 int 类型
```

推荐使用第一种，常引用和拷贝的区别。特别地，由于可以使用引用，你还可以用下述方式修改映射：

```cpp
for (auto &x : m) {
  x.second = 1234;  // 把所有映射的 value 改为 1234
}

map<string, int> h = {{"zsc", 250}};
auto it = h.find("zsc");
it->second = 0;  // 将 "zsc" 映射为 0
```

你可以在遍历时修改映射的 value，但不能增加新的映射、删除已有映射，否则会 RE。

```cpp
map<int, int> m;

for (int i = 0; i < 10; ++i) m[i] = i;

for (auto &it : m) {
  cout << "Current Key: " << it.first << endl;

  m.erase(it.first);
}
```

因此你要删除时，你可以拷贝一个新 `map` 来删除，或者将需要删除的 `key` 记录下来最后删除：

```cpp
map<int, int> m, M;

for (int i = 0; i < 10; ++i) m[i] = i;

int current_iteration = 0;

for (const auto &it : m) {
  if (current_iteration % 3 == 0) { M[it.first] = it.second; }

  current_iteration++;
}

swap(m, M);

cout << "Entries:" << endl;
for (const auto &it : m) { cout << it.first << " " << it.second << endl; }
/*
 * Entries:
 * 0 0
 * 3 3
 * 6 6
 * 9 9
 */
```

```cpp
map<int, int> m;
for (int i = 0; i < 10; ++i) { m[i] = i; }

vector<int> to_erase;
int current_iteration = 0;

for (const auto &it : m) {
  if (current_iteration % 3 == 0) { to_erase.push_back(it.first); }

  current_iteration++;
}

for (int key : to_erase) { m.erase(key); }

cout << "Remaining entries:" << endl;
for (const auto &it : m) { cout << it.first << " " << it.second << endl; }

/*
 * Remaining entries:
 * 1 1
 * 2 2
 * 4 4
 * 5 5
 * 7 7
 * 8 8
 */
```

### 比较器

同 `set`。

### lower_bound, upper_bound

```cpp
map<int, int> m;
m[3] = 5;     // [(3, 5)]
m[11] = 4;    // [(3, 5); (11, 4)]
m[10] = 491;  // [(3, 5); (10, 491); (11, 4)]
cout << m.lower_bound(10)->first << " " << m.lower_bound(10)->second
     << '\n';  // 10 491
cout << m.upper_bound(10)->first << " " << m.upper_bound(10)->second
     << '\n';  // 11 4
m.erase(11);   // [(3, 5); (10, 491)]
if (m.upper_bound(10) == m.end()) {
  cout << "end" << endl;  // Prints end
}
```