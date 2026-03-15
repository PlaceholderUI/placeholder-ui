<script lang="ts">
    import FormGroup from "./FormGroup.svelte";

    interface Props {
        label: string;
        required?: boolean;
        checked: boolean;
        disabled?: boolean;
        containerClass?: string;
        switchClass?: string;
        onchange?: (value: boolean) => void;
        showError?: boolean;
    }

    let {
        label,
        required = false,
        checked = $bindable(),
        disabled = false,
        containerClass,
        switchClass,
        onchange,
        showError,
    }: Props = $props();

    function handleClick(event: Event) {
        const target = event.target as HTMLElement;
        const state = target.getAttribute("aria-checked");
        checked = !(state === "true");
        onchange?.(checked);
    }
</script>

<div class="switch-container {containerClass}">
    <FormGroup {required} {label}>
        <div
            class="switch-track {switchClass}"
            class:error={showError}
            class:disabled
        >
            <button
                role="switch"
                aria-checked={checked}
                aria-labelledby="form-{label}"
                onclick={handleClick}
                {disabled}
            ></button>
        </div>
    </FormGroup>
</div>

<style>
    .switch-container {
        --switch-track-color: var(--pui-border-disabled);
    }

    :global(.dark) .switch-container {
        --switch-track-color: var(--pui-color-gray-600);
    }

    .switch-track {
        display: flex;
        align-items: center;
    }

    button {
        width: 3em;
        height: 1.6em;
        position: relative;
        margin: 0 0 0 var(--pui-spacing-2);
        padding: 0;
        background: var(--switch-track-color);
        border: none;
        border-radius: var(--pui-radius-3xl);
        cursor: pointer;
        transition: background-color var(--pui-transition-fast)
            var(--pui-ease-in-out);
    }

    button::before {
        content: "";
        position: absolute;
        width: 1.3em;
        height: 1.3em;
        top: 0.15em;
        right: 1.5em;
        background: var(--pui-color-white);
        border-radius: var(--pui-radius-full);
        transition: transform var(--pui-transition-slow) var(--pui-ease-in-out);
    }

    button[aria-checked="true"] {
        background-color: var(--pui-color-primary);
    }

    button[aria-checked="true"]::before {
        transform: translateX(1.3em);
    }

    button:focus-visible {
        outline: 2px solid var(--pui-color-primary);
        outline-offset: var(--pui-focus-ring-offset);
    }

    .disabled button {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .error button {
        outline: 1px solid var(--pui-text-danger);
    }
</style>
