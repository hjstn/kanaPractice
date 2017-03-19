#!/usr/bin/env node

const
    readlineSync = require("readline-sync"),
    moment = require("moment");

const words = {
    kana: {
        hiragana: {
            Ø: { a: "あ", i: "い", u: "う", e: "え", o: "お", n: "ん" },
            k: { a: "か", i: "き", u: "く", e: "け", o: "こ" },
            s: { a: "さ", i: "し", u: "す", e: "せ", o: "そ" },
            t: { a: "た", i: "ち", u: "つ", e: "て", o: "と" },
            n: { a: "な", i: "に", u: "ぬ", e: "ね", o: "の" },
            h: { a: "は", i: "ひ", u: "ふ", e: "へ", o: "ほ" },
            m: { a: "ま", i: "み", u: "む", e: "め", o: "も" },
            y: { a: "や", u: "ゆ", o: "よ" },
            r: { a: "ら", i: "り", u: "る", e: "れ", o: "ろ" },
            w: { a: "わ", o: "を" },
            g: { a: "が", i: "ぎ", u: "ぐ", e: "げ", o: "ご" },
            z: { a: "ざ", i: "じ", u: "ず", e: "ぜ", o: "ぞ" },
            d: { a: "だ", i: "ぢ", u: "づ", e: "で", o: "ど" },
            b: { a: "ば", i: "び", u: "ぶ", e: "べ", o: "ぼ" },
            p: { a: "ぱ", i: "ぴ", u: "ぷ", e: "ぺ", o: "ぽ" },
            v: { u: "ゔ"}
        },
        katakana: {
            Ø: { a: "ア", i: "イ", u: "ウ", e: "エ", o: "オ", n: "ン" },
            k: { a: "カ", i: "キ", u: "ク", e: "ケ", o: "コ" },
            s: { a: "サ", i: "シ", u: "ス", e: "セ", o: "ソ" },
            t: { a: "タ", i: "チ", u: "ツ", e: "テ", o: "ト" },
            n: { a: "ナ", i: "ニ", u: "ヌ", e: "ネ", o: "ノ" },
            h: { a: "ハ", i: "ヒ", u: "フ", e: "ヘ", o: "ホ" },
            m: { a: "マ", i: "ミ", u: "ム", e: "メ", o: "モ" },
            y: { a: "ヤ", u: "ユ", o: "ヨ" },
            r: { a: "ラ", i: "リ", u: "ル", e: "レ", o: "ロ" },
            w: { a: "ワ", o: "ヲ" },
            g: { a: "ガ", i: "ギ", u: "グ", e: "ゲ", o: "ゴ" },
            z: { a: "ザ", i: "ジ", u: "ズ", e: "ゼ", o: "ゾ" },
            d: { a: "ダ", i: "ヂ", u: "ヅ", e: "デ", o: "ド" },
            b: { a: "バ", i: "ビ", u: "ブ", e: "ベ", o: "ボ" },
            p: { a: "パ", i: "ピ", u: "プ", e: "ペ", o: "ポ" },
        }
    },
    alt: {
        si: "shi",
        ti: "chi",
        tu: "tsu",
        hu: "fu",
        zi: "ji",
        di: "ji",
        du: "zu"
    }
};

const
    practiceKana = readlineSync.question(`Kana (${Object.keys(words.kana).join(", ")}): `),
    practiceRange = readlineSync.question(`Number of rows (${Object.keys(words.kana[practiceKana]).map((column, index) => `${index + 1}: ${column}`).join(", ")}): `),
    practiceColumns = Object.keys(words.kana[practiceKana]).splice(0, practiceRange);

let correct = 0, incorrect = {}, time = 0, total = 0, input;

do {
    console.log("\033c");

    const
        startTime = new Date().getTime();

        column = randomRange(practiceRange - 1),
        practiceColumn = words.kana[practiceKana][practiceColumns[column]],
        practiceColumnKeys = Object.keys(practiceColumn),

        letter = randomRange(practiceColumnKeys.length - 1),
        practiceLetter = practiceColumn[practiceColumnKeys[letter]],
        practiceSound = removeSound(practiceColumns[column] + practiceColumnKeys[letter]);

    input = readlineSync.question(`(${total + 1}) ${practiceLetter}: `).toLowerCase().trim();

    if(input === "done") {
        const timeDate = new Date(time);
        console.log(`You got ${correct} out of ${total} correct in ${moment.utc(time).format("mm:ss")}!`);
        console.log(`Your average time for each question is ${moment.utc(time / total).format("mm:ss.SSSS")}.`);
        if(correct < total)
            console.log(`You made mistakes in:\n${Object.keys(incorrect).sort((a, b) => incorrect[b] - incorrect[a]).map(v => {
                let sound = "";
                practiceColumns.map((column) => {
                    const
                        thisColumn = words.kana[practiceKana][column],
                        row = Object.keys(thisColumn).find((row) => {
                            return thisColumn[row] === v;
                        });
                    if(row) sound = removeSound(column + row);
                    return column;
                });

                return `${v} (${allSound(sound)}): ${incorrect[v]}`;
            }).join("\n")}`);
        return;
    };

    total++;

    if(input === practiceSound || input === words.alt[practiceSound]) correct++;
    else {
        console.log(`Wrong (${allSound(practiceSound)})`);
        if(!incorrect[practiceLetter]) incorrect[practiceLetter] = 0;
        incorrect[practiceLetter]++;
    }

    time += new Date().getTime() - startTime;

    readlineSync.question();
} while(true);

function allSound(sound) {
    return sound + (words.alt[sound] ? "/" + words.alt[sound] : "");
}

function removeSound(input) {
    return input.replace("Ø", "");
}

function randomRange(max, min = 0) {
    min = Math.ceil(min);
    return Math.floor(Math.random() * (Math.floor(max + 1) - min)) + min;
}