'use strict';

(function () {
   var profileEmail = document.querySelector('#profile-email') || null;
   var displayName = document.querySelector('#display-name');
   var apiUrl = appUrl + '/api/:id';
   
   function updateHtmlElement (data, element, userProperty) {
    element.innerHTML = data[userProperty];
   }

    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
        var userObject = JSON.parse(data);

      updateHtmlElement(userObject, displayName, 'displayName');

      if (profileEmail !== null) {
         updateHtmlElement(userObject, profileEmail, 'email');   
      }
   }))
})();