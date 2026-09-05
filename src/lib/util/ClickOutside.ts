export function clickOutside(node: HTMLElement, handler: (event: MouseEvent) => void) {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!event.target) {
        return;
      }
      if (node && !node.contains(target) && !event.defaultPrevented) {
        handler(event);
      }
    };
  
    document.addEventListener('click', handleClick, true);
  
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  }