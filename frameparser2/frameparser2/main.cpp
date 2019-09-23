#include <iostream>
#include <iomanip>
#include <fstream>
#include "FrameParser.h"
#include "pub.h"
#include "hFrame.h"
#include "CCRC32.h"
using namespace std;

FrameParser::FrameParser() {
	pframe = new Frame;
}


FrameParser::~FrameParser()
{
	delete pframe;
	pframe = NULL;
}


void FrameParser::setFrame(BYTE *buffer,int datalen) {
	pframe->datanum = datalen;
	memcpy(pframe->preamble, buffer, 7);
	memcpy(pframe->start, buffer + 7, 1);
	memcpy(pframe->des, buffer + 8, 6);
	memcpy(pframe->src, buffer + 14, 6);
	memcpy(pframe->type, buffer + 20, 2);
	pframe->data.assign(buffer + 22, buffer + 22 + datalen);
	/*for (int i = 0; i < datalen; i++) {
		pframe->data.push_back(*(buffer + 22 + i));
	}*/
	memcpy(pframe->checksum, buffer + 22+datalen, 4);
}

void FrameParser::printFrame(int num)
{
	cout << "Frame#:                第" << num << "条帧" << endl;

	cout << "Preamble:              ";
	for (int i = 0; i<7; ++i)
		cout << hex << uppercase << (UINT)pframe->preamble[i] << " ";
	cout << endl;

	cout << "Start:                 " << (UINT)pframe->start[0] << endl;

	cout << "Destination Address:   ";
	for (int i = 0; i<6; ++i)
	{
		cout << setw(2) << setfill('0') << (UINT)pframe->des[i];
		if (i != 5)
			cout << "-";
	}
	cout << endl;

	cout << "Source Address:        ";
	for (int i = 0; i<6; ++i)
	{
		cout << setw(2) << setfill('0') << (UINT)pframe->src[i];
		if (i != 5)
			cout << "-";
	}
	cout << endl;

	cout << "Type:                  ";
	for (int i = 0; i<2; ++i)
		cout << setw(2) << (UINT)pframe->type[i] << " ";
	cout << endl;

	cout << "Data:                  " << pframe->data.data() << endl;

	cout << "FCS:                   0x ";
	for (int i = 3; i >= 0; --i)
		cout << hex << nouppercase << (UINT)pframe->checksum[i];
	cout << endl;
}


headFrame::headFrame() {
	h_Frame = new MyhFrame;
}


void headFrame::setheadFrame(BYTE *buffer) {
	memcpy(h_Frame->preamble, buffer, 7);
	memcpy(h_Frame->start, buffer + 7, 1);
};

BYTE headFrame::Setvalue() {
	for (int i = 0; i < 8; i++) {
		if (i == 7) {
			val[i] = h_Frame->start[0];
		}
		else {
			val[i] = h_Frame->preamble[i];
		}
	}
	return val[8];
}

void setFrameVal(int frameend,int framestart) {
	int fr_len;
	fr_len = frameend - framestart;
	vector<BYTE> fr(fr_len);
	BYTE frr;
	//inFile.seekg(framestart - 1);
	for (int p = 0; p < fr_len; p++) {
		//inFile.read((char *)&frr, 1);
		//fr[p] = frr;
	}
	//fp.setFrame(fr.data(), fr_len - 26);//获取到的帧设置值
	//fp.printFrame();
}

void crccheck(CCRC32 crc32,vector<BYTE> fr) {
	UINT myfcs = crc32.FullCRC((BYTE *)fr.data() + 8, fr.size()-12);
	pp::compareFCS(fr.data() + 68, myfcs);
	cout << "----------------------------------------------" << endl << endl;
}

int main(int argc, char *argv[])
{
	int frame_count = 0;//输出的解析帧编号
	//ifstream inFile("E:\\LinSir\\第一次作业\\testFrame", ios::in | ios::binary); //二进制读方式打开
	ifstream inFile(".//testFrame2", ios::in | ios::binary);
	//ifstream inFile("E:\\test11", ios::in | ios::binary);
	
	if (!inFile) {
		cout << "error" << endl;
		return 0;
	}
	/*获取文件总长度字节*/
	inFile.seekg(0, ios::end);
	long filelength = inFile.tellg();
	inFile.seekg(0, ios::beg);

	FrameParser fp;//帧解析器
	BYTE headf[8] = { 170,170,170,170,170,170,170,171 };//帧前八个字节，判断帧开始
	headFrame hd;//标准帧头
	hd.setheadFrame(headf);

	BYTE nNum;
	int framestrat, frameend ;//帧头，帧尾
	int frame_c = 0;
	int currentAA;

	CCRC32 crc32;//CCRC32验证
	crc32.Initialize(); //Only have to do this once.

	/*开始逐字节读取文件,确定读到的帧，解析帧*/
	while (inFile.read((char *)&nNum, sizeof(BYTE))) { //一直读到文件结束
		int readedBytes = inFile.gcount(); //看刚才读了多少字节

		if (nNum == 0xAA) {//读到AA
			currentAA = inFile.tellg();//遇到AA时当前指针位置
			//cout << "遇到AA指针 " << currentAA << endl;
			int headP = currentAA;
			int end = headP + 8;
			BYTE ifheadframe[8];
			ifheadframe[0] = nNum;
			//cout << (UINT)ifheadframe[0] << endl;
			/*遇到AA后连续8字节*/
			for (int j = 0; j<7,headP+1 < end; j++, headP++) {
				BYTE h;
				inFile.seekg(currentAA + j);
				inFile.read((char *)&h, 1);
				//cout << "H:" << (UINT)h << endl;
				ifheadframe[j+1] = h;
				//cout << "数字:" << (UINT)ifheadframe[j + 1] << endl;
			}
			headFrame hdf;

			hdf.setheadFrame(ifheadframe);
			hd.Setvalue();
			hdf.Setvalue();

			bool ifhf;//判断是否帧头
			for (int l = 0; l < 8; l++) {
				if (hd.val[l] != hdf.val[l]) {
					break;
				}
				ifhf = hd.val[l] == hdf.val[l]?1:0;
				
			}

			/*发现一个帧头*/
			if (ifhf) {
				//cout << "相等:" << 1 << endl;
				int fr_len;
				switch (frame_c)
				{
					case 0:framestrat = currentAA;
							frame_c = 1;
							inFile.seekg(currentAA + 8);
							break;
					case 1:frameend = currentAA;//确认帧
							fr_len = frameend - framestrat;
							vector<BYTE> fr(fr_len);
							BYTE frr;
							inFile.seekg(framestrat-1);
							for (int p = 0; p < fr_len; p++) {
								inFile.read((char *)&frr, 1);
								fr[p] = frr;
								
							}
							fp.setFrame(fr.data(),fr_len-26);//获取到的帧设置值
							fp.printFrame(++frame_count);
							crccheck(crc32, fr);//crc验证
							frame_c = 0;
							inFile.seekg(frameend-1);
							break;
				}	
				
			}
			else {
				inFile.seekg(currentAA + 1);
			}
		}
			long local = inFile.tellg();//读到文件末尾
			if (local == filelength)
			{
				frameend = filelength;
				int fr_len;
				fr_len = frameend - framestrat+1;
				vector<BYTE> fr(fr_len);
				BYTE frr;
				inFile.seekg(framestrat - 1);
				for (int p = 0; p < fr_len; p++) {
					inFile.read((char *)&frr, 1);
					fr[p] = frr;
				}
				fp.setFrame(fr.data(), fr_len - 26);//获取到的帧设置值
				fp.printFrame(++frame_count);
				crccheck(crc32, fr);//crc验证
				break;
			}
		
	}
	inFile.close();
	system("Pause");
	return 0;
}