/*$.getJSON("/podcasts", function(data){
	for (var i = 0; i < data.length; i++) {
		$("#podCards").append("<div class='mdl-card__actions data-id='"+ data[i]._id+"'><div class='mdl-card mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-shadow--8dp'><div class='mdl-card__title'><h1 class='mdl-card__title-text'>" + data[i].title +"</h1></div><div class='mdl-card__supporting-text'><img src='"+data[i].image+"' height='350px' width='400px'></div><div class='mdl-card__actions mdl-card--border'><a class='mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect' href='"+data[i].link+"'>Visit Page</a><div class='mdl-layout-spacer'></div><button class='mdl-button mdl-js-button mdl-button--icon'><i class='material-icons'>favorite</i></button></div></div></div>");
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
*/

$(document).on("click", "#addingCom", function(){
	$("#comForm").modal();
});
    

$(document).on("click", "#savePod", function() {


    var id = $(this).attr("data-id");

    $.post("/save/"+id,
        function(save) {
            if (err) {
                console.log(err);
            } else {

                console.log(save);
            }
        });

});

$(document).on("click", "#saveCom", function() {
    var id = $(this).attr("data-id");

    var comTitle = $("#titleCom").val()
    var comBody = $("#bodyCom").val();



    $.post("/comment/" + id, comTitle, comBody, function(data) {
        console.log(data);
        $("#comments").empty();

    });
});
