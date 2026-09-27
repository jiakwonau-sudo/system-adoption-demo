const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

const NAV=[
  {group:'OPERATIONS',items:[
    ['dashboard','Overview','◫'],
    ['workorders','Work Orders','WO'],
    ['schedule','Schedule Board','SB']
  ]},
  {group:'CUSTOMERS & FIELD',items:[
    ['assets','Customers & Assets','CA'],
    ['mobile','Technician Mobile','M']
  ]},
  {group:'SERVICE DESIGN',items:[
    ['agreements','Agreements','AG'],
    ['inspections','Inspections','IN']
  ]},
  {group:'SUPPLY',items:[
    ['inventory','Inventory','IV'],
    ['returns','Returns','RT']
  ]},
  {group:'CONNECTED SERVICE',items:[
    ['iot','IoT Alerts','IoT']
  ]},
  {group:'LEARNING',items:[
    ['readiness','Role Readiness','✓']
  ]}
];

const roleNames={
  dispatcher:'Dispatcher',
  technician:'Frontline Technician',
  manager:'Service Manager',
  inventory:'Inventory Manager'
};

const catalog={
  'Dispatcher / Service Coordinator':[
    'Create reactive work order',
    'Apply incident type and verify generated tasks/products/services/skills',
    'Add / verify customer asset and functional location',
    'Review resource requirement',
    'Schedule with Schedule Assistant',
    'Schedule manually on Schedule Board',
    'Reassign / reschedule booking',
    'Handle cancellation / overrun / urgent work',
    'Monitor booking statuses',
    'Review completed work',
    'Review warranty / entitlement / pricing context',
    'Use work-order summary for context when enabled',
    'Start or review Teams collaboration on a work order',
    'Return work for follow-up',
    'Post completed work order'
  ],
  'Frontline Technician':[
    'Review assigned booking',
    'Navigate to customer',
    'Set Traveling / In Progress / On Break / Completed',
    'Review customer and asset history',
    'Complete ordered service tasks',
    'Perform inspection with branching',
    'Record parts used',
    'Record labor/service duration',
    'Add notes / evidence / customer sign-off',
    'Update asset / barcode where configured',
    'Complete booking or flag follow-up',
    'Use mobile Copilot work-order update when enabled (preview)',
    'Record final resolution where configured',
    'Work offline / sync'
  ],
  'Service Manager / Back Office':[
    'Review completed booking/work order',
    'Validate products, services and time',
    'Review customer evidence',
    'Post work order',
    'Review generated invoice',
    'Review entitlement / NTE / warranty context',
    'Review final resolution',
    'Review actuals, time entries and booking journals',
    'Analyse service history and repeat issues'
  ],
  'Inventory Manager':[
    'Review warehouse and truck stock',
    'Review product availability / allocated / on-hand / on-order',
    'Inventory adjustment',
    'Transfer inventory',
    'Purchase / receive',
    'Process RMA receipt',
    'Return to warehouse / vendor',
    'Review work-order usage and stock movements'
  ],
  'Agreement / PM Manager':[
    'Create service agreement',
    'Configure recurring booking setup',
    'Associate incident type and asset',
    'Generate recurring work orders',
    'Auto-book / manually schedule',
    'Generate recurring invoices',
    'Review service-history continuity'
  ],
  'Field Service Administrator':[
    'Configure work order types',
    'Configure incident types',
    'Configure service tasks / products / services / characteristics',
    'Build inspection templates and conditional logic',
    'Maintain resources / work hours / territories',
    'Maintain booking statuses',
    'Maintain price lists and entitlements',
    'Configure warranties and resolution records',
    'Configure Teams collaboration and Copilot features',
    'Configure mobile offline profile',
    'Maintain Field Service security roles and settings'
  ]
};

const sampleOrders=[
  {id:'WO-2047',account:'West Coast Minerals',asset:'CP-18 · Conveyor Drive',type:'Preventative Maintenance',incident:'Quarterly Conveyor Inspection',status:'Completed',priority:'Normal',territory:'Pilbara',date:'27 Sep 2026'},
  {id:'WO-2048',account:'Pilbara Iron Operations',asset:'PX-440 · HPU-77821',type:'Repair',incident:null,status:'Unscheduled',priority:'High',territory:'Pilbara',date:'28 Sep 2026'},
  {id:'WO-2050',account:'Red Ridge Processing',asset:'PX-220 · HPU-66210',type:'Inspection',incident:'Hydraulic Condition Inspection',status:'Scheduled',priority:'Normal',territory:'Goldfields',date:'28 Sep 2026'},
  {id:'WO-2051',account:'Pilbara Iron Operations',asset:'GEN-08 · Genset',type:'Repair',incident:'Starter Fault',status:'In Progress',priority:'High',territory:'Pilbara',date:'28 Sep 2026'}
];

const resources=[
  {id:'R-01',name:'Maya Chen',role:'Field Technician',skills:['Hydraulics L3','Electrical Diagnostics'],territory:'Pilbara',availability:'09:30',distance:12,travel:18,score:96,warehouse:'TRUCK-MAYA',induction:'Current'},
  {id:'R-02',name:'Noah Patel',role:'Field Technician',skills:['Electrical L3','Controls'],territory:'Pilbara',availability:'10:15',distance:22,travel:31,score:78,warehouse:'TRUCK-NOAH',induction:'Current'},
  {id:'R-03',name:'Liam Brooks',role:'Field Technician',skills:['Mechanical L2','Hydraulics L2'],territory:'Pilbara',availability:'09:00',distance:8,travel:12,score:63,warehouse:'TRUCK-LIAM',induction:'Site expired'}
];

const state={
  view:'dashboard',
  role:'dispatcher',
  mode:'guided',
  selectedOrder:'WO-2048',
  detailTab:'summary',
  mobileTab:'booking',
  showAssistant:false,
  scenarioStep:1,
  incidentApplied:false,
  booking:null,
  tasks:[
    {id:'T1',name:'Confirm isolation and site safety',estimate:10,done:false},
    {id:'T2',name:'Inspect hydraulic circuit and pressure',estimate:25,done:false},
    {id:'T3',name:'Check return filter differential pressure',estimate:20,done:false},
    {id:'T4',name:'Run 45-minute pressure/temperature test',estimate:45,done:false}
  ],
  product:{name:'RF-220 Return Filter',sku:'RF-220',estimated:1,used:0,price:185,status:'Estimated'},
  service:{name:'Hydraulic Diagnostic Service',estimated:90,actual:0,pricePerHour:220,status:'Estimated'},
  characteristic:'Hydraulics L3',
  inspection:{leak:null,filter:null,sensor:null,test:null,complete:false},
  evidence:{note:false,photo:false,signature:false},
  time:{travel:35,working:0,break:0,overtime:0},
  workOrderStatus:'Unscheduled',
  posted:false,
  invoice:null,
  actuals:false,
  generatedOrders:[],
  agreementGenerated:false,
  iotConverted:false,
  inventory:{
    'MAIN-WA':{name:'Main WA Warehouse',RF220:{available:42,allocated:4,onOrder:20},TS14:{available:16,allocated:2,onOrder:10}},
    'TRUCK-MAYA':{name:'Maya Chen · Service Ute',RF220:{available:4,allocated:1,onOrder:0},TS14:{available:2,allocated:0,onOrder:0}}
  },
  transfers:[],
  rma:{created:false,received:false,rtv:false},
  trainingScore:{dispatcher:0,technician:0,manager:0,inventory:0},
  events:[
    {time:'07:46',kind:'REQ',text:'Customer request received · pressure-loss issue'},
    {time:'07:52',kind:'WO',text:'WO-2048 created in training scenario'}
  ]
};

const scenarioSteps=[
  ['Review dispatch-ready work order','Open WO-2048 and review customer, asset, priority and service context.'],
  ['Apply incident type','Use the Hydraulic Pressure Diagnostic incident template to generate tasks, part, service and required skill.'],
  ['Schedule the right resource','Use Schedule Assistant to select a resource matching Hydraulics L3, territory and availability.'],
  ['Travel and start work','Switch to technician role, set Traveling, then In Progress.'],
  ['Execute field work','Complete tasks, inspection, used part, service time and field evidence.'],
  ['Complete the booking','Complete only after required work and evidence are captured.'],
  ['Review and post','Service Manager reviews billing/time/evidence and posts the completed work order.'],
  ['Confirm business outcome','Review invoice, actuals, service history and readiness evidence.']
];

function statusClass(status){
  const x=status.toLowerCase();
  if(x.includes('unscheduled'))return 'unscheduled';
  if(x.includes('scheduled'))return 'scheduled';
  if(x.includes('progress')||x.includes('travel'))return 'progress';
  if(x.includes('complete'))return 'completed';
  if(x.includes('posted'))return 'posted';
  if(x.includes('cancel'))return 'canceled';
  return '';
}

function toast(msg){
  const t=$('#toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2600);
}

function logEvent(kind,text){
  state.events.unshift({time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),kind,text});
}

function setScenarioStep(n){
  state.scenarioStep=Math.max(state.scenarioStep,n);
  updateShell();
}

function calcReadiness(role=state.role){
  let score=0;
  if(role==='dispatcher'){
    if(state.incidentApplied)score+=30;
    if(state.booking)score+=50;
    if(state.workOrderStatus!=='Unscheduled')score+=20;
  }else if(role==='technician'){
    const done=state.tasks.filter(x=>x.done).length;
    score+=Math.round(done/state.tasks.length*35);
    if(state.inspection.complete)score+=20;
    if(state.product.used>0)score+=10;
    if(state.service.actual>0)score+=10;
    if(state.evidence.note&&state.evidence.signature)score+=15;
    if(state.booking?.status==='Completed')score+=10;
  }else if(role==='manager'){
    if(state.workOrderStatus==='Completed')score+=45;
    if(state.posted)score+=55;
  }else if(role==='inventory'){
    if(state.product.used>0)score+=40;
    if(state.transfers.length)score+=30;
    if(state.rma.received)score+=30;
  }
  state.trainingScore[role]=Math.min(100,score);
  return state.trainingScore[role];
}

function updateShell(){
  $('#roleLabel').textContent=roleNames[state.role];
  $('#roleSelect').value=state.role;
  const [title,text]=scenarioSteps[state.scenarioStep-1]||scenarioSteps[scenarioSteps.length-1];
  $('#scenarioStepText').textContent='Step '+state.scenarioStep+' of '+scenarioSteps.length;
  $('#scenarioProgress').style.width=(state.scenarioStep/scenarioSteps.length*100)+'%';
  const score=calcReadiness();
  $('#readinessMini').textContent=score+'%';
  const coach=$('#coachStrip');
  coach.className='coach-strip '+state.mode;
  $('#coachMode').textContent=state.mode.toUpperCase()+' MODE';
  if(state.mode==='guided'){
    $('#coachTitle').textContent=title;
    $('#coachText').textContent=text;
  }else if(state.mode==='practice'){
    $('#coachTitle').textContent='Complete the current workflow with reduced coaching.';
    $('#coachText').textContent='Use the business context and preferred path you have already practised.';
  }else{
    $('#coachTitle').textContent='Assessment mode: no step-by-step coaching.';
    $('#coachText').textContent='Complete the critical actions correctly and independently.';
  }
}

function renderNav(){
  const nav=$('#mainNav');nav.innerHTML='';
  NAV.forEach(group=>{
    const l=document.createElement('div');l.className='nav-section-label';l.textContent=group.group;nav.appendChild(l);
    group.items.forEach(([id,label,icon])=>{
      const b=document.createElement('button');b.type='button';b.className='nav-btn'+(state.view===id?' active':'');b.dataset.view=id;
      let count='';
      if(id==='workorders')count='<span class="nav-count">'+getOrders().length+'</span>';
      if(id==='iot')count='<span class="nav-count">1</span>';
      b.innerHTML='<b>'+icon+'</b><span>'+label+'</span>'+count;
      nav.appendChild(b);
    });
  });
}

function getOrders(){
  const main=sampleOrders.map(o=>o.id==='WO-2048'?{...o,status:state.workOrderStatus,incident:state.incidentApplied?'Hydraulic Pressure Diagnostic':null}:o);
  return main.concat(state.generatedOrders);
}

function setPage(eyebrow,title){
  $('#pageEyebrow').textContent=eyebrow;
  $('#pageTitle').textContent=title;
}

function render(){
  renderNav();updateShell();
  const map={
    dashboard:renderDashboard,
    workorders:renderWorkOrders,
    schedule:renderSchedule,
    assets:renderAssets,
    mobile:renderMobile,
    agreements:renderAgreements,
    inspections:renderInspections,
    inventory:renderInventory,
    returns:renderReturns,
    iot:renderIoT,
    readiness:renderReadiness
  };
  (map[state.view]||renderDashboard)();
}

function kpi(label,value,note){
  return '<div class="kpi-card"><span>'+label+'</span><strong>'+value+'</strong><small>'+note+'</small></div>';
}

function renderDashboard(){
  setPage('OPERATIONS','Field Service Operations');
  const open=getOrders().filter(o=>!['Posted','Canceled'].includes(o.status)).length;
  const scheduled=getOrders().filter(o=>o.status==='Scheduled').length;
  const inprog=getOrders().filter(o=>o.status==='In Progress').length;
  const ready=Math.round(Object.values(state.trainingScore).reduce((a,b)=>a+b,0)/4);
  $('#viewRoot').innerHTML=
    '<div class="page-grid kpi-grid">'+
      kpi('OPEN WORK ORDERS',open,'Across reactive, PM and connected service')+
      kpi('SCHEDULED TODAY',scheduled,'Resources with active bookings')+
      kpi('IN PROGRESS',inprog,'Technicians currently working')+
      kpi('TEAM READINESS',ready+'%','Training Twin evidence')+
    '</div>'+
    '<div class="section-grid" style="margin-top:14px">'+
      '<div class="card"><div class="card-head"><div><span>LIVE OPERATIONS</span><h2>Work order queue</h2><p>Current operational demand and status.</p></div><button class="secondary-btn" data-nav="workorders">Open work orders</button></div>'+workOrderTable(getOrders().slice(0,5))+'</div>'+
      '<div class="card"><div class="card-head"><div><span>SCENARIO</span><h2>Reactive break/fix</h2><p>WO-2048 · PX-440 hydraulic power unit</p></div><span class="score-chip">'+calcReadiness()+'% '+roleNames[state.role]+'</span></div>'+
      workflowProgress()+'</div>'+
    '</div>'+
    '<div class="section-grid" style="margin-top:14px">'+
      '<div class="card"><div class="card-head"><div><span>CONNECTED SERVICE</span><h2>IoT alert requiring attention</h2></div><button class="secondary-btn" data-nav="iot">Open alert</button></div><div class="callout"><strong>Temperature anomaly · HPU-66210</strong> 92.4°C for 8 minutes. Predictive service rule suggests inspection.</div></div>'+
      '<div class="card"><div class="card-head"><div><span>PREVENTATIVE MAINTENANCE</span><h2>Agreement generation</h2></div><button class="secondary-btn" data-nav="agreements">Open agreements</button></div><div class="fact-grid">'+
      fact('ACTIVE AGREEMENTS','12')+fact('DUE THIS WEEK','3')+fact('AUTO-BOOKED','7')+'</div></div>'+
    '</div>';
}

function workflowProgress(){
  const data=[
    ['01','Work order reviewed',state.scenarioStep>1],
    ['02','Incident template applied',state.incidentApplied],
    ['03','Qualified resource booked',!!state.booking],
    ['04','Technician execution',state.scenarioStep>5],
    ['05','Booking completed',state.booking?.status==='Completed'],
    ['06','Work order posted',state.posted]
  ];
  return '<div class="workflow-panel">'+data.map((x,i)=>'<div class="workflow-step '+(x[2]?'done':(!x[2]&&i===data.findIndex(y=>!y[2])?'current':''))+'"><b>'+(x[2]?'✓':x[0])+'</b><div><strong>'+x[1]+'</strong><span>'+(x[2]?'Complete':'Pending')+'</span></div><span class="pill">'+(x[2]?'DONE':'NEXT')+'</span></div>').join('')+'</div>';
}

function fact(label,value){
  return '<div class="fact"><span>'+label+'</span><strong>'+value+'</strong></div>';
}

function workOrderTable(rows){
  return '<div class="table-wrap"><table class="data-table"><thead><tr><th>Work order</th><th>Account</th><th>Asset</th><th>Type / incident</th><th>Priority</th><th>Status</th></tr></thead><tbody>'+
    rows.map(o=>'<tr class="clickable" data-open-order="'+o.id+'"><td><strong>'+o.id+'</strong><br><small>'+o.date+'</small></td><td>'+o.account+'</td><td>'+o.asset+'</td><td>'+o.type+'<br><small>'+(o.incident||'No incident applied')+'</small></td><td>'+o.priority+'</td><td><span class="status '+statusClass(o.status)+'"><i class="dot"></i>'+o.status+'</span></td></tr>').join('')+
  '</tbody></table></div>';
}

function renderWorkOrders(){
  setPage('SERVICE','Work Orders');
  const orders=getOrders();
  const selected=orders.find(o=>o.id===state.selectedOrder)||orders[0];
  const tabs=['summary','tasks','products','assets','reference','timeline'];
  $('#viewRoot').innerHTML='<div class="split-pane">'+
    '<aside class="list-pane"><div class="list-head"><input id="workOrderSearch" placeholder="Search work orders"></div><div id="orderList">'+orders.map(o=>orderListItem(o,o.id===selected.id)).join('')+'</div></aside>'+
    '<section class="detail-pane"><div class="detail-head"><div><span class="status '+statusClass(selected.status)+'">'+selected.status+'</span><h2>'+selected.id+'</h2><p>'+selected.account+' · '+selected.asset+'</p></div><div class="detail-actions">'+workOrderActions(selected)+'</div></div>'+
    '<div class="tabs">'+tabs.map(t=>'<button type="button" class="tab-btn '+(state.detailTab===t?'active':'')+'" data-tab="'+t+'">'+tabLabel(t)+'</button>').join('')+'</div>'+
    '<div class="tab-body">'+renderWorkOrderTab(selected)+'</div></section>'+
  '</div>';
}

function orderListItem(o,active){
  return '<div class="list-item '+(active?'active':'')+'" data-open-order="'+o.id+'"><strong>'+o.id+' · '+o.account+'</strong><span>'+o.asset+'</span><div class="list-meta"><span>'+o.type+'</span><span class="status '+statusClass(o.status)+'">'+o.status+'</span></div></div>';
}

function workOrderActions(o){
  if(o.id!=='WO-2048')return '<button class="secondary-btn" disabled>Training sample</button>';
  let html='';
  if(!state.incidentApplied)html+='<button class="primary-btn" data-action="apply-incident">Apply incident type</button>';
  if(state.incidentApplied&&!state.booking)html+='<button class="primary-btn" data-action="open-schedule">Schedule work</button>';
  if(state.workOrderStatus==='Completed'&&!state.posted)html+='<button class="primary-btn" data-action="post-work-order">Review & post</button>';
  if(state.posted)html+='<span class="score-chip">POSTED · '+state.invoice.id+'</span>';
  return html||'<button class="secondary-btn" data-nav="mobile">Open field execution</button>';
}

function tabLabel(t){
  return ({summary:'Summary',tasks:'Tasks',products:'Products & Services',assets:'Assets',reference:'Reference',timeline:'Timeline'})[t];
}

function renderWorkOrderTab(o){
  if(o.id!=='WO-2048')return '<div class="empty-state"><strong>Reference sample work order</strong><p>This commercial demo makes WO-2048 fully interactive. Other orders provide realistic operational context.</p></div>';
  if(state.detailTab==='summary')return summaryTab();
  if(state.detailTab==='tasks')return tasksTab();
  if(state.detailTab==='products')return productsTab();
  if(state.detailTab==='assets')return assetsTab();
  if(state.detailTab==='reference')return referenceTab();
  return timelineTab();
}

function summaryTab(){
  return '<div class="form-grid">'+
    field('Service account','Pilbara Iron Operations')+
    field('Billing account','Pilbara Iron Operations')+
    field('Functional location','Port Hedland Processing Plant / Crushing Circuit / Bay 4')+
    field('Primary asset','PX-440 · HPU-77821')+
    field('Work order type','Repair')+
    field('Incident type',state.incidentApplied?'Hydraulic Pressure Diagnostic':'Not applied')+
    field('System status',state.workOrderStatus)+
    field('Priority','High')+
    field('Service territory','Pilbara')+
    field('Price list','WA Industrial Service 2026')+
    field('Taxable','Yes')+
    field('Estimated duration',state.incidentApplied?'150 min':'—')+
    '<div class="field full"><label>Instructions</label><textarea class="readonly" readonly>Call site maintenance 20 minutes before arrival. Complete isolation/JHA before hydraulic diagnosis. Customer requires same-day response.</textarea></div>'+
  '</div>';
}

function field(label,value){
  return '<div class="field"><label>'+label+'</label><input class="readonly" value="'+value.replaceAll('"','&quot;')+'" readonly></div>';
}

function tasksTab(){
  if(!state.incidentApplied)return missingIncident();
  return '<div class="card-head"><div><span>SERVICE TASKS</span><h2>'+state.tasks.filter(x=>x.done).length+' / '+state.tasks.length+' complete</h2><p>Incident-type task order defines the preferred field procedure.</p></div></div><div class="sub-list">'+
    state.tasks.map((t,i)=>'<div class="sub-row"><div><strong>'+(i+1)+'. '+t.name+'</strong><span>Estimated '+t.estimate+' min</span></div><span class="pill">'+(t.done?'COMPLETED':'OPEN')+'</span></div>').join('')+
  '</div>';
}

function productsTab(){
  if(!state.incidentApplied)return missingIncident();
  const serviceValue=(state.service.actual/60*state.service.pricePerHour).toFixed(2);
  return '<div class="fact-grid">'+fact('ESTIMATE SUBTOTAL','$'+(state.product.price+(state.service.estimated/60*state.service.pricePerHour)).toFixed(2))+fact('ACTUAL SUBTOTAL','$'+((state.product.used*state.product.price)+Number(serviceValue)).toFixed(2))+fact('PRICE LIST','WA Industrial Service 2026')+'</div>'+
    '<div class="card-head" style="margin-top:16px"><div><span>PRODUCT</span><h2>'+state.product.name+'</h2></div><span class="status '+(state.product.used?'completed':'unscheduled')+'">'+state.product.status+'</span></div>'+
    '<div class="fact-grid">'+fact('EST. QTY',state.product.estimated)+fact('USED QTY',state.product.used)+fact('UNIT PRICE','$'+state.product.price)+'</div>'+
    '<div class="card-head" style="margin-top:16px"><div><span>SERVICE</span><h2>'+state.service.name+'</h2></div><span class="status '+(state.service.actual?'completed':'unscheduled')+'">'+state.service.status+'</span></div>'+
    '<div class="fact-grid">'+fact('EST. DURATION',state.service.estimated+' min')+fact('ACTUAL',state.service.actual+' min')+fact('RATE','$'+state.service.pricePerHour+'/hr')+'</div>';
}

function assetsTab(){
  return '<div class="fact-grid">'+fact('PRIMARY ASSET','PX-440 · HPU-77821')+fact('LOCATION','Crushing Circuit / Bay 4')+fact('WARRANTY','Active until 14 Mar 2027')+'</div>'+
    '<div class="card-head" style="margin-top:16px"><div><span>ASSET TREE</span><h2>PX-440 Hydraulic Power Unit</h2></div></div>'+
    '<div class="sub-list"><div class="sub-row"><div><strong>PX-440 · HPU-77821</strong><span>Hydraulic Power Unit</span></div><span class="pill">PRIMARY</span></div><div class="sub-row"><div><strong>PMP-12 · Pump assembly</strong><span>Subasset</span></div></div><div class="sub-row"><div><strong>FLT-22 · Return filter housing</strong><span>Subasset</span></div></div><div class="sub-row"><div><strong>TS-14 · Temperature sensor</strong><span>Subasset</span></div></div></div>'+
    '<div class="card-head" style="margin-top:16px"><div><span>SERVICE HISTORY</span><h2>Recent asset history</h2></div></div>'+
    '<div class="timeline"><div class="timeline-item"><div class="timeline-icon">PM</div><div><strong>18 Aug 2026 · 500-hour service</strong><p>Filter replaced; pressure test passed.</p></div></div><div class="timeline-item"><div class="timeline-icon">IN</div><div><strong>12 Jun 2026 · condition inspection</strong><p>Temperature sensor drift noted but within tolerance.</p></div></div></div>';
}

function referenceTab(){
  return '<div class="catalog-card-grid"><div class="catalog-card"><span>KNOWLEDGE</span><strong>PX-440 pressure-loss troubleshooting</strong><ul><li>Verify isolation</li><li>Check return restriction</li><li>Validate temperature sensor</li></ul></div><div class="catalog-card"><span>MEDIA</span><strong>Hydraulic schematic</strong><ul><li>Return circuit</li><li>Pressure test points</li><li>Sensor locations</li></ul></div><div class="catalog-card"><span>GUIDE</span><strong>HPU safe isolation</strong><ul><li>LOTO</li><li>Stored pressure</li><li>Test-before-touch</li></ul></div></div>';
}

function timelineTab(){
  return '<div class="timeline">'+state.events.map(e=>'<div class="timeline-item"><div class="timeline-icon">'+e.kind+'</div><div><strong>'+e.time+' · '+e.text+'</strong><p>Training timeline event</p></div></div>').join('')+'</div>';
}

function missingIncident(){
  return '<div class="empty-state"><strong>No incident template applied</strong><p>Apply the incident type to generate the standard tasks, product, service and required resource characteristic.</p><button class="primary-btn" data-action="apply-incident">Apply Hydraulic Pressure Diagnostic</button></div>';
}

function applyIncident(){
  if(state.incidentApplied)return;
  state.incidentApplied=true;
  state.product.status='Estimated';
  state.service.status='Estimated';
  logEvent('IT','Incident type applied · tasks/products/services/characteristics generated');
  setScenarioStep(3);
  toast('Incident type applied. Work order detail has been standardised.');
  render();
}

function renderSchedule(){
  setPage('SCHEDULING','Schedule Board');
  const booking=state.booking;
  $('#viewRoot').innerHTML='<div class="schedule-shell"><aside class="requirements-panel"><div class="list-head"><strong>Unscheduled requirements</strong></div>'+
    '<div class="requirement-item active"><strong>WO-2048 · Hydraulic Pressure Diagnostic</strong><span>High · 150 min · Hydraulics L3 · Pilbara</span></div>'+
    '<div class="requirement-item"><strong>WO-2052 · Pump seal inspection</strong><span>Normal · 90 min · Mechanical L2</span></div>'+
    '<div class="requirement-item"><strong>WO-2053 · Instrument calibration</strong><span>Normal · 120 min · Controls</span></div></aside>'+
    '<section class="schedule-board"><div class="schedule-toolbar"><h2>28 September 2026 · Pilbara dispatch</h2><div><button class="secondary-btn" data-action="toggle-assistant">Find availability</button><button class="ghost-btn">Day</button></div></div>'+
    (state.showAssistant?assistantPanel():'')+
    '<div style="overflow:auto">'+scheduleGrid()+'</div></section></div>';
}

function assistantPanel(){
  return '<div class="assistant-panel"><div class="card-head"><div><span>SCHEDULE ASSISTANT</span><h2>Recommended resources</h2><p>Filtered by availability, Hydraulics L3, Pilbara territory and travel.</p></div></div><div class="assistant-grid">'+
    resources.map(r=>'<div class="candidate '+(r.id==='R-01'?'best':'')+'"><strong>'+r.name+'</strong><span>'+r.skills.join(' · ')+'</span><span>'+r.territory+' · '+r.distance+' km · '+r.travel+' min travel</span><span>Site induction: '+r.induction+'</span><div class="score-chip">'+r.score+' match</div><button class="primary-btn" data-action="book-resource" data-resource="'+r.id+'" '+((r.id!=='R-01'&&state.mode==='assessment')?'':'')+'>'+((state.booking?.resourceId===r.id)?'Booked':'Book resource')+'</button></div>').join('')+
  '</div></div>';
}

function scheduleGrid(){
  const hours=['08','09','10','11','12','13','14','15'];
  let html='<div class="board-grid"><div class="board-cell board-header">Resource</div>'+hours.map(h=>'<div class="board-cell board-header">'+h+':00</div>').join('');
  resources.forEach(r=>{
    html+='<div class="board-cell resource-cell"><strong>'+r.name+'</strong><span>'+r.skills[0]+'</span></div>';
    hours.forEach(h=>{
      let card='';
      if(r.id==='R-01'&&h==='08')card='<div class="booking complete">WO-2039<br>PM service</div>';
      if(r.id==='R-02'&&['08','09'].includes(h))card='<div class="booking">WO-2044<br>controls</div>';
      if(r.id==='R-03'&&h==='11')card='<div class="booking">WO-2046<br>mechanical</div>';
      if(state.booking?.resourceId===r.id&&h==='10')card='<div class="booking high">WO-2048<br>HIGH</div>';
      html+='<div class="board-cell">'+card+'</div>';
    });
  });
  return html+'</div>';
}

function bookResource(resourceId){
  if(!state.incidentApplied){toast('Apply the incident type first so scheduling has the correct skill and duration.');state.view='workorders';render();return;}
  const r=resources.find(x=>x.id===resourceId);
  if(!r)return;
  if(state.mode==='assessment'&&resourceId!=='R-01'){toast('Assessment: this resource does not satisfy the preferred scheduling decision.');return;}
  if(r.induction!=='Current'){toast('Resource cannot be booked: site induction is expired.');return;}
  state.booking={id:'BRB-7741',resourceId:r.id,resource:r.name,status:'Scheduled',start:'10:00',end:'12:30',travel:r.travel};
  state.workOrderStatus='Scheduled';
  state.showAssistant=false;
  logEvent('BK','Booking created · '+r.name+' · 10:00–12:30');
  setScenarioStep(4);
  state.trainingScore.dispatcher=100;
  toast(r.name+' booked to WO-2048.');
  render();
}

function renderMobile(){
  setPage('MOBILE','Technician Mobile');
  const r=resources[0];
  if(!state.booking){
    $('#viewRoot').innerHTML='<div class="empty-state"><strong>No booking assigned yet</strong><p>Schedule WO-2048 to a technician before field execution begins.</p><button class="primary-btn" data-nav="schedule">Open Schedule Board</button></div>';return;
  }
  const tabs=['booking','service','inspection','notes'];
  $('#viewRoot').innerHTML='<div class="mobile-layout"><div class="phone"><div class="phone-screen"><div class="phone-top"><span>09:42</span><span>Field Service Mobile · Online</span></div>'+
    '<div class="mobile-head"><span>BOOKING '+state.booking.id+'</span><h3>WO-2048 · '+state.booking.resource+'</h3><div class="booking-status-flow">'+bookingStatusButtons()+'</div></div>'+
    '<div class="mobile-tabs">'+tabs.map(t=>'<button type="button" class="'+(state.mobileTab===t?'active':'')+'" data-mobile-tab="'+t+'">'+t[0].toUpperCase()+t.slice(1)+'</button>').join('')+'</div>'+
    '<div class="mobile-body">'+renderMobileTab()+'</div></div></div>'+
    '<div class="card"><div class="card-head"><div><span>FIELD EXECUTION</span><h2>Technician work package</h2><p>Exactly the kind of cross-tab workflow a Training Twin must reproduce.</p></div><span class="score-chip">'+calcReadiness('technician')+'% ready</span></div>'+
    '<div class="fact-grid">'+fact('CUSTOMER','Pilbara Iron Operations')+fact('SITE','Port Hedland / Bay 4')+fact('ASSET','HPU-77821')+fact('PRIORITY','High')+fact('INCIDENT','Hydraulic Pressure Diagnostic')+fact('OFFLINE PROFILE','Enabled · 7-day booking filter')+'</div>'+
    '<div class="callout" style="margin-top:14px"><strong>Booking lifecycle</strong>Scheduled → Traveling → In Progress → On Break → In Progress → Completed. Timestamps can drive time entries and booking journals.</div></div></div>';
}

function bookingStatusButtons(){
  const statuses=['Scheduled','Traveling','In Progress','On Break','Completed'];
  return statuses.map(s=>'<button type="button" class="'+(state.booking.status===s?'active':'')+'" data-booking-status="'+s+'" '+(s==='Completed'&&!canCompleteBooking()?'disabled':'')+'>'+s+'</button>').join('');
}

function renderMobileTab(){
  if(state.mobileTab==='booking'){
    return '<div class="fact-grid" style="grid-template-columns:1fr 1fr">'+fact('ARRIVAL','10:00–10:30')+fact('TRAVEL','18 min est.')+fact('LOCATION','Bay 4')+fact('INDUCTION','Current')+'</div><div class="callout" style="margin-top:12px"><strong>Customer instruction</strong>Call Alicia Morgan 20 minutes before arrival. Site maintenance coordinates isolation.</div>';
  }
  if(state.mobileTab==='service'){
    return '<div class="card-head"><div><span>TASKS</span><h2>'+state.tasks.filter(x=>x.done).length+' / '+state.tasks.length+' complete</h2></div></div>'+
      state.tasks.map(t=>'<label class="check-item"><input type="checkbox" data-task="'+t.id+'" '+(t.done?'checked':'')+' '+(state.booking.status!=='In Progress'?'disabled':'')+'><div><strong>'+t.name+'</strong><span>'+t.estimate+' min estimated</span></div></label>').join('')+
      '<div class="card-head" style="margin-top:12px"><div><span>PRODUCT</span><h2>'+state.product.name+'</h2></div></div>'+
      '<div class="sub-row"><div><strong>Truck stock: '+state.inventory['TRUCK-MAYA'].RF220.available+'</strong><span>Estimated qty 1 · '+state.product.status+'</span></div><button class="primary-btn" data-action="use-part" '+(state.booking.status!=='In Progress'||state.product.used?'disabled':'')+'>Mark used</button></div>'+
      '<div class="card-head" style="margin-top:12px"><div><span>SERVICE</span><h2>'+state.service.name+'</h2></div></div>'+
      '<div class="sub-row"><div><strong>'+state.service.actual+' min actual</strong><span>Estimated 90 min</span></div><button class="primary-btn" data-action="record-service" '+(state.booking.status!=='In Progress'||state.service.actual?'disabled':'')+'>Record 95 min</button></div>';
  }
  if(state.mobileTab==='inspection'){
    return '<div class="inspection">'+
      inspectionQuestion('leak','Visible external hydraulic leak?',['Yes','No'])+
      inspectionQuestion('filter','Return filter differential pressure?',['Normal','High'])+
      (state.inspection.filter==='High'?inspectionQuestion('sensor','Temperature sensor within tolerance?',['Yes','No']):'')+
      inspectionQuestion('test','45-minute run test result?',['Pass','Fail'])+
      '<button class="primary-btn" data-action="complete-inspection" '+(!inspectionReady()?'disabled':'')+'>Complete inspection</button>'+
    '</div>';
  }
  return '<div class="sub-list">'+
    '<div class="sub-row"><div><strong>Technician note</strong><span>'+ (state.evidence.note?'Pressure restored after filter replacement. Recommend housing replacement next shutdown.':'No note added')+'</span></div><button class="secondary-btn" data-action="add-note" '+(state.evidence.note?'disabled':'')+'>Add note</button></div>'+
    '<div class="sub-row"><div><strong>Photo evidence</strong><span>'+(state.evidence.photo?'2 images attached':'No images')+'</span></div><button class="secondary-btn" data-action="add-photo" '+(state.evidence.photo?'disabled':'')+'>Attach photos</button></div>'+
    '<div class="sub-row"><div><strong>Customer sign-off</strong><span>'+(state.evidence.signature?'Alicia Morgan · signed':'Not captured')+'</span></div><button class="secondary-btn" data-action="sign-off" '+(state.evidence.signature?'disabled':'')+'>Capture signature</button></div>'+
  '</div>';
}

function inspectionQuestion(key,label,options){
  return '<div class="question"><strong>'+label+'</strong><div class="choice-row">'+options.map(o=>'<button type="button" class="choice '+(state.inspection[key]===o?'selected':'')+'" data-inspection="'+key+'" data-value="'+o+'">'+o+'</button>').join('')+'</div></div>';
}

function inspectionReady(){
  return state.inspection.leak && state.inspection.filter && state.inspection.test && (state.inspection.filter!=='High'||state.inspection.sensor);
}

function canCompleteBooking(){
  return state.tasks.every(x=>x.done)&&state.inspection.complete&&state.product.used>0&&state.service.actual>0&&state.evidence.note&&state.evidence.signature;
}

function changeBookingStatus(status){
  if(!state.booking)return;
  if(status==='Traveling'){
    state.booking.status='Traveling';state.time.travel=35;state.workOrderStatus='Scheduled';logEvent('TS','Booking status Traveling · timestamp created');setScenarioStep(4);
  }else if(status==='In Progress'){
    state.booking.status='In Progress';state.workOrderStatus='In Progress';logEvent('TS','Booking status In Progress · Actual Arrival / Started On captured');setScenarioStep(5);
  }else if(status==='On Break'){
    state.booking.status='On Break';state.time.break=15;logEvent('TS','Booking status On Break · break timestamp');
  }else if(status==='Completed'){
    if(!canCompleteBooking()){toast('Complete tasks, inspection, used part, service time, note and customer sign-off first.');return;}
    state.booking.status='Completed';state.workOrderStatus='Completed';state.time.working=95;state.service.status='Used';state.product.status='Used';logEvent('TS','Booking Completed · time entries and booking journals generated');setScenarioStep(7);state.trainingScore.technician=100;
  }
  render();
}

function renderAssets(){
  setPage('CUSTOMERS','Customers & Assets');
  $('#viewRoot').innerHTML='<div class="section-grid"><div class="card"><div class="card-head"><div><span>SERVICE ACCOUNT</span><h2>Pilbara Iron Operations</h2><p>Customer context used by work orders, pricing, territory and travel.</p></div></div>'+
    '<div class="fact-grid">'+fact('SERVICE TERRITORY','Pilbara')+fact('PRICE LIST','WA Industrial Service 2026')+fact('TRAVEL CHARGE','Fixed · $90')+fact('TAXABLE','Yes')+fact('BILLING ACCOUNT','Same as service')+fact('WORK HOUR TEMPLATE','24/7 Processing')+'</div>'+
    '<div class="card-head" style="margin-top:18px"><div><span>FUNCTIONAL LOCATION</span><h2>Port Hedland Processing Plant</h2></div></div>'+
    '<div class="sub-list"><div class="sub-row"><div><strong>Crushing Circuit</strong><span>Area</span></div></div><div class="sub-row"><div><strong>↳ Bay 4</strong><span>Functional location</span></div></div><div class="sub-row"><div><strong>↳ PX-440 · HPU-77821</strong><span>Customer asset · primary training asset</span></div><span class="pill">ACTIVE</span></div></div></div>'+
    '<div class="card"><div class="card-head"><div><span>ASSET SERVICE HISTORY</span><h2>HPU-77821</h2></div><span class="score-chip">SERIALIZED ASSET</span></div>'+
    '<div class="timeline"><div class="timeline-item"><div class="timeline-icon">PM</div><div><strong>18 Aug · 500-hour service</strong><p>RF-220 replaced. Pressure test passed.</p></div></div><div class="timeline-item"><div class="timeline-icon">IN</div><div><strong>12 Jun · inspection</strong><p>Temperature sensor drift noted.</p></div></div><div class="timeline-item"><div class="timeline-icon">IoT</div><div><strong>28 Sep · current pressure/temperature anomaly</strong><p>Current break/fix scenario.</p></div></div>'+(state.posted?'<div class="timeline-item"><div class="timeline-icon">WO</div><div><strong>28 Sep · WO-2048 posted</strong><p>Service outcome written to asset history.</p></div></div>':'')+'</div></div></div>';
}

function renderAgreements(){
  setPage('SERVICE DESIGN','Agreements');
  $('#viewRoot').innerHTML='<div class="section-grid"><div class="card"><div class="card-head"><div><span>ACTIVE AGREEMENT</span><h2>AG-0038 · HPU Preventative Maintenance</h2><p>Pilbara Iron Operations · monthly maintenance cadence</p></div><span class="status completed">ACTIVE</span></div>'+
    '<div class="fact-grid">'+fact('START','01 Jan 2026')+fact('END','31 Dec 2027')+fact('FREQUENCY','Monthly')+fact('INCIDENT','HPU Monthly Inspection')+fact('ASSET','HPU-77821')+fact('PREFERRED RESOURCE','Maya Chen')+'</div>'+
    '<div class="card-head" style="margin-top:16px"><div><span>BOOKING SETUP</span><h2>Generate work orders automatically</h2></div></div>'+
    '<div class="callout"><strong>Agreement behavior</strong>Generates recurring maintenance demand with asset + incident context. It can be scheduled manually, auto-booked, or included in Resource Scheduling Optimization.</div>'+
    '<button class="primary-btn" style="margin-top:12px" data-action="generate-agreement" '+(state.agreementGenerated?'disabled':'')+'>'+(state.agreementGenerated?'Work order generated':'Generate next maintenance work order')+'</button></div>'+
    '<div class="card"><div class="card-head"><div><span>GENERATED DEMAND</span><h2>Agreement work orders</h2></div></div>'+
    (state.agreementGenerated?workOrderTable(state.generatedOrders.filter(x=>x.source==='Agreement')):'<div class="empty-state"><strong>No new agreement order generated in this session</strong><p>Generate the next recurrence to see the work order enter the queue.</p></div>')+'</div></div>';
}

function renderInspections(){
  setPage('SERVICE DESIGN','Inspection Templates');
  $('#viewRoot').innerHTML='<div class="section-grid"><div class="card"><div class="card-head"><div><span>PUBLISHED TEMPLATE</span><h2>Hydraulic Safety & Condition Inspection</h2><p>Used by the Hydraulic Pressure Diagnostic service task.</p></div><span class="status completed">PUBLISHED v4</span></div>'+
    '<div class="sub-list"><div class="sub-row"><div><strong>1. Isolation / JHA confirmed?</strong><span>Yes/No · required</span></div></div><div class="sub-row"><div><strong>2. Visible external leak?</strong><span>Yes/No</span></div></div><div class="sub-row"><div><strong>3. Return filter differential pressure?</strong><span>Normal / High</span></div></div><div class="sub-row"><div><strong>4. Temperature sensor within tolerance?</strong><span>Conditionally visible when filter pressure is High</span></div><span class="pill">BRANCH</span></div><div class="sub-row"><div><strong>5. 45-minute run test result?</strong><span>Pass / Fail · required</span></div></div></div>'+
    '<div class="callout" style="margin-top:14px"><strong>Conditional logic</strong>If filter differential pressure is High → reveal sensor question and require response before completion.</div></div>'+
    '<div class="card"><div class="card-head"><div><span>VERSION BEHAVIOR</span><h2>Inspection governance</h2></div></div><div class="workflow-panel"><div class="workflow-step done"><b>1</b><div><strong>Draft</strong><span>Design questions and conditional logic</span></div></div><div class="workflow-step done"><b>2</b><div><strong>Publish</strong><span>Template becomes available to service tasks</span></div></div><div class="workflow-step current"><b>3</b><div><strong>Revise</strong><span>Create a new version for future work</span></div></div><div class="workflow-step"><b>4</b><div><strong>Existing work</strong><span>Keeps the inspection version originally assigned</span></div></div></div></div></div>';
}

function renderInventory(){
  setPage('SUPPLY','Inventory');
  const main=state.inventory['MAIN-WA'].RF220;
  const truck=state.inventory['TRUCK-MAYA'].RF220;
  $('#viewRoot').innerHTML='<div class="page-grid kpi-grid">'+kpi('MAIN RF-220',main.available,'Available · '+main.allocated+' allocated')+kpi('MAYA TRUCK RF-220',truck.available,'Available · '+truck.allocated+' allocated')+kpi('ON ORDER',main.onOrder,'RF-220 units inbound')+kpi('WORK ORDER USED',state.product.used,'WO-2048')+'</div>'+
    '<div class="section-grid" style="margin-top:14px"><div class="card"><div class="card-head"><div><span>WAREHOUSES</span><h2>Product inventory</h2></div><button class="secondary-btn" data-action="transfer-part">Transfer 2 RF-220 to Maya truck</button></div>'+
    '<div class="table-wrap"><table class="data-table"><thead><tr><th>Warehouse</th><th>Product</th><th>Available</th><th>Allocated</th><th>On hand</th><th>On order</th></tr></thead><tbody>'+
    inventoryRow('Main WA Warehouse',main)+inventoryRow('Maya Chen · Service Ute',truck)+'</tbody></table></div></div>'+
    '<div class="card"><div class="card-head"><div><span>MOVEMENT JOURNAL</span><h2>Inventory activity</h2></div></div><div class="timeline">'+
    '<div class="timeline-item"><div class="timeline-icon">WO</div><div><strong>WO-2048 product allocation</strong><p>RF-220 qty 1 allocated to Maya truck.</p></div></div>'+
    (state.product.used?'<div class="timeline-item"><div class="timeline-icon">USE</div><div><strong>RF-220 marked Used</strong><p>Truck available quantity reduced when line status became Used.</p></div></div>':'')+
    state.transfers.map(t=>'<div class="timeline-item"><div class="timeline-icon">TR</div><div><strong>'+t+'</strong><p>Training inventory transfer.</p></div></div>').join('')+
    '</div></div></div>';
}

function inventoryRow(name,p){
  return '<tr><td><strong>'+name+'</strong></td><td>RF-220 Return Filter</td><td>'+p.available+'</td><td>'+p.allocated+'</td><td>'+(p.available+p.allocated)+'</td><td>'+p.onOrder+'</td></tr>';
}

function renderReturns(){
  setPage('SUPPLY','Returns · RMA / RTV');
  $('#viewRoot').innerHTML='<div class="section-grid"><div class="card"><div class="card-head"><div><span>RETURN WORKFLOW</span><h2>Defective TS-14 temperature sensor</h2><p>Return linked to WO-2048 service history.</p></div></div>'+
    '<div class="workflow-panel">'+
    workflowStep('1','Create RMA','Identify work order, product, quantity and processing action',state.rma.created,!state.rma.created)+
    workflowStep('2','Receive RMA','Confirm received quantity and receiving date',state.rma.received,state.rma.created&&!state.rma.received)+
    workflowStep('3','Create RTV','Return defective component to supplier',state.rma.rtv,state.rma.received&&!state.rma.rtv)+
    '</div><div style="display:flex;gap:7px;margin-top:12px"><button class="primary-btn" data-action="create-rma" '+(state.rma.created?'disabled':'')+'>Create RMA</button><button class="secondary-btn" data-action="receive-rma" '+(!state.rma.created||state.rma.received?'disabled':'')+'>Receive</button><button class="secondary-btn" data-action="create-rtv" '+(!state.rma.received||state.rma.rtv?'disabled':'')+'>Create RTV</button></div></div>'+
    '<div class="card"><div class="card-head"><div><span>PROCESSING OPTIONS</span><h2>Return actions</h2></div></div><div class="sub-list"><div class="sub-row"><div><strong>Return to warehouse</strong><span>Restock serviceable product</span></div></div><div class="sub-row"><div><strong>Create RTV</strong><span>Send to vendor / manufacturer</span></div></div><div class="sub-row"><div><strong>Change asset ownership</strong><span>Transfer customer-asset ownership</span></div></div></div></div></div>';
}

function workflowStep(num,title,desc,done,current){
  return '<div class="workflow-step '+(done?'done':current?'current':'')+'"><b>'+(done?'✓':num)+'</b><div><strong>'+title+'</strong><span>'+desc+'</span></div><span class="pill">'+(done?'DONE':current?'NEXT':'WAIT')+'</span></div>';
}

function renderIoT(){
  setPage('CONNECTED SERVICE','IoT Alerts');
  $('#viewRoot').innerHTML='<div class="section-grid"><div class="card"><div class="card-head"><div><span>ACTIVE IOT ALERT</span><h2>Temperature anomaly · HPU-66210</h2><p>Azure IoT Hub → Connected Field Service alert</p></div><span class="status progress">ACTIVE</span></div>'+
    '<div class="fact-grid">'+fact('ASSET','PX-220 · HPU-66210')+fact('SIGNAL','Oil temperature')+fact('VALUE','92.4°C')+fact('DURATION','8 min')+fact('THRESHOLD','85°C')+fact('SITE','Red Ridge Processing')+'</div>'+
    '<div class="callout" style="margin-top:14px"><strong>Predictive service pattern</strong>A device can trigger an IoT alert, which can be reviewed and converted to a work order for scheduling and field execution.</div>'+
    '<button class="primary-btn" style="margin-top:12px" data-action="convert-iot" '+(state.iotConverted?'disabled':'')+'>'+(state.iotConverted?'Work order created':'Convert alert to work order')+'</button></div>'+
    '<div class="card"><div class="card-head"><div><span>CONNECTED FLOW</span><h2>Device → Service operation</h2></div></div><div class="workflow-panel">'+workflowStep('1','IoT device','Sensor sends cloud telemetry',true,false)+workflowStep('2','IoT alert','Business rule flags anomaly',true,false)+workflowStep('3','Work order','Create service demand',state.iotConverted,!state.iotConverted)+workflowStep('4','Schedule / dispatch','Assign technician',false,state.iotConverted)+'</div></div></div>';
}

function renderReadiness(){
  setPage('LEARNING','Role Readiness');
  const rows=[
    ['Dispatcher','Create work order',state.incidentApplied?100:60],
    ['Dispatcher','Schedule qualified resource',state.booking?100:20],
    ['Technician','Execute service tasks',Math.round(state.tasks.filter(x=>x.done).length/state.tasks.length*100)],
    ['Technician','Inspection / evidence',state.inspection.complete&&state.evidence.note?100:30],
    ['Technician','Complete booking',state.booking?.status==='Completed'?100:0],
    ['Service Manager','Review and post',state.posted?100:0],
    ['Inventory Manager','Inventory / returns',Math.max(calcReadiness('inventory'),20)]
  ];
  $('#viewRoot').innerHTML='<div class="page-grid kpi-grid">'+kpi('DISPATCHER',calcReadiness('dispatcher')+'%','Work order + scheduling')+kpi('TECHNICIAN',calcReadiness('technician')+'%','Field execution')+kpi('SERVICE MANAGER',calcReadiness('manager')+'%','Close + post')+kpi('INVENTORY',calcReadiness('inventory')+'%','Stock + returns')+'</div>'+
    '<div class="card" style="margin-top:14px"><div class="card-head"><div><span>NORTH STAR</span><h2>Can this person perform this task independently?</h2><p>Readiness is evaluated at workflow level, not by content completion.</p></div></div>'+
    '<div class="table-wrap"><table class="data-table"><thead><tr><th>Role</th><th>Workflow</th><th>Readiness</th><th>Evidence</th></tr></thead><tbody>'+
    rows.map(r=>'<tr><td>'+r[0]+'</td><td><strong>'+r[1]+'</strong></td><td><div class="progress-track" style="width:150px"><i style="width:'+r[2]+'%"></i></div><small>'+r[2]+'%</small></td><td>'+(r[2]===100?'Independent performance demonstrated':'More practice / evidence required')+'</td></tr>').join('')+
    '</tbody></table></div></div>';
}

function applyBookingStatusAction(action,value){
  if(action==='booking-status')changeBookingStatus(value);
}

function completeInspection(){
  if(!inspectionReady())return;
  if(state.inspection.test!=='Pass'){toast('Inspection failed. Create follow-up work rather than completing this booking.');return;}
  state.inspection.complete=true;logEvent('IN','Hydraulic inspection completed · Pass');setScenarioStep(5);toast('Inspection completed.');
  render();
}

function usePart(){
  if(state.product.used)return;
  state.product.used=1;state.product.status='Used';
  state.inventory['TRUCK-MAYA'].RF220.available=Math.max(0,state.inventory['TRUCK-MAYA'].RF220.available-1);
  logEvent('IV','RF-220 qty 1 marked Used · truck inventory reduced');setScenarioStep(5);
  toast('RF-220 marked Used. Truck inventory updated.');
  render();
}

function recordService(){
  state.service.actual=95;state.service.status='Used';logEvent('SV','Hydraulic Diagnostic Service · 95 min recorded');setScenarioStep(5);toast('Service duration recorded.');render();
}

function postWorkOrder(){
  if(state.workOrderStatus!=='Completed'){toast('Only Completed work orders can be posted.');return;}
  state.posted=true;state.workOrderStatus='Posted';state.actuals=true;
  const service=(state.service.actual/60*state.service.pricePerHour);
  const product=state.product.used*state.product.price;
  const travel=90;
  state.invoice={id:'INV-1048',service:+service.toFixed(2),product,travel,total:+(service+product+travel).toFixed(2)};
  logEvent('PO','Work order Posted · invoice and actuals generated');
  setScenarioStep(8);state.trainingScore.manager=100;
  toast('WO-2048 posted. INV-1048 and actuals generated.');
  render();
}

function generateAgreement(){
  state.agreementGenerated=true;
  state.generatedOrders.push({id:'WO-2054',account:'Pilbara Iron Operations',asset:'PX-440 · HPU-77821',type:'Preventative Maintenance',incident:'HPU Monthly Inspection',status:'Unscheduled',priority:'Normal',territory:'Pilbara',date:'01 Oct 2026',source:'Agreement'});
  logEvent('AG','Agreement AG-0038 generated WO-2054');toast('Recurring maintenance work order generated.');render();
}

function convertIoT(){
  state.iotConverted=true;
  state.generatedOrders.push({id:'WO-2055',account:'Red Ridge Processing',asset:'PX-220 · HPU-66210',type:'Repair',incident:'IoT Temperature Anomaly',status:'Unscheduled',priority:'High',territory:'Goldfields',date:'28 Sep 2026',source:'IoT'});
  logEvent('IoT','IoT alert converted to WO-2055');toast('IoT alert converted to a schedulable work order.');render();
}

function transferPart(){
  const main=state.inventory['MAIN-WA'].RF220,truck=state.inventory['TRUCK-MAYA'].RF220;
  if(main.available<2){toast('Insufficient stock.');return;}
  main.available-=2;truck.available+=2;state.transfers.push('RF-220 qty 2 · Main WA → Maya truck');state.trainingScore.inventory=Math.max(state.trainingScore.inventory,70);toast('Inventory transfer posted.');render();
}

function renderCatalog(){
  $('#workflowCatalog').innerHTML=Object.entries(catalog).map(([role,items])=>'<div class="workflow-group"><h3>'+role+'</h3><ol>'+items.map(x=>'<li>'+x+'</li>').join('')+'</ol></div>').join('');
}

function resetScenario(){
  location.reload();
}

function handleClick(e){
  const nav=e.target.closest('[data-nav]');if(nav){state.view=nav.dataset.nav;render();return;}
  const open=e.target.closest('[data-open-order]');if(open){state.selectedOrder=open.dataset.openOrder;state.view='workorders';state.detailTab='summary';if(state.selectedOrder==='WO-2048')setScenarioStep(1);render();return;}
  const tab=e.target.closest('[data-tab]');if(tab){state.detailTab=tab.dataset.tab;render();return;}
  const mobile=e.target.closest('[data-mobile-tab]');if(mobile){state.mobileTab=mobile.dataset.mobileTab;render();return;}
  const status=e.target.closest('[data-booking-status]');if(status){changeBookingStatus(status.dataset.bookingStatus);return;}
  const ins=e.target.closest('[data-inspection]');if(ins){state.inspection[ins.dataset.inspection]=ins.dataset.value;render();return;}
  const task=e.target.closest('[data-action]');
  if(!task)return;
  const action=task.dataset.action;
  if(action==='apply-incident')applyIncident();
  else if(action==='open-schedule'){state.view='schedule';state.showAssistant=true;setScenarioStep(3);render();}
  else if(action==='toggle-assistant'){state.showAssistant=!state.showAssistant;render();}
  else if(action==='book-resource')bookResource(task.dataset.resource);
  else if(action==='complete-inspection')completeInspection();
  else if(action==='use-part')usePart();
  else if(action==='record-service')recordService();
  else if(action==='add-note'){state.evidence.note=true;setScenarioStep(5);logEvent('NT','Technician service note added');toast('Technician note saved.');render();}
  else if(action==='add-photo'){state.evidence.photo=true;setScenarioStep(5);logEvent('PH','2 field photos attached');toast('Photo evidence attached.');render();}
  else if(action==='sign-off'){state.evidence.signature=true;setScenarioStep(5);logEvent('SG','Customer signature captured · Alicia Morgan');toast('Customer sign-off captured.');render();}
  else if(action==='post-work-order')postWorkOrder();
  else if(action==='generate-agreement')generateAgreement();
  else if(action==='convert-iot')convertIoT();
  else if(action==='transfer-part')transferPart();
  else if(action==='create-rma'){state.rma.created=true;toast('RMA created.');render();}
  else if(action==='receive-rma'){state.rma.received=true;state.trainingScore.inventory=Math.max(state.trainingScore.inventory,100);toast('RMA receipt posted. Inventory journal generated.');render();}
  else if(action==='create-rtv'){state.rma.rtv=true;toast('RTV created for supplier return.');render();}
}

function handleChange(e){
  if(e.target.matches('[data-task]')){
    const task=state.tasks.find(x=>x.id===e.target.dataset.task);if(task){task.done=e.target.checked;if(task.done){logEvent('TK','Task completed · '+task.name);setScenarioStep(5);}render();}
  }
}

$('#mainNav').addEventListener('click',e=>{
  const b=e.target.closest('[data-view]');if(!b)return;state.view=b.dataset.view;render();
});
$('#viewRoot').addEventListener('click',handleClick);
$('#viewRoot').addEventListener('change',handleChange);
$('#roleSelect').addEventListener('change',e=>{state.role=e.target.value;if(state.role==='technician')state.view='mobile';else if(state.role==='inventory')state.view='inventory';else if(state.role==='manager'){if(state.workOrderStatus==='Completed')setScenarioStep(7);state.view='workorders';}else state.view='dashboard';render();});
$$('.mode-btn').forEach(b=>b.addEventListener('click',()=>{state.mode=b.dataset.mode;$$('.mode-btn').forEach(x=>x.classList.toggle('active',x===b));updateShell();}));
$('#resetScenario').addEventListener('click',resetScenario);
$('#openCatalog').addEventListener('click',()=>{renderCatalog();$('#workflowDialog').showModal();});
$('#closeCatalog').addEventListener('click',()=>$('#workflowDialog').close());

render();
