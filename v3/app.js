const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

const state = {
  capturing:false,
  captured:[],
  twinBuilt:false,
  mode:'guided',
  practiceChoice:null,
  assessment:{asset:null,priority:null,action:null},
  readiness:null
};

const steps = [
  {id:'customer',label:'Select customer',detail:'Pilbara Iron Operations',kind:'CONTEXT'},
  {id:'asset',label:'Choose serialized asset',detail:'PX-440 · HPU-77821',kind:'OBJECT'},
  {id:'issue',label:'Capture symptom + impact',detail:'Pressure drops after 20 min',kind:'EVIDENCE'},
  {id:'priority',label:'Set response priority',detail:'High · same-day response',kind:'DECISION'},
  {id:'create',label:'Create work order',detail:'Dispatch-ready record',kind:'OUTCOME'}
];

function setStatus(id,text,cls){
  const el=$(id);
  if(!el) return;
  el.textContent=text;
  el.className='status-pill'+(cls?' '+cls:'');
}

function resetFields(){
  $$('.field-block').forEach(function(x){x.classList.remove('current','completed');});
  $('#submitJob').disabled=true;
}

function makeEmptyGraph(){
  const canvas=$('#graphCanvas');
  canvas.innerHTML='';
  const empty=document.createElement('div');
  empty.className='graph-empty';
  empty.id='graphEmpty';
  empty.innerHTML='<span>◎</span><strong>No workflow captured yet</strong><p>Start on the left and perform the task once.</p>';
  canvas.appendChild(empty);
}

function updateReadiness(score){
  if(score==null){
    $('#readinessScore').textContent='Not measured';
    $('#readinessRingText').textContent='—';
    $('#readinessRing').style.background='conic-gradient(var(--teal) 0deg,#e6e8e4 0deg)';
    $('#readinessCopy').textContent='Generate the Training Twin, then complete Assessment.';
    return;
  }
  $('#readinessScore').textContent=score+'% role ready';
  $('#readinessRingText').textContent=score+'%';
  $('#readinessRing').style.background='conic-gradient(var(--teal) '+(score*3.6)+'deg,#e6e8e4 0deg)';
  $('#readinessCopy').textContent=score===100
    ? 'Independent task performance demonstrated.'
    : 'Additional practice required before production.';
}

function startCapture(){
  state.capturing=true;
  state.captured=[];
  state.twinBuilt=false;
  state.readiness=null;
  state.practiceChoice=null;
  state.assessment={asset:null,priority:null,action:null};

  resetFields();
  makeEmptyGraph();
  $('#inferenceCard').hidden=true;
  $('#buildTwin').disabled=true;
  $('#twinPlaceholder').hidden=false;
  $('#twinApp').hidden=true;
  $('#impactPanel').hidden=true;
  $('#regenResult').hidden=true;
  $('#simulateChange').disabled=true;

  setStatus('#captureStatus','CAPTURING','live');
  setStatus('#graphStatus','LISTENING','live');
  setStatus('#twinStatus','NOT BUILT','');

  const first=$('.field-block[data-step="customer"]');
  if(first) first.classList.add('current');
  updateReadiness(null);
}

function addGraphNode(step,index){
  const empty=$('#graphEmpty');
  if(empty) empty.hidden=true;

  const canvas=$('#graphCanvas');
  const node=document.createElement('div');
  node.className='graph-node';
  node.innerHTML='<b>'+String(index).padStart(2,'0')+'</b><div><small>'+step.kind+'</small><strong>'+step.label+'</strong><small>'+step.detail+'</small></div>';
  canvas.appendChild(node);

  if(index<steps.length){
    const line=document.createElement('div');
    line.className='graph-line';
    canvas.appendChild(line);
  }
}

function captureStep(stepId){
  if(!state.capturing) return;

  const expected=steps[state.captured.length];
  if(!expected || expected.id!==stepId) return;

  state.captured.push(stepId);

  const block=$('.field-block[data-step="'+stepId+'"]');
  if(block){
    block.classList.remove('current');
    block.classList.add('completed');
  }

  addGraphNode(expected,state.captured.length);

  const next=steps[state.captured.length];
  if(next && next.id==='create'){
    $('#submitJob').disabled=false;
  }else if(next){
    const nextBlock=$('.field-block[data-step="'+next.id+'"]');
    if(nextBlock) nextBlock.classList.add('current');
  }
}

function captureSubmit(){
  if(!state.capturing) return;

  const expected=steps[state.captured.length];
  if(!expected || expected.id!=='create') return;

  state.captured.push('create');
  addGraphNode(expected,state.captured.length);
  state.capturing=false;
  $('#submitJob').disabled=true;

  setStatus('#captureStatus','CAPTURE COMPLETE','done');
  setStatus('#graphStatus','MODEL READY','done');
  $('#inferenceCard').hidden=false;
  $('#buildTwin').disabled=false;
}

function guidedWhy(id){
  const map={
    customer:'Customer and site context drive SLA, contacts and commercial context.',
    asset:'Serialized asset history prevents generic or wrong-equipment work.',
    issue:'Record observed symptoms without inventing an unconfirmed diagnosis.',
    priority:'Priority reflects operational impact and the agreed response window.',
    create:'Create only when the record is complete enough for dispatch without clarification.'
  };
  return map[id]||'';
}

function addChoiceQuestion(root,label,options,onPick,selected){
  const box=document.createElement('div');
  box.className='practice-question';

  const title=document.createElement('strong');
  title.textContent=label;
  box.appendChild(title);

  const list=document.createElement('div');
  list.className='choice-list';

  options.forEach(function(value){
    const button=document.createElement('button');
    button.type='button';
    button.className='choice-btn'+(selected===value?' selected':'');
    button.textContent=value;
    button.addEventListener('click',function(){onPick(value);});
    list.appendChild(button);
  });

  box.appendChild(list);
  root.appendChild(box);
}

function addAssessment(root,key,label,options){
  addChoiceQuestion(
    root,
    label,
    options,
    function(value){
      state.assessment[key]=value;
      renderTwin();
    },
    state.assessment[key]
  );
}

function renderTwin(){
  const root=$('#twinContent');
  root.innerHTML='';

  const banner=document.createElement('div');
  banner.className='guide-banner'+(state.mode==='practice'?' practice':state.mode==='assessment'?' assessment':'');
  banner.innerHTML='<b>'+state.mode.toUpperCase()+' MODE</b><br>'+(
    state.mode==='guided'
      ? 'Follow the preferred path with explanation and context.'
      : state.mode==='practice'
        ? 'The path is yours. Coaching is reduced.'
        : 'No coaching. Complete the critical decisions correctly.'
  );
  root.appendChild(banner);

  if(state.mode==='guided'){
    steps.forEach(function(step,index){
      const item=document.createElement('div');
      item.className='twin-step';
      item.innerHTML='<span>STEP '+(index+1)+' · '+step.kind+'</span><strong>'+step.label+'</strong><p>'+guidedWhy(step.id)+'</p>';
      root.appendChild(item);
    });
    return;
  }

  if(state.mode==='practice'){
    addChoiceQuestion(
      root,
      'What comes immediately after selecting the customer?',
      ['Choose the serialized asset','Set the priority','Create the work order'],
      function(value){
        state.practiceChoice=value;
        renderTwin();
      },
      state.practiceChoice
    );

    const feedback=document.createElement('div');
    feedback.className='twin-step';
    let text='Try it without the step-by-step explanation.';
    if(state.practiceChoice){
      text=state.practiceChoice==='Choose the serialized asset'
        ? 'Correct. You are following the Preferred Path.'
        : 'Not quite. Reconstruct the work, not the menu.';
    }
    feedback.innerHTML='<span>YOUR CURRENT PATH</span><strong>'+(state.practiceChoice||'Choose the next step')+'</strong><p>'+text+'</p>';
    root.appendChild(feedback);
    return;
  }

  addAssessment(root,'asset','Which asset should this work order reference?',['PX-440 · HPU-77821','Generic HPU family','No asset required']);
  addAssessment(root,'priority','What priority matches the scenario?',['Low','High · same-day response','Critical · emergency shutdown']);
  addAssessment(root,'action','What is the final action?',['Create work order','Open Schedule Board first','Email the technician']);

  const submit=document.createElement('button');
  submit.type='button';
  submit.className='assessment-submit';
  submit.textContent='Check readiness';
  submit.addEventListener('click',checkAssessment);
  root.appendChild(submit);

  const result=document.createElement('div');
  result.id='assessmentResult';
  root.appendChild(result);
}

function buildTwin(){
  if(state.captured.length!==steps.length) return;

  state.twinBuilt=true;
  state.mode='guided';

  $('#twinPlaceholder').hidden=true;
  $('#twinApp').hidden=false;
  $('#simulateChange').disabled=false;
  setStatus('#twinStatus','TWIN READY','live');

  $$('.mode-tab').forEach(function(button){
    button.classList.toggle('active',button.dataset.mode==='guided');
  });

  renderTwin();
}

function checkAssessment(){
  const correct=
    state.assessment.asset==='PX-440 · HPU-77821' &&
    state.assessment.priority==='High · same-day response' &&
    state.assessment.action==='Create work order';

  const answered=Object.values(state.assessment).filter(Boolean).length;
  const score=correct?100:Math.round((answered/3)*60);

  state.readiness=score;
  updateReadiness(score);

  const target=$('#assessmentResult');
  target.className='assessment-result '+(correct?'pass':'fail');
  target.textContent=correct
    ? 'PASS · This learner can complete the critical decisions independently.'
    : 'NOT READY · Review the workflow and retry the assessment.';
}

function simulateChange(){
  if(!state.twinBuilt) return;
  $('#impactPanel').hidden=false;
  $('#impactPanel').scrollIntoView({behavior:'smooth',block:'center'});
}

function regenerate(){
  $('#regenResult').hidden=false;
  $('#regenerateAssets').disabled=true;
  $('#regenerateAssets').textContent='Regenerated';
}

function resetAll(){
  state.capturing=false;
  state.captured=[];
  state.twinBuilt=false;
  state.mode='guided';
  state.practiceChoice=null;
  state.assessment={asset:null,priority:null,action:null};
  state.readiness=null;

  resetFields();
  makeEmptyGraph();

  $('#inferenceCard').hidden=true;
  $('#buildTwin').disabled=true;
  $('#twinPlaceholder').hidden=false;
  $('#twinApp').hidden=true;
  $('#impactPanel').hidden=true;
  $('#regenResult').hidden=true;
  $('#regenerateAssets').disabled=false;
  $('#regenerateAssets').textContent='Regenerate affected assets';
  $('#simulateChange').disabled=true;

  setStatus('#captureStatus','NOT CAPTURING','');
  setStatus('#graphStatus','WAITING','');
  setStatus('#twinStatus','NOT BUILT','');
  updateReadiness(null);
}

$('#startCapture').addEventListener('click',startCapture);

$$('.field-button').forEach(function(button){
  button.addEventListener('click',function(){
    captureStep(button.closest('.field-block').dataset.step);
  });
});

$('#submitJob').addEventListener('click',captureSubmit);
$('#buildTwin').addEventListener('click',buildTwin);
$('#resetAll').addEventListener('click',resetAll);
$('#simulateChange').addEventListener('click',simulateChange);
$('#regenerateAssets').addEventListener('click',regenerate);

$$('.mode-tab').forEach(function(button){
  button.addEventListener('click',function(){
    state.mode=button.dataset.mode;
    $$('.mode-tab').forEach(function(other){
      other.classList.toggle('active',other===button);
    });
    renderTwin();
  });
});