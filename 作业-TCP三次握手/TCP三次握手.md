1.首先分别完成Server端和Client端的代码，目的是建立TCP连接并且实现数据传输。
2.设置断点，通过wireshark抓取三次握手的过程。

(1)Server端启动监听:
![image](https://github.com/Hellohyy/ParallelComputing/blob/master/%E4%BD%9C%E4%B8%9A-TCP%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B/image/Server_%E7%9B%91%E5%90%AC.png)

(2)Client端初始化，准备向Server发送TCP连接请求:
![image](https://github.com/Hellohyy/ParallelComputing/blob/master/%E4%BD%9C%E4%B8%9A-TCP%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B/image/Client_%E5%90%AF%E5%8A%A8%E8%BF%9E%E6%8E%A5.png)

(3)TCP三次握手过程:
![image](https://github.com/Hellohyy/ParallelComputing/blob/master/%E4%BD%9C%E4%B8%9A-TCP%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B/image/TCP%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B%E5%BB%BA%E7%AB%8B%E8%BF%9E%E6%8E%A5.png)

(4)Client端发送数据及Server端接收到数据并发送确认帧:
![image](https://github.com/Hellohyy/ParallelComputing/blob/master/%E4%BD%9C%E4%B8%9A-TCP%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B/image/Client%E5%8F%91%E9%80%81%E6%95%B0%E6%8D%AE%E5%8F%8AServer%E5%9B%9E%E5%A4%8D.png)

(5)Server端接收到数据包:

![image](https://github.com/Hellohyy/ParallelComputing/blob/master/%E4%BD%9C%E4%B8%9A-TCP%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B/image/Server%E6%94%B6%E5%88%B0%E6%95%B0%E6%8D%AE%E5%8C%85.png)

