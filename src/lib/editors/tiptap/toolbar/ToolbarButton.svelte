<script lang="ts">
  import { Icon } from '$lib/icon/index.js'

  interface Props {
    icon: string
    title: string
    active?: boolean
    disabled?: boolean
    onclick: () => void
  }

  let {
    icon,
    title,
    active = false,
    disabled = false,
    onclick
  }: Props = $props()
</script>

<button
  class="toolbar-button"
  type="button"
  tabindex="-1"
  {onclick}
  {disabled}
  {title}
  class:active
>
  <Icon svg={icon} size="20" />
</button>

<style>
  .toolbar-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 28px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--text-color);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .toolbar-button:hover:not(:disabled) {
    background: rgba(var(--ui-primary-rgbc), 0.1);
    color: var(--ui-primary);
  }

  :global(.dark) .toolbar-button:hover:not(:disabled) {
    background: rgba(var(--ui-accent-rgbc), 0.1);
    color: var(--ui-accent);
  }

  .toolbar-button:active:not(:disabled) {
    background: rgba(var(--ui-primary-rgbc), 0.15);
  }

  :global(.dark) .toolbar-button:active:not(:disabled) {
    background: rgba(var(--ui-accent-rgbc), 0.15);
  }

  .toolbar-button.active {
    background: var(--ui-primary);
    color: white;
  }

  .toolbar-button.active:hover {
    background: var(--ui-tertiary-dark);
  }

  .toolbar-button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .toolbar-button :global(.cu-icon) {
    height: 19px;
  }
</style>
