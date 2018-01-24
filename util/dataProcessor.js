var BookTrainData = function () {
    var IntentName = null;
    var BoardingPoint = null;
    var Destination = null;
    var DateOfTravel = null;
    var Tickets = null;
};

var StationDetails = function () {
    var IntentName = null;
    var StationName = null;
    var TrainNumber = null;
};

var TrainRouteDetails = function () {
    var IntentName = null;
    var TrainNumber = null;
};

var CancelledRouteDetails = function () {
    var IntentName = null;
    var CancelledDate = null;
};

var PNRDetails = function () {
    var IntentName = null;
    var PNRNumber = null;
};

module.exports.BookTrainData = BookTrainData;
module.exports.StationDetails = StationDetails;
module.exports.TrainRouteDetails = TrainRouteDetails;
module.exports.CancelledRouteDetails = CancelledRouteDetails;
module.exports.PNRDetails = PNRDetails;