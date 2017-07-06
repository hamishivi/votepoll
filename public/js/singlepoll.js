$(document).ready(function() {
    $(".button-collapse").sideNav();
    $('select').material_select();
    toggleFields();
    $("#vote").change(function () {
        toggleFields()
    });
  });

function toggleFields() {
    if ($("#vote").val() == -1) {
        $("#custom").show();
    } else {
        $("#custom").hide();
    }
}

$("#voter").click(function() {
    var curVote = "";
    if ($("#vote").val() == -1) {
     curVote = $("#poll_name").val().replace(/\r/g, "");
    } else {
     curVote = $( "#vote option:selected" ).text().replace(/\r/g, "");
    } 
    window.location.href = 'https://votepolling.herokuapp.com/addvote?url=' + $("#hash").text() + "&vote=" + curVote;
});