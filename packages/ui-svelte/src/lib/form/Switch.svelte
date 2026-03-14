<script lang="ts">
    // Sourced from https://svelte.dev/playground/d65a4e9f0ae74d1eb1b08d13e428af32?version=5.36.16, and updated from there
	import FormGroup from './FormGroup.svelte';

	interface Props {
		label: string;
		required?: boolean;
		checked: boolean;
		disabled?: boolean;
		description?: string;
        containerClass?: string;
        switchClass?: string;
        onchange?: (value: boolean) => void;
        showError?: boolean;
	}

	let { label, required = false, checked = $bindable(), disabled = false, containerClass, switchClass, onchange, showError }: Props = $props();

    function handleClick(event: Event){
        const target = event.target as HTMLElement

        const state = target.getAttribute('aria-checked')

        checked = !(state === 'true')
        onchange?.(checked);
    }
</script>

<div class="switch-container {containerClass}">
	<FormGroup {required} {label}>
			<div class="s s--slider {switchClass} {required ? 'required' : ''}
		{showError ? 'error' : ''}
        {disabled ? 'disabled' : ''}">
				<button
					role="switch"
					aria-checked={checked}
					onclick={handleClick}
                    aria-labelledby="form-{label}"
                    class="{disabled ? 'disabled' : ''}"
                    {disabled}
				>
				</button>
			</div>
			<span class="slider"></span>
	</FormGroup>
</div>


<style>
    :root .switch-container {
		--switch-accent-color: var(--pui-color-primary);
		--switch-track-color: var(--pui-border-disabled);
	}

    :global(.dark) .switch-container {
        --switch-accent-color: var(--pui-color-primary);
        --switch-track-color: var(--pui-color-gray-600);
    }

	.disabled button {
		cursor: not-allowed;
	}


    /* Inner Design Option */
    .s--inner button {
        padding: var(--pui-spacing-2);
        background-color: var(--pui-color-white);
        border: 1px solid var(--switch-track-color);
    }

    .s--inner button:focus {
        outline: var(--pui-color-primary) solid 1px;
    }

    /* Slider Design Option */

    .s--slider {
        display: flex;
        align-items: center;
    }

    .s--slider button {
        width: 3em;
        height: 1.6em;
        position: relative;
        margin: 0 0 0 var(--pui-spacing-2);
        background: var(--switch-track-color);
        border: none;
    }

    .s--slider button::before {
        content: '';
        position: absolute;
        width: 1.3em;
        height: 1.3em;
        background: var(--pui-color-white);
        top: 0.13em;
        right: 1.5em;
        transition: transform var(--pui-transition-slow) var(--pui-ease-in-out);
    }

    .s--slider button[aria-checked='true']{
        background-color: var(--pui-color-primary);
    }

    .s--slider button[aria-checked='true']::before{
        transform: translateX(1.3em);
        transition: transform var(--pui-transition-slow) var(--pui-ease-in-out);
    }

    .s--slider button:focus {
        outline: 1px solid var(--pui-color-primary);
        outline-offset: var(--pui-focus-ring-offset);
    }

    /* Multi Design Option */

    /* Based on suggestions from Sara Soueidan https://www.sarasoueidan.com/blog/toggle-switch-design/
    and this example from Scott O'hara https://codepen.io/scottohara/pen/zLZwNv */

    .s--multi .group-container {
        border: none;
        padding: 0;
        white-space: nowrap;
    }


    /* gravy */

    /* Inner Design Option */

    .s--inner button:focus {
        outline-offset: var(--pui-focus-ring-offset);
        border-radius: var(--pui-radius-sm);
    }

    /* Slider Design Option */
    .s--slider button {
        border-radius: var(--pui-radius-3xl);
    }

    .s--slider button::before {
        border-radius: var(--pui-radius-full);
    }


</style>