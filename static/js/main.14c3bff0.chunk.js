(this.webpackJsonptiny_matrix_client=this.webpackJsonptiny_matrix_client||[]).push([[0],{149:function(e,t,n){e.exports=n(292)},154:function(e,t,n){},291:function(e,t,n){},292:function(e,t,n){"use strict";n.r(t);var a=n(9),r=n.n(a),i=n(146),s=n.n(i),o=(n(154),n(147)),l=n(63),c=n(64),u=n(66),h=n(65),p=n(67),m=n(148),d=n.n(m),C=(n(291),function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(u.a)(this,Object(h.a)(t).call(this,e))).setupClient=function(e){n.setState({client:e}),e.startClient(),e.once("sync",(function(e,t,a){console.log(e),n.setState({isClientReady:!0})}))},n.state={client:null,isClientReady:!1},n}return Object(p.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return this.state.isClientReady?r.a.createElement(f,{client:this.state.client}):r.a.createElement(b,{setupClient:this.setupClient})}}]),t}(a.Component)),b=function(e){function t(e){var n;return Object(l.a)(this,t),(n=Object(u.a)(this,Object(h.a)(t).call(this,e))).handleChange=function(e){return n.setState(Object(o.a)({},e.target.id,e.target.value))},n.handleSubmit=function(e){var t=d.a.createClient(n.state.server);t.login("m.login.password",{user:n.state.username,password:n.state.password}).then((function(e){return n.props.setupClient(t)})).catch((function(e){return alert(e.message)})),e.preventDefault()},n.state={server:"https://matrix.org",username:"",password:""},n}return Object(p.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("form",{onSubmit:this.handleSubmit},r.a.createElement("p",null,r.a.createElement("input",{id:"server",type:"url",autoComplete:"url",placeholder:"Server URL",value:this.state.server,onChange:this.handleChange})),r.a.createElement("p",null,r.a.createElement("input",{id:"username",type:"text",autoComplete:"username",placeholder:"Username",value:this.state.username,onChange:this.handleChange})),r.a.createElement("p",null,r.a.createElement("input",{id:"password",type:"password",autoComplete:"current-password",placeholder:"Password",value:this.state.password,onChange:this.handleChange})),r.a.createElement("input",{type:"submit",value:"Log in"}))}}]),t}(a.Component),f=function(e){function t(){return Object(l.a)(this,t),Object(u.a)(this,Object(h.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement("h1",null,"Chat !!!")}}]),t}(a.Component),v=C;Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(v,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[149,1,2]]]);
//# sourceMappingURL=main.14c3bff0.chunk.js.map