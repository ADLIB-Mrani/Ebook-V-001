const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const E=require('./engine.js');
const EPUB=require('./ebook-epub.js');
test('offline EPUB 3 is a valid ZIP and contains the evolving roadmap',()=>{
  const p=E.buildPlan({goal:'Devenir développeur web en 6 mois',months:6,hoursPerWeek:8},'2026-11-06T12:00:00Z');
  const done=E.toggle(p,p.weeks[0].tasks[0].id,true,'2026-11-07T12:00:00Z');
  const bytes=EPUB.create(done,E);
  assert.ok(bytes instanceof Uint8Array);
  assert.equal(bytes[0],80);
  assert.equal(bytes[1],75);
  const readable=new TextDecoder().decode(bytes);
  assert.ok(readable.includes('application/epub+zip'));
  assert.ok(readable.includes('OEBPS/chapter.xhtml'));
  assert.ok(readable.includes('Version 2'));
  assert.ok(readable.includes('☑'));
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'traj-epub-'));
  const filename=path.join(dir,'book.epub');
  try{
    fs.writeFileSync(filename,bytes);
    const check=`import zipfile, sys
with zipfile.ZipFile(sys.argv[1]) as z:
 assert z.namelist()[0]=='mimetype'
 assert z.read('mimetype')==b'application/epub+zip'
 assert z.getinfo('mimetype').compress_type==zipfile.ZIP_STORED
 assert z.testzip() is None
 assert b'<package' in z.read('OEBPS/content.opf')
 assert b'<html' in z.read('OEBPS/chapter.xhtml')
`;
    execFileSync('python3',['-c',check,filename],{timeout:15000});
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
