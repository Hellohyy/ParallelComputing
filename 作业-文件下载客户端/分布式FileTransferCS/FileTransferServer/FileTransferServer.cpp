#pragma warning(disable:4996)

#include "FileTransferServer.h"
#include <iostream>
#include <fstream>
#include "COMMON.h"
#include "Message.h"
#include "SlidingWindow.h"
using  namespace  std;


CNoBlockingSocket::CNoBlockingSocket()
{
	//CBlockingSocket cblocksocket(p);
}

CNoBlockingSocket::~CNoBlockingSocket()
{

}

bool CNoBlockingSocket::init(const char *p)
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
	iResult = listen(ListenSocket, 10);
	if (iResult == SOCKET_ERROR) {
		cout << "listen failed with error:" << WSAGetLastError() << endl;
		closesocket(ListenSocket);
		WSACleanup();
		return 1;
	}
	cout << "FileTransferServer is listening on port:" << p << endl;

	//��ȡ�������������ļ��б�
	if (!getFileList(files,filesLocaltion))
	{
		cout << "FileList shows with error!" << endl;
	}

	return 1;
}

bool CNoBlockingSocket::solveIPandP(const char *p)
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

bool CNoBlockingSocket::createListeningSocket()
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

bool CNoBlockingSocket::bindport()
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

bool CNoBlockingSocket::SetupConnectionPool()
{
	numActiveSockets = 1;
	for (INT i = 1; i < MAX_SOCKETS; i++)
	{
		SocketParam socketparam = SocketParam();
		socketparam.socketValid = false;  //��ʼ��Socket��δ����״̬
		socketHandles[i] = socketparam;
	}

	if (ioctlsocket(ListenSocket, FIONBIO, &argp) == SOCKET_ERROR)
	{
		printf("ioctlsocket() failed with error %d\n", WSAGetLastError());
		return 1;
	}
	SocketParam socketparam = SocketParam();
	socketparam.socketHandles = ListenSocket;
	socketparam.socketValid =true;
	socketHandles[0] = socketparam;// 0Ϊ����Socket

	fd_set fdReadSet;
	fd_set fdWriteSet;
	int ser_no = 0;
	while (1)
	{
		//��װ the fd_set
		FD_ZERO(&fdReadSet);
		FD_ZERO(&fdWriteSet);

		FD_SET(socketHandles[0].socketHandles, &fdReadSet);
		for (int i = 1; i < MAX_SOCKETS; i++)
		{
			if (socketHandles[i].socketValid == true)
			{
				FD_SET(socketHandles[i].socketHandles, &fdReadSet);
			}
		}

		int ret;
		if ((ret = select(numActiveSockets, &fdReadSet, &fdWriteSet, NULL, NULL)) == SOCKET_ERROR)
		{
			printf("\nselect() failed. Error code: %i\n", WSAGetLastError());
			return 0;
		}

		for (int i = 0; i < MAX_SOCKETS; i++) {
			if (!socketHandles[i].socketValid) continue; // Only check for valid sockets.
			if (FD_ISSET(socketHandles[i].socketHandles, &fdReadSet)) { // Is socket i active?
				if (i == 0) { // [0] is the server listening socket
					int Size = sizeof(ClientAddr);
					SOCKET newClientSocket = accept(socketHandles[i].socketHandles, (struct sockaddr *) &ClientAddr, &Size); // accept new connection //
														  // Find a free entry in the socketHandles[] //
					cout << "\nSocketֵ:"<<newClientSocket << endl;
					ioctlsocket(newClientSocket, FIONBIO, &argp);
					int j = 1;
					for (; j < MAX_SOCKETS; j++) {
						if (socketHandles[j].socketValid == false) {
							socketHandles[j].socketValid = true;
							socketHandles[j].socketHandles = newClientSocket;
							socketHandles[j].socketSendFileNum = 0;
							socketHandles[j].start_file_flag = false;
							socketHandles[j].Sequence = 0;
							++numActiveSockets;
							socketHandles[j].socketAddr = ClientAddr;
							cout << "[" << j << "]"<<"Connection from " << inet_ntoa(ClientAddr.sin_addr) << " is established" << endl;
							if (numActiveSockets == MAX_SOCKETS) {
								// Ignore new accept()
								socketHandles[0].socketValid = false;
							}
							break;
						}
					}
				}
				else { // sockets for recv()
					   // Receive data and display to stdout. //
					char buf[256]; int len = 255;
					
					int numread = recv(socketHandles[i].socketHandles, buf, len, 0);
					if (numread == SOCKET_ERROR) {
						printf("\nrecv() failed. Error code: %i\n",
							WSAGetLastError());
						return 0;
					}
					else if (numread == 0) { // connection closed
											 // Update the socket array
						cout << "["<<i<<"]"<<"�Ͽ�����" << endl;
						socketHandles[i].socketValid = false;
						--numActiveSockets;
						if (numActiveSockets == (MAX_SOCKETS - 1))
							socketHandles[0].socketValid = true;
						closesocket(socketHandles[i].socketHandles);
					}
					else if(numread > 0){
						if (strcmp(buf, "1") == 0)
						{
							ser_no = atoi("1");
							break;
						}
						if (strcmp(buf, "2") == 0)
						{
							ser_no = atoi("2");
							break;
						}
						if (strcmp(buf, "3") == 0) 
						{
							ser_no = atoi("3");
							break;
						}
						if (strcmp(buf, "FileList_Request") == 0)//�յ������ļ��б�
						{
							if (socketHandles[i].socketSendFileNum <= files.size()-1)
							{
								char *p = const_cast<char*>(files[socketHandles[i].socketSendFileNum].c_str());
								Send(socketHandles[i].socketHandles, p, int(strlen(p) + sizeof(char)), 0);
								socketHandles[i].socketSendFileNum += 1;
							}
							else
							{
								printf("FileList send finished!");
								Send(socketHandles[i].socketHandles, "FileList send finished!", int(strlen("FileList send finished!") + sizeof(char)), 0);
							}
							Sleep(50);
						}
						else //�յ������ļ����� 
						{
							char ack[20];
							clock_t start, ends;

							int recvlen;
							int transfer_again = 1;
							if (!socketHandles[i].start_file_flag)//��ʾ��һ�η���
							{
								socketHandles[i].start_file_flag = true;
								hostip = inet_ntoa(ClientAddr.sin_addr);
								cout << "File Transfer requested from " << hostip << " received: " << socketHandles[i].fileName << endl;

								//����������ļ���
								
								char fileName[128] = { 0 };
								memset(fileName, 0, sizeof(fileName));
								memcpy(fileName, buf, sizeof(buf));
								
								string currentfilesLocaltion;
								string dir = "�ļ���\\";
								for (int i = 0; i < files.size(); i++)
								{
									
									string currentfilesLocaltion = dir + filesLocaltion[i];
									if (!strcmp(files[i].c_str(), fileName))
									{
										strcpy(fileName, currentfilesLocaltion.c_str());
										break;
									}
								}
								memcpy(socketHandles[i].fileName, fileName, sizeof(fileName));
								ifstream fs;
								fs.open(socketHandles[i].fileName, ios::in | ios::binary);
								
								if (!fs)
								{
									Send(socketHandles[i].socketHandles,"File doesn't exist or removerd!", int(strlen("File doesn't exist or removerd!")+sizeof(char)),0);  //���δ�ҵ��ļ���ͻ��˷�Ӧ��
									cout << socketHandles[i].fileName << " doesn't exist!" << endl;
									
								}
								else //��������ļ�
								{
									int count = 0;
									string s;
									string file(socketHandles[i].fileName);
									string extension(".txt");

									//�������txt�ļ�
									if (file.compare(file.size() - extension.size(), extension.size(), extension) == 0)
									{
										cout << "***************************************************************************" << endl;
										cout << " Reading File:" << socketHandles[i].fileName << endl;
										socketHandles[i].fileType = 1; //��ʾ��.txt�ļ�
										
										if (getline(fs, s))
										{
											socketHandles[i].pos = fs.tellg();
											
											//ѡ������ʽ ,��ÿһ�н��в�����
											if (strcmp(s.c_str(), "\r") == 0)
											{
												s = " \r";
											}
											string str = s;
											if (Common::IsUTF8File(socketHandles[i].fileName))
											{
												str = Common::UTF8ToGB(s.c_str()).c_str();
											}
											char *p = const_cast<char*>(str.c_str());

											socketHandles[i].Sequence += 1;
											Message* message = new Message();
											message->setSequence(socketHandles[i].Sequence);
											message->setAcknowledge(1);
											message->setSendSum(1);
											message->setDataLength(strlen(p));
											memcpy(message->Data, p, strlen(p));
											
											do {
												if (transfer_again)
												{	
													start = clock();  //���Ϳ�ʼʱ��
													sendto(socketHandles[i].socketHandles, (char *)message, int(sizeof(unsigned int)*4+strlen(p)),0,0,0);
													transfer_again = 0;
												}
												if (recvlen = recvfrom(socketHandles[i].socketHandles, ack, 20, 0, 0, 0))
												{
													Message* message_recv = (Message*)ack;
													if (message_recv->getAcknowledge() == 2)
													{
														break;
													}
													if (message_recv->getAcknowledge() == 1) //�յ�Client������δȷ�ϵİ���ACK =1
													{
														transfer_again = 1;
														message->setSendSum(message->getSendSum() + 1);
														continue;
													}
												}
												ends = clock();
												if ((ends - start) > 3000) //����3000msû�յ����ش�
												{
													transfer_again = 1;
													message->setSendSum(message->getSendSum()+1);
												}
											} while (1);

										}	
										
									}//�������txt�ļ� * End

									//����������������ļ�
									else
									{
										char data[10240] = { 0 };
										socketHandles[i].fileType = 2; //��ʾ����.txt�ļ�
										if (!fs.eof())
										{
											fs.read(data, 10240);
											socketHandles[i].pos = fs.tellg();

											socketHandles[i].Sequence += 1;
											Message* message = new Message();
											message->setSequence(socketHandles[i].Sequence);
											message->setAcknowledge(1);
											message->setSendSum(1);
											message->setDataLength(sizeof(data));
											memcpy(message->Data, data, sizeof(data));
											
											do {
												if (transfer_again)
												{
													start = clock();  //���Ϳ�ʼʱ��
													sendto(socketHandles[i].socketHandles, (char *)message, int(sizeof(unsigned int) * 4 + sizeof(data)), 0, 0, 0);
													transfer_again = 0;
												}
												if (recvlen = recvfrom(socketHandles[i].socketHandles, ack, 10, 0, 0, 0))
												{
													Message* message_recv = (Message*)ack;
													if (message_recv->getAcknowledge() == 2)
													{
														break;
													}
													if (message_recv->getAcknowledge() == 1) //�յ�Client������δȷ�ϵİ���ACK =1
													{
														transfer_again = 1;
														message->setSendSum(message->getSendSum() + 1);
														continue;
													}
												}
												ends = clock();
												if ((ends - start) > 3000) //����3000msû�յ����ش�
												{
													transfer_again = 1;
													message->setSendSum(message->getSendSum() + 1);
												}
											} while (1);
										}
									}//����������������ļ� * End
								}
							}
							else //ʣ���ļ�����
							{
								ifstream fs;
								fs.open(socketHandles[i].fileName, ios::in | ios::binary);
								fs.seekg(socketHandles[i].pos, ios::beg);
								if (socketHandles[i].fileType == 1) // .txt�ļ���ȡ
								{	
									string s;
									if (getline(fs, s)) //�ļ�δ��ȡ��
									{
										socketHandles[i].pos = fs.tellg();
										//ѡ������ʽ ,��ÿһ�н��в�����
										if (strcmp(s.c_str(), "\r") == 0)
										{
											s = " \r";
										}
										string str = s;
										if (Common::IsUTF8File(socketHandles[i].fileName))
										{
											str = Common::UTF8ToGB(s.c_str()).c_str();
										}
										char *p = const_cast<char*>(str.c_str());

										socketHandles[i].Sequence += 1;
										Message* message = new Message();
										message->setSequence(socketHandles[i].Sequence);
										message->setAcknowledge(1);
										message->setSendSum(1);
										message->setDataLength(strlen(p));

										memcpy(message->Data, p, strlen(p));
										
										do {
											if (transfer_again)
											{
												start = clock();  //���Ϳ�ʼʱ��
												sendto(socketHandles[i].socketHandles, (char *)message, int(sizeof(unsigned int) * 4 + strlen(p)), 0, 0, 0);
												transfer_again = 0;
											}
											if (recvlen = recvfrom(socketHandles[i].socketHandles, ack, 10, 0, 0, 0))
											{
												Message* message_recv = (Message*)ack;
												if (message_recv->getAcknowledge() == 2)
												{
													break;
												}
												if (message_recv->getAcknowledge() == 1) //�յ�Client������δȷ�ϵİ���ACK =1
												{
													transfer_again = 1;
													message->setSendSum(message->getSendSum() + 1);
													continue;
												}
											}
											ends = clock();
											if ((ends - start) > 3000) //����3000msû�յ����ش�
											{
												transfer_again = 1;
												message->setSendSum(message->getSendSum() + 1);
											}
										} while (1);
										
									}
									else//�ļ���ȡ���
									{
										shutdown(socketHandles[i].socketHandles, SD_SEND);
									}
								} //.txt�ļ���ȡ * End
								else //���������ļ���ȡ 
								{
									char data[10240] = { 0 };
									if (-1 == fs.tellg())
									{
										fs.read(data, 10240);
										socketHandles[i].pos = fs.tellg();
										
										socketHandles[i].Sequence += 1;
										Message* message = new Message();
										message->setSequence(socketHandles[i].Sequence);
										message->setAcknowledge(1);
										message->setSendSum(1);
										message->setDataLength(sizeof(data));
										memcpy(message->Data, data, 10240);
										
										do {
											if (transfer_again)
											{
												start = clock();  //���Ϳ�ʼʱ��
												sendto(socketHandles[i].socketHandles, (char *)message, int(sizeof(unsigned int) * 4 + sizeof(data)), 0, 0, 0);
												transfer_again = 0;
											}
											if (recvlen = recvfrom(socketHandles[i].socketHandles, ack, 10, 0, 0, 0))
											{
												Message* message_recv = (Message*)ack;
												if (message_recv->getAcknowledge() == 2)
												{
													break;
												}
												if (message_recv->getAcknowledge() == 1) //�յ�Client������δȷ�ϵİ���ACK =1
												{
													transfer_again = 1;
													message->setSendSum(message->getSendSum() + 1);
													continue;
												}
											}
											ends = clock();
											if ((ends - start) > 3000) //����3000msû�յ����ش�
											{
												transfer_again = 1;
												message->setSendSum(message->getSendSum() + 1);
											}
										} while (1);
									}
									else//�ļ���ȡ���
									{
										shutdown(socketHandles[i].socketHandles, SD_SEND);
									}
								}//���������ļ���ȡ * End
							}
							//Recv(i, buf);
							
						}//�յ������ļ����� 
						
					}
				}
				if (--ret == 0) break; // All active sockets processed.
			}
		}
	}
	return 1;
}


bool CNoBlockingSocket::getFileList(vector<string>& files, vector<string>& filesLocaltion)
{
	if (!_getcwd(buffer, MAX_PATH))
	{
		return 0;
	}
	//char * filePath = buffer;
	string filePath;
	filePath.assign(buffer).append("\\�ļ���\\");//
	//cout << "filePath: " <<filePath << endl;
	////��ȡ��·���µ������ļ�  
	getRelativeFiles(filePath,"", files, filesLocaltion);
	size = files.size();
	cout <<"Number of files��"<< size << endl;
	return 1;
}

void CNoBlockingSocket::getFiles(string path, vector<string>& files)
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

void CNoBlockingSocket::getRelativeFiles(string path, string path2, vector<string>& files, vector<string>& filesLocaltion)
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
					getRelativeFiles(p.assign(path).append("\\"), p2.assign(fileinfo.name).append("\\"), files, filesLocaltion);
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

bool CNoBlockingSocket::Send(SOCKET ClientSocket, char *sendbuf, int iResult, int num)
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


bool CNoBlockingSocket::SendFilList(int no)
{
	//��ȡ�ļ��б�
	if (!getFileList(files,filesLocaltion))
	{
		cout << "FileList shows with error!" << endl;
	}

	//�����ļ��б���ͻ���
	char file_size[10];
	itoa(size, file_size, 10);
	Send(socketHandles[no].socketHandles , file_size, int(sizeof(file_size) + sizeof(char)), 0);//�����ļ�����
	cout << "Send Filelists to the Client!" << endl;
	for (int i = 0; i < size; i++)
	{
		char *p = const_cast<char*>(files[i].c_str());
		Send(socketHandles[no].socketHandles, p, int(files[i].length() + sizeof(char)), 0);
		Sleep(50);
	}
	printf("�ļ��б�����ϣ�\n");
	return 1;
}

bool Getfilename(char* recvbuf)
{
	return 1;
}


bool CNoBlockingSocket::close()
{
	closesocket(ClientSocket);
	WSACleanup();
	return 1;
}



