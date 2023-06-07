#!/usr/bin/env python3

import requests
import cv2
import numpy as np

# Specify the URL of your Cloud Function
url = 'https://receipt-scanner-dctp3pim2q-uc.a.run.app/'

# Read the image file as binary data
with open('test.png', 'rb') as f:
    file_data = f.read()


# # Convert the binary data to a NumPy array
# np_array = np.frombuffer(file_data, np.uint8)

# # Decode the NumPy array as an image using OpenCV
# image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

# # Perform image processing operations
# # For example, convert the image to grayscale
# gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# # Perform further image processing or analysis as needed
# # ...

# # Display or save the processed image
# cv2.imshow('Processed Image', gray_image)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

# Send the HTTP request with the file payload
response = requests.post(url, file_data)

# Print the response from the Cloud Function
print(response.text)