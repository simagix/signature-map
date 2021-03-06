
var app = angular.module('signature', ['nvd3']);

angular.module('signature').controller('SignatureController', function($scope, $http) {
	angular.element(document).ready(function () {
        console.log('Angular is ready!');
    	var uri = "/images";
    	$http.get(uri).success(function(data) {
            var images = data;
            var max = data.length - 1;
            for(var row = 0; row < 8; row++) {
                for(var col = 0; col < 8; col++) {
                    var idx = randomInt(0, max--);
                    var tag = 'img-' + row + '-' + col;
                    var img = document.getElementById(tag);
                    var src = images[idx];
                    img.src = src;
                    images.slice(idx, 1);
                }
            }
            fill(images.length-1);
    	});
            
        setInterval(function () {
            $scope.getAggregatedPieData();
        }, 5e3);
    });
    
    $scope.pie = {'data': []};
    $scope.pie.options = {
        chart: {
            type: 'pieChart',
            height: 500,
            x: function(d) { return d.key; },
            y: function(d) { return d.count; },
            showLegend: false,
            showLabels: true,
            labelType: 'percent',
            valueFormat: d3.format(',.0d')
        }
    };
    
    $scope.getAggregatedPieData = function() {
    	var uri = "/colors";
    	$http.get(uri).success(function(data) {
            $scope.pie.data = data;
        });
    }
});
 
function fill(num) {
    var row = Math.floor(num / 8);
    var col = num % 8;
    var tag = 'img-' + row + '-' + col;
    var src = '/images/map-' + row + '-' + col + '.jpeg';
    if(! signatures[tag]) {
        document.getElementById(tag).src = src;
    }
    var onum = 63-num;
    row = Math.floor(onum / 8);
    col = onum % 8;
    tag = 'img-' + row + '-' + col;
    src = '/images/map-' + row + '-' + col + '.jpeg';
    if(! signatures[tag]) {
         document.getElementById(tag).src = src;
    }
    num--;
    if(num >= 32) {
        setTimeout(function() {
            fill(num)
        }, 50);
    }
}
                 
function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}