# 蒙特卡洛方法计算圆周率的示例程序。
# 其特点是可以并行计算。

import random
import datetime
import time
random.seed(datetime.datetime.now())
r = 100.0
count_in = 0
count_all = 1000000

start = time.time()
for i in range(0, count_all):
    x = random.uniform(-100, 100)
    y = random.uniform(-100, 100)
    if x*x+y*y < r*r:
        count_in += 1

pi = count_in / count_all * 4
print("圆周率", pi)
print("计算花费时间", time.time()-start)
