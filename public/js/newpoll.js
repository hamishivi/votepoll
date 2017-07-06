$('#create').click( function() {
    var name = $("#poll_name").val();
    $.get( 'https://votepolling.herokuapp.com/createpoll', $('form').serialize(), function(data) {
       window.location.href = 'https://votepolling.herokuapp.com/poll/' + name.hashCode();
    });
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