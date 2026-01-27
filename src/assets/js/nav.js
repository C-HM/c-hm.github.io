document.addEventListener("DOMContentLoaded", function () {
    const navPlaceholder = document.getElementById("nav-placeholder");
    if (!navPlaceholder) return;

    // Determine if we are in a subfolder (simple check: if current path is not root index)
    // We assume the structure is flat depth-wise (src/ROOT vs src/SUBFOLDER/PAGE)
    // If we are in 'src/index.html', prefix is empty.
    // If we are in 'src/resto/index.html', prefix is '../'.
    // If we are in 'src/resto/restaurant.html', prefix is '../../'.
    // If we are in 'src/resto/bar.html', prefix is '../../'.
    // If we are in 'src/resto/tearoom.html', prefix is '../../'.
    // If we are in 'src/chambres/index.html', prefix is '../../'.
    // If we are in 'src/chambres/tarifs.html', prefix is '../../'.
    // If we are in 'src/eco/index.html', prefix is '../../'.
    // If we are in 'src/contact/index.html', prefix is '../../'.
    // A robust way for this specific project structure:
    // Check if we are at the top level (index.html is the only one)
    const path = window.location.pathname;
    let prefix = "../"; // Default for subfolders

    // Check if we are in the root folder.
    // This logic depends on the file structure. 
    // If the file is 'src/index.html' locally, it might end with '/src/index.html'
    // If we are in 'src/resto/index.html', it ends with '/src/resto/index.html'

    if (path.endsWith("/src/index.html") || path.endsWith("/src/") || path.endsWith("LaResidence/src/index.html")) {
        prefix = "";
    } else if (path.split("/").pop() === "index.html" && !path.includes("/src/index.html")) {
        // This handles subfolder index files like /src/resto/index.html
        prefix = "../";
    } else if (!path.includes("/")) {
        // Edge case for root if served differently
        prefix = "";
    }

    // Define Menu Structure
    const menuItems = [
        { name: "Accueil", link: "index.html", exact: true },
        {
            name: "Resto Spa",
            link: "resto/index.html",
            dropdown: [
                { name: "Resto", link: "resto/restaurant.html" },
                { name: "Bar", link: "resto/bar.html" },
                { name: "The Tea Room", link: "resto/tearoom.html" }
            ]
        },
        { name: "Nos Chambres", link: "chambres/index.html" },
        { name: "Tarifs", link: "chambres/tarifs.html" },
        { name: "Eco", link: "eco/index.html" },
        { name: "Contact", link: "contact/index.html", class: "contact-link" }
    ];

    let navHTML = `
    <nav class="main-nav">
        <ul class="nav-links">
    `;

    menuItems.forEach(item => {
        let activeClass = "";
        let fullLink = prefix + item.link;

        // Robust active check
        // item.link is relative to root (e.g., "index.html", "resto/index.html")
        // path is the full pathname (e.g., "/src/index.html", "/src/resto/index.html")

        let pathName = path.replace(/\\/g, '/'); // Ensure forward slashes

        // Check for Root "Accueil"
        if (item.link === "index.html") {
            if (pathName.endsWith("/src/index.html") || pathName.endsWith("/LaResidence/index.html") || pathName === "/index.html" || pathName === "/") {
                // Ensure we are NOT in a subfolder with index.html (like resto/index.html)
                // The easiest way distinguishing root index from others is context
                // But since 'path' is just the filename in some servers, we must be careful.
                // Strategy: Check if the path contains any other known top-level folders? 
                // Better strategy: Check if the path ends with specific string AND the length matches reasonable root expectations OR explicit exclusion.

                // if path ends with "index.html" AND does NOT end with "resto/index.html" etc.
                const subfolders = ["resto/index.html", "chambres/index.html", "eco/index.html", "contact/index.html"];
                const isSubfolder = subfolders.some(sub => pathName.endsWith(sub));

                if (!isSubfolder) {
                    activeClass = "active";
                }
            }
        }
        // Check for other specific pages
        else if (pathName.endsWith(item.link)) {
            activeClass = "active";
        }

        let listClass = "";
        if (item.dropdown) listClass = "dropdown";

        navHTML += `<li class="${listClass}">`;

        navHTML += `<a href="${fullLink}" class="${item.class || ""} ${activeClass}">${item.name}</a>`;

        if (item.dropdown) {
            navHTML += `<div class="dropdown-content">`;
            item.dropdown.forEach(subItem => {
                navHTML += `<a href="${prefix + subItem.link}">${subItem.name}</a>`;
            });
            navHTML += `</div>`;
        }

        navHTML += `</li>`;
    });

    navHTML += `
        </ul>
    </nav>
    `;

    navPlaceholder.innerHTML = navHTML;
});
