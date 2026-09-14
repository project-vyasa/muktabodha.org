// Craft reading view — Devanāgarī block then IAST block; hairline divider only (no captions).
// CSS: templates/html/reading.css

`layout [
{{ body }}
]

`item [
`div { class="verse-content" } [
    `div { class="script-block devanagari-block" } [
        `div { class="mula" } [`stream { ref="mula_devanagari" }]
        `div { class="mula commentary" } [`stream { ref="commentary_devanagari" }]
    ]
    `div { class="script-block iast-block" } [
        `div { class="script-hairline" } []
        `div { class="iast" } [`stream { ref="mula_iast" }]
        `div { class="iast commentary" } [`stream { ref="commentary_iast" }]
    ]
]
]
