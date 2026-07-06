`layout [
`html { lang="en" } [
    `head [
        `meta { charset="UTF-8" }
        `meta { name="viewport" content="width=device-width, initial-scale=1.0" }
        `title [ Bhagavad Gita (Vyasa) ]
        `link { href="https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" }
        `style [
            body {
                font-family: 'Noto Serif', serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 2rem;
                line-height: 1.6;
                color: #333;
                background-color: #fdfdfd;
            }
            .entity-header {
                font-weight: bold;
                color: #2c3e50;
                font-size: 1.1rem;
                margin-right: 0.5rem;
            }
            .uvacha-label {
                color: #7f8c8d;
                font-style: italic;
                display: inline;
                margin-left: 0.25rem;
            }
            .verse-content {
                text-align: center;
                margin: 1.5rem 0 2rem;
            }
            .mula {
                font-family: 'Noto Sans Devanagari', sans-serif;
                font-size: 1.4rem;
                margin-bottom: 0.75rem;
                font-weight: 500;
                white-space: pre-line;
            }
            .iast {
                font-family: 'Noto Serif', serif;
                font-style: italic;
                color: #555;
                font-size: 1.1rem;
                white-space: pre-line;
            }
        ]
    ]
    `body [
        `div { class="content" } [
            {{ body }}
        ]
    ]
]
]

`item [
`div { class="verse-content" } [
    `div { class="verse-block" } [
        `div { class="verse-header" } [ {{ chapter }}:{{ verse }} ]
        `div { class="mula" } [ `stream { ref="mula_devanagari" } ]
        `div { class="iast" } [ `stream { ref="mula_iast" } ]
    ]
]
]
