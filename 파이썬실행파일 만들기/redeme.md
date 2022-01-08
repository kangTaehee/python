# 실행파일 하나로 만들기

## 설치모듈

```pip install pyInstaller```

## 명령문

```pyInstaller -F filelist.py```

## 옵션

* -w : 윈도우 모드
* --add-data '추가할파일경로;저장할위치' : 파일추가
* -i 아이콘.ico : 실행파일 아이콘 지정