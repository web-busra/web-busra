// All coordinates are local to the motif's origin; reusable across canvas formats.
const ring=(r,color,width=1)=>`<circle r="${r}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
const burst=(points,outer,inner)=>Array.from({length:points*2},(_,i)=>{const a=(i/(points*2)-.25)*Math.PI*2,r=i%2?inner:outer;return `${i?'L':'M'}${(Math.cos(a)*r).toFixed(2)} ${(Math.sin(a)*r).toFixed(2)}`;}).join(' ')+'Z';
export function motifArt(id,p,a,b,ink){
  const rect=(x,y,w,h,c,rx=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${c}"/>`;
  const circle=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  switch(id){
    case 'atelier':return `<g transform="rotate(-18)">${Array.from({length:10},(_,i)=>`<ellipse rx="143" ry="42" transform="rotate(${i*18})" fill="none" stroke="${p}" stroke-width="14"/>`).join('')}${circle(0,0,25,a)}</g>${circle(-139,108,14,a)}`;
    case 'exhibit':return `${rect(-140,-151,280,302,p)}<path d="M-105 151V-15a105 105 0 0 1 210 0v166" fill="${a}"/><path d="M-69 151V-10a69 69 0 0 1 138 0v161" fill="${b}"/>${circle(0,-109,9,b)}<path d="M-155 152h310" stroke="${ink}"/>`;
    case 'solstice':return `${circle(0,-30,123,a)}${Array.from({length:8},(_,i)=>`<path d="M-158 ${i*19+10}Q0 ${i*19-55} 158 ${i*19+10}" fill="none" stroke="${p}" stroke-width="10"/>`).join('')}`;
    case 'editorial':return `<g transform="rotate(-25)">${Array.from({length:7},(_,i)=>rect(-140+i*40,-145,18,290,i%2?p:a,9)).join('')}</g>${circle(95,-98,39,b)}${circle(95,-98,13,a)}`;
    case 'kinetic':return `<g transform="rotate(22)">${Array.from({length:4},(_,i)=>`<path d="M${-145+i*62} -140v175q0 90 85 90" fill="none" stroke="${i%2?a:p}" stroke-width="29"/>`).join('')}</g>`;
    case 'botanical':return `<path d="M0 154Q-28 20 28-154" fill="none" stroke="${p}" stroke-width="3"/>${[-1,1].map(sign=>Array.from({length:5},(_,i)=>`<ellipse cx="${sign*(31-i*2)}" cy="${100-i*49}" rx="57" ry="22" transform="rotate(${sign*38} ${sign*(31-i*2)} ${100-i*49})" fill="${i%2?a:p}"/>`).join('')).join('')}`;
    case 'orbit':return `${ring(151,p,1.5)}<ellipse rx="176" ry="73" transform="rotate(-38)" fill="none" stroke="${p}" stroke-width="1.5"/><ellipse rx="176" ry="73" transform="rotate(38)" fill="none" stroke="${p}" stroke-width="1.5"/>${circle(-115,-102,16,a)}${circle(116,104,8,p)}`;
    case 'bloom':return `<path d="${Array.from({length:361},(_,i)=>{const t=i/360*Math.PI*2,r=136+Math.cos(t*8)*23;return `${i?'L':'M'}${(Math.cos(t)*r).toFixed(2)} ${(Math.sin(t)*r).toFixed(2)}`;}).join(' ')}Z" fill="${p}"/>${circle(0,0,98,a)}${ring(87,p)}`;
    case 'seal':return `<path d="${burst(24,158,141)}" fill="${p}"/>${ring(120,a)}${ring(112,a,.6)}<path d="${burst(4,12,4)}" transform="translate(0 -92)" fill="${a}"/>${circle(0,99,3,a)}`;
    case 'crest':return `<path d="M-126-146H126V17Q120 111 0 164Q-120 111-126 17Z" fill="${p}"/><path d="M-108-128H108V17Q100 99 0 144Q-100 99-108 17Z" fill="none" stroke="${a}" stroke-width="1.5"/>${[-1,1].map(sign=>Array.from({length:6},(_,i)=>`<ellipse cx="${sign*(98-i*8)}" cy="${39+i*16}" rx="5" ry="12" transform="rotate(${sign*40} ${sign*(98-i*8)} ${39+i*16})" fill="${a}"/>`).join('')).join('')}<path d="M-30-107H30" stroke="${a}"/>`;
    case 'spark':return `<path d="${burst(12,168,112)}" fill="${p}"/>${circle(0,0,86,a)}${ring(77,p)}`;
    case 'halo':return `${circle(0,0,145,p)}${Array.from({length:7},(_,i)=>`<ellipse rx="${156+i*5}" ry="${42+i*7}" transform="rotate(-32)" fill="none" stroke="${a}" stroke-width="1.4"/>`).join('')}`;
    case 'tiles':return `${rect(-158,-158,316,316,p,12)}<path d="M-158 0A158 158 0 0 0 0-158V0ZM158 0A158 158 0 0 0 0 158V0Z" fill="${a}"/>${circle(0,0,89,b)}${circle(-136,136,7,a)}`;
    case 'arch':return `<path d="M-152 152V-7a152 152 0 0 1 304 0v159Z" fill="${p}"/><path d="M-118 152V-5a118 118 0 0 1 236 0v157Z" fill="${a}"/><path d="M-84 152V-3a84 84 0 0 1 168 0v155Z" fill="${b}"/>${circle(0,-116,7,b)}`;
    case 'gridwave':return `<g fill="none" stroke="${p}" stroke-width="1.5">${Array.from({length:18},(_,i)=>`<path d="M-160 ${-158+i*18.5}C-50 ${-158+i*4} 50 ${158-i*4} 160 ${-158+i*18.5}"/>`).join('')}</g>${rect(-95,-39,190,78,b,2)}<path d="M-160-160v320M160-160v320" stroke="${a}" stroke-width="3"/>`;
    case 'prism':return `<path d="M0-170 147-85V85L0 170-147 85V-85Z" fill="${p}"/><path d="M0-170V0L147 85V-85ZM0 0-147 85 0 170 147 85Z" fill="${a}"/><path d="M0-170 0 170M-147-85 147 85M147-85-147 85" stroke="${b}" stroke-width="1.2"/>${circle(0,0,72,p)}`;
    case 'bauhaus':return `${rect(-160,-160,160,160,p)}<path d="M0-160A160 160 0 0 1 160 0H0Z" fill="${a}"/><path d="M-160 0A160 160 0 0 1 0 160H-160Z" fill="${a}"/>${rect(0,0,160,160,p)}${circle(0,0,83,b)}${circle(-115,-115,16,a)}`;
    case 'stacks':return `<g transform="rotate(-14)">${[4,3,2,1,0].map(i=>rect(-123+i*7,-136+i*17,220,248,i%2?a:p,58)).join('')}${rect(-104,-117,182,210,b,42)}</g>`;
    case 'ribbon':return `<path d="M-94-132C127-267 207 29 0 0S-181 229 98 125" fill="none" stroke="${p}" stroke-width="70"/><path d="M-94-132C127-267 207 29 0 0S-181 229 98 125" fill="none" stroke="${a}"/>${circle(-94,-132,12,a)}${circle(98,125,12,a)}${circle(0,0,80,b)}`;
    case 'dune':return `${Array.from({length:10},(_,i)=>`<path d="M-160 ${-140+i*30}Q-70 ${-225+i*35} 0 ${-125+i*27}T160 ${-140+i*30}" fill="none" stroke="${i%2?a:p}" stroke-width="17"/>`).join('')}${rect(-112,-36,224,72,b,36)}`;
    case 'petal':return `${Array.from({length:5},(_,i)=>`<ellipse cx="0" cy="-80" rx="60" ry="100" transform="rotate(${i*72})" fill="${i%2?a:p}"/>`).join('')}${circle(0,0,84,b)}`;
    case 'contour':return `<g transform="rotate(-22)" fill="none" stroke="${p}">${Array.from({length:15},(_,i)=>`<rect x="${-160+i*8}" y="${-148+i*9}" width="${320-i*16}" height="${296-i*18}" rx="${75-i*4}" stroke-width="${i%3===0?2.3:1}"/>`).join('')}</g>${circle(0,0,74,b)}${circle(125,-116,13,a)}`;
    case 'eclipse':return `${circle(-32,-30,136,p)}${circle(47,24,136,a)}${circle(47,24,104,b)}${Array.from({length:7},(_,i)=>`<path d="M-158 ${-115+i*35}h316" stroke="${p}" stroke-opacity=".4" stroke-width=".8"/>`).join('')}${circle(0,0,72,b)}`;
    case 'mobius':return `<path d="M0 0C-215-238-215 238 0 0S215-238 0 0" fill="none" stroke="${p}" stroke-width="65"/><path d="M0 0C-215-238-215 238 0 0S215-238 0 0" fill="none" stroke="${a}" stroke-width="2"/>${circle(0,0,69,b)}`;
    default:return '';
  }
}
