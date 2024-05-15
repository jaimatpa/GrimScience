import { HasElementTags, hashTag, normaliseProps, tagDedupeKey, defineHeadPlugin } from '@unhead/shared';

async function renderDOMHead(head, options = {}) {
  const dom = options.document || head.resolvedOptions.document;
  if (!dom || !head.dirty)
    return;
  const beforeRenderCtx = { shouldRender: true, tags: [] };
  await head.hooks.callHook("dom:beforeRender", beforeRenderCtx);
  if (!beforeRenderCtx.shouldRender)
    return;
  const tags = (await head.resolveTags()).map((tag) => ({
    tag,
    id: HasElementTags.includes(tag.tag) ? hashTag(tag) : tag.tag,
    shouldRender: true
  }));
  let state = head._dom;
  if (!state) {
    state = {
      elMap: { htmlAttrs: dom.documentElement, bodyAttrs: dom.body }
    };
    for (const key of ["body", "head"]) {
      const children = dom[key]?.children;
      const tags2 = [];
      for (const c of [...children].filter((c2) => HasElementTags.includes(c2.tagName.toLowerCase()))) {
        const t = {
          tag: c.tagName.toLowerCase(),
          props: await normaliseProps(
            c.getAttributeNames().reduce((props, name) => ({ ...props, [name]: c.getAttribute(name) }), {})
          ),
          innerHTML: c.innerHTML
        };
        let i = 1;
        let d = tagDedupeKey(t);
        while (d && tags2.find((t2) => t2._d === d))
          d = `${d}:${i++}`;
        t._d = d || void 0;
        tags2.push(t);
        state.elMap[c.getAttribute("data-hid") || hashTag(t)] = c;
      }
    }
  }
  state.pendingSideEffects = { ...state.sideEffects || {} };
  state.sideEffects = {};
  function track(id, scope, fn) {
    const k = `${id}:${scope}`;
    state.sideEffects[k] = fn;
    delete state.pendingSideEffects[k];
  }
  function trackCtx({ id, $el, tag }) {
    const isAttrTag = tag.tag.endsWith("Attrs");
    state.elMap[id] = $el;
    if (!isAttrTag) {
      ["textContent", "innerHTML"].forEach((k) => {
        tag[k] && tag[k] !== $el[k] && ($el[k] = tag[k]);
      });
      track(id, "el", () => {
        state.elMap[id]?.remove();
        delete state.elMap[id];
      });
    }
    for (const [k, value] of Object.entries(tag._eventHandlers || {})) {
      if ($el.getAttribute(`data-${k}`) !== "") {
        (tag.tag === "bodyAttrs" ? dom.defaultView : $el).addEventListener(k.replace("on", ""), value.bind($el));
        $el.setAttribute(`data-${k}`, "");
      }
    }
    Object.entries(tag.props).forEach(([k, value]) => {
      const ck = `attr:${k}`;
      if (k === "class") {
        for (const c of (value || "").split(" ").filter(Boolean)) {
          isAttrTag && track(id, `${ck}:${c}`, () => $el.classList.remove(c));
          !$el.classList.contains(c) && $el.classList.add(c);
        }
      } else if (k === "style") {
        for (const c of (value || "").split(";").filter(Boolean)) {
          const [k2, ...v] = c.split(":").map((s) => s.trim());
          track(id, `${ck}:${c}:${k2}`, () => {
            $el.style.removeProperty(k2);
          });
          $el.style.setProperty(k2, v.join(":"));
        }
      } else {
        $el.getAttribute(k) !== value && $el.setAttribute(k, value === true ? "" : String(value));
        isAttrTag && track(id, ck, () => $el.removeAttribute(k));
      }
    });
  }
  const pending = [];
  const frag = {
    bodyClose: void 0,
    bodyOpen: void 0,
    head: void 0
  };
  for (const ctx of tags) {
    const { tag, shouldRender, id } = ctx;
    if (!shouldRender)
      continue;
    if (tag.tag === "title") {
      dom.title = tag.textContent;
      continue;
    }
    ctx.$el = ctx.$el || state.elMap[id];
    if (ctx.$el)
      trackCtx(ctx);
    else
      HasElementTags.includes(tag.tag) && pending.push(ctx);
  }
  for (const ctx of pending) {
    const pos = ctx.tag.tagPosition || "head";
    ctx.$el = dom.createElement(ctx.tag.tag);
    trackCtx(ctx);
    frag[pos] = frag[pos] || dom.createDocumentFragment();
    frag[pos].appendChild(ctx.$el);
  }
  for (const ctx of tags)
    await head.hooks.callHook("dom:renderTag", ctx, dom, track);
  frag.head && dom.head.appendChild(frag.head);
  frag.bodyOpen && dom.body.insertBefore(frag.bodyOpen, dom.body.firstChild);
  frag.bodyClose && dom.body.appendChild(frag.bodyClose);
  Object.values(state.pendingSideEffects).forEach((fn) => fn());
  head._dom = state;
  head.dirty = false;
  await head.hooks.callHook("dom:rendered", { renders: tags });
}

async function debouncedRenderDOMHead(head, options = {}) {
  const fn = options.delayFn || ((fn2) => setTimeout(fn2, 10));
  return head._domUpdatePromise = head._domUpdatePromise || new Promise((resolve) => fn(async () => {
    await renderDOMHead(head, options);
    delete head._domUpdatePromise;
    resolve();
  }));
}

// @__NO_SIDE_EFFECTS__
function DomPlugin(options) {
  return defineHeadPlugin((head) => {
    const initialPayload = head.resolvedOptions.document?.head.querySelector('script[id="unhead:payload"]')?.innerHTML || false;
    initialPayload && head.push(JSON.parse(initialPayload));
    return {
      mode: "client",
      hooks: {
        "entries:updated": function(head2) {
          debouncedRenderDOMHead(head2, options);
        }
      }
    };
  });
}

export { DomPlugin, debouncedRenderDOMHead, renderDOMHead };
