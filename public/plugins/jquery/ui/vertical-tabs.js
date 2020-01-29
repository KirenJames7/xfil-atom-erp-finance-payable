/* 
 * Copyright (C) 2019 kirenj
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 *  Inspired by: http://jsfiddle.net/tj_vantoll/dbYHL/
 */
/*
 * jQuery UI Vertical Tabs 0.1.1
 * https://github.com/tjvantoll/jquery-ui-vertical-tabs
 *
 * Copyright TJ VanToll
 * Released under the MIT license.
 */
(function( factory ) {
	if ( typeof define === "function" && define.amd ) {
		define([
			"jquery",
			"jquery-ui/widget",
			"jquery-ui/tabs"
		], factory );
	} else {
		factory( jQuery );
	}
}(function( $ ) {

return $.widget( "ui.tabs", $.ui.tabs, {
	options: {
		orientation: "horizontal"
	},
	_create: function() {
		this._super();
		this._handleOrientation();
	},
	_handleOrientation: function() {
		this.element.toggleClass( "ui-tabs-vertical",
			this.options.orientation === "vertical" );
	},
	_setOption: function( key, value ) {
		this._superApply( arguments );
		if ( key === "orientation" ) {
			this._handleOrientation();
		}
	},
	_destroy: function() {
		this._super();
		this.element.removeClass( "ui-tabs-vertical" );
	}
});

}));
