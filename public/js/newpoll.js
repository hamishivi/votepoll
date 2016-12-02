$('#create').click( function() {
    var name = $("#poll_name").val();
    //var opts =$("#options").val().replace('/\r/g', ',');
    //console.log(opts);
    //window.location.href = 'https://authentication-test-2-hamishivi.c9users.io/createpoll?name='+name+'&options='+opts;
    $.get( 'https://authentication-test-2-hamishivi.c9users.io/createpoll', $('form').serialize(), function(data) {
       window.location.href = 'https://authentication-test-2-hamishivi.c9users.io/poll/' + name.hashCode();
    });
    //redirect after created poll
    //window.location = "http://www.yoururl.com";
});

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};