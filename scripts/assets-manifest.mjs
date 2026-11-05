import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {PHOTO_CATALOG} from '../src/photos.js';
const root=resolve(import.meta.dirname,'..');
const entries=await Promise.all(PHOTO_CATALOG.map(async photo=>{const bytes=await readFile(resolve(root,photo.path));return {file:photo.path,width:photo.width,height:photo.height,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),origin:'AI-generated sample asset; provenance in docs/ASSETS.md',license:'See THIRD_PARTY_NOTICES.md'};}));
await writeFile(resolve(root,'docs/ASSET-MANIFEST.json'),JSON.stringify({schema:1,assets:entries},null,2)+'\n');
console.log(entries.length+' fotoğrafın SHA-256 varlık manifesti oluşturuldu.');
