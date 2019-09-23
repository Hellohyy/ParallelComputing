#include <ostream>
#include <fstream>
#include <vector>
using std::vector;

#ifndef BYTE
typedef unsigned char BYTE;
#endif

#ifndef UINT
typedef unsigned int UINT;
#endif

typedef struct Frame {
	int datanum;
	BYTE preamble[7];
	BYTE start[1];
	BYTE des[6];
	BYTE src[6];
	BYTE type[2];
	vector<BYTE> data;
	BYTE checksum[4];
}MYFRAME, *PMYFRAME;

class FrameParser {
public:
	FrameParser();
	~FrameParser();
	void setFrame(BYTE *buffer,int datalen);
	void printFrame(int num);
	PMYFRAME pframe;
private:
	
};