/**
 * Callisto
 */

'use strict';

var Design = {

	checkNavWidth : function() {

		// Cache
		var $el = { };

		$el.siteHeader = $('.site_header');
		$el.navigation = $('.navigation');
		$el.headerImg  = $('.header_image');

		if ( $el.headerImg.length === 0 ) {
			$el.headerImg = $('.header_text');
		}

		if ( $el.siteHeader.outerWidth() < $el.navigation.outerWidth() + $el.headerImg.outerWidth() ) {
			$el.siteHeader.addClass('collapse');
		} else {
			$el.siteHeader.removeClass('collapse');
		}

	},

	keybindings : function() {

		// Remove previous bindings
		Cargo.Core.KeyboardShortcut.Remove("Left");
		Cargo.Core.KeyboardShortcut.Remove("Right");

		Cargo.Core.KeyboardShortcut.Add("Left", 37, function() {
			Action.Project.Prev();
			return false;
		});

		Cargo.Core.KeyboardShortcut.Add("Right", 39, function() {
			Action.Project.Next();
			return false;
		});

	},

	projectFooterThumbnails : function(pid) {

		// Cache
		var $el  = { };
		var data = { };

		// inline helper functions
		var _setResponsiveBreakpoints = function() {

			$el.window = $(window);

			data.windowWidth	= $el.window.width();
			data.range			= 4;

			// Set the ranges
			if ( data.windowWidth <= 640 ) {
				data.range = 2;
			} else if ( data.windowWidth >= 640 && data.windowWidth < 840 ) {
				data.range = 3;
			} else {
				data.range = 4;
			}

			// Set the size
			data.footerThumbWidth = 100 / ((data.range * 2) + 1);

			// Construct the styles
			data.footerThumbStyles = '.project_footer_thumbnails .project_thumb { width : ' + (data.footerThumbWidth + "%") + ' }';
			$('#project_footer_thumbnail_size').html(data.footerThumbStyles);

		};

		var _getActiveProject = function() {

			// Create thumbnails
			$el.thumbnails = { };

			// Active project thumbnail
			$el.thumbnails.active = $("#thumbnails").find('.project_thumb[data-id="' + pid + '"]');

			// Active thumbnail position
			data.active_index = $el.thumbnails.active.index();

		};

		var _makeFooterContainers = function() {

			$el.thumbnails = { };

			$el.thumbnails.footer = $('.project_footer_thumbnails');
			$el.thumbnails.index = $('#thumbnails .project_thumb');

			$el.thumbnails.footer.empty();

		};

		var _setThumbnailRanges = function() {

			// Data
			data.project_thumb_count = $('.project_thumb').length;

			// Create ranges
			data.ranges = { };

			data.ranges.prevStart = _setIndexRange(data.active_index - data.range);
			data.ranges.prevEnd   = _setIndexRange(data.active_index);

			data.ranges.nextStart = _setIndexRange(data.active_index + 1);
			data.ranges.nextEnd   = _setIndexRange(data.active_index + (data.range + 1));

		};

		var _setIndexRange = function(index) {

			if ( index < 0 ) {
				index = 0;
			} else if ( index > data.project_thumb_count ) {
				index = data.project_thumb_count;
			}

			return index;

		};

		var _makeFooterThumbnails = function() {

			// Set some data
			data.prevDiff = data.range - Math.abs(data.ranges.prevStart - data.ranges.prevEnd);
			data.nextDiff = data.range - Math.abs(data.ranges.nextStart - data.ranges.nextEnd);

			// Gaps
			if ( data.prevDiff <= data.range && data.project_thumb_count > (data.range * 2 + 1) ) {
			
			$el.thumbnails.index
				.slice( (data.project_thumb_count - data.prevDiff) , data.project_thumb_count)
				.each(function() {
					$(this)
						.clone()
						.prependTo($el.thumbnails.footer);
				});
			}

			// Previous
			$el.thumbnails.index
				.slice(data.ranges.prevStart, data.ranges.prevEnd)
				.each(function() {
					$(this)
						.clone()
						.appendTo($el.thumbnails.footer);
				});
		  
			// Active
			$('#thumbnails')
				.find('.project_thumb[data-id="' + pid + '"]')
				.clone()
				.addClass('footer_active')
				.appendTo($el.thumbnails.footer);

			// Next
			$el.thumbnails.index
				.slice(data.ranges.nextStart, data.ranges.nextEnd)
				.each(function() {
				$(this)
					.clone()
					.appendTo($el.thumbnails.footer);
				});

			// Gaps
			if ( data.nextDiff <= data.range && data.project_thumb_count > (data.range * 2 + 1) ) { 
			
			$el.thumbnails.index
				.slice(0, data.nextDiff)
				.each(function() {
					$(this)
						.clone()
						.appendTo($el.thumbnails.footer);
				});

			}

		};

		var _checkDuplicates = function() {

			// Remove duplicat actives
			$el.thumbnails.footer
				.find('.project_thumb.active:not(".footer_active")')
				.remove();

		};

		var _checkFooterState = function() {

			if ( Cargo.Helper.GetCurrentPageType() === 'project' && ! Cargo.Helper.IsAdminEditProject() ) {
				return true;
			} else {
				return false;
			}

		};

		// Data check
		pid = pid || Cargo.Helper.GetCurrentProjectId();

		// Run only if ready
		if ( !pid ) {
			return false;
		}

		/**
		 * Run if we're on a project
		 */
		if ( _checkFooterState() ) {
			_setResponsiveBreakpoints();
			_getActiveProject();
			_makeFooterContainers();
			_setThumbnailRanges();
			_makeFooterThumbnails();
			_checkDuplicates();
		} else {
			$('.project_footer_thumbnails_container').hide();
		}

		// Hide if it's empty
		if ( $('.project_footer_thumbnails_container .project_thumb').length <= 1 ) {
			$('.project_footer_thumbnails_container').hide();
		}

	},

	resizeIndex : function($window) {

		var $el  = { },
			data = { };

		// inline helper functions
		var _setData = function() {

			data.containerWidth = $('.container').width();

			data.thumbOrigWidth = parseInt(Cargo.Model.DisplayOptions.GetThumbSize().w);
			data.columnCount	= Math.ceil(data.containerWidth / data.thumbOrigWidth);

			if ( data.columnCount < 2 ) {
				data.columnCount = 2;
			}

			data.thumbNewWidth = 100 / data.columnCount;

		};

		var _updateSize = function() {

			data.thumbstyle = '.project_thumb { width : ' + (data.thumbNewWidth + "%") + ' }';
			$('#thumbnail_size').html(data.thumbstyle);

		};

		$window = $window || $(window);

		// Initialize
		_setData();
		_updateSize();

	},

	formatProjectContent : function() {

		// Cache
		var $el				= { },
			data			= { },
			ignoreList		= '.project_title, .project_footer',
			mediaElements	= 'img, video, iframe, object, audio, embed, div';

		// Cache
		$el.projectContent	= $('.project_content');
		$el.projectMedia	= $('.project_media');

		// Split the content into blocks
		Design.formatText($('.project_content'));

		// Move elements into containers
		$el.projectContent
			.children(mediaElements)
			.not(ignoreList)
			.appendTo($el.projectMedia);

		// We're done here
		Cargo.Event.trigger("projectMediaFormatted");

	},

	formatText: function(node, includeWhitespaceNodes) {

		var validTags			= ['img', 'object', 'video', 'audio', 'iframe', 'div'],
			nodeContents		= node.contents(),
			newPageFromCache	= true,
			textPages			= {},
			pageCache			= [],
			pageCount			= 0;

		// inline helper functions
		var _isValidText = function(txt, strict) {

			if (txt !== undefined) {
				txt = txt.replace(/<!--([\s\S]*?)-->/mig, "");
				txt = txt.replace(/(\r\n|\n|\r|\t| )/gm, "");
				txt = txt.replace(/[^A-Za-z0-9\s!?\.,-\/#!$%\^&\*;:{}=\-_`~()[[\]]/g, "");

				if (txt.length > 0) {
					return true;
				}
			} else {
				if (strict) {
					return false;
				} else {
					return true;
				}
			}

			return false;
		
		}

		var _getTag = function(el) {

			if (typeof el !== "undefined") {
				var tag = el.tagName;
			
				if (typeof tag === "undefined") {
					tag = 'text';
				}

				return tag.toLowerCase();
			}

		}

		nodeContents.each(function(key, val) {
			
			if ($.inArray(_getTag(val), validTags) >= 0) {
				// save cache as new page
				if (pageCache.length > 0) {
					textPages[pageCount] = pageCache;
					pageCache = [];
					pageCount++;
				}
			} else {
				if (_isValidText(val.data) && val.nodeType != 8) {
					pageCache.push(val);
				}
			}

		});

		// Still some stuff left in cache
		if (pageCache.length > 0) {

			// Check if it needs a new page
			for (var i = 0; i < pageCache.length; i++) {
				if (pageCache[i].nodeType == 8 || pageCache[i].nodeName == "SCRIPT" || pageCache[i].nodeName == "STYLE") {
					// Contains text, create new page
					newPageFromCache = false;
				}
			}

			if (newPageFromCache) {
				// Create new page
				textPages[pageCount] = pageCache;
				pageCache = [];
				pageCount++;
			} else {
				for (var i = 0; i < pageCache.length; i++) {
					// Dump and hide remaining elements
					$(pageCache[i]).hide().appendTo($('.project_footer'));
				}
			}

		}

		$.each(textPages, function(key, arr) {

			var breaks = 0;

			$.each(arr, function(key, el) {
				if (el.nodeName == "BR") {
				   breaks++;
				}
			});

			if (breaks < arr.length) {
				var first = arr[0],
					parent = $('<p />');
				
				$(first).before(parent);

				$.each(arr, function(key, el) {
					$(el).appendTo(parent);
				});
			} else {
				$.each(arr, function(key, el) {
					$(el).remove();
				});
			}

		});
	},

	setResize : function() {

		var resizeAttrs = {
			'data-elementresizer' : true,
			'data-resize-parent'  : true
		};

		// Reset the resize attributes
		$('div[data-elementresizer], div[data-resize-parent]')
			.removeAttr('data-elementresizer data-resize-parent');

		// Set the new resize attributes
		if ( Cargo.Helper.GetCurrentPageType() === 'project' ) {
			$('.project_media').attr(resizeAttrs);
		} else {
			$('.project_content').attr(resizeAttrs);
		}

	},

	setViewport : function() {

		if ( navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
			$('html').addClass('mobile-iphone');
			$('meta[name=viewport]').attr('content', 'width=400');
		}

	}

};

/**
 * Scroll tracker
 */

Design.scroll = {

	indexPosition : 0,

	defaultScroll : function() {
		// Configured on setup
	},

	project : function() {

		// Set the data if we were on an index page
		if ( ! $('body').is('[data-pagetype]') ) {
			this.indexPosition = $(window).scrollTop();
		}

		// Default scroll method
		Design.scroll.defaultScroll();

	},

	index : function() {
		$(window).scrollTop(this.indexPosition);
	},

	setup : function() {

		var self = this;

		// Set the default scroll event
		this.defaultScroll = Cargo.Helper.ScrollToTop;

		// Reset helper methods
		Cargo.Helper.ScrollToTop = function() {
			return false;
		};

		Cargo.Event.on("project_load_start", function(pid) {
			self.project();
		});

		Cargo.Event.on("show_index_complete", function(pid) {
			self.index();
		});

	}

};

/**
 * Events
 */

$(function() {

	Cargo.Core.ReplaceLoadingAnims.init();
	Design.setViewport();
	Design.keybindings();
	Design.scroll.setup();

	// Thumbnail resize
	$('.thumb_image img').resizeMedia({
		restrictSize : true
	});

	// Position the Cargo link
	$('.cargo_link').prependTo($('.site_footer'));

	// Resize
	var resize_timeout;
	$(window).resize(function() {

	Design.resizeIndex($(this));

		// Resize timeout for footer
		clearTimeout(resize_timeout);
		resize_timeout = setTimeout(function() {
			Design.checkNavWidth();
			Design.projectFooterThumbnails();
		}, 50);

	}).resize();

});

/**
 * Project load complete
 */
Cargo.Event.on("project_load_complete", function(pid) {

	Design.projectFooterThumbnails();
	Design.setResize();

	// Set the project nav to match the bg of body
	$('.project_nav').css('background-color', $('body').css('background-color'));

	// Format projects
	if ( Cargo.Helper.GetCurrentPageType() === 'project' ) {
		Design.formatProjectContent();
	} else {
		Cargo.Event.trigger("projectContentFormatted");
	}

});

Cargo.Event.on("pagination_complete", function(page) {

	$('.thumb_image img').resizeMedia({
		restrictSize : true
	});

});

Cargo.Event.on("project_collection_reset", function() {

	$('.thumb_image img').resizeMedia({
		restrictSize : true
	});

});

Cargo.Event.on("fullscreen_destroy_hotkeys", function() {

	Design.keybindings();

});

/**
 * Image resizing
 */

Cargo.Event.on("element_resizer_init", function( plugin ) { 

	plugin.setOptions({
		cargo_refreshEvents: ['projectContentFormatted', 'projectMediaFormatted', 'show_index_complete', 'pagination_complete', 'inspector_preview', 'project_collection_reset', 'direct_link_loaded'],
		centerElements: false,
		adjustElementsToWindowHeight: false,
	});
	
});
