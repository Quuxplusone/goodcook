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

function moveChildrenFrom(x, y) {
    while (x.hasChildNodes()) {
        y.appendChild(x.firstChild);
    }
}

function createToggleArrow(e, pp) {
    var icon = document.createElement('a');
    icon.innerHTML = '<img src="css/down-arrow.svg"></img>'
    icon.className = 'arrow downward';
    icon.onclick = function() {
        if (icon.className == 'arrow upward') {
            icon.className = 'arrow downward';
            e.style.display = 'none';
        } else {
            icon.className = 'arrow upward';
            e.style.display = 'block';
        }
    }
    return icon;
}

function slugify(string) {
    return string.toLowerCase()
      .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
      .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
      .replace(/^-+|-+$/g, ''); // remove leading, trailing -
}

function createRecipeFromElements(elts) {
    var topDiv = document.createElement('div');
    topDiv.className = 'recipe';

    var detailDiv = document.createElement('div');
    detailDiv.className = 'recipe-detail nomobile';
    detailDiv.style.display = 'none';

    console.assert(elts[0].tagName == 'H2');
    var h2span = document.createElement('span');
    moveChildrenFrom(elts[0], h2span);
    elts[0].setAttribute("id", slugify(h2span.innerHTML));
    elts[0].appendChild(createToggleArrow(detailDiv, '100'));
    elts[0].firstChild.appendChild(h2span);
    topDiv.appendChild(elts[0]);
    elts.shift();

    topDiv.appendChild(detailDiv);

    // The recipe might begin with a "Yield:" line.
    if (elts[0].tagName == 'P') {
        elts[0].className = 'recipe-yield';
        detailDiv.appendChild(elts[0]);
        elts.shift();
    }

    var commentaryDiv = document.createElement('div');
    var commentaryHeading = document.createElement('h3');
    commentaryHeading.className = 'onlymobile';
    commentaryHeading.appendChild(createToggleArrow(commentaryDiv, '50'));
    var foo = document.createElement('span'); foo.innerHTML = 'Commentary';
    commentaryHeading.firstChild.appendChild(foo);
    commentaryDiv.className = 'recipe-ingredients nomobile';
    detailDiv.appendChild(commentaryHeading);
    detailDiv.appendChild(commentaryDiv);

    // Everything in <blockquote> is "recipe-commentary".
    while (elts[0].tagName == 'BLOCKQUOTE') {
        moveChildrenFrom(elts[0], commentaryDiv);
        elts.shift();
    }

    // All of the elements up to the last <ul> are "recipe-ingredients".
    // The remaining elements are "recipe-steps".
    var lastListIndex = elts.length-1;
    while (elts[lastListIndex].tagName != 'UL') --lastListIndex;

    var ingredientsDiv = document.createElement('div');
    var ingredientsHeading = document.createElement('h3');
    ingredientsHeading.className = 'onlymobile';
    ingredientsHeading.appendChild(createToggleArrow(ingredientsDiv, '50'));
    var foo = document.createElement('span'); foo.innerHTML = 'Ingredients';
    ingredientsHeading.firstChild.appendChild(foo);
    ingredientsDiv.className = 'recipe-ingredients nomobile';
    detailDiv.appendChild(ingredientsHeading);
    detailDiv.appendChild(ingredientsDiv);

    var stepsDiv = document.createElement('div');
    var stepsHeading = document.createElement('h3');
    stepsHeading.className = 'onlymobile';
    stepsHeading.appendChild(createToggleArrow(stepsDiv, '50'));
    var foo = document.createElement('span'); foo.innerHTML = 'Steps';
    stepsHeading.firstChild.appendChild(foo);
    stepsDiv.className = 'recipe-steps nomobile';
    detailDiv.appendChild(stepsHeading);
    detailDiv.appendChild(stepsDiv);

    for (var i = 0; i <= lastListIndex; ++i) {
        ingredientsDiv.appendChild(elts[i]);
    }
    for (var i = lastListIndex + 1; i < elts.length; ++i) {
        stepsDiv.appendChild(elts[i]);
    }
    return topDiv;
}

function renderRecipes(file) {
    var is_ignorable = function (elt) {
        if (elt === null) return false;
        if (elt.nodeType === 8) return true;
        if (elt.nodeType === 3 && /^\s*$/.test(elt.textContent)) return true;
        return false;
    };

    renderMarkdown(file, function () {
        var container = document.getElementById('container');
        var elt = container.firstChild;
        var currentRecipeElements = null;
        while (elt) {
            var currentChild = elt;
            do {
                elt = elt.nextSibling;
            } while (is_ignorable(elt));
            if (currentChild.tagName == 'H2') {
                if (currentRecipeElements !== null) {
                    container.insertBefore(
                        createRecipeFromElements(currentRecipeElements),
                        currentChild
                    );
                }
                currentRecipeElements = [];
            }
            currentRecipeElements.push(currentChild);
        }
        if (currentRecipeElements !== null) {
            container.appendChild(
                createRecipeFromElements(currentRecipeElements)
            );
        }
    });
}
