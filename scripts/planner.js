// JavaScript Document

(function() {
	var app = angular.module('app',['ngAnimate']);
	
	app.filter('capitalize', function() {
		return function(input) {
		  return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
		}
	});
	
	app.animation('.slide-toggle', ['$animateCss', function($animateCss) {
        var lastId = 0;
        var _cache = {};

        function getId(el) {
            var id = el[0].getAttribute("data-slide-toggle");
            if (!id) {
                id = ++lastId;
                el[0].setAttribute("data-slide-toggle", id);
            }
            return id;
        }
        function getState(id) {
            var state = _cache[id];
            if (!state) {
                state = {};
                _cache[id] = state;
            }
            return state;
        }

        function generateRunner(closing, state, animator, element, doneFn) {
            return function() {
                state.animating = true;
                state.animator = animator;
                state.doneFn = doneFn;
                animator.start().finally(function() {
                    if (closing && state.doneFn === doneFn) {
                        element[0].style.height = '';
                    }
                    state.animating = false;
                    state.animator = undefined;
                    state.doneFn();
                });
            }
        }

        return {
            addClass: function(element, className, doneFn) {
                if (className == 'ng-hide') {
                    var state = getState(getId(element));
                    var height = (state.animating && state.height) ? 
                        state.height : element[0].offsetHeight;

                    var animator = $animateCss(element, {
                        from: {height: height + 'px', opacity: 1},
                        to: {height: '0px', opacity: 0}
                    });
                    if (animator) {
                        if (state.animating) {
                            state.doneFn = 
                              generateRunner(true, 
                                             state, 
                                             animator, 
                                             element, 
                                             doneFn);
                            return state.animator.end();
                        }
                        else {
                            state.height = height;
                            return generateRunner(true, 
                                                  state, 
                                                  animator, 
                                                  element, 
                                                  doneFn)();
                        }
                    }
                }
                doneFn();
            },
            removeClass: function(element, className, doneFn) {
                if (className == 'ng-hide') {
                    var state = getState(getId(element));
                    var height = (state.animating && state.height) ?  
                        state.height : element[0].offsetHeight;

                    var animator = $animateCss(element, {
                        from: {height: '0px', opacity: 0},
                        to: {height: height + 'px', opacity: 1}
                    });

                    if (animator) {
                        if (state.animating) {
                            state.doneFn = generateRunner(false, 
                                                          state, 
                                                          animator, 
                                                          element, 
                                                          doneFn);
                            return state.animator.end();
                        }
                        else {
                            state.height = height;
                            return generateRunner(false, 
                                                  state, 
                                                  animator, 
                                                  element, 
                                                  doneFn)();
                        }
                    }
                }
                doneFn();
            }
        };
    }]);
	
	app.controller('TabController', function(){
		var self = this;
		self.tab = 1;
			
		self.selectTab = function(setTab) {
			self.tab = setTab;
		};
		
		self.isSelected = function(checkTab){
			return self.tab === checkTab;
		};
		
	});
	
	app.controller('CalcController', ['$interpolate', function($interpolate){
		var self = this;
		
		self.calcInit = function() {
			self.slideToggledress = true;
			self.rotateClassdress = ['down'];
		};
		
		self.categoryLabels = ["dress","venue","photography"];
		
		self.dressLabels = [
			dress = {
				name: "Dress",
				value: 0
			},
			shoes = {
				name: "Shoes",
				value: 0
			},
			veil = {
				name: "Veil",
				value: 0
			},
			petticoat = {
				name: "Petticoat",
				value: 0
			},
			accessories = {
				name: "Accessories",
				value: 0
			}
		];
		
		self.venueLabels = [
			venue = {
				name: "Venue",
				value: 0
			},
			food = {
				name: "Food",
				value: 0
			},
			alcohol = {
				name: "Alcohol",
				value: 0
			},
			decorations = {
				name: "Decorations",
				value: 0
			},
			helpstaff = {
				name: "Help Staff",
				value: 0
			},
			entertainment = {
				name: "Entertainment/DJ",
				value: 0
			}
		];
		
		self.photographyLabels = [
			photographer = {
				name: "Photographer",
				value: 0
			},
			videographer = {
				name: "Videographer",
				value: 0
			}
		];
		
		self.rotateIcon = function(elem){
			self['rotateClass' + elem] = ['up'];
			if(self['slideToggle' + elem] == true){
				self['rotateClass' + elem].push('up');
				self['rotateClass' + elem].pop('down');
				return self['slideToggle' + elem] = false;
			} else {
				self['rotateClass' + elem].pop('up');
				self['rotateClass' + elem].push('down');
				return self['slideToggle' + elem] = true;
			};
		};
		
		self.getNames = function(id) {
			if(id === "dress") {
			  return self.dressLabels;
			};
			if(id === "venue") {
			  return self.venueLabels;
			};
			if(id === "photography") {
			  return self.photographyLabels;
			};
		};
		
		self.sum = function(array){
			var total = 0;
			angular.forEach(array, function(ele){
				total+= parseFloat(ele.value);
		  	});
		  	return Math.round(total * 100)/100;
		};
		
		self.grandTotal = function(array1,array2,array3){
			var total1 = self.sum(array1);
			var total2 = self.sum(array2)
			var total3 = self.sum(array3);
			var total = total1 + total2 + total3;
		  	return total;
		};
	}]);
	
})();