
// FileTransferClientDlg.cpp : ʵ���ļ�
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


// ����Ӧ�ó��򡰹��ڡ��˵���� CAboutDlg �Ի���

class CAboutDlg : public CDialogEx
{
public:
	CAboutDlg();

// �Ի�������
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_ABOUTBOX };
#endif

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV ֧��

// ʵ��
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


// CFileTransferClientDlg �Ի���

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


// CFileTransferClientDlg ��Ϣ�������

BOOL CFileTransferClientDlg::OnInitDialog()
{
	CDHtmlDialog::OnInitDialog();

	// ��������...���˵�����ӵ�ϵͳ�˵��С�

	// IDM_ABOUTBOX ������ϵͳ���Χ�ڡ�
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

	// ���ô˶Ի����ͼ�ꡣ  ��Ӧ�ó��������ڲ��ǶԻ���ʱ����ܽ��Զ�
	//  ִ�д˲���
	SetIcon(m_hIcon, TRUE);			// ���ô�ͼ��
	SetIcon(m_hIcon, FALSE);		// ����Сͼ��

	// TODO: �ڴ���Ӷ���ĳ�ʼ������
	//��������
	CFont *m_Font;
	m_Font = new CFont;
	m_Font->CreateFont(50, 20, 0, 0, 100,
		FALSE, FALSE, 0, ANSI_CHARSET, OUT_DEFAULT_PRECIS,
		CLIP_DEFAULT_PRECIS, DEFAULT_QUALITY, FF_SWISS, (LPCTSTR)"Arial");
	GetDlgItem(IDC_STATIC_TITLE)->SetFont(m_Font);

	//������list���붥������
	CCONNECTLIST.InsertColumn(0, _T("Connection status"), LVCFMT_LEFT, 400, 0);
	CFILELIST.InsertColumn(0, _T("FILE LIST"), LVCFMT_LEFT, 400, 0);
	CFILECONTENTLIST.InsertColumn(0, _T("FILE CONTENT"), LVCFMT_LEFT, 400, 0);

	//���غ������ļ�����CHECK��ť������
	CFILENAME.EnableWindow(FALSE);
	CDOWNLOAD.EnableWindow(FALSE);
	CCHECKDISPLAY.EnableWindow(FALSE);
	CCHECKSAVE.EnableWindow(FALSE);
	return TRUE;  // ���ǽ��������õ��ؼ������򷵻� TRUE
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

// �����Ի��������С����ť������Ҫ����Ĵ���
//  �����Ƹ�ͼ�ꡣ  ����ʹ���ĵ�/��ͼģ�͵� MFC Ӧ�ó���
//  �⽫�ɿ���Զ���ɡ�

void CFileTransferClientDlg::OnPaint()
{
	if (IsIconic())
	{
		CPaintDC dc(this); // ���ڻ��Ƶ��豸������

		SendMessage(WM_ICONERASEBKGND, reinterpret_cast<WPARAM>(dc.GetSafeHdc()), 0);

		// ʹͼ���ڹ����������о���
		int cxIcon = GetSystemMetrics(SM_CXICON);
		int cyIcon = GetSystemMetrics(SM_CYICON);
		CRect rect;
		GetClientRect(&rect);
		int x = (rect.Width() - cxIcon + 1) / 2;
		int y = (rect.Height() - cyIcon + 1) / 2;

		// ����ͼ��
		dc.DrawIcon(x, y, m_hIcon);
	}
	else
	{
		CDHtmlDialog::OnPaint();
	}
}

//���û��϶���С������ʱϵͳ���ô˺���ȡ�ù��
//��ʾ��
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

//������Ӱ�ť
void CFileTransferClientDlg::OnBnClickedButtonconnect()
{	
	//��ȡ����IP�Ͷ˿ں�
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
		CFILENAME.Clear();//��������
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

//�˳�
void CFileTransferClientDlg::OnBnClickedButton1()
{
	cblocksocket.close();
	OnCancel();
}

//����
void CFileTransferClientDlg::OnBnClickedButton2()
{
	CAboutDlg dlg;
	dlg.DoModal();
}

//���շ��������͹���������
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


//�����ȡ�ļ�
void CFileTransferClientDlg::OnBnClickedButtondownload()
{
	//��������������ļ���Ϣ
	//��ȡ������е��ı�ת����char * ���ҷ���
	TerminateThread(*hThreadrecv, NULL);
	AfxMessageBox(_T("Reading file!"));
	int iResult;
	CString Filename;
	CFILENAME.GetWindowText(Filename);
	CFILECONTENTLIST.DeleteAllItems();
	string filenamestring(T2A(Filename.GetBuffer()));
	cblocksocket.out_filename = filenamestring;
	char *filename = const_cast<char*>(filenamestring.c_str());

	iResult = cblocksocket.Send(cblocksocket.ConnectSocket, filename, int(strlen(filename) + sizeof(char)), 0);//������������ļ�����
	if (!iResult)
	{
		AfxMessageBox(_T("Sending file request with error!"));
	}

	CDOWNLOAD.EnableWindow(False);
	CCONNECTLIST.DeleteAllItems();
	CCONNECTLIST.InsertItem(connect_num, "File is downloading!");
	
	//�����ܵ�������д���ļ�
	hThreadrecvfile = AfxBeginThread(RecvFile, (LPVOID)&cblocksocket, THREAD_PRIORITY_NORMAL, 0, 0, NULL);

	
	return;
}


//�����ļ���
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


//�����ļ�
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
	// TODO: �ڴ���ӿؼ�֪ͨ����������
	POSITION p = CFILELIST.GetFirstSelectedItemPosition();
	int index = CFILELIST.GetNextSelectedItem(p);

	//���ѡ�е�����
	//�õ���index��.��0�е�����(�±��0��ʼ)
	CString FirstColumn = CFILELIST.GetItemText(index, 0);
	CFILENAME.SetWindowText(FirstColumn);
}


void CFileTransferClientDlg::OnBnClickedButtoncancel()
{
	cblocksocket.iResult = shutdown(cblocksocket.ConnectSocket, SD_SEND);
	cblocksocket.close();
}
