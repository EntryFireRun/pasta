function createLinkButton(realThis, realJ) {
    realThis.parentNode.removeAttribute("href");
    const linkButton = document.createElement("a");
    linkButton.className = "videoLink NoFind";
    linkButton.innerText = "바로가기";
    linkButton.href = `https://bloupla.net/img/?=${realJ}`;
    realThis.before(linkButton);
    realThis.outerHTML = `<video controls style='outline: 1px solid red;' class='realImage' src='https://firebasestorage.googleapis.com/v0/b/imgshare-2.appspot.com/o/${realJ}?alt=media'></video>`;
}

function createLinkButtonEntry(realThis, realJ) {
    realThis.parentNode.removeAttribute("href");
    realThis.parentNode.innerHTML = `<div><a class="videoLink NoFind" href=${realJ}>바로가기</a><video style="outline: 1px solid aqua;" class="realImage" controls src=${realJ.replace(
        "http://",
        "https://"
    )}></video>`;
}
