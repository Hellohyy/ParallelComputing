#pragma once

#include <stdlib.h>
#include <stdio.h>
#include <string>

using namespace std;

class Message {
private:
	unsigned int Sequence; //序列号
	unsigned int Acknowledge; //确认帧
	unsigned int DataLength; //数据长度
	unsigned int SendSum; //发送次数

public:
	char Data[10240]; //读取的文本数据
	Message();
	Message(unsigned int Sequencep, unsigned int Acknowledgep, unsigned int DataLengthp, char &Datap);
	~Message();
	void setSequence(unsigned int Sequencep);
	void setAcknowledge(unsigned int Acknowledgep);
	void setDataLength(unsigned int DataLengthp);
	void setSendSum(unsigned int SendSum);
	void setData(char* Datap);

	unsigned int getSequence();
	unsigned int getAcknowledge();
	unsigned int getDataLength();
	unsigned int getSendSum();
	char* getData();

};