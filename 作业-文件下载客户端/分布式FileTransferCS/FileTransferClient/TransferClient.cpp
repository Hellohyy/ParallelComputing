#include "stdafx.h"
#include "TransferClient.h"

#pragma warning(disable:4996)

CBlockingSocket::CBlockingSocket()
{
	
}

CBlockingSocket::~CBlockingSocket()
{

}

bool CBlockingSocket::init(const char *ip,const char *p)
{
	iResult = WSAStartup(MAKEWORD(2, 2), &wsaData);
	if (iResult != 0) {
		printf("WSAStartup failed with error: %d\n", iResult);
		return 0;
	}

	ZeroMemory(&hints, sizeof(hints));
	hints.ai_family = AF_UNSPEC;
	hints.ai_socktype = SOCK_STREAM;
	hints.ai_protocol = IPPROTO_TCP;

	ZeroMemory(&hints2, sizeof(hints2));
	hints2.ai_family = AF_UNSPEC;
	hints2.ai_socktype = SOCK_STREAM;
	hints2.ai_protocol = IPPROTO_TCP;

	ZeroMemory(&hints3, sizeof(hints3));
	hints3.ai_family = AF_UNSPEC;
	hints3.ai_socktype = SOCK_STREAM;
	hints3.ai_protocol = IPPROTO_TCP;

	if (!solveIPandP(ip, p)) {
		return 0;
	};
	return 1;
}

bool CBlockingSocket::solveIPandP(const char *ip,const char *p)
{
	iResult = getaddrinfo(ip, p, &hints, &result);
	if (iResult != 0) {
		WSACleanup();
		return 0;
	}
	int n = std::atoi(p);
	char p2[10];
	_itoa(n+10, p2, 10);
	iResult = getaddrinfo(ip, p2, &hints2, &result2);
	if (iResult != 0) {
		WSACleanup();
		return 0;
	}

	char p3[10];
	_itoa(n + 20, p3, 10);
	iResult = getaddrinfo(ip, p3, &hints3, &result3);
	if (iResult != 0) {
		WSACleanup();
		return 0;
	}
	return 1;
}

bool CBlockingSocket::Connection()
{
	//尝试连接直到成功建立连接
	for (ptr = result; ptr != NULL; ptr = ptr->ai_next) {

		// 为连接服务器创建的Socket
		ConnectSocket = socket(ptr->ai_family, ptr->ai_socktype,
			ptr->ai_protocol);
		if (ConnectSocket == INVALID_SOCKET) {
			WSACleanup();
			return 0;
		}

		// 连接服务器
		iResult = connect(ConnectSocket, ptr->ai_addr, (int)ptr->ai_addrlen);
		if (iResult == SOCKET_ERROR) {
			closesocket(ConnectSocket);
			ConnectSocket = INVALID_SOCKET;
			continue;
		}
		break;
	}
	for (ptr2 = result2; ptr2 != NULL; ptr2 = ptr2->ai_next) {

		// 为连接服务器创建的Socket
		ConnectSocket2 = socket(ptr2->ai_family, ptr2->ai_socktype,
			ptr2->ai_protocol);
		if (ConnectSocket2 == INVALID_SOCKET) {
			WSACleanup();
			return 0;
		}

		// 连接服务器
		iResult = connect(ConnectSocket2, ptr2->ai_addr, (int)ptr2->ai_addrlen);
		if (iResult == SOCKET_ERROR) {
			closesocket(ConnectSocket2);
			ConnectSocket2 = INVALID_SOCKET;
			continue;
		}
		break;
	}
	for (ptr3 = result3; ptr3 != NULL; ptr3 = ptr3->ai_next) {

		// 为连接服务器创建的Socket
		ConnectSocket3 = socket(ptr3->ai_family, ptr3->ai_socktype,
			ptr3->ai_protocol);
		if (ConnectSocket3 == INVALID_SOCKET) {
			WSACleanup();
			return 0;
		}

		// 连接服务器
		iResult = connect(ConnectSocket3, ptr3->ai_addr, (int)ptr3->ai_addrlen);
		if (iResult == SOCKET_ERROR) {
			closesocket(ConnectSocket3);
			ConnectSocket3 = INVALID_SOCKET;
			continue;
		}
		break;
	}
	freeaddrinfo(result);
	freeaddrinfo(result2);
	freeaddrinfo(result3);

	send(ConnectSocket, "1", int(strlen("1") + sizeof(char)), 0);//向服务器发送文件请求！
	send(ConnectSocket2, "2", int(strlen("2") + sizeof(char)), 0);//向服务器发送文件请求！
	send(ConnectSocket3, "3", int(strlen("3") + sizeof(char)), 0);//向服务器发送文件请求！
	return 1;
}


bool CBlockingSocket::Send(SOCKET ConnectSocket, char *sendbuf, int sendnum, int num)
{
	iResult = send(ConnectSocket, sendbuf, sendnum, 0);
	if (iResult == SOCKET_ERROR) {
		cout << "send failed with error:" << WSAGetLastError() << endl;
		closesocket(ConnectSocket);
		WSACleanup();
		return 0;
	}
	return 1;
}

bool CBlockingSocket::Read()
{
	return 1;
}

bool CBlockingSocket::Recv()
{
	return 1;
}

bool CBlockingSocket::close()
{
	iResult = shutdown(ConnectSocket, SD_SEND);
	if (iResult == SOCKET_ERROR) {
		printf("shutdown failed with error: %d\n", WSAGetLastError());
		closesocket(ConnectSocket);
		WSACleanup();
		return 0;
	}
	closesocket(ConnectSocket);

	iResult = shutdown(ConnectSocket2, SD_SEND);
	if (iResult == SOCKET_ERROR) {
		printf("shutdown failed with error: %d\n", WSAGetLastError());
		closesocket(ConnectSocket2);
		WSACleanup();
		return 0;
	}
	closesocket(ConnectSocket2);

	iResult = shutdown(ConnectSocket3, SD_SEND);
	if (iResult == SOCKET_ERROR) {
		printf("shutdown failed with error: %d\n", WSAGetLastError());
		closesocket(ConnectSocket3);
		WSACleanup();
		return 0;
	}
	closesocket(ConnectSocket3);
	WSACleanup();
	return 1;
}
