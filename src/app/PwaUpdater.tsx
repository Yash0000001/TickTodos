'use client'; 

import { useEffect, useState } from "react";

declare global {
  interface Window {
    wb: {
      messageSkipWaiting(): void;
      register(): void;
      addEventListener(
        name: "controlling" | "waiting", 
        callback: () => void
      ): void;
    };
  }
}

const PwaUpdater = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onConfirmActivate = () => {
    window.wb?.messageSkipWaiting();
  };

  useEffect(() => {
    if (!("wb" in window)) return;

    window.wb.addEventListener("controlling", () => {
      window.location.reload();
    });

    window.wb.addEventListener("waiting", () => {
      setIsOpen(true);
    });

    window.wb.register();
  }, []);

  return isOpen ? (
    <div className="fixed bottom-4 right-4 p-4 bg-white border rounded shadow-lg">
      <div className="mb-2">
        Hey, a new version is available! Please click below to update.
      </div>
      <button 
        className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={onConfirmActivate}
      >
        Reload and update
      </button>
      <button 
        className="px-4 py-2 bg-gray-300 rounded"
        onClick={() => setIsOpen(false)}
      >
        Cancel
      </button>
    </div>
  ) : null;
};

export default PwaUpdater;
