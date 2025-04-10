import React,{useState} from "react";
import { Link } from "react-router-dom";

const InboxMessage = ({ message: { text, time, icon }, id }) => {
   const [star, setStar] = useState(false);
   return (
      <div className="message">
         <div>
            <div className="d-flex message-single">
               <div className="pl-1 align-self-center">
                  <div className="form-check custom-checkbox">
                     <input
                        type="checkbox"
                        className="form-check-input"
                        id={`checkbox0${id}`}
                     />
                     <label
                        className="form-check-label"
                        htmlFor={`checkbox0${id}`}
                     ></label>
                  </div>
               </div>
               <div className="ms-2">
                  <button className="border-0 bg-transparent align-middle p-0">
                     <i 
                        className={`${icon} ${!star ? "" : "yellow" }`}
                        onClick={()=>setStar(!star)}
                     ></i>
                  </button>
               </div>
            </div>

            <Link to="/email-read" className="col-mail col-mail-2">
               <div className="subject">{text}</div>
               <div className="date">{time}</div>
            </Link>
         </div>
      </div>
   );
};

export default InboxMessage;
