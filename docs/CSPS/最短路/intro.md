# 最短路介绍

## 状态转移视角

最短路模型通常指这一类问题：

1. 状态描述为 $(a, b, c, d, e, f)$，$f$ 是最优化属性，并且每次转移 $f$ 会**往更劣的方向转移**，请求出从初始状态到目标状态的最优化属性值。
2. 具体的一种例子：给定一张带非负边权的图，请你求出从起点到终点的最短路径的长度。

以 2 的具体例子来说，我们可以在求最短路的过程中：

- 每次找到一个未确定最短路的点中，离起点（初始状态）最近的点（状态），那么起点到这个点的最短路长度就确定了下来。
    - 该点的最短路在后续不会被更新。
    - 请学生进行证明。
- 当确定一个点（状态）的最短路后，用它来更新起点到与该点相邻的点的最短路。

实际上，这里面是按照最短路长度从小到大的方式确定了起点到其他每个点的最短路（是不是有一种拓扑序的感觉？也可以理解为一种数学归纳法）。

## 图论视角

### 定义

路径

最短路（有向图，无向图）

单源最短路，多源最短路，每对点之间最短路

简单路径

环，负环

重边，自环。

带负权边的图

最短路径长度简称为距离。

为方便起见，对于图  $G = (V, E)$，定义：

- 令 $N, M$ 分别表示点数 $|V|$ 和边数 $|E|$。
- $S$ 为源点。
- $D(u)$ 为源点到 $S$ 的最短路径长度。
- $w(u, v)$ 表示 $u \to v$​ 的边权。
- 无向边视为两条反向的有向边，有向边简称为边。

### 单源最短路

给定图 $G = (V, E)$ 和一个点 $S$，单源最短路径的目标是求得从源点 $S$ 到其他每个顶点的最短路径长度 $D(u)$​​。

如果 $S$ 和 $u$ 之间没有简单路径，则记 $D(u) = +\infty$​。

### 多源最短路

### 松弛

对于一条 $u \to v$​ 的边，定义：

- 三角不等式：如果 $D(v) \le D(u) + w(u, v)$，则称该边满足三角不等式。

- 松弛操作：如果 $D(v) \gt D(u) + w(u, v)$，则 $D(v) \gets D(u) + w(u, v)$​​​。

从状态转移视角来看，状态为 $(u, l)$，表示路径终点为 $u$、长度为 $l$，转移就是通过一条 $u \to v$ 的边移动到另一个点 $v$ 上。

### 各种最短路算法的特性

对于不包含负环的图，任意两个结点之间的最短路径为简单路径，路径上点数至多为 $N$、边数至多为 $N- 1$​。

| 最短路算法     | Floyd                | Bellman–Ford | Dijkstra      |
| :------------- | :------------------- | :----------- | :------------ |
| 最短路类型     | 每对结点之间的最短路 | 单源最短路   | 单源最短路    |
| 作用于         | 任意图               | 任意图       | 非负权图      |
| 能否检测负环？ | 能                   | 能           | 不能          |
| 时间复杂度     | $O(N^3)$             | $O(NM)$      | $O(M \log M)$ |

注：表中的 Dijkstra 算法在计算复杂度时均用 `priority_queue` 实现。



