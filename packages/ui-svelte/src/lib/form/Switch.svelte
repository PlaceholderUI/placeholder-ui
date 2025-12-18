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
		--accent-color: var(--midnight);
		--gray: #ccc;
	}

    :global(.dark) .switch-container {
        --accent-color: var(--midnight);
        --gray: #444;
    }

	.disabled button {
		cursor: not-allowed;
	}


    /* Inner Design Option */
    .s--inner button {
        padding: 0.5em;
        background-color: #fff;
        border: 1px solid var(--gray);
    }

    .s--inner button:focus {
        outline: var(--midnight) solid 1px;
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
        margin: 0 0 0 0.5em;
        background: var(--gray);
        border: none;
    }

    .s--slider button::before {
        content: '';
        position: absolute;
        width: 1.3em;
        height: 1.3em;
        background: #fff;
        top: 0.13em;
        right: 1.5em;
        transition: transform 0.3s;
    }

    .s--slider button[aria-checked='true']{
        background-color: var(--midnight)
    }

    .s--slider button[aria-checked='true']::before{
        transform: translateX(1.3em);
        transition: transform 0.3s;
    }

    .s--slider button:focus {
        outline: 1px solid var(--midnight);
        outline-offset: 2px;
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
        outline-offset: 2px;
        border-radius: 0.1em;
    }

    /* Slider Design Option */
    .s--slider button {
        border-radius: 1.5em;
    } 
    
    .s--slider button::before {
        border-radius: 100%;
    }
   

</style>