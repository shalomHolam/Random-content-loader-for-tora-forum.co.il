// ==UserScript==
// @name         Jump To Random Content In Forum Letora
// @namespace    http://tampermonkey.net/
// @version      2024-06-23
// @description  
// @author       Gaviha ben Pasisa
// @match        https://tora-forum.co.il/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=co.il
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
if (document.querySelector(".p-offline-header")) {
	return;
}
let newHtml = `
<li>
	<div class="p-navEl " data-has-children="true" style="user-select: none; pointer-events: auto;">
		<a id="ranom-content-menu" data-random-content-type="any" class="random-content p-navEl-link p-navEl-link--splitMenu ">תוכן אקראי</a>
		<a data-xf-key="3" data-xf-click="menu" data-menu-pos-ref="< .p-navEl" class="p-navEl-splitTrigger" role="button" tabindex="0" aria-label="בחר באפשרות 'הרחב'" aria-expanded="false" aria-haspopup="true"></a>
		<div class="menu menu--structural" data-menu="menu" aria-hidden="true">
			<div class="menu-content">
				<a data-random-content-type="threads" class="random-content menu-linkRow u-indentDepth0 js-offCanvasCopy">נושא</a>
				<a data-random-content-type="posts" class="random-content menu-linkRow u-indentDepth0 js-offCanvasCopy">הודעה</a>
				<a data-random-content-type="ams" class="random-content menu-linkRow u-indentDepth0 js-offCanvasCopy">מאמר</a>
                <a data-random-content-type="attachments" class="random-content menu-linkRow u-indentDepth0 js-offCanvasCopy">קובץ מצורף</a>
                <hr class="menu-separator">
                <a data-random-content-type="forums" class="random-content menu-linkRow u-indentDepth0 js-offCanvasCopy">פורום אקראי</a>
                <a data-random-content-type="members" class="random-content menu-linkRow u-indentDepth0 js-offCanvasCopy">חבר אקראי (3+ הודעות)</a>
			</div>
		</div>
	</div>
</li>`;

document.querySelector("ul").innerHTML += newHtml;
let url = document.location.href;
const contentTypes = {
    "threads": 65136,
    "posts": 126227,
    "members": 16467,
    "ams": 385,
    "forums": 277,
    "attachments": 101488,
}

if (url.includes("random=1") && document.title === 'אופס! נתקלנו בבעיות. | פורום לתורה') {
    newRandomContent();
    retrun;
}

if (url.includes("member") && $("dl > dd > a")[0].innerText < 3) {
    newRandomContent();
    retrun;
}

function randomLink(type) {
    if (type === "any") {
        let RantypeNum = Math.floor(Math.random() * 5);
        type = Object.keys(contentTypes)[RantypeNum];
    }
    let ranContentNum = Math.floor((Math.random() * contentTypes[type]));
	return `https://tora-forum.co.il/${type}/${ranContentNum}?random=${1}`;
}

function setHref(element) {
    let type = element.getAttribute("data-random-content-type");
    element.href = randomLink(type);
}

function newRandomContent() {
    document.title = "מחפש תוכן אקראי אחר...";
    let contentType = url.match(/forums|threads|posts|members|ams|attachments/g)[0];
    document.location = randomLink(contentType);
}

$(".random-content").each((x,e)=> setHref(e));

document.querySelectorAll(".random-content").forEach(e => {
    e.addEventListener("mousedown", (event) => {
        if(event.button === 1) {
            setHref(e);
        }
    });
});
})();
