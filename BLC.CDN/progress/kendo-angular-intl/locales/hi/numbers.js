import { setData } from '@progress/kendo-angular-intl';
setData({
    name: "hi",
    likelySubtags: {
        hi: "hi-Deva-IN"
    },
    identity: {
        language: "hi"
    },
    territory: "IN",
    numbers: {
        symbols: {
            decimal: ".",
            group: ",",
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
                3,
                2
            ]
        },
        scientific: {
            patterns: [
                "[nEn]"
            ],
            groupSize: []
        },
        percent: {
            patterns: [
                "n%"
            ],
            groupSize: [
                3,
                2
            ]
        },
        currency: {
            patterns: [
                "$n"
            ],
            groupSize: [
                3,
                2
            ],
            "unitPattern-count-one": "n $",
            "unitPattern-count-other": "n $"
        }
    }
});

