$.jQTouch({
	icon: 'appicon.png',
	statusBar: 'black-translucent'
});

var isPageDetail = false;

// SLIDER
var userInputEventName = new Array();
	
var isMouseDownOnSlider = false;
var newCenterSliderPosition;
var actYear = 2000;
	

var minSliderX = 25;
var maxSliderX = 950;
var minYear = 1965;
var maxYear = 2100;
var steplength = 5;
var nyearsteps = (maxYear-minYear)/steplength;

var detailId = 0;
	
// DATEN EINLESEN
var das_ausgewaehlte_szenario = "historic";
das_zuletzt_ausgewaehlte_szenario="a1";
var das_ausgewaehlte_Jahr = actYear;   

// B E V Ö L K E R U N G
var years=[],bevoelkerung={}, kalorien={}, animal_share={};

// JavaScript Document
$(document).ready(function(){
	 var SliderStart = $('#sliderButton').offset().left;
	 $('#sliderButton').css('left', 225);	 
	 $('#regionSlider').bind('swipe', function(e, info){
		 
		 if(info.direction == 'right'){
			  if (parseInt($(".block").css('left')) >= -2324 && parseInt($(".block").css('left')) < 0){
				  $(".block").animate({"left": "+=332px"}, "medium");
			  }
		  }
		  
		  if(info.direction == 'left'){
			  if (parseInt($(".block").css('left')) <= 0 && parseInt($(".block").css('left')) > -2324 ){
				  $(".block").animate({"left": "-=332px"}, "medium");
			  }
		  }
  	});
	
	$('#regionSlider a').bind('tap', function(e){
		if(das_ausgewaehlte_Jahr>=1990){
 		isPageDetail = true;
    drawDetailPage($(this).attr('id'));			
		}
	});
			
	
	if(checkBrowserName("ipad")){
		userInputEventName['start'] = "touchstart";
		userInputEventName['end'] = "touchend";
		userInputEventName['move'] = "touchmove";
		userInputEventName['click'] = "touchstart";
	}else{
		userInputEventName['start'] = "mouseover";
		userInputEventName['end'] = "mouseout";
		userInputEventName['move'] = "mousemove";
		userInputEventName['click'] = "click";
	}
			
	$(document).bind(userInputEventName['move'], function(e){
		e.preventDefault();	
	});
	
	$('#year').bind(userInputEventName['start'], function(e){
		isMouseDownOnSlider = true;
	});
	
	$('#year').bind(userInputEventName['end'], function(e){
		isMouseDownOnSlider = false;
	});
	
	$('#year').bind(userInputEventName['move'], function(e){	
	
		if(checkBrowserName("ipad") || checkBrowserName("iphone")){
			
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        newCenterSliderPosition = touch.pageX - SliderStart- $('#sliderButton').width();
        
    }else{    
        newCenterSliderPosition = e.pageX - SliderStart- $('#sliderButton').width();
    }
				
		if(isMouseDownOnSlider && newCenterSliderPosition >= -25 && newCenterSliderPosition < 925){
			$('#sliderButton').css('left', newCenterSliderPosition);	
//      $('#btn_mon').css('content', 'bla')	
			actYear = (Math.round(map_range(newCenterSliderPosition, minSliderX, maxSliderX, minYear, maxYear)/steplength)*steplength)+5;
			if(das_ausgewaehlte_Jahr != actYear){
			  das_ausgewaehlte_Jahr = actYear;
			  if(das_ausgewaehlte_Jahr < 1990 && das_ausgewaehlte_szenario!="historic"){
           das_zuletzt_ausgewaehlte_szenario=das_ausgewaehlte_szenario;  
           das_ausgewaehlte_szenario="historic";
        } else if (das_ausgewaehlte_Jahr > 2005 && das_ausgewaehlte_szenario=="historic"){
           das_ausgewaehlte_szenario=das_zuletzt_ausgewaehlte_szenario;  
           
        }
			  drawSzenarioButtons(das_ausgewaehlte_szenario);
        			  
			  if(isPageDetail)
				  drawDetailPage(detailId);
			  
			  drawPopulation(bevoelkerung, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);
        drawCalories(kalorien, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);
				drawCows(kalorien,animal_share,das_ausgewaehlte_Jahr,das_ausgewaehlte_szenario);	
        drawYear(das_ausgewaehlte_Jahr);     		 
			  
			}
		}
	});
		
    $.getJSON('lib/population.json', function(data) {
        bevoelkerung = transformJSON(data.population.population_record);  
    }).complete(function() { 
		    drawPopulation(bevoelkerung, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);
	  });

    $.getJSON('lib/kcal_pc.json', function(data) {
        kalorien =  transformJSON(data.calories.calories_record);  
     }).complete(function() {    
        drawCalories(kalorien, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);	
		});
	
  	$.getJSON('lib/animal_share.json', function(data) {
        animal_share = transformJSON(data.animal_share.animal_share_record); 
    }).complete(function() {
			  drawCows(kalorien,animal_share,das_ausgewaehlte_Jahr,das_ausgewaehlte_szenario);
    });
	 
	// Szenarienwahl
	
	$('#regionSlider a').bind(userInputEventName['click'], function(){
		
		
	});
	
	$('#btn_back').bind(userInputEventName['click'], function(){
		isPageDetail = false;
    document.getElementById("page2").style.display = "none";
	  document.getElementById("page1").style.display = "block";
	});
	
	$("#btn_szenario_a1").ready(function(e){
		
		drawSzenarioButtons(das_ausgewaehlte_szenario);
    drawPopulation(bevoelkerung, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);
    drawCalories(kalorien, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);	
		drawCows(kalorien,animal_share,das_ausgewaehlte_Jahr,das_ausgewaehlte_szenario);	 
		
	});
	
	$("#btn_szenario_historic").click(function(e){
		if (das_ausgewaehlte_Jahr <= 2005) {
  		das_ausgewaehlte_szenario = "historic";
  		drawSzenarioButtons(das_ausgewaehlte_szenario);
      drawPopulation(bevoelkerung, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);
      drawCalories(kalorien, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);	
  		drawCows(kalorien,animal_share,das_ausgewaehlte_Jahr,das_ausgewaehlte_szenario);
    }	   
	
	});
	
	$("#btn_szenario_a1").click(function(e){
    if (das_ausgewaehlte_Jahr >= 1990) {
  		das_ausgewaehlte_szenario = "a1";
  		drawSzenarioButtons(das_ausgewaehlte_szenario);
      drawPopulation(bevoelkerung, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);
      drawCalories(kalorien, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);	
  		drawCows(kalorien,animal_share,das_ausgewaehlte_Jahr,das_ausgewaehlte_szenario);
     }	 	   	
	});
	
	$("#btn_szenario_a2").click(function(e){
    if (das_ausgewaehlte_Jahr >= 1990) {
  		das_ausgewaehlte_szenario = "a2";
  		drawSzenarioButtons(das_ausgewaehlte_szenario);
      drawPopulation(bevoelkerung, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);
      drawCalories(kalorien, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);	
  		drawCows(kalorien,animal_share,das_ausgewaehlte_Jahr,das_ausgewaehlte_szenario);	 
  	}	
	});
	
	$("#btn_szenario_b1").click(function(e){
    if (das_ausgewaehlte_Jahr >= 1990) {		
  		das_ausgewaehlte_szenario = "b1";
  		drawSzenarioButtons(das_ausgewaehlte_szenario);
      drawPopulation(bevoelkerung, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);
      drawCalories(kalorien, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);	
  		drawCows(kalorien,animal_share,das_ausgewaehlte_Jahr,das_ausgewaehlte_szenario);
    }	 
	});
	
	$("#btn_szenario_b2").click(function(e){
    if (das_ausgewaehlte_Jahr >= 1990) {		
  		das_ausgewaehlte_szenario = "b2";
  		drawSzenarioButtons(das_ausgewaehlte_szenario);
      drawPopulation(bevoelkerung, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);
      drawCalories(kalorien, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario);	
  		drawCows(kalorien,animal_share,das_ausgewaehlte_Jahr,das_ausgewaehlte_szenario);	 	
  	}
	});
	
	// Regionen
	
	var p = $(".block");
	var position = p.position();
	
	// Regionen Swipe

		
	$("#btn_left").click(function(e){
		if (position.left > -150){//if (position.left > 45){
			position.left = position.left -150;
			$(".block").animate({"left": -position.left}, "medium");
		}
	});
	
	$("#btn_right").click(function(e){
		if (position.left < 2650 ){//if (position.left < 2369){
			position.left = position.left + 150;
			$(".block").animate({"left": -position.left}, "medium");
		}
	});
	
	
	// Regionen Buttons (Region = 332px)
	
	
	$("#btn_afr").click(function(e){	
		position.left = -50;
		$(".block").animate({"left": -position.left}, "medium");		
	});
	
	
	$("#btn_cpa").click(function(e){	
		position.left = 85;
		$(".block").animate({"left": -position.left}, "medium");
	});
	
	$("#btn_eur").click(function(e){
		position.left = 375;
    $(".block").animate({"left": -position.left}, "medium");		
	});
	
	
	$("#btn_fsu").click(function(e){	
		position.left = 739;
		$(".block").animate({"left": -position.left}, "medium");		
	});
	
	$("#btn_lam").click(function(e){
		position.left = 1041;
		$(".block").animate({"left": -position.left}, "medium");		
	});
	
	$("#btn_mea").click(function(e){
		position.left = 1393;
		$(".block").animate({"left": -position.left}, "medium");
	});
	
	$("#btn_nam").click(function(e){
		position.left = 1725;
		$(".block").animate({"left": -position.left}, "medium");
	});
	
	$("#btn_pao").click(function(e){
		position.left = 2057;
		$(".block").animate({"left": -position.left}, "medium");
	});
	
	$("#btn_pas").click(function(e){
		
    position.left = 2399;
		$(".block").animate({"left": -position.left}, "medium");
	});
	
	$("#btn_sas").click(function(e){
			position.left = 2450;
			$(".block").animate({"left": -position.left}, "medium");
	});
});

function drawYear(das_ausgewaehlte_Jahr){
         
			  $("#year_number").text(das_ausgewaehlte_Jahr);

}

function drawPopulation(bevoelkerung, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario){

			  $("#bev_afr").text(Math.round(bevoelkerung[das_ausgewaehlte_Jahr]['AFR'][das_ausgewaehlte_szenario]) + ' Mio');
        $("#bev_cpa").text(Math.round(bevoelkerung[das_ausgewaehlte_Jahr]['CPA'][das_ausgewaehlte_szenario]) + ' Mio'); 
			  $("#bev_eur").text(Math.round(bevoelkerung[das_ausgewaehlte_Jahr]['EUR'][das_ausgewaehlte_szenario]) + ' Mio');
			  $("#bev_fsu").text(Math.round(bevoelkerung[das_ausgewaehlte_Jahr]['FSU'][das_ausgewaehlte_szenario]) + ' Mio');
			  $("#bev_lam").text(Math.round(bevoelkerung[das_ausgewaehlte_Jahr]['LAM'][das_ausgewaehlte_szenario]) + ' Mio');
			  $("#bev_mea").text(Math.round(bevoelkerung[das_ausgewaehlte_Jahr]['MEA'][das_ausgewaehlte_szenario]) + ' Mio');
			  $("#bev_nam").text(Math.round(bevoelkerung[das_ausgewaehlte_Jahr]['NAM'][das_ausgewaehlte_szenario]) + ' Mio');
			  $("#bev_pao").text(Math.round(bevoelkerung[das_ausgewaehlte_Jahr]['PAO'][das_ausgewaehlte_szenario]) + ' Mio');
			  $("#bev_pas").text(Math.round(bevoelkerung[das_ausgewaehlte_Jahr]['PAS'][das_ausgewaehlte_szenario]) + ' Mio');
			  $("#bev_sas").text(Math.round(bevoelkerung[das_ausgewaehlte_Jahr]['SAS'][das_ausgewaehlte_szenario]) + ' Mio');
}

        
function drawCalories(kalorien, das_ausgewaehlte_Jahr, das_ausgewaehlte_szenario){						 
			  $("#kal_afr").text(Math.round(kalorien[das_ausgewaehlte_Jahr]['AFR'][das_ausgewaehlte_szenario]*bevoelkerung[das_ausgewaehlte_Jahr]['AFR'][das_ausgewaehlte_szenario] * 4.184 * 365 / 1000000) + ' PJ/yr');
			  $("#kal_cpa").text(Math.round(kalorien[das_ausgewaehlte_Jahr]['CPA'][das_ausgewaehlte_szenario]*bevoelkerung[das_ausgewaehlte_Jahr]['CPA'][das_ausgewaehlte_szenario] * 4.184 * 365 / 1000000) + ' PJ/yr');
			  $("#kal_eur").text(Math.round(kalorien[das_ausgewaehlte_Jahr]['EUR'][das_ausgewaehlte_szenario]*bevoelkerung[das_ausgewaehlte_Jahr]['EUR'][das_ausgewaehlte_szenario] * 4.184 * 365 / 1000000) + ' PJ/yr');
			  $("#kal_fsu").text(Math.round(kalorien[das_ausgewaehlte_Jahr]['FSU'][das_ausgewaehlte_szenario]*bevoelkerung[das_ausgewaehlte_Jahr]['FSU'][das_ausgewaehlte_szenario] * 4.184 * 365 / 1000000) + ' PJ/yr');
			  $("#kal_lam").text(Math.round(kalorien[das_ausgewaehlte_Jahr]['LAM'][das_ausgewaehlte_szenario]*bevoelkerung[das_ausgewaehlte_Jahr]['LAM'][das_ausgewaehlte_szenario] * 4.184 * 365 / 1000000) + ' PJ/yr');
        $("#kal_mea").text(Math.round(kalorien[das_ausgewaehlte_Jahr]['MEA'][das_ausgewaehlte_szenario]*bevoelkerung[das_ausgewaehlte_Jahr]['MEA'][das_ausgewaehlte_szenario] * 4.184 * 365 / 1000000) + ' PJ/yr');			  
			  $("#kal_nam").text(Math.round(kalorien[das_ausgewaehlte_Jahr]['NAM'][das_ausgewaehlte_szenario]*bevoelkerung[das_ausgewaehlte_Jahr]['NAM'][das_ausgewaehlte_szenario] * 4.184 * 365 / 1000000) + ' PJ/yr');
			  $("#kal_pao").text(Math.round(kalorien[das_ausgewaehlte_Jahr]['PAO'][das_ausgewaehlte_szenario]*bevoelkerung[das_ausgewaehlte_Jahr]['PAO'][das_ausgewaehlte_szenario] * 4.184 * 365 / 1000000) + ' PJ/yr');
			  $("#kal_pas").text(Math.round(kalorien[das_ausgewaehlte_Jahr]['PAS'][das_ausgewaehlte_szenario]*bevoelkerung[das_ausgewaehlte_Jahr]['PAS'][das_ausgewaehlte_szenario] * 4.184 * 365 / 1000000) + ' PJ/yr');
			  $("#kal_sas").text(Math.round(kalorien[das_ausgewaehlte_Jahr]['SAS'][das_ausgewaehlte_szenario]*bevoelkerung[das_ausgewaehlte_Jahr]['SAS'][das_ausgewaehlte_szenario] * 4.184 * 365 / 1000000) + ' PJ/yr');
}		


function drawCows(kalorien,animal_share,das_ausgewaehlte_Jahr,das_ausgewaehlte_szenario){
			  
			  drawCowsInner("#lvs_afr", 'AFR', das_ausgewaehlte_szenario);
			  drawCowsInner("#lvs_cpa", 'CPA', das_ausgewaehlte_szenario);
			  drawCowsInner("#lvs_eur", 'EUR', das_ausgewaehlte_szenario);
			  drawCowsInner("#lvs_fsu", 'FSU', das_ausgewaehlte_szenario);
			  drawCowsInner("#lvs_lam", 'LAM', das_ausgewaehlte_szenario);
			  drawCowsInner("#lvs_mea", 'MEA', das_ausgewaehlte_szenario);			  
			  drawCowsInner("#lvs_nam", 'NAM', das_ausgewaehlte_szenario);
			  drawCowsInner("#lvs_pao", 'PAO', das_ausgewaehlte_szenario);
			  drawCowsInner("#lvs_pas", 'PAS', das_ausgewaehlte_szenario);
			  drawCowsInner("#lvs_sas", 'SAS', das_ausgewaehlte_szenario);                                                       			  
}	  

function drawCowsInner(object, regionname, scenario_x, page){
      if (page = "page2") {
        $(object).empty();  
      } else {
        $(object).replaceWith('<div id=#"'+object+'></div>');     
      };
	                                                       
		  var tot = kalorien[das_ausgewaehlte_Jahr][regionname][scenario_x] / 200;
      var plant = tot *  (1-animal_share[das_ausgewaehlte_Jahr][regionname][scenario_x]);
      var animal = tot * (animal_share[das_ausgewaehlte_Jahr][regionname][scenario_x]);
      
      var waste_shr = 0;
      
      var intake = tot * (1-waste_shr) ;
      var animal_intake = Math.round(animal*(1-waste_shr));
      var plant_intake = Math.round(intake)-animal_intake;
      var animal_waste = Math.round(animal*waste_shr);
      var plant_waste =Math.round(tot)-animal_intake-plant_intake-animal_waste;            
      
  	  for(var z=0; z<plant_intake;z++) { 
           $(object).append('<img style="'+'margin-left:3px'+'" src="' + 'lib/images/wheat.png' + '" />');
      }        
  	  for(var z=0; z<animal_intake;z++) {          
           $(object).append('<img style="'+'margin-left:3px'+'" src="' + 'lib/images/kuh.png' + '" />');   
      }           
      for(var z=0; z<plant_waste;z++) { 
           $(object).append('<img style="'+'margin-left:3px'+'" src="' + 'lib/images/wheat_waste.png' + '" />');
      }               
  	  for(var z=0; z<animal_waste;z++) {          
           $(object).append('<img style="'+'margin-left:3px'+'" src="' + 'lib/images/kuh_waste.png' + '" />');   
     }           
     
}





function drawDetailPage(id){	
  document.getElementById("page1").style.display = "none";
	document.getElementById("page2").style.display = "block";
		document.getElementById("year").style.display = "block";
	
	$("#page2 .detailImg").attr("src", "lib/images/" + id + ".png");
			
	$('#page2 .bev_mon1').empty().text(Math.round(bevoelkerung[das_ausgewaehlte_Jahr][id]['a1']) + ' Mio');
	$('#page2 .bev_mon2').empty().text(Math.round(bevoelkerung[das_ausgewaehlte_Jahr][id]['b1']) + ' Mio');
	$('#page2 .bev_mon3').empty().text(Math.round(bevoelkerung[das_ausgewaehlte_Jahr][id]['a2']) + ' Mio');
	$('#page2 .bev_mon4').empty().text(Math.round(bevoelkerung[das_ausgewaehlte_Jahr][id]['b2']) + ' Mio');
	
	$('#page2 .kal_mon1').empty().text(Math.round(kalorien[das_ausgewaehlte_Jahr][id]["a1"]*bevoelkerung[das_ausgewaehlte_Jahr][id]["a1"]* 4.184 * 365 / 1000000) + ' PJ/yr');
	$('#page2 .kal_mon2').empty().text(Math.round(kalorien[das_ausgewaehlte_Jahr][id]["b1"]*bevoelkerung[das_ausgewaehlte_Jahr][id]["b1"]* 4.184 * 365 / 1000000) + ' PJ/yr');
	$('#page2 .kal_mon3').empty().text(Math.round(kalorien[das_ausgewaehlte_Jahr][id]["a2"]*bevoelkerung[das_ausgewaehlte_Jahr][id]["a2"]* 4.184 * 365 / 1000000) + ' PJ/yr');
	$('#page2 .kal_mon4').empty().text(Math.round(kalorien[das_ausgewaehlte_Jahr][id]["b2"]*bevoelkerung[das_ausgewaehlte_Jahr][id]["b2"]* 4.184 * 365 / 1000000) + ' PJ/yr');
	
	
	drawCowsInner("#page2 .fett_mon1", id, 'a1', "page2");
	drawCowsInner("#page2 .fett_mon2", id, 'b1', "page2");
	drawCowsInner("#page2 .fett_mon3", id, 'a2', "page2");
	drawCowsInner("#page2 .fett_mon4", id, 'b2', "page2");	
	
	detailId = id;
	
}

function checkBrowserName(name){  
		var agent = navigator.userAgent.toLowerCase(); 

		if (agent.indexOf(name.toLowerCase())>-1) {  
			return true;  
		}
		    return false;  
	}
		


function map_range(value, low1, high1, low2, high2) {
		return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}
	
	function transformJSON(d){   
    var out={};
    var currentYear = 0;
     	
		for(var y=0; y < d.length; y++){
            if(currentYear != parseInt([d[y]['year']])){
                years.push(parseInt([d[y]['year']]));
                currentYear = [d[y]['year']];
            }
        }                
        
        for(var c=0; c<years.length;c++){
                    C = new Object();
                        for(var y=0; y < d.length; y++){
                            if(years[c] == parseInt([d[y]['year']])){
                                C[d[y]['continent']] =  {'a1': d[y]['a1'],'a2': d[y]['a2'], 'b1': d[y]['b1'] ,'b2': d[y]['b2'],'historic': d[y]['historic'] };
                                }
                        }

                    out[years[c]] = C;
                    delete C;
            }        
		return out;	
	}
	
	
	function drawSzenarioButtons(das_ausgewaehlte_szenario){
    if(das_ausgewaehlte_Jahr>=1990){
    	$("#regionSlider").css({
  		  'cursor':'pointer',
		  });  
    } else {
    	$("#regionSlider").css({
    		'cursor':'default',  		  
		  });
		};
    	
    if (das_ausgewaehlte_szenario == "historic") {
  		$("#btn_szenario_historic a").css({
    		'background-image':'url(lib/images/button_history_active.png)',
    		'cursor':'default',
  		});    
  	} else if(das_ausgewaehlte_Jahr>2005){
    	$("#btn_szenario_historic a").css({
  		  'background-image':'url(lib/images/button_history_out.png)',
  		  'cursor':'default',
		  });  
    } else {
    	$("#btn_szenario_historic a").css({
  		  'background-image':'url(lib/images/button_history_ready.png)',
    		'cursor':'pointer',  		  
		  });
		};
		  
    if (das_ausgewaehlte_szenario == "a1") {
  		$("#btn_szenario_a1 a").css({
    		'background-image':'url(lib/images/button_a1_active.png)',
    		'cursor':'default',    		
  		});    
    } else if(das_ausgewaehlte_Jahr<1990){
    	$("#btn_szenario_a1 a").css({
  		  'background-image':'url(lib/images/button_a1_out.png)',
  		  'cursor':'default',
		  });    
    } else {
    	$("#btn_szenario_a1 a").css({
  		  'background-image':'url(lib/images/button_a1_ready.png)',
    		'cursor':'pointer',  		  
		  });		  
    };

    if (das_ausgewaehlte_szenario == "a2") {
  		$("#btn_szenario_a2 a").css({
    		'background-image':'url(lib/images/button_a2_active.png)',
    		'cursor':'default',    		
  		});   
    } else if(das_ausgewaehlte_Jahr<1990){
    	$("#btn_szenario_a2 a").css({
  		  'background-image':'url(lib/images/button_a2_out.png)',
  		  'cursor':'default',
		  });   
    } else {
    	$("#btn_szenario_a2 a").css({
  		  'background-image':'url(lib/images/button_a2_ready.png)',
    		'cursor':'pointer',  		  
		  });		  
    };
        		  
    if (das_ausgewaehlte_szenario == "b1") {
  		$("#btn_szenario_b1 a").css({
    		'background-image':'url(lib/images/button_b1_active.png)',
    		'cursor':'default',    		
  		}); 
    } else if(das_ausgewaehlte_Jahr<1990){
    	$("#btn_szenario_b1 a").css({
  		  'background-image':'url(lib/images/button_b1_out.png)',
  		  'cursor':'default',
		  });           
    } else {
    	$("#btn_szenario_b1 a").css({
  		  'background-image':'url(lib/images/button_b1_ready.png)',
    		'cursor':'pointer',  		  
		  });		  
    };
    
    if (das_ausgewaehlte_szenario == "b2") {
  		$("#btn_szenario_b2 a").css({
    		'background-image':'url(lib/images/button_b2_active.png)',
    		'cursor':'default',    		
  		});    
    } else if(das_ausgewaehlte_Jahr<1990){
    	$("#btn_szenario_b2 a").css({
  		  'background-image':'url(lib/images/button_b2_out.png)',
  		  'cursor':'default',
		  });    		
    } else {
    	$("#btn_szenario_b2 a").css({
  		  'background-image':'url(lib/images/button_b2_ready.png)',
    		'cursor':'pointer',  		  
		  });		  
    };
  }
	