import { setData } from '@progress/kendo-angular-intl';
setData({
    name: "bs-Latn",
    likelySubtags: {
        bs: "bs-Latn-BA"
    },
    identity: {
        language: "bs",
        script: "Latn"
    },
    territory: "BA",
    numbers: {
        symbols: {
            decimal: ",",
            group: ".",
            list: ";",
            percentSign: "%",
            plusSign: "+",
            minusSign: "-",
            exponential: "E",
            superscriptingExponent: "×",
            perMille: "‰",
            infinity: "∞",
            nan: "NaN",
            timeSeparator: ":"
        },
        decimal: {
            patterns: [
                "n"
            ],
            groupSize: [
                3
            ]
        },
        scientific: {
            patterns: [
                "nEn"
            ],
            groupSize: []
        },
        percent: {
            patterns: [
                "n %"
            ],
            groupSize: [
                3
            ]
        },
        currency: {
            patterns: [
                "n $"
            ],
            groupSize: [
                3
            ],
            "unitPattern-count-one": "n $",
            "unitPattern-count-few": "n $",
            "unitPattern-count-other": "n $"
        }
    }
});

