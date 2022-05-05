const txtPerRowParser = (text) => text.split("\r\n");

const grouper = (array, i = 0) => {
    return array.reduce((accumulator, element, index, array) => {
        if (element === '') {
            if (array[index - 1] !== '') {
                i++;
                accumulator[i] = [];
            }
            return accumulator;
        }
        accumulator[i].push(element);
        return accumulator;
    }, [[]]);
}

const giftFormatter = (array) => {
    return array.map((test) => {

            const isEmpty = test.length === 0;
            if (!isEmpty) {
                test.unshift(test[0]);
                test.splice(2, 0, '{');
            }

            test = test.map((item, index) =>
                ((index === 0 || index === 1) ? '::' : (index === 3) ? '=' : (index !== 2) ? '~' : '') + item
            )
            if (!isEmpty)
                test.push('}');

            return test;
        }
    )
}

const arrayToText = (array) => {
    return array.reduce((text, item) =>
            text + item.reduce((text, item) =>
                text + item + '\r\n', '') + '\r\n'
        , '');
}

const readFromInput = (fileInput, callback) => {
    const reader = new FileReader();
    reader.readAsText(fileInput.files[0]);
    reader.onload = () => callback(reader.result);
}

const main = () => {

    const fileInput = document.getElementById('fileinput');
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const downloadBtn = document.getElementById('download');
    const spinner = document.getElementById('spinner');

    fileInput.addEventListener('change', (event) => {
        const allowedExtensions = /(\.txt)$/i;

        if (!allowedExtensions.exec(event.target.value)) {
            alert('Недопустимый тип файла!');
            fileInput.value = '';
            return false;
        }
        spinner.style.display = 'block';

        readFromInput(event.target, (text) => {
            input.innerHTML = text;
            const result = arrayToText(giftFormatter(grouper(txtPerRowParser(text))));
            output.innerHTML = result;
            downloadBtn.setAttribute('href', 'data:text,' + result);
            downloadBtn.classList.remove('disabled');
            spinner.style.display = 'none';
        });

    })
}

main();