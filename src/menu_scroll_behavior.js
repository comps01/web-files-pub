(function () {
  // Handle mobile menu scroll behavior
  const body = document.body;
  const menuButton = document.querySelector('.w-nav-button');

  if (menuButton) {
    const menuObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const menuIsOpen = mutation.target.classList.contains('w--open');
          body.style.overflow = menuIsOpen ? 'hidden' : 'auto';
        }
      });
    });
    menuObserver.observe(menuButton, { attributes: true });
  }
})();