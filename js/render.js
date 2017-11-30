function renderMarkdown(file, onload) {
    onload = onload || function(){};
    var parser = new stmd.DocParser();
    var renderer = new stmd.HtmlRenderer();
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            var content = renderer.renderBlock(parser.parse(xhr.responseText));
            document.getElementById('container').innerHTML = content;
            onload();
        }
    };
    xhr.open('GET', file);
    xhr.send();
}

function createRecipeFromElements(elts) {
    console.log(elts);
    var topDiv = document.createElement('div');
    topDiv.className = 'recipe';

    console.assert(elts[0].tagName == 'H2');
    elts[0].className = 'recipe-title';
    topDiv.appendChild(elts[0]);
    elts.shift();

    var detailDiv = document.createElement('div');
    detailDiv.className = 'recipe-detail';
    topDiv.appendChild(detailDiv);

    // The recipe begins with a "Yield:" line.
    console.assert(elts[0].tagName == 'P');
    elts[0].className = 'recipe-yield';
    detailDiv.appendChild(elts[0]);
    elts.shift();

    // Everything in <blockquote> is "recipe-commentary".
    var commentaryDiv = document.createElement('div');
    commentaryDiv.className = 'recipe-commentary';
    detailDiv.appendChild(commentaryDiv);
    while (elts[0].tagName == 'BLOCKQUOTE') {
        while (elts[0].hasChildNodes()) {
            commentaryDiv.appendChild(elts[0].firstChild);
        }
        elts.shift();
    }

    // All of the elements up to the last <ul> are "recipe-ingredients".
    // The remaining elements are "recipe-steps".
    var lastListIndex = elts.length-1;
    while (elts[lastListIndex].tagName != 'UL') --lastListIndex;

    var ingredientsDiv = document.createElement('div');
    ingredientsDiv.className = 'recipe-ingredients';
    detailDiv.appendChild(ingredientsDiv);
    var stepsDiv = document.createElement('div');
    stepsDiv.className = 'recipe-steps';
    detailDiv.appendChild(stepsDiv);

    for (var i = 0; i <= lastListIndex; ++i) {
        ingredientsDiv.appendChild(elts[i]);
    }
    for (var i = lastListIndex + 1; i < elts.length; ++i) {
        stepsDiv.appendChild(elts[i]);
    }
    return topDiv;
}
