import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {projectFiles} from './project-files.mjs';
import {PHOTO_CATALOG} from '../src/photos.js';

// Report locations only: matched credentials must never be printed or stored.
export function scanSourceText(name,text){
  const findings=[];
  const rules=[
    ['private-key',/-----BEGIN (?:RSA |EC |DSA |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/g],
    ['aws-access-key',/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
    ['github-token',/\b(?:gh[pousr]_[A-Za-z0-9]{36,255}|github_pat_[A-Za-z0-9_]{50,255})\b/g],
    ['api-secret',/\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{24,255}\b/g],
    ['jwt-token',/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{16,}\b/g],
    ['credential-url',/\bhttps?:\/\/[^\s/@:'"]+:[^\s/@'"]+@/gi],
    ['credential-assignment',/\b(?:password|passwd|pwd|api[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token)\b["']?\s*[:=]\s*["']([^"'\r\n]+)["']/gi]
  ];
  if(/^src\//.test(name))rules.push(['dynamic-evaluation',/\beval\s*\(|\bnew\s+Function\s*\(/g]);
  if(name.endsWith('.html'))rules.push(
    ['inline-handler',/\son[a-z]+\s*=/gi],
    ['remote-script',/<script[^>]*\bsrc\s*=\s*["'](?:https?:)?\/\//gi],
    ['inline-script',/<script\b(?![^>]*\bsrc\s*=)[^>]*>/gi],
    ['active-url',/\b(?:href|src)\s*=\s*["']\s*javascript:/gi],
    ['unsafe-policy',/'unsafe-(?:inline|eval)'/g]
  );
  for(const [rule,pattern]of rules)for(const match of text.matchAll(pattern)){
    if(rule==='credential-assignment'&&/^(?:<[^>]+>|YOUR_[A-Z_]+|REPLACE_ME|REDACTED|\*+)$/i.test(match[1]))continue;
    findings.push({file:name,rule,line:text.slice(0,match.index).split('\n').length});
  }
  return findings;
}

export function scanWorkflowText(name,text){
  const findings=[];
  for(const match of text.matchAll(/\buses:\s+["']?([^\s"'#]+)/g))if(!/@[a-f0-9]{40}$/i.test(match[1]))findings.push({file:name,rule:'unpinned-action',line:text.slice(0,match.index).split('\n').length});
  if(/\bpull_request_target\b|\bworkflow_run\b/.test(text))findings.push({file:name,rule:'privileged-trigger-review',line:0});
  if(/permissions:\s*["']?write-all\b|^\s*(?:contents|actions|packages|id-token|pull-requests):\s*["']?write\b/m.test(text))findings.push({file:name,rule:'workflow-permissions-review',line:0});
  return findings;
}

export async function auditProject(root,names){
  const files=names||await projectFiles(root),findings=[];let scanned=0;
  for(const name of files){
    if((!['.htaccess','.gitignore'].includes(name)&&!/\.(?:js|mjs|html|css|md|json|ya?ml|txt)$/.test(name))||name==='docs/AUDIT-REPORT.json')continue;
    scanned++;findings.push(...scanSourceText(name,await readFile(resolve(root,name),'utf8')));
  }
  const manifest=JSON.parse(await readFile(resolve(root,'docs/ASSET-MANIFEST.json'),'utf8'));
  const manifestRows=Array.isArray(manifest.assets)?manifest.assets:[],knownPhotos=new Set(PHOTO_CATALOG.map(p=>p.path));
  if(manifestRows.length!==PHOTO_CATALOG.length||new Set(manifestRows.map(a=>a?.file)).size!==PHOTO_CATALOG.length||manifestRows.some(a=>!knownPhotos.has(a?.file)))findings.push({file:'docs/ASSET-MANIFEST.json',rule:'asset-manifest-shape',line:0});
  for(const photo of PHOTO_CATALOG){
    const row=manifestRows.find(a=>a?.file===photo.path),bytes=await readFile(resolve(root,photo.path)),hash=createHash('sha256').update(bytes).digest('hex');
    if(!row||row.sha256!==hash||row.width!==photo.width||row.height!==photo.height||row.bytes!==bytes.length)findings.push({file:photo.path,rule:'asset-integrity',line:0});
  }
  for(const name of ['index.html','editor.html']){
    const html=await readFile(resolve(root,name),'utf8');
    const policy=html.match(/<meta\b[^>]*http-equiv=["']Content-Security-Policy["'][^>]*content="([^"]*)"/i)?.[1];
    const directives=new Map((policy||'').split(';').map(part=>{const [key,...values]=part.trim().split(/\s+/);return [key,values];}));
    const required={'default-src':["'none'"],'script-src':["'self'"],'script-src-attr':["'none'"],'object-src':["'none'"],'base-uri':["'none'"],'form-action':["'none'"],'frame-src':["'none'"]};
    if(!policy||Object.entries(required).some(([key,values])=>JSON.stringify(directives.get(key))!==JSON.stringify(values)))findings.push({file:name,rule:'missing-or-weakened-csp',line:0});
    for(const match of html.matchAll(/<a\b[^>]*>/gi)){
      const attrs=Object.fromEntries([...match[0].matchAll(/([a-z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)].map(m=>[m[1].toLowerCase(),m[2]??m[3]]));
      if(attrs.target?.toLowerCase()==='_blank'&&!attrs.rel?.toLowerCase().split(/\s+/).includes('noopener'))findings.push({file:name,rule:'unprotected-external-link',line:0});
    }
  }
  const workflowNames=(await readdir(resolve(root,'.github/workflows'))).filter(name=>/\.ya?ml$/i.test(name));
  for(const name of workflowNames){
    const file='.github/workflows/'+name,text=await readFile(resolve(root,file),'utf8');
    findings.push(...scanWorkflowText(file,text));
    if(!files.includes(file)){findings.push({file,rule:'unreviewed-workflow',line:0});findings.push(...scanSourceText(file,text));}
  }
  const packageJSON=JSON.parse(await readFile(resolve(root,'package.json'),'utf8'));
  if(Object.keys(packageJSON.dependencies||{}).length||Object.keys(packageJSON.devDependencies||{}).length)findings.push({file:'package.json',rule:'dependency-review-required',line:0});
  return {version:packageJSON.version,generatedAtUtc:new Date().toISOString(),scope:'Static release source and asset checks; not a penetration test, browser audit or legal clearance',releaseFiles:files.length,scannedTextFiles:scanned,scannedWorkflowFiles:workflowNames.length,verifiedPhotoAssets:PHOTO_CATALOG.length,findings};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const root=resolve(import.meta.dirname,'..'),report=await auditProject(root);
  await writeFile(resolve(root,'docs/AUDIT-REPORT.json'),JSON.stringify(report,null,2)+'\n');
  console.log(report.scannedTextFiles+' metin dosyası, '+report.scannedWorkflowFiles+' iş akışı ve '+report.verifiedPhotoAssets+' fotoğraf kontrol edildi. Bulgu: '+report.findings.length);
  if(report.findings.length){console.error(JSON.stringify(report.findings,null,2));process.exitCode=1;}
}
