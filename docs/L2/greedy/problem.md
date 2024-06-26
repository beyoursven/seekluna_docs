# 贪心经典模型

## 区间

!!! 问题 1

    给定 $N$ 个区间 $[l_i, r_i]$，请选出尽可能多的不相交的区间，求出这个数量。$1 \le N \le 10^5, 1 \le l_i, r_i \le 10^9$。

贪心策略：按右端点排序；每次尽可能选择右端点小的、且和上一个选择的区间不相交的区间。

伪证明：右端点递增。右端点越小，后续可选的区间的左端点范围越广。

!!! 问题 2

    给定 $N$ 个区间 $l_i, r_i$。请将区间进行分组，每个区间属于一组，每组至少包含一个区间，并且每组内的区间互不相交。求最少分组数。$1 \le N \le 10^5, 1 \le l_i, r_i \le 10^9$。

贪心策略：按左端点排序；维护一个每组区间的右端点；如果当前区间与所有组的右端点均相交，新开一组，否则找到任意一个不相交的组，更新右端点。$O(N^2)$。

优化：使用优先队列维护所有组的右端点，判断区间相交时，只需要找最小右端点判断即可。$O(N \log N)$。

!!! 问题 3

    给定 $N$ 个区间 $l_i, r_i$。使用最少的区间能够拼成 $[1, V]$（这些区间的并集完全包括 $[1,V]$）。求最少区间数，或者判定不可行。$1 \le N \le 10^5, 1 \le l_i, r_i, V \le 10^9$。

贪心策略：每次尽可能覆盖到最远的点。

实现：按左端点排序；假定当前所选区间的并集为 $[1, R]$，找到所有与 $[1, R]$ 相交的区间中的最大右端点 $r$，更新并集为 $[1, r]$。

!!! 问题 4

    给定 $N$ 个区间 $[l_i, r_i]$，请选出尽可能少的点，使得每个区间都包含至少一个选出的点。$1 \le N \le 10^5, 1 \le l_i, r_i \le 10^9$。

贪心策略：按右端点排序，选出的点尽可能放在右端点处；如果当前区间包含上一个选的点，不管，否则直接选当前区间右端点（当前区间上一个选的点对应的区间不相交）

有意思的点：本题答案等价于问题 1 的答案。