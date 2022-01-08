# node는 인터넷에서 다운받아 설치

## 준비하기

.yarnrc 파일을 만들어줍니다.

```js
yarn-offline-mirror "./npm_packages"
yarn-offline-mirror-pruning true
```

폴더 정리 : 그리고 기존의 node_modules 디렉터리와 yarn.lock 파일을 삭제합니다.
```$ rm -rf node_modules```
```$ rm yarn.lock```

캐시를 삭제합니다.
```$ yarn cache clean```

다시 패키지를 받아옵니다.
```$  yarn install```

## 오프라인에서 빌드 & 설치 방법

패키지를 설치할 때 이제 인터넷에 연결하지 않고 ./npm_packages로부터 설치할 수 있습니다.
명령어에 --offline 플래그를 사용합니다.

```$ yarn install --offline```
그리고 빌드를 합니다. 빌드가 끝나면 --production 플래그를 붙여서 install을 한 번 더 합니다.

```$ yarn install --offline --production```
--production 플래그를 붙이면, package.json에서 dependencies에 나열된 패키지만 남기고 나머지는 정리됩니다.

즉, ./npm_packages가 더 가벼워집니다. (제 경우 25MB 정도로 줄었네요.)

이제 빌드 결과물(예를 들어 /dist 디렉터리)과 package.json 파일, npm_packages 디렉터리만 대상 환경으로 복사합니다.

그리고 마지막으로 install을 한 번 더 하면 배포가 끝납니다.

$ yarn install --offline --production
요약: 인터넷 가능할 때 미리 패키지를 받아서 offline mirror 디렉터리에 저장해놓고, 이후에는 offline 모드로 진행한다.