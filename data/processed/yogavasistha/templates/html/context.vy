// Semantic HTML Templates

`mula [
`div { class="mula" style="white-space: pre-line;" } [$.body]
]

`iast [
`div { class="iast" style="white-space: pre-line;" } [$.body]
]

`devanagari [
`div { class="devanagari" style="white-space: pre-line;" } [$.body]
]

`v [
`div { class="verse" style="white-space: pre-line; margin-bottom: 1.5rem;" } [
  `strong { style="display: block; color: #64748b; font-size: 0.9em; margin-bottom: 0.25rem;" } [Verse $.argument]
  $.body
]
]

// Formatting helpers
`ref [ `a { href="$.argument" } [$.body] ]
`e1 [ `strong [$.body] ]
`e2 [ `em [$.body] ]

// Invisible Speaker Metadata Markers (with debug class)
`dhritarashtra [ `span { class="vyasa-debug-marker" "data-entity"="dhritarashtra" } [] ]
`sanjaya [ `span { class="vyasa-debug-marker" "data-entity"="sanjaya" } [] ]
`arjuna [ `span { class="vyasa-debug-marker" "data-entity"="arjuna" } [] ]
`krishna [ `span { class="vyasa-debug-marker" "data-entity"="krishna" } [] ]
`uvaca [ `span { class="vyasa-debug-marker" "data-action"="uvaca" } [] ]
