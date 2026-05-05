
export default function CustomButton({ size, width, position, onClick, children, BGColor = "linear-gradient(95deg, #F6FFC0, #DFFF00, #DAF900)", Txtcolor = "black" }) {
  const styles = {
    background: BGColor,
    color: Txtcolor,
    border: "none",
    width: width,
    padding:
      size === "large"
        ? "16px 28px"
        : size === "small"
        ? "6px 12px"
        : "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    position: position ? "absolute" : "static",
    ...position,
    fontFamily: "'lexend', sans-serif",
    fontWeight: 300,
    fontSize: "20px"
    
  };
// example of use in src/Components/Sidebar.js: line 35-45

// size doesn't do much but it can be "small", "medium", or "large" for different padding
//width is a string like "200px" or "100%" 
// position is an object like { position: "fixed", bottom: "20px", left: "20px" } for absolute positioning, or you can omit it for static positioning
// onClick is a function that gets called when the button is clicked
// children is the content inside the button, like the text or any nested elements

  return (
    <button style={styles} onClick={onClick}>
      {children}
    </button>
  );
}

