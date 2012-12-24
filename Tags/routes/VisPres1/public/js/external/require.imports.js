


var RequireImports = function()
{
	this.imports = [];
};

RequireImports.new = function()
{
	return new RequireImports();
}

RequireImports.prototype.add = function(dir,files)
{
	this.imports = this.imports.concat(_.map(files,function(filename){ return dir + "/" + filename;}));

	return this;
}

RequireImports.prototype.toArray = function()
{
	return this.imports;
}
