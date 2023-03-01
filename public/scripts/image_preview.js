'use strict';
const readFile=(file, book)=> {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
        console.log(reader.result);
    };
};

module.exports = {readFile};