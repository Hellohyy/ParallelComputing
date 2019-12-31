#pragma warning(disable:4996)

#include "FileTransferServer.h"
#include <iostream>
#include <fstream>
#include "COMMON.h"
using  namespace  std;


CBlockingSocket::CBlockingSocket()
{
	//CBlockingSocket cblocksocket(p);
}

CBlockingSocket::~CBlockingSocket() 
{

}

bool CBlockingSocket::init(const char *p)
{
	// ��ʼ�� Winsock
	iResult = WSAStartup(MAKEWORD(2, 2), &wsaData);
	if (iResult != 0) {
		cout << "WSAStartup failed with error:" << iResult << endl;
		return 1;
	}

	ZeroMemory(&hints, sizeof(hints));
	hints.ai_family = AF_INET;
	hints.ai_socktype = SOCK_STREAM;
	hints.ai_protocol = IPPROTO_TCP;
	hints.ai_flags = AI_PASSIVE;
	
	solveIPandP(p);
	createListeningSocket();
	bindport();

	//freeaddrinfo(result);

	//��������  SOMAXCONN�������
	iResult = listen(ListenSocket, 5);
	if (iResult == SOCKET_ERROR) {
		cout << "listen failed with error:" << WSAGetLastError() << endl;
		closesocket(ListenSocket);
		WSACleanup();
		return 1;
	}
	cout << "FileTransferServer is listening on port:" << p << endl;
	return 1;
}

bool CBlockingSocket::solveIPandP(const char *p) 
{
	const char *port = p;
	iResult = getaddrinfo(NULL, port, &hints, &result);
	if (iResult != 0) {
		cout << "getaddrinfo failed with error:" << iResult << endl;
		WSACleanup();
		return 1;
	}
	return 1;
}

bool CBlockingSocket::createListeningSocket() 
{
	ListenSocket = socket(result->ai_family, result->ai_socktype, result->ai_protocol);
	if (ListenSocket == INVALID_SOCKET) {
		cout << "socket failed with error:" << WSAGetLastError() << endl;
		freeaddrinfo(result);
		WSACleanup();
		return 1;
	}
	return 1;
}

bool CBlockingSocket::bindport() 
{
	iResult = bind(ListenSocket, result->ai_addr, (int)result->ai_addrlen);
	if (iResult == SOCKET_ERROR) {
		cout << "bind failed with error:" << WSAGetLastError() << endl;
		freeaddrinfo(result);
		closesocket(ListenSocket);
		WSACleanup();
		return 1;
	}
	return 1;
}

bool CBlockingSocket::Accept(int i) 
{
	// ���տͻ��˷�����Socket����
	int Size = sizeof(ClientAddr);
	SOCKET ClientSocket1 = accept(ListenSocket, (struct sockaddr *) &ClientAddr, &Size);
	ClientSocketList[i] = ClientSocket1;
	ClientSocket_no = i;
	cout << "client: "<<i << endl;

	if (ClientSocket == INVALID_SOCKET) {
		cout << "accept failed with error:" << WSAGetLastError() << endl;
		closesocket(ListenSocket);
		WSACleanup();
		return 1;
	}
	
	itoa(i, tag, 10);
	//Send(ClientSocketList[i], inet_ntoa(ClientAddr.sin_addr), strlen(inet_ntoa(ClientAddr.sin_addr)) + 1, 0);
	
	Send(ClientSocketList[i], tag, strlen(tag) + 1, 0);
	cout << "Connection from "<< inet_ntoa(ClientAddr.sin_addr)<<" is established" << endl;
	
	//���ܵ����Ӵ���һ���߳�
	HANDLE hThread = CreateThread(NULL, 0, ClientThreadProc, this, 0, NULL);
	
	/*SendFilList();


	// ����ֱ���Է��ر�����
	Recv();

	// ���֮��ر���ε�����
	iResult = shutdown(ClientSocket, SD_SEND);
	cout << "Connection is connected" << endl;
	if (iResult == SOCKET_ERROR) {
		cout << "shutdown failed with error:"<< WSAGetLastError() << endl;
		closesocket(ClientSocket);
		WSACleanup();
		return 1;
	}
	cout << "*************************************************************************************" << endl;
	*/
	return 1;
}

bool CBlockingSocket::getFileList()
{
	if (!_getcwd(buffer, MAX_PATH))
	{
		return 0;
	}
	//char * filePath = buffer;
	string filePath;
	filePath.assign(buffer).append("\\�ļ���\\");//
	cout << "filePath: " <<filePath << endl;
	////��ȡ��·���µ������ļ�  
	getRelativeFiles(filePath,"", files);
	size = files.size();
	cout <<"Number of files��"<< size << endl;
	return 1;
}

void CBlockingSocket::getFiles(string path, vector<string>& files)
{
	//�ļ����  
	long   hFile = 0;
	//�ļ���Ϣ  
	struct _finddata_t fileinfo;
	string p;
	if ((hFile = _findfirst(p.assign(path).append("\\*").c_str(), &fileinfo)) != -1)
	{
		do
		{
			//�����Ŀ¼,����֮  
			//�������,�����б�  
			if ((fileinfo.attrib &  _A_SUBDIR))
			{
				if (strcmp(fileinfo.name, ".") != 0 && strcmp(fileinfo.name, "..") != 0)
					getFiles(p.assign(path).append("\\").append(fileinfo.name), files);
			}
			else
			{
				files.push_back(p.assign(path).append("\\").append(fileinfo.name));
			}
		} while (_findnext(hFile, &fileinfo) == 0);
		_findclose(hFile);
	}
}

void CBlockingSocket::getRelativeFiles(string path, string path2, vector<string>& files)
{
	//�ļ����  
	long   hFile = 0;
	//�ļ���Ϣ  
	struct _finddata_t fileinfo;
	string p, p2;
	if ((hFile = _findfirst(p.assign(path).append(path2).append("*").c_str(), &fileinfo)) != -1)
	{
		do
		{
			//�����Ŀ¼,����֮  
			//�������,�����б�  
			if ((fileinfo.attrib &  _A_SUBDIR))
			{
				if (strcmp(fileinfo.name, ".") != 0 && strcmp(fileinfo.name, "..") != 0)
					getRelativeFiles(p.assign(path).append("\\"), p2.assign(fileinfo.name).append("\\"), files);
			}
			else
			{
				filesLocaltion.push_back(p.assign(path2).append(fileinfo.name));  //��һ�п��Ը������·��
				files.push_back(p.assign(fileinfo.name) );  //��һ�п��Ը����ļ��� 
			}
		} while (_findnext(hFile, &fileinfo) == 0);
		
		_findclose(hFile);
	}
}

bool CBlockingSocket::Send(SOCKET ClientSocket, char *sendbuf, int iResult, int num) 
{
	iSendResult = send(ClientSocket, sendbuf, iResult, 0);
	if (iSendResult == SOCKET_ERROR) {
		cout << "send failed with error:" << WSAGetLastError() << endl;
		closesocket(ClientSocket);
		WSACleanup();
		return 0;
	}
	return 1;
}


bool CBlockingSocket::SendFilList(int no)
{
	//��ȡ�ļ��б�
	if (!getFileList())
	{
		cout << "FileList shows with error!" << endl;
	}

	//�����ļ��б���ͻ���
	char file_size[10];
	itoa(size, file_size, 10);
	Send(ClientSocketList[no] , file_size, int(sizeof(file_size) + sizeof(char)), 0);//�����ļ�����
	cout << "Send Filelists to the Client!" << endl;
	for (int i = 0; i < size; i++)
	{
		//cout << files[i].c_str() << endl;


		//���յ�ȷ�������ӵ��������͵�
		/*iResult = recv(ClientSocket, recvbuf, recvbuflen, 0);
		if (iResult == 0)
		{
			iResult = shutdown(ClientSocket, SD_SEND);
		}
		if (strcmp(recvbuf, inet_ntoa(ClientAddr.sin_addr)) == 0)
		{
			Send(ClientSocket, p, int(strlen(p) + sizeof(char)), 0);
		}*/


		char *p = const_cast<char*>(files[i].c_str());
		Send(ClientSocketList[no], p, int(files[i].length() + sizeof(char)), 0);
		Sleep(50);
	}
	return 1;
}


bool CBlockingSocket::Recv(int no)
{
	vector<string> files2;
	vector<string> filesLocaltion2;
	files2 = files;
	filesLocaltion2 = filesLocaltion;
	files.clear();
	filesLocaltion.clear();
	char *tag1 = tag;
	hostip = inet_ntoa(ClientAddr.sin_addr);
	SOCKET clientsocket = ClientSocketList[no];
	char fileName[128] = { 0 };
	
	do {
		iResult = recv(clientsocket, recvbuf, recvbuflen, 0);
		memset(fileName, 0, sizeof(fileName));
		Sleep(500);
		if (iResult > 0) {
			memcpy(fileName, recvbuf, iResult);
			cout << "File Transfer requested from "<< hostip << " received: " << fileName <<endl;
			string dir = "�ļ���\\";
			for (int i = 0; i < files2.size(); i++) 
			{
				filesLocaltion2[i] = dir + filesLocaltion2[i];
				if (!strcmp(files2[i].c_str(),fileName))
				{
					strcpy(fileName, filesLocaltion2[i].c_str());
					break;
				}
			}

			ifstream fs;
			int haveSend = 0;
			const int bufferSize = 1024;
			char buffer[bufferSize] = { 0 };
			int readLen = 0;
			fs.open(fileName, ios::in | ios::binary);
			if (!fs)
			{
				//Send(ClientSocket,buffer,2,0);  //���δ�ҵ��ļ���ͻ��˷�Ӧ��
				cout << fileName << " doesn't exist!" << endl;
			}
			else
			{
				int count = 0;
				string s;
				string file(fileName);
				string extension(".txt");

				//�������txt�ļ�
				if(file.compare(file.size() - extension.size(), extension.size(), extension) == 0)
				{
					cout << "***************************************************************************" << endl;
					cout << " Reading File:" << fileName << endl;
					while (getline(fs, s, '\n'))
					{
						string str = Common::UTF8ToGB(s.c_str()).c_str();
						//��ÿһ�н��в�����
						char *p = const_cast<char*>(str.c_str());
						cout << p << endl;
						if (count == 0)
						{
							Send(clientsocket, p, int(strlen(p) + sizeof(char)), 0);
							count = 1;
						}
						else 
						{
							//���յ�ȷ�������ӵ��������͵�
							iResult = recv(clientsocket, recvbuf, recvbuflen, 0);
							if (iResult == 0)
							{
								iResult = shutdown(clientsocket, SD_SEND);
								return 1;
							}
							else if (strcmp(recvbuf, tag1) == 0)
							{
								Send(clientsocket, p, int(strlen(p) + sizeof(char)), 0);
							}

							Sleep(10);
						}
						
					}
					iResult = shutdown(clientsocket, SD_SEND);
					cout << "***************************************************************************" << endl;
					cout << endl;
					cout << "  Sent file back to the client: " << fileName << endl;
				}
				else 
				{
					/*while (!fs.eof()) {
					fs.read(buffer, bufferSize);
					getline(fs, s);
					readLen = fs.gcount();
					cout << buffer << endl;
					Send(ClientSocket, buffer, readLen, 0);
					haveSend += readLen;
					}*/
					fs.seekg(0, ios::end);
					int filelen = fs.tellg();
					fs.seekg(0, ios::beg);
					char data[10240] = { 0 };
					while (!fs.eof())
					{
						fs.read(data, 10240); 
						if (count == 0)
						{
							Send(clientsocket, data, 10240, 0);
							count = 1;
						}
						else
						{
							//���յ�ȷ�������ӵ��������͵�
							iResult = recv(clientsocket, recvbuf, recvbuflen, 0);
							if (iResult == 0)
							{	
								iResult = shutdown(clientsocket, SD_SEND);
								return 1;
							}
							else if (strcmp(recvbuf, tag1) == 0)
							{
								Send(clientsocket, data, 10240, 0);
							}
							Sleep(10);
						}	
					}
					iResult = shutdown(clientsocket, SD_SEND);	
				}
			}
			fs.close();
			Sleep(500);
			//iResult = shutdown(clientsocket, SD_SEND);

		}
		else if (iResult == 0)
		{
			cout << "Connection closing..." << endl;
		}
		else {
			cout << "recv failed with error:" << WSAGetLastError() << endl;
			closesocket(clientsocket);
			WSACleanup();
			return 0;
		}

	} while (iResult > 0);

	/*files.clear();
	filesLocaltion.clear();*/
	return 1;
}

bool CBlockingSocket::close() 
{
	closesocket(ClientSocket);
	WSACleanup();
	return 1;
}

DWORD WINAPI CBlockingSocket::ClientThreadProc(LPVOID lpParameter)
{

	CBlockingSocket* cblocksocket = (CBlockingSocket*)lpParameter;
	int no = cblocksocket->ClientSocket_no;
	
	cblocksocket->SendFilList(no);


	// ����ֱ���Է��ر�����
	cblocksocket->Recv(no);
	cout << "Connection is down" << endl;
	// ���֮��ر���ε�����
	/*cblocksocket->iResult = shutdown(cblocksocket->ClientSocketList[no], SD_SEND);
	
	if (cblocksocket->iResult == SOCKET_ERROR) {
		cout << "shutdown failed with error:" << WSAGetLastError() << endl;
		closesocket(cblocksocket->ClientSocketList[no]);
		WSACleanup();
		return 1;
	}*/
	cout << "*************************************************************************************" << endl;
	return 1;
}


