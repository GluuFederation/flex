//This script conglomerates those found in zk-bootstrap-1.0.0.jar!/web/js/bootstrap
/* button.js

	Purpose:

	Description:

	History:
		Wed, Aug 28, 2013 12:51:51 PM, Created by jumperchen

Copyright (C) 2013 Potix Corporation. All Rights Reserved.
*/
zk.afterLoad('zul.wgt', function () {
	var _button = {},
		_buttonMolds = {};

zk.override(zul.wgt.Button.molds, _buttonMolds, {
	'bs': zul.wgt.Button.molds['default']
});

zk.override(zul.wgt.Button.prototype, _button, {
	_inBSMold: function () {
		return this._mold == 'bs';
	},
	getSclass: function () {
		if (this._inBSMold()) {
			return this._sclass ? this._sclass : 'btn-default';
		} else
			return _button.getSclass.apply(this, arguments);
	},
	getZclass: function () {
		if (this._inBSMold())
			return this._zclass != null ? this._zclass : 'btn';
		return _button.getZclass.apply(this, arguments);
	}
});

});
/* menupopup.js

	Purpose:

	Description:

	History:
		Wed, Aug 28, 2013 12:51:51 PM, Created by jumperchen

Copyright (C) 2013 Potix Corporation. All Rights Reserved.
*/
zk.afterLoad('zul.menu', function () {
	var _menupopup = {}
		_menupopupMolds = {};

zk.override(zul.menu.Menupopup.molds, _menupopupMolds, {
	'bs': zul.menu.Menupopup.molds['default']
});

zk.override(zul.menu.Menupopup.prototype, _menupopup, {
	_inBSMold: function () {
		return this._mold == 'bs';
	},
	getZclass: function () {
		if (this._inBSMold()) {
			return this._zclass ? this._zclass : '';
		} else
			return _menupopup.getZclass.apply(this, arguments);
	},
	$s: function (subclass) {
		if (this._inBSMold()) {
			switch (subclass) {
			case 'separator':
				return '';
			case 'content':
				return 'dropdown-menu';
			}
			return '';
		} else
			return _menupopup.$s.apply(this, arguments);
	},
	open: function () {
		if (this._inBSMold()) {
			this.forcerender();
			jq(this.$n('cave')).css({position: 'relative', display: 'block'});
			_menupopup.open.apply(this, arguments);
		} else
			return _menupopup.open.apply(this, arguments);
	}
});

var _menuseparator = {};

zk.override(zul.menu.Menuseparator.prototype, _menuseparator, {
	_inBSMold: function () {
		return this.parent && this.parent._inBSMold && this.parent._inBSMold();
	},
	getZclass: function () {
		if (this._inBSMold())
			return this._zclass != null ? this._zclass : 'divider';
		return _menuseparator.getZclass.apply(this, arguments);
	}
});

var _menuitem= {};

zk.override(zul.menu.Menuitem.prototype, _menuitem, {
	_inBSMold: function () {
		return this.parent && this.parent._inBSMold && this.parent._inBSMold();
	},
	getZclass: function () {
		if (this._inBSMold())
			return this._zclass != null ? this._zclass : '';
		return _menuitem.getZclass.apply(this, arguments);
	}
});

});
/* navbar-bs.js

	Purpose:

	Description:

	History:
		Wed, Aug 28, 2013 12:51:51 PM, Created by jumperchen

Copyright (C) 2013 Potix Corporation. All Rights Reserved.
*/
zk.afterLoad('zkmax.nav', function () {
	var _navbar = {},
		_navbarmolds = {};


zk.override(zkmax.nav.Navbar.molds, _navbarmolds, {
	'bs': function (out) {
		var uuid = this.uuid;
		out.push('<nav ', this.domAttrs_() , '><div class="', this.$s('collapse'),
				'"><ul id="', uuid ,'-cave" >');
		for (var w = this.firstChild; w; w = w.nextSibling) {
			this.encloseChildHTML_({out: out, child: w, orient: this.getOrient()});
		}
		out.push('</ul></div></nav>');
	},
	'bs-pills': _zk = function (out) {
		out.push('<ul ', this.domAttrs_() , '>');
		for (var w = this.firstChild; w; w = w.nextSibling) {
			this.encloseChildHTML_({out: out, child: w, orient: this.getOrient()});
		}
		out.push('</ul>');
	},
	'bs-tabs': _zk
});

zk.override(zkmax.nav.Navbar.prototype, _navbar, {
	_inBSMold: function (subclass) {
		return this.getMold().startsWith('bs');
	},
	domClass_: function (no) {
		var sc = _navbar.domClass_.apply(this, arguments);
		if (this._inBSMold()) {
			if (!no || !no.sclass)
				sc += ' ' +  (this.getMold() == 'bs' ? (this._sclass != null ? '' : 'navbar-default') : 'nav-' + (this.getMold().substring(3)));
		}
		return sc;
	},
	getZclass: function () {
		if (this._inBSMold())
			return this._zclass != null ? this._zclass : this.getMold() == 'bs' ? 'navbar' : 'nav';
		return _navbar.getZclass.apply(this, arguments);
	},
	$s: function (subclass) {
		if (this._inBSMold()) {
			switch (subclass) {
			case 'vertical':
				if (this.getMold() == 'bs-pills') {
					return this.getZclass() + '-stacked';
				}
			}
		}
		return _navbar.$s.apply(this, arguments);
	},
	bind_: function (subclass) {
		_navbar.bind_.apply(this, arguments);
		if (this.getMold() == 'bs')
			jq(this.$n('cave')).addClass('nav navbar-nav');
	}
});

var _navitem = {};

zk.override(zkmax.nav.Navitem.prototype, _navitem, {
	_inBSMold: function () {
		var nb = this.getNavbar();
		return nb && nb._inBSMold();
	},
	domClass_: function (no) {
		var sc = _navitem.domClass_.apply(this, arguments);
		if (this._inBSMold()) {
			if (!no || !no.sclass)
				sc += ' ' +  (this.isDisabled() ? 'disabled' : '');
		}
		return sc;
	},
	getZclass: function () {
		if (this._inBSMold()) {
			return this._zclass != null ? this._zclass : '';
		} else return _navitem.getZclass.apply(this, arguments);
	},
	$s: function (subclass) {
		if (this._inBSMold()) {
			switch (subclass) {
			case 'selected':
				return 'active';
			case 'disabled':
				return 'disabled';
			}
		}
		return _navitem.$s.apply(this, arguments);
	},
	doSelect_: function(evt) {
		if (this._inBSMold()) {
			if (this._disabled)
				return;
			if (this.isTopmost())
				this.getNavbar().setSelectedItem(this);
			else {
				var self = this;
				setTimeout(function () {
					if (self.desktop && self.parent)
						self.parent.setOpen(false);
				}, 20);
			}
		}
		this.$supers('doSelect_', arguments);
	}
});


var _nav = {};

zk.override(zkmax.nav.Nav.prototype, _nav, {
	_inBSMold: function () {
		var nb = this.getNavbar();
		return nb && nb._inBSMold();
	},
	getIconSclass: function () {
		if (this._inBSMold())
			return this._iconSclass ? this._iconSclass : 'caret';
		return _nav.getIconSclass.apply(this, arguments);
	},
	getZclass: function () {
		if (this._inBSMold())
			return this._zclass != null ? this._zclass : 'dropdown';
		return _nav.getZclass.apply(this, arguments);
	},
	$s: function (subclass) {
		if (this._inBSMold()) {
			switch (subclass) {
			case 'content':
				subclass = 'dropdown-toggle';
				break;
			case 'open':
				return 'open';
			}
		}
		return _nav.$s.apply(this, arguments);
	},

	domContent_: function () {
		if (this._inBSMold()) {
			var label = '<span class="' + this.$s('text') + '">' +
						(zUtl.encodeXML(this.getLabel())) + '</span>',
			img = this.getImage(),
			iconSclass = this.domIcon_();

			if (img) {
				img = '<img src="' + img + '" class="' + this.$s('image') + '" align="absmiddle" />'
					+ (iconSclass ? ' ' + iconSclass : '');
			} else {
				if (iconSclass) {
					img = iconSclass;
				} else {
					img = '<img src="data:image/png;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" class="' +
						this.$s('image') + '" align="absmiddle" />';
				}
			}
			var info = this._detailed ? '<span id="' + this.uuid + '-info" class="' +
					this.$s('info') + '">' + (zUtl.encodeXML(this._badgeText)) + '</span>' : ' ';
			return label + info + img;
		} else {
			return _nav.domContent_.apply(this, arguments);
		}
	},
	bind_: function (subclass) {
		_nav.bind_.apply(this, arguments);
		if (this._inBSMold()) {
			jq(this.$n('cave')).addClass('dropdown-menu');
			zWatch.listen({onFloatUp: this});
		}
	},
	onFloatUp: function(ctl){
		if (!this.isRealVisible())
			return;
		var wgt = ctl.origin;

		for (var floatFound; wgt; wgt = wgt.parent) {
			if (wgt == this) {
				if (!floatFound)
					this.setTopmost();
				return;
			}
			if (wgt == this.parent && wgt.ignoreDescendantFloatUp_(this))
				return;
			floatFound = floatFound || wgt.isFloating_();
		}
		var self = this;
		setTimeout(function () {
			if (self.desktop && self.isOpen()) {
				self.setOpen(false);
			}
		}, 200);
	},
	unbind_: function () {
		if (this._inBSMold()) {
			zWatch.unlisten({onFloatUp: this});
		}
		_nav.unbind_.apply(this, arguments);
	}
});

});
/* paging-bs.js

	Purpose:

	Description:

	History:
		Fri, Aug 30, 2013 12:51:51 PM, Created by jumperchen

Copyright (C) 2013 Potix Corporation. All Rights Reserved.
*/
zk.afterLoad('zul.mesh', function () {
	var _paging = {},
	_pagingMolds = {};

zk.override(zul.mesh.Paging.molds, _pagingMolds, {
	'bs': function (out) {
		out.push('<div', this.domAttrs_(), '>', this._innerTags(), '</div>');
	}
});


zk.override(zul.mesh.Paging.prototype, _paging, {
	_inBSMold: function () {
		return this._mold == 'bs';
	},
	getZclass: function () {
		if (this._inBSMold()) {
			return this._zclass ? this._zclass : '';
		} else
			return _paging.getZclass.apply(this, arguments);
	},
	bind_: function () {
		_paging.bind_.apply(this, arguments);
		if (this._inBSMold())
			jq(this.$n().firstChild).addClass('pagination ' + this.getSclass());
	},
	appendAnchor: function (out, label, val, seld) {
		if (this._inBSMold()) {
			var cls = '';

			if (seld)
				cls += ' ' + this.$s('selected');

			out.push('<li class="', cls,'"><a href="javascript:;" onclick="zul.mesh.Paging.go(this,', val,
					')">', label, '</a></li>');
		} else {
			return _paging.appendAnchor.apply(this, arguments);
		}
	},
	$s: function (subclass) {
		if (this._inBSMold()) {
			if (subclass == 'selected')
				return 'active';
		}
		return _paging.$s.apply(this, arguments);
	}
});
});
/* panel-bs.js

	Purpose:

	Description:

	History:
		Wed, Aug 28, 2013 12:51:51 PM, Created by jumperchen

Copyright (C) 2013 Potix Corporation. All Rights Reserved.
*/
zk.afterLoad('zul.wnd', function () {
	var _panel = {},
		_panelMolds = {};

zk.override(zul.wnd.Panel.molds, _panelMolds, {
	'bs': zul.wnd.Panel.molds['default']
});

zk.override(zul.wnd.Panel.prototype, _panel, {
	_inBSMold: function () {
		return this._mold == 'bs';
	},
	getSclass: function () {
		if (this._inBSMold()) {
			return this._sclass ? this._sclass : 'panel-default';
		} else
			return _panel.getSclass.apply(this, arguments);
	},
	getZclass: function () {
		if (this._inBSMold())
			return this._zclass != null ? this._zclass : 'panel';
		return _panel.getZclass.apply(this, arguments);
	},
	$s: function (subclass) {
		if (this._inBSMold()) {
			switch (subclass) {
			case 'head':
				subclass = 'heading';
				break;
			case 'header':
				return '';
			}
		}
		return _panel.$s.apply(this, arguments);
	}
});

var _panelchildren = {};

zk.override(zul.wnd.Panelchildren.prototype, _panelchildren, {
	_inBSMold: function () {
		return this.parent && this.parent._inBSMold();
	},
	getZclass: function () {
		if (this._inBSMold())
			return this._zclass != null ? this._zclass : '';
		return _panelchildren.getZclass.apply(this, arguments);
	},
	$s: function (subclass) {
		if (this._inBSMold())
			return '';
		return _panelchildren.$s.apply(this, arguments);
	}
});

});