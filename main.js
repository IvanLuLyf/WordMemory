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

    if ('serviceWorker' in navigator) {
        let sw = '/sw.js';
        let scope = '/';
        if (location.href.indexOf('/WordMem/') !== -1) {
            sw = '/WordMem/sw.js';
            scope = '/WordMem/';
        }
        navigator.serviceWorker.register(sw, {scope: scope}).then(res => {
            console.log('ServiceWorker Init');
        }).catch(err => {
            console.log('ServiceWorker Failed')
        })
    }

    document.getElementById('btn_next').addEventListener('click', _ => {
        loadQuestion()
    });

    window.onload = function () {
        pQuestion.innerText = "加载中...";
        loadRecord();
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

    function loadRecord() {
        let record = JSON.parse(localStorage.getItem('record')) || {score: 0, times: 0};
        score = record.score;
        times = record.times;
        pScore.innerText = "分数: " + score + "/" + times + (times > 0 ? ",   正确率: " + (score / times * 100).toFixed(2) + "%" : '');
    }

    function loadQuestion() {
        let start = randomFrom(0, words.length - 6);
        let qWords = words.slice(start, start + 6);
        let index = randomFrom(0, 5);
        pQuestion.innerText = qWords[index][0];
        divWordList.innerHTML = "";
        pStatus.innerText = "";
        for (let i = 0; i < qWords.length; i++) {
            let word = qWords[i][1];
            let btn = document.createElement('button');
            btn.innerText = word;
            btn.classList.add('bcu', 'btn', 'block', 'outline', 'md', 'mint', 'word-item');
            btn.addEventListener('click', e => {
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
                    localStorage.setItem('record', JSON.stringify({score: score, times: times}));
                }
            });
            divWordList.appendChild(btn);
        }
    }

    function randomFrom(lowerValue, upperValue) {
        return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
    }
})();
