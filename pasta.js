let pressCtrl = false;
let isLoading = false;

document.addEventListener("keydown", (e) => {
    if (!pressCtrl) {
        if (e.ctrlKey) pressCtrl = true;
    }
});
document.addEventListener("keyup", () => {
    pressCtrl = false;
});

function uploadImage(textPos) {
    console.log(pressCtrl);
    if (!pressCtrl) {
        const i = document.createElement("input");
        i.type = "file";
        i.click();
        i.addEventListener("change", () => {
            const form = new FormData();
            form.append("file", i.files[0]);
            form.append("type", "notcompress");
            fetch("https://playentry.org/rest/picture", {
                method: "POST",
                body: form,
            })
                .then((r) => r.json())
                .then((d) => {
                    textPos.value += `${
                        !!textPos.value ? " " : ""
                    }playentry.org//uploads/${d.filename.slice(
                        0,
                        2
                    )}/${d.filename.slice(2, 4)}/${d.filename}.${
                        d.metaData.format
                    }`;
                    textPos.style.height = textPos.scrollHeight + "px";
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
                    .then((d) => {
                        textPos.value += `${
                            !!textPos.value ? " " : ""
                        }playentry.org//uploads/${d.filename.slice(
                            0,
                            2
                        )}/${d.filename.slice(2, 4)}/${d.filename}.${
                            d.metaData.format
                        }`;
                        textPos.style.height = textPos.scrollHeight + "px";
                    });
            }
        }
        ImageUp();
    }
}

function blockButton(target, isblock = false) {
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

function LinkToImage() {
    document.querySelectorAll("a:not(.NoFind)").forEach((i) => {
        //     if (
        //         /^https:\/\/playentry.org\/redirect\?external=https:\/\/ifh.cc\/(g\/|i-|v-).*$/g.test(
        //             i.href
        //         )
        //     ) {
        //         i.className = "NoFind";
        //         i.href
        //             .slice(57)
        //             .split(".")
        //             .forEach((j) => {
        //                 if (j.length == "6") {
        //                     if (i.innerHTML.indexOf("img") == -1) i.innerHTML = "";
        //                     i.innerHTML += `<div><img style="outline: 1px solid red;" class="realImage" onerror="this.parentNode.innerHTML = '<video style=&quot;outline: 1px solid red;&quot; class=&quot;realImage&quot; controls><source src=&quot;https://ifh.cc/g/${j}&quot;></video>'" src="https://ifh.cc/g/${j}"></img></div>`;
        //                     if (
        //                         localStorage.getItem(
        //                             `pastaUser_${i.parentNode.parentNode.firstChild.href.slice(
        //                                 "30"
        //                             )}`
        //                         ) != null
        //                     ) {
        //                         i.href = `chrome-extension://${chrome.runtime.id}/blockImage.png`;
        //                         i.innerHTML = `<div><img style="outline: 1px solid black;" class="realImage" src="chrome-extension://${chrome.runtime.id}/blockImage.png"></img></div>`;
        //                         blockButton(i, true);
        //                     } else {
        //                         blockButton(i);
        //                     }
        //                 }
        //             });
        //     } ifh 지원 종료, 단 부활 가능성이 있기 떄문에 임시로 주성 사용
        if (
            /^http:\/\/playentry.org\/\/uploads\/.{2}\/.{2}\/.*\..*$/i.test(
                i.href
            )
        ) {
            i.className = "NoFind";
            i.innerHTML = `<div><a class="NoFind" href="${
                i.href
            }"><img style="outline: 1px solid aqua;" class="realImage" onerror="this.outerHTML = '<video style=&quot;outline: 1px solid aqua;&quot; class=&quot;realImage&quot; controls src=&quot;${i.href.replace(
                "http://",
                "https://"
            )}&quot; onloadeddata=&quot;this.load();this.onloadeddata=undefined;&quot;></video>'" src="${i.href.replace(
                "http://",
                "https://"
            )}"> </img></a></div>`;
            if (
                localStorage.getItem(
                    `pastaUser_${i.parentNode.parentNode.firstChild.href.slice(
                        "30"
                    )}`
                ) != null
            ) {
                i.href = `chrome-extension://${chrome.runtime.id}/blockImage.png`;
                i.innerHTML = `<div><a href="${i.href}" class="NoFind"><img style="outline: 1px solid black;" class="realImage" src="chrome-extension://${chrome.runtime.id}/blockImage.png"></img></a></div>`;
                blockButton(i, true);
            } else {
                blockButton(i);
            }
            i.removeAttribute("href");
        }
    });
}

function CreateUploadBuutton() {
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

function loadEvent() {
    try {
        CreateUploadBuutton();
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
    document.querySelectorAll('li > a[role="button"]').forEach((i) => {
        // 케이스 문 없이 만드는 쌈@뽕한 코딩
        if (i.innerText == "정확도순") {
            i.addEventListener("click", () =>
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
        if (i.innerText == "최신순") {
            i.addEventListener("click", () =>
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
        if (i.innerText == "댓글순") {
            i.addEventListener("click", () =>
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
        if (i.innerText == "좋아요순") {
            i.addEventListener("click", () =>
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
        if (i.innerText == "오늘") {
            i.addEventListener("click", () =>
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
        if (i.innerText == "최근 1주일") {
            i.addEventListener("click", () =>
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
        if (i.innerText == "최근 1개월") {
            i.addEventListener("click", () =>
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
        if (i.innerText == "최근 3개월") {
            i.addEventListener("click", () =>
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
