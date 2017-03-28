senatewrite.factory('dataFactory', function($http) {
  var getAddresses = function() {
    return $http({
      method: 'GET',
      url: 'api/addresses'
    })
    .then(function(response) {
      return response.data;
    });
  };

  var getWritingOptions = function() {
    return $http({
      method: 'GET',
      url: 'api/writing'
    })
    .then(function(response) {
      return response.data;
    });
  };

  var getMetadata = function() {
    return $http({
      method: 'GET',
      url: 'api/metadata'
    })
    .then(function(response) {
      return response.data;
    });
  };

  var getRegionalContacts = function() {
    return $http({
      method: 'GET',
      url: 'api/regionalcontacts'
    })
    .then(function(response) {
      return response.data;
    });
  };

  return {
    getAddresses: getAddresses,
    getWritingOptions: getWritingOptions,
    getMetadata: getMetadata,
    getRegionalContacts: getRegionalContacts
  };
});
