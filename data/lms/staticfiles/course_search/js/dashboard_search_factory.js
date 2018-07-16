!function(e){"use strict";RequireJS.define("course_search/js/search_router",["backbone"],function(e){return e.Router.extend({routes:{"search/:query":"search"},search:function(e){this.trigger("search",e)}})})}(define||RequireJS.define),function(e){"use strict";RequireJS.define("course_search/js/views/search_form",["jquery","backbone"],function(e,t){return t.View.extend({el:"",events:{"submit .search-form":"submitForm","click .cancel-button":"clearSearch"},initialize:function(e){this.$searchField=this.$el.find(".search-field"),this.$searchButton=this.$el.find(".search-button"),this.$cancelButton=this.$el.find(".cancel-button"),this.supportsActive=void 0===e.supportsActive?!0:e.supportsActive},submitForm:function(e){e.preventDefault(),this.doSearch()},doSearch:function(e){var t;e?(t=e.trim(),this.$searchField.val(t)):t=this.$searchField.val().trim(),t?(this.setActiveStyle(),this.trigger("search",t)):this.clearSearch()},resetSearchForm:function(){this.$searchField.val(""),this.setInitialStyle()},clearSearch:function(){this.resetSearchForm(),this.trigger("clear")},setActiveStyle:function(){this.supportsActive&&(this.$searchField.addClass("is-active"),this.$searchButton.hide(),this.$cancelButton.show())},setInitialStyle:function(){this.supportsActive&&(this.$searchField.removeClass("is-active"),this.$searchButton.show(),this.$cancelButton.hide())}})})}(define||RequireJS.define),function(e){"use strict";RequireJS.define("course_search/js/models/search_result",["backbone"],function(e){return e.Model.extend({defaults:{location:[],content_type:"",excerpt:"",url:""}})})}(define||RequireJS.define),function(e){"use strict";RequireJS.define("course_search/js/collections/search_collection",["underscore","backbone","course_search/js/models/search_result"],function(e,t,s){return t.Collection.extend({model:s,pageSize:20,totalCount:0,latestModelsCount:0,accessDeniedCount:0,searchTerm:"",page:0,url:"/search/",fetchXhr:null,initialize:function(e,s){t.Collection.prototype.initialize.apply(this,arguments),s&&s.courseId&&(this.url+=s.courseId)},performSearch:function(e){this.fetchXhr&&this.fetchXhr.abort(),this.searchTerm=e||"",this.resetState(),this.fetchXhr=this.fetch({data:{search_string:e,page_size:this.pageSize,page_index:0},type:"POST",success:function(e){e.trigger("search")},error:function(e){e.trigger("error")}})},loadNextPage:function(){this.fetchXhr&&this.fetchXhr.abort(),this.fetchXhr=this.fetch({data:{search_string:this.searchTerm,page_size:this.pageSize,page_index:this.page+1},type:"POST",success:function(e){e.page+=1,e.trigger("next")},error:function(e){e.trigger("error")},add:!0,reset:!1,remove:!1})},cancelSearch:function(){this.fetchXhr&&this.fetchXhr.abort(),this.resetState()},parse:function(t){return this.latestModelsCount=t.results.length,this.totalCount=t.total,this.accessDeniedCount+=t.access_denied_count,this.totalCount-=this.accessDeniedCount,e.map(t.results,function(e){return e.data})},resetState:function(){this.page=0,this.totalCount=0,this.latestModelsCount=0,this.accessDeniedCount=0,this.reset()},hasNextPage:function(){return this.totalCount-(this.page+1)*this.pageSize>0},latestModels:function(){return this.last(this.latestModelsCount)}})})}(define||RequireJS.define),function(e){"use strict";RequireJS.define("course_search/js/views/search_item_view",["jquery","underscore","backbone","gettext","logger","edx-ui-toolkit/js/utils/html-utils"],function(e,t,s,r,n,i){return s.View.extend({tagName:"li",className:"search-results-item",attributes:{role:"region","aria-label":"search result"},events:{click:"logSearchItem"},initialize:function(e){this.template=e.template},render:function(){var e=t.clone(this.model.attributes);return"Sequence"===this.model.get("content_type")&&(e.excerpt="",e.content_type=""),e.excerptHtml=i.HTML(e.excerpt),delete e.excerpt,i.setHtml(this.$el,i.template(this.template)(e)),this},redirect:function(e){window.location.href=e},logSearchItem:function(e){var t=this,s=this.model.id,r=this.model.get("url"),i=this.model.collection,a=i.page,c=i.pageSize,o=i.searchTerm,l=i.indexOf(this.model);e.preventDefault(),n.log("edx.course.search.result_selected",{search_term:o,result_position:a*c+l,result_link:s}).always(function(){t.redirect(r)})}})})}(define||RequireJS.define),RequireJS.define("text",{load:function(e){throw new Error("Dynamic load not allowed: "+e)}}),RequireJS.define("text!course_search/templates/search_loading.underscore",[],function(){return'<span class="icon fa fa-spinner fa-spin" aria-hidden="true"></span> <%- gettext("Loading") %>\n\n'}),RequireJS.define("text!course_search/templates/search_error.underscore",[],function(){return'<%- gettext("There was an error, try searching again.") %>\n'}),function(e){"use strict";RequireJS.define("course_search/js/views/search_results_view",["jquery","underscore","backbone","edx-ui-toolkit/js/utils/html-utils","edx-ui-toolkit/js/utils/string-utils","course_search/js/views/search_item_view","text!course_search/templates/search_loading.underscore","text!course_search/templates/search_error.underscore"],function(e,t,s,r,n,i,a,c){return s.View.extend({el:"",contentElement:"",resultsTemplate:null,itemTemplate:null,loadingTemplate:a,errorTemplate:c,events:{},spinner:".search-load-next .icon",initialize:function(){this.$contentElement=e(this.contentElement?this.contentElement:[])},render:function(){return r.setHtml(this.$el,r.template(this.resultsTemplate)({totalCount:this.collection.totalCount,totalCountMsg:this.totalCountMsg(),pageSize:this.collection.pageSize,hasMoreResults:this.collection.hasNextPage()})),this.renderItems(),this.$el.find(this.spinner).hide(),this.showResults(),this},renderNext:function(){this.$el.find(".search-count").text(this.totalCountMsg()),this.renderItems(),this.collection.hasNextPage()||this.$el.find(".search-load-next").remove(),this.$el.find(this.spinner).hide()},renderItems:function(){var e=this.collection.latestModels(),t=e.map(function(e){var t=new i({model:e,template:this.itemTemplate});return t.render().el},this);this.$el.find("ol").append(t)},totalCountMsg:function(){var e=ngettext("{total_results} result","{total_results} results",this.collection.totalCount);return n.interpolate(e,{total_results:this.collection.totalCount})},clear:function(){this.$el.hide().empty(),this.$contentElement.show()},showResults:function(){this.$el.show(),this.$contentElement.hide()},showLoadingMessage:function(){e("#loading-message").html(""),e("#error-message").html(""),r.setHtml(this.$el,r.template(this.loadingTemplate)()),this.showResults()},showErrorMessage:function(){r.setHtml(this.$el,r.template(this.errorTemplate)()),this.showResults()},loadNext:function(e){return e&&e.preventDefault(),this.$el.find(this.spinner).show(),this.trigger("next"),!1}})})}(define||RequireJS.define),RequireJS.define("text!course_search/templates/dashboard_search_results.underscore",[],function(){return'<header class="search-info">\n    <a class="search-back-to-courses" href="#"><%- gettext("Back to Dashboard") %></a>\n    <h2><%- gettext("Search Results") %></h2>\n    <div class="search-count"><%- totalCountMsg %></div>\n</header>\n\n<% if (totalCount > 0 ) { %>\n\n    <ol class=\'search-result-list\'></ol>\n\n    <% if (hasMoreResults) { %>\n        <a class="search-load-next" href="#">\n            <%-\n            StringUtils.interpolate(\n                ngettext("Load next {num_items} result", "Load next {num_items} results", pageSize),\n                {\n                    num_items: pageSize\n                }\n            )\n            %>\n            <span class="icon fa fa-spinner fa-spin" aria-hidden="true"></span>\n        </a>\n    <% } %>\n\n<% } else { %>\n\n    <p><%- gettext("Sorry, no results were found.") %></p>\n\n<% } %>\n'}),RequireJS.define("text!course_search/templates/dashboard_search_item.underscore",[],function(){return'<div class="result-excerpt"><%= HtmlUtils.ensureHtml(excerptHtml) %></div>\n<a class="result-link" href="<%- url %>"><%- gettext("View") %> <span class="icon fa fa-arrow-right" aria-hidden="true"></span></a>\n<span class="result-course-name"><%- course_name %>:</span>\n<span class="result-location"><%- location.join(\' ▸ \') %></span>\n<span class="result-type"><%- content_type %></span>\n'}),function(e){"use strict";RequireJS.define("course_search/js/views/dashboard_search_results_view",["course_search/js/views/search_results_view","text!course_search/templates/dashboard_search_results.underscore","text!course_search/templates/dashboard_search_item.underscore"],function(e,t,s){return e.extend({el:".search-results",contentElement:"#my-courses, #profile-sidebar",resultsTemplate:t,itemTemplate:s,events:{"click .search-load-next":"loadNext","click .search-back-to-courses":"backToCourses"},backToCourses:function(){return this.clear(),this.trigger("reset"),!1}})})}(define||RequireJS.define),function(e){"use strict";RequireJS.define("course_search/js/dashboard_search_factory",["underscore","backbone","course_search/js/search_router","course_search/js/views/search_form","course_search/js/collections/search_collection","course_search/js/views/dashboard_search_results_view"],function(e,t,s,r,n,i){return function(){var a=new s,c=new r({el:$("#dashboard-search-bar")}),o=new n([]),l=new i({collection:o}),h=e.clone(t.Events);h.listenTo(a,"search",function(e){c.doSearch(e)}),h.listenTo(c,"search",function(e){l.showLoadingMessage(),o.performSearch(e),a.navigate("search/"+e,{replace:!0})}),h.listenTo(c,"clear",function(){o.cancelSearch(),l.clear(),a.navigate("")}),h.listenTo(l,"next",function(){o.loadNextPage()}),h.listenTo(l,"reset",function(){c.resetSearchForm()}),h.listenTo(o,"search",function(){l.render()}),h.listenTo(o,"next",function(){l.renderNext()}),h.listenTo(o,"error",function(){l.showErrorMessage()})}})}(define||RequireJS.define);