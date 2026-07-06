# Yoga Vasihta text curation 
Publish to vyasa publication catalog in GH pages for viewer to pick up with no additional infra.
YV is one the largest works and we will work out defects for e2e publishiing by focussing on part-1 before expanding to all 4 parts with about 42K verses.

## Requirements
1. Souce documents are picked up from the archive distribution (currently almost 500 works), a large binary
2. When working on a text, the specific archive should be unzipped for processing, but we wont commit to our repo due to sheer size of some texts
3. The output of the pipeline is a vyasa workspace that is ready for further processing by vyasac.
4. The final output is a vyasa publication with muktabodha.org as publisher, made available via GH pages like the vyasa-samples repo.

### Raw data processing scripts
1. Every processing cycle should create audit reports that are committed along with the scripts. This is important since we dont plan to commit the processed files to git.
2. Should there be some grammar based processing as the source text seems to be machine generated after human curation? 
3. If it is purely regex based, need to factor in feedback loop from vyasa workspace editors about processing errors. A "patch script" after the main processing script must be maintained.

### Semantic annotations
1. There must be a way for agents and humans to "enrich" the processed files with semantic markup using an out of band process. It will likely be based on vyasa language principles - local urn, entity def etc.
2. Similar to the patch script, there must be a reliable way to "apply" these enrichments for subsequent versions (that may include additional edits or corrections) of the processed source text. 
3. YV in particular has layers of commentary, and will require multiple iterations to get the necessary frames properly defined and placed in the text.
4. A design document is required to define the principles by which the semantic enrichment occurs. The design should also include the expectations from raw data processing pre-req step(s) e.g. verses are correctly taged and placed in the right chapter, book container structure.






