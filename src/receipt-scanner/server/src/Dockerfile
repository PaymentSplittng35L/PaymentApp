FROM python:3.10

RUN pip3 install Flask gunicorn opencv-python pytesseract pillow

COPY src/ app/
WORKDIR /app

ENV PORT 8080

CMD exec gunicorn --bind:$PORT --workers 1 --threads 8 app:app