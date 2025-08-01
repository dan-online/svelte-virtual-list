import type { SvelteVirtualListMode, SvelteVirtualListPreviousVisibleRange } from '$lib/types.js'
import type { VirtualListSetters, VirtualListState } from '$lib/utils/types.js'

/**
 * Calculates the maximum scroll position for a virtual list.
 *
 * This function determines the maximum scrollable distance by computing the difference
 * between the total content height and the visible container height. This is crucial
 * for maintaining proper scroll boundaries in virtual lists.
 *
 * @param {number} totalItems - The total number of items in the list
 * @param {number} itemHeight - The height of each individual item in pixels
 * @param {number} containerHeight - The visible height of the container in pixels
 * @param {number} gridColumns
 * @returns {number} The maximum scroll position in pixels
 */
export const calculateScrollPosition = (
    totalItems: number,
    itemHeight: number,
    containerHeight: number,
    gridColumns: number = 1
) => {
    if (totalItems === 0) return 0
    const totalRows = Math.ceil(totalItems / gridColumns)
    const totalHeight = Math.max(0, totalRows * itemHeight);
    return Math.max(0, totalHeight - containerHeight)
}

/**
 * Determines the range of items that should be rendered in the virtual list.
 *
 * This function calculates which items should be visible based on the current scroll position,
 * viewport size, and scroll direction. It includes a buffer zone to enable smooth scrolling
 * and prevent visible gaps during rapid scroll movements.
 *
 * @param {number} scrollTop - Current scroll position in pixels
 * @param {number} viewportHeight - Height of the visible area in pixels
 * @param {number} itemHeight - Height of each list item in pixels
 * @param {number} gridColumns - Number of columns in the grid (default 1 for list)
 * @param {number} totalItems - Total number of items in the list
 * @param {number} bufferSize - Number of items to render outside the visible area
 * @param {SvelteVirtualListMode} mode - Scroll direction mode
 * @returns {SvelteVirtualListPreviousVisibleRange} Range of indices to render
 */
export const calculateVisibleRange = (
    scrollTop: number,
    viewportHeight: number,
    itemHeight: number,
    gridColumns: number = 1,
    totalItems: number,
    bufferSize: number,
    mode: SvelteVirtualListMode
) => {
    if (gridColumns < 1) gridColumns = 1;
    const totalRows = Math.ceil(totalItems / gridColumns);

    if (mode === 'bottomToTop') {
        const visibleRows = Math.ceil(viewportHeight / itemHeight) + 1;
        const bottomRowIndex = totalRows - Math.floor(scrollTop / itemHeight);
        // Add buffer to both ends
        const startRow = Math.max(0, bottomRowIndex - visibleRows - bufferSize);
        const endRow = Math.min(totalRows, bottomRowIndex + bufferSize);
        return {
            start: startRow * gridColumns,
            end: Math.min(totalItems, endRow * gridColumns)
        };
    } else {
        // topToBottom (default)
        const startRow = Math.floor(scrollTop / itemHeight);
        const endRow = Math.min(totalRows, startRow + Math.ceil(viewportHeight / itemHeight) + 1);
        return {
            start: Math.max(0, startRow * gridColumns - bufferSize * gridColumns),
            end: Math.min(totalItems, endRow * gridColumns + bufferSize * gridColumns)
        };
    }
}

/**
 * Calculates the CSS transform value for positioning the virtual list items.
 *
 * This function determines the vertical offset needed to position the visible items
 * correctly within the viewport, accounting for the scroll direction and current
 * visible range.
 *
 * @param {SvelteVirtualListMode} mode - Scroll direction mode
 * @param {number} totalItems - Total number of items in the list
 * @param {number} visibleEnd - Index of the last visible item
 * @param {number} visibleStart - Index of the first visible item
 * @param {number} itemHeight - Height of each list item in pixels
 * @param {number} gridColumns - Amount of grid columns
 * @returns {number} The calculated transform Y value in pixels
 */
export const calculateTransformY = (
    mode: SvelteVirtualListMode,
    totalItems: number,
    visibleEnd: number,
    visibleStart: number,
    itemHeight: number,
    gridColumns: number = 1
) => {
    const startRow = Math.floor(visibleStart / gridColumns)
    if (mode === 'bottomToTop') {
        const totalRows = Math.ceil(totalItems / gridColumns)
        const endRow = Math.ceil(visibleEnd / gridColumns)
        return (totalRows - endRow) * itemHeight
    } else {
        return startRow * itemHeight
    }
}

/**
 * Updates the virtual list's height and scroll position when necessary.
 *
 * This function handles dynamic updates to the virtual list's dimensions and scroll
 * position, particularly important when the container size changes or when switching
 * scroll directions. When immediate is true, it forces an immediate update of the
 * height and scroll position.
 *
 * @param {VirtualListState} state - Current state of the virtual list
 * @param {VirtualListSetters} setters - State setters for updating list properties
 * @param {boolean} immediate - Whether to perform the update immediately
 */
export const updateHeightAndScroll = (
    state: VirtualListState,
    setters: VirtualListSetters,
    immediate = false
) => {
    const {
        initialized,
        mode,
        containerElement,
        viewportElement,
        calculatedItemHeight,
        scrollTop
    } = state

    const { setHeight, setScrollTop } = setters

    if (immediate) {
        if (containerElement && viewportElement && initialized) {
            const newHeight = containerElement.getBoundingClientRect().height
            setHeight(newHeight)

            if (mode === 'bottomToTop') {
                const visibleIndex = Math.floor(scrollTop / calculatedItemHeight)
                const newScrollTop = visibleIndex * calculatedItemHeight
                viewportElement.scrollTop = newScrollTop
                setScrollTop(newScrollTop)
            }
        }
    }
}

/**
 * Calculates the average height of visible items in a virtual list.
 *
 * This function optimizes performance by:
 * 1. Using a height cache to store measured item heights with dirty tracking
 * 2. Only measuring new items not in the cache
 * 3. Calculating a running average of all measured heights
 *
 * @param {HTMLElement[]} itemElements - Array of currently rendered item elements
 * @param {{ start: number }} visibleRange - Object containing the start index of visible items
 * @param {HeightCache} heightCache - Cache of previously measured item heights with dirty tracking
 * @param {number} currentItemHeight - Current average item height being used
 *
 * @returns {{
 *   newHeight: number,
 *   newLastMeasuredIndex: number,
 *   updatedHeightCache: HeightCache
 * }} Object containing new calculated height, last measured index, and updated cache
 *
 * @example
 * const result = calculateAverageHeight(
 *   itemElements,
 *   { start: 0 },
 *   {},
 *   40
 * )
 */
export const calculateAverageHeight = (
    itemElements: HTMLElement[],
    visibleRange: { start: number; end: number },
    heightCache: Record<number, number>,
    currentItemHeight: number,
    dirtyItems: Set<number>,
    currentTotalHeight: number = 0,
    currentValidCount: number = 0,
    mode: SvelteVirtualListMode = 'topToBottom'
): {
    newHeight: number
    newLastMeasuredIndex: number
    updatedHeightCache: Record<number, number>
    clearedDirtyItems: Set<number>
    newTotalHeight: number
    newValidCount: number
    heightChanges: Array<{ index: number; oldHeight: number; newHeight: number; delta: number }>
} => {
    const validElements = itemElements.filter((el) => el)
    if (validElements.length === 0) {
        return {
            newHeight: currentItemHeight,
            newLastMeasuredIndex: visibleRange.start,
            updatedHeightCache: heightCache,
            clearedDirtyItems: new Set(),
            newTotalHeight: currentTotalHeight,
            newValidCount: currentValidCount,
            heightChanges: []
        }
    }

    const newHeightCache = { ...heightCache }
    const clearedDirtyItems = new Set<number>()
    const heightChanges: Array<{
        index: number
        oldHeight: number
        newHeight: number
        delta: number
    }> = []

    // Start with current running totals (O(1) instead of O(n))
    let totalValidHeight = currentTotalHeight
    let validHeightCount = currentValidCount

    // Process only dirty items if they exist, otherwise process all visible items
    if (dirtyItems.size > 0) {
        // Process only dirty items
        dirtyItems.forEach((itemIndex) => {
            // Map original item index to position in itemElements array
            let elementIndex: number
            if (mode === 'bottomToTop') {
                // In bottomToTop, itemElements is reversed relative to the visible range
                // elementIndex should be based on position within the actual array, not theoretical end
                elementIndex = validElements.length - 1 - (itemIndex - visibleRange.start)
            } else {
                // In topToBottom, itemElements is normal: [item0, item1, ..., item44, item45]
                elementIndex = itemIndex - visibleRange.start
            }
            const element = validElements[elementIndex]
            if (element && elementIndex >= 0 && elementIndex < validElements.length) {
                try {
                    // await tick()
                    void element.offsetHeight
                    const height = element.getBoundingClientRect().height
                    const oldHeight = newHeightCache[itemIndex]
                    if (Number.isFinite(height) && height > 0) {
                        // Only update if height actually changed (use smaller tolerance for precision)
                        if (!oldHeight || Math.abs(oldHeight - height) >= 0.1) {
                            // Track the height change for scroll correction
                            const actualOldHeight = oldHeight || currentItemHeight
                            const delta = height - actualOldHeight

                            heightChanges.push({
                                index: itemIndex,
                                oldHeight: actualOldHeight,
                                newHeight: height,
                                delta
                            })

                            // Update running totals
                            if (oldHeight && Number.isFinite(oldHeight) && oldHeight > 0) {
                                // Replace old height with new height in running total
                                totalValidHeight = totalValidHeight - oldHeight + height
                            } else {
                                // Add new height to running total
                                totalValidHeight += height
                                validHeightCount++
                            }
                            newHeightCache[itemIndex] = height
                        }
                    }
                    clearedDirtyItems.add(itemIndex)
                } catch {
                    // Skip invalid measurements but still clear from dirty
                    clearedDirtyItems.add(itemIndex)
                }
            } else {
                clearedDirtyItems.add(itemIndex) // Still clear it from dirty items
            }
        })
    } else {
        // Original behavior: process all visible items
        validElements.forEach((el, i) => {
            const itemIndex =
                mode === 'bottomToTop'
                    ? Math.max(
                          0,
                          (visibleRange.end ?? visibleRange.start + validElements.length) - 1 - i
                      )
                    : visibleRange.start + i
            if (!newHeightCache[itemIndex]) {
                try {
                    const height = el.getBoundingClientRect().height
                    if (Number.isFinite(height) && height > 0) {
                        // Add new height to running totals
                        totalValidHeight += height
                        validHeightCount++
                        newHeightCache[itemIndex] = height
                    }
                } catch {
                    // Skip invalid measurements
                }
            }
        })
    }

    // O(1) average calculation using running totals!
    return {
        newHeight: validHeightCount > 0 ? totalValidHeight / validHeightCount : currentItemHeight,
        newLastMeasuredIndex: visibleRange.start,
        updatedHeightCache: newHeightCache,
        clearedDirtyItems,
        newTotalHeight: totalValidHeight,
        newValidCount: validHeightCount,
        heightChanges
    }
}

/**
 * Processes large arrays in chunks to prevent UI blocking.
 *
 * This function implements a progressive processing strategy that:
 * 1. Breaks down large arrays into manageable chunks
 * 2. Processes each chunk asynchronously
 * 3. Reports progress after each chunk
 * 4. Yields to the main thread between chunks
 *
 * @param {any[]} items - Array of items to process
 * @param {number} chunkSize - Number of items to process in each chunk
 * @param {(processed: number) => void} onProgress - Callback for progress updates
 * @param {() => void} onComplete - Callback when all processing is complete
 *
 * @returns {Promise<void>} Resolves when all chunks have been processed
 *
 * @example
 * await processChunked(
 *   largeArray,
 *   50,
 *   (processed) => console.log(`Processed ${processed} items`),
 *   () => console.log('All items processed')
 * )
 */
export const processChunked = async (
    items: any[], // eslint-disable-line @typescript-eslint/no-explicit-any
    chunkSize: number,
    onProgress: (processed: number) => void, // eslint-disable-line no-unused-vars
    onComplete: () => void
) => {
    if (!items.length) {
        onComplete()
        return
    }

    const processChunk = async (startIdx: number) => {
        const endIdx = Math.min(startIdx + chunkSize, items.length)
        onProgress(endIdx)

        if (endIdx < items.length) {
            setTimeout(() => processChunk(endIdx), 0)
        } else {
            onComplete()
        }
    }

    await processChunk(0)
}

/**
 * Calculates the scroll offset (in pixels) needed to bring a specific item into view in a virtual list.
 *
 * Uses block memoization for efficient O(b) offset calculation, where b = block size (default 1000).
 * For very large lists, this avoids O(n) iteration for every scroll.
 *
 * - For indices >= blockSize, sums the block prefix, then only iterates the tail within the block.
 * - For small indices, falls back to the original logic.
 *
 * @param {HeightCache} heightCache - Map of measured item heights with dirty tracking
 * @param {number} calculatedItemHeight - Estimated height for unmeasured items
 * @param {number} idx - The index to scroll to (exclusive)
 * @param {number[]} [blockSums] - Optional precomputed block sums (for repeated queries)
 * @param {number} [blockSize=1000] - Block size for memoization
 * @returns {number} The total offset in pixels from the top of the list to the start of the item at idx.
 *
 * @example
 * // For best performance with repeated queries:
 * const blockSums = buildBlockSums(heightCache, calculatedItemHeight, items.length);
 * const offset = getScrollOffsetForIndex(heightCache, calculatedItemHeight, 12345, blockSums);
 */
export const getScrollOffsetForIndex = (
    heightCache: Record<number, number>,
    calculatedItemHeight: number,
    idx: number,
    blockSums?: number[],
    blockSize = 1000
): number => {
    // normalize and clamp index
    const safeIdx = Math.max(0, Math.floor(idx))
    if (safeIdx <= 0) return 0
    if (!blockSums) {
        // Fallback: O(n) for a single query
        let offset = 0

        for (let i = 0; i < safeIdx; i++) {
            const raw = heightCache[i]
            const height =
                Number.isFinite(raw) && (raw as number) > 0 ? (raw as number) : calculatedItemHeight
            offset += height
        }

        return offset
    }
    const blockIdx = Math.floor(safeIdx / blockSize)
    let offsetBase = 0
    if (blockIdx > 0) {
        const base = blockSums[blockIdx - 1]
        offsetBase = Number.isFinite(base) ? (base as number) : 0
    }
    let offset = offsetBase
    const start = blockIdx * blockSize
    for (let i = start; i < safeIdx; i++) {
        const raw = heightCache[i]
        const height =
            Number.isFinite(raw) && (raw as number) > 0 ? (raw as number) : calculatedItemHeight
        offset += height
    }
    return offset
}
