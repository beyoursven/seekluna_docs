# 前缀和

## 一维前缀和

假设我们有一个从 $1$ 下标开始的长度为 $N$ 的数组 $A$，然后有 $Q$ 次询问，每次询问给出一对满足 $1 \le l \le r \le n$ 的整数 $(l, r)$，请你求出 $A_l + A_{l + 1} + \dots + A_r$ 的和。通俗来说，就是请你求出 $Q$ 次区间和。

从暴力的角度来说，对于每次询问我们可以遍历从 $A_l$ 到 $A_r$ 的元素并求和。由于我们有 $Q$ 次询问，每次询问最坏情况下需要花费 $O(N)$ 的时间计算子段和，因此总时间复杂度为 $O(QN)$。对于这类题目，数据范围限制通常为 $N, Q \le 10^5$，因此暴力做法会超时，通常只能获取部分分。

此时我们可以使用前缀和进行优化。

### 前缀和的定义

定义 $pre_i$（$1 \le i \le N$）表示数组中前 $i$ 个元素之和，即：

$$
pre_i = \sum \limits_{k = 1}^i A_i
$$

### 前缀和的预处理

对于每个 $pre_i$（$1 \le i \le N$），如果我们通过遍历前 $i$ 个元素来求出，时间复杂度高达 $O(N^2)$。可以简单地发现，$pre_i$ 可以通过以下递推式计算得出：

$$
pre_i = pre_{i - 1} + A_i
$$

由于数组是从 $1$ 下标开始的，因此 $pre_{0} = 0$。

举个例子，对于数组 $A = [1, 6, 4, 2, 5, 3]$，前缀和如下表所示：

| 下标 $i$ |  $0$  |  $1$  |  $2$  |  $3$  |  $4$  |  $5$  |  $6$  |
| :------: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
|  $A_i$   |  $0$  |  $1$  |  $6$  |  $4$  |  $2$  |  $5$  |  $3$  |
| $pre_i$  |  $0$  |  $1$  |  $7$  | $11$  | $13$  | $18$  | $21$  |

### 使用前缀和优化区间查询

此时，如果我们要求出 $A_l + A_{l + 1} + \dots + A_r$，我们可以通过以下式子计算出：

$$
\begin{align}
A_l + A_{l + 1} + \dots + A_r & = (A_1 + A_2 + \dots + A_r) - (A_1 + A_2 + \dots + A_{l - 1}) \notag \\ 
& = \sum \limits_{i = 1}^r A_i - \sum \limits_{i = 1}^{l - 1} A_i \notag \\
& = pre_r - pre_{l - 1} \notag
\end{align}
$$

我们通过 $O(N)$ 预处理前缀和数组 $pre_i$，可以在每次询问时 $O(1)$ 计算区间和 $pre_r - pre_{l - 1}$。总共有 $N$ 次询问，因此总时间复杂度为 $O(N + Q)$。

### 题目

逐月 P1468 P1469 P1470 P1416

## 二维前缀和

我们把前缀和问题从一维序列扩展到二维矩阵。

给定一个 $N$ 行 $M$ 列的二维数字矩阵 $A$，行列下标都是从 $1$ 开始，有 $Q$ 次询问，每次询问求出一个给定的子矩阵和。

同样地，如果我们暴力求解，每次询问最坏情况下需要花费 $O(NM)$ 的时间计算子矩阵和，因此总时间复杂度为 $O(QNM)$。速度太慢了。

### 例子

对于以下的数字矩阵，我们想求出红色数字所代表的的子矩阵的和：

$$
\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 5 & 6 & 11 & 8 \\
0 & 1 & \color{Red}{7} & \textcolor{red}{11} & \textcolor{red}{9} & 4 \\
0 & 4 & \textcolor{Red}{6} & \textcolor{red}{1} & \textcolor{red}{3} & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix}
$$

借用一维前缀和，我们可以对于每一行都做一次一维前缀和，然后我们将子矩阵和分解为每一行的区间和进行求和。

对于每一行求一维前缀和，可以得到如下矩阵：

$$
\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 6 & 12 & 23 & 31 \\
0 & \textcolor{red}{1} & 8 & 19 & \textcolor{green}{28} & 32 \\
0 & \textcolor{red}{4} & 10 & 11 & \textcolor{green}{14} & 16 \\
0 & 7 & 12 & 16 & 18 & 21
\end{bmatrix}
$$

所要求的的子矩阵和为 $(28 - 1) + (14 - 4) = 37$。

预处理每一行的前缀和，时间为 $O(NM)$。对于单词询问，需要花 $O(N)$ 的时间求出每行区间和的和。回答询问所需的总时间 $O(QN)$。我们将暴力回答询问的时间复杂度 $O(QNM)$ 降低了，实际上还能做的更好。

### 二维前缀和定义

我们首先定义 $pre_{i, j}$ 表示矩阵中前 $i$ 行前 $j$ 列的元素之和，即：

$$
pre_{i, j} = \sum \limits_{x = 1}^i \sum \limits_{y = 1}^j A_{x, y}
$$

通俗来讲，$pre_{i,j}$ 是原矩阵中一个左上角子矩阵的元素和。例如下图中，右边的矩阵为左边区间的二维前缀和矩阵，绿色数字为红色数字对应的子矩阵和：

$$
\begin{bmatrix}
\textcolor{red}0 & \textcolor{red}0 & \textcolor{red}0 & \textcolor{red}0 & 0 & 0 \\
\textcolor{red}0 & \textcolor{red}1 & \textcolor{red}5 & \textcolor{red}6 & 11 & 8 \\
\textcolor{red}0 & \textcolor{red}1 & \textcolor{red}7 & \textcolor{red}{11} & 9 & 4 \\
0 & 4 & 6 & 1 & 3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix} \qquad
\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 6 & 12 & 23 & 31 \\
0 & 2 & 14 & \textcolor{green}{31} & 51 & 63 \\
0 & 6 & 24 & 42 & 65 & 79 \\
0 & 13 & 36 & 58 & 83 & 100
\end{bmatrix}
$$

### 二维前缀和计算方法 1：容斥原理

这个二维前缀和的矩阵我们可以通过容斥原理的方式计算出来，对于 $1 \le i \le n$ 的行下标 $i$ 和 $1 \le j \le m$ 的列下标 $j$，我们可以通过以下式子计算出：

$$
pre_{i, j} = pre_{i - 1, j} + pre_{i, j - 1} - pre_{i - 1, j - 1} + A_{i, j}
$$

我们需要借助图形的方式理解这个式子，下述 $4$ 个矩阵分别对应着 $i = 3, j = 4$ 时的 $pre_{i, j}, \ pre_{i - 1, j}, \ pre_{i, j - 1}, \ pre_{i - 1, j - 1}$。

$$
\begin{bmatrix}
\textcolor{red}0 & \textcolor{red}0 & \textcolor{red}0 & \textcolor{red}0 & 0 & 0 \\
\textcolor{red}0 & \textcolor{red}1 & \textcolor{red}5 & \textcolor{red}6 & 11 & 8 \\
\textcolor{red}0 & \textcolor{red}1 & \textcolor{red}7 & \textcolor{red}{11} & 9 & 4 \\
0 & 4 & 6 & 1 & 3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix}
\begin{bmatrix}
\textcolor{orange}0 & \textcolor{orange}0 & \textcolor{orange}0 & 0 & 0 & 0 \\
\textcolor{orange}0 & \textcolor{orange}1 & \textcolor{orange}5 & 6 & 11 & 8 \\
\textcolor{orange}0 & \textcolor{orange}1 & \textcolor{orange}7 & 11 & 9 & 4 \\
0 & 4 & 6 & 1 & 3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix}
$$

$$
\begin{bmatrix}
\textcolor{blue}0 & \textcolor{blue}0 & \textcolor{blue}0 & 0 & 0 & 0 \\
\textcolor{blue}0 & \textcolor{blue}1 & \textcolor{blue}5 & 6 & 11 & 8 \\
0 & 1 & 7 & 11 & 9 & 4 \\
0 & 4 & 6 & 1 & 3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix}
\begin{bmatrix}
\textcolor{purple}0 & \textcolor{purple}0 & \textcolor{purple}0 & \textcolor{purple}0 & 0 & 0 \\
\textcolor{purple}0 & \textcolor{purple}1 & \textcolor{purple}5 & \textcolor{purple}6 & 11 & 8 \\
0 & 1 & 7 & 11 & 9 & 4 \\
0 & 4 & 6 & 1 & 3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix}
$$

可以发现，红色部分之和等于“橘色+紫色-蓝色”，还需要加上 $A_{3, 4} = 11$。

### 二维前缀和计算方法 2：逐维计算

借助例子的方法，我们可以先求出每一行的前缀和得到矩阵 $B$，然后对 $B$ 求出每一列的前缀和得到矩阵 $C$，可以发现 $C$ 就是二维前缀和矩阵。

$$ A =
\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 5 & 6 & 11 & 8 \\
0 & 1 & 7 & 11 & 9 & 4 \\
0 & 4 & 6 & 1 & 3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix} 

\xrightarrow{\text{对每一行求出前缀和}}

B = 
\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 6 & 12 & 23 & 31 \\
0 & 1 & 8 & 19 & 28 & 32 \\
0 & 4 & 10 & 11 & 14 & 16 \\
0 & 7 & 12 & 16 & 18 & 21
\end{bmatrix}

\xrightarrow{\text{对每一列求出前缀和}}

C = 
\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 6 & 12 & 23 & 31 \\
0 & 2 & 14 & 31 & 51 & 63 \\
0 & 6 & 24 & 42 & 65 & 79 \\
0 & 13 & 36 & 58 & 83 & 100
\end{bmatrix}
$$