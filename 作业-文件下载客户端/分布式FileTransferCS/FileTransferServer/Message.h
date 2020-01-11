#pragma once

#include <stdlib.h>
#include <stdio.h>
#include <string>

using namespace std;

class Message {
private:
	unsigned int Sequence; //���к�
	unsigned int Acknowledge; //ȷ��֡
	unsigned int DataLength; //���ݳ���
	unsigned int SendSum; //���ʹ���

public:
	char Data[10240]; //��ȡ���ı�����
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