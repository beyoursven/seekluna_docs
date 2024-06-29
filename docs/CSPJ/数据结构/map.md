# map

本处只介绍 C++ STL 中的映射容器 `map` 的简单使用。

`map` 存储了键（key）到值（value）的映射，每个 key 都是为唯一的，但是 value 可以重复。

`map` 最主要支持三种操作：

1. 加入一个映射。
2. 删除一个映射。
3. 查找一个给定 key 映射到的值。

对于一个容器名为 `m` 的 `map` 容器：

1. m[key]：返回 key 映射到的 value 的引用。
   1. 如果 key 不存在，则插入一个 key-value 映射，并返回 value 的引用。

```cpp
map<type1, type2> h;  // 创建一个 type1 类型元素到 type2 类型元素的映射容器 h
```