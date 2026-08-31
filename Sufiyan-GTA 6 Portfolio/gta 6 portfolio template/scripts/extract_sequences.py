#!/usr/bin/env python3
"""
============================================================
GTA 6 / VICE CITY PORTFOLIO — VIDEO SEQUENCE EXTRACTOR
============================================================
Instructions:
1. Place your Video 1 (street drive) inside assets/sequence/
2. Place your Video 2 (tunnel continuation) inside assets/sequence2/
3. Run this script: python scripts/extract_sequences.py
============================================================
"""

import os
import shutil
import cv2

def extract_video_1():
    seq1_dir = r"assets/sequence"
    video_files = [f for f in os.listdir(seq1_dir) if f.lower().endswith(('.mp4', '.mov', '.avi', '.mkv', '.webm'))]
    if not video_files:
        print("No video file found in assets/sequence/. Keeping existing WebP frames.")
        return 0

    video_path = os.path.join(seq1_dir, video_files[0])
    print(f"Extracting Sequence 1 from: {video_path}")

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error opening {video_path}")
        return 0

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_raw = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    start_07s = int(0.7 * fps) # trim first 0.7s

    # Clean old webp frames
    for f in os.listdir(seq1_dir):
        if f.endswith(".webp"):
            os.remove(os.path.join(seq1_dir, f))

    cap.set(cv2.CAP_PROP_POS_FRAMES, start_07s)
    count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        count += 1
        h, w = frame.shape[:2]
        if w > 1920:
            frame = cv2.resize(frame, (1920, int(h * (1920 / w))), interpolation=cv2.INTER_AREA)

        out_name = f"frame_{count:04d}.webp"
        cv2.imwrite(os.path.join(seq1_dir, out_name), frame, [int(cv2.IMWRITE_WEBP_QUALITY), 82])

    cap.release()
    print(f"Sequence 1 extracted: {count} frames.")
    return count

def extract_video_2():
    seq2_dir = r"assets/sequence2"
    video_files = [f for f in os.listdir(seq2_dir) if f.lower().endswith(('.mp4', '.mov', '.avi', '.mkv', '.webm'))]
    if not video_files:
        print("No video file found in assets/sequence2/. Keeping existing WebP frames.")
        return 0

    video_path = os.path.join(seq2_dir, video_files[0])
    print(f"Extracting Sequence 2 from: {video_path}")

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error opening {video_path}")
        return 0

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_raw = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    start_2s = int(2.0 * fps)
    end_7s   = int(7.0 * fps)

    part1 = []
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_2s)
    for f in range(start_2s, min(end_7s, total_raw)):
        ret, frame = cap.read()
        if not ret: break
        h, w = frame.shape[:2]
        if w > 1920: frame = cv2.resize(frame, (1920, int(h * (1920 / w))), interpolation=cv2.INTER_AREA)
        part1.append(frame)

    part2 = []
    cap.set(cv2.CAP_PROP_POS_FRAMES, end_7s)
    for f in range(end_7s, total_raw):
        ret, frame = cap.read()
        if not ret: break
        h, w = frame.shape[:2]
        if w > 1920: frame = cv2.resize(frame, (1920, int(h * (1920 / w))), interpolation=cv2.INTER_AREA)
        part2.append(frame)

    cap.release()

    for f in os.listdir(seq2_dir):
        if f.endswith(".webp"):
            os.remove(os.path.join(seq2_dir, f))

    count = 0
    for frame in part1:
        count += 1
        cv2.imwrite(os.path.join(seq2_dir, f"frame2_{count:04d}.webp"), frame, [int(cv2.IMWRITE_WEBP_QUALITY), 82])

    for rep in range(4):
        for frame in part2:
            count += 1
            cv2.imwrite(os.path.join(seq2_dir, f"frame2_{count:04d}.webp"), frame, [int(cv2.IMWRITE_WEBP_QUALITY), 82])

    print(f"Sequence 2 extracted: {count} frames.")
    return count

if __name__ == "__main__":
    c1 = extract_video_1()
    c2 = extract_video_2()
    print("Done! Make sure to update SEQ1_COUNT and SEQ2_COUNT in main.js if frame counts changed.")
