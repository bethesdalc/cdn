import { setData } from '@progress/kendo-angular-intl';
setData({
    name: "sv",
    likelySubtags: {
        sv: "sv-Latn-SE"
    },
    identity: {
        language: "sv"
    },
    territory: "SE",
    numbers: {
        symbols: {
            decimal: ",",
            group: " ",
            list: ";",
            percentSign: "%",
            plusSign: "+",
            minusSign: "−",
            exponential: "×10^",
            superscriptingExponent: "×",
            perMille: "‰",
            infinity: "∞",
            nan: "¤¤¤",
            timeSeparator: ":",
            "timeSeparator-alt-variant": "."
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
            "unitPattern-count-other": "n $"
        }
    }
});

