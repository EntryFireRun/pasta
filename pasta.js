let pressCtrl = false;
let executed = document.createElement("a");
executed.id = "executed";
executed.style.display = "none";

document.addEventListener("keydown", (e) => {
    if (!pressCtrl) {
        if (e.ctrlKey) pressCtrl = true;
    }
});
document.addEventListener("keyup", () => {
    pressCtrl = false;
});

/**
 * 엔트리에 이미지를 업로드 하는 함수
 * @param {*} textarea 엔이 글 입력 textarea
 */
function uploadImage(textarea) {
    console.log(pressCtrl);
    if (!pressCtrl) {
        const imgInput = document.createElement("input");
        imgInput.type = "file";
        imgInput.click();
        imgInput.addEventListener("change", () => {
            const form = new FormData();
            form.append("file", imgInput.files[0]);
            form.append("type", "notcompress");
            fetch("https://playentry.org/rest/picture", {
                method: "POST",
                body: form,
            })
                .then((r) =>
                    r.status == 201
                        ? r.json()
                        : showError(imgInput.files[0].size / 1000000)
                )
                .then((data) => {
                    try {
                        textarea.value += `${
                            !!textarea.value ? " " : ""
                        }playentry.org//uploads/${data.filename.slice(
                            0,
                            2
                        )}/${data.filename.slice(2, 4)}/${data.filename}.${
                            data.metaData.format
                        }`;
                        textarea.style.height = textarea.scrollHeight + "px";
                    } catch (e) {
                        console.log("data 형식에 오류가 발생했습니다");
                    }
                });
        });
    } else {
        async function ImageUp() {
            for (const item of await navigator.clipboard.read()) {
                const blob = await item.getType(
                    item.types.find((t) => t.startsWith("image/"))
                    // 복사한 게 사진이 아니면 오류 뜹니다
                );
                const form = new FormData();
                form.append("file", blob);
                form.append("type", "notcompress");
                fetch("https://playentry.org/rest/picture", {
                    method: "POST",
                    body: form,
                })
                    .then((r) =>
                        r.status == 201
                            ? r.json()
                            : showError(blob.size / 1000000)
                    )
                    .then((data) => {
                        try {
                            textarea.value += `${
                                !!textarea.value ? " " : ""
                            }playentry.org//uploads/${data.filename.slice(
                                0,
                                2
                            )}/${data.filename.slice(2, 4)}/${data.filename}.${
                                data.metaData.format
                            }`;
                            textarea.style.height =
                                textarea.scrollHeight + "px";
                        } catch (e) {
                            console.log("data 형식에 오류가 발생했습니다");
                        }
                    });
            }
        }
        ImageUp();
    }
}

/**
 * 글에 차단하기/차단해제 추가하는 함수
 * @param {*} target 글 본문이 들어가 있는 html 요소
 * @param {*} isblock 현재 차단 여부, 버튼의 내용을 "차단하기"로 할지 "차단해제"로 할지 결정
 */
function appendBlockButton(target, isblock = false) {
    if (
        target.parentNode.parentNode.lastChild.lastChild.lastChild.firstChild
            .lastChild.innerText != "차단하기"
    ) {
        console.log(target);
        let blockButton =
            target.parentNode.parentNode.lastChild.lastChild.lastChild.firstChild.lastChild.cloneNode(
                true
            );
        isblock
            ? (blockButton.innerHTML = "<a>차단해제</a>")
            : (blockButton.innerHTML = "<a>차단하기</a>");
        if (!isblock) {
            blockButton.addEventListener("click", () => {
                localStorage.setItem(
                    `pastaUser_${target.parentNode.parentNode.firstChild.href.slice(
                        "30"
                    )}`,
                    target.parentNode.parentNode.firstChild.href.slice("30")
                );
                location.reload();
            });
        } else {
            blockButton.addEventListener("click", () => {
                localStorage.removeItem(
                    `pastaUser_${target.parentNode.parentNode.firstChild.href.slice(
                        "30"
                    )}`
                );
                location.reload();
            });
        }
        target.parentNode.parentNode.lastChild.lastChild.lastChild.firstChild.append(
            blockButton
        );
    }
}

/**
 * 엔이에 올라온 이미지 링크를 이미지로 변경하는 함수
 */
function LinkToImage() {
    document
        .querySelectorAll(
            "a[href^='http://playentry.org//uploads/']:not(.NoFind)"
        )
        .forEach((imgElement) => {
            if (
                /^http:\/\/playentry\.org\/\/uploads\/.{2}\/.{2}\/.*\.[a-zA-Z]*$/i.test(
                    imgElement.href
                )
            ) {
                imgElement.className = "NoFind";
                imgElement.innerHTML = `<div><a target="_blank" class="NoFind" href="${imgElement.href}"><img style="outline: 1px solid aqua;" src="${imgElement.href}" class="realImage" onerror="createLinkButtonEntry(this, '${imgElement.href}')"></div>`;
                if (
                    localStorage.getItem(
                        `pastaUser_${imgElement.parentNode.parentNode.firstChild.href.slice(
                            "30"
                        )}`
                    ) != null
                ) {
                    imgElement.href = `chrome-extension://${chrome.runtime.id}/blockImage.png`;
                    imgElement.innerHTML = `<div><a target="_blank" href="${imgElement.href}" class="NoFind"><img style="outline: 1px solid black;" class="realImage" src="chrome-extension://${chrome.runtime.id}/blockImage.png"></img></a></div>`;
                    appendBlockButton(imgElement, true);
                } else {
                    appendBlockButton(imgElement);
                }
                imgElement.removeAttribute("href");
            }
        });
    document
        .querySelectorAll(
            'a[href^="/redirect?external=https://bloupla.net/img/?="]'
        )
        .forEach((imgElement) => {
            imgElement.href
                .split("?=")[1]
                .split(",")
                .forEach((j) => {
                    if (imgElement.innerHTML.indexOf("<img") == -1)
                        imgElement.innerHTML = "";
                    imgElement.innerHTML += `<div><a target="_blank" class="NoFind" href="${imgElement.href}"><img onerror="createLinkButton(this, '${j}')" style="outline: 1px solid red;" class="realImage" src="https://firebasestorage.googleapis.com/v0/b/imgshare-2.appspot.com/o/${j}?alt=media"></img></a><div>`;
                    if (
                        localStorage.getItem(
                            `pastaUser_${imgElement.parentNode.parentNode.firstChild.href.slice(
                                "30"
                            )}`
                        ) != null
                    ) {
                        imgElement.href = `chrome-extension://${chrome.runtime.id}/blockImage.png`;
                        imgElement.innerHTML = `<div><a target="_blank" href="${imgElement.href}" class="NoFind"><img style="outline: 1px solid black;" class="realImage" src="chrome-extension://${chrome.runtime.id}/blockImage.png"></img></a></div>`;
                        appendBlockButton(imgElement, true);
                    } else {
                        appendBlockButton(imgElement);
                    }
                });
            imgElement.className = "NoFind";
            imgElement.removeAttribute("href");
        });
}

/**
 * 이미지 업로드 버튼을 추가하는 함수
 */
function CreateUploadButton(maxLoop) {
    try {
        ImageUploadsButton = document
            .querySelector(
                'html>body>div[id="__next"]>div>div[class^="nextInner"]>div>section>div>div>div>div>div>div>div>a'
            )
            .cloneNode(true);
        ImageUploadsButton.className = "imageUpload";
        ImageUploadsButton.addEventListener("click", () => {
            uploadImage(document.querySelector("textarea"));
        });
        document
            .querySelector(
                'html>body>div[id="__next"]>div>div[class^="nextInner"]>div>section>div>div>div>div>div>div>div'
            )
            .prepend(ImageUploadsButton);
    } catch {
        if (maxLoop != 20) setTimeout(CreateUploadButton(maxLoop + 1), 100);
    }
}

/**
 * 페이지 로딩 대기 후 loadEvent를 호출하는 함수
 */
function isLoad(cp = 0) {
    if (cp != 20) {
        if (document.querySelector("button") === null) {
            setTimeout(() => {
                isLoad(cp + 1);
                console.log("none");
            }, 20);
        } else {
            try {
                loadEvent();
            } catch {
                setTimeout(isLoad, 100);
            }
            console.log(document.querySelector("button"));
        }
    }
}

/**
 * 각종 이벤트를 추가하는 함수
 */
function loadEvent() {
    CreateUploadButton(0);
    LinkToImage();
    executed.remove();
    document
        .querySelector(
            "div > div > div > div > div > div:has(>span>a,>div>div>a[role='button'])"
        ) // 이랬는데 뚫리면 좀 레전드일 듯
        .appendChild(executed);
    document.querySelector("section > div > div > div > h2").innerText =
        "엔트리 이야기";
    const pastaWaterMark = document.createElement("h4");
    pastaWaterMark.innerText = "With ";
    const pastaLink = document.createElement("a");
    pastaLink.innerText = "pasta";
    pastaLink.href = "https://github.com/EntryFireRun/pasta/releases/";
    pastaWaterMark.appendChild(pastaLink);
    document
        .querySelector("section > div > div > div > h2")
        .append(pastaWaterMark);
    let SeeWebPG = new MutationObserver(() => {
        if (
            /^https?:\/\/.*\playentry\.org\/community\/entrystory\/list\?.*$/.test(
                location.href
            )
        ) {
            console.log("아르빠노");
            LinkToImage();
            document
                .querySelectorAll(
                    'li>div>div>div>div>div>div>a[role="button"]:has(>span):not([class^="noMore"])'
                )
                .forEach((i) => {
                    let j = i.cloneNode();
                    j.className = "contentButton";
                    j.addEventListener("click", () => {
                        uploadImage(
                            i.parentNode.parentNode.parentNode.querySelector(
                                "textarea"
                            )
                        );
                    });
                    i.className = `noMore ${i.className}`;
                    i.parentNode.prepend(j);
                });
        } else {
            console.log("잘가시지");
            SeeWebPG.disconnect();
        }
    });
    SeeWebPG.observe(document.querySelector("div>div:has(>ul>li>div)"), {
        childList: true,
        subtree: true,
    });
    try {
        document
            .querySelector('input[type="text"]')
            .addEventListener("keydown", (e) => {
                if (
                    e.key == "Enter" &&
                    /^https:\/\/(ncc.www)?\.?playentry.org\/community\/entrystory\/list\?.*$/g.test(
                        location.href
                    )
                )
                    location.replace(
                        `https://playentry.org/community/entrystory/list?query=${encodeURI(
                            document.querySelector('input[type = "text"]').value
                        )}`
                    );
            });
    } catch {
        // 모바일에서는 버그 남
    }
}

function showError(size) {
    document.body.style.overflow = "hidden";
    let background = document.createElement("div");
    let errorBackground = document.createElement("div");
    let closeIMG = document.createElement("img");
    let alarmSpan = document.createElement("span");
    let sizeSpan = document.createElement("span");
    let okButton = document.createElement("button");
    background.id = "blackBackground";
    errorBackground.id = "errorBackground";
    closeIMG.src = "/img/IcoPopupClose.svg";
    alarmSpan.innerText =
        "이미지 용량이 너무 커서(1MB 초과) 업로드 할 수 없어요.";
    sizeSpan.innerText = "(해당 파일의 용량은" + size + "mb 입니다.)";
    okButton.innerText = "확인";
    sizeSpan.style.fontSize = "14px";
    sizeSpan.style.color = "#222";
    sizeSpan.style.marginTop = "1%";
    okButton.addEventListener("click", function () {
        this.parentNode.remove();
        document.querySelector("#blackBackground").remove();
        document.body.style.removeProperty("overflow");
    });
    closeIMG.addEventListener("click", function () {
        this.parentNode.remove();
        document.querySelector("#blackBackground").remove();
        document.body.style.removeProperty("overflow");
    });
    document.body.appendChild(background);
    document.body.appendChild(errorBackground);
    errorBackground.appendChild(closeIMG);
    errorBackground.appendChild(alarmSpan);
    errorBackground.appendChild(sizeSpan);
    errorBackground.appendChild(okButton);
}

chrome.runtime.onMessage.addListener(() => {
    if (!document.querySelector("#executed")) {
        isLoad();
        document.body.appendChild(executed); // 가장 먼저 급한 불을 끕니다
        console.log("%c파스타 켜짐", "font-size: 50px");
    }
});

if (location.href.startsWith("https://playentry.org/community/entrystory")) {
    isLoad();
    document.body.appendChild(executed); // 가장 먼저 급한 불을 끕니다
    console.log("%c파스타 켜짐", "font-size: 50px");
}
