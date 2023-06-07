"""

Contains the program for receipt scanning
Takes an input image (passed by an http request)
Preprocesses that image using OpenCV
Then finds significant text using PyTesseract
Parses for total value, then returns

**note: This is not meant to be run locally
        It is deployed to a google cloud container
        And can then be called with an http post request

"""

import cv2
from matplotlib import pyplot as plt
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
import pytesseract
from pytesseract import Output

app = Flask(__name__)


#converts colored picture to gray_scale
def gray_scale(image):
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

#convert from grayscale to binary
def binarize(image):
    thresh, im_bw = cv2.threshold(image, 160, 255, cv2.THRESH_BINARY)
    return im_bw

#reduce noise from image
def rem_noise(image):
    kernel = np.ones((1,1), np.uint8)
    image = cv2.dilate(image, kernel, iterations=1)
    kernel = np.ones((1,1), np.uint8)
    image = cv2.erode(image, kernel, iterations=1) #
    image = cv2.morphologyEx(image, cv2.MORPH_CLOSE, kernel)
    image = cv2.medianBlur(image, 3)
    return(image)

#removes broders from image
def remove_borders(image):
    contours, hierarchy = cv2.findContours(image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)    #TODO: look into
    cntSorted = sorted(contours, key=lambda x:cv2.contourArea(x))
    cnt = cntSorted[-1]
    x,y,w,h = cv2.boundingRect(cnt)
    crop = image[y:y+h, x:x+w]
    return (crop)

#adds border to image (so text isn't on edge)
def add_borders(image):
    color = [255,255,255]
    top,bottom,left,right = [10]*4
    add_borders = cv2.copyMakeBorder(image, top, bottom, left, right, cv2.BORDER_CONSTANT, value=color)
    return add_borders

#used to erode image - not used in this version
def thin_font(image):
    image = cv2.bitwise_not(image)
    kernel = np.ones((2,1), np.uint8)
    image = cv2.erode(image, kernel, iterations=1)
    image = cv2.bitwise_not(image)
    return(image)

#used to dilate image - not used in this version
def thick_font(image):
    image = cv2.bitwise_not(image)
    kernel = np.ones((2,1), np.uint8)
    image = cv2.dilate(image, kernel, iterations=2)
    image = cv2.bitwise_not(image)
    return(image)

def rotate(image):
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
    
    angle = getSkewAngle(image)
    return rotateImage(image, -1.0 * angle)

def get_numbers(img):
    myconfig = r"--psm 11 --oem 3 tessedit_char_whitelist=0123456789 -c tessedit_char_whitelist=0123456789."
    data = pytesseract.image_to_data(img, config = myconfig, output_type = Output.DICT)
    return data

""" AUXILLIARY FUNCTIONS (FOR TESTING) <-- not called in actual google func"""
#basic function to display picture (for notebook)
def display(im_path):
    dpi = 80
    im = Image.open(im_path)
    im_data = Image.open(im_path).convert("L")

    # Create a figure of the right size with one axes that takes up the full figure
    fig = plt.figure()
    ax = fig.add_axes([0, 0, 1, 1])

    # Hide spines, ticks, etc.
    ax.axis('off')

    # Display the image.
    plt.imshow(im_data, cmap="gray", vmin=0, vmax=255)
    plt.show()

""" MAIN"""
def main(image):
    #checks the parameters
    img = image
    
    if img is None:
        return -1
    
    #basic preprocessing
    gray = gray_scale(img)
    im_bw = binarize(gray)
    # rotated = rotate(im_bw)
    no_borders = remove_borders(im_bw)
    padded = add_borders(no_borders)

    #OCR
    img = padded
    data = get_numbers(img)

    size = len(data['text'])
    max_val = 0.0
    max_ind = 0

    #goes through possible numbers and identifies max
    for i in range (size):
        if float(data['conf'][i]) > 20:
            if float(data['text'][i]) > max_val:
                max_val = float(data['text'][i])
                max_ind = i

    (x, y, width, height) = (data['left'][max_ind], data['top'][max_ind], data['width'][max_ind], data['height'][max_ind])
    img = cv2.rectangle(img, (x,y), (x+width, y+height), (0,0,255), 1)
    img = cv2.putText(img, data['text'][max_ind], (x, y+height+20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1, cv2.LINE_AA)

    return max_val

@app.route('/', methods=['POST'])
def helloFromGit():
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    
    image_data = request.get_data()
    nparr = np.frombuffer(image_data, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    total = main(image)
    return str(total)

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port=int(os.environ.get('PORT', 8080)))