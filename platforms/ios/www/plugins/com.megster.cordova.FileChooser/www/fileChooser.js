cordova.define("com.megster.cordova.FileChooser.FileChooser", function(require, exports, module) { module.exports = {
    open: function (success, failure) {
        cordova.exec(success, failure, "FileChooser", "open", []);
    }
};

});
