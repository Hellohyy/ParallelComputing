
// FileTransferClientDlg.cpp : 实现文件
//

#include "stdafx.h"
#include "FileTransferClient.h"
#include "FileTransferClientDlg.h"
#include "afxdialogex.h"
#include <fstream>
#include <string>
#include "Message.h"
#include "SlidingWindow.h"
using  namespace  std;

#ifdef _DEBUG
#define new DEBUG_NEW
#endif


// 用于应用程序“关于”菜单项的 CAboutDlg 对话框

class CAboutDlg : public CDialogEx
{
public:
	CAboutDlg();

// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_ABOUTBOX };
#endif

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV 支持

// 实现
protected:
	DECLARE_MESSAGE_MAP()
};

CAboutDlg::CAboutDlg() : CDialogEx(IDD_ABOUTBOX)
{
}

void CAboutDlg::DoDataExchange(CDataExchange* pDX)
{
	CDialogEx::DoDataExchange(pDX);
}

BEGIN_MESSAGE_MAP(CAboutDlg, CDialogEx)
END_MESSAGE_MAP()


// CFileTransferClientDlg 对话框

BEGIN_DHTML_EVENT_MAP(CFileTransferClientDlg)
	DHTML_EVENT_ONCLICK(_T("ButtonOK"), OnButtonOK)
	DHTML_EVENT_ONCLICK(_T("ButtonCancel"), OnButtonCancel)
END_DHTML_EVENT_MAP()


CFileTransferClientDlg::CFileTransferClientDlg(CWnd* pParent /*=NULL*/)
	: CDHtmlDialog(IDD_FILETRANSFERCLIENT_DIALOG, IDR_HTML_FILETRANSFERCLIENT_DIALOG, pParent)
{
	m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME);
}

void CFileTransferClientDlg::DoDataExchange(CDataExchange* pDX)
{
	CDHtmlDialog::DoDataExchange(pDX);
	DDX_Control(pDX, IDC_EDITIP, CIPADDRESS);
	DDX_Control(pDX, IDC_EDITPORT, CPORT);
	DDX_Control(pDX, IDC_EDITFILENAME, CFILENAME);
	DDX_Control(pDX, IDC_BUTTONCONNECT, CCONNECTION);
	DDX_Control(pDX, IDC_BUTTONDOWNLOAD, CDOWNLOAD);
	DDX_Control(pDX, IDC_CHECKDISPLAY, CCHECKDISPLAY);
	DDX_Control(pDX, IDC_CHECKSAVE, CCHECKSAVE);
	DDX_Control(pDX, IDC_LISTFILE , CFILELIST);
	DDX_Control(pDX, IDC_FILECONTENTLIST, CFILECONTENTLIST);
	DDX_Control(pDX, IDC_LISTCONNECT, CCONNECTLIST);
}

BEGIN_MESSAGE_MAP(CFileTransferClientDlg, CDHtmlDialog)
	ON_WM_SYSCOMMAND()
	ON_BN_CLICKED(IDC_BUTTONCONNECT, &CFileTransferClientDlg::OnBnClickedButtonconnect)
	ON_BN_CLICKED(IDC_BUTTON1, &CFileTransferClientDlg::OnBnClickedButton1)
	ON_BN_CLICKED(IDC_BUTTONABOUT, &CFileTransferClientDlg::OnBnClickedButton2)
	ON_MESSAGE(WM_RECV, OnRecv)
	ON_MESSAGE(WM_RECVFILE, OnRecvFile)
	ON_MESSAGE(WM_RECVFILENOTEXIST, OnRecvFileNotExist)
	ON_MESSAGE(WM_RECVFINISH, OnRecvFinish)
	ON_MESSAGE(WM_RECVFILELISTFINISH, OnRecvFileListFinish)
	ON_BN_CLICKED(IDC_BUTTONDOWNLOAD, &CFileTransferClientDlg::OnBnClickedButtondownload)
	ON_EN_CHANGE(IDC_EDITFILENAME, &CFileTransferClientDlg::OnEnChangeEditfilename)
	ON_BN_CLICKED(IDC_CHECKDISPLAY, &CFileTransferClientDlg::OnBnClickedCheckdisplay)
	ON_BN_CLICKED(IDC_CHECKSAVE, &CFileTransferClientDlg::OnBnClickedChecksave)
	ON_NOTIFY(NM_CLICK, IDC_LISTFILE, &CFileTransferClientDlg::OnNMClickListfile)
	ON_BN_CLICKED(IDC_BUTTONCancel, &CFileTransferClientDlg::OnBnClickedButtoncancel)
END_MESSAGE_MAP()


// CFileTransferClientDlg 消息处理程序

BOOL CFileTransferClientDlg::OnInitDialog()
{
	CDHtmlDialog::OnInitDialog();

	// 将“关于...”菜单项添加到系统菜单中。

	// IDM_ABOUTBOX 必须在系统命令范围内。
	ASSERT((IDM_ABOUTBOX & 0xFFF0) == IDM_ABOUTBOX);
	ASSERT(IDM_ABOUTBOX < 0xF000);

	CMenu* pSysMenu = GetSystemMenu(FALSE);
	if (pSysMenu != NULL)
	{
		BOOL bNameValid;
		CString strAboutMenu;
		bNameValid = strAboutMenu.LoadString(IDS_ABOUTBOX);
		ASSERT(bNameValid);
		if (!strAboutMenu.IsEmpty())
		{
			pSysMenu->AppendMenu(MF_SEPARATOR);
			pSysMenu->AppendMenu(MF_STRING, IDM_ABOUTBOX, strAboutMenu);
		}
	}

	// 设置此对话框的图标。  当应用程序主窗口不是对话框时，框架将自动
	//  执行此操作
	SetIcon(m_hIcon, TRUE);			// 设置大图标
	SetIcon(m_hIcon, FALSE);		// 设置小图标

	// TODO: 在此添加额外的初始化代码
	//设置字体
	CFont *m_Font;
	m_Font = new CFont;
	m_Font->CreateFont(50, 20, 0, 0, 100,
		FALSE, FALSE, 0, ANSI_CHARSET, OUT_DEFAULT_PRECIS,
		CLIP_DEFAULT_PRECIS, DEFAULT_QUALITY, FF_SWISS, (LPCTSTR)"Arial");
	GetDlgItem(IDC_STATIC_TITLE)->SetFont(m_Font);

	//向两个list插入顶部标题
	CCONNECTLIST.InsertColumn(0, _T("Connection status"), LVCFMT_LEFT, 400, 0);
	CFILELIST.InsertColumn(0, _T("FILE LIST"), LVCFMT_LEFT, 400, 0);
	CFILECONTENTLIST.InsertColumn(0, _T("FILE CONTENT"), LVCFMT_LEFT, 400, 0);

	//下载和输入文件名、CHECK按钮不可用
	CFILENAME.EnableWindow(FALSE);
	CDOWNLOAD.EnableWindow(FALSE);
	CCHECKDISPLAY.EnableWindow(FALSE);
	CCHECKSAVE.EnableWindow(FALSE);

	CPORT.SetWindowText(CString("2020"));
	CIPADDRESS.SetWindowText(CString("127.0.0.1"));

	return TRUE;  // 除非将焦点设置到控件，否则返回 TRUE
}

void CFileTransferClientDlg::OnSysCommand(UINT nID, LPARAM lParam)
{
	if ((nID & 0xFFF0) == IDM_ABOUTBOX)
	{
		CAboutDlg dlgAbout;
		dlgAbout.DoModal();
	}
	else
	{
		cblocksocket.close();
		CDHtmlDialog::OnSysCommand(nID, lParam);
	}
}

// 如果向对话框添加最小化按钮，则需要下面的代码
//  来绘制该图标。  对于使用文档/视图模型的 MFC 应用程序，
//  这将由框架自动完成。

void CFileTransferClientDlg::OnPaint()
{
	if (IsIconic())
	{
		CPaintDC dc(this); // 用于绘制的设备上下文

		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);

		// 使图标在工作区矩形中居中
		int cxIcon = GetSystemMetrics(SM_CXICON);
		int cyIcon = GetSystemMetrics(SM_CYICON);
		CRect rect;
		GetClientRect(&rect);
		int x = (rect.Width() - cxIcon + 1) / 2;
		int y = (rect.Height() - cyIcon + 1) / 2;

		// 绘制图标
		dc.DrawIcon(x, y, m_hIcon);
	}
	else
	{
		CDHtmlDialog::OnPaint();
	}
}

//当用户拖动最小化窗口时系统调用此函数取得光标
//显示。
HCURSOR CFileTransferClientDlg::OnQueryDragIcon()
{
	return static_cast<HCURSOR>(m_hIcon);
}

HRESULT CFileTransferClientDlg::OnButtonOK(IHTMLElement* /*pElement*/)
{
	OnOK();
	return S_OK;
}

HRESULT CFileTransferClientDlg::OnButtonCancel(IHTMLElement* /*pElement*/)
{
	OnCancel();
	return S_OK;
}

//点击连接按钮
void CFileTransferClientDlg::OnBnClickedButtonconnect()
{	
	//获取输入IP和端口号
	CString IP;
	CString PORT;

	CIPADDRESS.GetWindowText(IP);
	CPORT.GetWindowText(PORT);
	string ipstring(T2A(IP.GetBuffer()));
	string portstring(T2A(PORT.GetBuffer()));
	const char *ip = ipstring.c_str();
	const char *p = portstring.c_str();
	connect_num = CCONNECTLIST.GetItemCount();
	if (!connection)
	{
		if (CFILECONTENTLIST.GetItemCount() != 0)
		{
			CFILECONTENTLIST.DeleteAllItems();
		}
		CCONNECTLIST.DeleteAllItems();
		CCONNECTION.SetWindowText(CString("DISCONNECT"));
		CFILENAME.Clear();//清除输入框
		CIPADDRESS.EnableWindow(FALSE);
		CPORT.EnableWindow(FALSE);
		CFILENAME.EnableWindow(TRUE);
		CCHECKDISPLAY.EnableWindow(TRUE);
		CCHECKSAVE.EnableWindow(TRUE);
		//CDOWNLOAD.EnableWindow(TRUE);
		
		if (cblocksocket.init(ip, p))
		{
			if (cblocksocket.Connection())
			{
				status = 2;
				CCONNECTLIST.InsertItem(connect_num, (CString)"Connection is established!");
				CFILELIST.DeleteAllItems();
				/*recv(cblocksocket.ConnectSocket, cblocksocket.recvbuf, 100, 0);
				cblocksocket.hostip = cblocksocket.recvbuf;*/
				cblocksocket.Send(cblocksocket.ConnectSocket, "FileList_Request", int(strlen("FileList_Request") + sizeof(char)), 0);
				hThreadrecv = AfxBeginThread(Recv, (LPVOID)&cblocksocket, THREAD_PRIORITY_NORMAL, 0, 0, NULL);
			}
		}
		else
		{	
			status = 1;
			CCONNECTLIST.InsertItem(connect_num, (CString)"Can not Connect to the server!");
		}
		
		connection = TRUE;
		AfxMessageBox(_T("Successful connection!"));
	}
	else 
	{
		DownConnection();
	}
	return;
}

//退出
void CFileTransferClientDlg::OnBnClickedButton1()
{
	cblocksocket.close();
	OnCancel();
}

//关于
void CFileTransferClientDlg::OnBnClickedButton2()
{
	CAboutDlg dlg;
	dlg.DoModal();
}

//接收服务器发送过来的数据
UINT CFileTransferClientDlg::Recv(LPVOID lpParam)
{
	CBlockingSocket *cblocksocket = (CBlockingSocket*)lpParam;

	while (1)
	{
		recv(cblocksocket->ConnectSocket, cblocksocket->recvbuf, cblocksocket->recvbuflen, 0);
		if (strcmp("FileList send finished!", cblocksocket->recvbuf) == 0)
		{
			break;
		}
		AfxGetMainWnd()->SendMessage(WM_RECV, (WPARAM)cblocksocket->recvbuf, 0); 
		cblocksocket->Send(cblocksocket->ConnectSocket, "FileList_Request", int(strlen("FileList_Request") + sizeof(char)), 0);
		Sleep(25);
	}

	AfxGetMainWnd()->SendMessage(WM_RECVFILELISTFINISH, 0, 0);
	return 0;
}

LRESULT CFileTransferClientDlg::OnRecv(WPARAM wParam, LPARAM lParam)
{
	char *recvbuf = (char*)wParam;
	CFILELIST.InsertItem(CFILELIST.GetItemCount(), (CString)recvbuf);
	return 0;
}

LRESULT CFileTransferClientDlg::OnRecvFile(WPARAM wParam, LPARAM lParam)
{
	char* recvbuf = (char*)wParam;
	if (cblocksocket.display == 1)
	{
		CString cstr;
		cstr.Format("%s", recvbuf);
		CFILECONTENTLIST.InsertItem(CFILECONTENTLIST.GetItemCount()+1, cstr);
	}
	return 0;
}

LRESULT CFileTransferClientDlg::OnRecvFinish(WPARAM wParam, LPARAM lParam)
{
	AfxMessageBox(_T("Transfer finished!"));
	DownConnection();
	return 0;
}

LRESULT CFileTransferClientDlg::OnRecvFileListFinish(WPARAM wParam, LPARAM lParam)
{
	hThreadrecv->SuspendThread();
	return 0;
}

LRESULT CFileTransferClientDlg::OnRecvFileNotExist(WPARAM wParam, LPARAM lParam)
{
	AfxMessageBox(_T("Requested File doesn't exist!"));
	DownConnection();
	return 0;
}


//点击读取文件
void CFileTransferClientDlg::OnBnClickedButtondownload()
{

	//先向服务器发送文件信息
	//读取输入框中的文本转换成char * 并且发送
	TerminateThread(*hThreadrecv, NULL);
	AfxMessageBox(_T("Reading file!"));
	int iResult;
	CString Filename;
	CFILENAME.GetWindowText(Filename);
	CFILECONTENTLIST.DeleteAllItems();
	string filenamestring(T2A(Filename.GetBuffer()));
	cblocksocket.out_filename = filenamestring;
	char *filename = const_cast<char*>(filenamestring.c_str());

	//创建互斥量
	cblocksocket.ghMutex = CreateMutex(
		NULL,              // default security attributes
		FALSE,             // initially not owned
		NULL);             // unnamed mutex

	if (cblocksocket.ghMutex == NULL)
	{
		printf("CreateMutex error: %d\n", GetLastError());
		return ;
	}

	iResult = cblocksocket.Send(cblocksocket.ConnectSocket, filename, int(strlen(filename) + sizeof(char)), 0);//向服务器发送文件请求！
	iResult = cblocksocket.Send(cblocksocket.ConnectSocket2, filename, int(strlen(filename) + sizeof(char)), 0);//向服务器发送文件请求！
	iResult = cblocksocket.Send(cblocksocket.ConnectSocket3, filename, int(strlen(filename) + sizeof(char)), 0);//向服务器发送文件请求！
	if (!iResult)
	{
		AfxMessageBox(_T("Sending file request with error!"));
		return;
	}

	CDOWNLOAD.EnableWindow(False);
	CCONNECTLIST.DeleteAllItems();
	CCONNECTLIST.InsertItem(connect_num, "File is downloading!");
	
	//将接受到的数据写入文件
	hThreadrecvfile = AfxBeginThread(RecvFile, (LPVOID)&cblocksocket, THREAD_PRIORITY_NORMAL, 0, 0, NULL);
	hThreadrecvfile2 = AfxBeginThread(RecvFile, (LPVOID)&cblocksocket, THREAD_PRIORITY_NORMAL, 0, 0, NULL);
	hThreadrecvfile3 = AfxBeginThread(RecvFile, (LPVOID)&cblocksocket, THREAD_PRIORITY_NORMAL, 0, 0, NULL);
	return;
}


//输入文件名
void CFileTransferClientDlg::OnEnChangeEditfilename()
{
	CString filename;
	CFILENAME.GetWindowText(filename);
	if (!filename.IsEmpty()) 
	{
		CDOWNLOAD.EnableWindow(TRUE);
	}
	else 
	{
		CDOWNLOAD.EnableWindow(FALSE);
	}
}


bool CFileTransferClientDlg::DownConnection()
{
	CCONNECTLIST.DeleteAllItems();
	CCONNECTION.SetWindowText(CString("CONNECT"));
	CIPADDRESS.EnableWindow(TRUE);
	CPORT.EnableWindow(TRUE);
	CFILENAME.EnableWindow(FALSE);
	CDOWNLOAD.EnableWindow(FALSE);
	CCHECKDISPLAY.EnableWindow(FALSE);
	CCHECKSAVE.EnableWindow(FALSE);
	CFILENAME.SetWindowText(_T(""));
	TerminateThread(*hThreadrecv, NULL);
	TerminateThread(*hThreadrecvfile, NULL);

	if (cblocksocket.close())
	{
		CCONNECTLIST.InsertItem(connect_num, (CString)"Connection is disconnected!");
	}
	else
	{
		switch (status) {
		case 0:CCONNECTLIST.InsertItem(connect_num, (CString)"Connection not initialized!");
			break;
		case 1:CCONNECTLIST.InsertItem(connect_num, (CString)"Connection with error!Try to reconnect!");
			break;
		case 2:CCONNECTLIST.InsertItem(connect_num, (CString)"Connection disconnected with error!");
			break;
		}
	}
	connection = FALSE;
	AfxMessageBox(_T("Connection closed successfully"));
	return 1;
}


//接收文件 1
UINT CFileTransferClientDlg::RecvFile(LPVOID lpParam) 
{
	CBlockingSocket *cblocksocket = (CBlockingSocket*)lpParam;
	const int bufferSize = 10280;
	char buffer[bufferSize] = { 0 };
	memset(buffer, 0, sizeof(buffer));
	
	string buf="";
	int readLen = 0;
	fstream accceptfile;
	system("mkdir \"Download\"");
	string file_head = "Download\\Download_";
	cblocksocket->out_filename = file_head + cblocksocket->out_filename;
	accceptfile.open(cblocksocket->out_filename, ios::out | ios::binary );
	int Sequence = 0;

	DWORD dwCount = 0, dwWaitResult;
	// Request ownership of mutex.
	dwWaitResult = WaitForSingleObject(
		cblocksocket->ghMutex,    // handle to mutex
		INFINITE);  // no time-out interval
	switch (dwWaitResult)
	{
	case WAIT_OBJECT_0:
		do
				{
					// 1
					readLen = recvfrom(cblocksocket->ConnectSocket, buffer, bufferSize, 0,0,0);

					if (strcmp(buffer, "File doesn't exist or removerd!") == 0)
					{
						cblocksocket->iResult = shutdown(cblocksocket->ConnectSocket, SD_SEND);
						accceptfile.close();
						AfxGetMainWnd()->SendMessage(WM_RECVFILENOTEXIST, 0, 0);
						break;
					}
					if (readLen == 0)
					{
						cblocksocket->iResult = shutdown(cblocksocket->ConnectSocket, SD_SEND);
						accceptfile.close();
						AfxGetMainWnd()->SendMessage(WM_RECVFINISH, 0, 0);
						break;
					}
					else
					{
						Message* message = (Message*)buffer;

						int Datalength = sizeof(message->Data)/sizeof(message->Data[0]);
						string file(cblocksocket->out_filename);
						string extension(".txt");

						//封装错误消息
						Message* message_Noack = new Message();
						message_Noack->setSequence(Sequence + 1);
						message_Noack->setAcknowledge(1);  //收到错误收到确认Ack不变
						message_Noack->setDataLength(sizeof("Fail"));
						message_Noack->setSendSum(message->getSendSum());
						memcpy(message_Noack->Data, "Fail", sizeof("Fail"));
			
						if ( message->getSequence() != Sequence + 1)
						{
							cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket, (char *)message_Noack, int(sizeof(unsigned int) * 4 + sizeof("Fail")), 0);
							continue;
						}
						if (file.compare(file.size() - extension.size(), extension.size(), extension) == 0)//请求的是txt文件
						{
				
							if (strcmp(message->Data, "\r\x1") == 0)
							{
								strcpy(message->Data," ");
								Datalength = strlen(message->getData());
								if (Datalength != message->getDataLength() )
								{
									cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket, (char *)message_Noack, int(sizeof(unsigned int) * 4 + sizeof("Fail")), 0);
									continue;
								}
								AfxGetMainWnd()->SendMessage(WM_RECVFILE, (WPARAM)message->Data, 0);
							}
							else
							{
								char *Data = strtok(message->Data, "\r");   // UTF-8编码的文件转换成ANSI
								strcat(message->Data, "\r");
								Datalength = strlen(message->getData());
								if (Datalength != message->getDataLength())
								{
									cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket, (char *)message_Noack, int(sizeof(unsigned int) * 4 + sizeof("Fail")), 0);
									continue;
								}
								AfxGetMainWnd()->SendMessage(WM_RECVFILE, (WPARAM)message->Data, 0);
							}
							
							if (cblocksocket->save == 1)
							{
								char* intofile = message->Data;
								accceptfile.write(intofile, message->getDataLength());
							}
				
						}
						else 
						{
							AfxGetMainWnd()->SendMessage(WM_RECVFILE, (WPARAM)message->Data, 0);
							if (cblocksocket->save == 1)
							{
								accceptfile.write(message->Data, message->getDataLength());
							}
						}
			
						//收到的数据长度正确
						if (Datalength == message->getDataLength()&& message->getSequence()==Sequence+1)
						{
							Sequence += 1;
							Message* message_ack = new Message();
							message_ack->setSequence(message->getSequence());
							message_ack->setAcknowledge(message->getAcknowledge() + 1);  //收到确认Ack+1
							message_ack->setDataLength(sizeof("Success"));
							message_ack->setSendSum(message->getSendSum());
							memcpy(message_ack->Data, "Success", sizeof("Success"));
							cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket, (char *)message_ack, int(sizeof(unsigned int) * 4 + sizeof("Success")), 0);
						}

						cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket, "file_transfer", int(strlen("file_transfer")+1), 0);
					}

				} while (true);
				break;
	case WAIT_ABANDONED:
		printf("wait error\n");
		return FALSE;
	}
			
	return 0;
}


//接收文件 2
UINT CFileTransferClientDlg::RecvFile2(LPVOID lpParam)
{
	CBlockingSocket *cblocksocket = (CBlockingSocket*)lpParam;
	const int bufferSize = 10280;
	char buffer[bufferSize] = { 0 };
	memset(buffer, 0, sizeof(buffer));

	string buf = "";
	int readLen = 0;
	fstream accceptfile;
	system("mkdir \"Download\"");
	string file_head = "Download\\Download_";
	cblocksocket->out_filename = file_head + cblocksocket->out_filename;
	accceptfile.open(cblocksocket->out_filename, ios::out | ios::binary);
	int Sequence = 0;

	DWORD dwCount = 0, dwWaitResult;
	// Request ownership of mutex.
	dwWaitResult = WaitForSingleObject(
		cblocksocket->ghMutex,    // handle to mutex
		INFINITE);  // no time-out interval
	switch (dwWaitResult)
	{
	case WAIT_OBJECT_0:
		do
	{
		// 2
		readLen = recvfrom(cblocksocket->ConnectSocket2, buffer, bufferSize, 0, 0, 0);
		if (strcmp(buffer, "File doesn't exist or removerd!") == 0)
		{
			cblocksocket->iResult = shutdown(cblocksocket->ConnectSocket2, SD_SEND);
			accceptfile.close();
			AfxGetMainWnd()->SendMessage(WM_RECVFILENOTEXIST, 0, 0);
			break;
		}
		if (readLen == 0)
		{
			cblocksocket->iResult = shutdown(cblocksocket->ConnectSocket2, SD_SEND);
			accceptfile.close();
			AfxGetMainWnd()->SendMessage(WM_RECVFINISH, 0, 0);
			break;
		}
		else
		{
			Message* message = (Message*)buffer;

			int Datalength = sizeof(message->Data) / sizeof(message->Data[0]);
			string file(cblocksocket->out_filename);
			string extension(".txt");

			//封装错误消息
			Message* message_Noack = new Message();
			message_Noack->setSequence(Sequence + 1);
			message_Noack->setAcknowledge(1);  //收到错误收到确认Ack不变
			message_Noack->setDataLength(sizeof("Fail"));
			message_Noack->setSendSum(message->getSendSum());
			memcpy(message_Noack->Data, "Fail", sizeof("Fail"));

			if (message->getSequence() != Sequence + 1)
			{
				cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket2, (char *)message_Noack, int(sizeof(unsigned int) * 4 + sizeof("Fail")), 0);
				continue;
			}
			if (file.compare(file.size() - extension.size(), extension.size(), extension) == 0)//请求的是txt文件
			{

				if (strcmp(message->Data, "\r\x1") == 0)
				{
					strcpy(message->Data, " ");
					Datalength = strlen(message->getData());
					if (Datalength != message->getDataLength())
					{
						cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket2, (char *)message_Noack, int(sizeof(unsigned int) * 4 + sizeof("Fail")), 0);
						continue;
					}
					AfxGetMainWnd()->SendMessage(WM_RECVFILE, (WPARAM)message->Data, 0);
				}
				else
				{
					char *Data = strtok(message->Data, "\r");   // UTF-8编码的文件转换成ANSI
					strcat(message->Data, "\r");
					Datalength = strlen(message->getData());
					if (Datalength != message->getDataLength())
					{
						cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket2, (char *)message_Noack, int(sizeof(unsigned int) * 4 + sizeof("Fail")), 0);
						continue;
					}
					AfxGetMainWnd()->SendMessage(WM_RECVFILE, (WPARAM)message->Data, 0);
				}

				if (cblocksocket->save == 1)
				{
					char* intofile = message->Data;
					accceptfile.write(intofile, message->getDataLength());
				}

			}
			else
			{
				AfxGetMainWnd()->SendMessage(WM_RECVFILE, (WPARAM)message->Data, 0);
				if (cblocksocket->save == 1)
				{
					accceptfile.write(message->Data, message->getDataLength());
				}
			}

			//收到的数据长度正确
			if (Datalength == message->getDataLength() && message->getSequence() == Sequence + 1)
			{
				Sequence += 1;
				Message* message_ack = new Message();
				message_ack->setSequence(message->getSequence());
				message_ack->setAcknowledge(message->getAcknowledge() + 1);  //收到确认Ack+1
				message_ack->setDataLength(sizeof("Success"));
				message_ack->setSendSum(message->getSendSum());
				memcpy(message_ack->Data, "Success", sizeof("Success"));
				cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket2, (char *)message_ack, int(sizeof(unsigned int) * 4 + sizeof("Success")), 0);
			}

			cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket2, "file_transfer", int(strlen("file_transfer") + 1), 0);
		}

	} while (true);
		break;
	case WAIT_ABANDONED:
		printf("wait error\n");
		return FALSE;
	}
	return 0;
}

//接收文件 3
UINT CFileTransferClientDlg::RecvFile3(LPVOID lpParam) 
{
	CBlockingSocket *cblocksocket = (CBlockingSocket*)lpParam;
	const int bufferSize = 10280;
	char buffer[bufferSize] = { 0 };
	memset(buffer, 0, sizeof(buffer));

	string buf = "";
	int readLen = 0;
	fstream accceptfile;
	system("mkdir \"Download\"");
	string file_head = "Download\\Download_";
	cblocksocket->out_filename = file_head + cblocksocket->out_filename;
	accceptfile.open(cblocksocket->out_filename, ios::out | ios::binary);
	int Sequence = 0;

	DWORD dwCount = 0, dwWaitResult;
	// Request ownership of mutex.
	dwWaitResult = WaitForSingleObject(
		cblocksocket->ghMutex,    // handle to mutex
		INFINITE);  // no time-out interval
	switch (dwWaitResult)
	{
	case WAIT_OBJECT_0:
		do
		{
			// 3
			readLen = recvfrom(cblocksocket->ConnectSocket3, buffer, bufferSize, 0, 0, 0);

			if (strcmp(buffer, "File doesn't exist or removerd!") == 0)
			{
				cblocksocket->iResult = shutdown(cblocksocket->ConnectSocket3, SD_SEND);
				accceptfile.close();
				AfxGetMainWnd()->SendMessage(WM_RECVFILENOTEXIST, 0, 0);
				break;
			}
			if (readLen == 0)
			{
				cblocksocket->iResult = shutdown(cblocksocket->ConnectSocket3, SD_SEND);
				accceptfile.close();
				AfxGetMainWnd()->SendMessage(WM_RECVFINISH, 0, 0);
				break;
			}
			else
			{
				Message* message = (Message*)buffer;

				int Datalength = sizeof(message->Data) / sizeof(message->Data[0]);
				string file(cblocksocket->out_filename);
				string extension(".txt");

				//封装错误消息
				Message* message_Noack = new Message();
				message_Noack->setSequence(Sequence + 1);
				message_Noack->setAcknowledge(1);  //收到错误收到确认Ack不变
				message_Noack->setDataLength(sizeof("Fail"));
				message_Noack->setSendSum(message->getSendSum());
				memcpy(message_Noack->Data, "Fail", sizeof("Fail"));

				if (message->getSequence() != Sequence + 1)
				{
					cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket3, (char *)message_Noack, int(sizeof(unsigned int) * 4 + sizeof("Fail")), 0);
					continue;
				}
				if (file.compare(file.size() - extension.size(), extension.size(), extension) == 0)//请求的是txt文件
				{

					if (strcmp(message->Data, "\r\x1") == 0)
					{
						strcpy(message->Data, " ");
						Datalength = strlen(message->getData());
						if (Datalength != message->getDataLength())
						{
							cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket3, (char *)message_Noack, int(sizeof(unsigned int) * 4 + sizeof("Fail")), 0);
							continue;
						}
						AfxGetMainWnd()->SendMessage(WM_RECVFILE, (WPARAM)message->Data, 0);
					}
					else
					{
						char *Data = strtok(message->Data, "\r");   // UTF-8编码的文件转换成ANSI
						strcat(message->Data, "\r");
						Datalength = strlen(message->getData());
						if (Datalength != message->getDataLength())
						{
							cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket3, (char *)message_Noack, int(sizeof(unsigned int) * 4 + sizeof("Fail")), 0);
							continue;
						}
						AfxGetMainWnd()->SendMessage(WM_RECVFILE, (WPARAM)message->Data, 0);
					}

					if (cblocksocket->save == 1)
					{
						char* intofile = message->Data;
						accceptfile.write(intofile, message->getDataLength());
					}

				}
				else
				{

					AfxGetMainWnd()->SendMessage(WM_RECVFILE, (WPARAM)message->Data, 0);
					if (cblocksocket->save == 1)
					{
						accceptfile.write(message->Data, message->getDataLength());
					}
				}

				//收到的数据长度正确
				if (Datalength == message->getDataLength() && message->getSequence() == Sequence + 1)
				{
					Sequence += 1;
					Message* message_ack = new Message();
					message_ack->setSequence(message->getSequence());
					message_ack->setAcknowledge(message->getAcknowledge() + 1);  //收到确认Ack+1
					message_ack->setDataLength(sizeof("Success"));
					message_ack->setSendSum(message->getSendSum());
					memcpy(message_ack->Data, "Success", sizeof("Success"));
					cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket3, (char *)message_ack, int(sizeof(unsigned int) * 4 + sizeof("Success")), 0);
				}

				cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket3, "file_transfer", int(strlen("file_transfer") + 1), 0);
			}
		} while (true);
		break;
	case WAIT_ABANDONED:
		printf("wait error\n");
		return FALSE;
	}
	return 0;
}
void CFileTransferClientDlg::OnBnClickedCheckdisplay()
{
	cblocksocket.display = 1;
}


void CFileTransferClientDlg::OnBnClickedChecksave()
{
	cblocksocket.save = 1;
}


void CFileTransferClientDlg::OnNMClickListfile(NMHDR *pNMHDR, LRESULT *pResult)
{
	LPNMITEMACTIVATE pNMItemActivate = reinterpret_cast<LPNMITEMACTIVATE>(pNMHDR);
	// TODO: 在此添加控件通知处理程序代码
	POSITION p = CFILELIST.GetFirstSelectedItemPosition();
	int index = CFILELIST.GetNextSelectedItem(p);

	//获得选中的内容
	//得到第index行.第0列的内容(下标从0开始)
	CString FirstColumn = CFILELIST.GetItemText(index, 0);
	CFILENAME.SetWindowText(FirstColumn);
}


void CFileTransferClientDlg::OnBnClickedButtoncancel()
{
	cblocksocket.iResult = shutdown(cblocksocket.ConnectSocket, SD_SEND);
	cblocksocket.close();
}
