import os
import sys

input_path = os.path.join(os.path.dirname(__file__), "public", "ChatGPT Image 28 sept. 2026, 00_26_33.png")
output_path = os.path.join(os.path.dirname(__file__), "public", "ChatGPT Image 28 sept. 2026, 00_26_33_nobg.png")

print(f"Processing: {input_path}")

try:
    from rembg import remove
    from PIL import Image

    input_img = Image.open(input_path)
    output_img = remove(input_img)
    output_img.save(output_path, "PNG")
    print(f"Successfully removed background using rembg! Saved to: {output_path}")
    sys.exit(0)
except Exception as e:
    print(f"rembg not available or failed ({e}), falling back to OpenCV GrabCut...")

try:
    import cv2
    import numpy as np
    from PIL import Image

    src = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    h, w = src.shape[:2]

    # Create mask for Grabcut
    mask = np.zeros((h, w), np.uint8)
    bgdModel = np.zeros((1, 65), np.float64)
    fgdModel = np.zeros((1, 65), np.float64)

    # Rectangle encompassing the hand and phone
    rect = (int(w * 0.05), int(h * 0.05), int(w * 0.90), int(h * 0.90))
    cv2.grabCut(src[:, :, :3], mask, rect, bgdModel, fgdModel, 7, cv2.GC_INIT_WITH_RECT)

    # Foreground is where mask is 1 or 3
    fg_mask = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')

    # Detect light background color from the 4 corners
    corners = np.concatenate([
        src[0:50, 0:50, :3].reshape(-1, 3),
        src[0:50, w-50:w, :3].reshape(-1, 3),
        src[h-100:h, 0:50, :3].reshape(-1, 3),
        src[h-100:h, w-50:w, :3].reshape(-1, 3)
    ], axis=0)
    bg_mean = np.mean(corners, axis=0)
    bg_std = np.std(corners, axis=0) + 1e-5

    # Refine mask: pixels very close to background color should be transparent
    diff = np.linalg.norm(src[:, :, :3] - bg_mean, axis=2)
    fg_mask[diff < 35] = 0

    # Smooth the mask edges
    alpha = (fg_mask * 255).astype(np.uint8)
    alpha = cv2.GaussianBlur(alpha, (5, 5), 0)

    # Combine BGR + Alpha
    b, g, r = cv2.split(src[:, :, :3])
    rgba = cv2.merge([b, g, r, alpha])

    cv2.imwrite(output_path, rgba)
    print(f"Successfully processed with OpenCV! Saved to: {output_path}")
except Exception as e:
    print(f"Error processing with OpenCV: {e}")
