/*

🚀 Day 10: The Pagination Component (Slicing Big Datasets)
When dealing with incremental logic, game inventories, or sprawling database lists, displaying hundreds of items at once destroys performance and creates an ugly user experience. Instead, we use Pagination to slice data into small, digestible chunks.

The Goal:
Create a system that takes a larger array of items and breaks it down so it only displays 3 items at a time, complete with a functional navigation control row at the bottom.

Let's use this mock list of 8 game resources/items:

TypeScript
const largeInventory = [
  { id: 1, name: "Iron Ore" },
  { id: 2, name: "Copper Bar" },
  { id: 3, name: "Coal Chunk" },
  { id: 4, name: "Gold Nugget" },
  { id: 5, name: "Mithril Ingot" },
  { id: 6, name: "Ruby Gem" },
  { id: 7, name: "Dark Matter" },
  { id: 8, name: "Star Shard" }
];
Requirements:

Dynamic Slice Calculation: Based on a state variable tracking currentPage (starting at page 1), compute the array indices to slice the inventory down to just 3 elements (e.g., Page 1 shows items 1-3, Page 2 shows items 4-6, Page 3 shows items 7-8).

Navigation Row: Add "Previous" and "Next" buttons. Clicking them should increment or decrement the active currentPage.

Smart Disabled States:

The "Previous" button must be grayed out/disabled if you are on Page 1.

The "Next" button must be grayed out/disabled if you are on the final page.

💡 Hints to get you started:
The Math: You can calculate your starting index as (currentPage - 1) * itemsPerPage and your ending index as startIndex + itemsPerPage.

Slicing: Use the native, non-mutating array method .slice(startIndex, endIndex) to isolate the items that should be mapped onto the UI.

Total Pages: You can dynamically find the max page boundary using Math.ceil(largeInventory.length / itemsPerPage).

Set up the indices math, bind your disabled boolean attributes to the page boundaries, and let's see how your slider layout looks in your Vite sandbox!


 */





import React, { useState, useEffect, useMemo } from "react";


type InventoryItem = {
  id: number;
  name: string;
};

type InventoryItems = InventoryItem[];

const largeInventory :InventoryItems = [
  { id: 1, name: "Iron Ore" },
  { id: 2, name: "Copper Bar" },
  { id: 3, name: "Coal Chunk" },
  { id: 4, name: "Gold Nugget" },
  { id: 5, name: "Mithril Ingot" },
  { id: 6, name: "Ruby Gem" },
  { id: 7, name: "Dark Matter" },
  { id: 8, name: "Star Shard" }
];

export default function GeminiDailyChallenge10(): React.JSX.Element {

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Pagination Component</h1>
      <p>Implement the pagination component here!</p>
      <PaginationComponent inventory={largeInventory} />
    </div>
  );
}

interface PaginationProps {
  inventory: InventoryItems;
}


function PaginationComponent({ inventory}: PaginationProps): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(3);


  // recompute on inventory or itemsPerPage change
  const totalPages = useMemo(() => Math.ceil(inventory.length / itemsPerPage), [inventory, itemsPerPage]);

  // recompute on inventory, itemsPerPage, or currentPage change
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return inventory.slice(startIndex, endIndex);
  }, [inventory, itemsPerPage, currentPage]);

  // disabled recomputed
  const prevDisabled=useMemo(() => currentPage === 1, [currentPage]);
  const nextDisabled=useMemo(() => currentPage === totalPages, [currentPage, totalPages]);

  function handlePreviousClick() {
    setCurrentPage(prev => Math.max(prev - 1, 1)); // Ensure we don't go below page 1
  } // the setstate should trigger rerender

  function handleNextClick() {
    setCurrentPage(prev => Math.min(prev + 1, totalPages)); // Ensure we don't go above total pages
  } // the setstate should trigger rerender

  function handleItemsPerPageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    function isCurrentPageValidForNewItemsPerPage(newItemsPerPage: number): boolean {
      const newTotalPages = Math.ceil(inventory.length / newItemsPerPage);
      return currentPage <= newTotalPages;
    }

    function decidePageStayOrResetToNewLastPage(newItemsPerPage: number): number {
      const newTotalPages = Math.ceil(inventory.length / newItemsPerPage);
      if (currentPage > newTotalPages) {
        return newTotalPages; // reset to last valid page if current page is out of bounds for new items per page
      }
      return currentPage; // stay on current page if it's still valid
    }

    const newItemsPerPage = Number(e.target.value);
    if (!isCurrentPageValidForNewItemsPerPage(newItemsPerPage)) {
      setCurrentPage(decidePageStayOrResetToNewLastPage(newItemsPerPage));
    }
    setItemsPerPage(Number(e.target.value));
  }

  function openSelectorOnItemsPerPageLabelClick() {
    const selectElement:HTMLSelectElement|null = document.getElementById("itemsPerPage") as HTMLSelectElement;
    if (selectElement) {
      selectElement.focus();
      selectElement.showPicker?.(); // showPicker is supported in some browsers to open the dropdown programmatically
    }
  }


  return (
    <div>
      {/* Implement pagination logic and UI here */}
      <div className="inventory-list">
      </div>
      <div className="pagination-controls" style={{marginTop:"16px"}}>

        <button className="previousbutton" onClick={handlePreviousClick} disabled={prevDisabled}
          style={{
            marginRight:"8px",
            backgroundColor: prevDisabled ? "#ccc" : "#007bff",
            color: prevDisabled ? "#666" : "#fff",
            cursor: prevDisabled ? "not-allowed" : "pointer"
          }}>Previous</button>
        <button className="nextButton" onClick={handleNextClick} disabled={nextDisabled}
          style={{
            marginLeft:"8px",
            backgroundColor: nextDisabled ? "#ccc" : "#007bff",
            color: nextDisabled ? "#666" : "#fff",
            cursor: nextDisabled ? "not-allowed" : "pointer"
          }}>Next</button>
        <div className="pagesoftotalpages-display" style={{marginLeft:"16px", display:"inline-block"}}>Page {currentPage} of {totalPages}</div>
        <div className="itemsperpages-selector" style={{marginLeft:"32px", display:"inline-block"}}>
          <label htmlFor="itemsPerPage" style={{marginLeft:"16px"}} onClick={openSelectorOnItemsPerPageLabelClick}>Items per page:</label>
          <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} style={{marginLeft:"8px"}}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
        <div className="current-items-display" style={{marginTop:"16px"}}>
          <ul>
            {currentItems.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}



