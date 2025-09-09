/**
     * SvelteVirtualList Implementation Journey
     *
     * Evolution & Architecture:
     * 1. Initial Implementation ✓
     *    - Basic virtual scrolling with fixed height items
     *    - Single direction scrolling (top-to-bottom)
     *    - Simple viewport calculations
     *
     * 2. Dynamic Height Enhancement ✓
     *    - Added dynamic height calculation system
     *    - Implemented debounced measurements
     *    - Created height averaging mechanism for performance
     *
     * 3. Bidirectional Scrolling ✓
     *    - Added bottomToTop mode
     *    - Solved complex initialization issues with flexbox
     *    - Implemented careful scroll position management
     *
     * 4. Performance Optimizations ✓
     *    - Added element recycling through keyed each blocks
     *    - Implemented RAF for smooth animations
     *    - Optimized DOM updates with transform translations
     *
     * 5. Stability Improvements ✓
     *    - Added ResizeObserver for responsive updates
     *    - Implemented proper cleanup on component destruction
     *    - Added debug mode for development assistance
     *
     * 6. Large Dataset Optimizations ✓
     *    - Implemented chunked processing for 10k+ items
     *    - Added progressive initialization system
     *    - Deferred height calculations for better initial load
     *    - Optimized memory usage for large lists
     *    - Added progress tracking for initialization
     *
     * 7. Size Management Improvements ✓
     *    - Implemented height caching system for measured items
     *    - Added smart height estimation for unmeasured items
     *    - Optimized resize handling with debouncing
     *    - Added height recalculation on content changes
     *    - Implemented progressive height adjustments
     *
     * 8. Code Quality & Maintainability ✓
     *    - Extracted debug utilities for better testing
     *    - Improved type safety throughout
     *    - Added comprehensive documentation
     *    - Optimized debug output to reduce noise
     *
     * 9. Future Improvements (Planned)
     *    - Add horizontal scrolling support
     *    - Implement variable-sized item caching
     *    - Add keyboard navigation support
     *    - Support for dynamic item updates
     *    - Add accessibility enhancements
     *
     * Technical Challenges Solved:
     * - Bottom-to-top scrolling in flexbox layouts
     * - Dynamic height calculations without layout thrashing
     * - Smooth scrolling on various devices
     * - Memory management for large lists
     * - Browser compatibility issues
     * - Performance optimization for 10k+ items
     * - Progressive initialization for large datasets
     * - Debug output optimization
     * - Accurate size calculations with caching
     * - Responsive size adjustments
     *
     * Current Architecture:
     * - Four-layer DOM structure for optimal performance
     * - State management using Svelte 5's $state
     * - Reactive height and scroll calculations
     * - Configurable buffer zones for smooth scrolling
     * - Chunked processing system for large datasets
     * - Separated debug utilities for better testing
     * - Height caching and estimation system
     * - Progressive size adjustment system
     */
import { type SvelteVirtualListProps, type SvelteVirtualListScrollOptions } from './types.js';
declare function $$render<TItem>(): {
    props: SvelteVirtualListProps<TItem>;
    exports: {
        /**
             * Scrolls the virtual list to the item at the given index.
             *
             * @deprecated This function is deprecated and will be removed in a future version.
             * Use the new scroll method from the component instance instead.
             *
             * @function scrollToIndex
             * @param index The index of the item to scroll to.
             * @param smoothScroll (default: true) Whether to use smooth scrolling.
             * @param shouldThrowOnBounds (default: true) Whether to throw an error if the index is out of bounds.
             *
             * @example
             * // Svelte usage:
             * // In your <script> block:
             * import SvelteVirtualList from '@humanspeak/svelte-virtual-list';
             * let virtualList;
             * const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, text: `Item ${i}` }));
             *
             * // In your markup:
             * <button onclick={() => virtualList.scrollToIndex(5000)}>
             *    Scroll to 5000
             * </button>
             * <SvelteVirtualList {items} bind:this={virtualList}>
             *   {#snippet renderItem(item)}
             *     <div>{item.text}</div>
             *   {/snippet}
             * </SvelteVirtualList>
             *
             * @returns {void}
             * @throws {Error} If the index is out of bounds and shouldThrowOnBounds is true
             */ scrollToIndex: (index: number, smoothScroll?: boolean, shouldThrowOnBounds?: boolean) => void;
        /**
             * Scrolls the virtual list to the item at the given index using a type-based options approach.
             *
             * @function scroll
             * @param options Configuration options for scrolling behavior.
             *
             * @example
             * // Svelte usage:
             * // In your <script> block:
             *   import SvelteVirtualList from './index.js';
             *   let virtualList;
             *   const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, text: `Item ${i}` }));
             *
             * <button onclick={() => virtualList.scroll({ index: 5000 })}>
             *   Scroll to 5000
             * </button>
             * <SvelteVirtualList {items} bind:this={virtualList}>
             *   {#snippet renderItem(item)}
             *     <div>{item.text}</div>
             *   {/snippet}
             * </SvelteVirtualList>
             *
             * @returns {void}
             * @throws {Error} If the index is out of bounds and shouldThrowOnBounds is true
             */ scroll: (options: SvelteVirtualListScrollOptions) => void;
    };
    bindings: "";
    slots: {};
    events: {};
};
declare class __sveltets_Render<TItem> {
    props(): ReturnType<typeof $$render<TItem>>['props'];
    events(): ReturnType<typeof $$render<TItem>>['events'];
    slots(): ReturnType<typeof $$render<TItem>>['slots'];
    bindings(): "";
    exports(): {
        /**
             * Scrolls the virtual list to the item at the given index.
             *
             * @deprecated This function is deprecated and will be removed in a future version.
             * Use the new scroll method from the component instance instead.
             *
             * @function scrollToIndex
             * @param index The index of the item to scroll to.
             * @param smoothScroll (default: true) Whether to use smooth scrolling.
             * @param shouldThrowOnBounds (default: true) Whether to throw an error if the index is out of bounds.
             *
             * @example
             * // Svelte usage:
             * // In your <script> block:
             * import SvelteVirtualList from '@humanspeak/svelte-virtual-list';
             * let virtualList;
             * const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, text: `Item ${i}` }));
             *
             * // In your markup:
             * <button onclick={() => virtualList.scrollToIndex(5000)}>
             *    Scroll to 5000
             * </button>
             * <SvelteVirtualList {items} bind:this={virtualList}>
             *   {#snippet renderItem(item)}
             *     <div>{item.text}</div>
             *   {/snippet}
             * </SvelteVirtualList>
             *
             * @returns {void}
             * @throws {Error} If the index is out of bounds and shouldThrowOnBounds is true
             */ scrollToIndex: (index: number, smoothScroll?: boolean, shouldThrowOnBounds?: boolean) => void;
        /**
             * Scrolls the virtual list to the item at the given index using a type-based options approach.
             *
             * @function scroll
             * @param options Configuration options for scrolling behavior.
             *
             * @example
             * // Svelte usage:
             * // In your <script> block:
             *   import SvelteVirtualList from './index.js';
             *   let virtualList;
             *   const items = Array.from({ length: 10000 }, (_, i) => ({ id: i, text: `Item ${i}` }));
             *
             * <button onclick={() => virtualList.scroll({ index: 5000 })}>
             *   Scroll to 5000
             * </button>
             * <SvelteVirtualList {items} bind:this={virtualList}>
             *   {#snippet renderItem(item)}
             *     <div>{item.text}</div>
             *   {/snippet}
             * </SvelteVirtualList>
             *
             * @returns {void}
             * @throws {Error} If the index is out of bounds and shouldThrowOnBounds is true
             */ scroll: (options: SvelteVirtualListScrollOptions) => void;
    };
}
interface $$IsomorphicComponent {
    new <TItem>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<TItem>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<TItem>['props']>, ReturnType<__sveltets_Render<TItem>['events']>, ReturnType<__sveltets_Render<TItem>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<TItem>['bindings']>;
    } & ReturnType<__sveltets_Render<TItem>['exports']>;
    <TItem>(internal: unknown, props: ReturnType<__sveltets_Render<TItem>['props']> & {}): ReturnType<__sveltets_Render<TItem>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
/**
 * SvelteVirtualList
 *
 * A high-performance, memory-efficient virtualized list component for Svelte 5.
 * Renders only visible items plus a buffer, supporting dynamic item heights,
 * bi-directional (top-to-bottom and bottom-to-top) scrolling, and programmatic control.
 *
 * =============================
 * ==  Key Features           ==
 * =============================
 * - Dynamic item height support (no fixed height required)
 * - Top-to-bottom and bottom-to-top (chat-style) scrolling
 * - Programmatic scrolling with flexible alignment (top, bottom, auto)
 * - Smooth scrolling and buffer size configuration
 * - SSR compatible and hydration-friendly
 * - TypeScript and Svelte 5 runes/snippets support
 * - Customizable styling via class props
 * - Debug mode for development and testing
 * - Optimized for large lists (10k+ items)
 * - Comprehensive test coverage (unit and E2E)
 *
 * =============================
 * ==  Usage Example          ==
 * =============================
 * ```svelte
 * <SvelteVirtualList
 *     items={data}
 *     mode="bottomToTop"
 *     bind:this={listRef}
 * >
 *     {#snippet renderItem(item)}
 *         <div>{item.text}</div>
 *     {/snippet}
 * </SvelteVirtualList>
 * ```
 *
 * =============================
 * ==  Architecture Notes      ==
 * =============================
 * - Uses a four-layer DOM structure for optimal performance
 * - Only visible items + buffer are mounted in the DOM
 * - Height caching and estimation for dynamic content
 * - Handles resize events and dynamic content changes
 * - Supports chunked initialization for very large lists
 * - All scrolling logic is centralized in the scroll() method
 * - Bi-directional support: mode="topToBottom" or "bottomToTop"
 * - Designed for extensibility and easy debugging
 *
 * =============================
 * ==  For Contributors        ==
 * =============================
 * - Please keep all scrolling logic in the scroll() method
 * - Add new features behind feature flags or as optional props
 * - Write tests for all new features (see /test and /tests/scroll)
 * - Use TypeScript and Svelte 5 runes for all new code
 * - Document all exported functions and props with JSDoc
 * - See README.md for API and usage details
 * - For questions, open an issue or discussion on GitHub
 *
 * MIT License © Humanspeak, Inc.
 */
declare const SvelteVirtualList: $$IsomorphicComponent;
type SvelteVirtualList<TItem> = InstanceType<typeof SvelteVirtualList<TItem>>;
export default SvelteVirtualList;
