import {rm,mkdir,cp,readFile,writeFile} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});await cp('public','dist',{recursive:true});
for(const path of ['index.html','app.js','style.css','pairings.json','assets/catalog.json']) await readFile(`dist/${path}`);
if(process.env.CPC_CATALOG_URL){const url=new URL(process.env.CPC_CATALOG_URL);if(url.protocol!=='https:')throw Error('Catalog URL must use HTTPS');await writeFile('dist/config.js',`window.CPC_CONFIG = ${JSON.stringify({catalogUrl:url.href,bucket:process.env.CPC_BUCKET||null})};\n`);}
console.log('Built dist/');
