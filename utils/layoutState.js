// Simple global state for sidebar layout across components
export const sidebarState = {
  listeners: [],
  collapsed: false,
  setCollapsed(val) {
    this.collapsed = val;
    this.listeners.forEach(l => l(val));
  },
  subscribe(l) {
    this.listeners.push(l);
    return () => { this.listeners = this.listeners.filter(cb => cb !== l); };
  }
};
