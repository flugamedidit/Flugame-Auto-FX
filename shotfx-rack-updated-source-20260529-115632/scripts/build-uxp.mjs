import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

mkdirSync(dist, { recursive: true });

writeFileSync(
  resolve(dist, 'index.html'),
  `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ShotFX Rack</title>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="./app.js"></script>
  </body>
</html>
`
);

writeFileSync(
  resolve(dist, 'style.css'),
  `html,body,#root{width:100%;height:100%;margin:0}body{font-family:Inter,Arial,sans-serif;background:#080808;color:#fff}.app{min-height:100%;background:#080808}.top{position:sticky;top:0;z-index:2;background:rgba(8,8,8,.96);border-bottom:1px solid rgba(255,255,255,.1);backdrop-filter:blur(12px)}.head{padding:14px 16px}.row{display:flex;align-items:center;justify-content:space-between;gap:12px}.title{margin:0;font-size:14px;font-weight:900;letter-spacing:3px;text-transform:uppercase}.sub{margin:4px 0 0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.38)}.badge{border:1px solid rgba(52,211,153,.28);background:rgba(52,211,153,.12);color:#6ee7b7;border-radius:8px;padding:6px 8px;font-size:8px;font-weight:900;letter-spacing:2px;text-transform:uppercase;white-space:nowrap}.context{box-sizing:border-box;margin-top:12px;width:100%;height:56px;resize:none;border:1px solid rgba(255,255,255,.1);background:#000;border-radius:12px;color:#fff;padding:10px 12px;font-size:11px;outline:none}.tabs{display:grid;grid-template-columns:repeat(5,1fr);border-top:1px solid rgba(255,255,255,.06)}.tab{height:56px;border:0;background:transparent;color:rgba(255,255,255,.48);font-size:9px;font-weight:900;letter-spacing:1.5px;text-transform:uppercase}.tab.active{background:#fff;color:#000}.main{max-width:760px;margin:0 auto;padding:16px 16px 40px}.panel{display:none}.panel.active{display:block}.label{display:flex;align-items:center;gap:8px;margin:0 0 10px 2px;font-size:10px;font-weight:800;color:rgba(255,255,255,.62);letter-spacing:1.5px;text-transform:uppercase}.card{border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);border-radius:8px;padding:14px;margin-bottom:14px}.input{box-sizing:border-box;width:100%;min-height:96px;margin-bottom:12px;resize:vertical;border:1px solid rgba(255,255,255,.1);background:#000;border-radius:12px;color:#fff;padding:12px;font-size:11px;outline:none}.button{width:100%;height:44px;border:0;border-radius:12px;background:#fff;color:#000;font-size:10px;font-weight:900;letter-spacing:2px;text-transform:uppercase}.button.blue{background:#3b82f6;color:#fff}.button.purple{background:#9333ea;color:#fff}.output{margin-top:12px;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.42);border-radius:12px;padding:12px;color:rgba(255,255,255,.72);font-size:11px;line-height:1.55}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.slot{aspect-ratio:1;border:1px dashed rgba(255,255,255,.14);border-radius:10px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.35);font-size:10px;text-transform:uppercase}.small{font-size:10px;color:rgba(255,255,255,.46);line-height:1.55}.select{box-sizing:border-box;width:100%;height:38px;border:1px solid rgba(255,255,255,.1);background:#000;color:#fff;border-radius:10px;padding:0 10px;margin-bottom:12px}.split{display:grid;grid-template-columns:1fr 1fr;gap:10px}`
);

writeFileSync(
  resolve(dist, 'app.js'),
  `const state={tab:'vfx'};const panels=['vfx','broll','story','musicVideo','character'];function setTab(id){state.tab=id;document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===id));}function mock(id,text){document.getElementById(id).textContent=text;}document.getElementById('root').innerHTML=\`
<div class="app"><header class="top"><div class="head"><div class="row"><div><h1 class="title">ShotFX Rack</h1><p class="sub">Premiere Pro UXP Panel</p></div><div class="badge">Mock API Mode</div></div><textarea class="context" placeholder="Global song, artist, client, or project context"></textarea></div><nav class="tabs">\${panels.map((id,i)=>\`<button class="tab \${i===0?'active':''}" data-tab="\${id}">\${['VFX','B-Roll','Story','AI MV','Lock'][i]}</button>\`).join('')}</nav></header><main class="main">
<section id="vfx" class="panel active"><div class="label">VFX Rack</div><textarea class="input" placeholder="Lyric or subject matter override"></textarea><textarea class="input" placeholder="Effect mapper JSON"></textarea><button class="button" onclick="mock('vfxOut','Mock VFX prompt: preserve the active Premiere frame, anchor the effect to the performer gesture, match grain, lens blur, lighting, and depth. Future AI generation will run through services/shotfxApi.ts.')">Build Mock VFX Prompt</button><div id="vfxOut" class="output"></div></section>
<section id="broll" class="panel"><div class="label">B-Roll Creator</div><textarea class="input" placeholder="Lyric, word, or prop idea"></textarea><textarea class="input" placeholder="Frame notes or visual direction"></textarea><button class="button blue" onclick="mock('brollOut','Mock B-roll prompt: create a short, cinematic insert idea from the lyric and frame notes. Real image/video calls will be connected later through services/shotfxApi.ts.')">Build Mock B-Roll Prompt</button><div id="brollOut" class="output"></div></section>
<section id="story" class="panel"><div class="label">Story Mode</div><textarea class="input" placeholder="Describe the sequence you want to build"></textarea><button class="button purple" onclick="mock('storyOut','Mock shot plan: establish the active Premiere frame, choose the strongest beat moment, place one VFX or text asset, then route future media requests through the ShotFX API wrapper.')">Build Mock Shot Plan</button><div id="storyOut" class="output"></div></section>
<section id="musicVideo" class="panel"><div class="label">AI Music Video</div><div class="card"><div class="split"><select class="select"><option>Mock Image Engine</option></select><select class="select"><option>Mock Video Engine</option></select></div><textarea class="input" placeholder="Song context / lyric energy"></textarea><button class="button" onclick="mock('mvOut','Mock scenes: Glass Penthouse Pressure, Industrial Alley Flash, Red Room Editorial. No AI generation has been called.')">Generate 3 Scene Options</button><div id="mvOut" class="output"></div></div><div class="grid"><div class="slot">Scene</div><div class="slot">World</div><div class="slot">Mood</div></div></section>
<section id="character" class="panel"><div class="label">Character Lock</div><div class="grid"><div class="slot">Add Ref</div><div class="slot">Sheet</div><div class="slot">Lock</div></div><div class="card"><textarea class="input" placeholder="Name, archetype, description, wardrobe notes"></textarea><button class="button blue" onclick="mock('charOut','Mock character reference sheet created. Save and generation are placeholders until services/shotfxApi.ts is connected.')">Generate Character Ref</button><div id="charOut" class="output"></div></div></section>
</main></div>\`;document.querySelectorAll('.tab').forEach(button=>button.addEventListener('click',()=>setTab(button.dataset.tab)));`
);

console.log(`Built ShotFX Rack UXP panel at ${dist}`);
