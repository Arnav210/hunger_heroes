---
layout: post
title: Training Hub
nav: true
search_exclude: true
permalink: /training-hub/
---

<style>
	.training-hub-page {
		--training-ink: #17324d;
		--training-slate: #4f6476;
		--training-line: rgba(23, 50, 77, 0.14);
		--training-surface: linear-gradient(180deg, #f7fbff 0%, #eef6fb 100%);
		--training-card: #ffffff;
		--training-accent: #c65f2b;
		--training-accent-soft: rgba(198, 95, 43, 0.12);
		display: grid;
		gap: 2rem;
		margin: 1.5rem 0 3rem;
	}

	.training-hub-page section {
		background: var(--training-card);
		border: 1px solid var(--training-line);
		border-radius: 24px;
		box-shadow: 0 18px 45px rgba(19, 42, 65, 0.08);
		overflow: hidden;
	}

	.training-hub-hero {
		background: var(--training-surface);
		padding: 2.5rem;
	}

	.training-hub-hero__eyebrow {
		color: var(--training-accent);
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		margin: 0 0 0.75rem;
		text-transform: uppercase;
	}

	.training-hub-hero h1,
	.training-hub-section__header h2,
	.training-hub-card h3 {
		color: var(--training-ink);
		margin: 0;
	}

	.training-hub-hero h1 {
		font-size: clamp(2rem, 4vw, 3.2rem);
		line-height: 1.05;
		margin-bottom: 1rem;
	}

	.training-hub-hero p,
	.training-hub-section__header p,
	.training-hub-card p,
	.training-hub-embed__meta,
	.training-hub-quiz__list li,
	.training-hub-game__status {
		color: var(--training-slate);
	}

	.training-hub-hero p {
		font-size: 1.05rem;
		margin: 0;
		max-width: 46rem;
	}

	.training-hub-section {
		padding: 2rem;
	}

	.training-hub-section__header {
		margin-bottom: 1.5rem;
	}

	.training-hub-section__header h2 {
		font-size: 1.55rem;
		margin-bottom: 0.5rem;
	}

	.training-hub-grid {
		display: grid;
		gap: 1.25rem;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	}

	.training-hub-card {
		background: linear-gradient(180deg, #ffffff 0%, #f8fbfd 100%);
		border: 1px solid var(--training-line);
		border-radius: 20px;
		padding: 1.25rem;
	}

	.training-hub-card__tag {
		background: var(--training-accent-soft);
		border-radius: 999px;
		color: var(--training-accent);
		display: inline-flex;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		margin-bottom: 1rem;
		padding: 0.35rem 0.7rem;
		text-transform: uppercase;
	}

	.training-hub-card h3 {
		font-size: 1.15rem;
		margin-bottom: 0.5rem;
	}

	.training-hub-card p {
		margin: 0 0 1rem;
	}

	.training-hub-embed {
		align-items: center;
		background: repeating-linear-gradient(
			-45deg,
			rgba(23, 50, 77, 0.04),
			rgba(23, 50, 77, 0.04) 14px,
			rgba(23, 50, 77, 0.08) 14px,
			rgba(23, 50, 77, 0.08) 28px
		);
		border: 1px dashed rgba(23, 50, 77, 0.24);
		border-radius: 16px;
		display: grid;
		min-height: 210px;
		padding: 1rem;
		place-items: center;
		text-align: center;
	}

	.training-hub-embed strong {
		color: var(--training-ink);
		display: block;
		font-size: 1rem;
		margin-bottom: 0.35rem;
	}

	.training-hub-embed__meta {
		font-size: 0.92rem;
		line-height: 1.5;
		margin: 0;
		max-width: 14rem;
	}

	.training-hub-lower {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	}

	.training-hub-quiz,
	.training-hub-game {
		border: 1px solid var(--training-line);
		border-radius: 20px;
		padding: 1.5rem;
	}

	.training-hub-quiz {
		background: linear-gradient(180deg, #fff7ed 0%, #fffdf8 100%);
	}

	.training-hub-game {
		background: linear-gradient(180deg, #edf8f2 0%, #fbfffd 100%);
	}

	.training-hub-quiz__list {
		margin: 1rem 0 0;
		padding-left: 1.1rem;
	}

	.training-hub-quiz__list li + li {
		margin-top: 0.55rem;
	}

	.training-hub-game__shell {
		align-items: center;
		background: rgba(28, 125, 84, 0.08);
		border: 1px dashed rgba(28, 125, 84, 0.28);
		border-radius: 18px;
		display: grid;
		margin-top: 1rem;
		min-height: 220px;
		padding: 1rem;
		place-items: center;
		text-align: center;
	}

	.training-hub-game__shell strong {
		color: var(--training-ink);
		display: block;
		font-size: 1.02rem;
		margin-bottom: 0.4rem;
	}

	.training-hub-game__status {
		font-size: 0.95rem;
		margin: 0;
		max-width: 16rem;
	}

	@media (max-width: 640px) {
		.training-hub-hero,
		.training-hub-section {
			padding: 1.5rem;
		}
	}
</style>

<div class="training-hub-page">
	<section class="training-hub-hero">
		<p class="training-hub-hero__eyebrow">Training Hub</p>
		<h1>Volunteer training materials, checklists, and interactive practice in one place.</h1>
		<p>
			This page is set up as the base layout for future training resources. The handbook and checklist
			areas are ready for file embeds, the quiz area is reserved for knowledge checks, and the game area
			is prepared for the Training Hub project experience.
		</p>
	</section>

	<section class="training-hub-section">
		<div class="training-hub-section__header">
			<h2>Training Resources</h2>
			<p>Three dedicated embed slots are ready for your handbook and checklist files.</p>
		</div>

		<div class="training-hub-grid">
			<article class="training-hub-card">
				<div class="training-hub-card__tag">Embed Slot 01</div>
				<h3>Food Safety Handbook</h3>
				<p>Reserve this area for a PDF, Google Drive viewer, or another handbook embed.</p>
				<div class="training-hub-embed" data-embed-slot="food-safety-handbook">
					<div>
						<strong>Future handbook embed</strong>
						<p class="training-hub-embed__meta">Replace this container with the handbook viewer when the file is ready.</p>
					</div>
				</div>
			</article>

			<article class="training-hub-card">
				<div class="training-hub-card__tag">Embed Slot 02</div>
				<h3>Donor Checklist</h3>
				<p>Use this section for the donor-facing preparation checklist and related quick reference material.</p>
				<div class="training-hub-embed" data-embed-slot="donor-checklist">
					<div>
						<strong>Future donor embed</strong>
						<p class="training-hub-embed__meta">This panel is ready for an embedded checklist document or form.</p>
					</div>
				</div>
			</article>

			<article class="training-hub-card">
				<div class="training-hub-card__tag">Embed Slot 03</div>
				<h3>Receiver Checklist</h3>
				<p>Keep receiver-side intake steps here so volunteers can review the workflow before shifts.</p>
				<div class="training-hub-embed" data-embed-slot="receiver-checklist">
					<div>
						<strong>Future receiver embed</strong>
						<p class="training-hub-embed__meta">Swap in the final checklist embed once that file is available.</p>
					</div>
				</div>
			</article>
		</div>
	</section>

	<section class="training-hub-section">
		<div class="training-hub-section__header">
			<h2>Practice and Assessment</h2>
			<p>This area separates future quiz content from the interactive training game.</p>
		</div>

		<div class="training-hub-lower">
			<article class="training-hub-quiz">
				<h3>Training Quiz</h3>
				<p>
					This section is reserved for a future quiz or checkpoint experience once the questions and scoring
					flow are finalized.
				</p>
				<ul class="training-hub-quiz__list">
					<li>Title area is in place for a future quiz module.</li>
					<li>Space is reserved for instructions, score feedback, or completion messaging.</li>
					<li>The final embed, form, or script can be mounted here later.</li>
				</ul>
			</article>

			<article class="training-hub-game">
				<h3>Training Game</h3>
				<p>
					This section is reserved for the interactive training game sourced from the Training Hub project in
					<code>_projects/training-hub/training-game</code>.
				</p>
				<div class="training-hub-game__shell" id="training-game-root">
					<div>
						<strong>Game mount point ready</strong>
						<p class="training-hub-game__status">Connect the training game here when its published page or embed target is available.</p>
					</div>
				</div>
			</article>
		</div>
	</section>
</div>

