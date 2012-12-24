var sigRoot = document.getElementById('sig');
var sigInst = sigma.init(sigRoot);
sigInst.addNode('hello',{
	label: 'Hello',
	color: '#ff0000'
}).addNode('world',{
		label: 'World !',
		color: '#00ff00'
	}).addEdge('hello_world','hello','world').draw();