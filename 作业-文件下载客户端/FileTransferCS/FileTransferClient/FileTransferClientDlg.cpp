
// FileTransferClientDlg.cpp : 实现文件
//

#include "stdafx.h"
#include "FileTransferClient.h"
#include "FileTransferClientDlg.h"
#include "afxdialogex.h"
#include <fstream>
#include <string>
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
	ON_MESSAGE(WM_RECVFINISH, OnRecvFinish)
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
				recv(cblocksocket.ConnectSocket, cblocksocket.recvbuf, 100, 0);
				cblocksocket.hostip = cblocksocket.recvbuf;

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
	int i = 0, size = 0;
	if (recv(cblocksocket->ConnectSocket, cblocksocket->recvbuf, 20, 0))
	{
		size = (int)cblocksocket->recvbuf;
		Sleep(10);
	}
	while (i<size)
	{
		recv(cblocksocket->ConnectSocket, cblocksocket->recvbuf, cblocksocket->recvbuflen, 0);
		AfxGetMainWnd()->SendMessage(WM_RECV, (WPARAM)cblocksocket->recvbuf, 0); 
		i++;
		Sleep(25);
	}
	cout << "111" << endl;
	return 0;
}

LRESULT CFileTransferClientDlg::OnRecv(WPARAM wParam, LPARAM lParam)
{
	char *recvbuf = (char*)wParam;
	//CFILELIST.DeleteAllItems();
	CFILELIST.InsertItem(CFILELIST.GetItemCount(), (CString)recvbuf);
	return 0;
}

LRESULT CFileTransferClientDlg::OnRecvFile(WPARAM wParam, LPARAM lParam)
{
	char *recvbuf = (char*)wParam;
	//CFILELIST.DeleteAllItems();
	if (cblocksocket.display == 1)
	{
		CFILECONTENTLIST.InsertItem(CFILECONTENTLIST.GetItemCount()+1, (CString)recvbuf);
	}
	return 1;
}

LRESULT CFileTransferClientDlg::OnRecvFinish(WPARAM wParam, LPARAM lParam)
{
	AfxMessageBox(_T("Transfer finished!"));
	DownConnection();
	return 1;
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

	iResult = cblocksocket.Send(cblocksocket.ConnectSocket, filename, int(strlen(filename) + sizeof(char)), 0);//向服务器发送文件请求！
	if (!iResult)
	{
		AfxMessageBox(_T("Sending file request with error!"));
	}

	CDOWNLOAD.EnableWindow(False);
	CCONNECTLIST.DeleteAllItems();
	CCONNECTLIST.InsertItem(connect_num, "File is downloading!");
	
	//将接受到的数据写入文件
	hThreadrecvfile = AfxBeginThread(RecvFile, (LPVOID)&cblocksocket, THREAD_PRIORITY_NORMAL, 0, 0, NULL);

	
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


//接收文件
UINT CFileTransferClientDlg::RecvFile(LPVOID lpParam) 
{
	CBlockingSocket *cblocksocket = (CBlockingSocket*)lpParam;
	const int bufferSize = 10240;
	char buffer[bufferSize] = { 0 };
	memset(buffer, 0, sizeof(buffer));
	int readLen = 0;
	fstream accceptfile;
	system("mkdir \"Download\"");
	string file_head = "Download\\Download_";
	cblocksocket->out_filename = file_head + cblocksocket->out_filename;
	accceptfile.open(cblocksocket->out_filename, ios::out | ios::binary );
	do
	{
		readLen = recv(cblocksocket->ConnectSocket, buffer, bufferSize, 0);
		/*if (!strcmp(buffer,"-1"))
		{
		AfxMessageBox(_T("Requestsed files is not exits!"));
		}*/
		if (readLen == 0)
		{
			//cblocksocket->iResult = shutdown(cblocksocket->ConnectSocket, SD_SEND);
			AfxGetMainWnd()->SendMessage(WM_RECVFINISH, 0, 0);
			break;
		}
		else
		{
			AfxGetMainWnd()->SendMessage(WM_RECVFILE, (WPARAM)buffer, 0);
			if (cblocksocket->save == 1)
			{
				accceptfile.write(buffer, readLen);
			}
			char *ip = const_cast<char*>(cblocksocket->hostip.c_str());
			cblocksocket->iResult = cblocksocket->Send(cblocksocket->ConnectSocket, ip, int(strlen(ip)+1), 0);
		}
		Sleep(5);
	} while (true);
	accceptfile.close();
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
