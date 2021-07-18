import React from "react";
import "../../assets/spinnerCss.css";

interface SpinnerProps {
  className ?: string;
}

export const Spinner = React.memo((props : SpinnerProps) => {
  return (
    <div className={`lds-roller ${props.className}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
});

Spinner.displayName = "Spinner";

