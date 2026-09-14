`title [Yogavasistha]

`set settings {
    default_whitespace = "single"
    break_after = "।॥"
    event_header.subject_key = "speaker"
}

`command-def { name="note" category="content" }
`command-def { name="annotate" category="metadata" flexible_args="true" }
`command-def { name="frame" category="metadata" flexible_args="true" }
`command-def { name="uvaca" category="action" flexible_args="true" }

`alias-def { name="v" target="verse" }

// Primary narrative frame alias (used inside annotations/narrative.vy)
`alias-def { id="narrative.yv_primary" target="event" type="NarrativeFrame" }

// Speaker annotation markers (used in annotations/speakers.vy)
`alias-def { name="rama.uvaca", target="uvaca", params="speaker=rama, action=uvaca" }
`alias-def { name="vasistha.uvaca", target="uvaca", params="speaker=vasistha, action=uvaca" }
`alias-def { name="valmiki.uvaca", target="uvaca", params="speaker=valmiki, action=uvaca" }
`alias-def { name="agastya.uvaca", target="uvaca", params="speaker=agastya, action=uvaca" }
`alias-def { name="sutikshna.uvaca", target="uvaca", params="speaker=sutikshna, action=uvaca" }
`alias-def { name="agnivesya.uvaca", target="uvaca", params="speaker=agnivesya, action=uvaca" }
`alias-def { name="karunya.uvaca", target="uvaca", params="speaker=karunya, action=uvaca" }
`alias-def { name="suruci.uvaca", target="uvaca", params="speaker=suruci, action=uvaca" }
`alias-def { name="devaduta.uvaca", target="uvaca", params="speaker=devaduta, action=uvaca" }
`alias-def { name="indra.uvaca", target="uvaca", params="speaker=indra, action=uvaca" }
`alias-def { name="bhrgu.uvaca", target="uvaca", params="speaker=bhrgu, action=uvaca" }
