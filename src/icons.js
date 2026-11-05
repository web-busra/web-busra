const icons={
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.6 2.6 0 0 1 5 .7c0 1.7-2.5 1.7-2.5 3.5M12 17h.01"/>',
  undo:'<path d="M4 9h9a7 7 0 0 1 0 14M4 9l5-5M4 9l5 5" transform="translate(1 -2) scale(.9)"/>',
  redo:'<path d="M20 9h-9a7 7 0 0 0 0 14m9-14-5-5m5 5-5 5" transform="translate(1 -2) scale(.9)"/>',
  reset:'<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7"/>',minus:'<path d="M5 12h14"/>',plus:'<path d="M5 12h14M12 5v14"/>',
  bookmark:'<path d="M6 3h12v18l-6-4-6 4V3Z"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  shuffle:'<path d="m16 3 5 5-5 5m5-5h-4C9 8 14 20 3 20m13-9 5 5-5 5m5-5h-3C10 16 12 4 3 4" transform="translate(0 1) scale(.92)"/>',
  code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',link:'<path d="m10 13 4-4m-5 7-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 0 2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 -1)"/>',
  sliders:'<path d="M4 6h6m4 0h6M4 12h2m4 0h10M4 18h10m4 0h2"/><circle cx="12" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="16" cy="18" r="2"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',check:'<path d="m5 12 4 4L19 6"/>',folder:'<path d="M3 7V4h7l2 3h9v13H3V7Z"/>',
  cursor:'<path d="m5 3 14 10-7 1-3 7L5 3Z"/>',text:'<path d="M4 4h16M12 4v16M8 20h8M4 4v3m16-3v3"/>',
  shapes:'<rect x="3" y="3" width="10" height="10" rx="1"/><circle cx="16" cy="16" r="6"/>',grid:'<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18m6-18v18"/>',
  shield:'<path d="m12 3 8 3v6q0 7-8 10-8-3-8-10V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/>',unlock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0M12 14v3"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',hidden:'<path d="m3 3 18 18M10 5c6-1 12 7 12 7a22 22 0 0 1-4 4M6 6a23 23 0 0 0-4 6s4 7 10 7a13 13 0 0 0 4-1M10 10a3 3 0 0 0 4 4"/>',
  up:'<path d="M12 20V4m-6 6 6-6 6 6"/>',down:'<path d="M12 4v16m-6-6 6 6 6-6"/>',duplicate:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M15 8V4H4v11h4"/>',trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  'align-left':'<path d="M4 5h16M4 10h10M4 15h16M4 20h10"/>','align-center':'<path d="M4 5h16M7 10h10M4 15h16M7 20h10"/>','align-right':'<path d="M4 5h16M10 10h10M4 15h16M10 20h10"/>'
};

Object.assign(icons,{
pen:'<path d="m4 16-1 5 5-1L21 7l-5-5L4 16Zm10-12 5 5M4 16l4 4"/>',
upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/>',image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><path d="m3 17 6-6 5 5 3-3 4 4"/>',
chart:'<path d="M3 3v18h18M7 16V9m5 7V5m5 11v-5"/>',trend:'<path d="M3 20h18M4 16l5-7 4 4 7-10m-5 0h5v5"/>',donut:'<path d="M12 3a9 9 0 1 0 9 9h-6a3 3 0 1 1-3-3V3Zm3 0v6h6a9 9 0 0 0-6-6Z"/>',
play:'<path d="m8 4 13 8-13 8V4Z"/>',left:'<path d="m14 5-7 7 7 7"/>',right:'<path d="m10 5 7 7-7 7"/>',paste:'<path d="M9 4H5v17h14V4h-4M9 2h6v5H9V2Z"/>',
group:'<rect x="3" y="3" width="18" height="18" rx="1" stroke-dasharray="3 2"/><path d="M7 7h6v6H7zM11 11h6v6h-6z"/>',ungroup:'<path d="M2 7V2h5m10 0h5v5M2 17v5h5m10 0h5v-5M7 7h5v5H7zm5 5h5v5h-5z"/>'
});
export const icon=name=>`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${Object.hasOwn(icons,name)?icons[name]:''}</svg>`;
export function hydrate(root=document){root.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icon(el.dataset.icon);});}
