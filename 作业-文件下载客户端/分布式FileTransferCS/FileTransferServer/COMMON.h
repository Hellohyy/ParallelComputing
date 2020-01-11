#pragma once
#pragma warning(disable:4996)

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <windows.h>

using namespace std;

class Common
{
public:
	static string UTF8ToGB(const char* str)
	{
		string result;
		WCHAR *strSrc;
		LPSTR szRes;

		//获得临时变量的大小
		int i = MultiByteToWideChar(CP_UTF8, 0, str, -1, NULL, 0);
		strSrc = new WCHAR[i + 1];
		MultiByteToWideChar(CP_UTF8, 0, str, -1, strSrc, i);

		//获得临时变量的大小
		i = WideCharToMultiByte(CP_ACP, 0, strSrc, -1, NULL, 0, NULL, NULL);
		szRes = new CHAR[i + 1];
		WideCharToMultiByte(CP_ACP, 0, strSrc, -1, szRes, i, NULL, NULL);

		result = szRes;
		delete[]strSrc;
		delete[]szRes;

		return result;
	}

	static int Utf8ToAnsi(const char *pstrUTF8, char *pstrAnsi)
	{
		int i = 0;
		int j = 0;
		char strUnicode[200] = { 0 };

		i = MultiByteToWideChar(CP_UTF8, 0, pstrUTF8, -1, NULL, 0);
		memset(strUnicode, 0, i);
		MultiByteToWideChar(CP_UTF8, 0, pstrUTF8, -1, (LPWSTR)strUnicode, i);
		j = WideCharToMultiByte(CP_ACP, 0, (LPWSTR)strUnicode, -1, NULL, 0, NULL, NULL);
		WideCharToMultiByte(CP_ACP, 0, (LPWSTR)strUnicode, -1, pstrAnsi, j, NULL, NULL);
		return 0;
	}

	static string whichCode(char * filename)
	{
		ifstream fin;
		fin.open(filename, ios::in | ios::binary);
		unsigned char  s2;
		fin.read((char*)&s2, sizeof(s2));//读取第一个字节，然后左移8位
		int p = s2 << 8;
		fin.read((char*)&s2, sizeof(s2));//读取第二个字节
		p |= s2;
		
		string code;

		if (p == 65534)
		{
			code = "Unicode";
		}
		else if(p == 65279)
		{
			code = "Unicode big endian";
			
		}
		else if (p == 61371)
		{
			code = "UTF-8";
		}
		else
		{
			code = "ANSI";
		}
		fin.close();
		return code;
	}

	static string TextEncode(const char *fPath)
	{
		char srcBuff[1024];
		char header[2];
		unsigned char uniTxt[] = { 0xFF, 0xFE };			// Unicode file header
		unsigned char endianTxt[] = { 0xFE, 0xFF };		// Unicode big endian file header
		unsigned char utf8Txt[] = { 0xEF, 0xBB, 0xBF };	// UTF_8 file header
		int len = 0;
		int ascii = 0;

		string code;

		FILE *pFile;
		pFile = fopen(fPath, "rb");
		if (NULL == pFile)
		{
			return false;
		}

		//  ASCII range(0~127)
		while (1)
		{
			len = fread(srcBuff, 1, 1024, pFile);
			if (0 == len)
			{
				break;
			}
			for (int i = 0; i < len; i++)
			{
				header[0] = srcBuff[0];
				header[1] = srcBuff[1];
				header[2] = srcBuff[2];

				if (srcBuff[i] < 0 || srcBuff[i]>127)
				{
					ascii++;
				}

			}
		}

		if (0 == ascii)		// ASCII file
		{
			//printf("ASCII text\n");
			code = "ASCII";
		}
		else if ((2 == ascii) && (0 == memcmp(header, uniTxt, sizeof(uniTxt))))		// Unicode file
		{
			//printf("Unicode text\n");
			code = "Unicode";
		}
		else if ((2 == ascii) && (0 == memcmp(header, endianTxt, sizeof(endianTxt))))	//  Unicode big endian file
		{
			//printf("Unicode big endian text\n");
			code = "Unicode big endian";
		}
		else if ((3 == ascii) && (0 == memcmp(header, utf8Txt, sizeof(utf8Txt))))		// UTF-8 file
		{
			//printf("UTF-8 text\n");
			code = "UTF-8";
		}
		else
		{
			//printf("	Unknow\n");
			code = "ANSI";
		}
		fclose(pFile);
		return code;
	}

	static bool IsUTF8(const void* pBuffer, long size)
	{
		bool IsUTF8 = true;
		unsigned char* start = (unsigned char*)pBuffer;
		unsigned char* end = (unsigned char*)pBuffer + size;
		while (start < end)
		{
			if (*start < 0x80) // (10000000): 值小于0x80的为ASCII字符    
			{
				start++;
			}
			else if (*start < (0xC0)) // (11000000): 值介于0x80与0xC0之间的为无效UTF-8字符    
			{
				IsUTF8 = false;
				break;
			}
			else if (*start < (0xE0)) // (11100000): 此范围内为2字节UTF-8字符    
			{
				if (start >= end - 1)
				{
					break;
				}

				if ((start[1] & (0xC0)) != 0x80)
				{
					IsUTF8 = false;
					break;
				}

				start += 2;
			}
			else if (*start < (0xF0)) // (11110000): 此范围内为3字节UTF-8字符    
			{
				if (start >= end - 2)
				{
					break;
				}

				if ((start[1] & (0xC0)) != 0x80 || (start[2] & (0xC0)) != 0x80)
				{
					IsUTF8 = false;
					break;
				}

				start += 3;
			}
			else
			{
				IsUTF8 = false;
				break;
			}
		}

		return IsUTF8;
	}

	static bool IsUTF8File(const char* pFileName)
	{
		FILE *f = NULL;
		fopen_s(&f, pFileName, "rb");
	    if (NULL == f)
		{
			return false;
		}

		fseek(f, 0, SEEK_END);
		long lSize = ftell(f);
		fseek(f, 0, SEEK_SET);  //或rewind(f);  
	
		char *pBuff = new char[lSize + 1];
		memset(pBuff, 0, lSize + 1);
		fread(pBuff, lSize, 1, f);
		fclose(f);
		
		bool bIsUTF8 = IsUTF8(pBuff, lSize);
		delete[]pBuff;
		pBuff = NULL;
	
		return bIsUTF8;
 }

	
private:

};

