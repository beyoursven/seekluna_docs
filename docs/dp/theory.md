# DP 理论

实现 DP 的几个步骤：

1. 读题，将题意表达为数学形式，在此形式中寻找状态、转移、拓扑序、最优化属性。
2. 推不出状态时可以先尝试实现搜索。
3. 边界：初始状态是哪些？目标状态是哪些？状态初始化为什么值？转移中是否可能出现数组越界、数据溢出？
4. 优化状态设计：降维、改变最优化属性等
5. 优化转移：数据结构优化（前缀和，单调队列，单调栈，线段树等），决策单调性（斜率优化，四边形不等式）、根号算法等数学类优化。