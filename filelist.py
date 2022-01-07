import sys
from PIL import Image
import math
import resize as re

from os import listdir
from os.path import isfile, join

if(len(sys.argv) == 1):
	print('''설명서 : 
	1배수 이미지크기를 확인하고 2배수 이미지의 크기를 조정해 드립니다.
	인자로 png 이미지가 있는 경로를 추가해주세요.

	절대경로 filelist.exe c:/python/asset
	상대경로 filelist.exe ./asset
	''')
	sys.exit()

mypath = sys.argv[1]
print('입력받은 경로 : ' + mypath)
onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]

for item in onlyfiles:
	if (item.find('@2x') > 0):
		loadfilename = item.replace('@2x','')
		old_image_path = mypath+'\\'+loadfilename
		im = Image.open(old_image_path)
		old_width, old_height = im.size
		print(loadfilename)
		print(old_width)
		old_width = old_width * 2
		print(old_height)
		old_height = old_height * 2
		citem = mypath+'\\'+item
		re.resize_canvas(citem, citem, old_width, old_height)
		# filename, new_image_path="save.png", canvas_width=500, canvas_height=500

