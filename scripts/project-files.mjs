import {readdir,lstat,realpath} from 'node:fs/promises';
import {resolve,relative,join,isAbsolute} from 'node:path';
import {PHOTO_CATALOG} from '../src/photos.js';

export const ROOT_FILES=['index.html','editor.html','styles.css','studio.css','business.css','workspace.css','editor.css','favicon.svg','README.md','CONTRIBUTING.md','CHANGELOG.md','SECURITY.md','THIRD_PARTY_NOTICES.md','LICENSE.txt','package.json','.gitignore','.nojekyll','.htaccess'];
const directories=['src','assets','docs','scripts','tests','.github'];
const documents=new Set(['ARCHITECTURE.md','ASSETS.md','ASSET-MANIFEST.json','AUDIT-REPORT.json','IMAGEGEN-PROMPTS.json','GITHUB-YUKLEME.md','QA.md','RELEASE-REVIEW.md','cover.png','catalog.png']);
const githubFiles=new Set(['.github/workflows/checks.yml','.github/dependabot.yml','.github/PULL_REQUEST_TEMPLATE.md']);
const photoFiles=new Set(PHOTO_CATALOG.map(photo=>photo.path));
export function isPublishable(name){
  const path=name.replaceAll('\\','/');
  if(path.startsWith('/')||/^[a-z]:/i.test(path)||path.split('/').some(part=>part==='..'||part==='.'||!part))return false;
  if(/(?:^|\/)(?:\.git|\.codex|\.agents|node_modules|tmp|coverage|\.env[^/]*|(?:credentials?|secrets?|id_rsa)(?:\.[^/]*)?)(?:\/|$)|(?:~|\.(?:pem|key|pfx|p12|keystore|forma\.json|zip|bak|backup|old|orig|save|swp|swo))$/i.test(path))return false;
  if(ROOT_FILES.includes(path))return true;
  return /^src\/[a-z-]+\.js$/.test(path)||photoFiles.has(path)||/^scripts\/[a-z-]+\.mjs$/.test(path)||/^tests\/[a-z-]+\.test\.mjs$/.test(path)||githubFiles.has(path)||(path.startsWith('docs/')&&documents.has(path.slice(5)));
}
export async function projectFiles(root){
  const base=await realpath(root),names=[];
  async function inspect(name,walk=false){
    const path=resolve(base,name),info=await lstat(path);
    if(info.isSymbolicLink())throw Error('Sembolik bağlantı pakete alınamaz: '+name);
    const target=await realpath(path),outside=relative(base,target);
    if(outside.startsWith('..')||isAbsolute(outside))throw Error('Paket yolu proje klasörünün dışında: '+name);
    if(info.isDirectory()){
      if(!walk)return;
      for(const child of await readdir(path,{withFileTypes:true}))await inspect(join(name,child.name),true);
    }else if(info.isFile()&&isPublishable(name))names.push(name.replaceAll('\\','/'));
  }
  for(const name of ROOT_FILES)await inspect(name);
  for(const name of directories)await inspect(name,true);
  return [...new Set(names)].sort();
}
