---
slug: site-rebuild-plan
title: Rebuilding My Portfolio Site with a Better Publishing Workflow
date: 2026-04-19
updated: 2026-04-19
tags: Website, Workflow, Netlify
excerpt: Why I rebuilt my site around reusable templates and content collections.
draft: false
---
I am rebuilding my personal site so posting projects and writing blog posts is faster and more consistent.

## Why rebuild
- I wanted one source of truth for project and blog content.
- I wanted reusable layouts instead of repeating headers and footers.
- I wanted a cleaner Netlify deployment workflow with preview-friendly pages.

## What changed
I now keep entries as Markdown files with frontmatter metadata. A build script reads those files and generates static pages.

This means I can publish by creating a single Markdown file and deploying.
