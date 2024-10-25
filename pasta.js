let pressCtrl = false;

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
                .then((r) => r.json())
                .then((d) => {
                    textarea.value += `${
                        !!textarea.value ? " " : ""
                    }playentry.org//uploads/${d.filename.slice(
                        0,
                        2
                    )}/${d.filename.slice(2, 4)}/${d.filename}.${
                        d.metaData.format
                    }`;
                    textarea.style.height = textarea.scrollHeight + "px";
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
                    .then((r) => r.json())
                    .then((data) => {
                        textarea.value += `${
                            !!textarea.value ? " " : ""
                        }playentry.org//uploads/${data.filename.slice(
                            0,
                            2
                        )}/${data.filename.slice(2, 4)}/${data.filename}.${
                            data.metaData.format
                        }`;
                        textarea.style.height = textarea.scrollHeight + "px";
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
                /^http:\/\/playentry.org\/\/uploads\/.{2}\/.{2}\/.*\..*$/i.test(
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
function CreateUploadButton() {
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
            loadEvent();
            console.log(document.querySelector("button"));
        }
    }
}

/**
 * 각종 이벤트를 추가하는 함수
 */
function loadEvent() {
    try {
        CreateUploadButton();
    } catch {
        console.log("업로드 버튼을 만들 수 없는 환경.");
    }
    LinkToImage();
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
    document
        .querySelectorAll('li > a[role="button"]')
        .forEach((buttonElement) => {
            // 케이스 문 없이 만드는 쌈@뽕한 코딩
            if (buttonElement.innerText == "정확도순") {
                buttonElement.addEventListener("click", () =>
                    orderV(
                        0,
                        `https://playentry.org/community/entrystory/list${
                            location.search.split("sort")[0]
                        }sort${
                            location.search.split("sort")[1].split("=")[0]
                        }=${"score"}${
                            location.search.split("sort")[1].split("&")[1] ==
                            undefined
                                ? ""
                                : "&" +
                                  location.search.split("sort")[1].split("&")[1]
                        }`
                    )
                );
            }
            if (buttonElement.innerText == "최신순") {
                buttonElement.addEventListener("click", () =>
                    orderV(
                        0,
                        `https://playentry.org/community/entrystory/list${
                            location.search.split("sort")[0]
                        }sort${
                            location.search.split("sort")[1].split("=")[0]
                        }=${"created"}${
                            location.search.split("sort")[1].split("&")[1] ==
                            undefined
                                ? ""
                                : "&" +
                                  location.search.split("sort")[1].split("&")[1]
                        }`
                    )
                );
            }
            // if (i.innerText == '조회순) `${location.search.split('sort')[0]}sort${location.search.split('sort')[1].split('=')[0]}=${'visit'}${location.search.split('sort')[1].split('&')[1] == undefined ? "" : '&' + location.search.split('sort')[1].split('&')[1]}`
            if (buttonElement.innerText == "댓글순") {
                buttonElement.addEventListener("click", () =>
                    orderV(
                        0,
                        `https://playentry.org/community/entrystory/list${
                            location.search.split("sort")[0]
                        }sort${
                            location.search.split("sort")[1].split("=")[0]
                        }=${"commentsLength"}${
                            location.search.split("sort")[1].split("&")[1] ==
                            undefined
                                ? ""
                                : "&" +
                                  location.search.split("sort")[1].split("&")[1]
                        }`
                    )
                );
            }
            if (buttonElement.innerText == "좋아요순") {
                buttonElement.addEventListener("click", () =>
                    orderV(
                        0,
                        `https://playentry.org/community/entrystory/list${
                            location.search.split("sort")[0]
                        }sort${
                            location.search.split("sort")[1].split("=")[0]
                        }=${"likesLength"}${
                            location.search.split("sort")[1].split("&")[1] ==
                            undefined
                                ? ""
                                : "&" +
                                  location.search.split("sort")[1].split("&")[1]
                        }`
                    )
                );
            }
            if (buttonElement.innerText == "오늘") {
                buttonElement.addEventListener("click", () =>
                    location.replace(
                        `https://playentry.org/community/entrystory/list${
                            location.search.split("term")[0]
                        }term${
                            location.search.split("term")[1].split("=")[0]
                        }=${"today"}&${
                            location.search.split("term")[1].split("&")[1]
                        }`
                    )
                );
            }
            if (buttonElement.innerText == "최근 1주일") {
                buttonElement.addEventListener("click", () =>
                    location.replace(
                        `https://playentry.org/community/entrystory/list${
                            location.search.split("term")[0]
                        }term${
                            location.search.split("term")[1].split("=")[0]
                        }=${"week"}&${
                            location.search.split("term")[1].split("&")[1]
                        }`
                    )
                );
            }
            if (buttonElement.innerText == "최근 1개월") {
                buttonElement.addEventListener("click", () =>
                    location.replace(
                        `https://playentry.org/community/entrystory/list${
                            location.search.split("term")[0]
                        }term${
                            location.search.split("term")[1].split("=")[0]
                        }=${"month"}&${
                            location.search.split("term")[1].split("&")[1]
                        }`
                    )
                );
            }
            if (buttonElement.innerText == "최근 3개월") {
                buttonElement.addEventListener("click", () =>
                    location.replace(
                        `https://playentry.org/community/entrystory/list${
                            location.search.split("term")[0]
                        }term${
                            location.search.split("term")[1].split("=")[0]
                        }=${"month"}&${
                            location.search.split("term")[1].split("&")[1]
                        }``https://playentry.org/community/entrystory/list${
                            location.search.split("term")[0]
                        }term${
                            location.search.split("term")[1].split("=")[0]
                        }=${"quarter"}&${
                            location.search.split("term")[1].split("&")[1]
                        }`
                    )
                );
            }
        });
}

function orderV(count, link) {
    console.log(count);
    if (count != 15) {
        if (link == location.href) {
            isLoad();
        } else {
            setTimeout(() => {
                orderV(count + 1, link);
            }, 100);
        }
    }
}

function waitLoad(count, oldLink) {
    console.log(oldLink);
    if (
        count != 15 &&
        /^https:\/\/(ncc.www)?\.?playentry.org\/community\/entrystory\/list\?.*[^query=.*]$/g.test(
            oldLink
        ) == false
    ) {
        if (
            /^https:\/\/(ncc.www)?\.?playentry.org\/community\/entrystory\/list\?.*[^query=.*]$/g.test(
                location.href
            )
        ) {
            console.log("test");
            isLoad();
        } else {
            setTimeout(() => {
                waitLoad(count + 1, oldLink);
            }, 100);
        }
    }
}

if (
    /^https:\/\/(ncc.www)?\.?playentry.org\/community\/entrystory\/list\?.*$/g.test(
        location.href
    )
) {
    isLoad();
}

document
    .querySelectorAll("header > div > div > div > ul > li > a")
    .forEach((i) => {
        if (i.innerText == "엔트리 이야기" && i.className != "anjffhwjdgkwl") {
            i.className = "anjffhwjdgkwl";
            i.addEventListener("click", () => {
                waitLoad(0, location.href);
            });
        }
    });

window.addEventListener("popstate", () => {
    console.log(location.href);
    waitLoad(0, location.href);
});

console.log("%c파스타 켜짐", "font-size: 100px");
