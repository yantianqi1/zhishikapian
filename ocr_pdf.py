#!/usr/bin/env python3
"""
PDF OCR提取脚本 - 使用Tesseract OCR
支持中文识别
"""

import os
import sys
from pdf2image import convert_from_path
import pytesseract
from PIL import Image
import tempfile

# 配置Tesseract路径（macOS默认安装路径）
pytesseract.pytesseract.tesseract_cmd = '/opt/homebrew/bin/tesseract'

# 支持的语言（英文+中文简体）
LANG = 'chi_sim+eng'

def ocr_image(image):
    """对单个图像进行OCR识别"""
    # 配置OCR参数
    custom_config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(image, lang=LANG, config=custom_config)
    return text

def process_pdf(pdf_path, output_txt_path):
    """处理PDF文件并提取文字"""
    print(f"正在处理: {pdf_path}")
    print("正在将PDF转换为图像...")

    # 创建临时目录存储图像
    with tempfile.TemporaryDirectory() as temp_dir:
        # 将PDF转换为图像列表
        images = convert_from_path(pdf_path, output_folder=temp_dir, dpi=300)

        print(f"PDF共有 {len(images)} 页")

        all_text = []

        for i, image in enumerate(images, 1):
            print(f"正在识别第 {i}/{len(images)} 页...")
            text = ocr_image(image)
            all_text.append(f"\n===== 第 {i} 页 =====\n")
            all_text.append(text)

        # 合并所有文本
        full_text = '\n'.join(all_text)

        # 保存到文件
        with open(output_txt_path, 'w', encoding='utf-8') as f:
            f.write(full_text)

        print(f"\n文字提取完成！")
        print(f"输出文件: {output_txt_path}")
        print(f"提取文字总长度: {len(full_text)} 字符")

        return full_text

if __name__ == '__main__':
    # PDF文件路径
    pdf_path = '/Users/yantianqi/Documents/pdf 知识文档转html/2025.3.2天津社区工作者笔试珍题，考生回忆版.pdf'
    output_path = '/tmp/ocr_output.txt'

    # 检查文件是否存在
    if not os.path.exists(pdf_path):
        print(f"错误: 找不到PDF文件: {pdf_path}")
        sys.exit(1)

    # 执行OCR
    text = process_pdf(pdf_path, output_path)

    # 打印前500字预览
    print("\n===== 文字预览（前500字）=====")
    print(text[:500])
