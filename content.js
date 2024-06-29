function main() {
    let newHtml = `
    <li data-line-height="0px">
        <div class="p-navEl" data-has-children="true" data-font-size="13" data-font-size-type="px" data-line-height="18.2px">
            <a id="ranom-content-menu" data-random-content-type="any" class="random-content p-navEl-link p-navEl-link--splitMenu" data-nav-id="randomContent">
                תוכן אקראי
                ${shouldIncludeNewBadge() ? '<span class="new-badge">חדש</span>' : ''}
            </a>
            <a data-xf-key="3" data-xf-click="menu" data-menu-pos-ref="< .p-navEl" class="p-navEl-splitTrigger" role="button" tabindex="0" aria-label="בחר באפשרות \'הרחב\'" aria-expanded="false" aria-haspopup="true"></a>
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
    </li>
    ${shouldIncludeNewBadge() ? `
    <style id="random-content-menu-style">
    .new-badge {
        background-color: #c84448; /* צבע הרקע לסימון */
        color: #ffffff; /* צבע הטקסט */
        font-size: 10px; /* גודל הטקסט */
        padding: 2px 4px; /* ריווח פנימי */
        border-radius: 3px; /* פינות מעוגלות */
        margin-left: 5px; /* רווח מצד שמאל */
        vertical-align: super; /* מיקום מעל לטקסט */
    }
    </style>` : ''}
    `;

    let previousItem = document.querySelector("#top > div.p-sectionLinks > div > div > ul > li:nth-child(2)");

    if (previousItem) {
        previousItem.insertAdjacentHTML('afterend', newHtml);
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
            let RantypeNum = Math.floor(Math.random() * Object.keys(contentTypes).length);
            type = Object.keys(contentTypes)[RantypeNum];
        }
        let = Math.floor((Math.random() * contentTypes[type]));
        return `https://tora-forum.co.il/${type}/${ranContentNum}?random=1`;
    }

    function setHref(element) {
        let type = element.getAttribute("data-random-content-type");
        element.href = randomLink(type);
    }

    function newRandomContent() {
        document.title = "מחפש תוכן אקראי אחר...";
        let contentType = url.match(/forums|threads|posts|members|ams|attachments/)[0];
        document.location = randomLink(contentType);
    }

    function checkTitleAndURL() {
        if (url.includes("random=1") && document.title.includes('אופס! נתקלנו בבעיות. | פורום לתורה')) {
            newRandomContent();
            return;
        }

        if (url.includes("member")) {
            let elements = document.querySelectorAll("dl > dd > a");
            if (elements.length > 0 && parseInt(elements[0].innerText) < 3) {
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

    document.querySelectorAll(".random-content").forEach(e => setHref(e));

    document.querySelectorAll(".random-content").forEach(e => {
        e.addEventListener("mousedown", (event) => {
            if (event.button === 1) {
                setHref(e);
            }
        });
    });

    document.getElementById('ranom-content-menu').addEventListener('click', updateUsageCount);


    function updateUsageCount() {
        let usageCount = getCookie('randomContentUsageCount') || 0;

        // המרת הערך למספר והוספת שימוש
        usageCount = parseInt(usageCount) + 1;

        // עדכן את הערך בעוגיה
        setCookie('randomContentUsageCount', usageCount, 30); // שמירה ל-30 ימים

        // בדוק אם המשתמש כבר השתמש 5 פעמים או יותר
        if (usageCount >= 5) {
            hideNewBadge();
        }
    }

    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function shouldIncludeNewBadge() {
        let usageCount = getCookie('randomContentUsageCount') || 0;
        return usageCount < 5;
    }

    function hideNewBadge() {
        // פונקציה להסתרת הסימון 'חדש'
        let newBadge = document.querySelector('.new-badge');
        if (newBadge) {
            newBadge.style.display = 'none';
        }
    }
}
addEventListener('load', main);
