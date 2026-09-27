const state = {
  workflow: 'create',
  step: 0,
  mode: 'guided',
  completed: {create:false,assign:false,close:false},
  quizPassed: false,
};

const workflows = {
  create: {
    title:'Create service job', subtitle:'Capture a complete service request before dispatch.', crumb:'New job',
    steps:[
      {title:'Start with the customer', text:'Choose the customer that owns the site and asset. This drives SLA, billing and contact details.', why:'Correct customer and site data prevents dispatch and billing errors.', error:'Creating a job against the parent customer instead of the actual operating site.', done:'Customer and operating site are selected.', render:()=>`
        <div class="form-grid">
          ${selectField('Customer','customer',['','Pilbara Iron Operations','West Coast Minerals','Red Ridge Processing'],'Pilbara Iron Operations','Select the contracting customer.')}
          ${selectField('Operating site','site',['','Port Hedland Processing Plant','Karratha Workshop','Kalgoorlie Yard'],'Port Hedland Processing Plant','Use the physical operating location.')}
          ${inputField('Customer reference','reference','PIO-REQ-4281','Optional request or PO reference.')}
          ${inputField('Contact','contact','Alicia Morgan · Maintenance Planner','Primary site contact for this request.')}
        </div>`},
      {title:'Select the affected asset', text:'Attach the job to the exact equipment item so history, warranty and maintenance records remain connected.', why:'Asset linkage gives the technician history and reduces repeat diagnosis.', error:'Selecting a generic asset family instead of the serialized equipment item.', done:'The serialized asset and its service context are visible.', render:()=>`
        <div class="form-grid">
          ${selectField('Asset','asset',['','PX-440 · Hydraulic Power Unit · HPU-77821','PX-220 · Hydraulic Power Unit · HPU-66210','CP-18 · Conveyor Drive · CD-41002'],'PX-440 · Hydraulic Power Unit · HPU-77821','Choose the serialized asset.')}
          ${inputField('Asset location','assetLocation','Crushing Circuit · Bay 4','Auto-populated from the asset record.')}
          ${inputField('Warranty status','warranty','Active until 14 Mar 2027','Read-only service context.')}
          ${inputField('Last service','lastService','18 Aug 2026 · 500-hour service','Recent history for triage.')}
        </div>`},
      {title:'Describe the issue clearly', text:'Write the symptom and operational impact. Avoid diagnosing the fault unless it is confirmed.', why:'A precise symptom description helps the right technician arrive prepared.', error:'Writing “pump failure” when the confirmed symptom is only pressure loss.', done:'Symptoms, operational impact and supporting observations are clear.', render:()=>`
        <div class="form-grid">
          ${textareaField('Reported issue','issue','Pressure drops below operating range after approximately 20 minutes. Oil temperature alarm recorded twice during morning shift. Unit remains available but production team requests urgent inspection.','Describe symptoms and business impact.')}
          ${textareaField('Troubleshooting already completed','troubleshooting','Site maintenance checked visible leaks and oil level. No external leak found. Unit restarted once; symptom returned.','Record what has already been tried.')}
        </div>`},
      {title:'Set priority and response target', text:'Priority should reflect safety, production impact and SLA. High priority is appropriate when production is at risk but no immediate safety stop exists.', why:'Priority controls dispatch sequencing and customer expectations.', error:'Using “Critical” for every production issue, which destroys prioritisation.', done:'Priority and requested response window are justified.', render:()=>`
        <div class="form-grid">
          ${selectField('Priority','priority',['','Low','Normal','High','Critical'],'High','High = material operational impact with urgent response required.')}
          ${selectField('Requested response','response',['','Same day','Within 24 hours','Within 48 hours'],'Same day','Confirm against contract/SLA before promising.')}
          ${inputField('Target attendance','attendance','28 Sep 2026 · 10:00','Proposed attendance target.')}
          ${selectField('Service type','serviceType',['','Breakdown','Inspection','Preventive maintenance','Warranty'],'Breakdown','Choose the work classification used for reporting and billing.')}
        </div>`},
      {title:'Review and create the job', text:'Do a final completeness check before creating the job. The dispatch team should not need to chase missing information.', why:'A clean handoff prevents delay and avoids rework between coordination and field teams.', error:'Creating the record with vague notes and expecting the technician to call for details.', done:'The service job can be dispatched without additional clarification.', render:()=>`
        <div class="summary-box"><div class="summary-grid">
          <div><span>Customer / Site</span><strong>Pilbara Iron Operations · Port Hedland</strong></div>
          <div><span>Asset</span><strong>PX-440 · HPU-77821</strong></div>
          <div><span>Priority</span><strong>High · Same-day response</strong></div>
          <div><span>Issue</span><strong>Pressure loss + oil temperature alert</strong></div>
        </div></div>
        <div class="inline-check" style="margin-top:12px"><input type="checkbox" id="reviewConfirm"><div><strong>I have checked the job for dispatch readiness.</strong><span>Customer, site, asset, issue, priority and contact details are complete.</span></div></div>`}
    ]
  },
  assign: {
    title:'Assign technician', subtitle:'Match skills, availability and safety requirements.', crumb:'Job SJ-10482 / Dispatch',
    steps:[
      {title:'Review job requirements',text:'Confirm the asset, issue, priority and requested attendance before choosing a technician.',why:'Dispatch should be driven by job requirements, not simply who is free.',error:'Assigning before reviewing asset and safety context.',done:'Required skills and attendance window are understood.',render:()=>`
        <div class="summary-box"><div class="summary-grid"><div><span>Job</span><strong>SJ-10482 · High priority</strong></div><div><span>Asset</span><strong>PX-440 Hydraulic Power Unit</strong></div><div><span>Site</span><strong>Port Hedland Processing Plant</strong></div><div><span>Needed</span><strong>Hydraulics · electrical diagnostics</strong></div></div></div>`},
      {title:'Choose a qualified technician',text:'Match technical skill, site access and availability. The nearest person is not always the right person.',why:'Skill and site eligibility are prerequisites for safe, first-time-right service.',error:'Assigning an available technician who lacks current site access.',done:'Selected technician is qualified and site-ready.',render:()=>`
        <div class="form-grid">${selectField('Technician','technician',['','Maya Chen · Hydraulics L3 · Site current','Liam Brooks · Mechanical L2 · Site expired','Noah Patel · Electrical L3 · Site current'],'Maya Chen · Hydraulics L3 · Site current','Skill match: hydraulics + electrical diagnostic support.')}${inputField('Current workload','workload','2 open jobs · available 09:30','Check route and commitments.')}${inputField('Site access','siteAccess','Current · expires 12 Feb 2027','Training and induction status.')}${inputField('Vehicle / kit','vehicle','Service Ute 12 · HPU diagnostic kit','Required tooling and transport.')}</div>`},
      {title:'Schedule attendance',text:'Book a realistic arrival time and leave travel/setup buffer.',why:'A reliable ETA is part of the customer commitment.',error:'Scheduling at the exact end of the previous job with no travel time.',done:'Attendance window is achievable and visible to the customer.',render:()=>`
        <div class="form-grid">${inputField('Service date','serviceDate','28 Sep 2026','Date agreed with site.')}${inputField('Arrival window','arrival','10:00–10:30','Includes travel buffer.')}${inputField('Estimated duration','duration','4 hours','Planning estimate, not billing cap.')}${inputField('Dispatch note','dispatchNote','Call Alicia 20 min before arrival','Critical site-contact instruction.')}</div>`},
      {title:'Confirm safety and access',text:'Before dispatch, verify the technician has the required site induction, permits and work prerequisites.',why:'A technically capable technician who cannot enter or work on site is not dispatch-ready.',error:'Assuming last year’s induction is still valid.',done:'Site access and pre-job safety requirements are confirmed.',render:()=>`
        <div class="form-grid"><div class="inline-check"><input type="checkbox" id="induction" checked><div><strong>Site induction current</strong><span>Port Hedland Processing Plant</span></div></div><div class="inline-check"><input type="checkbox" id="jha" checked><div><strong>JHA required on arrival</strong><span>Technician acknowledged requirement</span></div></div><div class="inline-check"><input type="checkbox" id="isolation" checked><div><strong>Isolation permit coordinated</strong><span>Site maintenance to isolate HPU</span></div></div><div class="inline-check"><input type="checkbox" id="ppe" checked><div><strong>Site PPE confirmed</strong><span>Standard + hearing protection</span></div></div></div>`},
      {title:'Dispatch the assignment',text:'Send a complete assignment that the technician can act on without additional calls.',why:'A complete dispatch improves first-time fix probability and customer confidence.',error:'Sending only a job number with no context.',done:'Technician has accepted the job and the customer has an ETA.',render:()=>`
        <div class="success-panel"><div class="big-check">✓</div><h3>Dispatch package ready</h3><p>Maya Chen · SJ-10482 · Port Hedland · 28 Sep 2026 · 10:00–10:30 · HPU diagnostic kit · call customer 20 min before arrival.</p></div>`}
    ]
  },
  close: {
    title:'Close service job', subtitle:'Capture work performed, evidence and customer outcome.', crumb:'Job SJ-10482 / Completion',
    steps:[
      {title:'Confirm technician completion',text:'Review the technician’s work notes before closing. “Done” is not enough.',why:'Completion notes become service history, billing support and future diagnostic evidence.',error:'Closing from a verbal message before work notes are entered.',done:'Work performed and technical outcome are documented.',render:()=>`
        <div class="form-grid">${textareaField('Work performed','workPerformed','Inspected hydraulic circuit and pressure sensors. Replaced temperature sensor TS-14 and cleaned restricted return-line filter. Pressure tested unit through 45-minute run cycle. No pressure drop observed.','Use factual actions and results.')}${textareaField('Technician recommendation','recommendation','Monitor return-line filter differential pressure at next two weekly inspections. Consider replacement of filter housing during next planned shutdown.','Capture follow-up recommendation separately from completed work.')}</div>`},
      {title:'Capture labour and parts',text:'Ensure labour and parts are complete before commercial handoff.',why:'Incomplete service records create billing delays and margin leakage.',error:'Closing the job before consumed parts are recorded.',done:'Labour and parts match the field record.',render:()=>`
        <div class="form-grid">${inputField('Labour hours','hours','4.5','Includes onsite diagnostic and test run.')}${inputField('Travel hours','travel','1.2','Per contract billing rule.')}${inputField('Parts used','parts','TS-14 sensor ×1 · RF-220 filter ×1','Serialized/controlled parts where applicable.')}${inputField('Purchase order','po','PIO-PO-88420','Customer commercial reference.')}</div>`},
      {title:'Attach service evidence',text:'Record the evidence another person would need to understand and defend the closure.',why:'Evidence supports warranty, audit, customer trust and future troubleshooting.',error:'Keeping evidence only on the technician’s phone.',done:'Completion evidence is attached to the job record.',render:()=>`
        <div class="form-grid"><div class="inline-check"><input type="checkbox" checked><div><strong>Service report attached</strong><span>SJ-10482_ServiceReport.pdf</span></div></div><div class="inline-check"><input type="checkbox" checked><div><strong>Before/after readings attached</strong><span>Pressure and temperature test record</span></div></div><div class="inline-check"><input type="checkbox" checked><div><strong>Customer sign-off captured</strong><span>Alicia Morgan · 28 Sep 2026</span></div></div><div class="inline-check"><input type="checkbox" checked><div><strong>Photos uploaded</strong><span>Sensor, filter and final installation</span></div></div></div>`},
      {title:'Set outcome and follow-up',text:'Separate the resolved incident from recommendations that require future action.',why:'Clear outcome coding keeps operational reporting honest and prevents recommendations being lost.',error:'Marking “fully resolved” when an unresolved condition remains.',done:'Outcome and follow-up action accurately reflect the job.',render:()=>`
        <div class="form-grid">${selectField('Outcome','outcome',['','Resolved','Temporary restoration','Further work required'],'Resolved','Select the operational outcome after testing.')}${selectField('Customer status','customerStatus',['','Accepted','Pending confirmation','Disputed'],'Accepted','Customer acknowledgement of completion.')}${textareaField('Follow-up action','followup','Create planned-work recommendation for filter housing replacement during next shutdown. Owner: Reliability Engineer.','Do not bury future actions in free-text service notes.')}</div>`},
      {title:'Close and hand over',text:'A completed job should now be usable by Operations, Finance, Reliability and the customer without extra interpretation.',why:'Good closure turns field activity into reusable operational knowledge.',error:'Treating closure as an administrative tick rather than a cross-functional handoff.',done:'The record is complete, auditable and ready for billing and future reference.',render:()=>`
        <div class="success-panel"><div class="big-check">✓</div><h3>SJ-10482 is closure-ready</h3><p>Technical outcome, labour, parts, evidence, customer acceptance and follow-up recommendation are all recorded.</p></div>`}
    ]
  }
};

function inputField(label,id,value,help){return `<div class="field"><label for="${id}">${label}</label><input id="${id}" value="${value}"><div class="field-help">${help}</div></div>`}
function textareaField(label,id,value,help){return `<div class="field full"><label for="${id}">${label}</label><textarea id="${id}">${value}</textarea><div class="field-help">${help}</div></div>`}
function selectField(label,id,options,selected,help){return `<div class="field"><label for="${id}">${label}</label><select id="${id}">${options.map(o=>`<option ${o===selected?'selected':''}>${o||'Select…'}</option>`).join('')}</select><div class="field-help">${help}</div></div>`}

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function current(){return workflows[state.workflow]}
function render(){
  const w=current(), s=w.steps[state.step];
  $('#workflowTitle').textContent=w.title; $('#workflowSubtitle').textContent=w.subtitle; $('#crumbCurrent').textContent=w.crumb;
  $('#stepPill').textContent=`Step ${state.step+1} of ${w.steps.length}`;
  $('#calloutTitle').textContent=s.title; $('#calloutText').textContent=s.text;
  $('#whyText').textContent=s.why; $('#errorText').textContent=s.error; $('#doneText').textContent=s.done;
  $('#workflowCanvas').innerHTML=s.render();
  $('#prevStepBtn').disabled=state.step===0;
  $('#prevStepBtn').style.opacity=state.step===0?.45:1;
  $('#nextStepBtn').textContent=state.step===w.steps.length-1 ? (state.completed[state.workflow]?'Completed':'Complete workflow') : 'Continue';
  $('#learningCallout').style.display=state.mode==='guided'?'flex':'none';
  renderDots(); renderNav(); updateReadiness(); applyMode();
}
function renderDots(){
  const total=current().steps.length; $('#stepDots').innerHTML=Array.from({length:total},(_,i)=>`<span class="step-dot ${i<state.step?'done':''} ${i===state.step?'active':''}"></span>`).join('');
}
function renderNav(){
  $$('.workflow-item').forEach(b=>b.classList.toggle('active',b.dataset.workflow===state.workflow));
  Object.entries(state.completed).forEach(([k,v])=>$('#status-'+k).classList.toggle('done',v));
}
function updateReadiness(){
  const done=Object.values(state.completed).filter(Boolean).length; let pct=Math.round((done/3)*85)+(state.quizPassed?15:0); if(pct>100)pct=100;
  $('#readinessScore').textContent=`${pct}%`; $('.score-ring').style.background=`conic-gradient(var(--teal) ${pct*3.6}deg,#e5e5e5 0deg)`;
  $('#readinessText').textContent=pct===100?'Role readiness demonstrated':`${done}/3 workflows complete`;
}
function applyMode(){
  if(state.mode==='assessment'){
    $('#modeHint').textContent='Assessment mode removes coaching and tests task completion.';
    $('.coach').style.opacity=.55;
  }else if(state.mode==='practice'){
    $('#modeHint').textContent='Practice mode keeps the workflow but hides step explanations.';
    $('.coach').style.opacity=1;
  }else{
    $('#modeHint').textContent='Guided mode explains every action.'; $('.coach').style.opacity=1;
  }
}
function validateStep(){
  if(state.mode!=='assessment') return true;
  const controls=$$('#workflowCanvas input:not([type=checkbox]), #workflowCanvas select, #workflowCanvas textarea');
  let ok=true;
  controls.forEach(el=>{ const bad=!String(el.value).trim() || el.value==='Select…'; el.classList.toggle('field-error',bad); el.classList.toggle('field-success',!bad); if(bad)ok=false; });
  const checks=$$('#workflowCanvas input[type=checkbox]'); checks.forEach(el=>{if(!el.checked)ok=false});
  return ok;
}
$('#nextStepBtn').addEventListener('click',()=>{
  if(!validateStep()){ $('#calloutTitle').textContent='Not ready yet'; $('#calloutText').textContent='Complete the required information before continuing.'; $('#learningCallout').style.display='flex'; return; }
  const w=current();
  if(state.step<w.steps.length-1){state.step++;render();return}
  state.completed[state.workflow]=true; renderNav();updateReadiness();
  const order=['create','assign','close']; const idx=order.indexOf(state.workflow); if(idx<2){state.workflow=order[idx+1];state.step=0;render()} else {render(); $('#quizBtn').focus();}
});
$('#prevStepBtn').addEventListener('click',()=>{if(state.step>0){state.step--;render()}});
$$('.workflow-item').forEach(b=>b.addEventListener('click',()=>{state.workflow=b.dataset.workflow;state.step=0;render()}));
$$('.mode').forEach(b=>b.addEventListener('click',()=>{state.mode=b.dataset.mode;$$('.mode').forEach(x=>x.classList.toggle('active',x===b));render()}));
$('#restartBtn').addEventListener('click',()=>{state.workflow='create';state.step=0;state.mode='guided';state.completed={create:false,assign:false,close:false};state.quizPassed=false;$$('.mode').forEach(x=>x.classList.toggle('active',x.dataset.mode==='guided'));render()});

function drawer(open){$('#packDrawer').classList.toggle('open',open);$('#drawerBackdrop').classList.toggle('open',open);$('#packDrawer').setAttribute('aria-hidden',String(!open))}
$('#openPackBtn').onclick=()=>drawer(true);$('#closePackBtn').onclick=()=>drawer(false);$('#drawerBackdrop').onclick=()=>drawer(false);
function quiz(open){$('#quizModal').classList.toggle('open',open);$('#quizBackdrop').classList.toggle('open',open);$('#quizModal').setAttribute('aria-hidden',String(!open))}
$('#quizBtn').onclick=()=>quiz(true);$('#closeQuizBtn').onclick=()=>quiz(false);$('#quizBackdrop').onclick=()=>quiz(false);
$('#quizForm').addEventListener('submit',e=>{e.preventDefault(); const data=new FormData(e.target); const score=[['q1','b'],['q2','a'],['q3','b']].reduce((n,[q,a])=>n+(data.get(q)===a?1:0),0); const r=$('#quizResult'); if(score===3){state.quizPassed=true;r.className='quiz-result pass';r.textContent='3/3 · PASS. Knowledge check complete. Now confirm task performance in the simulation.'}else{r.className='quiz-result fail';r.textContent=`${score}/3 · Review the workflow guidance and try again.`} updateReadiness();});

render();