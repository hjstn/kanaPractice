#!/usr/bin/env node
/* eslint-disable no-octal-escape */


const
    readlineSync = require("readline-sync"),
    moment = require("moment");

const words = {
    kana: {
        hiragana: {
            Ø: { a: "あ", i: "い", u: "う", e: "え", o: "お", n: "ん" },
            k: { a: "か", i: "き", u: "く", e: "け", o: "こ", ya: "きゃ", yu: "きゅ", yo: "きょ" },
            s: { a: "さ", i: "し", u: "す", e: "せ", o: "そ", ya: "しゃ", yu: "しゅ", yo: "しょ" },
            t: { a: "た", i: "ち", u: "つ", e: "て", o: "と", ya: "ちゃ", yu: "ちゅ", yo: "ちょ" },
            n: { a: "な", i: "に", u: "ぬ", e: "ね", o: "の", ya: "にゃ", yu: "にゅ", yo: "にょ" },
            h: { a: "は", i: "ひ", u: "ふ", e: "へ", o: "ほ", ya: "ひゃ", yu: "ヒュ", yo: "ひょ" },
            m: { a: "ま", i: "み", u: "む", e: "め", o: "も", ya: "みゃ", yu: "みゅ", yo: "みょ" },
            y: { a: "や", u: "ゆ", o: "よ" },
            r: { a: "ら", i: "り", u: "る", e: "れ", o: "ろ", ya: "りゃ", yu: "りゅ", yo: "りょ" },
            w: { a: "わ", o: "を" },
            g: { a: "が", i: "ぎ", u: "ぐ", e: "げ", o: "ご", ya: "ぎゃ", yu: "ぎゅ", yo: "ぎょ" },
            z: { a: "ざ", i: "じ", u: "ず", e: "ぜ", o: "ぞ", ya: "じゃ", yu: "じゅ", yo: "じょ" },
            d: { a: "だ", i: "ぢ", u: "づ", e: "で", o: "ど" },
            b: { a: "ば", i: "び", u: "ぶ", e: "べ", o: "ぼ", ya: "びゃ", yu: "びゅ", yo: "びょ" },
            p: { a: "ぱ", i: "ぴ", u: "ぷ", e: "ぺ", o: "ぽ", ya: "ぴゃ", yu: "ピュ", yo: "ぴょ" },
            v: { u: "ゔ"}
        },
        katakana: {
            Ø: { a: "ア", i: "イ", u: "ウ", e: "エ", o: "オ", n: "ン" },
            k: { a: "カ", i: "キ", u: "ク", e: "ケ", o: "コ", ya: "キャ", yu: "キュ", yo: "キョ" },
            s: { a: "サ", i: "シ", u: "ス", e: "セ", o: "ソ", ya: "シャ", yu: "シュ", yo: "ショ" },
            t: { a: "タ", i: "チ", u: "ツ", e: "テ", o: "ト", ya: "チャ", yu: "チュ", yo: "チョ" },
            n: { a: "ナ", i: "ニ", u: "ヌ", e: "ネ", o: "ノ", ya: "ニャ", yu: "ニュ", yo: "ニョ" },
            h: { a: "ハ", i: "ヒ", u: "フ", e: "ヘ", o: "ホ", ya: "ヒャ", yu: "ヒュ", yo: "ヒョ" },
            m: { a: "マ", i: "ミ", u: "ム", e: "メ", o: "モ", ya: "ミャ", yu: "ミュ", yo: "ミョ" },
            y: { a: "ヤ", u: "ユ", o: "ヨ" },
            r: { a: "ラ", i: "リ", u: "ル", e: "レ", o: "ロ", ya: "リャ", yu: "リュ", yo: "リョ" },
            w: { a: "ワ", o: "ヲ" },
            g: { a: "ガ", i: "ギ", u: "グ", e: "ゲ", o: "ゴ", ya: "ギャ", yu: "ギュ", yo: "ギョ" },
            z: { a: "ザ", i: "ジ", u: "ズ", e: "ゼ", o: "ゾ", ya: "ジャ", yu: "ジュ", yo: "ジョ" },
            d: { a: "ダ", i: "ヂ", u: "ヅ", e: "デ", o: "ド" },
            b: { a: "バ", i: "ビ", u: "ブ", e: "ベ", o: "ボ", ya: "ビャ", yu: "ビュ", yo: "ビョ" },
            p: { a: "パ", i: "ピ", u: "プ", e: "ペ", o: "ポ", ya: "ピャ", yu: "ピュ", yo: "ピョ" }
        }
    },
    alt: {
        n: ["n", "nn"],
        si: ["shi"],
        ti: ["chi"],
        tu: ["tsu"],
        hu: ["fu"],
        zi: ["ji"],
        di: ["ji"],
        du: ["zu"],
        sya: ["sha"],
        syu: ["shu"],
        syo: ["sho"],
        tya: ["cha"],
        tyu: ["chu"],
        tyo: ["cho"],
        zya: ["ja", "jya"],
        zyu: ["ju", "jyu"],
        zyo: ["jo", "jyo"]
    }
};

const
    practiceKana = readlineSync.question(`Kana (${Object.keys(words.kana).join(", ")}): `),
    practiceRange = readlineSync.question(`Number of rows (${Object.keys(words.kana[practiceKana]).map((column, index) => `${index + 1}: ${column}`).join(", ")}): `),
    showMistakes = readlineSync.question("Show mistakes? (true, false): ") === "true",
    lenientSpelling = readlineSync.question("Lenient spelling? (true, false): ") === "true",
    practiceColumns = Object.keys(words.kana[practiceKana]).splice(0, practiceRange);

let correct = 0, incorrect = {}, time = 0, total = 0, input;

for(;;) {
    console.log("\033c");

    const
        startTime = new Date().getTime(),

        column = randomRange(practiceRange - 1),
        practiceColumn = words.kana[practiceKana][practiceColumns[column]],
        practiceColumnKeys = Object.keys(practiceColumn),

        letter = randomRange(practiceColumnKeys.length - 1),
        practiceLetter = practiceColumn[practiceColumnKeys[letter]],
        practiceSound = removeSound(practiceColumns[column] + practiceColumnKeys[letter]);

    let stopTime;

    input = readlineSync.question(`(${total + 1}) ${practiceLetter}: `).toLowerCase().trim();

    if(input === "done") {
        const timeDate = new Date(time);
        console.log(`You got ${correct} out of ${total} correct in ${moment.utc(time).format("mm:ss")}!`);
        console.log(`Your average time for each question is ${moment.utc(time / total).format("mm:ss.SSSS")}.`);
        if(correct < total) {
            const mistakes = Object.keys(incorrect).sort((a, b) => incorrect[b] - incorrect[a]).map(letter => {
                let sound = "";
                practiceColumns.map((column) => {
                    const
                        thisColumn = words.kana[practiceKana][column],
                        row = Object.keys(thisColumn).find((row) => {
                            return thisColumn[row] === letter;
                        });
                    if(row) sound = removeSound(column + row);
                    return column;
                });

                const
                    incorrectLetter = incorrect[letter],
                    incorrectInputs = Object.keys(incorrect[letter]).map(incorrectInput => `${incorrectInput} (${incorrectLetter[incorrectInput]})`);

                return `${letter} (${allSound(sound)}): ${incorrectInputs.join(", ")}`;
            })
            .join("\n");

            console.log(`You made mistakes in:\n${mistakes}`);
        }
        return;
    }

    total++;

    const
        correctTitle = (!words.alt[practiceSound] || lenientSpelling) && input === practiceSound,
        correctAlt = words.alt[practiceSound] && words.alt[practiceSound].indexOf(input) > -1;
    if(correctTitle || correctAlt) {
        correct++;
    } else {
        if(!incorrect[practiceLetter]) incorrect[practiceLetter] = {};
        if(!incorrect[practiceLetter][input]) incorrect[practiceLetter][input] = 0;
        incorrect[practiceLetter][input]++;

        if(showMistakes) {
            console.log(`Wrong (${allSound(practiceSound)})`);
            stopTime = new Date().getTime();
            readlineSync.question();
        } else {
            stopTime = new Date().getTime();
        }
    }

    time += stopTime - startTime;
}

function allSound(sound) {
    const hasDefaultSound = lenientSpelling || !words.alt[sound];

    return hasDefaultSound ? sound : "" + (words.alt[sound] ? (hasDefaultSound ? "/" : "") + Object.keys(words.alt[sound]).join("/") : "");
}

function removeSound(input) {
    return input.replace("Ø", "");
}

function randomRange(max, min = 0) {
    min = Math.ceil(min);
    return Math.floor(Math.random() * (Math.floor(max + 1) - min)) + min;
}