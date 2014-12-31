import tsUnit = require('../tsUnit/tsUnit');
import ModelTests = require('./ModelTests');

// Instantiate tsUnit and pass in modules that contain tests
var test = new tsUnit.Test(ModelTests);

// Show the test results
test.showResults(document.getElementById('result'), test.run()); 