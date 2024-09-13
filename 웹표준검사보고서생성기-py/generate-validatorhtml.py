## -*- coding: utf-8 -*-  # 한글 주석쓸려면 적기
import os, time, re
import requests
from selenium import webdriver
from bs4 import BeautifulSoup
from PIL import Image
import pandas as pd

domain = 'https://www.gcon.or.kr'

menu_file = 'menuLinkList.csv'

df = pd.read_csv(os.getcwd() + '\\' + menu_file, encoding="UTF-8", low_memory=False,sep=",")
df = df.fillna('')  #nan을 공백으로 처리
#MENU_NO,MENU_NM,ALL_MENU_COURS

df['ALL_MENU_COURS'] = df['ALL_MENU_COURS'].str.replace('&amp;','&')

resolutions = ['360', '765', '1200']
height = '1080'

f = open("새파일2.html", "wt", encoding="utf-8")
data="""
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="UTF-8">
	<title>호환성보고서</title>
	<style>
		*{border: 0;margin: 0;}
		.a4{
			border: 1px solid #000;
			width: 287mm;
			height: 200mm;
			page-break-before: always;
		}
		h1 {
			font-size: 20px;
			margin: 10px 0 20px;
		}
		table {
			width: 100%;
			border-collapse: collapse;
			border: 1px solid #000;
			text-align: center;
		}
		img{
			/* width: 90mm; */
			width: 100%;
		}
		td {
			padding: 10px;
			border: 1px solid #000;
		}
	</style>
</head>
<body>
"""
f.write(data)
for idx, row in df.iterrows():
    try:
        # driver.get(domain + row['ALL_MENU_COURS'])
        # driver.get(row['ALL_MENU_COURS'])
        req = requests.get(domain + row['ALL_MENU_COURS'])
        ## HTML 소스 가져오기
        html = req.text
        ## BeautifulSoup으로 html소스를 python객체로 변환하기
        ## 첫 인자는 html소스코드, 두 번째 인자는 어떤 parser를 이용할지 명시.
        ## 이 글에서는 Python 내장 html.parser를 이용했다.
        soup = BeautifulSoup(html, 'html.parser')
        my_titles = soup.select(
         '.navigation'
         )
        ## my_titles는 list 객체
        for title in my_titles:
            ## Tag안의 텍스트
            print('---')
            print(title.text)
            ## Tag의 속성을 가져오기(ex: href속성)
            # data = title.text % i
            data = '<div class="a4">\n<h1>'+title.text+"</h1>\n"
            print(type(row['ALL_MENU_COURS']))
            data+='<a href="{}">{}</a>'  .format(row['ALL_MENU_COURS'],row['ALL_MENU_COURS'])
            data+='<table>\n'
            data+='	<tr><td>https://validator.w3.org/nu/?doc={}</td></tr>\n' .format(row['ALL_MENU_COURS'])
            data+='	<tr>\n'
            data+='		<td><div class=img><img src="va/%d.png"></div></td>\n' % row['MENU_NO']
            data+='	</tr>\n'
            data+='</table>\n'
            data+='</div>\n'
            f.write(data)
    except Exception as e:
        print(e)
        continue
data="""</body></html>"""
f.write(data)
f.close()