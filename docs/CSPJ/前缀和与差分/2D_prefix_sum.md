# 二维前缀和

我们把前缀和问题从一维序列扩展到二维矩阵。

给定一个 $N$ 行 $M$ 列的二维数字矩阵 $A$，行列下标都是从 $1$ 开始，有 $Q$ 次询问，每次询问求出一个给定的子矩阵和。

同样地，如果我们暴力求解，每次询问最坏情况下需要花费 $O(NM)$ 的时间计算子矩阵和，因此总时间复杂度为 $O(QNM)$。速度太慢了。

## 例子

对于以下的数字矩阵，我们想求出红色数字所代表的的子矩阵的和：

$$
\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 5 & 6 & 11 & 8 \\
0 & 1 & \color{Red}{7} & \color{red}{11} & \color{red}{9} & 4 \\
0 & 4 & \color{Red}{6} & \color{red}{1} & \color{red}{3} & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix}
$$

借用一维前缀和，我们可以对于每一行都做一次一维前缀和，然后我们将子矩阵和分解为每一行的区间和进行求和。

对于每一行求一维前缀和，可以得到如下矩阵：

$$
\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 6 & 12 & 23 & 31 \\
0 & \color{red}{1} & 8 & 19 & \color{green}{28} & 32 \\
0 & \color{red}{4} & 10 & 11 & \color{green}{14} & 16 \\
0 & 7 & 12 & 16 & 18 & 21
\end{bmatrix}
$$

所要求的的子矩阵和为 $(28 - 1) + (14 - 4) = 37$。

预处理每一行的前缀和，时间为 $O(NM)$。对于单词询问，需要花 $O(N)$ 的时间求出每行区间和的和。回答询问所需的总时间 $O(QN)$。我们将暴力回答询问的时间复杂度 $O(QNM)$ 降低了，实际上还能做的更好。

## 二维前缀和定义

我们首先定义 $pre_{i, j}$ 表示矩阵中前 $i$ 行前 $j$ 列的元素之和，即：

$$
pre_{i, j} = \sum \limits_{x = 1}^i \sum \limits_{y = 1}^j A_{x, y}
$$

通俗来讲，$pre_{i,j}$ 是原矩阵中一个左上角子矩阵的元素和。例如下图中，右边的矩阵为左边区间的二维前缀和矩阵，绿色数字为红色数字对应的子矩阵和：

$$
\begin{bmatrix}
\color{red}0 & \color{red}0 & \color{red}0 & \color{red}0 & 0 & 0 \\
\color{red}0 & \color{red}1 & \color{red}5 & \color{red}6 & 11 & 8 \\
\color{red}0 & \color{red}1 & \color{red}7 & \color{red}{11} & 9 & 4 \\
0 & 4 & 6 & 1 & 3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix} \qquad
\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 6 & 12 & 23 & 31 \\
0 & 2 & 14 & \color{green}{31} & 51 & 63 \\
0 & 6 & 24 & 42 & 65 & 79 \\
0 & 13 & 36 & 58 & 83 & 100
\end{bmatrix}
$$

## 二维前缀和计算方法 1：容斥原理

这个二维前缀和的矩阵我们可以通过容斥原理的方式计算出来，对于 $1 \le i \le n$ 的行下标 $i$ 和 $1 \le j \le m$ 的列下标 $j$，我们可以通过以下式子计算出：

$$
pre_{i, j} = pre_{i - 1, j} + pre_{i, j - 1} - pre_{i - 1, j - 1} + A_{i, j}
$$

我们需要借助图形的方式理解这个式子，下述 $4$ 个矩阵分别对应着 $i = 3, j = 4$ 时的 $pre_{i, j}, \ pre_{i - 1, j}, \ pre_{i, j - 1}, \ pre_{i - 1, j - 1}$。

$$
\begin{bmatrix}
\color{red}0 & \color{red}0 & \color{red}0 & \color{red}0 & 0 & 0 \\
\color{red}0 & \color{red}1 & \color{red}5 & \color{red}6 & 11 & 8 \\
\color{red}0 & \color{red}1 & \color{red}7 & \color{red}{11} & 9 & 4 \\
0 & 4 & 6 & 1 & 3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix} \quad
\begin{bmatrix}
\color{orange}0 & \color{orange}0 & \color{orange}0 & 0 & 0 & 0 \\
\color{orange}0 & \color{orange}1 & \color{orange}5 & 6 & 11 & 8 \\
\color{orange}0 & \color{orange}1 & \color{orange}7 & 11 & 9 & 4 \\
0 & 4 & 6 & 1 & 3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix}
$$

$$
\begin{bmatrix}
\color{blue}0 & \color{blue}0 & \color{blue}0 & 0 & 0 & 0 \\
\color{blue}0 & \color{blue}1 & \color{blue}5 & 6 & 11 & 8 \\
0 & 1 & 7 & 11 & 9 & 4 \\
0 & 4 & 6 & 1 & 3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix} \quad
\begin{bmatrix}
\color{purple}0 & \color{purple}0 & \color{purple}0 & \color{purple}0 & 0 & 0 \\
\color{purple}0 & \color{purple}1 & \color{purple}5 & \color{purple}6 & 11 & 8 \\
0 & 1 & 7 & 11 & 9 & 4 \\
0 & 4 & 6 & 1 & 3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix}
$$

可以发现，红色部分之和等于“橘色+紫色-蓝色”，还需要加上 $A_{3, 4} = 11$。

使用方法 1 预处理二维前缀和数组的时间复杂度为 $O(NM)$。

??? 代码

    === "代码 1"

        ```cpp
        int a[MAXN][MAXN], pre[MAXN][MAXN];
        int n, m;

        for (int i = 1; i <= n; i++) {
          for (int j = 1; j <= m; j++) {
            pre[i][j] = pre[i - 1][j] + pre[i][j - 1] - pre[i - 1][j - 1] + a[i][j];
          }
        }
        ```

    === "代码 2"

        ```cpp
        int a[MAXN][MAXN];
        int n, m;

        for (int i = 1; i <= n; i++) {
          for (int j = 1; j <= m; j++) {
            a[i][j] += a[i - 1][j] + a[i][j - 1] - a[i - 1][j - 1];
          }
        }
        ```

## 二维前缀和计算方法 2：逐维计算

借助例子的方法，我们可以先求出每一行的前缀和得到矩阵 $B$，然后对 $B$ 求出每一列的前缀和得到矩阵 $C$，可以发现 $C$ 就是二维前缀和矩阵。

>
当然，你可以先对 $A$ 求出每一列的前缀和得到矩阵 $B$，然后再对 $B$ 的每一行求出前缀和得到矩阵 $C$，$C$ 也是二维前缀和数组。 

$$ A =
\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 5 & 6 & 11 & 8 \\
0 & 1 & 7 & 11 & 9 & 4 \\
0 & 4 & 6 & 1 & 3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix} 
$$

$$
B = 
\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 6 & 12 & 23 & 31 \\
0 & 1 & 8 & 19 & 28 & 32 \\
0 & 4 & 10 & 11 & 14 & 16 \\
0 & 7 & 12 & 16 & 18 & 21
\end{bmatrix}
$$

$$
C = 
\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 6 & 12 & 23 & 31 \\
0 & 2 & 14 & 31 & 51 & 63 \\
0 & 6 & 24 & 42 & 65 & 79 \\
0 & 13 & 36 & 58 & 83 & 100
\end{bmatrix}
$$

使用方法 2 预处理二维前缀和数组的时间复杂度为 $O(NM)$。

??? 代码

    === "代码 1"

    ```cpp
    int a[MAXN][MAXN], b[MAXN][MAXN], c[MAXN][MAXN];
    int n, m;

    for (int i = 1; i <= n; i++) {
      for (int j = 1; j <= m; j++) {
        b[i][j] = b[i][j - 1] + a[i][j];
      }
    }
    for (int i = 1; i <= n; i++) {
      for (int j = 1; j <= m; j++) {
        c[i][j] = c[i - 1][j] + b[i][j];
      }
    }
    ```

    === "代码 2"

    ```cpp
    int a[MAXN][MAXN];
    int n, m;

    for (int i = 1; i <= n; i++) {
      for (int j = 1; j <= m; j++) {
        a[i][j] += a[i][j - 1];
      }
    }
    for (int i = 1; i <= n; i++) {
      for (int j = 1; j <= m; j++) {
        a[i][j] += a[i - 1][j];
      }
    }
    ```

## 使用二维前缀和优化子矩阵查询

对于一次询问给出的子矩阵的左上角坐标 $(x_1, y_1)$ 和右下角坐标 $(x_2, y_2)$，我们可以通过以下式子计算出子矩阵和：

$$
\sum \limits_{x = x_1}^{x_2} \sum \limits_{y = y_1}^{y_2} A_{x, y} = pre_{x_2, y_2} - pre_{x_1 - 1, y_2} - pre_{x_2, y_1 - 1} + pre_{x_1 - 1, y_1 - 1}
$$

我们还是通过图示来理解这个容斥的式子。当所有子矩阵和的左上角为 $(3, 3)$ 右下角为 $(4, 5)$ 时，绿色为所求子矩阵：

$$
\begin{bmatrix}
0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 5 & 6 & 11 & 8 \\
0 & 1 & \color{green}7 & \color{green}{11} & \color{green}9 & 4 \\
0 & 4 & \color{green}6 & \color{green}1 & \color{green}3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix}
$$

绿色部分等于“红色-橘色-紫色+蓝色”，如以下矩阵：

$$
\begin{bmatrix}
\color{red}0 & \color{red}0 & \color{red}0 & \color{red}0 & \color{red}0 & 0 \\
\color{red}0 & \color{red}1 & \color{red}5 & \color{red}6 & \color{red}{11} & 8 \\
\color{red}0 & \color{red}1 & \color{red}7 & \color{red}{11} & \color{red}9 & 4 \\
\color{red}0 & \color{red}4 & \color{red}6 & \color{red}1 & \color{red}3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix} \quad
\begin{bmatrix}
\color{orange}0 & \color{orange}0 & 0 & 0 & 0 & 0 \\
\color{orange}0 & \color{orange}1 & 5 & 6 & 11 & 8 \\
\color{orange}0 & \color{orange}1 & 7 & 11 & 9 & 4 \\
\color{orange}0 & \color{orange}4 & 6 & 1 & 3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix}
$$

$$
\begin{bmatrix}
\color{purple}0 & \color{purple}0 & \color{purple}0 & \color{purple}0 & \color{purple}0 & 0 \\
\color{purple}0 & \color{purple}1 & \color{purple}5 & \color{purple}6 & \color{purple}{11} & 8 \\
0 & 1 & 7 & 11 & 9 & 4 \\
0 & 4 & 6 & 1 & 3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix} \quad
\begin{bmatrix}
\color{blue}0 & \color{blue}0 & 0 & 0 & 0 & 0 \\
\color{blue}0 & \color{blue}1 & 5 & 6 & 11 & 8 \\
0 & 1 & 7 & 11 & 9 & 4 \\
0 & 4 & 6 & 1 & 3 & 2 \\
0 & 7 & 5 & 4 & 2 & 3 
\end{bmatrix}
$$

??? 代码

    ```cpp
    int query(int x1, int y1, int x2, int y2) {
      return pre[x2][y2] - pre[x1 - 1][y2] - pre[x2][y1 - 1] + pre[x1 - 1][y1 - 1];
    }
    ```

## 总结

我们通过使用方法 1 或者方法 2，在 $O(NM)$ 时间内预处理出二维前缀和数组，可以 $O(1)$ 时间内计算出子矩阵和，总共有 $Q$ 次询问。

总时间复杂度为 $O(NM + Q)$。

## 题目

逐月 P1419

洛谷 P1719 P2004 P2280