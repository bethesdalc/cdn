import { setData } from '@progress/kendo-angular-intl';
setData({
    name: "zh-Hant-MO",
    likelySubtags: {
        zh: "zh-Hans-CN"
    },
    identity: {
        language: "zh",
        script: "Hant",
        territory: "MO"
    },
    territory: "MO",
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
            nan: "非數值",
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
                "n%"
            ],
            groupSize: [
                3
            ]
        },
        currency: {
            patterns: [
                "$n"
            ],
            groupSize: [
                3
            ],
            "unitPattern-count-other": "n $"
        }
    }
});
