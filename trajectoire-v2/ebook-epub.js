/* EPUB 3 exporter with no CDN, dependency, paid API or server. */
(function(root,factory){const api=factory();if(typeof module!=='undefined'&&module.exports)module.exports=api;if(root)root.TrajectoireEPUB=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const enc = new TextEncoder();
function xml(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');}
function crc32(bytes) {
  let crc = 0xffffffff;
  for(const b of bytes){crc ^= b;for(let i=0;i<8;i++)crc=(crc>>>1) ^ (crc&1?0xedb88320:0);}
  return (crc^0xffffffff)>>>0;
}
function join(arrays){
  const n=arrays.reduce((sum,a)=>sum+a.length,0);const out=new Uint8Array(n);let offset=0;
  for(const a of arrays){out.set(a,offset);offset+=a.length;}return out;
}
function storedZip(files){
  const local=[],central=[];let offset=0;
  for(const [name,content] of files){
    const filename=enc.encode(name),body=enc.encode(content),checksum=crc32(body);
    if(filename.length>65535)throw new Error('Nom de fichier EPUB trop long.');
    const l=new Uint8Array(30+filename.length),v=new DataView(l.buffer);
    v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x0800,true);
    v.setUint16(8,0,true);v.setUint32(14,checksum,true);v.setUint32(18,body.length,true);
    v.setUint32(22,body.length,true);v.setUint16(26,filename.length,true);l.set(filename,30);
    local.push(l,body);
    const c=new Uint8Array(46+filename.length),cv=new DataView(c.buffer);
    cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint16(8,0x0800,true);
    cv.setUint32(16,checksum,true);cv.setUint32(20,body.length,true);cv.setUint32(24,body.length,true);
    cv.setUint16(28,filename.length,true);cv.setUint32(42,offset,true);c.set(filename,46);
    central.push(c);
    offset+=l.length+body.length;
  }
  const directory=join(central),end=new Uint8Array(22),view=new DataView(end.buffer);
  view.setUint32(0,0x06054b50,true);view.setUint16(8,files.length,true);
  view.setUint16(10,files.length,true);view.setUint32(12,directory.length,true);
  view.setUint32(16,offset,true);
  return join([...local,directory,end]);
}
function toMarkup(markdown){
  const lines=markdown.split(/\r?\n/);
  const html=[];let list=false;
  function close(){if(list){html.push('</ul>');list=false;}}
  for(const original of lines){
    const line=original.trim();
    if(!line){close();continue;}
    if(line==='---'){close();html.push('<hr/>');continue;}
    const match=/^(#{1,4})\s+(.*)$/.exec(line);
    if(match){close();const level=match[1].length;html.push('<h'+level+'>'+xml(match[2])+'</h'+level+'>');continue;}
    if(line.startsWith('- ')){if(!list){html.push('<ul>');list=true;}
      const item=line.slice(2).replace(/^\[([x ])\]\s*/i,(whole,v)=>v.toLowerCase()==='x'?'☑ ':'☐ ');
      html.push('<li>'+xml(item)+'</li>');continue;}
    close();
    if(line.startsWith('>'))html.push('<blockquote>'+xml(line.slice(1).trim())+'</blockquote>');
    else html.push('<p>'+xml(line)+'</p>');
  }
  close();return html.join('\n');
}
function create(plan, engine){
  if(!plan||plan.schema!==2||!plan.profile||!engine||typeof engine.markdown!=='function')throw new Error('Plan Trajectoire et moteur requis.');
  const title=String(plan.profile.goal).slice(0,200);
  const modified=new Date(plan.updatedAt||Date.now()).toISOString().replace(/\.\d{3}Z$/,'Z');
  const markup=toMarkup(engine.markdown(plan));
  const files=[
    ['mimetype','application/epub+zip'],
    ['META-INF/container.xml','<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'],
    ['OEBPS/content.opf','<?xml version="1.0" encoding="UTF-8"?>\n<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">'+xml('urn:trajectoire:'+plan.id)+'</dc:identifier><dc:title>'+xml(title)+'</dc:title><dc:language>fr</dc:language><dc:creator>Trajectoire — utilisateur</dc:creator><meta property="dcterms:modified">'+modified+'</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="chapter" href="chapter.xhtml" media-type="application/xhtml+xml"/><item id="style" href="style.css" media-type="text/css"/></manifest><spine><itemref idref="chapter"/></spine></package>'],
    ['OEBPS/nav.xhtml','<?xml version="1.0" encoding="UTF-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="fr"><head><title>Sommaire</title></head><body><nav epub:type="toc" id="toc"><h1>Sommaire</h1><ol><li><a href="chapter.xhtml">Mon parcours</a></li></ol></nav></body></html>'],
    ['OEBPS/chapter.xhtml','<?xml version="1.0" encoding="UTF-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml" lang="fr"><head><title>'+xml(title)+'</title><link rel="stylesheet" type="text/css" href="style.css"/></head><body><main>'+markup+'</main></body></html>'],
    ['OEBPS/style.css','body{font-family:serif;line-height:1.6;color:#182338;margin:1.2em}h1,h2,h3{font-family:sans-serif;color:#234a40}h1{font-size:1.7em}h2{font-size:1.3em;margin-top:1.6em}li{margin-bottom:.35em}blockquote{border-left:3px solid #79ac80;padding-left:1em;color:#496054}p,li{overflow-wrap:anywhere}']
  ];
  return storedZip(files);
}
return {create,storedZip,toMarkup};
});
