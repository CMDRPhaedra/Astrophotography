---
layout: default
title: Anchor — Support
permalink: /anchor/support/
description: "Help for Anchor, the macOS menu bar app that keeps desktop icons where you put them."
---

<div class="blog-label">Anchor for macOS</div>
<h1 style="font-size:clamp(1.8rem,4vw,2.6rem);font-weight:300;margin-bottom:0.8rem;">Support</h1>
<p style="font-family:'Inconsolata',monospace;font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--dim);margin-bottom:2.5rem;">Keeping desktop icons where you put them</p>

<div class="anchor-body" markdown="1">

Anchor keeps the icons on your Mac's desktop where you put them. When macOS
rearranges them — after connecting a display, changing resolution, or
undocking — Anchor puts them back.

**Questions, problems or suggestions: [support@chryse.co.uk](mailto:support@chryse.co.uk)**

I read everything sent there. If you are reporting a problem, it helps to know
which version of macOS you are on and what your display setup is.

### Why does Anchor need permission to control Finder?

Desktop icon positions belong to Finder rather than to the files themselves,
and macOS provides no other way to read or change them. Anchor uses that
permission only to ask Finder where your icons are and to tell it where to put
them back. It does not read the contents of your files, and it does not move,
copy, rename or delete anything.

If you decline, Anchor tells you what it cannot do and offers a link to the
right settings pane. Granting it later takes effect immediately, with no
restart.

### I changed resolution and nothing happened

A saved layout belongs to one display arrangement. Your laptop screen, your
docked setup and a projector each keep their own, because the same coordinates
mean different things on different screens.

If you have not saved a layout for the arrangement you have just switched to,
Anchor has nothing to restore and correctly does nothing. The menu bar icon
shows a question mark to say so. Arrange the icons how you want them, choose
**Save Current Layout**, and that arrangement is covered from then on.

### I moved an icon myself and Anchor moved it back

That is the manual-move policy, and it is yours to choose in Settings:

- **Update the saved layout** — your move becomes the new saved position
- **Move them back** — the saved layout always wins
- **Ask** — a notification with *Keep* and *Move Back*

Icons that move immediately after a display change are always treated as macOS
rearranging things, whatever the policy, because that is the case the app
exists for.

### I renamed a file and it kept its position

Intended. Anchor tracks files by identity rather than by name, so renaming does
not lose the spot you arranged. The same applies to drives: an external disk or
network share that reconnects under a different name keeps its position, and a
drive left unplugged keeps its place reserved for 30 days.

### Anchor is not doing anything

Check the menu bar icon:

- **Filled pin** — locked and watching
- **Outline pin** — unlocked; turn on *Lock Icons in Place*
- **Question mark** — locked, but no layout is saved for this display arrangement
- **Slashed pin** — Anchor does not have permission to control Finder

### Where is my data stored?

In `~/Library/Application Support/Anchor`, on your Mac only. Nothing is sent
anywhere — see the [privacy policy](/anchor/privacy/).

</div>

<style>
  .anchor-body h3 { font-size: 1.45rem; font-weight: 400; margin: 2.6rem 0 0.8rem; }
  .anchor-body p, .anchor-body ul { margin-bottom: 1.2rem; }
  .anchor-body ul { padding-left: 1.4rem; }
  .anchor-body li { margin-bottom: 0.5rem; }
  .anchor-body a { color: var(--accent); }
</style>
