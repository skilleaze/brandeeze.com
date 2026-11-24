/* @ds-bundle: {"format":4,"namespace":"BrandeezDesignSystem_fbe106","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"BarMarker","sourcePath":"components/brand/BarMarker.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Monogram","sourcePath":"components/brand/Monogram.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Icon","sourcePath":"components/display/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/display/Icon.jsx"},{"name":"SectionLabel","sourcePath":"components/display/SectionLabel.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"RunningHead","sourcePath":"components/navigation/RunningHead.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"brandbook/pdf2svg.js":"6fb1cbb7f227","components/actions/Button.jsx":"5c381c4bb8bf","components/actions/IconButton.jsx":"06c50bd78b7b","components/brand/BarMarker.jsx":"0d678c72a8ea","components/brand/Logo.jsx":"99d59e7414be","components/brand/Monogram.jsx":"880ff1c973d1","components/display/Badge.jsx":"dd65d72c37b9","components/display/Card.jsx":"9b0898016d27","components/display/Icon.jsx":"5602c3bfcdb1","components/display/SectionLabel.jsx":"1156d6b77512","components/display/Tag.jsx":"b92993baa50b","components/feedback/Dialog.jsx":"70a71107671a","components/feedback/Toast.jsx":"180d59136a89","components/feedback/Tooltip.jsx":"7ea01b0acda1","components/forms/Checkbox.jsx":"fe1e31dbd638","components/forms/Input.jsx":"193ef3c7b042","components/forms/Radio.jsx":"2e8cd52a1f94","components/forms/Select.jsx":"977162a04b92","components/forms/Switch.jsx":"6c4837da8d4f","components/navigation/RunningHead.jsx":"437dc47142ff","components/navigation/Tabs.jsx":"f57b43013f89"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BrandeezDesignSystem_fbe106 = window.BrandeezDesignSystem_fbe106 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// brandbook/pdf2svg.js
try { (() => {
// helper used via run_script: window.pdf2svg(page, OPS, opts)
async function pdf2svg(page, OPS, createCanvas, maxImg) {
  const ops = await page.getOperatorList();
  const vp = page.getViewport({
    scale: 1
  });
  const W = vp.width,
    H = vp.height;
  let out = [],
    defs = [],
    cid = 0;
  const st = [{
    fill: '#000',
    stroke: '#000',
    lw: 1,
    fa: 1,
    sa: 1,
    open: 0
  }];
  const cur = () => st[st.length - 1];
  let d = '',
    pendingClip = null,
    pendingEo = false;
  const f = n => Math.round(n * 100) / 100;
  const color = a => {
    if (typeof a[0] === 'string') return a[0];
    return '#' + Array.from(a).slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
  };
  const imgCache = {};
  async function img(id) {
    if (imgCache[id]) return imgCache[id];
    const o = await new Promise(r => {
      (id.startsWith('g_') ? page.commonObjs : page.objs).get(id, r);
    });
    const c = createCanvas(1, 1);
    let w = o.width,
      h = o.height;
    const s = Math.min(1, maxImg / Math.max(w, h));
    c.width = Math.max(1, Math.round(w * s));
    c.height = Math.max(1, Math.round(h * s));
    const x = c.getContext('2d');
    if (o.bitmap) {
      x.drawImage(o.bitmap, 0, 0, c.width, c.height);
    } else {
      const t = createCanvas(w, h);
      const tx = t.getContext('2d');
      const id2 = tx.createImageData(w, h);
      const D = o.data;
      if (o.kind === 3) id2.data.set(D.subarray(0, w * h * 4));else if (o.kind === 2) {
        for (let i = 0, j = 0; i < w * h; i++) {
          id2.data[i * 4] = D[j++];
          id2.data[i * 4 + 1] = D[j++];
          id2.data[i * 4 + 2] = D[j++];
          id2.data[i * 4 + 3] = 255;
        }
      } else {
        const rb = w + 7 >> 3;
        for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) {
          const b = D[yy * rb + (xx >> 3)] >> 7 - (xx & 7) & 1;
          const k = (yy * w + xx) * 4;
          id2.data[k] = id2.data[k + 1] = id2.data[k + 2] = b ? 255 : 0;
          id2.data[k + 3] = 255;
        }
      }
      tx.putImageData(id2, 0, 0);
      x.drawImage(t, 0, 0, c.width, c.height);
    }
    let url;
    if (c.toDataURL) url = c.toDataURL('image/jpeg', 0.82);else {
      const bl = await c.convertToBlob({
        type: 'image/jpeg',
        quality: 0.82
      });
      url = await new Promise(r => {
        const fr = new FileReader();
        fr.onload = () => r(fr.result);
        fr.readAsDataURL(bl);
      });
    }
    imgCache[id] = url;
    return url;
  }
  const {
    fnArray: fa,
    argsArray: aa
  } = ops;
  for (let i = 0; i < fa.length; i++) {
    const fn = fa[i],
      a = aa[i];
    switch (fn) {
      case OPS.save:
        st.push({
          ...cur(),
          open: 0
        });
        break;
      case OPS.restore:
        {
          const s = st.pop();
          for (let k = 0; k < s.open; k++) out.push('</g>');
          break;
        }
      case OPS.transform:
        out.push(`<g transform="matrix(${a.map(f).join(' ')})">`);
        cur().open++;
        break;
      case OPS.paintFormXObjectBegin:
        st.push({
          ...cur(),
          open: 0
        });
        if (a[0]) {
          out.push(`<g transform="matrix(${a[0].map(f).join(' ')})">`);
          cur().open++;
        }
        break;
      case OPS.paintFormXObjectEnd:
        {
          const s = st.pop();
          for (let k = 0; k < s.open; k++) out.push('</g>');
          break;
        }
      case OPS.setFillRGBColor:
        cur().fill = color(a);
        break;
      case OPS.setStrokeRGBColor:
        cur().stroke = color(a);
        break;
      case OPS.setFillGray:
        cur().fill = color([a[0] * 255, a[0] * 255, a[0] * 255]);
        break;
      case OPS.setLineWidth:
        cur().lw = a[0];
        break;
      case OPS.setGState:
        for (const [k, v] of a[0]) {
          if (k === 'ca') cur().fa = v;
          if (k === 'CA') cur().sa = v;
        }
        break;
      case OPS.constructPath:
        {
          const [po, co] = a;
          let j = 0;
          d = '';
          let cx = 0,
            cy = 0;
          for (const o of po) {
            if (o === OPS.moveTo) {
              cx = co[j++];
              cy = co[j++];
              d += `M${f(cx)} ${f(cy)}`;
            } else if (o === OPS.lineTo) {
              cx = co[j++];
              cy = co[j++];
              d += `L${f(cx)} ${f(cy)}`;
            } else if (o === OPS.curveTo) {
              const p = co.slice(j, j + 6);
              j += 6;
              d += `C${p.map(f).join(' ')}`;
              cx = p[4];
              cy = p[5];
            } else if (o === OPS.curveTo2) {
              const p = co.slice(j, j + 4);
              j += 4;
              d += `C${f(cx)} ${f(cy)} ${p.map(f).join(' ')}`;
              cx = p[2];
              cy = p[3];
            } else if (o === OPS.curveTo3) {
              const p = co.slice(j, j + 4);
              j += 4;
              d += `C${f(p[0])} ${f(p[1])} ${f(p[2])} ${f(p[3])} ${f(p[2])} ${f(p[3])}`;
              cx = p[2];
              cy = p[3];
            } else if (o === OPS.closePath) d += 'Z';else if (o === OPS.rectangle) {
              const [x, y, w, h] = co.slice(j, j + 4);
              j += 4;
              d += `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;
              cx = x;
              cy = y;
            }
          }
          break;
        }
      case OPS.fill:
      case OPS.eoFill:
        out.push(`<path d="${d}" fill="${cur().fill}"${cur().fa < 1 ? ` fill-opacity="${cur().fa}"` : ''}${fn === OPS.eoFill ? ' fill-rule="evenodd"' : ''}/>`);
        break;
      case OPS.stroke:
      case OPS.closeStroke:
        out.push(`<path d="${d}" fill="none" stroke="${cur().stroke}" stroke-width="${cur().lw}"${cur().sa < 1 ? ` stroke-opacity="${cur().sa}"` : ''}/>`);
        break;
      case OPS.fillStroke:
      case OPS.eoFillStroke:
        out.push(`<path d="${d}" fill="${cur().fill}" stroke="${cur().stroke}" stroke-width="${cur().lw}"/>`);
        break;
      case OPS.clip:
      case OPS.eoClip:
        pendingClip = d;
        pendingEo = fn === OPS.eoClip;
        break;
      case OPS.endPath:
        if (pendingClip !== null) {
          const id = 'c' + cid++;
          defs.push(`<clipPath id="${id}"><path d="${pendingClip}"${pendingEo ? ' clip-rule="evenodd"' : ''}/></clipPath>`);
          out.push(`<g clip-path="url(#${id})">`);
          cur().open++;
          pendingClip = null;
        }
        break;
      case OPS.paintImageXObject:
        {
          const url = await img(a[0]);
          out.push(`<image href="${url}" width="1" height="1" preserveAspectRatio="none" transform="matrix(1 0 0 -1 0 1)"${cur().fa < 1 ? ` opacity="${cur().fa}"` : ''}/>`);
          break;
        }
    }
  }
  while (st.length > 1) {
    const s = st.pop();
    for (let k = 0; k < s.open; k++) out.push('</g>');
  }
  for (let k = 0; k < st[0].open; k++) out.push('</g>');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(W)} ${f(H)}" width="${f(W)}" height="${f(H)}"><defs>${defs.join('')}</defs><g transform="matrix(1 0 0 -1 0 ${f(H)})">${out.join('')}</g></svg>`;
}
})(); } catch (e) { __ds_ns.__errors.push({ path: "brandbook/pdf2svg.js", error: String((e && e.message) || e) }); }

// components/actions/Button.jsx
try { (() => {
const SIZES = {
  sm: {
    h: 32,
    px: 12,
    fs: 14
  },
  md: {
    h: 44,
    px: 16,
    fs: 16
  },
  lg: {
    h: 56,
    px: 24,
    fs: 18
  }
};
const VARIANTS = {
  primary: {
    bg: "var(--action-primary)",
    fg: "var(--text-on-accent)",
    hover: "var(--action-primary-hover)",
    press: "var(--action-primary-press)",
    bd: "transparent"
  },
  secondary: {
    bg: "var(--action-secondary)",
    fg: "var(--text-on-inverse)",
    hover: "var(--action-secondary-hover)",
    press: "var(--action-secondary-press)",
    bd: "transparent"
  },
  outline: {
    bg: "transparent",
    fg: "currentColor",
    hover: "rgba(31,34,53,.06)",
    press: "rgba(31,34,53,.12)",
    bd: "currentColor"
  },
  ghost: {
    bg: "transparent",
    fg: "currentColor",
    hover: "rgba(31,34,53,.06)",
    press: "rgba(31,34,53,.12)",
    bd: "transparent"
  }
};
function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  disabled,
  fullWidth,
  children,
  style,
  onClick,
  type = "button",
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size] || SIZES.md,
    v = VARIANTS[variant] || VARIANTS.primary;
  const bg = disabled ? "var(--disabled-bg)" : press ? v.press : hover ? v.hover : v.bg;
  return React.createElement("button", {
    type,
    disabled,
    onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: fullWidth ? "flex" : "inline-flex",
      width: fullWidth ? "100%" : undefined,
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 8,
      height: s.h,
      padding: `0 ${s.px}px`,
      border: `var(--rule-width) solid ${disabled ? "transparent" : v.bd}`,
      borderRadius: 0,
      background: bg,
      color: disabled ? "var(--disabled-fg)" : v.fg,
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: s.fs,
      lineHeight: 1,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "background var(--duration-fast) var(--ease-standard)",
      whiteSpace: "nowrap",
      boxSizing: "border-box",
      ...style
    },
    ...rest
  }, iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/brand/BarMarker.jsx
try { (() => {
// One Marigold bar that leads a line of type ("Marker: one bar leads a line of type").
function BarMarker({
  children,
  size = "md",
  color = "var(--bz-marigold)",
  style,
  ...rest
}) {
  const S = {
    sm: [16, 4, 8, 14],
    md: [24, 6, 12, 18],
    lg: [32, 9, 16, 28]
  }[size] || [24, 6, 12, 18];
  return React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: S[2],
      fontFamily: "var(--font-sans)",
      fontWeight: 800,
      fontSize: S[3],
      lineHeight: 1.1,
      color: "inherit",
      ...style
    },
    ...rest
  }, React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: S[0],
      height: S[1],
      background: color,
      flex: "none"
    }
  }), children != null && React.createElement("span", null, children));
}
Object.assign(__ds_scope, { BarMarker });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/BarMarker.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
// Wordmark outlines extracted from Brand Book (Brandeeze) p.14 (primary logo). Do not redraw.
const LETTERS = ["M48.16 437.58L48.16 493.56L82.38 493.56C85.26 493.56 87.86 492.99 90.2 491.84C92.53 490.7 94.4 489.1 95.78 487.04C97.17 484.97 97.86 482.56 97.86 479.79C97.86 477.34 97.44 475.25 96.59 473.51C95.75 471.78 94.64 470.36 93.25 469.28C91.87 468.19 90.31 467.38 88.57 466.83L88.57 466.51C90.58 466.07 92.4 465.3 94.03 464.19C95.66 463.07 96.95 461.56 97.9 459.66C98.85 457.76 99.32 455.45 99.32 452.74C99.32 449.53 98.56 446.8 97.04 444.55C95.52 442.3 93.51 440.57 91.01 439.38C88.52 438.18 85.72 437.58 82.62 437.58L48.16 437.58ZM62.74 448.83L78.63 448.83C80.37 448.83 81.77 449.34 82.83 450.38C83.89 451.41 84.41 452.98 84.41 455.1C84.41 456.24 84.18 457.26 83.72 458.16C83.26 459.05 82.58 459.75 81.69 460.23C80.79 460.72 79.69 460.97 78.39 460.97L62.74 460.97L62.74 448.83ZM62.74 471.31L77.33 471.31C78.52 471.31 79.54 471.56 80.38 472.05C81.22 472.54 81.88 473.21 82.34 474.08C82.8 474.95 83.03 475.99 83.03 477.18C83.03 478.92 82.51 480.28 81.48 481.25C80.45 482.23 79.15 482.72 77.57 482.72L62.74 482.72L62.74 471.31Z", "M107.23 437.58L107.23 493.56L139.73 493.56C143.86 493.56 147.31 492.78 150.08 491.23C152.85 489.69 154.93 487.57 156.31 484.88C157.7 482.19 158.39 479.19 158.39 475.88C158.39 472.29 157.56 469.1 155.91 466.3C154.25 463.51 151.93 461.32 148.94 459.75L160.18 437.58L143.89 437.58L134.6 457.3L121.81 457.3L121.81 437.58L107.23 437.58ZM121.81 468.14L136.88 468.14C138.89 468.14 140.51 468.8 141.73 470.13C142.95 471.46 143.56 473.24 143.56 475.47C143.56 476.94 143.29 478.18 142.75 479.22C142.21 480.25 141.45 481.05 140.47 481.62C139.49 482.19 138.29 482.48 136.88 482.48L121.81 482.48L121.81 468.14Z", "M161.24 437.58L182.26 493.56L199.78 493.56L220.8 437.58L205.24 437.58L201.9 447.28L179.57 447.28L176.23 437.58L161.24 437.58ZM183.08 458.2L198.31 458.2L194.32 470.01C194.1 470.61 193.84 471.35 193.55 472.25C193.25 473.15 192.95 474.1 192.65 475.1C192.35 476.11 192.07 477.13 191.79 478.16C191.52 479.19 191.25 480.09 190.98 480.85L190.41 480.85C190.19 479.81 189.88 478.65 189.47 477.34C189.07 476.04 188.66 474.74 188.25 473.43C187.84 472.13 187.48 470.99 187.15 470.01L183.08 458.2Z", "M225.85 437.58L225.85 493.56L238.8 493.56L259.17 467.57C259.55 467.13 260.05 466.51 260.68 465.69C261.3 464.88 261.91 464.05 262.51 463.21C263.11 462.37 263.54 461.7 263.82 461.21L264.22 461.29C264.22 462.49 264.22 463.64 264.22 464.76C264.22 465.87 264.22 466.81 264.22 467.57L264.22 493.56L277.75 493.56L277.75 437.58L264.87 437.58L243.28 464.96C242.58 465.83 241.91 466.72 241.29 467.65C240.66 468.57 240.16 469.33 239.78 469.93L239.37 469.85C239.37 468.98 239.37 468.1 239.37 467.2C239.37 466.3 239.37 465.56 239.37 464.96L239.37 437.58L225.85 437.58Z", "M288.34 437.58L288.34 493.56L311.72 493.56C317.8 493.56 322.95 492.55 327.16 490.54C331.37 488.53 334.57 485.48 336.77 481.38C338.97 477.27 340.07 472.02 340.07 465.61C340.07 459.26 338.97 454 336.77 449.85C334.57 445.69 331.37 442.61 327.16 440.6C322.95 438.59 317.8 437.58 311.72 437.58L288.34 437.58ZM302.92 448.99L311.56 448.99C313.84 448.99 315.82 449.32 317.51 449.97C319.19 450.62 320.6 451.57 321.74 452.82C322.88 454.07 323.72 455.62 324.27 457.46C324.81 459.31 325.08 461.43 325.08 463.82L325.08 467.24C325.08 469.68 324.81 471.83 324.27 473.68C323.72 475.52 322.88 477.07 321.74 478.32C320.6 479.57 319.19 480.52 317.51 481.17C315.82 481.82 313.84 482.15 311.56 482.15L302.92 482.15L302.92 448.99Z", "M445.41 437.58L445.41 443.04L473.2 482.15L447.45 482.15L447.45 493.56L495.44 493.56L495.44 488.1L467.66 448.99L496.09 448.99L496.09 437.58L445.41 437.58Z", "M503.5 437.58L503.5 493.56L549.7 493.56L549.7 482.15L518.09 482.15L518.09 471.64L545.71 471.64L545.71 460.48L518.09 460.48L518.09 448.99L550.27 448.99L550.27 437.58L503.5 437.58Z"];
const BARS = ["M348.66 493.21L389.4 493.21L389.4 480.07L348.66 480.07Z", "M348.66 470.87L389.4 470.87L389.4 458.17L348.66 458.17Z", "M348.66 448.97L389.4 448.97L389.4 435.83L348.66 435.83Z", "M395.97 493.21L436.7 493.21L436.7 480.07L395.97 480.07Z", "M395.97 470.87L436.7 470.87L436.7 458.17L395.97 458.17Z", "M395.97 448.97L436.7 448.97L436.7 435.83L395.97 435.83Z"];
const VB = "0 0 502.1 57.8";
const T = "matrix(1 0 0 -1 -48.2 493.6)";
const SCHEMES = {
  "on-dark": ["var(--bz-white)", "var(--bz-marigold)"],
  "on-light": ["var(--bz-noctis)", "var(--bz-marigold)"],
  "on-marigold": ["var(--bz-noctis)", "var(--bz-noctis)"],
  "mono-noctis": ["var(--bz-noctis)", "var(--bz-noctis)"],
  "mono-white": ["var(--bz-white)", "var(--bz-white)"]
};
function Logo({
  scheme = "on-light",
  height = 32,
  title = "Brandeeze",
  style,
  ...rest
}) {
  const [l, b] = SCHEMES[scheme] || SCHEMES["on-light"];
  const width = Math.round(height * (502.1 / 57.8));
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: VB,
    width,
    height,
    role: "img",
    "aria-label": title,
    style: {
      display: "block",
      flex: "none",
      ...style
    },
    ...rest
  }, React.createElement("g", {
    transform: T
  }, LETTERS.map((d, i) => React.createElement("path", {
    key: "l" + i,
    d,
    fill: l
  })), BARS.map((d, i) => React.createElement("path", {
    key: "b" + i,
    d,
    fill: b
  }))));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/brand/Monogram.jsx
try { (() => {
// The two E's: 2 columns x 3 bars. Construction (x = bar height): width 3.1x, gap 0.7x, space 0.5x, total 6.7x by 4.4x.
function Monogram({
  height = 24,
  color = "var(--bz-marigold)",
  title = "Brandeeze",
  style,
  ...rest
}) {
  const x = height / 4.4,
    w = 3.1 * x,
    g = 0.7 * x,
    s = 0.5 * x;
  const bars = [];
  [0, w + s].forEach(cx => [0, x + g, 2 * (x + g)].forEach(cy => bars.push(React.createElement("rect", {
    key: cx + "-" + cy,
    x: cx,
    y: cy,
    width: w,
    height: x,
    fill: color
  }))));
  const W = 2 * w + s;
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: `0 0 ${W} ${height}`,
    width: W,
    height,
    role: "img",
    "aria-label": title,
    style: {
      display: "block",
      flex: "none",
      ...style
    },
    ...rest
  }, bars);
}
Object.assign(__ds_scope, { Monogram });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Monogram.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function Badge({
  tone = "accent",
  children,
  style,
  ...rest
}) {
  const T = {
    accent: ["var(--bz-marigold)", "var(--bz-noctis)", "transparent"],
    inverse: ["var(--bz-noctis)", "var(--bz-white)", "transparent"],
    neutral: ["var(--bz-neutral-200)", "var(--bz-noctis)", "transparent"],
    outline: ["transparent", "currentColor", "currentColor"],
    error: ["var(--bz-signal-error)", "var(--bz-white)", "transparent"]
  }[tone] || [];
  return React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      height: 20,
      padding: "0 6px",
      boxSizing: "border-box",
      background: T[0],
      color: T[1],
      border: `var(--hairline) solid ${T[2]}`,
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      lineHeight: 1,
      whiteSpace: "nowrap",
      ...style
    },
    ...rest
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
// Brandeeze cards are not boxes with shadows: they are columns topped by a 2px rule (variant "rule"),
// or flat square panels in White / Noctis / Marigold.
function Card({
  variant = "rule",
  number,
  label,
  title,
  children,
  footer,
  padding,
  style,
  onClick,
  ...rest
}) {
  const inv = variant === "inverse";
  const V = {
    rule: {
      background: "transparent",
      borderTop: "var(--rule-width) solid var(--rule-strong)",
      pad: "12px 0 0"
    },
    panel: {
      background: "var(--surface-card)",
      pad: "24px"
    },
    inverse: {
      background: "var(--surface-inverse)",
      color: "var(--text-on-inverse)",
      pad: "24px"
    },
    accent: {
      background: "var(--surface-accent)",
      color: "var(--text-on-accent)",
      pad: "24px"
    }
  }[variant] || {};
  const labelColor = inv ? "var(--text-label-on-inverse)" : variant === "accent" ? "var(--bz-noctis)" : "var(--text-label)";
  return React.createElement("div", {
    onClick,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      boxSizing: "border-box",
      padding: padding ?? V.pad,
      background: V.background,
      borderTop: V.borderTop,
      color: V.color || "var(--text-primary)",
      fontFamily: "var(--font-sans)",
      cursor: onClick ? "pointer" : undefined,
      ...style
    },
    ...rest
  }, (number != null || label) && React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color: labelColor
    }
  }, number != null ? String(number).padStart(2, "0") : null, number != null && label ? " · " : null, label), title && React.createElement("div", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: "var(--tracking-heading)"
    }
  }, title), children && React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: 1.4,
      color: inv ? "var(--text-on-inverse-secondary)" : variant === "accent" ? "var(--bz-noctis)" : "var(--text-secondary)"
    }
  }, children), footer && React.createElement("div", {
    style: {
      marginTop: "auto",
      paddingTop: 16
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Icon.jsx
try { (() => {
// Lucide icon paths (lucide-static@0.460.0, ISC licence), copied from assets/icons/.
const ICONS = {
  "arrow-right": "<path d=\"M5 12h14\"/> <path d=\"m12 5 7 7-7 7\"/>",
  "arrow-up-right": "<path d=\"M7 7h10v10\"/> <path d=\"M7 17 17 7\"/>",
  "calendar": "<path d=\"M8 2v4\"/> <path d=\"M16 2v4\"/> <rect width=\"18\" height=\"18\" x=\"3\" y=\"4\" rx=\"2\"/> <path d=\"M3 10h18\"/>",
  "check": "<path d=\"M20 6 9 17l-5-5\"/>",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\"/>",
  "chevron-right": "<path d=\"m9 18 6-6-6-6\"/>",
  "circle-check": "<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"m9 12 2 2 4-4\"/>",
  "clapperboard": "<path d=\"M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z\"/> <path d=\"m6.2 5.3 3.1 3.9\"/> <path d=\"m12.4 3.4 3.1 4\"/> <path d=\"M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z\"/>",
  "code": "<polyline points=\"16 18 22 12 16 6\"/> <polyline points=\"8 6 2 12 8 18\"/>",
  "external-link": "<path d=\"M15 3h6v6\"/> <path d=\"M10 14 21 3\"/> <path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\"/>",
  "file-text": "<path d=\"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z\"/> <path d=\"M14 2v4a2 2 0 0 0 2 2h4\"/> <path d=\"M10 9H8\"/> <path d=\"M16 13H8\"/> <path d=\"M16 17H8\"/>",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"10\"/> <path d=\"M12 16v-4\"/> <path d=\"M12 8h.01\"/>",
  "mail": "<rect width=\"20\" height=\"16\" x=\"2\" y=\"4\" rx=\"2\"/> <path d=\"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7\"/>",
  "menu": "<line x1=\"4\" x2=\"20\" y1=\"12\" y2=\"12\"/> <line x1=\"4\" x2=\"20\" y1=\"6\" y2=\"6\"/> <line x1=\"4\" x2=\"20\" y1=\"18\" y2=\"18\"/>",
  "minus": "<path d=\"M5 12h14\"/>",
  "pen-tool": "<path d=\"M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z\"/> <path d=\"m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18\"/> <path d=\"m2.3 2.3 7.286 7.286\"/> <circle cx=\"11\" cy=\"11\" r=\"2\"/>",
  "phone": "<path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"/>",
  "plus": "<path d=\"M5 12h14\"/> <path d=\"M12 5v14\"/>",
  "search": "<circle cx=\"11\" cy=\"11\" r=\"8\"/> <path d=\"m21 21-4.3-4.3\"/>",
  "share-2": "<circle cx=\"18\" cy=\"5\" r=\"3\"/> <circle cx=\"6\" cy=\"12\" r=\"3\"/> <circle cx=\"18\" cy=\"19\" r=\"3\"/> <line x1=\"8.59\" x2=\"15.42\" y1=\"13.51\" y2=\"17.49\"/> <line x1=\"15.41\" x2=\"8.59\" y1=\"6.51\" y2=\"10.49\"/>",
  "trending-up": "<polyline points=\"22 7 13.5 15.5 8.5 10.5 2 17\"/> <polyline points=\"16 7 22 7 22 13\"/>",
  "triangle-alert": "<path d=\"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3\"/> <path d=\"M12 9v4\"/> <path d=\"M12 17h.01\"/>",
  "workflow": "<rect width=\"8\" height=\"8\" x=\"3\" y=\"3\" rx=\"2\"/> <path d=\"M7 11v4a2 2 0 0 0 2 2h4\"/> <rect width=\"8\" height=\"8\" x=\"13\" y=\"13\" rx=\"2\"/>",
  "x": "<path d=\"M18 6 6 18\"/> <path d=\"m6 6 12 12\"/>"
};
function Icon({
  name,
  size = 24,
  strokeWidth = 2,
  color = "currentColor",
  title,
  style,
  ...rest
}) {
  const body = ICONS[name];
  if (!body) return null;
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    role: title ? "img" : "presentation",
    "aria-label": title,
    "aria-hidden": title ? undefined : true,
    style: {
      display: "block",
      flex: "none",
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: body
    },
    ...rest
  });
}
const ICON_NAMES = Object.keys(ICONS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Icon.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function IconButton({
  icon,
  label,
  variant = "ghost",
  size = "md",
  disabled,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const d = {
      sm: 32,
      md: 44,
      lg: 56
    }[size] || 44,
    is = {
      sm: 16,
      md: 20,
      lg: 24
    }[size] || 20;
  const V = {
    primary: ["var(--action-primary)", "var(--action-primary-hover)", "var(--text-on-accent)", "transparent"],
    secondary: ["var(--action-secondary)", "var(--action-secondary-hover)", "var(--text-on-inverse)", "transparent"],
    outline: ["transparent", "rgba(31,34,53,.06)", "currentColor", "currentColor"],
    ghost: ["transparent", "rgba(31,34,53,.06)", "currentColor", "transparent"]
  }[variant] || [];
  return React.createElement("button", {
    type: "button",
    "aria-label": label,
    title: label,
    disabled,
    onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: d,
      height: d,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      borderRadius: 0,
      border: `var(--rule-width) solid ${V[3]}`,
      background: disabled ? "var(--disabled-bg)" : hover ? V[1] : V[0],
      color: disabled ? "var(--disabled-fg)" : V[2],
      cursor: disabled ? "not-allowed" : "pointer",
      boxSizing: "border-box",
      ...style
    },
    ...rest
  }, typeof icon === "string" ? React.createElement(__ds_scope.Icon, {
    name: icon,
    size: is
  }) : icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/SectionLabel.jsx
try { (() => {
// Small tracked caps label: "01 · THE PROBLEM", "PURPOSE", "02 LOGO".
function SectionLabel({
  number,
  children,
  tone = "accent",
  inverse,
  as = "div",
  style,
  ...rest
}) {
  const color = tone === "muted" ? inverse ? "var(--text-on-inverse-secondary)" : "var(--text-secondary)" : tone === "default" ? inverse ? "var(--text-on-inverse)" : "var(--text-primary)" : inverse ? "var(--text-label-on-inverse)" : "var(--text-label)";
  return React.createElement(as, {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 600,
      fontSize: 12,
      lineHeight: 1.2,
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color,
      margin: 0,
      ...style
    },
    ...rest
  }, number != null ? `${String(number).padStart(2, "0")}${children ? " · " : ""}` : null, children);
}
Object.assign(__ds_scope, { SectionLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/SectionLabel.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function Tag({
  children,
  selected,
  onClick,
  onRemove,
  inverse,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const bg = selected ? inverse ? "var(--bz-marigold)" : "var(--bz-noctis)" : hover && onClick ? inverse ? "rgba(255,255,255,.08)" : "var(--bz-neutral-200)" : "transparent";
  const fg = selected ? inverse ? "var(--bz-noctis)" : "var(--bz-white)" : inverse ? "var(--bz-white)" : "var(--text-primary)";
  const bd = selected ? "transparent" : inverse ? "var(--rule-on-inverse)" : "var(--rule)";
  return React.createElement(onClick ? "button" : "span", {
    type: onClick ? "button" : undefined,
    onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      height: 32,
      padding: "0 12px",
      boxSizing: "border-box",
      borderRadius: 0,
      border: `var(--rule-width) solid ${bd}`,
      background: bg,
      color: fg,
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      fontWeight: 500,
      cursor: onClick ? "pointer" : "default",
      whiteSpace: "nowrap",
      ...style
    },
    ...rest
  }, children, onRemove && React.createElement("span", {
    role: "button",
    "aria-label": "Remove",
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    },
    style: {
      display: "inline-flex",
      cursor: "pointer",
      marginRight: -4
    }
  }, React.createElement("svg", {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round"
  }, React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open,
  onClose,
  title,
  label,
  children,
  actions,
  width = 520,
  inline
}) {
  if (!open) return null;
  const panel = React.createElement("div", {
    role: "dialog",
    "aria-modal": true,
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: "100%",
      boxSizing: "border-box",
      background: "var(--surface-card)",
      borderTop: "8px solid var(--bz-marigold)",
      padding: 32,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      fontFamily: "var(--font-sans)",
      color: "var(--text-primary)"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 16
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, label && React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      color: "var(--text-label)"
    }
  }, label), title && React.createElement("div", {
    style: {
      fontSize: 28,
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: "var(--tracking-heading)"
    }
  }, title)), onClose && React.createElement("button", {
    type: "button",
    "aria-label": "Close",
    onClick: onClose,
    style: {
      width: 32,
      height: 32,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "none",
      border: 0,
      padding: 0,
      cursor: "pointer",
      color: "inherit",
      flex: "none"
    }
  }, React.createElement("svg", {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round"
  }, React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  })))), children && React.createElement("div", {
    style: {
      fontSize: 16,
      lineHeight: 1.45,
      color: "var(--text-secondary)"
    }
  }, children), actions && React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      paddingTop: 8
    }
  }, actions));
  if (inline) return panel;
  return React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(31,34,53,.72)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      zIndex: 1000
    }
  }, panel);
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  title,
  children,
  tone = "default",
  onClose,
  action,
  style
}) {
  const bar = tone === "error" ? "var(--bz-signal-error)" : "var(--bz-marigold)";
  return React.createElement("div", {
    role: "status",
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      width: 380,
      maxWidth: "100%",
      boxSizing: "border-box",
      padding: "16px 16px 16px 20px",
      background: "var(--surface-inverse)",
      color: "var(--text-on-inverse)",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 20,
      height: 6,
      background: bar,
      flex: "none",
      marginTop: 7
    }
  }), React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, title && React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700
    }
  }, title), children && React.createElement("div", {
    style: {
      fontSize: 14,
      lineHeight: 1.4,
      color: "var(--text-on-inverse-secondary)"
    }
  }, children), action && React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, action)), onClose && React.createElement("button", {
    type: "button",
    "aria-label": "Dismiss",
    onClick: onClose,
    style: {
      background: "none",
      border: 0,
      padding: 2,
      cursor: "pointer",
      color: "var(--text-on-inverse-secondary)",
      display: "inline-flex"
    }
  }, React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round"
  }, React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  content,
  children,
  placement = "top",
  style
}) {
  const [show, setShow] = React.useState(false);
  const pos = {
    top: {
      bottom: "100%",
      left: 0,
      marginBottom: 6
    },
    bottom: {
      top: "100%",
      left: 0,
      marginTop: 6
    },
    right: {
      left: "100%",
      top: 0,
      marginLeft: 6
    }
  }[placement];
  return React.createElement("span", {
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false),
    style: {
      position: "relative",
      display: "inline-flex",
      ...style
    }
  }, children, show && React.createElement("span", {
    role: "tooltip",
    style: {
      position: "absolute",
      ...pos,
      zIndex: 50,
      background: "var(--bz-noctis)",
      color: "var(--bz-white)",
      padding: "6px 8px",
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      lineHeight: 1.3,
      fontWeight: 500,
      whiteSpace: "nowrap",
      pointerEvents: "none"
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  defaultChecked,
  disabled,
  onChange,
  name,
  value,
  style,
  ...rest
}) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked ?? inner;
  const toggle = e => {
    if (disabled) return;
    const n = !on;
    if (checked === undefined) setInner(n);
    onChange && onChange(n, e);
  };
  return React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      color: disabled ? "var(--disabled-fg)" : "var(--text-primary)",
      ...style
    }
  }, React.createElement("input", {
    type: "checkbox",
    checked: on,
    onChange: toggle,
    disabled,
    name,
    value,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    },
    ...rest
  }), React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 20,
      height: 20,
      flex: "none",
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: `var(--rule-width) solid ${disabled ? "var(--bz-neutral-400)" : on ? "var(--bz-noctis)" : "var(--rule)"}`,
      background: on && !disabled ? "var(--bz-noctis)" : "var(--surface-card)"
    }
  }, on && React.createElement("svg", {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: disabled ? "var(--bz-neutral-400)" : "var(--bz-marigold)",
    strokeWidth: 3.5,
    strokeLinecap: "square"
  }, React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }))), label != null && React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Field({
  label,
  hint,
  error,
  id,
  children
}) {
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      fontFamily: "var(--font-sans)"
    }
  }, label && React.createElement("label", {
    htmlFor: id,
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-primary)"
    }
  }, label), children, (error || hint) && React.createElement("span", {
    style: {
      fontSize: 13,
      color: error ? "var(--text-error)" : "var(--text-secondary)"
    }
  }, error || hint));
}
function Input({
  label,
  hint,
  error,
  id,
  value,
  defaultValue,
  placeholder,
  type = "text",
  disabled,
  multiline,
  rows = 4,
  onChange,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || React.useId();
  const el = React.createElement(multiline ? "textarea" : "input", {
    id: uid,
    type: multiline ? undefined : type,
    value,
    defaultValue,
    placeholder,
    disabled,
    rows: multiline ? rows : undefined,
    onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    "aria-invalid": !!error,
    style: {
      height: multiline ? undefined : 44,
      padding: multiline ? "10px 12px" : "0 12px",
      boxSizing: "border-box",
      width: "100%",
      borderRadius: 0,
      outline: "none",
      resize: "vertical",
      border: `var(--rule-width) solid ${error ? "var(--text-error)" : focus ? "var(--rule-strong)" : "var(--rule)"}`,
      background: disabled ? "var(--disabled-bg)" : "var(--surface-card)",
      color: disabled ? "var(--disabled-fg)" : "var(--text-primary)",
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      lineHeight: 1.35,
      ...style
    },
    ...rest
  });
  return React.createElement(Field, {
    label,
    hint,
    error,
    id: uid
  }, el);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  label,
  checked,
  defaultChecked,
  disabled,
  onChange,
  name,
  value,
  style,
  ...rest
}) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked ?? inner;
  const toggle = e => {
    if (disabled) return;
    if (checked === undefined) setInner(true);
    onChange && onChange(true, e);
  };
  return React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      color: disabled ? "var(--disabled-fg)" : "var(--text-primary)",
      ...style
    }
  }, React.createElement("input", {
    type: "radio",
    checked: on,
    onChange: toggle,
    disabled,
    name,
    value,
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    },
    ...rest
  }), React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 20,
      height: 20,
      flex: "none",
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      border: `var(--rule-width) solid ${disabled ? "var(--bz-neutral-400)" : on ? "var(--bz-noctis)" : "var(--rule)"}`,
      background: on && !disabled ? "var(--bz-noctis)" : "var(--surface-card)"
    }
  }, on && React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: disabled ? "var(--bz-neutral-400)" : "var(--bz-marigold)"
    }
  })), label != null && React.createElement("span", null, label));
}
function RadioGroup({
  name,
  options = [],
  value,
  defaultValue,
  onChange,
  direction = "column",
  style
}) {
  const [inner, setInner] = React.useState(defaultValue);
  const cur = value ?? inner;
  return React.createElement("div", {
    role: "radiogroup",
    style: {
      display: "flex",
      flexDirection: direction,
      gap: direction === "row" ? 24 : 12,
      ...style
    }
  }, options.map(o => {
    const opt = typeof o === "string" ? {
      value: o,
      label: o
    } : o;
    return React.createElement(Radio, {
      key: opt.value,
      name,
      value: opt.value,
      label: opt.label,
      checked: cur === opt.value,
      onChange: () => {
        if (value === undefined) setInner(opt.value);
        onChange && onChange(opt.value);
      }
    });
  }));
}
Object.assign(__ds_scope, { Radio, RadioGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Field({
  label,
  hint,
  error,
  id,
  children
}) {
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      fontFamily: "var(--font-sans)"
    }
  }, label && React.createElement("label", {
    htmlFor: id,
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: "var(--text-primary)"
    }
  }, label), children, (error || hint) && React.createElement("span", {
    style: {
      fontSize: 13,
      color: error ? "var(--text-error)" : "var(--text-secondary)"
    }
  }, error || hint));
}
function Select({
  label,
  hint,
  error,
  id,
  options = [],
  value,
  defaultValue,
  placeholder,
  disabled,
  onChange,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || React.useId();
  const opts = options.map(o => typeof o === "string" ? {
    value: o,
    label: o
  } : o);
  const el = React.createElement("div", {
    style: {
      position: "relative"
    }
  }, React.createElement("select", {
    id: uid,
    value,
    defaultValue: defaultValue ?? (placeholder ? "" : undefined),
    disabled,
    onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: "none",
      WebkitAppearance: "none",
      height: 44,
      width: "100%",
      padding: "0 40px 0 12px",
      borderRadius: 0,
      outline: "none",
      border: `var(--rule-width) solid ${error ? "var(--text-error)" : focus ? "var(--rule-strong)" : "var(--rule)"}`,
      background: disabled ? "var(--disabled-bg)" : "var(--surface-card)",
      color: "var(--text-primary)",
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      ...style
    },
    ...rest
  }, placeholder && React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), opts.map(o => React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), React.createElement("svg", {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: "absolute",
      right: 14,
      top: 14,
      pointerEvents: "none",
      color: "var(--text-primary)"
    }
  }, React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })));
  return React.createElement(Field, {
    label,
    hint,
    error,
    id: uid
  }, el);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
// Square toggle: track flips Neutral → Noctis, the knob becomes a Marigold bar.
function Switch({
  label,
  checked,
  defaultChecked,
  disabled,
  onChange,
  style
}) {
  const [inner, setInner] = React.useState(!!defaultChecked);
  const on = checked ?? inner;
  const flip = () => {
    if (disabled) return;
    const n = !on;
    if (checked === undefined) setInner(n);
    onChange && onChange(n);
  };
  return React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      color: disabled ? "var(--disabled-fg)" : "var(--text-primary)",
      ...style
    }
  }, React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": on,
    disabled,
    onClick: flip,
    style: {
      width: 44,
      height: 24,
      padding: 3,
      border: 0,
      borderRadius: 0,
      boxSizing: "border-box",
      cursor: "inherit",
      display: "flex",
      justifyContent: on ? "flex-end" : "flex-start",
      alignItems: "center",
      background: disabled ? "var(--disabled-bg)" : on ? "var(--bz-noctis)" : "var(--bz-neutral-400)",
      transition: "background var(--duration-fast) var(--ease-standard)"
    }
  }, React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      background: disabled ? "var(--bz-neutral-300)" : on ? "var(--bz-marigold)" : "var(--bz-white)"
    }
  })), label != null && React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/RunningHead.jsx
try { (() => {
// The running head on every brand-book page: monogram + BRANDEEZE left, section right, thin rule below.
function RunningHead({
  section = "Brand guidelines",
  inverse,
  style
}) {
  const c = inverse ? "var(--bz-white)" : "var(--text-primary)";
  return React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      paddingBottom: 10,
      borderBottom: `var(--hairline) solid ${inverse ? "var(--rule-on-inverse)" : "var(--rule)"}`,
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "var(--tracking-label)",
      textTransform: "uppercase",
      ...style
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      color: c,
      fontWeight: 800
    }
  }, React.createElement(__ds_scope.Monogram, {
    height: 10
  }), "Brandeeze"), React.createElement("div", {
    style: {
      color: inverse ? "var(--text-on-inverse-secondary)" : "var(--text-secondary)",
      fontWeight: 500
    }
  }, section));
}
Object.assign(__ds_scope, { RunningHead });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/RunningHead.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
// Underlined tabs: 2px rule beneath, the active tab gets a Marigold bar.
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  inverse,
  style
}) {
  const items = tabs.map(t => typeof t === "string" ? {
    value: t,
    label: t
  } : t);
  const [inner, setInner] = React.useState(defaultValue ?? items[0]?.value);
  const cur = value ?? inner;
  return React.createElement("div", {
    role: "tablist",
    style: {
      display: "flex",
      gap: 24,
      borderBottom: `var(--rule-width) solid ${inverse ? "var(--rule-on-inverse)" : "var(--rule-subtle)"}`,
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, items.map(t => {
    const on = t.value === cur;
    return React.createElement("button", {
      key: t.value,
      role: "tab",
      "aria-selected": on,
      type: "button",
      onClick: () => {
        if (value === undefined) setInner(t.value);
        onChange && onChange(t.value);
      },
      style: {
        position: "relative",
        background: "none",
        border: 0,
        padding: "10px 0 12px",
        marginBottom: -2,
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 15,
        fontWeight: on ? 700 : 500,
        color: on ? inverse ? "var(--bz-white)" : "var(--text-primary)" : inverse ? "var(--text-on-inverse-secondary)" : "var(--text-secondary)",
        borderBottom: `4px solid ${on ? "var(--bz-marigold)" : "transparent"}`
      }
    }, t.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.BarMarker = __ds_scope.BarMarker;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Monogram = __ds_scope.Monogram;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.SectionLabel = __ds_scope.SectionLabel;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.RunningHead = __ds_scope.RunningHead;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
