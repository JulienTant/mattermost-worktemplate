const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const Validator = require('jsonschema').Validator;
const v = new Validator();

const ErrCodeCantReadFolder = -1;
const ErrCodeUnableToReadTemplate = -2;
const ErrCodeUnableToReadSchema = -3;
const ErroCodeValidationFailed = 1;

let schema;
try {
    schema = JSON.parse(fs.readFileSync('./schema.json', 'utf8'));
} catch (e) {
    console.error('unable to read schema file')
    process.exit(ErrCodeUnableToReadSchema);
}

function validateTemplate(fileName) {
    // Get document, or throw exception on error
    let instance;
    try {
        instance = yaml.load(fs.readFileSync(fileName, 'utf8'));
    } catch (e) {
        console.error('unable to read example file')
        process.exit(ErrCodeUnableToReadTemplate);
    }

   return v.validate(instance, schema);
}

const directoryPath = path.join(__dirname, 'templates');
fs.readdir(directoryPath, function (err, files) {
    if (err) {
        console.error('Unable to scan directory: ' + err);
        process.exit(ErrCodeCantReadFolder);
    }

    success = [];
    errors = [];
    files.forEach(function (file) {
        fullPath = path.join(directoryPath, file);
        const result = validateTemplate(path.join(directoryPath, file));
        if (result.errors.length === 0) {
            success.push(file);
        } else {
            errors.push({file, result});
        }
    });
    
    if (success.length > 0) {
        console.log('Success:');
        success.forEach((file) => {
            console.log(`  ${file}`);
        });
    }

    if (errors.length > 0) {
        console.log('Errors:');
        errors.forEach((error) => {
            console.log(`  ${error.file}`);
            error.result.errors.forEach((error) => {
                console.log(`    ${error}`);
            });
        });
        process.exit(ErroCodeValidationFailed);
    }
});

