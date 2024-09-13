import os
from PIL import Image

def find_images(base_folder):
    # 이미지 리스트에서 @2x 이미지 제외
    images = [img for img in os.listdir(base_folder) if img.endswith(('.png', '.jpg', '.jpeg')) and '@2x' not in img]
    return images

def expand_to_2x(img_path, save_folder):
    # 원본 이미지 열기
    img = Image.open(img_path)
    width, height = img.size

    # 확장할 이미지 크기 계산 (2배수 크기)
    new_width, new_height = width * 2, height * 2

    # 배경이 투명한 이미지 생성
    new_img = Image.new("RGBA", (new_width, new_height), (0, 0, 0, 0))

    # 원본 이미지를 중심에 배치
    new_img.paste(img, ((new_width - width) // 2, (new_height - height) // 2))

    # 새로운 이미지 파일명 생성
    base_name = os.path.basename(img_path)
    new_file_name = os.path.splitext(base_name)[0] + '@2x.png'
    new_img.save(os.path.join(save_folder, new_file_name))

def main():
    # 윈도우에서 폴더 선택 (예: C:\Images)
    base_folder = input("이미지가 저장된 폴더 경로를 입력하세요: ")
    save_folder = os.path.join(base_folder, 'dist')

    # dist 폴더가 없는 경우 생성
    os.makedirs(save_folder, exist_ok=True)

    # 이미지 찾기
    images = find_images(base_folder)

    # 이미지 확장 작업
    for image in images:
        image_path = os.path.join(base_folder, image)
        expand_to_2x(image_path, save_folder)

    print("2배수 이미지 저장이 완료되었습니다!")

if __name__ == "__main__":
    main()
