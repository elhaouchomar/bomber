

class eventmanager {
  constructor() {
    this.handlers = {
      click: [],
      dblclick: [],
      change: [],
      keydown: [],
      blur: [],
      hashchange: []

    };

    this.lastvals = new Map();
    this.inputs = new Set();

    this.lastclick = 0;
    this.clicktimeout = null;
    this.delayfordbclick = 300;

    this.overrideHandlers();
    this.startChangePolling();
    this.observeInputChanges();
    this.startKeyListener();
    this.bluuur();
    this.hashch();

  }



  hashch() {

    window.onhashchange = (e) => {
      this.trigger('hashchange', e)
    }
  }

  bluuur() {
    window.onblur = (e) => {
      this.trigger('blur', e);
    };
  }


  addevent(eventType, selorhand, handler) {
    if (!this.handlers[eventType]) return;
    if (typeof selorhand === 'function') {
      this.delevent(eventType, null, selorhand);
      this.handlers[eventType].push({
        selector: null,
        handler: selorhand
      });
    }
    else if (typeof handler === 'function') {
      this.delevent(eventType, selorhand, handler);
      this.handlers[eventType].push({
        selector: selorhand,
        handler: handler
      });
    }
  }

  delevent(eventType, selector, handler) {
    if (!this.handlers[eventType]) return;
    this.handlers[eventType] = this.handlers[eventType].filter(
      (h) => h.selector !== selector || h.handler.toString() !== handler.toString()
    );
  }
  clearevent() {
    this.handlers = {
      click: [],
      dblclick: [],
      change: [],
      keydown: [],
      blur: [],
      hashchange: []
    }
  }

  trigger(type, e) {
    if (!this.handlers[type]) return;
    for (const { selector, handler } of this.handlers[type]) {
    
        if (!selector) {
          handler(e);
        }
        else if (e.target.matches(selector)) {
          handler(e);
        }
     
    }
  }


  overrideHandlers() {
    const originalClick = document.onclick;

    document.onclick = (e) => {
      if (typeof originalClick === 'function') originalClick(e);
      const now = Date.now();
      if (now - this.lastclick < this.delayfordbclick && !this.handlers['click'].map(handler => handler.selector).filter(sel => sel !== null && sel !== "").some(sel => e.target.matches(sel))) {
        clearTimeout(this.clicktimeout);
        this.trigger('dblclick', e);
        this.lastclick = 0;
      } else {
        this.lastclick = now;
        this.clicktimeout = setTimeout(() => {
          this.trigger('click', e);

          this.lastclick = 0;

        }, this.delayfordbclick);
      }
    };
  }

  startKeyListener() {
    const thekeydown = document.onkeydown;
    document.onkeydown = (e) => {
      if (typeof thekeydown === 'function') thekeydown(e);
      this.trigger('keydown', e);
    };
  }

  startChangePolling() {
    setInterval(() => {
      for (const input of this.inputs) {
        const oldState = this.lastvals.get(input);
        let currentValue, currentChecked;

        if (input.type === 'checkbox' || input.type === 'radio') {
          currentChecked = input.checked;
          if (oldState?.checked !== currentChecked) {
            this.lastvals.set(input, { checked: currentChecked });
            this.trigger('change', { target: input, checked: currentChecked });
          }
        } else {
          currentValue = input.value;
          if (oldState?.value !== currentValue) {
            this.lastvals.set(input, { value: currentValue });
            this.trigger('change', { target: input, value: currentValue });
          }
        }
      }
    }, 200);
  }

  observeInputChanges() {
    const addInputs = (root) => {
      const found = root.querySelectorAll('input, textarea, select');
      for (const input of found) {
        this.inputs.add(input);
        if (input.type === 'checkbox' || input.type === 'radio') {
          this.lastvals.set(input, { checked: input.checked });
        } else {
          this.lastvals.set(input, { value: input.value });
        }
      }
    };

    addInputs(document.body);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) {
            if (node.matches('input, textarea, select')) {
              this.inputs.add(node);
              if (node.type === 'checkbox' || node.type === 'radio') {
                this.lastvals.set(node, { checked: node.checked });
              } else {
                this.lastvals.set(node, { value: node.value });
              }
            } else {
              addInputs(node);
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
}

export const eventManager = new eventmanager();