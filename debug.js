// QUICK DEBUG TEST
console.log("=== GAME DEBUG ===");
console.log("State:", state);
console.log("Firebase database:", database);
console.log("Canvas:", canvas);

// Test Firebase
if (database) {
    console.log("✅ Firebase initialized");
} else {
    console.error("❌ Firebase NOT initialized");
}

// Test drawing
if (canvas) {
    console.log("✅ Canvas found");
    console.log("Canvas size:", canvas.width, "x", canvas.height);
} else {
    console.error("❌ Canvas NOT found");
}

// Test room
console.log("Current room:", state.room || "NONE");
console.log("Is drawer:", state.isDrawer);
