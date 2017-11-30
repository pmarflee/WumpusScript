import tsUnit = require('../tsUnit/tsUnit');
import ModelTests = require('./ModelTests');

new tsUnit.Test(ModelTests).run().showResults(document.getElementById('result')); 