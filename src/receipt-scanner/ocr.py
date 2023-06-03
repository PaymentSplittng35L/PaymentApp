#!/usr/bin/env python3
# coding: utf-8

"""
initializes our imports
and defines helper functions

Page segmentation modes:
  1    Automatic page segmentation with OSD.
  3    Fully automatic page segmentation, but no OSD. (Default)
  4    Assume a single column of text of variable sizes.
  5    Assume a single uniform block of vertically aligned text.
  6    Assume a single uniform block of text.
  7    Treat the image as a single text line.
  8    Treat the image as a single word.
  9    Treat the image as a single word in a circle.
 10    Treat the image as a single character.
 11    Sparse text. Find as much text as possible in no particular order.
 12    Sparse text with OSD.
 13    Raw line. Treat the image as a single text line,
       bypassing hacks that are Tesseract-specific.
       
OCR Engine Modes:
1.   Neural nets LSTM engine only.
3.   Default, based on what is available.
"""

import pytesseract
from pytesseract import Output
import PIL.Image
import cv2

myconfig = r"--psm 11 --oem 3 tessedit_char_whitelist=0123456789 -c tessedit_char_whitelist=0123456789."
# text = pytesseract.image_to_string(PIL.Image.open("temp/image_with_border.jpg"), config = myconfig)

image_path = "temp/image_with_border.jpg"
# image_path = "data/OCR_numbers.jpg"
# image_path = "data/receipt4.jpg"
img = cv2.imread(image_path)
height, width, _ = img.shape

# boxes = pytesseract.image_to_boxes(img, config = myconfig)
# for box in boxes.splitlines():
#     box = box.split(" ")
#     img = cv2.rectangle(img, (int(box[1]), height - int(box[2])), (int(box[3]), height - int(box[4])), (0, 255, 0), 2)

data = pytesseract.image_to_data(img, config = myconfig, output_type = Output.DICT)
size = len(data['text'])
for i in range (size):
    if float(data['conf'][i]) > 0:
        (x, y, width, height) = (data['left'][i], data['top'][i], data['width'][i], data['height'][i])
        img = cv2.rectangle(img, (x,y), (x+width, y+height), (0,0,255), 1)
        img = cv2.putText(img, data['text'][i], (x, y+height+20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1, cv2.LINE_AA)

cv2.imshow("img", img)
cv2.imwrite("results/receipt5.jpg", img)
cv2.waitKey(0)