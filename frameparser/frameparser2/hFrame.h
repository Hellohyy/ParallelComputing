#pragma once
#include "pub.h"

typedef struct hFrame {
	BYTE preamble[7];
	BYTE start[1];
}MyhFrame, *pMyhFrame;


class headFrame {
public:
	headFrame();
	void setheadFrame(BYTE *buffer);
	pMyhFrame h_Frame;
	BYTE Setvalue();
	BYTE val[8];
private:

};