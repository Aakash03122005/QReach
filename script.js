document.addEventListener('DOMContentLoaded', () => {
    const helpIcon = document.getElementById('helpIcon');
    const contactInfoModal = document.getElementById('contactInfoModal');
    const closeButton = contactInfoModal.querySelector('.close-button');

    const leftArrow = document.getElementById('leftArrow');
    const rightArrow = document.getElementById('rightArrow');

    // Excel Import elements
    const excelFileInput = document.getElementById('excelFileInput');
    const importExcelBtn = document.getElementById('importExcelBtn');
    const excelTableDisplay = document.getElementById('excelTableDisplay');

    const pages = [
        'home-page',
        'import-database-page',
        'dashboard-page'
    ];
    let currentPageIndex = 0; // Start at the Home page

    const navLinks = document.querySelectorAll('.nav-menu a');
    const activeUnderline = document.querySelector('.active-underline');

    // Get specific navigation links for direct access
    const homeNavLink = navLinks[0]; // 'Home' is the first link (index 0)
    const importDBNavLink = navLinks[1]; // 'Import Database' is the second link (index 1)
    const dashboardNavLink = navLinks[2]; // 'Dashboard' is the third link (index 2)

    function updateUnderlinePosition() {
        const currentNavLink = navLinks[currentPageIndex];
        if (currentNavLink) {
            // Position the underline relative to the header, so we need the offset from the navbar's left edge
            const navBar = document.querySelector('.navbar');
            const navBarOffsetLeft = navBar.getBoundingClientRect().left;

            const linkRect = currentNavLink.getBoundingClientRect();
            activeUnderline.style.width = `${linkRect.width}px`;
            activeUnderline.style.left = `${linkRect.left - navBarOffsetLeft}px`;
        }
    }

    function showPage(index) {
        // Update content pages
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pages[index]).classList.add('active');

        // Update active class on nav links
        navLinks.forEach((link, i) => {
            if (i === index) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        updateUnderlinePosition(); // Update underline position after page change
    }

    // Initial page load
    showPage(currentPageIndex);

    // Arrow navigation
    rightArrow.addEventListener('click', () => {
        currentPageIndex = (currentPageIndex + 1) % pages.length;
        showPage(currentPageIndex);
    });

    leftArrow.addEventListener('click', () => {
        currentPageIndex = (currentPageIndex - 1 + pages.length) % pages.length;
        showPage(currentPageIndex);
    });

    // Direct navigation for 'Import Database' link
    importDBNavLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        currentPageIndex = 1; // Set to the index of 'import-database-page'
        showPage(currentPageIndex);
    });

    // Direct navigation for 'Home' link
    homeNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        currentPageIndex = 0; // Set to the index of 'home-page'
        showPage(currentPageIndex);
    });

    // Direct navigation for 'Dashboard' link
    dashboardNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        currentPageIndex = 2; // Set to the index of 'dashboard-page'
        showPage(currentPageIndex);
    });

    // Excel Import Functionality
    importExcelBtn.addEventListener('click', () => {
        excelFileInput.click(); // Trigger the hidden file input click
    });

    excelFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Assume the first sheet is the one we want
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Convert sheet to HTML table
                const html = XLSX.utils.sheet_to_html(worksheet);
                excelTableDisplay.innerHTML = html;

                // Apply table styling class (optional, but good practice)
                const table = excelTableDisplay.querySelector('table');
                if (table) {
                    table.classList.add('imported-excel-table'); // Add a class for specific styling if needed
                }
            };

            reader.readAsArrayBuffer(file);
        }
    });

    // Help icon click handler to show modal
    helpIcon.addEventListener('click', () => {
        contactInfoModal.style.display = 'flex'; // Use flex to center it
    });

    // Close button click handler to hide modal
    closeButton.addEventListener('click', () => {
        contactInfoModal.style.display = 'none';
    });

    // Click outside modal content to hide modal
    contactInfoModal.addEventListener('click', (event) => {
        if (event.target === contactInfoModal) {
            contactInfoModal.style.display = 'none';
        }
    });

    // Update underline position on window resize
    window.addEventListener('resize', updateUnderlinePosition);
}); 