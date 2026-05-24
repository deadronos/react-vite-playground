/*

🚀 Day 12: The Custom Modal Dialog (DOM Portals & Layout Overlays)
Let's look at a critical component structure used for user confirmations, profile settings panels, and detailed pop-ups across all professional web applications: The Modal Overlay.

This challenge introduces you to managing contextual screen layout layers, preventing body background scrolling, and handling outer focus dismissal windows.

The Goal:
Create an interface with an item list. Clicking a "View Details" button next to an item pops open a structural modal card directly over the screen, dimming everything else out behind it.

Requirements:

The Backdrop Overlay: Create a full-screen semi-transparent backdrop layer (position: fixed, inset zeros, and a dark background like rgba(0,0,0,0.5)).

The Modal Box: Center a styled card content panel directly on top of that backdrop containing structural elements: a title header, a close button ("❌"), and custom description body text.

Outer Click Dismissal: Clicking anywhere on the dimmed background backdrop outside of the modal card box must automatically close the modal. (Hint: Watch your event bubbling! Clicking inside the modal card shouldn't close it).

Scroll Lock (Advanced Edge): When the modal is currently open, prevent the user from scrolling the main website page behind it (hint: alter document.body.style.overflow). Ensure you clean this up when the modal closes!

💡 Hints to get you started:
Conditional Open State: Track whether the modal is open or closed using an active object state (e.g., const [activeItem, setActiveItem] = useState<Item | null>(null)). If it's not null, render the overlay!

Preventing Inner Click Bubbling: To stop clicks on the modal content box from leaking out into the backdrop and closing itself, use e.stopPropagation() inside the modal content box's click handler.

Populate a simple item card row group, structure your structural CSS overlay coordinates, and let's see how your overlay system pops in your Vite playground!

*/



import React, {useState,useEffect,useMemo} from "react";
import { createPortal } from "react-dom";

export default function GeminiDailyChallenge12(): React.JSX.Element {

  return (
    <div>
      <h2>Gemini Daily Challenge 12 - the custom modal dialog (DOM portals & layout overlays)</h2>
      <p>Click the "View Details" button to open the modal dialog.</p>
      {/* Your implementation of the modal dialog goes here */}
      <InterfaceContainerComponent Items={initialItems} />
    </div>
  );
}

const initialItems: Items = [
  {
    id: 1,
    title: "Example Item 1",
    description: "This is the description for Example Item 1. It provides more details about the item."
  },
  {
    id: 2,
    title: "Example Item 2",
    description: "This is the description for Example Item 2. It provides more details about the item."
  },
  {
    id: 3,
    title: "Example Item 3",
    description: "This is the description for Example Item 3. It provides more details about the item."
  }
];


interface InterfaceContainerComponentProps {
  // Define any props you need for the component here
  Items: Items;
}
interface Item {
  id: number;
  title: string;
  description: string;
}
type Items=Item[];

const exampleItem={
  id: 1,
  title: "Example Item",
  description: "This is an example item description for the modal dialog."
};

function InterfaceContainerComponent ({ Items }: InterfaceContainerComponentProps): React.JSX.Element {
  const [showModal, setShowModal] = useState(false);
  const [activeItem, setActiveItem] = useState<Item | null>(null);




  function handleViewDetailsClick(item: Item): void {
    // Implement the logic to open the modal dialog with the item details
      setActiveItem(item);
      setShowModal(true);
  }

  return (
    <div>
      {/* Render your item list and modal dialog here */}
      <div className="item-list">
        {Items && Items.length > 0 ? (
          Items.map((item) => (
            <ItemCardComponent key={item.id} item={item} onViewDetails={handleViewDetailsClick} />
          ))
        ) : (
          <p>No items available.</p>
        )}
        {showModal && activeItem && (createPortal(
          <ModalDialogComponent item={activeItem} onClose={() => setShowModal(false)} />,
          document.body))}
      </div>
    </div>
  );
}

interface ItemCardComponentProps {
  item: Item;
  onViewDetails: (item: Item) => void; // handler to trigger modal
}

function ItemCardComponent({item,onViewDetails}:ItemCardComponentProps): React.JSX.Element {

  return (
    <div>
      <h3>{item.title}</h3>
      <button onClick={() => onViewDetails(item)}>View Details</button>
    </div>
  );
}

interface ModalDialogComponentProps {
  item: Item;
  onClose: () => void;
}

function ModalDialogComponent({item,onClose}:ModalDialogComponentProps): React.JSX.Element {

  // Implement the modal dialog structure, backdrop, and scroll lock logic here
  function handleBackdropClick(): void {
    // Implement logic to close the modal when clicking on the backdrop
    console.log("Backdrop clicked, closing modal...");
    onClose();
  }

  function preventInnerClickPropagation(e: React.MouseEvent): void {
    // Implement logic to prevent clicks inside the modal from closing it
    e.stopPropagation();
  }

  function lockScroll(): void {
    // Implement logic to prevent background scrolling when the modal is open
    console.log("Locking scroll on modal open...");
    document.body.style.overflow = "hidden";
  }

  function unlockScroll(): void {
    // Implement logic to restore background scrolling when the modal is closed
    console.log("Unlocking scroll on modal close...");
    document.body.style.overflow = "";
  }

  useEffect(() => {
    // Lock scroll when the modal opens
    lockScroll();

    // Clean up by unlocking scroll when the modal closes
    return () => {
      unlockScroll();
    };

  }, []); // once on mount


  return (
    <div className="modal-component-backdrop" onClick={handleBackdropClick} style=
    {{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <div className="modal-component-content" onClick={preventInnerClickPropagation} style={{
        backgroundColor: "beige",
        padding: "24px",
        borderRadius: "8px",
        maxWidth: "400px",
        width: "100%",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
        color: "#133",
      }}>
        <div className="modal-component-content-title">Hi, I'm the modal dialog for {item.title}!</div>
        <div className="modal-component-content-description">{item.description}</div>
        <button className="modal-component-close-button" onClick={onClose} style={{
          marginTop: "16px",
          padding: "8px 16px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}>Close</button>
      </div>
    </div>
   );
}



