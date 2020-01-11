
// FileTransferClientDlg.h : 头文件
//

#pragma once
#pragma warning(disable:4996) 
#include "TransferClient.h"

#define WM_RECV (WM_USER + 100)
#define WM_RECVFILE (WM_USER + 101)
#define WM_RECVFINISH (WM_USER + 102)
#define WM_RECVFILELISTFINISH (WM_USER + 103)
#define WM_RECVFILENOTEXIST (WM_USER + 104)


// CFileTransferClientDlg 对话框
class CFileTransferClientDlg : public CDHtmlDialog
{
// 构造
public:
	CFileTransferClientDlg(CWnd* pParent = NULL);	// 标准构造函数

// 对话框数据
#ifdef AFX_DESIGN_TIME
	enum { IDD = IDD_FILETRANSFERCLIENT_DIALOG, IDH = IDR_HTML_FILETRANSFERCLIENT_DIALOG };
#endif

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	// DDX/DDV 支持

	HRESULT OnButtonOK(IHTMLElement *pElement);
	HRESULT OnButtonCancel(IHTMLElement *pElement);

public:
	CEdit CIPADDRESS;
	CEdit CPORT;
	CEdit CFILENAME;
	CButton CCONNECTION;
	CButton CDOWNLOAD;
	CButton CCHECKDISPLAY;
	CButton CCHECKSAVE;
	CListCtrl CFILELIST;
	CListCtrl CFILECONTENTLIST;
	CListCtrl CCONNECTLIST;
public:
	CBlockingSocket cblocksocket;
	bool connection = FALSE;
	int connect_num;
	int status=0; //0初始，1代表服务器连接错误（ip或端口号错误） 2代表服务器已连接
	CWinThread *hThreadrecv;
	CWinThread *hThreadrecvfile;
	CWinThread *hThreadrecvfile2;
	CWinThread *hThreadrecvfile3;
	

// 实现
protected:
	HICON m_hIcon;

	// 生成的消息映射函数
	virtual BOOL OnInitDialog();
	afx_msg void OnSysCommand(UINT nID, LPARAM lParam);
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();
	DECLARE_MESSAGE_MAP()
	DECLARE_DHTML_EVENT_MAP()
public:
	afx_msg void OnBnClickedButtonconnect();
	afx_msg void OnBnClickedButton1();
	afx_msg void OnBnClickedButton2();
	static UINT Recv(LPVOID lpParam);
	static UINT RecvFile(LPVOID lpParam);
	static UINT RecvFile2(LPVOID lpParam);
	static UINT RecvFile3(LPVOID lpParam);
	LRESULT OnRecv(WPARAM wParam, LPARAM lParam);
	LRESULT OnRecvFile(WPARAM wParam, LPARAM lParam);
	LRESULT OnRecvFinish(WPARAM wParam, LPARAM lParam);
	LRESULT OnRecvFileListFinish(WPARAM wParam, LPARAM lParam);
	LRESULT OnRecvFileNotExist(WPARAM wParam, LPARAM lParam);
	afx_msg void OnBnClickedButtondownload();
	afx_msg void OnEnChangeEditfilename();
	bool DownConnection();
	afx_msg void OnBnClickedCheckdisplay();
	afx_msg void OnBnClickedChecksave();
	afx_msg void OnNMClickListfile(NMHDR *pNMHDR, LRESULT *pResult);
	afx_msg void OnBnClickedButtoncancel();
};
