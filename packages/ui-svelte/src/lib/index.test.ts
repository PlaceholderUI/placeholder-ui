import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';

// ============================================
// UI Components
// ============================================

import Button from './ui/Button.svelte';
import Badge from './ui/Badge.svelte';
import Loader from './ui/Loader.svelte';
import Progress from './ui/Progress.svelte';
import Skeleton from './ui/Skeleton.svelte';

// ============================================
// Form Components
// ============================================

import Checkbox from './form/Checkbox.svelte';
import Switch from './form/Switch.svelte';

// ============================================
// Display Components
// ============================================

import Paper from './display/Paper.svelte';
import Alert from './display/Alert.svelte';

// ============================================
// Helpers
// ============================================

/**
 * Creates a Svelte 5 snippet for testing components that require children.
 */
function snippetFrom(text: string) {
	return createRawSnippet(() => ({
		render: () => `<span>${text}</span>`,
		setup: () => {}
	}));
}

// ============================================
// Button
// ============================================

describe('Button', () => {
	it('renders with default props', () => {
		render(Button, { props: { children: snippetFrom('Click me') } });
		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		expect(button.className).toContain('primary');
		expect(button.className).toContain('size-md');
	});

	it('renders with variant prop', () => {
		render(Button, { props: { variant: 'danger', children: snippetFrom('Delete') } });
		const button = screen.getByRole('button');
		expect(button.className).toContain('danger');
	});

	it('renders with size prop', () => {
		render(Button, { props: { size: 'lg', children: snippetFrom('Large') } });
		const button = screen.getByRole('button');
		expect(button.className).toContain('size-lg');
	});

	it('renders as disabled', () => {
		render(Button, { props: { disabled: true, children: snippetFrom('Disabled') } });
		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});

	it('renders as disabled when loading', () => {
		render(Button, { props: { loading: true, children: snippetFrom('Loading') } });
		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});

	it('renders as anchor when href is provided', () => {
		render(Button, { props: { href: '/test', children: snippetFrom('Link') } });
		const link = screen.getByRole('link');
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', '/test');
	});

	it('applies effects-disabled class', () => {
		render(Button, { props: { effectsDisabled: true, children: snippetFrom('No effects') } });
		const button = screen.getByRole('button');
		expect(button.className).toContain('effects-disabled');
	});

	it('applies custom class', () => {
		render(Button, { props: { class: 'custom-cls', children: snippetFrom('Custom') } });
		const button = screen.getByRole('button');
		expect(button.className).toContain('custom-cls');
	});

	it('handles click events', async () => {
		let clicked = false;
		render(Button, {
			props: { onclick: () => (clicked = true), children: snippetFrom('Click') }
		});
		await fireEvent.click(screen.getByRole('button'));
		expect(clicked).toBe(true);
	});
});

// ============================================
// Badge
// ============================================

describe('Badge', () => {
	it('renders with default variant', () => {
		const { container } = render(Badge, { props: { children: snippetFrom('New') } });
		const badge = container.querySelector('.badge-container');
		expect(badge).toBeInTheDocument();
		expect(badge?.className).toContain('primary');
	});

	it('renders with specified variant', () => {
		const { container } = render(Badge, {
			props: { variant: 'danger', children: snippetFrom('Error') }
		});
		const badge = container.querySelector('.badge-container');
		expect(badge?.className).toContain('danger');
	});

	it('renders pill shape', () => {
		const { container } = render(Badge, {
			props: { shape: 'pill', children: snippetFrom('Pill') }
		});
		const badge = container.querySelector('.badge-container');
		expect(badge?.className).toContain('shape-pill');
	});
});

// ============================================
// Loader
// ============================================

describe('Loader', () => {
	it('renders', () => {
		const { container } = render(Loader);
		const loader = container.querySelector('.loader');
		expect(loader).toBeInTheDocument();
	});

	it('applies full-screen class', () => {
		const { container } = render(Loader, { props: { fullScreen: true } });
		const loader = container.querySelector('.loader');
		expect(loader?.className).toContain('full-screen');
	});
});

// ============================================
// Progress
// ============================================

describe('Progress', () => {
	it('renders with default props', () => {
		render(Progress);
		const progressbar = screen.getByRole('progressbar');
		expect(progressbar).toBeInTheDocument();
		expect(progressbar).toHaveAttribute('aria-valuenow', '0');
		expect(progressbar).toHaveAttribute('aria-valuemax', '100');
	});

	it('reflects value in aria attributes', () => {
		render(Progress, { props: { value: 50 } });
		const progressbar = screen.getByRole('progressbar');
		expect(progressbar).toHaveAttribute('aria-valuenow', '50');
	});

	it('renders with label', () => {
		render(Progress, { props: { value: 75, label: 'Uploading' } });
		expect(screen.getByText('Uploading')).toBeInTheDocument();
	});

	it('shows percentage value', () => {
		render(Progress, { props: { value: 75, showValue: true, label: 'Test' } });
		expect(screen.getByText('75%')).toBeInTheDocument();
	});

	it('clamps value between 0 and 100', () => {
		const { container } = render(Progress, { props: { value: 150 } });
		const bar = container.querySelector('.progress-bar') as HTMLElement;
		expect(bar?.style.width).toBe('100%');
	});

	it('applies size class', () => {
		const { container } = render(Progress, { props: { size: 'lg' } });
		const progress = container.querySelector('.progress');
		expect(progress?.className).toContain('size-lg');
	});
});

// ============================================
// Skeleton
// ============================================

describe('Skeleton', () => {
	it('renders', () => {
		const { container } = render(Skeleton);
		const skeleton = container.querySelector('.skeleton');
		expect(skeleton).toBeInTheDocument();
	});
});

// ============================================
// Checkbox
// ============================================

describe('Checkbox', () => {
	it('renders with label', () => {
		render(Checkbox, { props: { label: 'Accept terms' } });
		expect(screen.getByText('Accept terms')).toBeInTheDocument();
	});

	it('renders unchecked by default', () => {
		render(Checkbox, { props: { label: 'Test' } });
		const input = screen.getByRole('checkbox');
		expect(input).not.toBeChecked();
	});

	it('renders checked when checked prop is true', () => {
		render(Checkbox, { props: { label: 'Test', checked: true } });
		const input = screen.getByRole('checkbox');
		expect(input).toBeChecked();
	});

	it('can be toggled', async () => {
		render(Checkbox, { props: { label: 'Test' } });
		const input = screen.getByRole('checkbox');
		await fireEvent.click(input);
		expect(input).toBeChecked();
	});

	it('renders disabled state', () => {
		render(Checkbox, { props: { label: 'Test', disabled: true } });
		const input = screen.getByRole('checkbox');
		expect(input).toBeDisabled();
	});

	it('shows required indicator', () => {
		render(Checkbox, { props: { label: 'Required', required: true } });
		expect(screen.getByText('*')).toBeInTheDocument();
	});

	it('shows error text', () => {
		render(Checkbox, {
			props: { label: 'Test', showError: true, errorText: 'Required field' }
		});
		expect(screen.getByText('Required field')).toBeInTheDocument();
	});
});

// ============================================
// Switch
// ============================================

describe('Switch', () => {
	it('renders with label', () => {
		render(Switch, { props: { label: 'Dark mode', checked: false } });
		const toggle = screen.getByRole('switch');
		expect(toggle).toBeInTheDocument();
	});

	it('reflects checked state', () => {
		render(Switch, { props: { label: 'Active', checked: true } });
		const toggle = screen.getByRole('switch');
		expect(toggle).toHaveAttribute('aria-checked', 'true');
	});

	it('reflects unchecked state', () => {
		render(Switch, { props: { label: 'Inactive', checked: false } });
		const toggle = screen.getByRole('switch');
		expect(toggle).toHaveAttribute('aria-checked', 'false');
	});

	it('can be toggled', async () => {
		render(Switch, { props: { label: 'Toggle', checked: false } });
		const toggle = screen.getByRole('switch');
		await fireEvent.click(toggle);
		expect(toggle).toHaveAttribute('aria-checked', 'true');
	});

	it('renders disabled state', () => {
		render(Switch, { props: { label: 'Disabled', checked: false, disabled: true } });
		const toggle = screen.getByRole('switch');
		expect(toggle).toBeDisabled();
	});
});

// ============================================
// Paper
// ============================================

describe('Paper', () => {
	it('renders', () => {
		const { container } = render(Paper);
		const paper = container.querySelector('.paper');
		expect(paper).toBeInTheDocument();
	});

	it('renders with title', () => {
		render(Paper, { props: { title: 'Card Title' } });
		expect(screen.getByText('Card Title')).toBeInTheDocument();
	});

	it('applies custom class', () => {
		const { container } = render(Paper, { props: { class: 'my-custom' } });
		const paper = container.querySelector('.paper');
		expect(paper?.className).toContain('my-custom');
	});

	it('applies containerClass', () => {
		const { container } = render(Paper, { props: { containerClass: 'container-cls' } });
		const paper = container.querySelector('.paper');
		expect(paper?.className).toContain('container-cls');
	});
});

// ============================================
// Alert
// ============================================

describe('Alert', () => {
	it('renders', () => {
		const { container } = render(Alert);
		const alert = container.querySelector('.alert');
		expect(alert).toBeInTheDocument();
	});
});
