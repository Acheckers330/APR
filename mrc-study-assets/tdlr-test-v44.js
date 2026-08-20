/* TDLR Test v4.4 - based on the PSI MRC outline supplied by the user */
(function(){
  const W={Safety:15,Rules:15,Fungal:7,Principles:30,Equipment:8,Admin:15,Clearance:10};
  const OUTLINE={
    Safety:['Worker Protection','Occupant Protection'],
    Rules:['Role of the Assessment Technician','Role of the Assessment Consultant','Role of the Remediation Contractor','Code of Ethics','Exceptions and Exemptions','Inspections and Investigations','Renewal Requirements','Legal Considerations'],
    Fungal:['Building Ecosystem','Dampness and Health','Microbial Survival and Growth','Secondary Fungal Contamination'],
    Principles:['Antimicrobial Technology and Use','Contents Remediation','Deviations from Standard of Care','Engineering Controls','Five Principles of Remediation','HVAC Remediation','Structural Remediation'],
    Equipment:['Containment Equipment / Tools / Materials','Inspection and Monitoring Tools','Remediation Equipment and Tools'],
    Admin:['Administrative Procedures Required by Rule','Project Documentation Required by Rule','Contracts'],
    Clearance:['Post-Remediation Verification and Clearance Criteria']
  };

  const EXTRA=[
    {id:'tdlr_s1',q:'A worker must enter containment wearing a tight-fitting respirator. What must already be completed?',o:['Fit test and medical clearance','Clearance sampling','Lab identification','Property inspection'],a:0,c:'Safety',e:'Required respirator use depends on a proper respiratory protection program.',scored:true},
    {id:'tdlr_s2',q:'Who should be protected from remediation dust outside containment?',o:['Occupants and adjacent workers','Only the remediator','Only the consultant','Only the owner'],a:0,c:'Safety',e:'Engineering controls protect workers and building occupants.',scored:true},
    {id:'tdlr_r1',q:'Who writes the remediation protocol?',o:['MAC','MRC','Mold worker','Owner'],a:0,c:'Rules',e:'The licensed Mold Assessment Consultant develops the protocol.',scored:true},
    {id:'tdlr_r2',q:'Who prepares the remediation work plan?',o:['MRC','MAC','Laboratory','Adjuster'],a:0,c:'Rules',e:'The MRC prepares the work plan from the protocol.',scored:true},
    {id:'tdlr_r3',q:'A licensed remediator is hired for a project below the notification threshold. Which is true?',o:['Applicable license rules still apply','No rules apply','A protocol is prohibited','Only the owner may work'],a:0,c:'Rules',e:'The minimum-area exemption does not erase other duties of a licensed remediator.',scored:true},
    {id:'tdlr_r4',q:'Assessment and remediation on the same Texas project are generally:',o:['Separated','Always performed by one company','Optional only on commercial work','Controlled by the insurer'],a:0,c:'Rules',e:'Texas generally separates assessment and remediation roles, subject to limited exceptions.',scored:true},
    {id:'tdlr_f1',q:'What most directly controls indoor mold growth?',o:['Moisture','Light','Paint color','Air temperature alone'],a:0,c:'Fungal',e:'Moisture control is the key practical control.',scored:true},
    {id:'tdlr_f2',q:'Secondary fungal contamination means:',o:['Spread to previously unaffected areas','A second mold species only','Outdoor mold growth','Normal settled dust'],a:0,c:'Fungal',e:'Secondary contamination is unwanted spread beyond the original affected area.',scored:true},
    {id:'tdlr_p1',q:'What is the first priority in durable mold remediation?',o:['Correct the moisture source','Apply fragrance','Paint the surface','Run the HVAC'],a:0,c:'Principles',e:'Remediation is not durable until the moisture source is corrected.',scored:true},
    {id:'tdlr_p2',q:'Why is killing mold alone insufficient?',o:['Contamination still must be physically removed','It increases humidity','It disables HEPA filters','It prevents drying'],a:0,c:'Principles',e:'Dead fungal material can remain allergenic and must still be cleaned or removed.',scored:true},
    {id:'tdlr_p3',q:'A containment wall is pulled inward. This indicates:',o:['Negative pressure','Positive pressure','No airflow','High temperature'],a:0,c:'Principles',e:'Inward movement is a visual sign of negative pressure.',scored:true},
    {id:'tdlr_p4',q:'A containment breach occurs during demolition. What should happen first?',o:['Stop and repair the breach','Finish demolition','Open doors','Turn off filtration'],a:0,c:'Principles',e:'The breach should be controlled before more disturbance continues.',scored:true},
    {id:'tdlr_p5',q:'A contaminated HVAC system should generally be:',o:['Isolated until properly addressed','Run at high speed','Used for exhaust','Ignored if cooling works'],a:0,c:'Principles',e:'HVAC operation can spread contamination.',scored:true},
    {id:'tdlr_p6',q:'Which material is usually a better cleaning candidate?',o:['Metal shelving','Wet drywall','Ceiling tile','Fiberglass insulation'],a:0,c:'Principles',e:'Nonporous materials can often be cleaned; heavily contaminated porous materials are often removed.',scored:true},
    {id:'tdlr_p7',q:'What does a deviation from the planned remediation method require?',o:['Documentation and proper authorization','No record','Owner verbal approval only','Automatic clearance'],a:0,c:'Principles',e:'Changes from the planned approach should be documented and handled through the project requirements.',scored:true},
    {id:'tdlr_e1',q:'Which tool checks pressure difference across containment?',o:['Manometer','Hygrometer','Borescope','Moisture meter'],a:0,c:'Equipment',e:'A manometer or pressure differential gauge monitors containment pressure.',scored:true},
    {id:'tdlr_e2',q:'Which tool screens building materials for elevated moisture?',o:['Moisture meter','Manometer','Air scrubber','Tape lift'],a:0,c:'Equipment',e:'A moisture meter is used to compare moisture conditions in materials.',scored:true},
    {id:'tdlr_e3',q:'A HEPA negative air machine is used to:',o:['Filter air and support directional airflow','Measure RH','Identify species','Replace containment'],a:0,c:'Equipment',e:'Negative air machines support containment and filtration.',scored:true},
    {id:'tdlr_a1',q:'The work plan should be based on the:',o:['Remediation protocol','Insurance estimate','Lab invoice','Worker preference'],a:0,c:'Admin',e:'The work plan translates the protocol into the contractor means and methods.',scored:true},
    {id:'tdlr_a2',q:'Why keep daily project logs?',o:['Document conditions and work performed','Replace the protocol','Identify species','Avoid clearance'],a:0,c:'Admin',e:'Daily logs create a contemporaneous record of project conditions and activities.',scored:true},
    {id:'tdlr_a3',q:'Which document tracks a sample from collection through transfer?',o:['Chain of custody','Work authorization','Invoice','Equipment log'],a:0,c:'Admin',e:'Chain of custody documents sample identity and handling.',scored:true},
    {id:'tdlr_c1',q:'Who performs regulated post-remediation clearance?',o:['MAC','MRC','Mold worker','Adjuster'],a:0,c:'Clearance',e:'The licensed assessment side performs the post-remediation assessment.',scored:true},
    {id:'tdlr_c2',q:'Visible debris remains after cleanup. What is the proper clearance result?',o:['Not ready to pass','Pass if air is dry','Pass if odor is gone','Pass if owner approves'],a:0,c:'Clearance',e:'The area must be visibly clean and meet the project clearance criteria.',scored:true},
    {id:'tdlr_c3',q:'When should containment be removed on a regulated project?',o:['After required clearance notice','Immediately after demolition','Before final cleaning','When equipment is removed'],a:0,c:'Clearance',e:'Containment remains until the required clearance conditions and notice are satisfied.',scored:true}
  ];

  function mix(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;}
  function cloneQ(q,suffix){return {...q,id:(q.id||'q')+suffix,o:[...q.o]};}
  function buildTDLR(){
    const pool=[...BANK.filter(x=>x.scored!==false),...EXTRA];
    const chosen=[];
    const used=new Set();
    Object.entries(W).forEach(([cat,n])=>{
      let p=mix(pool.filter(x=>x.c===cat));
      for(let i=0;i<n;i++){
        if(!p.length) continue;
        let q=p[i%p.length];
        const copy=cloneQ(q,'_tdlr_'+cat+'_'+i+'_'+Date.now());
        copy.scored=true;
        chosen.push(copy);
        used.add(q.id);
      }
    });
    let extras=mix(BANK.filter(x=>!used.has(x.id)));
    if(extras.length<10) extras=extras.concat(mix(BANK));
    const non=extras.slice(0,10).map((q,i)=>{const c=cloneQ(q,'_tdlr_ns_'+i+'_'+Date.now());c.scored=false;return c;});
    return mix(chosen.concat(non));
  }

  window.tdlrMenu=function(){
    menuPill.textContent='TDLR Test';
    menuTitle.textContent='Texas MRC TDLR Test';
    const rows=Object.entries(W).map(([k,v])=>'<div class="cat"><b>'+esc(FRIEND[k]||k)+'</b><span>'+v+' scored</span></div>').join('');
    menuBody.innerHTML='<div class="banner" style="margin-bottom:14px">Built from the PSI MRC outline in your study sheet. 100 scored questions + 10 non-scored practice questions.</div>'+rows+'<div class="review" style="margin-top:14px"><b>Timing</b><p class="muted">145 minutes scored + 20 minutes non-scored • 70% passing target</p></div><button class="btn" style="width:100%;margin-top:12px" onclick="startTDLR()">Start TDLR Test</button>';
    show('menu');
  };

  window.startTDLR=function(){
    begin(buildTDLR(),'TDLR Test • PSI MRC Outline',false,true);
  };

  try{
    const grid=document.querySelector('#home .grid');
    if(grid&&!document.getElementById('tdlrTile')){
      const b=document.createElement('button');
      b.className='tile';b.id='tdlrTile';b.onclick=window.tdlrMenu;
      b.innerHTML='<div class="ico">🏛️</div><h3>TDLR Test</h3><p>110-question test weighted to the PSI MRC outline you provided.</p>';
      const full=[...grid.querySelectorAll('.tile')].find(x=>/Full 110/i.test(x.textContent));
      if(full&&full.nextSibling) grid.insertBefore(b,full.nextSibling); else grid.appendChild(b);
    }
    const version=document.querySelector('.version');
    if(version) version.textContent='MRC Study System v4.4 • TDLR Test added';
    const banner=document.querySelector('.banner');
    if(banner) banner.textContent='TDLR Test added: exact PSI MRC section weighting, shuffled questions, and mixed A/B/C/D answers every attempt.';
  }catch(e){console.error('TDLR Test setup',e);}
})();
