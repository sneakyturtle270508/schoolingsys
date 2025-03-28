document.addEventListener("DOMContentLoaded", function () {
    const header = document.getElementById("headerjs");

    header.innerHTML = `
        <style>
            /* Nullstiller margin og padding for hele siden */
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
            }

            /* Header Styling */
            header {
                position: fixed; /* Fester headeren til toppen */
                top: 0;
                left: 0;
                width: 100vw; /* Full skjermbredde */
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 15px 0;
                background-color: #f5f2eb; /* Lys beige */
                border-bottom: 2px solid #ccc;
                z-index: 1000; /* Sørger for at headeren er over alt annet */
            }

            nav {
                width: 100%;
                max-width: none; /* Fjerner maks-bredde */
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 5%;
            }

            .nav-list {
                display: flex;
                gap: 20px;
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .nav-list li {
                display: inline;
            }

            .nav-list a {
                text-decoration: none;
                color: #333;
                font-size: 16px;
                font-weight: bold;
                padding: 10px 15px;
                transition: color 0.3s ease;
            }

            .nav-list a:hover {
                color: #357ABD;
            }

            figure {
                margin: 0;
            }

            .logo img {
                height: 50px;
            }

            /* Hindrer at innholdet skjules bak header */
            main {
                margin-top: 80px; /* Juster margin for å unngå at innhold skjules bak header */
                padding: 20px;
            }

            /* Juster også content padding for å gi plass til header */
            .content {
                padding-top: 20px;
            }
        </style>

        <nav>
            <figure class="logo">
                <img src="your-logo.png" alt="Skolens logo">
            </figure>
            <ul class="nav-list">
                <li><a href="index.html">Hjem</a></li>
                <li><a href="#">Utforsk</a></li>
                <li><a href="#">Kontakt oss</a></li>
            </ul>
        </nav>
    `;

    // Legger til header i starten av <body>
    this.getElementById("headerjs").insertAdjacentElement("afterbegin", header);
});

function updateCopyright() {
    const currentYear = new Date().getFullYear();
    document.querySelector('.c-year').textContent = currentYear;
}

// Call the function to update the copyright year when the page loads
window.onload = updateCopyright;
