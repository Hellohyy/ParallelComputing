#pragma once


#define WIN32_LEAN_AND_MEAN
#include "stdafx.h"
#include <winsock2.h>
#include <ws2tcpip.h>
#include <stdlib.h>
#include <stdio.h>
#include "time.h"
#include <iostream>
#include <fstream>
using namespace std;

#pragma comment(lib, "Ws2_32.lib")

#define DEFAULT_BUFLEN 128

class CBlockingSocket
{
public:
	WSADATA wsaData;
	SOCKET ConnectSocket = INVALID_SOCKET;
	struct addrinfo *result = NULL,
		*ptr = NULL,
		hints;
	char *sendbuf;
	char recvbuf[DEFAULT_BUFLEN];
	int iResult;
	int recvbuflen = DEFAULT_BUFLEN;
	string out_filename;
	int display = 0;
	int save = 0;
	string hostip;

public:
	CBlockingSocket();
	~CBlockingSocket();
	bool init(const char *ip,const char *p);
	bool solveIPandP(const char *ip,const char *p);
	bool Connection();
	bool Send(SOCKET ConnectSocket, char *sendbuf, int iResult, int num);
	bool Read();
	bool Recv();
	bool close();
	bool closeConnection();
};
