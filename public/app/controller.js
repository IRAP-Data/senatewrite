senatewrite.controller('formCtrlr', ['$scope', 'dataFactory', 'pdf', function($scope, dataFactory, pdf) {
  $scope.state = '';
  $scope.states = [];
  $scope.user = {};
  $scope.currWritingOpts = [];
  $scope.senatorA = {};
  $scope.senatorB = {};
  $scope.contactEmail = '';

  var writingOptions = {};
  var addresses = {};
  var metadata = {};
  var regionalContacts = {};

  dataFactory.getWritingOptions().then(function(response) {
    $scope.states = Object.keys(response);
    writingOptions = response;
    $scope.loaded = 'loaded';
  });

  dataFactory.getAddresses().then(function(response) {
    addresses = response;
  });

  dataFactory.getMetadata().then(function(response) {
    metadata = response;
  });

  dataFactory.getRegionalContacts().then(function(response) {
    regionalContacts = response;
    console.log(regionalContacts);
  });

  $scope.$watch('state', function(oldState, newState) {
    if (!$scope.state) return;
    var opts = writingOptions[$scope.state];
    var senators = Object.keys(opts);
    
    $scope.currWritingOpts = senators.map(function(senator) {
      return {
        senator: senator,
        paragraphs: opts[senator]
      };
    });

    $scope.senatorA = {};
    $scope.senatorB = {};
    $scope.contactEmail = 'mailto:' + regionalContacts[$scope.state].email;
  });

  $scope.generatePDF = function() {
    var addressesA = addresses[$scope.state + $scope.currWritingOpts[0].senator];
    var addressesB = addresses[$scope.state + $scope.currWritingOpts[1].senator];
    var userAddress = pdf.createUserAddr($scope.user);
    var cover = createLetterCoverPage();
    var senatorALetters = addressesA.addresses.map(createLetter(0, userAddress)).reduce(function(objs, letter) {
      return objs.concat(letter);
    }, []);
    var senatorBLetters = addressesB.addresses.map(createLetter(1, userAddress)).reduce(function(objs, letter) {
      return objs.concat(letter);
    }, []);

    var docDefinition = pdf.createDocDefinition(cover, senatorALetters, senatorBLetters);

    pdfMake.createPdf(docDefinition).download();
  }

  function createLetterCoverPage() {
    var senatorASection = senatorInfoToLetter(addresses[$scope.state + $scope.currWritingOpts[0].senator]['addresses']);
    var senatorBSection = senatorInfoToLetter(addresses[$scope.state + $scope.currWritingOpts[1].senator]['addresses']);
    var coverStart = pdf.createCoverStart(regionalContacts[$scope.state].name, regionalContacts[$scope.state].email);
    var coverEnd = pdf.getCoverEnd();

    return coverStart.concat(senatorASection).concat(senatorBSection).concat(coverEnd);
  }

  function senatorInfoToLetter(addresses) {
    var addressString = pdf.createAddressString(addresses);
    var phoneNumString = pdf.createPhoneNumString(addresses);

    return pdf.createSenatorInfo({
      first: addresses[0].name_first,
      last: addresses[0].name_last,
      meta: metadata[addresses[0].name_last],
      addresses: addressString,
      phones: phoneNumString
    });
  }

  function createLetter(index, userAddr) {
    return function(addr) {
      var senator = index ? 'senatorB' : 'senatorA';
      var senatorAddrString = pdf.createSenatorAddr(addr);
      var opening = pdf.createLetterOpening(senatorAddrString, userAddr, $scope.currWritingOpts[index].senator);
      var paragraphs = [];
      for (var key in $scope[senator]) {
        if ($scope[senator].hasOwnProperty(key)) paragraphs.push({ text: $scope[senator][key], style: 'paragraph' });
      }
      var close = pdf.createLetterClosing($scope.user.name);

      return opening.concat(paragraphs).concat(close);
    };
  }

}]);
