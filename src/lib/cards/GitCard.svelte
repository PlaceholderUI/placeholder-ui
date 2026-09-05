<script lang="ts">
	import mailSvg from '$lib/icon/mail.svg?raw';
	import messageCircleSvg from '$lib/icon/message-circle.svg?raw';
	import userSearchSvg from '$lib/icon/user-search.svg?raw';
	import type { GitEmployee } from '$lib/models/Employee.js';
	import ActionIcon from '$lib/ui/ActionIcon.svelte';

	export interface GitCardProps {
		/** Employee data object */
		git: GitEmployee;
		/** URL for the employee's profile image */
		imgSrc: string;
		/**
		 * Builds the link for the "profile" action from the employee, e.g.
		 * `(e) => \`https://people.example.com/${e.emplid}\``. The action is hidden when omitted.
		 */
		profileHref?: (employee: GitEmployee) => string;
		/**
		 * Builds the link for the "chat" action, e.g. an MS Teams deep link
		 * `(e) => \`MSTeams:/l/chat/0/0?users=${e.upn}\``. The action is hidden when omitted.
		 */
		chatHref?: (employee: GitEmployee) => string;
		/** Builds the link for the "email" action. Defaults to `mailto:` the employee's UPN. */
		emailHref?: (employee: GitEmployee) => string;
	}

	let {
		git,
		imgSrc,
		profileHref = undefined,
		chatHref = undefined,
		emailHref = (e) => `mailto:${e.upn}`
	}: GitCardProps = $props();
</script>

<div class="git-container">
	<div class="git-image">
		<img src={imgSrc} alt="" />
	</div>
	<div class="git-info">
		<div>
			<div class="git-name">{git.fullName}</div>
			<div class="git-jobtitle" title={git.jobTitle}>{git.jobTitle}</div>
		</div>
		<div class="icons">
			{#if chatHref}
				<ActionIcon variant="tertiary-subtle" href={chatHref(git)} svg={messageCircleSvg} />
			{/if}
			<ActionIcon variant="tertiary-subtle" href={emailHref(git)} svg={mailSvg} />
			{#if profileHref}
				<ActionIcon variant="tertiary-subtle" href={profileHref(git)} svg={userSearchSvg} />
			{/if}
		</div>
	</div>
</div>

<style>
	.git-container {
		display: flex;
		border-top-left-radius: 3rem;
		overflow: hidden;
		width: 375px;
	}

	.git-image {
		width: 96px;
		flex: 0 0 96px;
		height: 96px;
	}

	.git-info {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		justify-content: space-between;
		padding: 0.25rem 0.5rem;
		width: 100%;
		border: 1px solid rgb(222, 226, 230);
		border-left: none;
	}

	.git-name {
		font-size: 1.25rem;
		font-style: normal;
		font-weight: 600;
		color: var(--ui-primary);
	}

	.git-jobtitle {
		font-size: 0.875rem;
		color: #4e4e4e;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.icons {
		display: flex;
	}

	:global(.dark) {
		.git-info {
			background: rgb(16, 17, 19);
			border: none;
		}

		.git-name {
			color: var(--text-color);
		}

		.git-jobtitle {
			color: lightgrey;
		}
	}
</style>
