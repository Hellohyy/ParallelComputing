
#include "Message.h"
#pragma warning(disable:4996) 

using  namespace  std;

Message::Message() {}

Message::Message(unsigned int Sequencep, unsigned int Acknowledgep, unsigned int DataLengthp, char &Datap)
{
	Sequence = Sequencep;
	Acknowledge = Acknowledgep;
	DataLength = DataLengthp;
	*Data = Datap;
};

Message::~Message() {}

void Message::setSequence(unsigned int Sequencep)
{
	Sequence = Sequencep;
};

void Message::setAcknowledge(unsigned int Acknowledgep)
{
	Acknowledge = Acknowledgep;
};

void Message::setDataLength(unsigned int DataLengthp)
{
	DataLength = DataLengthp;
};

void Message::setSendSum(unsigned int SendSump)
{
	SendSum = SendSump;
};

//void Message::setData(char* Datap)
//{
//	*Data = Datap;
//};

unsigned int Message::getSequence()
{
	return Sequence;
};

unsigned int Message::getAcknowledge()
{
	return Acknowledge;
};

unsigned int Message::getDataLength()
{
	return DataLength;
};

unsigned int Message::getSendSum()
{
	return SendSum;
};

char* Message::getData()
{
	return Data; //读取的文本数据
};