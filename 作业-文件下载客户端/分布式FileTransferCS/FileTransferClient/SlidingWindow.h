#pragma once

#include <stdlib.h>
#include <stdio.h>
#include <string>
#include "Message.h"
#include <vector>

#define MAX_WINDOWS 5

using namespace std;

class SlidingWindow
{
public:
	Message messageWindows[MAX_WINDOWS];
	vector<int> SendSeq;
	vector<bool> SendAck;

};