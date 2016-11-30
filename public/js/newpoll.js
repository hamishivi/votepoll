$('#submit').click( function() {
    $.get( 'https://authentication-test-2-hamishivi.c9users.io/createpoll', $('form').serialize(), function(data) {
       },
       'json' // I expect a JSON response
    );
    //redirect after created poll
    //window.location = "http://www.yoururl.com";
});
