import React, { useEffect } from "react";
import Marquee from "react-fast-marquee";
import { logout } from "../services/auth.service";
import { NavigateFunction, useNavigate } from 'react-router-dom';


type Props = {}

const Home: React.FC<Props> = () => {
    let navigate: NavigateFunction = useNavigate();

    useEffect( () => {
        const userStr = localStorage.getItem("user");
        console.log(userStr);
        if (!userStr){
            navigate("/login");
            window.location.reload();
        }
    }, []);
  
    const Logout=()=>{
        logout();
        navigate("/login");
        window.location.reload();
    }

    return (
        <div className="col-md-12 card card-container">
            <Marquee speed={50} style={{fontSize:'20px'}}>Wlecome to our page.</Marquee>
            <button type="submit" className="btn btn-primary btn-block logout" onClick={Logout}>
                <span>Logout</span>
            </button>
        </div>
    );
};

export default Home;