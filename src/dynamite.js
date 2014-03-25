(function(context) {
	var Class = function() {

		var option = arguments[1] ? arguments[0] : null;
		var _class = option ? arguments[1] : arguments[0];

		var EXTEND = 'extend';
		var ABSTRACT = 'abstract';
		var FINAL = 'final';
		var IMPLEMENT = 'implement';
		var MODIFIER = 'modifier';
		var test = /(extend|implement|modifier)/;

		// the primitive function of every Class
		var primitive = function() {
			this.constructor.apply(this, arguments);
		}

		/*
		 * function primitive() { this.constructor.apply(this, arguments); }
		 */
		// function support for inheritance
		function subclass() {
		}

		// extract option
		function extractOption(o) {
			if (!o || !(o instanceof Object))
				return null;
			var keys = [];
			for ( var k in o) {
				keys.push(k);
			}
			return keys;
		}
		;

		// apply modifier
		function modifier(m) {
			switch (m) {
			case ABSTRACT:
				this.abstractClass = true;
				_class.abstractContructor = _class.constructor;
				_class.constructor = function() {
					throw new Error('Abstract Class cannot be instantiated');
				};
				break;
			case FINAL:
				this.finalClass = true;
				break;
			}
		}
		;

		// inheritance
		function extend(parent) {
			if (parent.finalClass)
				throw new Error('Final Class cannot be extended !');
			if (parent.abstractClass) {
				for ( var m in parent) {
					if (m.search('implement_') != -1) {
						var method = m.replace('implement_', '');
						if (!_class.hasOwnProperty(method))
							throw new Error('You must implement the method : '
									+ method + ' => ' + parent[m]);
						;
					}
				}
				if (!_class.hasOwnProperty('constructor'))
					throw new Error(
							'You must implement the super constructor !');
			}
			subclass.prototype = parent.prototype;
			this.prototype = new subclass;
			this.superClass = parent;
			this.prototype._super = _super;
			this.prototype._superCall = _superCall;

			var keys = [];
			for ( var p in this.prototype) {
				keys.push(p);
			}
		}

		// check for implementation interface
		function implement(i) {
			if (i instanceof Object && typeof i == 'function') {
				if (this.abstractClass) {
					for ( var m in i._structure) {
						this['implement_' + m] = i._structure[m];
					}
					return;
				}
				try {
					var classInterface = new i(_class);
				} catch (e) {
					if (e.message != 'You must implement all and only method of interface')
						throw e;
				}

			} else {
				throw new Error('Class implementation error !');
			}
			/*
			 * for ( var p in i.prototype) { if (typeof i.prototype[p] ==
			 * 'function') if (!_class.hasOwnProperty(p)) throw new Error('You
			 * must implement the method : ' + p); }
			 */
		}

		function checkSuperParent(parent) {
			var reg = /this._super\([a-zA-Z0-9,*'*]+\) *;/;
			var isCommented = /(\/\/|\/\*|\/\*\*|\*) *this._super\([a-zA-Z0-9,*'*]+\) *;/;
			if (isCommented.test(parent.constructor.toString()))
				return false;
			var c = reg.exec(parent.constructor.toString());
			if (c)
				return c;
			return false;
		}

		function checkSuperMethod(parent, method) {
			var reg = /this._superCall\([a-zA-Z0-9,*'*]+\) *;/;
			var isCommented = /(\/\/|\/\*|\/\*\*|\*) *this._superCall\([a-zA-Z0-9,*'*]+\) *;/;
			if (isCommented.test(parent[method]))
				return false;
			var c = reg.exec(parent[method]);
			if (c)
				return c;
			return false;
		}

		function _static() {
		}

		// call super constructor
		function _super() {

			var firstClass = primitive.superClass, check = false, _this = this, r, _return;

			while (!check) {
				if (firstClass.superClass) {
					if (r = checkSuperParent(firstClass.prototype)) {
						var fn = r.input.toString().replace(r[0], '');
						var reconstruct = new Function('return ' + fn);
						_return = reconstruct().apply(this, arguments);
					} else {
						check = true;
						break;
					}
					firstClass = firstClass.superClass;
				} else
					check = true;
			}

			var parent = firstClass.prototype;

			this._super.to = function(method) {
				var arguments = Array.prototype.slice.call(arguments, 1);
				return parent[method].apply(_this, arguments);
			};

			if (parent.abstractContructor)
				parent.constructor = parent.abstractContructor;
			return parent.constructor.apply(this, arguments);
		}

		// call super method by name
		function _superCall(method) {
			var args = Array.prototype.slice.call(arguments, 1), check = false, r, _return;
			var ___parent = primitive.superClass;

			while (!check) {
				if (___parent.superClass) {
					if (r = checkSuperMethod(___parent.prototype, method)) {
						var fn = r.input.toString().replace(r[0], '');
						var rec = new Function('return ' + fn);
						_return = rec().apply(this, args);
					} else {
						check = true;
						break;
					}
					___parent = ___parent.superClass;
				} else
					check = true;
			}

			var parent = ___parent.prototype;
			if (_return)
				return _return;
			return parent[method].apply(this, arguments);
		}

		// inflate values into primitive
		function inflate(obj) {
			var stamp = [], value;
			for ( var p in obj) {
				value = obj[p];
				stamp.push(p);
				if (/static_/.exec(p)) {
					p = p.replace('static_', '');
					this[p] = value;
					this._static[p] = value;
					this.prototype._static[p] = value;
				}
				this.prototype[p] = value;
			}
		}
		;

		// the main function of Class
		function engine(k, c) {

			for ( var p in c) {
				if (test.test(p)) {
					k = extractOption(option = c);
					c = {};
					break;
				}
			}

			if (c == null || !(c instanceof Object))
				throw new Error(
						'Bad Class implementation : Class must be an Object');

			for ( var key in k) {
				var v = k[key];
				switch (v) {
				case EXTEND:
					this.extend(option.extend);
					break;
				case MODIFIER:
					this.modifier(option.modifier);
					break;
				case IMPLEMENT:
					this.implement(option.implement);
					break;
				}
			}

			this._static = function() {
			};
			this.prototype._static = this._static;
			this.inflate(c);
			return this;
		}

		primitive.engine = engine;
		primitive.inflate = inflate;
		primitive.extend = extend;
		primitive.modifier = modifier;
		primitive.implement = implement;
		primitive.toString = function() {
			return 'Dynamite framework : Class';
		};

		// start engine !
		return primitive.engine(extractOption(option), _class);
	};
	Class.toString = function() {
		return 'Dynamite framework : Class';
	};

	var Interface = function(obj) {
		var _interface = {};
		var _interfaceLength = 0;
		for ( var p in obj) {
			if (typeof obj[p] !== 'function')
				throw new Error(
						'The properties of Interface can be only functions');
			_interface[p] = obj[p];
			_interfaceLength++;
		}
		var retFunction = function(obj) {
			var objLength = 0;
			if (!obj)
				throw new Error('The interface can not be empty');
			for ( var p in obj)
				objLength++;
			for ( var p_to_over in _interface) {
				if (!obj.hasOwnProperty(p_to_over))
					throw new Error('You must implement the method : '
							+ p_to_over + ' => ' + _interface[p_to_over]);
			}
			if (objLength != _interfaceLength)
				throw new Error(
						'You must implement all and only method of interface');
		};
		retFunction._structure = _interface;
		retFunction.toString = function() {
			return 'Dynamite framework : Interface';
		};
		return retFunction;
	};
	Interface.toString = function() {
		return 'Dynamite framework : Interface';
	};

	var Alias = function(alias) {
		if (alias == undefined) {
			for ( var d in context.Dynamite) {
				context[d] = context.Dynamite[d];
			}
			return;
		}
		if (typeof alias == 'string' && alias != '') {
			if (context[alias] == undefined) {
				context[alias] = context.Dynamite;
			} else {
				throw new Error('This Alias is already in use !');
			}
		} else {
			throw new Error('Alias must be a valid string !');
		}

	};
	Alias.toString = function() {
		return 'Dynamite framework : Alias';
	};

	var Functions = function(obj) {
		if (typeof obj == 'object') {
			var body = '';
			var args = {};
			var argsLength = 0;
			for ( var i in obj) {
				if (i == 'body') {
					body = obj['body'];
				} else {
					args[i] = obj[i];
					argsLength++;
				}
			}
			var func = 'return function anonymous(';

			if (argsLength > 0) {
				for ( var a in args) {
					func += a + ',';
				}

				func = func.substring(0, func.length - 1);
			}

			func += '){';

			for ( var a in args) {
				func += 'if(' + a + ' == undefined)' + a + ' = ' + args[a]
						+ ';';
			}

			if (typeof body == 'function') {
				func += 'return(' + body.toString() + ')(';
				if (argsLength > 0) {
					for ( var a in args) {
						func += a + ',';
					}

					func = func.substring(0, func.length - 1);
				}
				func += ')}';
			} else
				func += body + '}';

			// console.log(func);
			var f = new Function(func);
			return f();
		}
	};
	Functions.toString = function() {
		return 'Dynamite framework : Functions';
	};

	var Repository = function(url, library, rules, callback) {
		var xmlHttp = null;
		if (window.XMLHttpRequest) {
			// code for IE7+, Firefox, Chrome, Opera,Safari
			xmlHttp = new XMLHttpRequest();
		} else {
			// code for IE6, IE5
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		if(typeof library != 'string' || typeof callback != 'function' || (rules != undefined && typeof rules != 'object')){
			return false ;
		}
		var params = 'library='+library ;
		for(var r in rules){
			params += '&'+r+'='+rules[r] ;
		}
		var paramsLength = params.length ;
		var overHttp = !(/(rtps:\/\/|ssh:\/\/|ftp:\/\/|smtp:\/\/|sftp:\/\/|ssl:\/\/|tls:\/\/|file:\/\/)/i.test(url));
		console.log('over http : '+url.substring(0,4)+' - '+overHttp);
		try{
			xmlHttp.open("POST",url,true);
			xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			//http.setRequestHeader("Content-length", paramsLength);
			//http.setRequestHeader("Connection", "close");
			//xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			var http = xmlHttp ;
			xmlHttp.onreadystatechange = function(response){				
				//HTTP and NON-HTTP REQUEST
				if((xmlHttp.readyState == 4 && overHttp && xmlHttp.status == 200) || (xmlHttp.readyState == 4 && !overHttp && xmlHttp.status == 0)) {
					var script = document.createElement('script');
					script.type = 'text/javascript' ;
					script.text = xmlHttp.responseText ;
					document.getElementsByTagName('head')[0].appendChild(script);
					callback({status:xmlHttp.status,error:0});
				}else if(xmlHttp.readyState == 4){
					callback({response:xmlHttp.responseText,status:xmlHttp.status,error:1});					
				}
			};
			xmlHttp.send(params);
			return true ;
		}catch(e){
			return false ;
		}
	};

	context.Dynamite = {};
	context.Dynamite.Class = Class;
	context.Dynamite.Interface = Interface;
	context.Dynamite.Functions = context.Dynamite.ƒ = Functions;
	context.Dynamite.alias = Alias;
	context.Dynamite.repository = Repository ;

})(this.window || this);