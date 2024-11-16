# GUIDE

코드에 대한 전반적인 설명이 적힌 문서입니다.
0.0.7 버전을 기준으로 하며, 현재 최신 버전은 0.0.10입니다

# 목차

-   [GUIDE](#guide)
-   [목차](#목차)
-   [전역 변수](#전역-변수)
-   [함수](#함수)
    -   [uploadImage](#uploadimage)
        -   [매개변수](#매개변수)
    -   [appendBlockButton](#appendblockbutton)
        -   [매개변수](#매개변수-1)
    -   [LinkToImage](#linktoimage)
    -   [CreateUploadButton](#createuploadbutton)
    -   [isLoad](#isload)
    -   [loadEvnet](#loadevnet)
    -   [orderV](#orderv)
        -   [매개변수](#매개변수-2)
    -   [waitLoad](#waitload)
        -   [매개변수](#매개변수-3)

# 전역 변수

`pressCtrl` - 현재 컴퓨터에서 컨트롤 키를 눌렀는가 확인하는 함수입니다. 클립 보드에 있는 이미지 업로드 기능에 사용됩니다.

# 함수

## uploadImage

엔트리에 이미지를 올리는 함수입니다.
`pressCtrl`이 true일 시 클립보드에 있는 이미지가 업로드되며 아니라면 파일 입력 창을 띄웁니다.

### 매개변수

`textPos` - 엔이 글 입력에 사용되는 textarea가 저장되는 변수입니다.

## appendBlockButton

차단 버튼을 추가하는 함수입니다. [LinkToImage](#LinkToImage)에서 호출됩니다.

### 매개변수

`target` - 글 본문이 들어가 있는 html 요소가 저장되는 변수입니다.

`isblock` - 현재 차단 여부가 저장되는 변수입니다. 버튼의 내용을 "차단하기"로 할지 "차단해제"로 할지 결정합니다.

## LinkToImage

엔이에 올라온 이미지 링크를 이미지로 변경하는 함수입니다.

## CreateUploadButton

이미지 업로드 버튼을 추가하는 함수입니다.

## isLoad

페이지 로딩 대기 후 [loadEvent](#loadEvnet)를 호출하는 함수입니다.

## loadEvnet

[CreateUploadButton](#createuploadbutton)와 [LinkToImage](#LinkToImage) 호출 후 여러 이벤트를 추가하는 함수입니다.

## orderV

현재 url이 매개변수로 넘어온 `link`와 같다면 [isLoad](#isLoad)를 호출하는 함수입니다.
1.5초 동안 실행되며 0.1초마다 현재 url이 매개변수로 넘어온 `link`와 같은지 검사합니다.

### 매개변수

`count` - 몇 초 동안 실행되었는지 저장하는 변수입니다. 0.1초마다 1 증가합니다.

`link` - 현재 url과 비교 용도로 사용되는 변수입니다.

## waitLoad

페이지 이동이 발생되었고 현재 url이 엔이 url일 시 [isLoad](#isLoad)를 호출하는 함수입니다.
1.5초 동안 실행되며 0.1초마다 현재 url이 엔이 url인지 검사합니다.

### 매개변수

`count` - 몇 초 동안 실행되었는지 저장하는 변수입니다. 0.1초마다 1 증가합니다.

`oldLink` - 이전 url이 저장되는 변수입니다.
