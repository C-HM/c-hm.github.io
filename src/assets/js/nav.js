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

        // Simple active check
        if (path.endsWith(item.link)) {
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
