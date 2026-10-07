# Mario Prignano's website

A small GitHub Pages site for projects and writing. Built with Jekyll 3.10.

## Preview locally

With Ruby and Bundler installed:

```sh
bundle install
bundle exec jekyll serve
```

Open http://127.0.0.1:4000. Local changes are published only when pushed to the GitHub Pages source branch.

## Write an article

Copy `post-template.txt` into `_posts/YYYY-MM-DD-title.md`, edit the front matter and write the article in Markdown. Set `published: true` when ready. Articles appear automatically on the homepage and at `/writing/`. Future dates stay hidden until that date.

The homepage lists published blog posts in date order. The author chooses which work to introduce and when to write about it. There are no example articles.

## Structure

- `index.html`: homepage.
- `writing.html`: article index.
- `_layouts/post.html`: article layout.
- `assets/site.css`: layout, typography and two color themes.
- `assets/site.js`: theme preference.

Inter Tight and Geist Mono are self-hosted. Their license notices are in `assets/fonts/`.

## Highlighted words

In the article title, article headings and blog list titles, Markdown bold uses a light background with dark text:

```yaml
title: "Un **accordo**, visto da vicino"
```

```markdown
## **Quattro note**
```

Regular body bold stays bold. To highlight words within a paragraph, use `<strong class="highlight">these words</strong>`.

## Mathematics

Posts render LaTeX formulas with MathJax. Jekyll's Markdown parser protects formulas written with double-dollar delimiters:

```markdown
Inline: $$e^{i\pi}+1=0$$.

$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$
```

Set `math: false` in a post's front matter to omit MathJax. The renderer is loaded from jsDelivr and needs an internet connection.

## Audio examples

Set `audio: true` in the post front matter and include `_includes/audio-player.html` with `name`, `bank`, `src`, `waveform` and `duration` in seconds. The player supports keyboard seeking, mute, one active track at a time and a native browser fallback. Waveform SVGs are computed from decoded audio peaks. No autoplay is used.

The Libero post is published with ten audio examples. Five additional local previews remain excluded from publication pending recording or composition rights review. They are rendered by `scripts/build-blog-audio.py` through `libero-render`, with the current compiled presets, MIDI velocity, pedal events and articulation keyswitches. The sound library is read without recompiling or editing it. The script applies a constant playback gain and computes each waveform from its rendered audio. Lossless WAVs, performance event lists and diagnostics stay in `preview/audio/`. Current screenshots use the latest GUI source with real metadata and figures from the pre-release staging library (75 presets, 11 banks). These are browser captures of the interface, not recordings of a host running the audio plugin. The earlier GIF and MP4 have been removed from the article and kept only in the ignored `preview/` directory.

### Rebuild the audio previews

Install `mido`, `numpy`, `scipy` and `soundfile` in a separate environment; make `ffmpeg` and `libero-render` available. Run:

```sh
python scripts/build-blog-audio.py --library /path/to/Libero/banks \
  --campanella /path/to/La-Campanella.mid \
  --nocturne /path/to/chopin-nocturne-maestro.mid
```

`--only pianet-t jazz-drums` renders selected examples. The remaining sequences and the Swan Lake stem arrangement are defined in the local script, which is excluded from this public repository because it contains uncleared cover transcriptions. The Campanella example retains the supplied timing, velocity and pedal events, with note holds extended to 145% of the recorded duration plus 105 ms, capped before the next attack of the same pitch.

The Felt Piano example uses an actual 2014 International Piano-e-Competition performance from [MAESTRO v3.0.0](https://magenta.withgoogle.com/datasets/maestro): *Nocturne in C-Sharp Minor, Op. Posth.*, file `2014/MIDI-UNPROCESSED_04-05_R1_2014_MID--AUDIO_05_R1_2014_wav--6.midi`. Original timing, key velocities and CC64 sustain events are retained; the excerpt runs from 0.9 to 54.45 seconds. The dataset is provided by Google LLC under CC BY-NC-SA 4.0; the rendered adaptation carries the same license. Credit: Curtis Hawthorne, Andriy Stasyuk, Adam Roberts, Ian Simon, Cheng-Zhi Anna Huang, Sander Dieleman, Erich Elsen, Jesse Engel and Douglas Eck, *Enabling Factorized Piano Music Modeling and Generation with the MAESTRO Dataset*, ICLR 2019. The source MIDI remains in the ignored preview directory.

The Aulos example transcribes the opening three-note phrase of Ludwig Göransson’s *Odysseus*, using Libero’s own sampled instrument. The reference recording is used only for transcription. A separate instance holds C4 continuously for 32.4 seconds, with the air layer reduced and a looped middle dynamics layer selected. The rendered cover remains in the ignored `preview/` directory for local review; publication rights have not been cleared. To show it locally after a preview build:

```sh
bundle exec jekyll build --unpublished
cp preview/audio/aulos.m4a _site/assets/libero/audio/aulos.m4a
cp preview/audio/toy-piano.m4a _site/assets/libero/audio/toy-piano.m4a
cp preview/audio/carillon.m4a _site/assets/libero/audio/carillon.m4a
cp preview/audio/felt-piano.m4a _site/assets/libero/audio/felt-piano.m4a
cp preview/audio/acoustic-guitar.m4a _site/assets/libero/audio/acoustic-guitar.m4a
```

The trailer example uses 130 notes over twelve bars at 124 BPM, with low drums, tom responses, wood ticks and sparse impacts. No cymbal keys are used. Separate stem levels balance the percussion before the final playback gain.

The viola example renders all five string lines separately through the same Violas instrument, entirely in tremolo at a fixed velocity of 68. Cello and sounding double-bass parts are raised by one and two octaves respectively into the viola register. Stem events and mix levels are saved in `preview/audio/violas-stems.json`.

Solo Cello II plays the first eight bars of Bach’s BWV 1007 Prelude using phrase timing and note loudness adapted from [John Michel’s recording](https://commons.wikimedia.org/wiki/File:JOHN_MICHEL_CELLO-J_S_BACH_CELLO_SUITE_1_in_G_Prelude.ogg). Score pitches come from Andreas Scherer’s public-domain Mutopia MIDI. Ordered alignment of harmonic pitch energy supplies bar boundaries; a smooth tempo curve between those boundaries restores the score’s regular sixteenth-note subdivisions. Per-note RMS supplies velocity, with no additional amplitude automation. Individual audio-extracted attacks were too irregular and are not used directly. This is an audio-derived MIDI reconstruction, not a native MIDI capture. A single 1.14 time scale slows the performance without randomizing its timing. No original recording audio is mixed into the demo. This adaptation is CC BY-SA 3.0, credited in the article; the underlying Libero instrument remains separately licensed CC0. Source recording, alignment intermediates and extracted events stay in ignored `preview/`.

To reconstruct the cello example, put `bach-cello-john-michel.ogg` and `bach-cello-prelude.mid` in `preview/`, then run `scripts/extract-cello-performance.py` with NumPy, SciPy, SoundFile and mido installed. It writes `preview/audio/bach-cello-performance-notes.json`, consumed by the renderer. The alignment is approximate: audio-to-MIDI reconstruction does not recover every bow gesture or timbral change.

The Swan Lake ensemble is a short nine-bar reduction: the oboe line and three tremolo string lines are transcribed separately, with a reduced harp part played on Folk Harp from Aria. Each part renders independently through Libero before the stereo mix. Individual stem WAVs and MIDI files stay in `preview/audio/`. Score reference: Tchaikovsky, *Swan Lake Suite*, Op.20a, [E. F. Gajewski’s CC0 edition](https://s9.imslp.org/files/imglnks/usimg/5/56/IMSLP917951-PMLP59697-Swan_Lake_Suite_Op20a.pdf).

For audio preview with reliable seeking, build the site and run `python3 scripts/serve-preview.py` at http://127.0.0.1:8781/. The preview server supports HTTP byte ranges; a plain Python HTTP server does not.

The Swan Lake listening preview uses Cappella reverb at 23% wet, 2.8 s decay and 18 ms predelay, with a six-second render tail. The oboe stem level is 0.34, about 1.1 dB above the previous 0.30 setting. Each instrument has a seeded timing offset within ±3 ms and each attack a further random offset within ±8 ms. Chord tones move together, note ends retain their score timing, and keyswitches remain at zero.

The Unusual Music Box example follows the original Memory recording’s note registers and rubato, slowing its timing by a factor of 1.06, with softer accompaniment and Cappella reverb (15% wet, 2.2 s decay).

The violin excerpt begins with four bars of the Sarabande’s upper melody alone, then restores the written chords. The Aulos phrase is 20% slower, with its melodic air layer at −4 dB and Cappella reverb at 13% wet / 1.1 s decay; its drone remains separate.

Swan Lake and the viola demo place every repeated-pitch release 4 ms before the next attack, preventing an older MIDI note-off from cutting the new note. The harp uses the same ordering.

Toy Piano plays the opening of Grieg’s *Waltz in A minor*, Op. 12 No. 2, from MAESTRO v3’s 2014 performance `2014/MIDI-UNPROCESSED_21-22_R1_2014_MID--AUDIO_21_R1_2014_wav--1.midi` (CC BY-NC-SA 4.0). The source is extracted from the verified MIDI archive into `preview/grieg-waltz-maestro.mid`. The excerpt (1.0–23.59 seconds) retains recorded timing, velocities, sustain pedal and original register. No tempo scaling, extra rubato or chord rolls are added. Unusual Music Box plays Yoko Kanno’s *Memory* from Cowboy Bebop. Its opening note attacks were transcribed by spectral comparison with the [official Seatbelts recording](https://www.youtube.com/watch?v=02f76-YsTBw), keeping the actual note registers and timing rather than the earlier 30-note mechanical-box adaptation. Source recording and inspection data stay in ignored `preview/`; note events are recorded in `carillon()`. The Music Box cover stays in ignored `preview/audio/`, alongside the private Aulos cover. Copy the preview files into the local draft build for listening; the Music Box and Aulos covers carry no open-license claim and their publication rights have not been cleared.

Volkstrautonium · Soft Register selects Giove’s existing Soft Register via keyswitch 13 and uses Cappella reverb at 22% wet / 2.8 s decay, with a five-second render tail. It plays with 65 ms legato glide; on long notes, CC1 rises from 0 to 86 after a 500 ms delay, then tapers before the next note. Vibrato runs at 5.2 Hz with a maximum CC1 depth of 24 cents. The CC events are saved in its MIDI and performance JSON.

The 2026-10-06 publication review keeps five demos in ignored `preview/audio/`:
`aulos`, `carillon`, `toy-piano`, `felt-piano`, and `acoustic-guitar`. Their players
are shown only while the article has `published: false`. For local listening after
a draft build, copy those M4A files to `_site/assets/libero/audio/`; do not deploy
that draft build. Their composition, performance or sample-source terms need
separate clearance before inclusion in a public article. See the Libero release
safety review for details.

The expanded 0.1.3 bundle contains every instrument used by the thirteen audio examples (87 presets in
14 collections overall). Five Strings retains GPL sample-data terms with editable
source and the original author's separate music-use permission. Mellotron MkII Strings and its demo are temporarily excluded pending recording and master-rights review. These instrument
permissions do not clear the compositions or MAESTRO performances in the four
remaining private demos.



The acoustic demo uses Sor Op. 35 No. 22, sequenced by Ray Izumi (Copyright 1996), from Guitarist.com. It preserves the sequence’s expressive tempo map and velocity; it is not a captured live performance and remains private pending publication permission. Crunch Electric Guitar plays GuitarSet’s `05_Rock1-90-C#_solo` blues improvisation. Timing and duration follow the per-string performance annotations; pitches are rounded to MIDI notes and sub-60 ms detections are omitted. Velocities are estimated from the microphone recording’s onset RMS and mapped to 54–90 and expanded to 40–114 for the demo. Three short phrase sections use palm mute; the remainder uses open notes. Same-pitch releases end before the next attack. The demo uses 14% chapel reverb with a 1.4-second decay and 20 ms predelay. Tape, echo and added drive remain disabled; the library preset is unchanged. Trailer Percussion uses a twelve-bar 124 BPM phrase, separately balanced low drums, toms, ticks and sparse impacts, with fills at phrase boundaries.

The Nylon demo starts 80 ms before its first MIDI note instead of retaining the source’s 5.29-second count-in. GuitarSet credits and source hashes are in `assets/libero/audio/crunch-guitar-source.json`; the rendered adaptation is CC BY 4.0.

## Analytics

GoatCounter at `paerle.goatcounter.com` counts page views. `assets/analytics.js` counts clicks on the four public Drive folders and the first successful playback of each audio example per page load. Event names contain no email addresses or URL query strings. Custom events are disabled on localhost, and an unavailable analytics script does not interrupt navigation or playback. There is no visible counter or widget.
