const fs = require('fs');
const path = require('path');
const os = require('os');

//Downloads papkasining yo'lini topamiz
const downloads_yoli = path.join(os.homedir(), 'Downloads');

function papkaniTahlilQilish(papkaYoli) {
    const musurKengaytmalar = ['.tmp', '.log', '.bag', '.old', '.cashe'];
    let barchaFayllar = [];
    let musurFayllarSoni = 0;
    let xatolarSoni = 0;

    function ichiniAylanibChiq(joriyYol) {
        try {
            const elementlar = fs.readdirSync(joriyYol);

            for (const element of elementlar) {
                const toliqYol = path.join(joriyYol, element);

                try {
                    const statistika = fs.statSync(toliqYol);

                    if (statistika.isDirectory()) {
                        // Agar ichki papka bo'lsa rekursive kiramiz
                        ichiniAylanibChiq(toliqYol);
                    }
                    else if (statistika.isFile()) {
                        const kengaytma = path.extname(element).toLowerCase();
                        barchaFayllar.push({
                            nom: element,
                            hajm: statistika.size,
                            yol: toliqYol,
                            kengaytma: kengaytma
                        });
                        // Agar musur kengaytmalariga mos kelsa, sanagichni oshiramiz
                        if (musurKengaytmalar.includes(kengaytma)) {
                            musurFayllarSoni++;
                        }
                    }
                }
                catch (ichkiXato) {
                    // Ayrim fayllar ochilmasa, shunchaki sanab o'tamiz
                    xatolarSoni++;
                }

            }
        }
        catch (asosiyXato) {
            xatolarSoni++;
        }
    }
    console.log(`\n⌛ Tahlil boshlandi: ${papkaYoli} ...`);
    ichiniAylanibChiq(papkaYoli);

    // hajm bo'yicha kamayish tartibida saralaymiz
    barchaFayllar.sort((a, b) => b.hajm - a.hajm);

    console.log(`\n--- Natijalar ---`);
    console.log(`Jami topilgan fayllar soni: ${barchaFayllar.length} ta`);
    console.log(`Topilgan keraksiz(musur) fayllar soni: ${musurFayllarSoni} ta`);
    console.log(`O'tkazib yuborilgan fayllar (ruxsat yuq) soni: ${xatolarSoni} ta\n`);

    if (barchaFayllar.length > 0) {
        console.log(`Downloads dagi eng katta TOP-5 fayl:`);
        barchaFayllar.slice(0, 5).forEach((fayl, indeks) => {
            let hajmMatni;
            if (fayl.hajm >= (1024 * 1024 * 1024)) {
                hajmMatni = (fayl.hajm / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
            }
            else if (fayl.hajm >= 1024 * 1024) {
                hajmMatni = (fayl.hajm / (1024 * 1024)).toFixed(2) + ' MB';
            }
            else if (fayl.hajm >= 1024) {
                hajmMatni = (fayl.hajm / 1024).toFixed(2) + ' KB';
            }
            else {
                hajmMatni = fayl.hajm + ' bayt';
            }

            console.log(`${indeks + 1}. ${fayl.nom} - ${hajmMatni}`);
            console.log(`  └─ Yo'li: ${fayl.yol}`);

        });
    }
    else{
        console.log(`⚠️ Fayllar topilmadi. Yo'lni to'g'riligini tekshiramiz.`);
    }
}

papkaniTahlilQilish(downloads_yoli);
