


define(RequireImports.new()
	.toArray(),function()
{
	var PresView = window.PresView = function()
	{
		var self = this;

		$(document).ready(function()
		{
			self.page1();
		})
	};

	PresView.prototype.updateLinks = function(parent)
	{
		var self = this;
		var page = parent.attr("id");
		var nextPage = "page" + (parseInt(page.substr(4)) + 1);

		var anchors = parent.find("a");
		anchors.each(function(index,elem)
		{
			elem = $(elem);
			var elemHref = elem.attr("href");

			if (elemHref != "#next")
			{
				elem.attr("target","_blank");

				if (elemHref.indexOf("#") == 0)
				{
					elem.append('<span class="ui-icon ui-icon-disk"></span>');

					var downloadFile = elemHref.replace("#","");

					if (downloadFile == "")
						downloadFile += elem.text();

					if (downloadFile.indexOf(".") == -1)
						downloadFile += ".zip";

					elem.attr("href","/files/" + downloadFile);
				}
				else
				{
					elem.append('<span class="ui-icon ui-icon-extlink"></span>');
				}
			}
		});

		parent.on("click","a",function(e)
		{
			var anchor = $(this);
			var anchorHref = anchor.attr("href");

			if (anchorHref == "#next")
			{
				parent.fadeOut(1000, function()
				{
					parent.remove();
					self[nextPage]();
				});
			}
		})
	}

	PresView.prototype.page1 = function()
	{
		var self = this;
		var parent = $('<div id="page1"></div>').appendTo("body");

		parent.addClass('tk-museo-sans');
		parent.append('<span class="header">Node.js Setup</span>');
		parent.append('<hr />');

		parent.append('<span class="name">dependencies: </span>');
		parent.append('<span class="value"><a href="#">package.json</a></span>');
		parent.append('<span class="sidenote">copy to root dir, then run `npm install`</span>');

		parent.append('<br />');

		parent.append('<span class="name">continuous deploy: </span>');
		parent.append('<span class="value">sudo npm install -g node-supervisor</span>');
		parent.append('<span class="sidenote">usage `node-supervisor -w web.js,lib web.js`</span>');

		parent.append('<br />');

		parent.append('<span class="name">lib: </span>');
		parent.append('<span class="value"><a href="#lib">route & data support</a></span>');
		parent.append('<span class="sidenote">unzip and copy to root dir</span>');

		parent.append('<br />');

		parent.append('<span class="name">public: </span>');
		parent.append('<span class="value"><a href="#public">static files</a></span>');
		parent.append('<span class="sidenote">jquery, jquery-ui, d3, underscore, require</span>');

		parent.append('<br />');

		parent.append('<span class="name">views: </span>');
		parent.append('<span class="value"><a href="#views">jade templates</a></span>');
		parent.append('<span class="sidenote">common js and css imports</span>');

		parent.append('<br />');

		parent.append('<span class="name">server definition: </span>');
		parent.append('<span class="value"><a href="#">web.js</a></span>');
		parent.append('<span class="sidenote">copy to root dir then run using `node web.js` or node-supervisor</span>');

		parent.append('<br />');

		parent.append('<span class="name">next... </span>');
		parent.append('<span class="value"><span class="highlight"><a href="#next">helper routes</a></span></span>');

		self.updateLinks(parent);
	};

	PresView.prototype.page2 = function()
	{
		var self = this;
		var parent = $('<div id="page2"></div>').appendTo("body");

		parent.addClass('tk-museo-sans');
		parent.append('<span class="header">Helper Routes</span>');
		parent.append('<hr />');

		parent.append('<span class="name">SimpleSaveRoute: </span>');
		parent.append('<span class="value">fast and easy db access</span>');
		parent.append('<span class="sidenote">usage: GET /values/teams & POST /values/teams</span>');

		parent.append('<br />');

		parent.append('<span class="name">SimpleViewRoute: </span>');
		parent.append('<span class="value">low maintenance adding of new views</span>');
		parent.append('<span class="sidenote">usage: GET /v/test</span>');

		parent.append('<br />');

		parent.append('<span class="name">next... </span>');
		parent.append('<span class="value"><span class="highlight"><a href="#next">views</a></span></span>');

		self.updateLinks(parent);
	}

	PresView.prototype.page3 = function()
	{
		var self = this;
		var parent = $('<div id="page3"></div>').appendTo("body");

		parent.addClass('tk-museo-sans');
		parent.append('<span class="header">Views</span>');
		parent.append('<hr />');

		parent.append('<span class="name">default files: </span>');
		parent.append('<span class="value">index.js & style.css</span>');
		parent.append('<span class="sidenote">place both in dir: /public/views/test</span>');

		parent.append('<br />');

		parent.append('<span class="name">javascript classes: </span>');
		parent.append('<span class="value">capitalize view name + `View`</span>');

		parent.append('<br />');
		parent.append('<br />');

		parent.append('<span class="name">view #1</span>');
		parent.append('<span class="value"><a href="#">test</a></span>');
		parent.append('<span class="sidenote">unzip to /public/views</span>');

		parent.append('<br />');

		parent.append('<span class="name">javascript class: </span>');
		parent.append('<span class="value">TestView</span>');

		parent.append('<br />');
		parent.append('<br />');

		parent.append('<span class="name">view #2</span>');
		parent.append('<span class="value"><a href="#">anyGraph</a></span>');
		parent.append('<span class="sidenote">unzip to /public/views</span>');

		parent.append('<br />');

		parent.append('<span class="name">javascript class: </span>');
		parent.append('<span class="value">AnyGraphView</span>');

		parent.append('<br />');
		parent.append('<br />');

		parent.append('<br />');

		parent.append('<span class="name">next... </span>');
		parent.append('<span class="value"><span class="highlight"><a href="#next">visualizations</a></span></span>');

		self.updateLinks(parent);
	}

	PresView.prototype.page4 = function()
	{
		var self = this;
		var parent = $('<div id="page4"></div>').appendTo("body");

		parent.addClass('tk-museo-sans');
		parent.append('<span class="header">Visualizations</span>');
		parent.append('<hr />');

		parent.append('<span class="name">library: </span>');
		parent.append('<span class="value">d3</span>');
		parent.append('<span class="sidenote"><a href="http://d3js.org/">d3js.org</a></span>');
		parent.append('<span class="sidenote"><a href="https://github.com/mbostock/d3/wiki/Gallery">gallery</a></span>');

		parent.append('<br />');

		parent.append('<span class="name">graph #1: </span>');
		parent.append('<span class="value">Sunburst</span>');
		parent.append('<span class="sidenote"><a href="http://mbostock.github.com/d3/ex/sunburst.html">example</a></span>');
		parent.append('<span class="sidenote"><a href="#Sunburst.js">component</a></span>');
		parent.append('<span class="sidenote">save to public/js/graphs</span>');

		parent.append('<br />');

		parent.append('<span class="name">graph #2: </span>');
		parent.append('<span class="value">Bubble</span>');
		parent.append('<span class="sidenote"><a href="http://mbostock.github.com/d3/ex/bubble.html">example</a></span>');
		parent.append('<span class="sidenote"><a href="#Bubble.js">component</a></span>');
		parent.append('<span class="sidenote">save to public/js/graphs</span>');

		parent.append('<br />');

		parent.append('<span class="name">graph #3: </span>');
		parent.append('<span class="value">Treemap</span>');
		parent.append('<span class="sidenote"><a href="http://mbostock.github.com/d3/ex/treemap.html">example</a></span>');
		parent.append('<span class="sidenote"><a href="#Treemap.js">component</a></span>');
		parent.append('<span class="sidenote">save to public/js/graphs</span>');

		parent.append('<br />');

		parent.append('<span class="name">data format: </span>');
		parent.append('<span class="value">flare.json</span>');
		parent.append('<span class="sidenote"><a href="#flare.json">file</a></span>');
		parent.append('<span class="sidenote">save to public/data</span>');

		self.updateLinks(parent);
	}

});