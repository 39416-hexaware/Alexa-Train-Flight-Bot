var api = '';

module.exports.headerTemplate = function () {
    var header = {
        'Cache-Control': 'no-cache',
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };
    return header;
}

var APIList = {
    'RailwayAPI': () => {
        console.log('Inside Railway APIList');
        api = 'http://34.229.40.189:7001/RailwayAPI';
        return api;
    },
    'FlightAPI': () => {
        console.log('Inside Flight APIList');
        api = 'http://34.229.40.189:7002/FlightAPI';
        return api;
    }    
};

module.exports.APIList = APIList;