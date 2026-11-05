import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {scanSourceText,scanWorkflowText,auditProject} from '../scripts/audit.mjs';
import {isPublishable,projectFiles} from '../scripts/project-files.mjs';
import {TEMPLATES,templateDesign,normalizeDesign} from '../src/design.js';
import {LEGACY_TEMPLATES} from '../src/templates.js';

test('Only business templates are discoverable; retired designs remain readable in saved projects',()=>{
  assert.equal(TEMPLATES.length,72);assert.equal(LEGACY_TEMPLATES.length,48);
  for(const item of TEMPLATES){assert.equal(item.commercial,true);assert.ok(!LEGACY_TEMPLATES.some(old=>old.id===item.id));}
  for(const id of ['atelier','orbit','kinetic','social-quote']){
    assert.ok(!TEMPLATES.some(t=>t.id===id));
    const saved=templateDesign(id);assert.equal(saved.template,id);assert.deepEqual(normalizeDesign(saved),saved);
  }
  assert.deepEqual(templateDesign('blank').layers,[]);
});
test('Sector programs retain six editable lines and the new professional footer fields',()=>{
  for(const id of ['pilates-schedule','meeting-agenda','meeting-training']){
    const design=templateDesign(id),details=design.layers.find(l=>l.id==='details');
    assert.equal(details.text.split('\n').length,6);assert.ok(details.maxWidth>0);
    for(const field of ['brand','title','price','details','cta','contact','website','address','terms'])assert.ok(design.layers.some(l=>l.id===field&&l.type==='text'),id+' '+field);
    assert.deepEqual(normalizeDesign(design),design);
  }
});
test('Credential scanner reports rule and location without exposing matched values',()=>{
  const secret='gh'+'p_'+'A'.repeat(36),privateHeader='-----BEGIN '+'PRIVATE KEY-----';
  const results=scanSourceText('src/example.js',secret+'\n'+privateHeader+'\neval(1)');
  assert.deepEqual(results.map(r=>r.rule).sort(),['dynamic-evaluation','github-token','private-key']);
  assert.ok(!JSON.stringify(results).includes(secret));assert.equal(results.find(r=>r.rule==='private-key').line,2);
  assert.deepEqual(scanSourceText('src/example.js','const label = "Örnek işletme";'),[]);
});
test('Release allowlist excludes secrets, personal designs, traversal paths and retired screenshots',()=>{
  for(const name of ['.env','.env.production','.git/config','src/.env','assets/photos/client.forma.json','docs/private.key','docs/editor.png','../index.html','C:/private/index.html','tmp/qa/image.svg','forma-design-studio-github.zip'])assert.equal(isPublishable(name),false,name);
  for(const name of ['index.html','editor.html','src/industries.js','assets/photos/hotel-pool.jpg','docs/IMAGEGEN-PROMPTS.json','.github/workflows/checks.yml','THIRD_PARTY_NOTICES.md'])assert.equal(isPublishable(name),true,name);
  for(const name of ['docs/secrets.json','docs/credentials.json','docs/unreviewed.json','docs/cover.svg','docs/catalog.svg','assets/photos/private-photo.jpg','./index.html','src/app.js.bak','.github/workflows/unknown.yml'])assert.equal(isPublishable(name),false,name);
});

test('Quoted credentials, credential URLs, JWTs and encrypted keys are detected without disclosing values',()=>{
  const value='synthetic-'+'credential',field=['pass','word'].join('');
  const assignment=JSON.stringify({[field]:value});
  const url=['https://','sample:',value,'@service.example/'].join('');
  const jwt=['ey'+'J'+'A'.repeat(12),'B'.repeat(12),'C'.repeat(24)].join('.');
  const header='-----BEGIN '+'ENCRYPTED '+'PRIVATE KEY-----';
  const results=scanSourceText('docs/example.json',[assignment,url,jwt,header].join('\n'));
  assert.deepEqual(results.map(r=>r.rule).sort(),['credential-assignment','credential-url','jwt-token','private-key']);
  for(const sensitive of [value,jwt,url])assert.ok(!JSON.stringify(results).includes(sensitive));
  assert.deepEqual(scanSourceText('docs/example.json',JSON.stringify({[field]:'REDACTED'})),[]);
});

test('Workflow checks flag mutable actions, privileged triggers and write permissions',()=>{
  const name='.github/workflows/review.yml';
  const text=['on: pull_request_target','permissions: write-all','steps:','  - uses: actions/checkout@main'].join('\n');
  assert.deepEqual(scanWorkflowText(name,text).map(r=>r.rule).sort(),['privileged-trigger-review','unpinned-action','workflow-permissions-review']);
  assert.deepEqual(scanWorkflowText(name,'permissions:\n  contents: read\nsteps:\n  - uses: actions/checkout@'+'a'.repeat(40)),[]);
});
test('Actual release sources and all photo hashes pass the static security audit',async()=>{
  const root=resolve(import.meta.dirname,'..'),files=await projectFiles(root),report=await auditProject(root,files);
  assert.deepEqual(report.findings,[]);assert.equal(report.verifiedPhotoAssets,16);assert.ok(report.scannedTextFiles>35);
  assert.ok(files.includes('THIRD_PARTY_NOTICES.md'));assert.ok(!files.some(name=>/(?:editor|preview|mobile|abstract)\.png$/.test(name)));
});
