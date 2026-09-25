import cv2
import numpy as np

cap = cv2.VideoCapture('samre/public/hero-hand-smartphone.mp4')
ret, frame = cap.read()
if ret:
    h, w, c = frame.shape
    print(f"Resolution: {w}x{h}")
    # Inspect corners and borders
    top_left = frame[0:20, 0:20].mean(axis=(0,1))
    top_right = frame[0:20, w-20:w].mean(axis=(0,1))
    mid_left = frame[h//2-10:h//2+10, 0:20].mean(axis=(0,1))
    mid_right = frame[h//2-10:h//2+10, w-20:w].mean(axis=(0,1))
    bot_mid = frame[h-20:h, w//2-20:w//2+20].mean(axis=(0,1))
    print(f"Top-Left BGR: {top_left}")
    print(f"Top-Right BGR: {top_right}")
    print(f"Mid-Left BGR: {mid_left}")
    print(f"Mid-Right BGR: {mid_right}")
    print(f"Bot-Mid BGR: {bot_mid}")
cap.release()
