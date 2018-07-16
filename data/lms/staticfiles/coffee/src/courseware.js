// Generated by CoffeeScript 1.6.1
(function() {

  this.Courseware = (function() {

    Courseware.prefix = '';

    function Courseware() {
      Logger.bind();
      this.render();
    }

    Courseware.start = function() {
      return new Courseware;
    };

    Courseware.prototype.render = function() {
      XBlock.initializeBlocks($('.course-content'));
      return $('.course-content .histogram').each(function() {
        var histg, id;
        id = $(this).attr('id').replace(/histogram_/, '');
        try {
          histg = new Histogram(id, $(this).data('histogram'));
        } catch (error) {
          histg = error;
          if (typeof console !== "undefined" && console !== null) {
            console.log(error);
          }
        }
        return histg;
      });
    };

    return Courseware;

  })();

}).call(this);
