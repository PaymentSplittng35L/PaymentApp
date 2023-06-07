import cv from 'opencv.js';
import Tesseract from 'tesseract.js';

async function preprocessImage(imagePath: string): Promise<cv.Mat> {
  const image = await cv.imreadAsync(imagePath);
  
  // Convert to grayscale
  const gray = new cv.Mat();
  cv.cvtColor(image, gray, cv.COLOR_BGR2GRAY);
  
  // Binarize the image
  const binarized = new cv.Mat();
  cv.threshold(gray, binarized, 160, 255, cv.THRESH_BINARY);
  
  // Remove noise
  const kernel = new cv.Mat(1, 1, cv.CV_8U, new cv.Scalar(1));
  cv.dilate(binarized, binarized, kernel);
  cv.erode(binarized, binarized, kernel);
  cv.morphologyEx(binarized, binarized, cv.MORPH_CLOSE, kernel);
  cv.medianBlur(binarized, binarized, 3);
  
  // Remove borders
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(binarized, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  const cntSorted = contours.sort((a, b) => cv.contourArea(b) - cv.contourArea(a));
  const cnt = cntSorted.get(cntSorted.size() - 1);
  const [x, y, w, h] = cv.boundingRect(cnt);
  const cropped = binarized.roi(new cv.Rect(x, y, w, h));
  
  // Add normalized borders
  const top = bottom = left = right = 10;
  const bordered = new cv.Mat();
  cv.copyMakeBorder(cropped, bordered, top, bottom, left, right, cv.BORDER_CONSTANT, new cv.Scalar(255, 255, 255));
  
  return bordered;
}

async function recognizeText(imagePath: string): Promise<string> {
  const preprocessedImage = await preprocessImage(imagePath);
  const buffer = preprocessedImage.data.buffer;
  
  const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
    tessedit_char_whitelist: '0123456789',
    psm: 11,
    oem: 3,
  });
  
  return text;
}

async function main() {
  const imagePath = 'path/to/image.jpg';
  const recognizedText = await recognizeText(imagePath);
  
  console.log('Recognized Text:', recognizedText);
}

main().catch(console.error);
