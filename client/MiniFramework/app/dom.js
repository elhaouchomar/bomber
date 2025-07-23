import { eventManager } from "./events.js";

export function createElement(tag, attrs, ...childs) {
  const flatchilds = childs.flat(Infinity);

  const checkedchilds = flatchilds.filter(
    child => child != null && child !== false
  );

  return {
    tag,
    attrs: attrs || {},
    children: checkedchilds
  };
}

export function render(vdom, container) {
  while (typeof vdom === 'function') {
    vdom = vdom();
  }

  if (typeof vdom === 'string' || typeof vdom === 'number') {
    const textNode = document.createTextNode(vdom);
    if (container) container.appendChild(textNode);
    return textNode;
  }

  if (!vdom) {
    return;
  }

  const Rele = document.createElement(vdom.tag);

  // Attach __key for reconciliation if key is provided
  if (vdom.attrs?.key != null) {
    Rele.__key = vdom.attrs.key;
  }

  for (const [k, val] of Object.entries(vdom.attrs || {})) {
    if (k.startsWith('on') && typeof val === 'function') {
      const eventName = k.substring(2).toLowerCase();
      eventManager.addevent(eventName, Rele.tagName, val);
    } else if (k === 'className') {
      Rele.className = val;
    } else if (k === 'style' && typeof val === 'object') {
      Object.assign(Rele.style, val);
    } else if (k === 'checked') {
      Rele.checked = !!val;
    } else if (k === 'value') {
      Rele.value = val;
    } else {
      Rele.setAttribute(k, val);
    }
  }

  const children = Array.isArray(vdom.children) ? vdom.children : [vdom.children];
  children.forEach(child => {
    if (child !== undefined && child !== null && child !== false) {
      render(child, Rele);
    }
  });

  if (container != null) container.appendChild(Rele);
  return Rele;
}

export function diff(old, newD) {
  if (!old) return { node: newD };
  if (!newD) return { node: null };

  if (typeof old === 'string' || typeof newD === 'string') {
    if (old !== newD) {
      return { node: newD };
    }
    return { node: old };
  }

  if (old.tag !== newD.tag) {
    return { node: newD };
  }

  if (typeof newD === "function") {
    return { node: newD };
  }

  const attrPatches = {};
  const allAttrs = new Set([...Object.keys(old.attrs), ...Object.keys(newD.attrs)]);

  for (const key of allAttrs) {
    if (old.attrs[key] !== newD.attrs[key]) {
      attrPatches[key] = newD.attrs[key];
    }
  }

  const oldChildren = old.children || [];
  const newChildren = newD.children || [];

  // Check if all children have keys for keyed diffing
  const isKeyed =
    oldChildren.length > 0 &&
    oldChildren.every(c => c && c.attrs?.key != null) &&
    newChildren.length > 0 &&
    newChildren.every(c => c && c.attrs?.key != null);

  let childPatches = [];

  if (isKeyed) {
    const oldMap = new Map(oldChildren.map(c => [c.attrs.key, c]));
    const newMap = new Map(newChildren.map(c => [c.attrs.key, c]));

    const allKeys = Array.from(new Set([...oldMap.keys(), ...newMap.keys()]));
    childPatches = allKeys.map(key => diff(oldMap.get(key), newMap.get(key)));
  } else {
    const len = Math.max(oldChildren.length, newChildren.length);
    for (let i = 0; i < len; i++) {
      childPatches.push(diff(oldChildren[i], newChildren[i]));
    }
  }

  return {
    node: newD,
    attrPatches,
    childPatches
  };
}

let track = -1;

export function patch(parent, patches, index = 0) {
  if (!patches.node) {
    parent.removeChild(parent.childNodes[index]);
    return 1;
  }

  if (!parent.childNodes[index]) {
    parent.appendChild(render(patches.node, null));
    return 0;
  }

  // REPLACE NODE IF TAG CHANGED
  if (
    patches.node &&
    typeof patches.node === "object" &&
    parent.childNodes[index].nodeName.toLowerCase() !== patches.node.tag.toLowerCase()
  ) {
    const newNode = render(patches.node, null);
    parent.replaceChild(newNode, parent.childNodes[index]);
    return 0;
  }

  // Update attributes
  if (patches.attrPatches) {
    const element = parent.childNodes[index];
    for (const [k, val] of Object.entries(patches.attrPatches)) {
      if (k.startsWith('on') && typeof val === 'function') {
        eventManager.addevent(k.substring(2).toLowerCase(), element.tagName, val);
      } else if (k === 'checked') {
        element.checked = !!val;
      } else if (k === 'value') {
        element.value = val;
      } else if (val === null || val === undefined) {
        element.removeAttribute(k);
      } else {
        element.setAttribute(k, val);
      }
    }
  }

  // Handle children
  if (patches.childPatches) {
    const childNode = parent.childNodes[index];
    const patchesChildren = patches.childPatches;

    const isKeyed = patchesChildren.length > 0 && patchesChildren.every(p => p?.node?.attrs?.key != null);

    if (isKeyed) {
      const existingChildren = Array.from(childNode.childNodes);
      const keyedDOM = new Map();

      // Build current DOM map by key
      existingChildren.forEach(el => {
        if (el.__key != null) {
          keyedDOM.set(el.__key, el);
        }
      });

      // Build a new ordered list of nodes
      const newChildren = [];

      patchesChildren.forEach(patchData => {
        const key = patchData?.node?.attrs?.key;
        if (!key) return;

        const existingEl = keyedDOM.get(key);
        if (existingEl) {
          const existingIndex = Array.from(childNode.childNodes).indexOf(existingEl);
          patch(childNode, patchData, existingIndex);
          keyedDOM.delete(key);
          newChildren.push(existingEl);
        } else {
          const newEl = render(patchData.node, null);
          newEl.__key = key;
          newChildren.push(newEl);
        }
      });

      // Reorder DOM to match newChildren
      newChildren.forEach((el, i) => {
        const current = childNode.childNodes[i];
        if (current !== el) {
          childNode.insertBefore(el, current || null);
        }
      });

      // Remove any leftover DOM nodes not present in newChildren
      for (const leftover of keyedDOM.values()) {
        childNode.removeChild(leftover);
      }

    } else {
      // Non-keyed patch (by index)
      let j = 0;
      for (let i = 0; i < patchesChildren.length; i++) {
        const result = patch(childNode, patchesChildren[i], j);
        if (result === 1) {
          j--;
        }
        j++;
      }
    }
  }

  // Update text content if it's a text node
  if ((typeof patches.node === 'string' || typeof patches.node === 'number') &&
      parent.childNodes[index].textContent !== patches.node) {
    parent.childNodes[index].textContent = patches.node;
  }

  return 3;
}
