from PIL import Image
import math
import resize as re

from os import listdir
from os.path import isfile, join
mypath = 'C:\python\img\sprite-gnb'
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
