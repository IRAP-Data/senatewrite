senatewrite.factory('pdf', function() {
  function createDocDefinition(cover, senatorALetters, senatorBLetters) {
    return {
      content: cover.concat(senatorALetters).concat(senatorBLetters),
      styles: {
        header: {
          fontSize: 15,
          bold: true
        },
        bold: {
          bold: true
        },
        bigger: {
          fontSize: 15,
          italics: true,
        },
        smaller: {
          fontSize: 11
        },
        italics: {
          italics: true
        },
        honorific: {
          bold: true,
          margin: [0, 20, 0, 20]
        },
        paragraph: {
          margin: [0, 0, 0, 20]
        },
        paragraphSm: {
          margin: [0, 0, 0, 10]
        },
        valediction: {
          margin: [0, 20, 0, 0]
        },
        signature: {
          margin: [0, 20, 0, 0]
        }
      },
      defaultStyle: {
        columnGap: 20
      }
    };
  }

  function createCoverStart(name, email) {
    return [
      {
        text: 'GENERAL INFO HEAD',
        style: 'header'
      },
      {
        text: 'GENERAL INSTRUCTIONS, PARA0',
        style: ['paragraphSm', 'smaller']
      },
      {
        text: 'GENERAL INSTRUCTIONS, PARA1',
        style: ['paragraphSm', 'smaller']
      },
      {
        text: 'GENERAL INSTRUCTIONS, PARA2',
        style: ['bold', 'smaller']
      },
      {
        text: name + ', email: ' + email, //ONLY USED IF YOU HAVE REGIONAL CONTACTS -- THIS DUMPS THEIR INFO
        style: ['paragraphSm', 'smaller']
      }
    ];
  }

  function getCoverEnd() {
    return [
      {
        text: 'GENERAL INSTRUCTIONS, PARA3',
        style: ['bold', 'smaller']
      },
      {
        text: 'GROUP SIGNING',
        style: 'smaller',
        pageBreak: 'after'
      },
      {
        text: 'CALL SCRIPT HEAD',
        style: 'header'
      },
      {
        text: 'CALL SCRIPT SUBHEAD',
        style: ['italics', 'smaller']
      },
      {
        text: 'CALL SCRIPT P0',
        style: ['paragraphSm', 'smaller'] 
      },
      {
        text: 'CALL SCRIPT INSTRUCTIONS',
        style: ['italics', 'smaller']
      },
      {
        ul: [
          {
            text: 'CALL SCRIPT PT0',
            style: 'smaller'
          },
          {
            text: 'CALL SCRIPT PT1',
            style: 'smaller'
          },
          {
            text: 'CALL SCRIPT PT2',
            style: 'smaller'
          },
          {
            text: 'CALL SCRIPT PT3',
            style: 'smaller'
          },
          {
            text: 'CALL SCRIPT PT4',
            style: 'smaller'
          },
          {
            text: 'CALL SCRIPT PT5',
            style: ['paragraphSm', 'smaller']
          }
        ]
      },
      {
        text: 'CALL CLOSING SUBHEAD',
        style: ['italics', 'smaller']
      },
      {
        text: 'CALL SCRIPT CLOSING TEXT',
        style: 'smaller',
        pageBreak: 'after'
      }
    ];
  }

  function createSenatorInfo(senator) {
    return [
      {
        text: senator.first + ' ' + senator.last + ': Contact Information',
        style: 'header'
      },
      {
        text: 'METADATA INTRO',
        style: ['paragraphSm', 'smaller']
      },
      {
        text: senator.meta,
        style: ['paragraphSm', 'smaller']
      },
      {
        text: 'SENATOR ADDRESSES',
        style: ['bold', 'smaller']
      },
      {
        text: senator.addresses,
        style: 'smaller'
      },
      {
        text: 'SENATOR PHONE NUMBERS AND STAFFERS',
        style: ['bold', 'smaller']
      },
      {
        text: senator.phones,
        style: ['paragraphSm', 'smaller']
      }
    ];
  }

  function createUserAddr(user) {
    var date = new Date();
    var day = date.getDate();
    var year = date.getFullYear();
    var month = date.toLocaleString('en-US', { month: 'short' }).split(' ')[0];
    
    var string = user.name;
    string = user.address ? string + '\n' + user.address : string;
    string = user.address_2 ? string + '\n' + user.address_2 : string;
    string += '\n' + user.city + ', ' + user.state + ' ' + user.zip + '\n\n' + month + ' ' + day + ', ' + year;
    
    return string;
  }

  function createAddressString(addresses) {
    return addresses.reduce(function(string, addr) {
      string = addr.building_name ? string + addr.building_name + ', ' : string;
      string = addr.office_address ? string + addr.office_address + ', ' : string;
      string = addr.address_2 ? string + addr.address_2 + ', ' : string;
      string = addr.PO_box ? string + addr.PO_box + ', ' : string;
      string += addr.City + ', ' + addr.State_Zip + '\n';
      return string;
    }, '');
  }

  function createPhoneNumString(addresses) {
    return addresses.reduce(function(string, addr) {
      string = addr.office_tel ? string + addr.office_tel : string;
      string = addr.office_chiefstaff ? string + ', ' + addr.office_chiefstaff : string;
      if (addr.office_tel) string = string + '\n';
      return string;
    }, '');
  }

  function createSenatorAddr(addr) {
    var string = 'The Honorable ' + addr.name_first + ' ' + addr.name_last;
    string = addr.building_name ? string + '\n' + addr.building_name : string;
    string = addr.office_address ? string + '\n' + addr.office_address : string;
    string = addr.address_2 ? string + '\n' + addr.address_2 : string;
    string = addr.PO_box ? string + '\n' + addr.PO_box : string;
    string += '\n' + addr.City + ', ' + addr.State_Zip;
    return string;
  }

  function createLetterOpening(senAddr, userAddr, senator) {
    return [
      {
        columns: [
          {
            text: senAddr,
            width: '50%'
          },
          {
            text: '',
            width: '10%'
          },
          {
            text: userAddr
          }
        ]
      },
      {
        text: '\nDear Senator ' + senator + ':',
        style: 'honorific'
      }
    ];
  }

  function createLetterClosing(userName) {
    return [
      {
        text: 'Sincerely,',
        style: 'valediction'
      },
      {
        text: userName,
        style: 'signature',
        pageBreak: 'after'
      }
    ];
  }

  return {
    createDocDefinition: createDocDefinition,
    createCoverStart: createCoverStart,
    getCoverEnd: getCoverEnd,
    createSenatorInfo: createSenatorInfo,
    createUserAddr: createUserAddr,
    createAddressString: createAddressString,
    createPhoneNumString: createPhoneNumString,
    createSenatorAddr: createSenatorAddr,
    createLetterOpening: createLetterOpening,
    createLetterClosing: createLetterClosing
  };
});
