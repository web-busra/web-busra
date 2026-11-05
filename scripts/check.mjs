import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
for(const directory of ['src','scripts'])for(const file of await readdir(resolve(root,directory))){if(!/\.(?:mjs|js)$/.test(file))continue;const result=spawnSync(process.execPath,['--check',resolve(root,directory,file)],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);}
console.log('All studio modules passed syntax checks.');
