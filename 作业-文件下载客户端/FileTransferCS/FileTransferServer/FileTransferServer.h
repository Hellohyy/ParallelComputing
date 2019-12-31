#pragma once
#undef UNICODE

#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <stdlib.h>
#include <stdio.h>
#include "time.h"
#include<vector>
#include<io.h>
#include "direct.h"
#include <string>
#include "COMMON.h"
using namespace std;

#pragma comment(lib, "Ws2_32.lib")

#define MAX_PATH 150
#define DEFAULT_BUFLEN 512

class CBlockingSocket {
public:
	WSADATA wsaData;
	int iResult;
	SOCKET ListenSocket;
	SOCKET ClientSocket;
	struct addrinfo *result;
	struct addrinfo hints;
	int iSendResult;
	char sendbuf[DEFAULT_BUFLEN];
	int sendbuflen = DEFAULT_BUFLEN;
	char recvbuf[DEFAULT_BUFLEN];
	int recvbuflen = DEFAULT_BUFLEN;
	vector<string> files;
	vector<string> filesLocaltion;
	int size;//当前文件夹下文件数
	char   buffer[MAX_PATH];
	struct sockaddr_in ClientAddr;
	string hostip;
	SOCKET ClientSocketList[1024];
	int ClientSocket_no;
	char tag[8];
public:
	CBlockingSocket();
	~CBlockingSocket();
	bool init(const char *p);
	bool solveIPandP(const char *p);
	bool createListeningSocket();
	bool bindport();
	bool Send(SOCKET clientsocket, char *sendbuf, int iResult, int num);
	bool SendFilList(int no);
	bool Recv(int no);
	bool Accept(int i);
	bool close();
	bool connection();

	bool getFileList();
	void getFiles(string path, vector<string>& files);
	void getRelativeFiles(string path, string path2, vector<string>&files);
	static DWORD WINAPI ClientThreadProc(LPVOID lpParameter);

};
