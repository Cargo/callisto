/**
 * resizeMedia
 */

(function($) {

	$.fn.resizeMedia = function(options) {

		var self = {

			options: $.extend({
				restrictSize : false,
			}, options),

			format : function($this) {

				// Dimenion
				var height = $this.height(),
					width  = $this.width();

				// Reset and warp
				$this
					.css({
						'height' : '',
						'width'  : ''
					})
					.attr('height', '')
					.attr('width', '')
					.addClass('resized')
					.wrap('<div class="resizer" />');

				// Set the resize based on aspect ratio
				$this.parent().css({
					"padding-bottom" : ( 100 * height / width ) + "%"
				});

				// Prevent scaling beyond 100%
				if ( self.options.restrictSize ) {
					$this.parent().css({
						maxWidth  : width,
						maxHeight : height
					});
				}

			}

		};

		// Resize elements which have not been formatted
		this.not('.resized').each(function() {
			self.format($(this));
		});

	};

})(jQuery);