// Publisher theme shell — packed as theme_layout; not a selectable reading mode.
// Grid and publisher-crafted views inherit this wrapper via the viewer fallback chain.

`layout [
`html { lang="en" } [
    `head [
        `meta { charset="UTF-8" }
        `meta { name="viewport" content="width=device-width, initial-scale=1.0" }
        `title [ Yogavasistha (Vyasa) ]
        `link { href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" }
        `style [
            body {
                font-family: 'Noto Serif', serif;
                padding: 2rem;
                line-height: 1.6;
                color: #333;
                background-color: #fdfdfd;
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
            .devanagari {
                font-family: 'Noto Sans Devanagari', sans-serif;
                font-size: 1.25rem;
                text-align: center;
                color: #b22222;
                margin: 1.5rem 0;
                line-height: 1.8;
                white-space: pre-line;
            }
            .iast {
                font-family: 'Noto Serif', serif;
                font-style: italic;
                color: #555;
                font-size: 1.1rem;
                white-space: pre-line;
                display: block;
                margin-top: 1rem;
            }
            .iast .verse {
                display: inline;
            }
            .iast::after {
                content: " ॥ " attr(data-verse) " ॥";
                white-space: nowrap;
            }
            .verse {
                font-size: 1.1rem;
                text-align: center;
                margin: 1.5rem 0;
                line-height: 1.8;
                white-space: pre-line;
            }
            .verse-stack {
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }
            .stream-content {
                white-space: pre-line;
                overflow-wrap: break-word;
                word-break: break-word;
            }
            .label {
                font-size: 0.75rem;
                text-transform: uppercase;
                color: #95a5a6;
                margin-bottom: 1rem;
                letter-spacing: 0.05em;
                border-bottom: 1px dashed #cbd5e0;
                display: inline-block;
                padding-bottom: 0.25rem;
            }
            .mula-text { font-size: 1.15rem; color: #2d3748; }
            .comm-text { font-size: 0.95rem; color: #4a5568; }
            .iast-text { font-style: italic; }
            .deva-text { font-family: 'Noto Sans Devanagari', sans-serif; }
        ]
    ]
    `body [
        `div { class="content" } [
            {{ body }}
        ]
    ]
]
]
