const {test, after} = require('node:test');
const assert = require('node:assert/strict');
const {buildSync} = require('esbuild');
const {mkdtempSync, rmSync} = require('node:fs');
const {join} = require('node:path');
const {NextRequest} = require('next/server');
const dir=mkdtempSync(join(process.cwd(),'.hook-tests-'));
after(()=>rmSync(dir,{recursive:true,force:true}));
buildSync({entryPoints:['middleware.ts'],outfile:join(dir,'middleware.cjs'),bundle:true,platform:'node',format:'cjs',packages:'external'});
const {middleware}=require(join(dir,'middleware.cjs'));
test('middleware forwards daily and interval checks without caching',async t=>{
  const calls=[];
  t.mock.method(globalThis,'fetch',async(url,opts)=>{calls.push([String(url),opts]); return Response.json({allowed:true,didPushupsToday:true})});
  for(const [q,path] of [['d=2026-10-14','/user/alice?local_date=2026-10-14'],['interval_seconds=420','/user/alice/push-permission?interval_seconds=420']]){
    const res=await middleware(new NextRequest('https://gitpushups.com/@alice?'+q));
    assert.equal(await res.text(),'true'); assert.equal(res.headers.get('cache-control'),'no-store');
    assert.equal(calls.at(-1)[0],'https://api.gitpushups.com'+path);assert.equal(calls.at(-1)[1].cache,'no-store');
  }
  for(const q of ['d=','d=2026-02-30','interval_seconds=299','interval_seconds=5.5','interval_seconds=','interval_seconds=300&d=2026-10-14','interval_seconds=300&interval_seconds=400']){
    assert.equal(await (await middleware(new NextRequest('https://gitpushups.com/@alice?'+q))).text(),'false');
  }
  assert.equal(calls.length,2);
  const profile=await middleware(new NextRequest('https://gitpushups.com/@alice'));
  assert.equal(profile.headers.get('x-middleware-rewrite'),'https://gitpushups.com/u/alice/');
});
test('upstream errors, malformed replies and non-boolean values block pushes',async t=>{
  for(const response of [()=>new Response('oops',{status:500}),()=>new Response('not json'),()=>Response.json({allowed:'true'}),()=>Response.json(null),()=>{throw Error('offline')}]){
    const mock=t.mock.method(globalThis,'fetch',response);
    assert.equal(await (await middleware(new NextRequest('https://gitpushups.com/@alice?interval_seconds=300'))).text(),'false');
    mock.mock.restore();
  }
});
