import React from "react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-gray-200 py-4 text-center">
      <p className="text-sm text-gray-600">
        Developed by{" "}
        <span className="font-medium">
          <Link href="https://github.com/Owen-Rose">Owen Rose</Link>
        </span>
        . Contact: <span className="font-medium">owenconnorrose@gmail.com</span>
      </p>
    </footer>
  );
}

export default Footer;
