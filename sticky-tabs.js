(() => {
  const navigationSelector = '[data-component="PH_Navigation"] [data-component="TabNav"]';
  const stickyHeaderSelector =
    '[data-component="PageHeader"][class*="StickyPullRequestHeader-module__is-stuck__"]';
  let navigation;
  let placeholder;
  let frame;

  const scheduleUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  const unfix = () => {
    navigation?.classList.remove('sticky-pr-tabs--fixed');
    placeholder?.remove();
    placeholder = undefined;
  };

  function update() {
    frame = undefined;
    const nextNavigation = document.querySelector(navigationSelector);

    if (nextNavigation !== navigation) {
      unfix();
      navigation = nextNavigation;
    }

    if (!navigation) return;

    const header = document.querySelector(stickyHeaderSelector);
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const reference = placeholder || navigation;

    if (!headerHeight || reference.getBoundingClientRect().top > headerHeight) {
      unfix();
      return;
    }

    if (!placeholder) {
      placeholder = document.createElement('div');
      navigation.before(placeholder);
    }

    const rect = reference.getBoundingClientRect();
    placeholder.style.height = `${navigation.getBoundingClientRect().height}px`;
    navigation.style.setProperty('--sticky-pr-tabs-header-height', `${headerHeight}px`);
    navigation.style.setProperty('--sticky-pr-tabs-left', `${rect.left}px`);
    navigation.classList.add('sticky-pr-tabs--fixed');
  }

  new MutationObserver(scheduleUpdate).observe(document.body, {childList: true, subtree: true});
  addEventListener('scroll', scheduleUpdate, {passive: true});
  addEventListener('resize', scheduleUpdate);
  scheduleUpdate();
})();
