#!/usr/bin/env python
# coding: utf-8

# In[1]:


import cv2
from matplotlib import pyplot as plt
import numpy as np
from PIL import Image

image_file = "data/receipt5.jpg"
img = cv2.imread(image_file)


# In[2]:


#basic function to display picture (for notebook)
def display(im_path):
    dpi = 80
    im = Image.open(im_path)
    im_data = Image.open(im_path).convert("L")

#     height, width  = im_data.shape
    
    
#     # What size does the figure need to be in inches to fit the image?
#     figsize = width / float(dpi), height / float(dpi)

    # Create a figure of the right size with one axes that takes up the full figure
    fig = plt.figure()
    ax = fig.add_axes([0, 0, 1, 1])

    # Hide spines, ticks, etc.
    ax.axis('off')

    # Display the image.
    plt.imshow(im_data, cmap="gray", vmin=0, vmax=255)
    plt.show()


# In[3]:


display(image_file)


# In[4]:


#invert image
inverted_image = cv2.bitwise_not(img)
cv2.imwrite("temp/inverted.jpg", inverted_image)
display("temp/inverted.jpg")


# In[5]:


#rescaling (dk if necessary) <-- look at tesseract documentation


# In[6]:


#grayscale (needed to binarize)
gray_scale = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
cv2.imwrite("temp/gray.jpg", gray_scale)
display("temp/gray.jpg")


# In[7]:


#binarization (TODO: look into adaptive thresholding)
#https://opencv24-python-tutorials.readthedocs.io/en/latest/py_tutorials/py_imgproc/py_thresholding/py_thresholding.html#thresholding
thresh, im_bw = cv2.threshold(gray_scale, 160, 255, cv2.THRESH_BINARY)
cv2.imwrite("temp/bw_image.jpg", im_bw)
display("temp/bw_image.jpg")


# In[8]:


#noise removal (this is shitty right now for some reason)
# should only really call if pytesseract says its shitty
# look at https://www.youtube.com/watch?v=SEj1imXHjqM
def rem_noise(image):
    kernel = np.ones((1,1), np.uint8)
    image = cv2.dilate(image, kernel, iterations=1)
    kernel = np.ones((1,1), np.uint8)
    image = cv2.erode(image, kernel, iterations=1) #
    image = cv2.morphologyEx(image, cv2.MORPH_CLOSE, kernel)
    image = cv2.medianBlur(image, 3)
    return(image)

no_noise = rem_noise(im_bw)
cv2.imwrite("temp/no_noise.jpg", no_noise)
display("temp/no_noise.jpg")

#delete this later
no_noise = im_bw


# In[9]:


#dilation and erosion
def thin_font(image):
    image = cv2.bitwise_not(image)
    kernel = np.ones((2,1), np.uint8)
    image = cv2.erode(image, kernel, iterations=1)
    image = cv2.bitwise_not(image)
    return(image)
    
eroded_image = thin_font(no_noise)   #change to no_noise later
cv2.imwrite("temp/eroded.jpg", eroded_image)
display("temp/eroded.jpg")


# In[10]:


def thick_font(image):
    image = cv2.bitwise_not(image)
    kernel = np.ones((2,1), np.uint8)
    image = cv2.dilate(image, kernel, iterations=2)
    image = cv2.bitwise_not(image)
    return(image)
    
dilated_image = thick_font(eroded_image)   #change to no_noise later
cv2.imwrite("temp/dilated.jpg", dilated_image)
display("temp/dilated.jpg")


# In[11]:


#rotation/deskewing
rotated = cv2.imread("temp/dilated.jpg")

#https://becominghuman.ai/how-to-automatically-deskew-straighten-a-text-image-using-opencv-a0c30aed83df
def getSkewAngle(cvImage) -> float:
    # Prep image, copy, convert to gray scale, blur, and threshold
    newImage = cvImage.copy()
    gray = cv2.cvtColor(newImage, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (9, 9), 0)
    thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]

    # Apply dilate to merge text into meaningful lines/paragraphs.
    # Use larger kernel on X axis to merge characters into single line, cancelling out any spaces.
    # But use smaller kernel on Y axis to separate between different blocks of text
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (30, 5))
    dilate = cv2.dilate(thresh, kernel, iterations=2)

    # Find all contours
    contours, hierarchy = cv2.findContours(dilate, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key = cv2.contourArea, reverse = True)
    for c in contours:
        rect = cv2.boundingRect(c)
        x,y,w,h = rect
        cv2.rectangle(newImage,(x,y),(x+w,y+h),(0,255,0),2)

    # Find largest contour and surround in min area box
    largestContour = contours[0]
    print (len(contours))
    minAreaRect = cv2.minAreaRect(largestContour)
    cv2.imwrite("temp/boxes.jpg", newImage)
    # Determine the angle. Convert it to the value that was originally used to obtain skewed image
    angle = minAreaRect[-1]
    if angle < -45:
        angle = 90 + angle
    return -1.0 * angle
# Rotate the image around its center
def rotateImage(cvImage, angle: float):
    newImage = cvImage.copy()
    (h, w) = newImage.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    newImage = cv2.warpAffine(newImage, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return newImage
# Deskew image
def deskew(cvImage):
    angle = getSkewAngle(cvImage)
    return rotateImage(cvImage, -1.0 * angle)

fixed = deskew(rotated)
cv2.imwrite("temp/rotated_fixed.jpg", fixed)

display("temp/rotated_fixed.jpg")


# In[12]:


#get rid of border
def remove_border(image):
    contours, hierarchy = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)    #TODO: look into
    cntSorted = sorted(contours, key=lambda x:cv2.contourArea(x))
    cnt = cntSorted[-1]
    x,y,w,h = cv2.boundingRect(cnt)
    crop = image[y:y+h, x:x+w]
    return (crop)

no_borders = remove_border(im_bw)
cv2.imwrite("temp/no_borders.jpg", no_borders)
display("temp/no_borders.jpg")


# In[13]:


color = [255,255,255]
top,bottom,left,right = [10]*4
add_borders = cv2.copyMakeBorder(no_borders, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)
cv2.imwrite("temp/image_with_border.jpg", add_borders)
display("temp/image_with_border.jpg")


# In[ ]:





# In[ ]:





# In[ ]:




