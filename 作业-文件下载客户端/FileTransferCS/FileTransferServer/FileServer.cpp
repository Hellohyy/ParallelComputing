#include "FileTransferServer.h"
#include "io.h"


using namespace std;

#define MAX_PATH 80

char *getcwd(char *buffer, int maxlen);

int __cdecl main(int argc, char **argv)
{
	if (argc != 2) {

		printf("usage: %s port \n", argv[0]);
		printf("Please input server port!");
		return 1;
	}

	const char *port = argv[1];
	CBlockingSocket cblocksocket;
	cblocksocket.init(port);
	//system("PAUSE");
	int i = 0;
	while (1)
	{
		printf("Waiting for connection request!\n");
		cblocksocket.Accept(i);
		i++;
	}
}



