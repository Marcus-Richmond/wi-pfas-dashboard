// get theme selector
const themeSelect = document.getElementById('theme-select')

// add event listener for change
themeSelect.addEventListener('change', () => {
    // change data-theme attribute to selected theme value
    document.documentElement.dataset.theme = themeSelect.value
})