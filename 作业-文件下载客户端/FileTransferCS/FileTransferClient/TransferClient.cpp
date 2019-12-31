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
	freeaddrinfo(result);
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
	WSACleanup();
	return 1;
}
