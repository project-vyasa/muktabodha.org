`layout [
`html { lang="en" } [
    `head [
        `meta { charset="UTF-8" }
        `meta { name="viewport" content="width=device-width, initial-scale=1.0" }
        `title [ Yogavasistha (Vyasa) ]
        `link { href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600&family=Noto+Serif:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" }
        `style [
            body {
                font-family: 'Noto Serif', serif;
                max-width: 1000px;
                margin: 0 auto;
                padding: 2rem;
                line-height: 1.6;
                color: #333;
                background-color: #fcfcfc;
            }
            .controls {
                position: sticky;
                top: 0;
                background: rgba(252, 252, 252, 0.95);
                padding: 1rem 0;
                border-bottom: 1px solid #ddd;
                margin-bottom: 2rem;
                display: flex;
                gap: 1rem;
                justify-content: center;
                z-index: 100;
            }
            button {
                padding: 0.5rem 1rem;
                border: 1px solid #ccc;
                background: #fff;
                border-radius: 4px;
                cursor: pointer;
                font-family: inherit;
                font-size: 0.9rem;
                transition: all 0.2s;
            }
            button:hover {
                background: #eee;
            }
            button.active {
                background: #2c3e50;
                color: #fff;
                border-color: #2c3e50;
            }
            .verse-content {
                margin-bottom: 4rem;
                border: 1px solid #eaeaea;
                border-radius: 8px;
                padding: 2rem;
                background: #fff;
                box-shadow: 0 4px 6px rgba(0,0,0,0.02);
            }
            .verse-header {
                text-align: center;
                font-weight: 600;
                font-size: 1.25rem;
                color: #2c3e50;
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid #f0f0f0;
            }
            .verse-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
            }
            .stream-box {
                padding: 1.5rem;
                background-color: #f9fbfd;
                border-radius: 6px;
                border: 1px solid #edf2f7;
            }
            .stream-label {
                font-size: 0.75rem;
                text-transform: uppercase;
                color: #95a5a6;
                margin-bottom: 1rem;
                letter-spacing: 0.05em;
                border-bottom: 1px dashed #cbd5e0;
                display: inline-block;
                padding-bottom: 0.25rem;
            }
            .stream-content {
                white-space: pre-line;
            }
            .mula-text { font-size: 1.15rem; color: #2d3748; }
            .comm-text { font-size: 0.95rem; color: #4a5568; }
            .iast-text { font-style: italic; }
            .deva-text { font-family: 'Noto Sans Devanagari', sans-serif; }
            
            /* Toggle states */
            body.hide-iast .col-iast { display: none; }
            body.hide-deva .col-deva { display: none; }
            body.hide-comm .row-comm { display: none; }
            
            body.hide-iast .verse-grid,
            body.hide-deva .verse-grid {
                grid-template-columns: 1fr;
            }
        ]
        `script [
            function toggleState(cls, btn) {
                document.body.classList.toggle(cls);
                btn.classList.toggle('active');
            }
        ]
    ]
    `body [
        `div { class="controls" } [
            `button { onclick="toggleState('hide-iast', this)" } [ Hide IAST ]
            `button { onclick="toggleState('hide-deva', this)" } [ Hide Devanagari ]
            `button { onclick="toggleState('hide-comm', this)" } [ Hide Commentary ]
        ]
        `div { class="content" } [
            {{ body }}
        ]
    ]
]
]

`item [
`div { class="verse-content" } [
    `div { class="verse-header" } [ Verse {{ chapter }}:{{ verse }} ]
    `div { class="verse-grid" } [
        `div { class="stream-box col-iast row-mula iast-text mula-text" } [
            `div { class="stream-label" } [ IAST Verse ]
            `div { class="stream-content" } [ `stream { ref="mula_iast" } ]
        ]
        `div { class="stream-box col-deva row-mula deva-text mula-text" } [
            `div { class="stream-label" } [ Devanagari Verse ]
            `div { class="stream-content" } [ `stream { ref="mula_devanagari" } ]
        ]
        `div { class="stream-box col-iast row-comm iast-text comm-text" } [
            `div { class="stream-label" } [ IAST Commentary ]
            `div { class="stream-content" } [ `stream { ref="commentary_iast" } ]
        ]
        `div { class="stream-box col-deva row-comm deva-text comm-text" } [
            `div { class="stream-label" } [ Devanagari Commentary ]
            `div { class="stream-content" } [ `stream { ref="commentary_devanagari" } ]
        ]
    ]
]
]
