(this["webpackJsonpproject-tracker"]=this["webpackJsonpproject-tracker"]||[]).push([[0],{101:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(21),i=n.n(o),s=(n(63),n(3)),c=n(5),l=n(2),d=n(7),h=n(6),p=(n(23),n(18)),u=n(56),m=n(8),g=n(4),f=n(14),v=n(47),b=n(49),y=new(function(){function e(){var t=this;Object(s.a)(this,e),this.db=new b.a("ProjectTrackerDB"),this.db.version(1).stores({projects:"++id,title",nodes:"++id,projectId"}),this.db.open().catch((function(e){console.error("Opening the db '"+t.db.name+"' failed: "+e)})),this.seedData()}return Object(c.a)(e,[{key:"seedData",value:function(){var e=this;this.db.projects.toArray().then((function(t){t.length<=0&&(e.addProject("Adventure Game","Creating a new, fun adventure game!"),e.addProject("Test Project","A simple test project."))})),this.db.nodes.toArray().then((function(t){t.length<=0&&(e.addNode(1,"Test","Description",150,100,[2],[]),e.addNode(1,"Another Test","Description",200,300,[3],[1]),e.addNode(1,"Another Another Test","Description",300,450,[],[2]),e.addNode(2,"Different Project","Description",100,200,[],[]),e.addNode(2,"Another node","Description",150,400,[],[]))}))}},{key:"addProject",value:function(e,t){var n={title:e,description:t};return this.db.projects.add(n)}},{key:"addNode",value:function(e,t,n,a,r,o,i){var s={projectId:e,name:t,description:n,initialX:a,initialY:r,connectedFrom:o,connectedTo:i};return this.db.nodes.add(s)}},{key:"projects",get:function(){return this.db.projects}},{key:"nodes",get:function(){return this.db.nodes}}]),e}()),E=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={isModalOpen:!1},a.handleOpenModal=a.handleOpenModal.bind(Object(l.a)(a)),a.handleCloseModal=a.handleCloseModal.bind(Object(l.a)(a)),a}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.props.openModal(this.handleOpenModal)}},{key:"handleOpenModal",value:function(){this.setState({isModalOpen:!0})}},{key:"handleCloseModal",value:function(){this.setState({isModalOpen:!1})}},{key:"render",value:function(){var e=this.props.children,t=this.handleCloseModal;return r.a.createElement("div",{className:"".concat(this.state.isModalOpen?"flex":"hidden"," absolute-full items-center justify-center z-30")},r.a.createElement("div",{className:"absolute-full opacity-50 bg-gray-900 cursor-pointer",onClick:this.handleCloseModal}),r.a.createElement("div",{className:"p-4 sm:p-8 w-2/3 lg:w-1/2 bg-gray-100 z-40 rounded shadow-lg"},r.a.createElement("div",{className:"mb-4 flex items-center justify-between text-gray-800"},r.a.createElement("span",{className:"text-lg font-medium"},this.props.title),r.a.createElement(g.a,{className:"text-lg sm:text-xl cursor-pointer",icon:"times",onClick:this.handleCloseModal})),r.a.createElement("div",null,e({closeModal:t}))))}}]),n}(r.a.Component),x=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(e){var a;Object(s.a)(this,n),a=t.call(this,e);var r=e.title,o=e.description;return a.state={title:r||"",description:o||"",titleProp:r||"",descriptionProp:o||""},a.handleOnTitleChange=a.handleOnTitleChange.bind(Object(l.a)(a)),a.handleOnDescriptionChange=a.handleOnDescriptionChange.bind(Object(l.a)(a)),a}return Object(c.a)(n,[{key:"componentDidUpdate",value:function(){var e=this.props,t=e.title,n=e.description;if(console.log(t+" "+n),this.state.titleProp!==t||this.state.descriptionProp!==n){var a="",r="";t&&(a=t),n&&(r=n),this.setState({title:a,description:r,titleProp:a,descriptionProp:r})}}},{key:"handleOnTitleChange",value:function(e){this.setState({title:e.target.value})}},{key:"handleOnDescriptionChange",value:function(e){this.setState({description:e.target.value})}},{key:"render",value:function(){var e=this;return r.a.createElement("form",{className:"text-gray-800",action:""},r.a.createElement("label",{htmlFor:"projectTitle"},r.a.createElement("p",{className:"mb-2"},"Title"),r.a.createElement("input",{id:"projectTitle",className:"px-2 py-1 mb-4 w-full rounded shadow-inner bg-gray-300 text-gray-700 outline-none focus:shadow-outline focus:bg-blue-100",type:"text",value:this.state.title,onChange:this.handleOnTitleChange})),r.a.createElement("label",{htmlFor:"projectDescription"},r.a.createElement("p",{className:"mb-2"},"Description"),r.a.createElement("input",{id:"projectTitle",className:"px-2 py-1 mb-4 w-full rounded shadow-inner bg-gray-300 text-gray-700 outline-none focus:shadow-outline focus:bg-blue-100",type:"text",value:this.state.description,onChange:this.handleOnDescriptionChange})),r.a.createElement("div",{className:"mt-4 flex flex-col justify-center sm:justify-start sm:flex-row-reverse"},r.a.createElement("input",{className:"px-4 py-2 mb-2 sm:mb-0 rounded-md bg-indigo-500 text-gray-100 hover:bg-indigo-400 cursor-pointer",type:"button",value:"".concat(this.props.handleOnProjectCreate?"Create":"Edit"," Project"),onClick:function(){e.props.handleOnProjectCreate?e.props.handleOnProjectCreate(e.state.title,e.state.description)&&e.props.handleCloseModal():e.props.handleOnProjectUpdate&&e.props.handleOnProjectUpdate(e.state.title,e.state.description)&&e.props.handleCloseModal()}}),r.a.createElement("input",{className:"px-4 py-2 sm:mr-2 rounded-md bg-gray-300 text-indigo-500 hover:bg-gray-400 cursor-pointer",type:"button",value:"Cancel",onClick:this.props.handleCloseModal})))}}]),n}(r.a.Component),O=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={isNavMenuOpen:!1,openProjectModal:null},a.openNavMenu=a.openNavMenu.bind(Object(l.a)(a)),a.closeNavMenu=a.closeNavMenu.bind(Object(l.a)(a)),a.toggleNavMenu=a.toggleNavMenu.bind(Object(l.a)(a)),a.handleOnProjectCreate=a.handleOnProjectCreate.bind(Object(l.a)(a)),a}return Object(c.a)(n,[{key:"openNavMenu",value:function(){this.setState({isNavMenuOpen:!0})}},{key:"closeNavMenu",value:function(){this.setState({isNavMenuOpen:!1})}},{key:"toggleNavMenu",value:function(){this.state.isNavMenuOpen?this.closeNavMenu():this.openNavMenu()}},{key:"handleOnProjectCreate",value:function(e,t){var n=this;return!(!e||!t)&&(y.addProject(e,t).then((function(){n.props.refreshProjects()})).catch((function(e){console.error(e.stack||e)})),!0)}},{key:"render",value:function(){var e=this;return r.a.createElement("nav",{className:"nav"},r.a.createElement("div",{className:"lg:hidden flex items-center justify-between p-4 bg-gray-800"},r.a.createElement("div",{className:""},r.a.createElement(g.a,{className:"mr-4 text-2xl text-indigo-500",icon:"project-diagram"}),r.a.createElement(f.b,{to:"/",className:"text-xl text-gray-100 font-semibold"},"Project Tracker")),r.a.createElement("div",{className:"block"},r.a.createElement("button",{className:"flex items-center py-2 px-3 text-indigo-500 rounded border border-indigo-500 hover:bg-indigo-300",onClick:this.toggleNavMenu},r.a.createElement(g.a,{icon:"bars"})))),r.a.createElement("div",{className:"".concat(this.state.isNavMenuOpen?"":"hidden"," lg:hidden relative z-20")},r.a.createElement("div",{className:"absolute w-full px-4 pb-4 bg-gray-800"},this.props.projects.map((function(t,n){return r.a.createElement(f.b,{key:n,onClick:e.closeNavMenu,to:"/project/"+t.id,className:"block mb-1 px-4 py-2 rounded-md hover:bg-gray-900 focus:bg-gray-900 text-gray-100"},r.a.createElement(g.a,{className:"mr-4 text-lg text-gray-600",icon:"folder"}),t.title)})),r.a.createElement("div",{className:"w-full mb-1 px-4 py-2 rounded-md border-gray-600 border-dashed border-2 cursor-pointer hover:bg-gray-900 focus:bg-gray-900 text-gray-500",onClick:function(){e.state.openProjectModal(),e.closeNavMenu()}},r.a.createElement(g.a,{className:"mr-4 text-lg text-gray-600",icon:"plus"}),r.a.createElement("span",{className:"font-medium"},"Add Project")))),r.a.createElement("div",{className:"hidden lg:flex"},r.a.createElement("div",{className:"flex-grow h-screen bg-gray-800 relative"},r.a.createElement("div",{className:"p-4 h-16"},r.a.createElement(g.a,{className:"mr-4 text-2xl text-indigo-500",icon:"project-diagram"}),r.a.createElement(f.b,{to:"/",className:"text-xl text-gray-100 font-semibold"},"Project Tracker")),r.a.createElement("div",{className:"p-2 fixed top-16 bottom-0 my-auto lg:w-3/12 xl:w-1/5"},r.a.createElement(v.a,{noScrollX:!0},this.props.projects.map((function(e,t){return r.a.createElement(f.b,{key:t,to:"/project/"+e.id,className:"block mb-1 px-4 py-2 rounded-md hover:bg-gray-900 focus:bg-gray-900 text-gray-100"},r.a.createElement(g.a,{className:"mr-4 text-lg text-gray-600",icon:"folder"}),e.title)})),r.a.createElement("div",{className:"w-full mb-1 px-4 py-2 rounded-md border-gray-600 border-dashed border-2 cursor-pointer hover:bg-gray-900 focus:bg-gray-900 text-gray-500",onClick:this.state.openProjectModal},r.a.createElement(g.a,{className:"mr-4 text-lg text-gray-600",icon:"plus"}),r.a.createElement("span",{className:"font-medium"},"Add Project")))))),r.a.createElement(E,{title:"Create New Project",openModal:function(t){e.state.openProjectModal||e.setState({openProjectModal:t})}},(function(t){var n=t.closeModal;return r.a.createElement(x,{title:"",description:"",handleOnProjectCreate:e.handleOnProjectCreate,handleCloseModal:n})})))}}]),n}(r.a.Component),j=n(105),N=n(107),D=n(51),M=n.n(D),C=n(52),k=n.n(C),w=n(53),P=n.n(w),S=(n(92),n(17)),T=n(106),I=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(){var e;Object(s.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={x:void 0,y:void 0,dx:e.props.startX||0,dy:e.props.startY||0,isDragging:!1},e.handleDragStart=function(t){var n=e.props,a=n.onDragStart,r=n.resetOnStart,o=n.scaleX,i=n.scaleY;t.persist(),e.setState((function(e){var n=e.dx,a=e.dy,s=Object(T.a)(t)||{x:0,y:0};return{isDragging:!0,dx:r?0:n,dy:r?0:a,x:r?Math.floor(s.x/o):Math.floor(s.x/o)-n,y:r?Math.floor(s.y/i):Math.floor(s.y/i)-a}}),a&&function(){a(Object(S.a)(Object(S.a)({},e.state),{},{event:t}))})},e.handleDragMove=function(t){var n=e.props,a=n.onDragMove,r=n.scaleX,o=n.scaleY;t.persist(),e.setState((function(e){var n=e.x,a=e.y,i=e.isDragging,s=Object(T.a)(t)||{x:0,y:0};return i?{isDragging:!0,dx:Math.floor(s.x/r)-(n||0),dy:Math.floor(s.y/o)-(a||0)}:null}),a&&function(){e.state.isDragging&&a(Object(S.a)(Object(S.a)({},e.state),{},{event:t}))})},e.handleDragEnd=function(t){var n=e.props,a=n.onDragEnd,r=n.resetOnEnd;t.persist(),e.setState((function(e){return{isDragging:!1,dx:r?0:e.dx,dy:r?0:e.dy}}),a&&function(){a(Object(S.a)(Object(S.a)({},e.state),{},{event:t}))})},e}return Object(c.a)(n,[{key:"render",value:function(){var e=this.state,t=e.x,n=e.y,a=e.dx,o=e.dy,i=e.isDragging,s=this.props,c=s.children,l=s.width,d=s.height,h=s.captureDragArea;return r.a.createElement(r.a.Fragment,null,i&&h&&r.a.createElement("rect",{width:l,height:d,onMouseMove:this.handleDragMove,onMouseUp:this.handleDragEnd,fill:"transparent"}),c({x:t,y:n,dx:a,dy:o,isDragging:i,dragEnd:this.handleDragEnd,dragMove:this.handleDragMove,dragStart:this.handleDragStart}))}}]),n}(r.a.Component);I.defaultProps={captureDragArea:!0,resetOnStart:!1,resetOnEnd:!1};var U=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={x:0,y:0},a}return Object(c.a)(n,[{key:"render",value:function(){var e=this;return r.a.createElement(I,{width:this.props.width,height:this.props.height,startX:this.props.item.initialX,startY:this.props.item.initialY,scaleX:this.props.zoom.transformMatrix.scaleX,scaleY:this.props.zoom.transformMatrix.scaleY},(function(t){var n=t.dragStart,a=t.dragEnd,o=t.dragMove,i=t.isDragging,s=t.dx,c=t.dy;return r.a.createElement("g",{key:"node-".concat(e.props.item.id),transform:"translate(".concat(s,", ").concat(c,")"),style:{cursor:i?"move":"pointer"}},r.a.createElement("g",{onMouseMove:function(t){e.props.handleDragMove(e.props.item.id,s,c),o(t)},onMouseDown:function(t){e.props.handleDragStart(e.props.item.id),n(t)},onMouseUp:function(t){e.props.handleDragEnd(e.props.item.id,s,c),a(t)},onTouchMove:function(t){e.props.handleDragMove(e.props.item.id,s,c),o(t)},onTouchStart:function(t){e.props.handleDragStart(e.props.item.id),n(t)},onTouchEnd:function(t){e.props.handleDragEnd(e.props.item.id,s,c),a(t)}},r.a.createElement("g",{onPointerUp:function(){return e.props.toggleNodeOptions(e.props.item.id)}},r.a.createElement("rect",{"data-name":"node-".concat(e.props.item.id),className:"node-root fill-current text-gray-600",width:"300",height:"100",rx:"7",style:{stroke:e.props.selectedNodeId===e.props.item.id?"#4a5568":"none",strokeWidth:7},filter:"url(#nodeShadow)"}),r.a.createElement("foreignObject",{width:"300",height:"100"},r.a.createElement("div",{className:"p-4 flex items-center w-full h-full pointer-events-none"},r.a.createElement("div",{className:"flex flex-col w-full text-gray-800"},r.a.createElement("span",{className:"text-2xl font-bold truncate select-none"},e.props.item.name),r.a.createElement("span",{className:"text-xl font-medium truncate select-none"},"".concat(5," subgoals")," \u2022 ","".concat(10," in list"))))))),e.props.selectedNodeId===e.props.item.id&&r.a.createElement(r.a.Fragment,null,r.a.createElement("g",{onClick:function(){return e.props.handleOpenViewNode(e.props.item.name,e.props.item.description)}},r.a.createElement("rect",{className:"fill-current text-gray-500",x:"23",y:"-90",width:"74",height:"74",rx:"10",filter:"url(#nodeShadow)"}),r.a.createElement("foreignObject",{x:"23",y:"-90",width:"74",height:"74",className:"text-4xl text-gray-800 pointer-events-none"},r.a.createElement("div",{className:"flex items-center justify-center w-full h-full"},r.a.createElement(g.a,{icon:"eye"})))),r.a.createElement("g",{onClick:function(){return e.props.handleOpenEditNode(e.props.item.name,e.props.item.description)}},r.a.createElement("rect",{className:"fill-current text-gray-500",x:"113",y:"-90",width:"74",height:"74",rx:"10",filter:"url(#nodeShadow)"}),r.a.createElement("foreignObject",{x:"113",y:"-90",width:"74",height:"74",className:"text-4xl text-gray-800 pointer-events-none"},r.a.createElement("div",{className:"flex items-center justify-center w-full h-full"},r.a.createElement(g.a,{icon:"pencil-alt"})))),r.a.createElement("g",{onClick:function(){return e.props.handleOnNodeDelete(e.props.item.id)}},r.a.createElement("rect",{className:"fill-current text-gray-500",x:"203",y:"-90",width:"74",height:"74",rx:"10",filter:"url(#nodeShadow)"}),r.a.createElement("foreignObject",{x:"203",y:"-90",width:"74",height:"74",className:"text-4xl text-gray-800 pointer-events-none"},r.a.createElement("div",{className:"flex items-center justify-center w-full h-full"},r.a.createElement(g.a,{icon:"trash-alt"}))))),r.a.createElement(I,{key:"edge-".concat(e.props.item.id),width:e.props.width,height:e.props.height,scaleX:e.props.zoom.transformMatrix.scaleX,scaleY:e.props.zoom.transformMatrix.scaleY,onDragStart:function(){return e.props.handleDragStart(e.props.item.id)},onDragEnd:function(t){return e.props.handleEdgeCtrlDragEnd(t.event,e.props.item)},resetOnStart:!0,resetOnEnd:!0},(function(e){var t=e.dragStart,n=e.dragEnd,a=e.dragMove,o=(e.isDragging,e.dx),i=e.dy;return r.a.createElement("g",{transform:"translate(".concat(o,", ").concat(i,")"),className:"z-30",onMouseMove:a,onMouseDown:t,onMouseUp:n,onTouchMove:a,onTouchStart:t,onTouchEnd:n},r.a.createElement("circle",{cx:"300",cy:"50",r:"20",style:{visibility:"visible"},className:"fill-current text-gray-400"}),r.a.createElement("circle",{cx:"300",cy:"50",r:"20",stroke:"#2d3748",strokeWidth:"5",fill:"none",className:"pointer-events-none"}),r.a.createElement("foreignObject",{x:"280",y:"30",width:"40",height:"40",className:"text-2xl text-gray-800 pointer-events-none"},r.a.createElement("div",{className:"flex items-center justify-center w-full h-full"},r.a.createElement(g.a,{icon:"plus"}))))})))}))}}]),n}(r.a.Component),A={scaleX:.5,scaleY:.5,translateX:100,translateY:100,skewX:0,skewY:0},X=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={projectId:0,draggableItems:[],isDirtyDB:!1,isDirtyDOM:!1,nodeCtrlHidden:!0,selectedNodeId:0,listeners:{},edges:{},openNodeModal:null,nodeModalMode:0,nodeTitle:"",nodeDescription:""},a.handleDragStart=a.handleDragStart.bind(Object(l.a)(a)),a.handleDragMove=a.handleDragMove.bind(Object(l.a)(a)),a.handleDragEnd=a.handleDragEnd.bind(Object(l.a)(a)),a.handleEdgeCtrlDragEnd=a.handleEdgeCtrlDragEnd.bind(Object(l.a)(a)),a.handleOnEdgeCreated=a.handleOnEdgeCreated.bind(Object(l.a)(a)),a.handleOnEdgeDelete=a.handleOnEdgeDelete.bind(Object(l.a)(a)),a.handleOpenViewNode=a.handleOpenViewNode.bind(Object(l.a)(a)),a.handleOpenCreateNode=a.handleOpenCreateNode.bind(Object(l.a)(a)),a.handleOpenEditNode=a.handleOpenEditNode.bind(Object(l.a)(a)),a.handleOnNodeCreate=a.handleOnNodeCreate.bind(Object(l.a)(a)),a.handleOnNodeUpdate=a.handleOnNodeUpdate.bind(Object(l.a)(a)),a.handleOnNodeDelete=a.handleOnNodeDelete.bind(Object(l.a)(a)),a.toggleNodeCtrl=a.toggleNodeCtrl.bind(Object(l.a)(a)),a.toggleNodeOptions=a.toggleNodeOptions.bind(Object(l.a)(a)),a.checkGraphCycleExists=a.checkGraphCycleExists.bind(Object(l.a)(a)),a}return Object(c.a)(n,[{key:"componentDidUpdate",value:function(){var e=this,t=parseInt(this.props.projectId);(this.state.projectId!==t||this.state.isDirtyDB)&&y.nodes.where("projectId").equals(t).toArray().then((function(n){e.setState({projectId:t,draggableItems:n,isDirtyDB:!1})})).catch((function(e){console.error(e.stack||e)})),this.state.isDirtyDOM&&(this.state.draggableItems.forEach((function(t){e.handleDragMove(t.id,t.initialX,t.initialY)})),this.setState({isDirtyDOM:!1}))}},{key:"handleDragStart",value:function(e){var t=[].concat(this.state.draggableItems),n=t.indexOfWhen((function(t){return t.id===e})),a=t.splice(n,1)[0],r=t.concat(a);this.setState({draggableItems:r})}},{key:"handleDragMove",value:function(e,t,n){var a=this.state.edges[e];a&&a.length>0&&a.forEach((function(e){e.callable(t,n)}))}},{key:"handleDragEnd",value:function(e,t,n){var a=this;y.nodes.update(e,{initialX:t,initialY:n}).then((function(e){a.setState({isDirtyDB:!0})}))}},{key:"handleEdgeCtrlDragEnd",value:function(e,t){var n=this,a=Math.floor(e.clientX||e.changedTouches[0].clientX),r=Math.floor(e.clientY||e.changedTouches[0].clientY),o=document.elementsFromPoint(a,r).find((function(e){return e.getAttribute("data-name")}));if(o){var i=o.getAttribute("data-name");if(void 0===i||null===i)return null;if(i!=="node-".concat(t.id)){var s=this.state.draggableItems,c=parseInt(i.substring(5)),l=s.find((function(e){return e.id===c})),d=l.connectedFrom,h=t,p=h.connectedTo;if(p.indexOf(l.id)<0){if(this.checkGraphCycleExists(l.connectedTo,h.id))return;p.push(l.id),d.push(h.id)}y.nodes.update(h.id,{connectedTo:p}).then((function(e){return y.nodes.update(l.id,{connectedFrom:d})})).then((function(e){n.setState({isDirtyDB:!0})}))}}}},{key:"checkGraphCycleExists",value:function(e,t){var n=this;if(e.some((function(e){return e===t})))return!0;for(var a=!1,r=function(){var r=e[o],i=n.state.draggableItems.find((function(e){return e.id===r})).connectedTo;if(a=n.checkGraphCycleExists(i,t))return"break"},o=0;o<e.length;o++){if("break"===r())break}return a}},{key:"handleOnEdgeCreated",value:function(e,t,n){var a=this.state.edges;a[e]||(a[e]=[]);var r={to:t,callable:n};a[e].push(r),this.setState({edges:a,isDirtyDOM:!0})}},{key:"handleOnEdgeDelete",value:function(e,t){var n=this,a=this.state.draggableItems.find((function(t){return t.id===e})).connectedTo,r=this.state.draggableItems.find((function(e){return e.id===t})).connectedFrom,o=a.indexOf(t),i=r.indexOf(e);if(!(o<0||i<0)){a.splice(o,1),r.splice(i,1);var s=this.state.edges;s[e].removeIf((function(e){return e.to===t})),s[t].removeIf((function(t){return t.to===e})),this.setState({edges:s}),y.nodes.update(e,{connectedTo:a}).then((function(e){return y.nodes.update(t,{connectedFrom:r})})).then((function(e){n.setState({isDirtyDB:!0})}))}}},{key:"handleOnNodeCreate",value:function(e,t,n,a){var r=this;if(!n||!a)return!1;var o=this.state.projectId;return y.addNode(o,n,a,e,t,[],[]).then((function(){r.setState({isDirtyDB:!0})})).catch((function(e){console.error(e.stack||e)})),!0}},{key:"handleOnNodeUpdate",value:function(e,t,n){var a=this;return!(!t||!n)&&(y.nodes.update(e,{name:t,description:n}).then((function(){a.setState({isDirtyDB:!0})})),!0)}},{key:"handleOnNodeDelete",value:function(e){var t=this,n=this.state.draggableItems.find((function(t){return t.id===e}));n.connectedTo.forEach((function(e){t.handleOnEdgeDelete(n.id,e)})),n.connectedFrom.forEach((function(e){t.handleOnEdgeDelete(e,n.id)})),y.nodes.delete(e).then((function(){t.setState({isDirtyDB:!0})}))}},{key:"handleOpenViewNode",value:function(e,t){this.state.openNodeModal(),this.setState({nodeModalMode:0,nodeTitle:e,nodeDescription:t})}},{key:"handleOpenCreateNode",value:function(){this.state.openNodeModal(),this.setState({nodeModalMode:1})}},{key:"handleOpenEditNode",value:function(e,t){this.state.openNodeModal(),this.setState({nodeModalMode:2,nodeTitle:e,nodeDescription:t})}},{key:"toggleNodeCtrl",value:function(){this.setState((function(e){return{nodeCtrlHidden:!e.nodeCtrlHidden}}))}},{key:"toggleNodeOptions",value:function(e){this.state.selectedNodeId===e?this.setState({selectedNodeId:0}):this.setState({selectedNodeId:e})}},{key:"render",value:function(){var e=this,t=this.props.width,n=this.props.height;return r.a.createElement(r.a.Fragment,null,r.a.createElement(N.a,{width:t,height:n,scaleXMin:1/4,scaleXMax:2,scaleYMin:1/4,scaleYMax:2,transformMatrix:A},(function(a){return r.a.createElement("div",{className:"relative bg-gray-300"},r.a.createElement("svg",{width:t,height:n,style:{cursor:a.isDragging?"grabbing":"grab"}},r.a.createElement("defs",null,r.a.createElement("filter",{id:"nodeShadow",x:"-50%",y:"-50%",width:"160%",height:"160%"},r.a.createElement("feOffset",{result:"offOut",in:"SourceGraphic",dy:"4"}),r.a.createElement("feGaussianBlur",{result:"blurOut",in:"offOut",stdDeviation:"4"}),r.a.createElement("feBlend",{in:"SourceGraphic",in2:"blurOut",mode:"normal"}))),r.a.createElement("rect",{width:t,height:n,fill:"transparent",onTouchStart:a.dragStart,onTouchMove:a.dragMove,onTouchEnd:function(){e.toggleNodeOptions(0),a.dragEnd()},onMouseDown:a.dragStart,onMouseMove:a.dragMove,onMouseUp:function(){e.toggleNodeOptions(0),a.dragEnd()},onMouseLeave:function(){a.isDragging&&a.dragEnd()}}),r.a.createElement("g",{name:"node-root",transform:a.toString()},e.state.draggableItems.map((function(o,i){return r.a.createElement("g",{key:"".concat(o.id)},o.connectedTo.map((function(t){return r.a.createElement(Y,{key:"edge-".concat(o.id,"-").concat(t),changePosCallable:function(n){e.handleOnEdgeCreated(o.id,t,n)}},(function(n){var a=n.startDx,i=n.startDy;return r.a.createElement(H,{changePosCallable:function(n){e.handleOnEdgeCreated(t,o.id,n)}},(function(n){var s=n.endDx,c=n.endDy;return r.a.createElement(F,{startDx:a,startDy:i,endDx:s,endDy:c,handleOnClick:function(){return e.handleOnEdgeDelete(o.id,t)}},(function(e){var t=e.midPointX,n=e.midPointY,a=e.isHovered;return r.a.createElement("foreignObject",{visibility:a?"visible":"hidden",x:t-15,y:n-10,width:"30",height:"20",className:"pointer-events-none"},r.a.createElement("div",{className:"w-full h-full flex items-center justify-center bg-gray-800"},r.a.createElement(g.a,{className:"text-gray-300",icon:"times"})))}))}))}))})),r.a.createElement(U,{item:o,width:t,height:n,zoom:a,selectedNodeId:e.state.selectedNodeId,handleDragStart:e.handleDragStart,handleDragMove:e.handleDragMove,handleDragEnd:e.handleDragEnd,handleEdgeCtrlDragEnd:e.handleEdgeCtrlDragEnd,handleOnNodeDelete:e.handleOnNodeDelete,handleOpenViewNode:e.handleOpenViewNode,handleOpenEditNode:e.handleOpenEditNode,toggleNodeOptions:e.toggleNodeOptions}))})))),r.a.createElement("div",{className:"pin-bot-right absolute pb-4 pr-4 sm:pb-6 sm:pr-6 flex flex-col items-end"},r.a.createElement("button",{className:"px-2 lg:px-3 py-1 mb-1 rounded text-sm lg:text-xl bg-gray-400 hover:bg-gray-900 text-gray-900 hover:text-gray-400",onClick:function(){return a.scale({scaleX:1.2,scaleY:1.2})}},r.a.createElement(g.a,{icon:"plus"})),r.a.createElement("button",{className:"px-2 lg:px-3 py-1 mb-4 rounded text-sm lg:text-xl bg-gray-400 hover:bg-gray-900 text-gray-900 hover:text-gray-400",onClick:function(){return a.scale({scaleX:.8,scaleY:.8})}},r.a.createElement(g.a,{icon:"minus"})),r.a.createElement("button",{className:"px-2 py-1 rounded text-xs lg:text-base select-none bg-gray-400 hover:bg-gray-900 text-gray-900 hover:text-gray-400",onClick:a.reset},"Reset")),r.a.createElement("div",{className:"pin-bot-left absolute pb-4 pl-4 sm:pb-6 sm:pl-6 flex flex-row items-center"},r.a.createElement("button",{className:"px-4 py-2 sm:px-6 sm:py-4 z-10 rounded-full shadow-md text-2xl bg-gray-700 hover:bg-gray-900 text-gray-300 hover:text-gray-100",onClick:e.toggleNodeCtrl},r.a.createElement(g.a,{className:"shadow-inner",icon:"plus"})),r.a.createElement("div",{className:"".concat(e.state.nodeCtrlHidden?"hidden":""," -ml-8 pl-10 pr-2 py-2 sm:-ml-8 sm:pl-12 sm:pr-4 sm:py-2 rounded-r-lg shadow-md bg-gray-100")},r.a.createElement("button",{className:"px-3 py-1 sm:px-5 sm:py-3 rounded-lg shadow font-semibold bg-gray-400",onClick:e.handleOpenCreateNode},"Node"))))})),r.a.createElement(E,{title:"".concat(0===this.state.nodeModalMode?"View":1===this.state.nodeModalMode?"Create New":"Edit"," Node"),openModal:function(t){e.state.openNodeModal||e.setState({openNodeModal:t})}},(function(t){var n=t.closeModal;return 0===e.state.nodeModalMode&&r.a.createElement(W,{title:e.state.nodeTitle,description:e.state.nodeDescription,handleCloseModal:n})||1===e.state.nodeModalMode&&r.a.createElement(B,{title:"",description:"",handleOnNodeCreate:e.handleOnNodeCreate,handleCloseModal:n})||2===e.state.nodeModalMode&&r.a.createElement(B,{itemId:e.state.selectedNodeId,title:e.state.nodeTitle,description:e.state.nodeDescription,handleOnNodeUpdate:e.handleOnNodeUpdate,handleCloseModal:n})})))}}]),n}(r.a.Component);Array.prototype.removeIf=function(e){for(var t=this.length;t--;)e(this[t])&&this.splice(t,1)},Array.prototype.indexOfWhen=function(e){for(var t=0;t<this.length;){if(e(this[t]))return t;t++}};var Y=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={startDx:0,startDy:0},a.handlePosChanged=a.handlePosChanged.bind(Object(l.a)(a)),a}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.props.changePosCallable(this.handlePosChanged)}},{key:"handlePosChanged",value:function(e,t){this.setState({startDx:e,startDy:t})}},{key:"render",value:function(){var e=this.state,t=e.startDx,n=e.startDy,a=this.props.children;return r.a.createElement(r.a.Fragment,null,a({startDx:t,startDy:n}))}}]),n}(r.a.Component),H=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={endDx:0,endDy:0},a.handlePosChanged=a.handlePosChanged.bind(Object(l.a)(a)),a}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.props.changePosCallable(this.handlePosChanged)}},{key:"handlePosChanged",value:function(e,t){this.setState({endDx:e,endDy:t})}},{key:"render",value:function(){var e=this.state,t=e.endDx,n=e.endDy,a=this.props.children;return r.a.createElement(r.a.Fragment,null,a({endDx:t,endDy:n}))}}]),n}(r.a.Component),F=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={isHovered:!1},a.handleOnEnter=a.handleOnEnter.bind(Object(l.a)(a)),a.handleOnExit=a.handleOnExit.bind(Object(l.a)(a)),a}return Object(c.a)(n,[{key:"handleOnEnter",value:function(){this.setState({isHovered:!0})}},{key:"handleOnExit",value:function(){this.setState({isHovered:!1})}},{key:"render",value:function(){var e=(this.props.endDx-this.props.startDx-300)/2+(this.props.startDx+300),t=(this.props.endDy+50-this.props.startDy-50)/2+(this.props.startDy+50),n=this.state.isHovered,a=this.props.children;return r.a.createElement(r.a.Fragment,null,r.a.createElement("path",{d:"M".concat(this.props.startDx+300," ").concat(this.props.startDy+50," Q").concat(this.props.startDx+350," ").concat(this.props.startDy+50," ").concat(e," ").concat(t," Q").concat(this.props.endDx-50," ").concat(this.props.endDy+50," ").concat(this.props.endDx," ").concat(this.props.endDy+50),className:"stroke-current text-gray-800 pointer-events-none",strokeWidth:"5",fill:"none"}),r.a.createElement("path",{d:"M".concat(this.props.startDx+300," ").concat(this.props.startDy+50," Q").concat(this.props.startDx+350," ").concat(this.props.startDy+50," ").concat(e," ").concat(t," Q").concat(this.props.endDx-50," ").concat(this.props.endDy+50," ").concat(this.props.endDx," ").concat(this.props.endDy+50),stroke:"transparent",strokeWidth:"50",fill:"none",onMouseEnter:this.handleOnEnter,onMouseLeave:this.handleOnExit,onMouseUp:this.props.handleOnClick,onTouchEnd:this.props.handleOnClick}),a({midPointX:e,midPointY:t,isHovered:n}))}}]),n}(r.a.Component),B=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(e){var a;Object(s.a)(this,n),a=t.call(this,e);var r=e.title,o=e.description;return a.state={title:r||"",description:o||"",titleProp:r||"",descriptionProp:o||""},a.handleOnTitleChange=a.handleOnTitleChange.bind(Object(l.a)(a)),a.handleOnDescriptionChange=a.handleOnDescriptionChange.bind(Object(l.a)(a)),a}return Object(c.a)(n,[{key:"componentDidUpdate",value:function(){var e=this.props,t=e.title,n=e.description;if(this.state.titleProp!==t||this.state.descriptionProp!==n){var a="",r="";t&&(a=t),n&&(r=n),this.setState({title:a,description:r,titleProp:a,descriptionProp:r})}}},{key:"handleOnTitleChange",value:function(e){this.setState({title:e.target.value})}},{key:"handleOnDescriptionChange",value:function(e){this.setState({description:e})}},{key:"render",value:function(){var e=this;return r.a.createElement("form",{className:"text-gray-800",action:""},r.a.createElement("label",{htmlFor:"nodeTitle"},r.a.createElement("p",{className:"mb-2"},"Title"),r.a.createElement("input",{id:"nodeTitle",className:"px-2 py-1 mb-4 w-full rounded shadow-inner bg-gray-300 text-gray-700 outline-none focus:shadow-outline focus:bg-blue-100",type:"text",value:this.state.title,onChange:this.handleOnTitleChange})),r.a.createElement("label",{htmlFor:"nodeDescription"},r.a.createElement("p",{className:"mb-2"},"Description"),r.a.createElement(M.a,{editor:k.a,data:this.state.description,onChange:function(t,n){e.handleOnDescriptionChange(n.getData())}})),r.a.createElement("div",{className:"mt-4 flex flex-col justify-center sm:justify-start sm:flex-row-reverse"},r.a.createElement("input",{className:"px-4 py-2 mb-2 sm:mb-0 rounded-md bg-indigo-500 text-gray-100 hover:bg-indigo-400 cursor-pointer",type:"button",value:"".concat(this.props.handleOnNodeCreate?"Create":"Edit"," Node"),onClick:function(){e.props.handleOnNodeCreate?e.props.handleOnNodeCreate(0,0,e.state.title,e.state.description)&&e.props.handleCloseModal():e.props.handleOnNodeUpdate&&e.props.handleOnNodeUpdate(e.props.itemId,e.state.title,e.state.description)&&e.props.handleCloseModal()}}),r.a.createElement("input",{className:"px-4 py-2 sm:mr-2 rounded-md bg-gray-300 text-indigo-500 hover:bg-gray-400 cursor-pointer",type:"button",value:"Cancel",onClick:this.props.handleCloseModal})))}}]),n}(r.a.Component),W=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={title:"",description:""},a}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.componentDidUpdate()}},{key:"componentDidUpdate",value:function(){var e=this.props,t=e.title,n=e.description;if(this.state.title!==t||this.state.description!==n){var a="",r="";t&&(a=t),n&&(r=n),this.setState({title:a,description:r})}}},{key:"render",value:function(){return r.a.createElement("div",{className:"text-gray-800"},r.a.createElement("p",{className:"mb-2 text-xl font-bold"},this.props.title),r.a.createElement("hr",{className:"mb-4"}),r.a.createElement("div",{className:"ck-content",dangerouslySetInnerHTML:{__html:P.a.sanitize(this.props.description)}}))}}]),n}(r.a.Component),z=(r.a.Component,function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={selectedProject:{id:0,title:"",description:""},topHidden:!1,openProjectModal:null},a.handleHideTop=a.handleHideTop.bind(Object(l.a)(a)),a.handleOnProjectUpdate=a.handleOnProjectUpdate.bind(Object(l.a)(a)),a.handleOnProjectDelete=a.handleOnProjectDelete.bind(Object(l.a)(a)),a}return Object(c.a)(n,[{key:"componentDidUpdate",value:function(){var e=this,t=parseInt(this.props.projectId);this.state.selectedProject.id!==t&&y.projects.get(t,(function(t){e.setState({selectedProject:t})})).catch((function(e){console.error(e.stack||e)}))}},{key:"handleHideTop",value:function(){this.setState((function(e){return{topHidden:!e.topHidden}}))}},{key:"handleOnProjectUpdate",value:function(e,t){var n=this;return!(!e||!t)&&(y.projects.update(this.state.selectedProject.id,{title:e,description:t}).then((function(){n.props.refreshProjects()})).catch((function(e){console.error(e.stack||e)})),!0)}},{key:"handleOnProjectDelete",value:function(){var e=this;y.projects.delete(this.state.selectedProject.id).then((function(){e.props.refreshProjects()})).catch((function(e){console.error(e.stack||e)}))}},{key:"render",value:function(){var e=this;return this.state.selectedProject?r.a.createElement("div",{className:"main"},r.a.createElement("div",{className:"relative"},r.a.createElement("div",{className:"absolute w-full z-10"},r.a.createElement("div",{className:"".concat(this.state.topHidden?"hidden":"flex","  px-4 py-2 sm:p-6 items-center justify-between shadow bg-gray-100")},r.a.createElement("div",{className:""},r.a.createElement("h1",{className:"text-xl font-bold"},this.state.selectedProject.title),r.a.createElement("span",{className:"text-gray-700"},this.state.selectedProject.description)),r.a.createElement("div",{className:"flex flex-col sm:flex-row ml-2"},r.a.createElement("button",{className:"mb-2 sm:mr-2 sm:mb-0 px-3 py-1 rounded-md whitespace-no-wrap text-indigo-500 border select-none border-indigo-500 hover:bg-indigo-500 hover:text-gray-100",onClick:this.state.openProjectModal},r.a.createElement(g.a,{className:"mr-2",icon:"pencil-alt"}),"Edit"),r.a.createElement("button",{className:"px-3 py-1 rounded-md whitespace-no-wrap text-red-500 border select-none border-red-500 hover:bg-red-500 hover:text-gray-100",onClick:this.handleOnProjectDelete},r.a.createElement(g.a,{className:"mr-2",icon:"times"}),"Delete"))),r.a.createElement("div",{className:"relative"},r.a.createElement("button",{className:"hide-proj px-2 pb-1 lg:px-3 lg:py-2 absolute rounded-b-full bg-gray-400 text-gray-900 hover:bg-gray-900 hover:text-gray-400",onClick:this.handleHideTop},r.a.createElement(g.a,{className:"sm:text-base lg:text-xl",icon:this.state.topHidden?"chevron-down":"chevron-up"}))))),r.a.createElement(j.a,null,(function(t){var n=t.width,a=t.height;return r.a.createElement(X,{projectId:e.props.projectId,width:n,height:a})})),r.a.createElement(E,{title:"Edit Project",openModal:function(t){e.state.openProjectModal||e.setState({openProjectModal:t})}},(function(t){var n=t.closeModal;return r.a.createElement(x,{title:e.state.selectedProject.title,description:e.state.selectedProject.description,handleOnProjectUpdate:e.handleOnProjectUpdate,handleCloseModal:n})}))):r.a.createElement("div",{className:"p-6"},r.a.createElement("h1",{className:"text-xl font-bold"},"Please select a project first."))}}]),n}(r.a.Component));p.b.add(u.a);var G=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={projects:[]},a.refreshProjects=a.refreshProjects.bind(Object(l.a)(a)),a.handleAddProject=a.handleAddProject.bind(Object(l.a)(a)),a}return Object(c.a)(n,[{key:"componentDidMount",value:function(){this.refreshProjects()}},{key:"refreshProjects",value:function(){var e=this;y.projects.toArray().then((function(t){e.setState({projects:t})}))}},{key:"handleAddProject",value:function(e,t){var n=this;y.addProject(e,t).then((function(e){n.refreshProjects()}))}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"flex flex-col lg:flex-row"},r.a.createElement(O,{projects:this.state.projects,refreshProjects:this.refreshProjects}),r.a.createElement("article",null,r.a.createElement(m.c,null,r.a.createElement(m.a,{path:"/project/:projectId"},r.a.createElement(V,null,(function(t){var n=t.projectId;return r.a.createElement(z,{projectId:n,refreshProjects:e.refreshProjects})}))),r.a.createElement(m.a,{path:"/"},r.a.createElement("div",{className:"p-6"},r.a.createElement("h1",{className:"text-xl font-bold"},"Please select a project first."))))))}}]),n}(r.a.Component);function V(e){return(0,e.children)({projectId:Object(m.f)().projectId})}var L=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function Q(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(f.a,null,r.a.createElement(G,null))),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/project-tracker",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("/project-tracker","/service-worker.js");L?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):Q(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):Q(t,e)}))}}()},23:function(e,t,n){},58:function(e,t,n){e.exports=n(101)},63:function(e,t,n){},92:function(e,t,n){}},[[58,1,2]]]);
//# sourceMappingURL=main.fffa74f3.chunk.js.map