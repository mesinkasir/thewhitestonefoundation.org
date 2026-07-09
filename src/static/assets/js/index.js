(() => {
  const ready = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  ready(() => {
    const nav = document.querySelector('[data-site-nav]');
    if (nav) {
      const setScrolled = () => nav.classList.toggle('is-scrolled', window.scrollY > 60);
      setScrolled();
      window.addEventListener('scroll', setScrolled, { passive: true });
    }

    const toggle = document.querySelector('[data-nav-toggle]');
    const navPopover = document.getElementById('nav-menu');
    const searchTrigger = document.querySelector('pagefind-modal-trigger.search-icon-button');

    // Lazy-load the Pagefind search UI off the critical render path.
    let pagefindRequested = false;
    const loadPagefind = () => {
      if (pagefindRequested) return;
      pagefindRequested = true;
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = '/pagefind/pagefind-component-ui.css';
      document.head.appendChild(css);
      const js = document.createElement('script');
      js.type = 'module';
      js.src = '/pagefind/pagefind-component-ui.js';
      document.head.appendChild(js);
    };
    // Load when the browser is idle, and eagerly on first search intent (whichever comes first).
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadPagefind, { timeout: 4000 });
    } else {
      window.setTimeout(loadPagefind, 1500);
    }
    document.querySelectorAll('pagefind-modal-trigger').forEach((el) => {
      el.addEventListener('pointerenter', loadPagefind, { once: true });
      el.addEventListener('focusin', loadPagefind, { once: true });
    });

    const hydrateEmailLinks = () => {
      document.querySelectorAll('[data-email-link][data-email]').forEach((link) => {
        if (link.dataset.emailLoaded) return;
        try {
          const email = window.atob(link.dataset.email || '');
          link.href = `mailto:${email}`;
          const label = link.querySelector('[data-email-text]');
          if (label) label.textContent = email;
          link.dataset.emailLoaded = 'true';
        } catch {
          link.removeAttribute('href');
        }
      });
    };

    document.querySelectorAll('[data-email-link]').forEach((link) => {
      link.addEventListener('focus', hydrateEmailLinks, { once: true });
      link.addEventListener('pointerenter', hydrateEmailLinks, { once: true });
    });

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(hydrateEmailLinks);
    } else {
      window.setTimeout(hydrateEmailLinks, 500);
    }

    const isEditableTarget = (target) => {
      if (!target || !(target instanceof HTMLElement)) {
        return false;
      }

      const tag = target.tagName;
      return (
        target.isContentEditable ||
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT'
      );
    };

    document.addEventListener('keydown', (event) => {
      const isSearchShortcut =
        (event.metaKey || event.ctrlKey) &&
        !event.shiftKey &&
        !event.altKey &&
        event.key.toLowerCase() === 'k';

      if (!isSearchShortcut || isEditableTarget(event.target)) {
        return;
      }

      event.preventDefault();
      loadPagefind();
      searchTrigger?.click();
    });

    // Native popover handles open/close/Escape/light-dismiss; JS only swaps the icon.
    if (toggle && navPopover) {
      const openLabel = toggle.querySelector('.nav-toggle__open');
      const closeLabel = toggle.querySelector('.nav-toggle__close');
      navPopover.addEventListener('toggle', (event) => {
        const isOpen = event.newState === 'open';
        if (openLabel && closeLabel) {
          openLabel.hidden = isOpen;
          closeLabel.hidden = !isOpen;
        }
      });
    }

    document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const id = (link.getAttribute('href') || '').replace(/^\/?#/, '');
        const target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${id}`);
      });
    });

    document.querySelectorAll('[data-choice-group]').forEach((group) => {
      group.addEventListener('click', (event) => {
        const choice = event.target.closest('[data-choice]');
        if (!choice) return;
        group.querySelectorAll('[data-choice]').forEach((item) => item.classList.remove('is-active'));
        choice.classList.add('is-active');
      });
    });

    const revealItems = document.querySelectorAll('.reveal');
    if (revealItems.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -80px 0px' }
      );
      revealItems.forEach((item) => observer.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add('is-visible'));
    }

    const search = document.getElementById('search');
    if (search) {
      const status = document.getElementById('search-status');
      if (typeof PagefindUI === 'undefined') {
        if (status) status.hidden = false;
        return;
      }
      new PagefindUI({
        element: '#search',
        showImages: false,
        processResult: (result) => {
          const meta = result?.meta || {};
          if (meta.source_url) result.url = meta.source_url;
          if (meta.title) result.title = meta.site ? `${meta.title} | ${meta.site}` : meta.title;
          if (meta.description) result.excerpt = meta.description;
          return result;
        }
      });
    }
  });
})();
