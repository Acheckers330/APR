/* MRC v4.2 hard-mode upgrades: balanced answers, shuffled full exam, cleaner test screen */
(function(){
  const originalBegin = begin;
  const originalRender = render;
  const originalRandomMenu = randomMenu;
  const originalExamMenu = examMenu;

  function shuffledCopy(a){
    a=[...a];
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  function remixOne(x,target){
    const y={...x,o:[...x.o]};
    if(!Array.isArray(y.o)||y.o.length<2) return y;
    const correct=y.o[y.a];
    const distractors=shuffledCopy(y.o.filter((_,i)=>i!==y.a));
    const slots=Math.min(4,y.o.length);
    target=target%slots;
    const mixed=new Array(y.o.length);
    mixed[target]=correct;
    let d=0;
    for(let i=0;i<mixed.length;i++) if(i!==target) mixed[i]=distractors[d++];
    y.o=mixed;
    y.a=target;
    return y;
  }

  function remixBalanced(qs){
    const targets=shuffledCopy(qs.map((_,i)=>i%4));
    return qs.map((x,i)=>remixOne(x,targets[i]));
  }

  function concise(q){
    return String(q)
      .replace(/^Which statement best describes /i,'Which best describes ')
      .replace(/^Which statement best reflects /i,'Which best reflects ')
      .replace(/^Which statement about (.+?) best reflects (?:the course|the manual)\?$/i,'Which statement about $1 is correct?')
      .replace(/^According to (?:the course|the manual),\s*/i,'')
      .replace(/^The course describes /i,'')
      .replace(/^The manual describes /i,'')
      .replace(/\s+primarily to:/i,' to:')
      .replace(/\s+generally must:/i,' must:')
      .replace(/\s+generally should:/i,' should:')
      .replace(/\s{2,}/g,' ')
      .trim();
  }

  begin=function(qs,label,instant,timed){
    const isDrill = /Quiz$|Missed Questions/i.test(label);
    const mixed = remixBalanced(qs);
    originalBegin(mixed,label,isDrill?instant:false,timed);
  };

  startExam=function(){
    begin(shuffledCopy(EXAM1),'Full 110-Question MRC Simulation',false,true);
  };

  startRandom=function(n){
    const qs=shuffledCopy(BANK).slice(0,Math.min(n,BANK.length));
    begin(qs,n+' Random Questions',false,false);
  };

  randomMenu=function(){
    menuPill.textContent='Random Tests';
    menuTitle.textContent='Choose test length';
    menuBody.innerHTML=[10,25,50,100].map(n=>'<button class="opt" onclick="startRandom('+n+')"><b>'+n+' Question Test</b><br><span class="muted">Mixed questions • answers hidden until submit</span></button>').join('');
    show('menu');
  };

  examMenu=function(){
    menuPill.textContent='Full Exam';
    menuTitle.textContent='110-question hard simulation';
    menuBody.innerHTML='<button class="opt" onclick="startExam()"><b>Full 110-Question MRC Simulation</b><br><span class="muted">Shuffled questions • balanced A/B/C/D answers • 165 minutes</span></button>';
    show('menu');
  };

  render=function(){
    originalRender();
    if(!S||!S.qs||!S.qs.length) return;
    const x=S.qs[S.i];
    num.textContent='Question '+(S.i+1)+' of '+S.qs.length;
    question.textContent=concise(x.q);
  };

  try{
    const version=document.querySelector('.version');
    if(version) version.textContent='MRC Study System v4.2 • harder mixed-answer test build';
    const banner=document.querySelector('.banner');
    if(banner) banner.textContent='Harder test mode: questions are shuffled, correct answers are balanced across A/B/C/D, and exam clues are hidden.';
    const fullTile=[...document.querySelectorAll('.tile h3')].find(x=>/Full 110 Exam/i.test(x.textContent));
    if(fullTile){
      const p=fullTile.parentElement.querySelector('p');
      if(p) p.textContent='Harder 110-question simulation with shuffled questions and mixed A/B/C/D answers.';
    }
  }catch(e){}
})();
