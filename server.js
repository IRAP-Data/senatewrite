var express = require('express');
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 8000));

app.get('/api/metadata', function(req, res) {
  request('https://spreadsheets.google.com/tq?&key=1CnmRnBj83Irp2b3KIunyGT_4wWu34MXwyvSADrQYtcg', function(err, response, body) {
    if (err) {
      console.log(err);
      res.sendStatus(404);
    } else {
      var data = processMetadata(response.body);
      res.json(data);
    }
  });
});

app.get('/api/regionalcontacts', function(req, res) {
  request('https://spreadsheets.google.com/tq?&key=19mj82DTlZy1JrAoYSUdj7KedCeEio5s68iGSaG9gVxw', function(err, response, body) {
    if (err) {
      console.log(err);
      res.sendStatus(404);
    } else {
      var data = responseToJSON(response.body)['rows'];
      data = processRegionalContacts(data);
      res.json(data);
    }
  });
});

app.get('/api/addresses', function(req, res) {
  request('https://spreadsheets.google.com/tq?&key=1M8t5e27k2wabUzwzv0xXICOtTlh6SrXnMKysZAoBwUs', function(err, response, body) {
    if (err) {
      console.log(err);
      res.sendStatus(404);
    } else {
      var data = responseToJSON(response.body);
      data = processAddressData(data);
      res.json(data);
    }
  });
});

app.get('/api/writing', function(req, res) {
  request('https://spreadsheets.google.com/tq?&key=1X48tQKD4oejeExpawqIwbT2iOBnLUdewhR3kRyv68No', function(err, response, body) {
    if (err) {
      console.log(err);
      res.sendStatus(404);
    } else {
      var data = responseToJSON(response.body)['rows'];
      data = processWritingOptionData(data);
      res.json(data);
    }
  });
});

function responseToJSON(response) {
  // switch this to regex to make more robust against response format changes
  var data = response.replace('/*O_o*/\ngoogle.visualization.Query.setResponse(', '');
  data = data.replace(');', '');
  return JSON.parse(data)['table'];
}

function processRegionalContacts(data) {
  var header = ['state', 'name', 'email'];
  data = data.map(googleRowsToKeyedObjs(header));

  return data.reduce(function(obj, row) {
    obj[row.state] = {
      name: row.name ? row.name.split(' ').map(function(str) { return str[0].toUpperCase() + str.slice(1) }).join(' ') : row.name,
      email: row.email
    };
    return obj;
  }, {});
}

function processWritingOptionData(data) {
  var header = googleRowToArr(data.shift());
  data = data.map(googleRowsToKeyedObjs(header));

  data = data.reduce(function(obj, row) {
    var paraIdx, val;
    if (!obj[row.sen_state]) obj[row.sen_state] = {};
    if (!obj[row.sen_state][row.name_last]) obj[row.sen_state][row.name_last] = [[], [], [], [], []];
    
    for (var key in row) {
      if (row.hasOwnProperty(key) && /para_\d_opt_\d/.test(key) && row[key] && row[key] !== '') {
        paraIdx = parseInt(key[5]) - 1;
        obj[row.sen_state][row.name_last][paraIdx].push(row[key]);
      }
    }

    return obj;
  }, {});

  return data;
}

function processAddressData(data) {
  var header = data['cols'].reduce(function(keys, col) {
    if (col.label !== '') keys.push(col.label);
    return keys;
  }, []);
  data = data['rows'].map(googleRowsToKeyedObjs(header));

  data = data.reduce(function(obj, row) {
    var key = row.sen_state + row.name_last;
    if (!obj[key]) obj[key] = { addresses: [] };
    obj[key].addresses.push(row);
    return obj;
  }, {});

  return data;
}

function processMetadata(data) {
  var metadata = data.replace('/*O_o*/\ngoogle.visualization.Query.setResponse(', ''); //'/*O_o*/\ngoogle.visualization.Query.setResponse('
  metadata = metadata.replace(/\\u2013/g, '-');
  metadata = metadata.replace(/\\u2013/g, "'");
  metadata = metadata.replace(/\n/g, '');
  metadata = metadata.slice(0, -2);
  metadata = JSON.parse(metadata)['table'];

  var header = metadata['cols'].reduce(function(keys, col) {
    if (col.label !== '') keys.push(col.label);
    return keys;
  }, []);
  var mappedData = metadata['rows'].map(googleRowsToKeyedObjs(header));
  return mappedData.reduce(function(obj, row) {
    obj[row.name_last] = row.meta;
    return obj;
  }, {});
}

function googleRowsToKeyedObjs(keys) {
  return function(row) {
    return row['c'].reduce(function(obj, val, idx) {
      if (val) obj[keys[idx]] = val.v;
      return obj;
    }, {});
  }
}

function googleRowToArr(row) {
  return row['c'].map(function(obj) {
    return obj ? obj.v : null;
  });
}

app.use(express.static('public'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
