 $.getJSON("/podcasts", function(data){
	for (var i = 0; i < data.length; i++) {
		$("#podCard").append("<div class='mdl-card__actions data-id='"+ data[i]._id+"'><div class'mdl-card mdl-cell mdl-cell--12-col mdl-cell--2-col-tablet mdl-shadow--2dp'><div class='mdl-card__title'><h4 class='mdl-card__title-text'>" + data[i].title +"</h1><div class='mdl-card__supporting-text'><img src='"+data[i].image+"'></div><div class='mdl-card__actions mdl-card--border'><a class='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect' onclick='location.href="+data[i].link+"'>Visit Page</a><div class='mdl-layout-spacer'></div><button class='mdl-button mdl-js-button mdl-button--icon'><span class='mdl-badge' data-badge='♥'></span></button></div></div></div>");
	}
});

$(document).click("div.mdl-card", function(){
	$("#comments").empty();

	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "GET",
		url: "/podcasts/" + thisId
	}).done(function(data){
		console.log(data);

		$("#comments").append("<form><h2>"+data.title +"</h2>");
		$("#comments").append("<div class='mdl-textfield mdl-js-textfield mdl-textfield--floating-label'>");
		$("#comments").append("<input class='mdl-textfield__input' type='text' id='bodyinput' name='body'>");
		$("#comments").append("<label class='mdl-textfield__label' id='titleinput'>Save your thoughts here...</label>");
		$("#comments").append("<button class='mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored mdl-js-ripple-effect' data-id='"+data._id+"' id='save'><i class='material-icons'>add</i></button> </form>");
		

		if(data.comment){
			$("#titleinput").val(data.comment.title);
			$("#bodyinput").val(data.comment.body);

		}

	});
});

$(document).click("#save", function(){
	

	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/podcasts/" + thisId, 
		data: {
			title: $("#titleinput").val(),
			body: $("#bodyinput").val()
		}
	}).done(function(data){
		console.log(data);
		$("#comments").empty();
		
	});

	$("#titleinput").val("");
	$("#bodyinput").val("");

});



