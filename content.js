function main() {    
    let newHtml = 
    `<li>
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
    let ul = document.querySelector("div.p-nav-scroller.hScroller > div > ul");
    if(ul) {
        ul.innerHTML += newHtml;
    }

    let url = document.location.href;
    const contentTypes = {
        "threads": 65136,
        "posts": 126227,
        "members": 16467,
        "ams": 385,
        "forums": 277,
        "attachments": 101488,
    };

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

    function checkTitleAndURL() {
        if (url.includes("random=1") && document.title.includes('אופס! נתקלנו בבעיות. | פורום לתורה')) {
            newRandomContent();
            return;
        }

        if (url.includes("member")) {
            let elements = document.querySelectorAll("dl > dd > a");
            if (elements.length > 0 && elements[0].innerText < 3) {
                newRandomContent();
                return;
            }
        }
    }

    // Check title initially
    checkTitleAndURL();

    // Use MutationObserver to watch for title changes
    const observer = new MutationObserver(checkTitleAndURL);
    observer.observe(document.querySelector('title'), { childList: true });

    $(".random-content").each((x, e) => setHref(e));

    document.querySelectorAll(".random-content").forEach(e => {
        e.addEventListener("mousedown", (event) => {
            if(event.button === 1) {
                setHref(e);
            }
        });
    });

}

window.addEventListener('load', main);
