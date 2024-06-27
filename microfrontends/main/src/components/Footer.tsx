import React from "react";
import type { RootState } from '../store';
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../counterSlice'
export default function Footer() {
const count = useSelector((state: RootState) => state.counter.value)
  return (
    <footer>
      <div
        className="text-center p-3"
      >
        © {count} Copyright:
        <a className="text-dark" href="https://mdbootstrap.com/">
          MDBootstrap.com
        </a>
      </div>
    </footer>
  );
}
