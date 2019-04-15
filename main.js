'use secret';
(function main() {
    let pQuestion = document.getElementById('question');
    let pStatus = document.getElementById('status');
    let pScore = document.getElementById('score');
    let divWordList = document.getElementById('word_list');
    let words;
    let tryCount = 0;
    let shouldGoNext = false;
    let score = 0;
    let times = 0;

    document.getElementById('btn_next').addEventListener('click', _ => {
        loadQuestion()
    });

    window.onload = function () {
        fetch('./words.json', {
            method: 'GET'
        }).then(function (response) {
            response.json().then(function (json) {
                words = json;
                loadQuestion();
            }).catch(function (err) {

            });
        }).catch(function (err) {

        });
    };

    function loadQuestion() {
        let start = randomFrom(0, words.length - 6);
        let qWords = words.slice(start, start + 6);
        let index = randomFrom(0, 5);
        pQuestion.innerText = qWords[index][0];
        divWordList.innerHTML = "";
        pStatus.innerText = "";
        for (let i = 0; i < qWords.length; i++) {
            let word = qWords[i][1];
            let p = document.createElement('p');
            p.innerText = word;
            p.classList.add('word-item');
            p.addEventListener('click', e => {
                if (shouldGoNext) {
                    shouldGoNext = false;
                    loadQuestion();
                } else {
                    times++;
                    if (i !== index) {
                        pStatus.innerText = "回答错误.";
                        tryCount++;
                        if (tryCount === 3) {
                            pStatus.innerText = "正确答案: " + qWords[index][1];
                            tryCount = 0;
                            shouldGoNext = true;
                        }
                    } else {
                        score++;
                        tryCount = 0;
                        pStatus.innerText = "";
                        loadQuestion();
                    }
                    pScore.innerText = "分数: " + score + "/" + times + ",   正确率: " + (score / times * 100).toFixed(2) + "%";
                }
            });
            divWordList.appendChild(p);
        }
    }

    function randomFrom(lowerValue, upperValue) {
        return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
    }
})();
