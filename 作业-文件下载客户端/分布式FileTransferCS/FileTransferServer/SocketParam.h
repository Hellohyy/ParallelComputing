#pragma once

#define MAX_SOCKETS 10
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

class SocketParam 
{
public:
	SOCKET socketHandles;
	bool socketValid;
	struct sockaddr_in socketAddr;
	int socketSendFileNum;
	bool start_file_flag;
	int pos; //�Ѿ���ȡ���ļ�ָ��λ��
	char fileName[128]; //�����ļ���
	int fileType; //�ļ�����
	int Sequence;
};