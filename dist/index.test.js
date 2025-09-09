import { describe, expect, test } from 'vitest';
import SvelteVirtualListDefault, {} from './index.js';
import SvelteVirtualListDirect from './SvelteVirtualList.svelte';
describe('index.ts exports', () => {
    test('should export SvelteVirtualList as default', () => {
        expect(SvelteVirtualListDefault).toBeDefined();
        expect(SvelteVirtualListDefault).toBe(SvelteVirtualListDirect);
    });
    test('should export correct types', () => {
        // Create objects that match the exported types to verify type exports
        const debugInfo = {
            visibleItemsCount: 10,
            startIndex: 0,
            endIndex: 10,
            totalItems: 100,
            processedItems: 50,
            averageItemHeight: 30
        };
        const mode = 'topToBottom';
        // Use a mock Snippet for renderItem
        const mockSnippet = (() => { });
        const props = {
            items: [],
            renderItem: mockSnippet
        };
        // Test scroll options and align types if exported
        const scrollOptions = {
            index: 0,
            smoothScroll: true,
            shouldThrowOnBounds: true,
            align: 'auto'
        };
        const align = 'bottom';
        expect(debugInfo).toBeDefined();
        expect(mode).toBeDefined();
        expect(props).toBeDefined();
        expect(scrollOptions).toBeDefined();
        expect(align).toBeDefined();
    });
});
