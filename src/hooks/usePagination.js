import { useMemo } from "react";

const DOTS = "...";

const range = (start, end) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({ currentPage, totalPage, siblingCount }) => {
  const paginationRange = useMemo(() => {
    // CASE 1: Number of pages is less than the page numbers we want to show (siblingCount + firstPage + lastPage + currentPage + 2*DOTS)
    if (totalPage <= siblingCount + 5) {
      return range(1, totalPage);
    }

    // Calculate left and right sibling index and make sure they are within range 1 and totalPage
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPage);

    // Don't show dots just when there is just 1 page number to be inserted between the extremes of sibling and the page limits (i.e 1 and totalPage)
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPage - 2;
    const firstPageIndex = 1;
    const lastPageIndex = totalPage;

    // CASE 2: No left dots to show, but rights dots to be shown
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPage];
    }

    // CASE 3: No right dots to show, but left dots to be shown
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPage - rightItemCount + 1, totalPage);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // CASE 4: Both left and right dots to be shown
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [currentPage, totalPage, siblingCount]);

  return paginationRange;
};