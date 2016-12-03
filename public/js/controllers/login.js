var loginApp = angular.module('loginApp', []);

//// Figure out where to place the Global vars.
var FORM_REGISTER = 0;
var FORM_LOGIN = 1;
var EMPTY_NAME = 2;
var EMPTY_PASSWORD = 3;
var EMPTY_ALL = 5;
var DUPLICATE_USER = 6;

//// Button handlers
loginApp.controller('LoginCtrl', ['$window', '$location', '$scope', '$http', 
  function($window, $location, $scope, $http) {
  
  // Handle login
  $scope.login = function() {
    // Clear and check validity
    clearInvalidMsgs(FORM_LOGIN);
    if (!isValid($scope.user, FORM_LOGIN)) {
      return;
    }

    // Post data
    $http.post('/users/login', $scope.user).then(successCallback, errorCallback);

    // Callback functions
    function successCallback(response) {
      // Fail login
      if (!response.data.success) {
        if (response.data.message === "Unknown user") {
          showMsgInvalid(EMPTY_NAME, FORM_LOGIN);
        } else {
          showMsgInvalid(EMPTY_PASSWORD, FORM_LOGIN);
        }
        return;
      }
      // Login success
      $scope.home();
    }

    function errorCallback(response) {
      console.log("Fail: " + response.data);
      console.log(response);
    }
  }

  // Handle register
  $scope.register = function() {
    // Clear and check validity
    clearInvalidMsgs(FORM_REGISTER);
    if (!isValid($scope.user, FORM_REGISTER)) {
      return;
    }

    // Post data
    $http.post('/users/register', $scope.user).then(successCallback, errorCallback);

    // Callback functions
    function successCallback(response) {
      console.log(response.data);
      if (!response.data.success) {
        showMsgInvalid(DUPLICATE_USER, FORM_REGISTER);
        return;
      }      

      showMsgSuccess();
    }

    function errorCallback(response) {
      console.log(response.data);
    }
  }

  $scope.home = function() {
    $window.location.href = '/';
  }

}]);

//// Helper functions
function isValid(user, formType) {
  var valid = true;

  // Check if user is defined
  if (!user) {
    showMsgInvalid(EMPTY_ALL, formType);
    return false;
  }

  // Check if username is empty
  if (!user.username.trim()) {
    valid = false;
    showMsgInvalid(EMPTY_NAME, formType);
  } else {
    hideMsgInvalid(EMPTY_NAME, formType);
  }

  // Check if password is empty
  if (!user.password) {
    valid = false;
    showMsgInvalid(EMPTY_PASSWORD, formType);
  } else {
    hideMsgInvalid(EMPTY_PASSWORD, formType);
  }

  // If valid hide all messages
  if (valid) {
    hideMsgInvalid(EMPTY_ALL, formType);
  }

  return valid;
}

/* Ugly functions :( unfortunately, do not have time to optimize these. */
function showMsgInvalid(errType, formType) {
  // Invalid login messages
  if (formType == FORM_LOGIN) {
    switch(errType) {
      case EMPTY_NAME:
        $("#invalidUserMsg1").show();
        break;
      case EMPTY_PASSWORD:
        $("#invalidPwMsg1").show();
        break;
      case EMPTY_ALL:
        $("#invalidUserMsg1").show(); 
        $("#invalidPwMsg1").show();
        break;
    }
  }

  // Invalid register messages
  else {
    switch(errType) {
      case EMPTY_NAME:
        $("#invalidUserMsg2").show();
        break;
      case EMPTY_PASSWORD:
        $("#invalidPwMsg2").show();
        break;
      case EMPTY_ALL:
        $("#invalidUserMsg2").show(); 
        $("#invalidPwMsg2").show();
        break;
      case DUPLICATE_USER:
        $("#duplicateUserMsg").show();
        break;
    }
  }
}

/* Ugly functions :( unfortunately, do not have time to optimize these. */
function hideMsgInvalid(errType, formType) {
  // Invalid login messages
  if (formType == FORM_LOGIN) {
    switch(errType) {
      case EMPTY_NAME:
        $("#invalidUserMsg1").hide();
        break;
      case EMPTY_PASSWORD:
        $("#invalidPwMsg1").hide();
        break;
      case EMPTY_ALL:
        $("#invalidUserMsg1").hide(); 
        $("#invalidPwMsg1").hide();
        break;
    }
  } 

  // Invalid register messages
  else {
    switch(errType) {
      case EMPTY_NAME:
        $("#invalidUserMsg2").hide();
        break;
      case EMPTY_PASSWORD:
        $("#invalidPwMsg2").hide();
        break;
      case EMPTY_ALL:
        $("#invalidUserMsg2").hide(); 
        $("#invalidPwMsg2").hide();
        $("#duplicateUserMsg").hide();
        break;
      case DUPLICATE_USER:
        $("#duplicateUserMsg").hide();
        break;
    }
  }
}

function clearInvalidMsgs(formType) {
  hideMsgInvalid(EMPTY_ALL, formType);
}

function showMsgSuccess() {
  $("#registerSuccessMsg").show();
}

//// Tab scripts
$('.form').find('input, textarea').on('keyup blur focus', function (e) {

  var $this = $(this),
  label = $this.prev('label');

  if (e.type === 'keyup') {
    if ($this.val() === '') {
      label.removeClass('active highlight');
    } else {
      label.addClass('active highlight');
    }
  } else if (e.type === 'blur') {
    if( $this.val() === '' ) {
      label.removeClass('active highlight'); 
    } else {
      label.removeClass('highlight');   
    }   
  } else if (e.type === 'focus') {

    if( $this.val() === '' ) {
      label.removeClass('highlight'); 
    } 
    else if( $this.val() !== '' ) {
      label.addClass('highlight');
    }
  }

});

$('.tab a').on('click', function (e) {
  clearInvalidMsgs(FORM_LOGIN);
  clearInvalidMsgs(FORM_REGISTER);

  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(600);
  
});

$('.button-signup a').on('click', function (e) {
  e.preventDefault();

  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();

  $(target).fadeIn(600);
});